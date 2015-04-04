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
          this.prefixRe = new RegExp("^(/)?" + this.prefix, "i");

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
                var connection = this.client.connect({
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
              mqttMessage.destinationName = this.resolve(message.topic);

              if (opts.qos) mqttMessage.qos = opts.qos;
              if (opts.retained) mqttMessage.retained = opts.retained;

              console.log("publish to mqtt", mqttMessage, message, opts);
              this.client.send(mqttMessage);
            }
          },
          subscribe: {

            // subscribe to new mqtt topic (filter?)

            value: function subscribe(topic) {
              var opts = arguments[1] === undefined ? {} : arguments[1];

              if (!topic) {
                console.log("Invalid topic", topic);
              }

              var dest = this.resolve(topic);

              // TODO: (IW) add unique subscriber sig to ensure the same caller for sub/unsub
              // and allow multipls subscriptions to same topic w/ different sets of opts

              if (this.subscriptions[topic] && this.subscriptions[topic].status !== -1) {
                console.log("adding subscriber to topic", dest, topic, opts);
                ++this.subscriptions[topic].subscribers;
                return;
              }

              console.log("subscribing to mqtt topic", dest, opts);

              if (!this.subscriptions[topic]) {
                this.subscriptions[topic] = { dest: dest, opts: opts, status: 0, subscribers: 0 };
              } else {
                this.subscriptions[topic].opts = opts;
                this.subscriptions[topic].status = 0;
              }

              opts.invocationContext = { topic: topic };
              opts.onSuccess = this.onSubscribeSuccess.bind(this);
              opts.onFailure = this.onSubscribeFailure.bind(this);

              // mqtt subscribe request
              this.client.subscribe(dest, opts);
            }
          },
          unsubscribe: {
            value: function unsubscribe(topic) {
              var opts = arguments[1] === undefined ? {} : arguments[1];

              if (!topic) {
                console.log("Invalid topic", topic);
              }

              var dest = this.resolve(topic);

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
              opts.onSuccess = this.onUnsubscribeSuccess.bind(this);
              opts.onFailure = this.onUnsubscribeFailure.bind(this);

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
          resolve: {

            // ------------------------------------------------------------------- Helpers

            value: function resolve(topic) {
              return topic.charAt(0) === "/" ? topic.slice(1) : this.prefix + topic.replace(/^\.(\/)?/, "");
            }
          },
          onConnectSuccess: {

            // ------------------------------------------------------------------ Handlers

            value: function onConnectSuccess() {
              console.log("connected to mqtt");

              // listen for all messages under this.prefix
              this.client.subscribe(this.resolve("#"));

              this.eventAggregator.publish("mqtt-event-bridge", "connected");
              this.publish(new MQTTMessage("/broadcast/client/" + this.clientId, "connect"));
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
              this.publish(message);
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
//# sourceMappingURL=data:application/json;base64,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