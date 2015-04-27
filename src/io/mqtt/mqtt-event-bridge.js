import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import Paho from 'paho';
import uuid from 'uuid';
import localforage from 'localforage';
import {MQTTConfig} from './mqtt-config';
import {MQTTMessage} from './mqtt-message';

// var MQTT_SERVER_URI = 'ws://mashtun.homebrew.lan:1884',
var MQTT_SERVER_HOST = 'mashtun.homebrew.lan';
var MQTT_SERVER_PORT = 1884;

var MQTT_CLIENT_ID = 'mqtt_event_bridge';

@inject(EventAggregator)
export class MQTTEventBridge {
  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    this.options = new MQTTConfig();
    this.subscriptions = {};

    // listen for app events w/ MQTTMessage payload
    this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));

    // todo: (iw) this is some gnarly code just to get at localstorage
    function *loadUID(next) {
      var uid;

      try {
        yield localforage.ready();
        uid = yield localforage.getItem('mqtt-event-bridge-uid');
        if (!uid) {
          uid = uuid.v1();
          localforage.setItem('mqtt-event-bridge-uid', uid);
        }
      } catch (e) {
        console.error('failed to init localforage', e);
      }

      yield next;
    };

    this.uid = loadUID();
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
    console.log('client id', this.options.clientID, MQTT_CLIENT_ID, this.uid);
    return this.options.clientID || MQTT_CLIENT_ID + this.uid;
  }

  // connect to mqtt
  connect() {
    if (!this.client) {
      console.log('creating mqtt client');

      this.client = new Paho.MQTT.Client(this.options.hostname, this.options.port, this.clientID);
      // handle mqtt disconnect
      this.client.onConnectionLost = this.onConnectionLost.bind(this);
      // handle messages from mqtt
      this.client.onMessageArrived = this.onMessageInbound.bind(this);
    }

    console.log('connecting to mqtt');

    try {
      var connection = this.client.connect({
        onSuccess: this.onConnectSuccess.bind(this),
        onFailure: this.onConnectFailed.bind(this)
      });
    } catch (e) {
      console.log('failed to connect', e);
    }
  }

  disconnect() {
    if (!this.client) {
      console.log('nothing to disconnect');
      return;
    }

    try {
      this.client.disconnect();
      this.subscriptions = {};
    } catch (e) {
      console.log('already disconnected', e);
    }
  }

  // send to mqtt
  publish(message, opts = {}) {
    // don't re-publish inbound messages back to mqtt
    if (message.io === 'inbound') return;

    var mqttMessage = new Paho.MQTT.Message(message.payload);
    mqttMessage.destinationName = this.resolve(message.topic);

    if (opts.qos) mqttMessage.qos = opts.qos;
    if (opts.retained) mqttMessage.retained = opts.retained;

    console.log('publish to mqtt', mqttMessage, message, opts);
    this.client.send(mqttMessage);
  }

  // subscribe to new mqtt topic (filter?)
  subscribe(topic, opts = {}) {
    if (!topic) {
      console.warn('empty topic', topic);
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

    opts.invocationContext = {topic: topic};
    opts.onSuccess = this.onSubscribeSuccess.bind(this);
    opts.onFailure = this.onSubscribeFailure.bind(this);

    // mqtt subscribe request
    this.client.subscribe(dest, opts);
  }

  unsubscribe(topic, opts = {}) {
    if (!topic) {
      console.warn('empty topic', topic);
      return;
    }

    var dest = this.resolve(topic);

    console.log('unsubscribe from topic', dest, topic, opts);

    if (!this.subscriptions[topic] || this.subscriptions[topic].status === -1) {
      if (!this.subscriptions[topic]) {
        console.log('nothing to unsubscribe', topic);
      }
      console.log('unsubscribing from zombie topic', this.subscriptions[topic], topic, opts);
    }

    if (this.subscriptions[topic].subscribers > 1) {
      console.log('still more subscribers', this.subscriptions[topic].subscribers, topic);
      --this.subscriptions[topic].subscribers;
      return;
    }

    console.log('unsubscribing from empty mqtt topic', topic);

    opts.invocationContext = {topic: topic};
    opts.onSuccess = this.onUnsubscribeSuccess.bind(this);
    opts.onFailure = this.onUnsubscribeFailure.bind(this);
    
    // unsubscribe from mqtt topic
    this.client.unsubscribe(dest, opts);
  }

  destroy() {
    this.disconnect(); // this.client.disconnect();
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

  onConnectSuccess() {
    console.info('connected to mqtt', this.clientID);

    // listen for all messages under this.prefix
    // if(this.options.prefix) this.client.subscribe(this.resolve('#'));

    // Send connected event to the app
    this.eventAggregator.publish('mqtt-event-bridge', 'connected');
    // Send connected message up to mqtt
    this.publish(new MQTTMessage('/broadcast/client/' + this.clientID, 'connect'));
  }

  onConnectFailed() {
    console.error('failed to connect to mqtt', arguments);    
  }

  onConnectionLost(res) {
    console.warn('connection lost', arguments);

    if (res.errorCode !== 0) {
      console.error('onConnectionLost', res);
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
  onMessageInbound(message) {
    var dest = message.destinationName,
      payload = message.payloadString,
      topic = this.unprefixer(dest);

    console.info('received client message', dest, topic, payload, message);

    // if(Object.keys(this.subscriptions).indexOf(topic) === -1) {
    //   console.warn('message received on zombie topic', topic, payload, this.subscriptions);
    // }

    // publish to app
    this.eventAggregator.publish(new MQTTMessage(message, topic));
  }

  // app -> mqtt
  onMessageOutbound(message) {
    console.info('received app message', message);
    
    // publish to mqtt
    this.publish(message);
  }
}
