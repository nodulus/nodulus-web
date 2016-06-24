import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {connect} from 'mqtt/lib/connect';
import uuid from 'uuid';
import localforage from 'localforage';
import {MQTTConfig} from './mqtt-config';
import {MQTTMessage} from './mqtt-message';

// var MQTT_SERVER_URI = 'ws://mashtun.homebrew.lan:1884',
var MQTT_SERVER_HOST = 'mashtun.homebrew.lan';
var MQTT_SERVER_PORT = 1884;

var MQTT_CLIENT_ID = 'webapp';

@inject(EventAggregator)
export class MQTTEventBridge {
  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    this.options = new MQTTConfig();
    this.subscriptions = {};

    // listen for app events w/ MQTTMessage payload
    this.dispose = this.eventAggregator
      .subscribe(MQTTMessage, this.onMessageOutbound.bind(this));

    // todo: (iw) async/await this beast
    localforage.ready()
      .then(function() {
        return localforage.getItem('mqtt-event-bridge-uid')
          .then(function(uid) {
            return this.uid = uid;
          }.bind(this));
      }.bind(this))
      .then(function(cause) {
        if(!this.uid) {
          this.uid = uuid.v1();
          localforage.setItem('mqtt-event-bridge-uid', this.uid);
        }
        return this.uid;
      }.bind(this));
  }

  configure(callbackOrConfig) {
    this.isConfigured = true;

    if (typeof callbackOrConfig == 'function') {
      callbackOrConfig(this.options);
    } else if (MQTTConfig.isPrototypeOf(callbackOrConfig)) {
      this.options = callbackOrConfig;
    } else {
      this.options = new MQTTConfig(callbackOrConfig);
    }

    return this;
  }

  get clientID() {
    return this.options.clientID || MQTT_CLIENT_ID + '-' + this.uid;
  }

  // connect to mqtt
  connect() {
    if (this.client) {
      console.log('mqtt client already created');
      return;
    }

    console.log('creating mqtt client');

    this.client = connect(`ws://${this.options.hostname}:${this.options.port}`, {
      clientId: this.clientID
    });

    // handle mqtt disconnect
    this.client.on('connect', this.onConnect.bind(this));
    // handle messages from mqtt
    this.client.on('message', this.onMessageInbound.bind(this));

    console.log('connecting to mqtt host ' + this.options.hostname + ':' + this.options.port + ' as ' + this.clientID);
  }

  disconnect() {
    if (!this.client) {
      console.log('nothing to disconnect');
      return;
    }

    try {
      this.client.end(() => {
        this.subscriptions = {};
      });
      
    } catch (e) {
      console.log('connection ended poorly', e);
    }
  }

  // send to mqtt
  publish(message, opts = {}) {
    // don't re-publish inbound messages back to mqtt
    if (message.io === 'inbound') return;

    console.log('publish to mqtt', this.resolve(message.topic), message.payload, opts);
    this.client.publish(this.resolve(message.topic), message.payload, opts);
  }

  // subscribe to new mqtt topic (filter?)
  subscribe(topic, opts = {qos: 0}) {
    if (!topic) {
      console.error('topic required', topic);
      return;
    }

    var dest = this.resolve(topic);

    // TODO: (IW) add unique subscriber sig to ensure the same caller for sub/unsub
    // and allow multipls subscriptions to same topic w/ different sets of opts

    if (this.subscriptions[topic] && this.subscriptions[topic].status !== -1) {
      console.log('adding subscriber to topic', dest, topic, opts);
      ++this.subscriptions[topic].subscribers;
      return;
    }

    console.log('subscribing to mqtt topic', dest, opts);

    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = {dest: dest, opts: opts, status: 0, subscribers: 0};
    } else {
      this.subscriptions[topic].opts = opts;
      this.subscriptions[topic].status = 0;
    }

    opts.onSuccess = this.onSubscribeSuccess.bind(this);
    opts.onFailure = this.onSubscribeFailure.bind(this);

    // mqtt subscribe request
    this.client.subscribe(dest, opts, opts.cb);
  }

  unsubscribe(topic, opts = {}) {
    if (!topic) {
      console.error('topic required', topic);
      return;
    }

    var dest = this.resolve(topic);

    console.log('unsubscribing from topic', dest, topic, opts);

    if (!this.subscriptions[topic]) {
        console.log('nothing to unsubscribe', topic);
    } else if (this.subscriptions[topic].status === -1) {
      console.log('unsubscribing from zombie topic', this.subscriptions[topic], topic, opts);
    }

    if (this.subscriptions[topic].subscribers > 1) {
      --this.subscriptions[topic].subscribers;
      console.log('remaining subscribers', this.subscriptions[topic].subscribers, topic);
      return;
    }

    console.log('unsubscribing from topic', topic);

    opts.onSuccess = this.onUnsubscribeSuccess.bind(this);
    opts.onFailure = this.onUnsubscribeFailure.bind(this);
    
    // unsubscribe from mqtt topic
    this.client.unsubscribe(dest, opts.cb);
  }

  destroy() {
    this.disconnect();
    this.dispose();
  }

  // ------------------------------------------------------------------- Helpers

  resolve(topic) {
    return (topic.charAt(0) === '/') ?
      topic.slice(1) :
      this.prefixer(topic.replace(/^\.(\/)?/, ''));
  }

  prefixer(topic) {
    if (!this.options.prefix) return topic;
    return [this.options.prefix, topic].join('/');
  }

  unprefixer(topic) {
    var re = new RegExp('^(/)?' + this.options.prefix, 'i');
    return topic.replace(re, '');
  }

  // ------------------------------------------------------------------ Handlers

  onConnect() {
    console.info('connected to mqtt', this.clientID);

    // listen for all messages under this.prefix
    // if(this.options.prefix) this.client.subscribe(this.resolve('#'));

    // Send connected event to the app
    this.eventAggregator.publish('mqtt-event-bridge', 'connected');
    // Send connected message up to mqtt
    this.publish(new MQTTMessage(`/broadcast/client/${this.clientID}`, 'connect'));
  }

  onError() {
    console.error('mqtt client error', arguments);
  }

  onClose(res) {
    console.warn('connection lost', arguments);

    if (res.errorCode !== 0) {
      console.error('onClose', res);
    }
  }

  onSubscribeSuccess(res) {
    if (res.invocationContext) {
      this.subscriptions[res.invocationContext.topic].status = 1;
    }
  }

  onSubscribeFailure(res) {
    console.error('subscribe failure', arguments);
  }

  onUnsubscribeSuccess(res) {
    if (res.invocationContext) {
      this.subscriptions[res.invocationContext.topic].status = -1;
    }
  }

  onUnsubscribeFailure(res) {
    console.error('unsubscribe failure', arguments);
  }

  // mqtt -> app
  onMessageInbound(dest, payload, packet) {
    const message = payload.toString(),
      topic = this.unprefixer(dest);

    console.info('received client message', topic, message, packet);

    // if(Object.keys(this.subscriptions).indexOf(topic) === -1) {
    //   console.warn('message received on zombie topic', topic, payload, this.subscriptions);
    // }

    // publish to app
    this.eventAggregator.publish(new MQTTMessage(topic, message, 'inbound'));
  }

  // app -> mqtt
  onMessageOutbound(message) {
    console.info('received app message', message);
    
    // publish to mqtt
    this.publish(message);
  }
}
