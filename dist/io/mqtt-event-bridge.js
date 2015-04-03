System.register(["aurelia-event-aggregator", "paho"], function (_export) {
  var EventAggregator, Paho, _createClass, _classCallCheck, MQTT_SERVER_HOST, MQTT_SERVER_PORT, MQTTMessage, MQTTEventBridge;

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
      MQTTMessage = _export("MQTTMessage", function MQTTMessage(topic, payload) {
        _classCallCheck(this, MQTTMessage);

        this.topic = topic;
        this.payload = payload;
      });

      MQTTEventBridge = (function () {
        function MQTTEventBridge(eventAggregator) {
          var _this = this;

          var _arguments = arguments;

          _classCallCheck(this, MQTTEventBridge);

          this.eventAggregator = eventAggregator;
          this.subscriptions = {};

          this.client = new Paho.MQTT.Client(MQTT_SERVER_HOST, MQTT_SERVER_PORT, "bahn_commander");

          // handle mqtt disconnect
          this.client.onConnectionLost = function (res) {
            console.log("connection lost", _arguments);
            if (res.errorCode !== 0) {
              console.log("onConnectionLost:" + res.errorMessage);
            }
          };

          // handle message from mqtt
          this.client.onMessageArrived = function (message) {
            var topic = message.destinationName,
                payload = message.payloadString;

            console.log("received client message", topic, payload, message);

            if (!Object.keys(_this.subscriptions).indexOf(topic)) {
              console.log("message received on zombie topic", topic, payload, _this.subscriptions);
            }

            // publish to app
            // this.eventAggregator.publish(new MQTTMessage(topic, payload));
          };

          // connect to mqtt
          var client = this.client;
          this.client.connect({
            onSuccess: function () {
              console.log("connected to mqtt", _arguments);

              _this.client.subscribe("/bahn-mqtt");

              var message = new Paho.MQTT.Message("Hello");
              message.destinationName = "/bahn-mqtt";
              client.send(message);
            }
          });

          // handle MQTTMessage from app
          this._dispose = this.eventAggregator.subscribe(MQTTMessage, function (message) {
            console.log("received app message", message);

            //this.publish(message.topic, message.payload);
          });
        }

        _createClass(MQTTEventBridge, {
          publish: {

            // send MQTTMessage to mqtt

            value: function publish(message) {
              console.log("publish to client", message);
              this.client.publish(message.topic, message.payload);
            }
          },
          subscribe: {

            // subscribe to new mqtt topic

            value: function subscribe(topic) {
              var _this = this;

              console.log("subscribe to topic", topic);

              if (!this.subscriptions[topic] || this.subscriptions[topic].qos === -1) {
                console.log("subscribing to new mqtt topic", topic);

                this.subscriptions[topic] = { qos: -1, subscribers: 0 };

                this.client.subscribe("topic", function (err, granted) {
                  if (err) {
                    console.log("error subscribing to topic", topic, err);
                    return;
                  }

                  granted.forEach(function (topic, qos) {
                    console.log("granted subscription", topic, qos);
                    if (_this.subscriptions[topic]) {
                      console.log("replacing existing subscription", topic, qos, _this.subscriptions[topic]);
                    }
                    ++_this.subscriptions[topic][subscribers];
                  });
                });
              }
            }
          },
          unsubscribe: {
            value: function unsubscribe(topic) {
              var _this = this;

              var _arguments = arguments;

              console.log("unsubscribe from topic", topic);

              if (!this.subscriptions[topic] || this.subscriptions[topic].qos === -1) {
                console.log("unsubscribing from zombie topic", topic, topics);
              }

              if (this.subscriptions[topic][subscribers] > 1) {
                --this.subscriptions[topic][subscribers];
                return;
              }

              console.log("unsubscribing empty mqtt topic", topic);

              // unsubscribe from mqtt topic
              this.client.unsubscribe("topic", function (err, granted) {
                console.log("unsubscribe response", _arguments);
                delete _this.subscriptions[topic];
              });
            }
          },
          dispose: {
            value: function dispose() {
              this.client.end();
              this._dispose();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQtZXZlbnQtYnJpZGdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxlQUFlLEVBQ2hCLElBQUksaUNBR1AsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUVQLFdBQVcsRUFPSCxlQUFlOzs7O0FBZDVCLHFCQUFlLDJCQUFmLGVBQWU7O0FBQ2hCLFVBQUk7Ozs7Ozs7Ozs7QUFHUCxzQkFBZ0IsR0FBRyxzQkFBc0I7QUFDekMsc0JBQWdCLEdBQUcsSUFBSTtBQUVkLGlCQUFXLDBCQUNYLFNBREEsV0FBVyxDQUNWLEtBQUssRUFBRSxPQUFPLEVBQUU7OEJBRGpCLFdBQVc7O0FBRXBCLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO09BQ3hCOztBQUdrQixxQkFBZTtBQUd2QixpQkFIUSxlQUFlLENBR3RCLGVBQWUsRUFBRTs7Ozs7Z0NBSFYsZUFBZTs7QUFJaEMsY0FBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDdkMsY0FBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7O0FBRXhCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHekYsY0FBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxVQUFDLEdBQUcsRUFBSztBQUN0QyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsYUFBWSxDQUFDO0FBQzFDLGdCQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssQ0FBQyxFQUFFO0FBQ3ZCLHFCQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNyRDtXQUNGLENBQUM7OztBQUdGLGNBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsVUFBQyxPQUFPLEVBQUs7QUFDMUMsZ0JBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlO2dCQUNqQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQzs7QUFFbEMsbUJBQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFaEUsZ0JBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQUssYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2xELHFCQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBSyxhQUFhLENBQUMsQ0FBQzthQUNyRjs7OztBQUFBLFdBSUYsQ0FBQzs7O0FBR0YsY0FBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixjQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNsQixxQkFBUyxFQUFFLFlBQU07QUFDZixxQkFBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsYUFBWSxDQUFDOztBQUU1QyxvQkFBSyxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUVwQyxrQkFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxxQkFBTyxDQUFDLGVBQWUsR0FBRyxZQUFZLENBQUM7QUFDdkMsb0JBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDdEI7V0FDRixDQUFDLENBQUM7OztBQUdILGNBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQUEsT0FBTyxFQUFJO0FBQ3JFLG1CQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7V0FHOUMsQ0FBQyxDQUFDO1NBQ0o7O3FCQXBEa0IsZUFBZTtBQXVEbEMsaUJBQU87Ozs7bUJBQUEsaUJBQUMsT0FBTyxFQUFFO0FBQ2YscUJBQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUMsa0JBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3JEOztBQUdELG1CQUFTOzs7O21CQUFBLG1CQUFDLEtBQUssRUFBRTs7O0FBQ2YscUJBQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXpDLGtCQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN0RSx1QkFBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFcEQsb0JBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBQyxDQUFDOztBQUV0RCxvQkFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBSztBQUMvQyxzQkFBSSxHQUFHLEVBQUU7QUFDUCwyQkFBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEQsMkJBQU87bUJBQ1I7O0FBRUQseUJBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFLO0FBQzlCLDJCQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoRCx3QkFBSSxNQUFLLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM3Qiw2QkFBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQUssYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3ZGO0FBQ0Qsc0JBQUUsTUFBSyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7bUJBQzFDLENBQUMsQ0FBQztpQkFDSixDQUFDLENBQUM7ZUFDSjthQUNGOztBQUVELHFCQUFXO21CQUFBLHFCQUFDLEtBQUssRUFBRTs7Ozs7QUFDakIscUJBQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTdDLGtCQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN0RSx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7ZUFDL0Q7O0FBRUQsa0JBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDOUMsa0JBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6Qyx1QkFBTztlQUNSOztBQUVELHFCQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7QUFHckQsa0JBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUs7QUFDakQsdUJBQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLGFBQVksQ0FBQztBQUMvQyx1QkFBTyxNQUFLLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztlQUNsQyxDQUFDLENBQUM7YUFDSjs7QUFFRCxpQkFBTzttQkFBQSxtQkFBRztBQUNSLGtCQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGtCQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDakI7OztBQTdHTSxnQkFBTTttQkFBQSxrQkFBRTtBQUFFLHFCQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7YUFBRTs7OztlQUR6QixlQUFlOzs7eUJBQWYsZUFBZSIsImZpbGUiOiJpby9tcXR0LWV2ZW50LWJyaWRnZS5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==