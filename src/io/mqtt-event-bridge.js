import {EventAggregator} from 'aurelia-event-aggregator';
import Paho from 'paho';

// var MQTT_SERVER_URI = 'ws://mashtun.homebrew.lan:1884',
var MQTT_SERVER_HOST = 'mashtun.homebrew.lan';
var MQTT_SERVER_PORT = 1884;

var MQTT_CLIENT_ID = 'aurelia_bridge';

export class MQTTMessage {
  constructor(topic, payload, io = 'outbound') {
    this.topic = topic;
    this.payload = payload;
    this.io = io;
  }
}

export default class MQTTEventBridge {
  static inject(){ return [EventAggregator]; }

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    this.clientId = 'bahn_commander';
    this.prefix = 'bahn.io/commander/';
    this.prefixRe = new RegExp('^' + this.prefix, 'i');

    this.subscriptions = {};

    // handle MQTTMessage from app
    this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));
    this.connect();
  }

  // connect to mqtt
  connect() {
    if (!this.client) {
      console.log('creating client');
      // this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, this.clientId);
      this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, this.clientId);
      // handle mqtt disconnect
      this.client.onConnectionLost = this.onConnectionLost.bind(this);
      // handle message from mqtt
      this.client.onMessageArrived = this.onMessageInbound.bind(this);
    }

    console.log('connecting to client', this.client);
    try {
      this.client.connect({
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
    } catch (e) {
      console.log('Already disconnected', e);
    }
  }

  // send to mqtt
  publish(message) {
    if (message.io !== 'outbound') {
      console.log('not publishing', message);
      return;
    }

    console.log('publish to mqtt', message);

    var mqttMessage = new Paho.MQTT.Message(message.payload);
    mqttMessage.destinationName = message.topic;

    this.client.send(mqttMessage);
  }

  // subscribe to new mqtt topic (filter?)
  subscribe(topic, opts) {
    var dest = this.prefix + topic;

    // TODO: (IW) add unique subscriber sig to ensure the same caller for sub/unsub

    if (this.subscriptions[topic] || this.subscriptions[topic].status !== -1) {
      console.log('adding subscriber to topic', dest, topic, opts);
      ++this.subscriptions[topic].subscribers;
      return;
    }

    console.log('subscribing to mqtt topic', dest);

    this.subscriptions[topic] = {dest: dest, opts: opts, status: 0, subscribers: 0};

    opts.invocationContext = {topic: topic};
    ops.onSuccess = this.onSubscribeSuccess.bind(this);
    ops.onFailure = this.onSubscribeFailure.bind(this);

    this.client.subscribe(dest, ops);
  }

  unsubscribe(topic, opts) {
    var dest = this.prefix + topic;

    console.log('unsubscribe from topic', dest, topic, opts);

    if (!this.subscriptions[topic] || this.subscriptions[topic].status === -1) {
      console.log('unsubscribing from zombie topic', topic, topics);
    }

    if (this.subscriptions[topic].subscribers > 1) {
      --this.subscriptions[topic].subscribers;
      return;
    }

    console.log('unsubscribing from empty mqtt topic', topic);

    opts.invocationContext = {topic: topic};
    ops.onSuccess = this.onUnsubscribeSuccess.bind(this);
    ops.onFailure = this.onUnsubscribeFailure.bind(this);
    
    // unsubscribe from mqtt topic
    this.client.unsubscribe(dest, opts);
  }

  destroy() {
    this.disconnect(); // this.client.disconnect();
    this.dispose();
  }

  // ------------------------------------------------------------------ Handlers

  onConnectSuccess() {
    console.log('connected to mqtt', arguments);

    this.client.subscribe(this.prefix + '#');

    var message = new Paho.MQTT.Message("connected");
    message.destinationName = this.prefix + 'status';
    this.client.send(message);
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

  onMessageInbound(message) {
    var dest = message.destinationName,
      payload = message.payloadString,
      topic = dest.replace(this.prefixRe, '');

    console.log('received client message', dest, topic, payload);

    if(!Object.keys(this.subscriptions).indexOf(topic)) {
      console.log('message received on zombie topic', topic, payload, this.subscriptions);
      return;
    }

    // publish to app
    this.eventAggregator.publish(new MQTTMessage(topic, payload, 'inbound'));
  }

  onMessageOutbound(message) {
    console.log('received app message', message, this);
    if(message.io === 'outbound') this.publish(message.topic, message.payload);
  }
}
