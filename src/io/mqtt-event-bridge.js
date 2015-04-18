import {EventAggregator} from 'aurelia-event-aggregator';
import {MQTTMessage} from 'bahn-commander/io/mqtt-message';
import Paho from 'paho';
import uuid from 'node-uuid';
import localforage from 'localforage';

// var MQTT_SERVER_URI = 'ws://mashtun.homebrew.lan:1884',
var MQTT_SERVER_HOST = 'mashtun.homebrew.lan';
var MQTT_SERVER_PORT = 1884;

var MQTT_CLIENT_ID = 'mqtt_event_bridge';

export class MQTTEventBridge {
  static inject(){ return [EventAggregator]; }

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    this.prefix = 'bahn.io/commander/';
    this.prefixRe = new RegExp('^(/)?' + this.prefix, 'i');

    this.subscriptions = {};

    // todo: (iw) this is some gnarly async just to get at localstorage
    localforage.ready().then(() => {
      localforage.getItem('mqtt-event-bridge-uid').then((uid) => {
        if (!uid) {
          uid = uuid.v1();
          localforage.setItem('mqtt-event-bridge-uid', uid);
        }

        this.uid = uid;
        this.clientId = MQTT_CLIENT_ID + '-' + this.uid;

        this.connect();
      });
    });

    // handle MQTTMessage from app
    this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));
  }

  // connect to mqtt
  connect() {
    if (!this.client) {
      console.log('creating client');

      this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, this.clientId);
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
      console.log('Failed to connect', e);
    }
  }

  disconnect() {
    if (!this.client) {
      console.log('Nothing to disconnect');
      return;
    }

    try {
      this.client.disconnect();
      this.subscriptions = {};
    } catch (e) {
      console.log('Already disconnected', e);
    }
  }

  // send to mqtt
  publish(message, opts = {}) {
    if (message.io !== 'outbound') {
      console.log('not publishing', message.io, message);
      return;
    }

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
      console.log('Invalid topic', topic);
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
      console.log('Invalid topic', topic);
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
    return (topic.charAt(0) === '/') ? topic.slice(1) : this.prefix + topic.replace(/^\.(\/)?/, '');
  }

  // ------------------------------------------------------------------ Handlers

  onConnectSuccess() {
    console.log('connected to mqtt');

    // listen for all messages under this.prefix
    this.client.subscribe(this.resolve('#'));

    this.eventAggregator.publish('mqtt-event-bridge', 'connected');
    this.publish(new MQTTMessage('/broadcast/client/' + this.clientId, 'connect'));
  }

  onConnectFailed() {
    console.log('failed to connect to mqtt', arguments);    
  }

  onConnectionLost(res) {
    console.log('connection lost', arguments);

    if (res.errorCode !== 0) {
      console.log('onConnectionLost', res);
    }
  }

  onSubscribeSuccess(res) {
    console.log('subscribe success', arguments);
    if (res.invocationContext) {
      this.subscriptions[res.invocationContext.topic].status = 1;
    }
  }

  onSubscribeFailure(res) {
    console.log('subscribe failure', arguments);
  }

  onUnsubscribeSuccess(res) {
    console.log('unsubscribe success', arguments);
    if (res.invocationContext) {
      this.subscriptions[res.invocationContext.topic].status = -1;
    }
  }

  onUnsubscribeFailure(res) {
    console.log('unsubscribe failure', arguments);
  }

  // mqtt -> app
  onMessageInbound(message) {
    var dest = message.destinationName,
      payload = message.payloadString,
      topic = dest.replace(this.prefixRe, '');

    console.log('received client message', dest, topic, payload);

    if(Object.keys(this.subscriptions).indexOf(topic) === -1) {
      console.log('message received on zombie topic', topic, payload, this.subscriptions);
    }

    // publish to app
    this.eventAggregator.publish(new MQTTMessage(message, topic));
  }

  // app -> mqtt
  onMessageOutbound(message) {
    console.log('received app message', message);
    // publish to mqtt
    this.publish(message);
  }
}
