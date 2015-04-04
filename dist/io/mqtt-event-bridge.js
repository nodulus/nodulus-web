System.register(["aurelia-event-aggregator", "paho"], function (_export) {
  var EventAggregator, Paho, _createClass, _classCallCheck, MQTT_SERVER_HOST, MQTT_SERVER_PORT, MQTT_CLIENT_ID, MQTTMessage, MQTTEventBridge;

  return {
    setters: [function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
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
      MQTTMessage = _export("MQTTMessage", function MQTTMessage(topic, payload) {
        var io = arguments[2] === undefined ? "outbound" : arguments[2];

        _classCallCheck(this, MQTTMessage);

        this.topic = topic;
        this.payload = payload;
        this.io = io;
      });

      MQTTEventBridge = (function () {
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
                // this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, this.clientId);
                this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, this.clientId);
                // handle mqtt disconnect
                this.client.onConnectionLost = this.onConnectionLost.bind(this);
                // handle message from mqtt
                this.client.onMessageArrived = this.onMessageInbound.bind(this);
              }

              console.log("connecting to client", this.client);
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
              } catch (e) {
                console.log("Already disconnected", e);
              }
            }
          },
          publish: {

            // send to mqtt

            value: function publish(message) {
              if (message.io !== "outbound") {
                console.log("not publishing", message);
                return;
              }

              console.log("publish to mqtt", message);

              var mqttMessage = new Paho.MQTT.Message(message.payload);
              mqttMessage.destinationName = message.topic;

              this.client.send(mqttMessage);
            }
          },
          subscribe: {

            // subscribe to new mqtt topic (filter?)

            value: function subscribe(topic, opts) {
              var dest = this.prefix + topic;

              // TODO: (IW) add unique subscriber sig to ensure the same caller for sub/unsub

              if (this.subscriptions[topic] || this.subscriptions[topic].status !== -1) {
                console.log("adding subscriber to topic", dest, topic, opts);
                ++this.subscriptions[topic].subscribers;
                return;
              }

              console.log("subscribing to mqtt topic", dest);

              this.subscriptions[topic] = { dest: dest, opts: opts, status: 0, subscribers: 0 };

              opts.invocationContext = { topic: topic };
              ops.onSuccess = this.onSubscribeSuccess.bind(this);
              ops.onFailure = this.onSubscribeFailure.bind(this);

              this.client.subscribe(dest, ops);
            }
          },
          unsubscribe: {
            value: function unsubscribe(topic, opts) {
              var dest = this.prefix + topic;

              console.log("unsubscribe from topic", dest, topic, opts);

              if (!this.subscriptions[topic] || this.subscriptions[topic].status === -1) {
                console.log("unsubscribing from zombie topic", topic, topics);
              }

              if (this.subscriptions[topic].subscribers > 1) {
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
              console.log("connected to mqtt", arguments);

              this.client.subscribe(this.prefix + "#");

              var message = new Paho.MQTT.Message("connected");
              message.destinationName = this.prefix + "status";
              this.client.send(message);
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
            value: function onMessageInbound(message) {
              var dest = message.destinationName,
                  payload = message.payloadString,
                  topic = dest.replace(this.prefixRe, "");

              console.log("received client message", dest, topic, payload);

              if (!Object.keys(this.subscriptions).indexOf(topic)) {
                console.log("message received on zombie topic", topic, payload, this.subscriptions);
                return;
              }

              // publish to app
              this.eventAggregator.publish(new MQTTMessage(topic, payload, "inbound"));
            }
          },
          onMessageOutbound: {
            value: function onMessageOutbound(message) {
              console.log("received app message", message, this);
              if (message.io === "outbound") this.publish(message.topic, message.payload);
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
      })();

      _export("default", MQTTEventBridge);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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