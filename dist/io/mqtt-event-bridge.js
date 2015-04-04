System.register(["aurelia-event-aggregator", "bahn-commander/io/mqtt-message", "paho"], function (_export) {
  var EventAggregator, MQTTMessage, Paho, _createClass, _classCallCheck, MQTT_SERVER_HOST, MQTT_SERVER_PORT, MQTT_CLIENT_ID, MQTTEventBridge;

  return {
    setters: [function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_bahnCommanderIoMqttMessage) {
      MQTTMessage = _bahnCommanderIoMqttMessage.MQTTMessage;
    }, function (_paho) {
      Paho = _paho["default"];
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      // var MQTT_SERVER_URI = 'ws://mashtun.homebrew.lan:1884',
      MQTT_SERVER_HOST = "mashtun.homebrew.lan";
      MQTT_SERVER_PORT = 1884;
      MQTT_CLIENT_ID = "aurelia_bridge";
      MQTTEventBridge = _export("MQTTEventBridge", (function () {
        function MQTTEventBridge(eventAggregator) {
          _classCallCheck(this, MQTTEventBridge);

          this.eventAggregator = eventAggregator;

          this.clientId = "bahn_commander";
          this.prefix = "bahn.io/commander/";
          this.prefixRe = new RegExp("^" + this.prefix, "i");

          this.subscriptions = {};

          // handle MQTTMessage from app
          this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));
          this.connect();
        }

        _createClass(MQTTEventBridge, {
          connect: {

            // connect to mqtt

            value: function connect() {
              if (!this.client) {
                console.log("creating client");

                this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, this.clientId);
                // handle mqtt disconnect
                this.client.onConnectionLost = this.onConnectionLost.bind(this);
                // handle messages from mqtt
                this.client.onMessageArrived = this.onMessageInbound.bind(this);
              }

              console.log("connecting to mqtt");

              try {
                this.client.connect({
                  onSuccess: this.onConnectSuccess.bind(this),
                  onFailure: this.onConnectFailed.bind(this)
                });
              } catch (e) {
                console.log("Failed to connect", e);
              }
            }
          },
          disconnect: {
            value: function disconnect() {
              if (!this.client) {
                console.log("Nothing to disconnect");
                return;
              }

              try {
                this.client.disconnect();
                this.subscriptions = {};
              } catch (e) {
                console.log("Already disconnected", e);
              }
            }
          },
          publish: {

            // send to mqtt

            value: function publish(message) {
              var opts = arguments[1] === undefined ? {} : arguments[1];

              if (message.io !== "outbound") {
                console.log("not publishing", message.io, message);
                return;
              }

              var mqttMessage = new Paho.MQTT.Message(message.payload);
              mqttMessage.destinationName = this.prefix + message.topic;

              if (opts.qos) mqttMessage.qos = opts.qos;
              if (opts.retained) mqttMessage.retained = opts.retained;

              console.log("publish to mqtt", mqttMessage, message, opts);
              this.client.send(mqttMessage);
            }
          },
          subscribe: {

            // subscribe to new mqtt topic (filter?)

            value: function subscribe(topic, opts) {
              var dest = this.prefix + topic;

              // TODO: (IW) add unique subscriber sig to ensure the same caller for sub/unsub
              // and allow multipls subscriptions to same topic w/ different sets of opts

              if (this.subscriptions[topic] && this.subscriptions[topic].status !== -1) {
                console.log("adding subscriber to topic", dest, topic, opts);
                ++this.subscriptions[topic].subscribers;
                return;
              }

              console.log("subscribing to mqtt topic", dest);

              if (!this.subscriptions[topic]) {
                this.subscriptions[topic] = { dest: dest, opts: opts, status: 0, subscribers: 0 };
              } else {
                this.subscriptions[topic].opts = opts;
                this.subscriptions[topic].status = 0;
              }

              opts.invocationContext = { topic: topic };
              ops.onSuccess = this.onSubscribeSuccess.bind(this);
              ops.onFailure = this.onSubscribeFailure.bind(this);

              // mqtt subscribe request
              this.client.subscribe(dest, ops);
            }
          },
          unsubscribe: {
            value: function unsubscribe(topic, opts) {
              var dest = this.prefix + topic;

              console.log("unsubscribe from topic", dest, topic, opts);

              if (!this.subscriptions[topic] || this.subscriptions[topic].status === -1) {
                if (!this.subscriptions[topic]) {
                  console.log("nothing to unsubscribe", topic);
                }
                console.log("unsubscribing from zombie topic", this.subscriptions[topic], topic, opts);
              }

              if (this.subscriptions[topic].subscribers > 1) {
                console.log("still more subscribers", this.subscriptions[topic].subscribers, topic);
                --this.subscriptions[topic].subscribers;
                return;
              }

              console.log("unsubscribing from empty mqtt topic", topic);

              opts.invocationContext = { topic: topic };
              ops.onSuccess = this.onUnsubscribeSuccess.bind(this);
              ops.onFailure = this.onUnsubscribeFailure.bind(this);

              // unsubscribe from mqtt topic
              this.client.unsubscribe(dest, opts);
            }
          },
          destroy: {
            value: function destroy() {
              this.disconnect(); // this.client.disconnect();
              this.dispose();
            }
          },
          onConnectSuccess: {

            // ------------------------------------------------------------------ Handlers

            value: function onConnectSuccess() {
              console.log("connected to mqtt");

              this.client.subscribe(this.prefix + "#");

              // var message = new Paho.MQTT.Message("connected");
              // message.destinationName = this.prefix + 'status';
              // this.client.send(message);
              this.publish(new MQTTMessage("status", "connected"));
            }
          },
          onConnectFailed: {
            value: function onConnectFailed() {
              console.log("failed to connect to mqtt", arguments);
            }
          },
          onConnectionLost: {
            value: function onConnectionLost(res) {
              console.log("connection lost", arguments);

              if (res.errorCode !== 0) {
                console.log("onConnectionLost", res);
              }
            }
          },
          onSubscribeSuccess: {
            value: function onSubscribeSuccess(res) {
              console.log("subscribe success", arguments);
              if (res.invocationContext) {
                this.subscriptions[res.invocationContext.topic].status = 1;
              }
            }
          },
          onSubscribeFailure: {
            value: function onSubscribeFailure(res) {
              console.log("subscribe failure", arguments);
            }
          },
          onUnsubscribeSuccess: {
            value: function onUnsubscribeSuccess(res) {
              console.log("unsubscribe success", arguments);
              if (res.invocationContext) {
                this.subscriptions[res.invocationContext.topic].status = -1;
              }
            }
          },
          onUnsubscribeFailure: {
            value: function onUnsubscribeFailure(res) {
              console.log("unsubscribe failure", arguments);
            }
          },
          onMessageInbound: {

            // mqtt -> app

            value: function onMessageInbound(message) {
              var dest = message.destinationName,
                  payload = message.payloadString,
                  topic = dest.replace(this.prefixRe, "");

              console.log("received client message", dest, topic, payload);

              if (Object.keys(this.subscriptions).indexOf(topic) === -1) {
                console.log("message received on zombie topic", topic, payload, this.subscriptions);
              }

              // publish to app
              this.eventAggregator.publish(new MQTTMessage(message, topic));
            }
          },
          onMessageOutbound: {

            // app -> mqtt

            value: function onMessageOutbound(message) {
              console.log("received app message", message);
              // publish to mqtt
              if (message.io === "outbound") this.publish(message);
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [EventAggregator];
            }
          }
        });

        return MQTTEventBridge;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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b0I7bUJBQUEsOEJBQUMsR0FBRyxFQUFFO0FBQ3hCLHFCQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLGtCQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QixvQkFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2VBQzdEO2FBQ0Y7O0FBRUQsOEJBQW9CO21CQUFBLDhCQUFDLEdBQUcsRUFBRTtBQUN4QixxQkFBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMvQzs7QUFHRCwwQkFBZ0I7Ozs7bUJBQUEsMEJBQUMsT0FBTyxFQUFFO0FBQ3hCLGtCQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZTtrQkFDaEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhO2tCQUMvQixLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUUxQyxxQkFBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU3RCxrQkFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDeEQsdUJBQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7ZUFDckY7OztBQUdELGtCQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUMvRDs7QUFHRCwyQkFBaUI7Ozs7bUJBQUEsMkJBQUMsT0FBTyxFQUFFO0FBQ3pCLHFCQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU3QyxrQkFBRyxPQUFPLENBQUMsRUFBRSxLQUFLLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3JEOzs7QUExTU0sZ0JBQU07bUJBQUEsa0JBQUU7QUFBRSxxQkFBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQUU7Ozs7ZUFEakMsZUFBZSIsImZpbGUiOiJpby9tcXR0LWV2ZW50LWJyaWRnZS5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==