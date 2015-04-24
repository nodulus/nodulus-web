System.register(["aurelia-event-aggregator", "bahn-commander/io/mqtt-message", "paho", "node-uuid", "localforage"], function (_export) {
  var EventAggregator, MQTTMessage, Paho, uuid, localforage, _createClass, _classCallCheck, MQTT_SERVER_HOST, MQTT_SERVER_PORT, MQTT_CLIENT_ID, MQTTEventBridge;

  return {
    setters: [function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_bahnCommanderIoMqttMessage) {
      MQTTMessage = _bahnCommanderIoMqttMessage.MQTTMessage;
    }, function (_paho) {
      Paho = _paho["default"];
    }, function (_nodeUuid) {
      uuid = _nodeUuid["default"];
    }, function (_localforage) {
      localforage = _localforage["default"];
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      // var MQTT_SERVER_URI = 'ws://mashtun.homebrew.lan:1884',
      MQTT_SERVER_HOST = "mashtun.homebrew.lan";
      MQTT_SERVER_PORT = 1884;
      MQTT_CLIENT_ID = "mqtt_event_bridge";
      MQTTEventBridge = _export("MQTTEventBridge", (function () {
        function MQTTEventBridge(eventAggregator) {
          var _this = this;

          _classCallCheck(this, MQTTEventBridge);

          this.eventAggregator = eventAggregator;

          this.prefix = "";
          this.prefixRe = new RegExp("^(/)?" + this.prefix, "i");

          this.subscriptions = {};

          // todo: (iw) this is some gnarly async just to get at localstorage
          localforage.ready().then(function () {
            localforage.getItem("mqtt-event-bridge-uid").then(function (uid) {
              if (!uid) {
                uid = uuid.v1();
                localforage.setItem("mqtt-event-bridge-uid", uid);
              }

              _this.uid = uid;
              _this.clientId = MQTT_CLIENT_ID + "-" + _this.uid;

              _this.connect();
            });
          });

          // handle MQTTMessage from app
          this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));
        }

        _createClass(MQTTEventBridge, {
          configure: {
            value: function configure() {}
          },
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
                console.warn("empty topic", topic);
                return;
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
                console.warn("empty topic", topic);
                return;
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
              console.info("connected to mqtt");

              // listen for all messages under this.prefix
              this.client.subscribe(this.resolve("#"));

              this.eventAggregator.publish("mqtt-event-bridge", "connected");
              this.publish(new MQTTMessage("/broadcast/client/" + this.clientId, "connect"));
            }
          },
          onConnectFailed: {
            value: function onConnectFailed() {
              console.error("failed to connect to mqtt", arguments);
            }
          },
          onConnectionLost: {
            value: function onConnectionLost(res) {
              console.warn("connection lost", arguments);

              if (res.errorCode !== 0) {
                console.error("onConnectionLost", res);
              }
            }
          },
          onSubscribeSuccess: {
            value: function onSubscribeSuccess(res) {
              console.info("subscribe success", arguments);
              if (res.invocationContext) {
                this.subscriptions[res.invocationContext.topic].status = 1;
              }
            }
          },
          onSubscribeFailure: {
            value: function onSubscribeFailure(res) {
              console.error("subscribe failure", arguments);
            }
          },
          onUnsubscribeSuccess: {
            value: function onUnsubscribeSuccess(res) {
              console.info("unsubscribe success", arguments);

              if (res.invocationContext) {
                this.subscriptions[res.invocationContext.topic].status = -1;
              }
            }
          },
          onUnsubscribeFailure: {
            value: function onUnsubscribeFailure(res) {
              console.error("unsubscribe failure", arguments);
            }
          },
          onMessageInbound: {

            // mqtt -> app

            value: function onMessageInbound(message) {
              var dest = message.destinationName,
                  payload = message.payloadString,
                  topic = dest.replace(this.prefixRe, "");

              console.info("received client message", dest, topic, payload);

              if (Object.keys(this.subscriptions).indexOf(topic) === -1) {
                console.warn("message received on zombie topic", topic, payload, this.subscriptions);
              }

              // publish to app
              this.eventAggregator.publish(new MQTTMessage(message, topic));
            }
          },
          onMessageOutbound: {

            // app -> mqtt

            value: function onMessageOutbound(message) {
              console.info("received app message", message);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQtZXZlbnQtYnJpZGdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxlQUFlLEVBQ2YsV0FBVyxFQUNaLElBQUksRUFDSixJQUFJLEVBQ0osV0FBVyxpQ0FHZCxnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBRWhCLGNBQWMsRUFFTCxlQUFlOzs7O0FBWnBCLHFCQUFlLDJCQUFmLGVBQWU7O0FBQ2YsaUJBQVcsK0JBQVgsV0FBVzs7QUFDWixVQUFJOztBQUNKLFVBQUk7O0FBQ0osaUJBQVc7Ozs7Ozs7Ozs7QUFHZCxzQkFBZ0IsR0FBRyxzQkFBc0I7QUFDekMsc0JBQWdCLEdBQUcsSUFBSTtBQUV2QixvQkFBYyxHQUFHLG1CQUFtQjtBQUUzQixxQkFBZTtBQUdmLGlCQUhBLGVBQWUsQ0FHZCxlQUFlLEVBQUU7OztnQ0FIbEIsZUFBZTs7QUFJeEIsY0FBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7O0FBRXZDLGNBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGNBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXZELGNBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOzs7QUFHeEIscUJBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUM3Qix1QkFBVyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN6RCxrQkFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLG1CQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2hCLDJCQUFXLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2VBQ25EOztBQUVELG9CQUFLLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixvQkFBSyxRQUFRLEdBQUcsY0FBYyxHQUFHLEdB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QUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDL0M7O0FBRUQsOEJBQW9CO21CQUFBLDhCQUFDLEdBQUcsRUFBRTtBQUN4QixxQkFBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFL0Msa0JBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFO0FBQ3pCLG9CQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7ZUFDN0Q7YUFDRjs7QUFFRCw4QkFBb0I7bUJBQUEsOEJBQUMsR0FBRyxFQUFFO0FBQ3hCLHFCQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ2pEOztBQUdELDBCQUFnQjs7OzttQkFBQSwwQkFBQyxPQUFPLEVBQUU7QUFDeEIsa0JBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxlQUFlO2tCQUNoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWE7a0JBQy9CLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTFDLHFCQUFPLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlELGtCQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN4RCx1QkFBTyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztlQUN0Rjs7O0FBR0Qsa0JBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQy9EOztBQUdELDJCQUFpQjs7OzttQkFBQSwyQkFBQyxPQUFPLEVBQUU7QUFDekIscUJBQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUc5QyxrQkFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN2Qjs7O0FBOU9NLGdCQUFNO21CQUFBLGtCQUFFO0FBQUUscUJBQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUFFOzs7O2VBRGpDLGVBQWUiLCJmaWxlIjoiaW8vbXF0dC1ldmVudC1icmlkZ2UuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=