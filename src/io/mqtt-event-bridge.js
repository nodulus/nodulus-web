import {EventAggregator} from 'aurelia-event-aggregator';
import Paho from 'paho';

// var MQTT_SERVER_URI = 'ws://mashtun.homebrew.lan:1884',
var MQTT_SERVER_HOST = 'mashtun.homebrew.lan';
var MQTT_SERVER_PORT = 1884;

export class MQTTMessage {
  constructor(topic, payload) {
    this.topic = topic;
    this.payload = payload;
  }
}

export default class MQTTEventBridge {
  static inject(){ return [EventAggregator]; }

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.subscriptions = {};

    this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, "bahn_commander");

    // handle mqtt disconnect
    this.client.onConnectionLost = (res) => {
      console.log('connection lost', arguments);
      if (res.errorCode !== 0) {
        console.log("onConnectionLost:" + res.errorMessage);
      }
    };

    // handle message from mqtt
    this.client.onMessageArrived = (message) => {
      var topic = message.destinationName,
        payload = message.payloadString;

      console.log('received client message', topic, payload, message);

      if(!Object.keys(this.subscriptions).indexOf(topic)) {
        console.log('message received on zombie topic', topic, payload, this.subscriptions);
      }

      // publish to app
      // this.eventAggregator.publish(new MQTTMessage(topic, payload));
    };

    // connect to mqtt
    var client = this.client;
    this.client.connect({
      onSuccess: () => {
        console.log('connected to mqtt', arguments);

        this.client.subscribe('/bahn-mqtt');

        var message = new Paho.MQTT.Message("Hello");
        message.destinationName = "/bahn-mqtt";
        client.send(message);
      }
    });

    // handle MQTTMessage from app
    this._dispose = this.eventAggregator.subscribe(MQTTMessage, message => {
      console.log('received app message', message);

      //this.publish(message.topic, message.payload);
    });
  }

  // send MQTTMessage to mqtt
  publish(message) {
    console.log('publish to client', message);
    this.client.publish(message.topic, message.payload);
  }

  // subscribe to new mqtt topic
  subscribe(topic) {
    console.log('subscribe to topic', topic);

    if (!this.subscriptions[topic] || this.subscriptions[topic].qos === -1) {
      console.log('subscribing to new mqtt topic', topic);

      this.subscriptions[topic] = {qos: -1, subscribers: 0};

      this.client.subscribe('topic', (err, granted) => {
        if (err) {
          console.log('error subscribing to topic', topic, err);
          return;
        }

        granted.forEach((topic, qos) => {
          console.log('granted subscription', topic, qos);
          if (this.subscriptions[topic]) {
            console.log('replacing existing subscription', topic, qos, this.subscriptions[topic]);
          }
          ++this.subscriptions[topic][subscribers];
        });
      });
    }
  }

  unsubscribe(topic) {
    console.log('unsubscribe from topic', topic);

    if (!this.subscriptions[topic] || this.subscriptions[topic].qos === -1) {
      console.log('unsubscribing from zombie topic', topic, topics);
    }

    if (this.subscriptions[topic][subscribers] > 1) {
      --this.subscriptions[topic][subscribers];
      return;
    }

    console.log('unsubscribing empty mqtt topic', topic);
    
    // unsubscribe from mqtt topic
    this.client.unsubscribe('topic', (err, granted) => {
      console.log('unsubscribe response', arguments);
      delete this.subscriptions[topic];
    });
  }

  dispose() {
    this.client.end();
    this._dispose();
  }
}
