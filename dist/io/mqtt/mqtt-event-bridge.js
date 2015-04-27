System.register(['aurelia-framework', 'aurelia-event-aggregator', 'paho', 'uuid', 'localforage', './mqtt-config', './mqtt-message'], function (_export) {
  var inject, EventAggregator, Paho, uuid, localforage, MQTTConfig, MQTTMessage, _classCallCheck, _createClass, MQTT_SERVER_HOST, MQTT_SERVER_PORT, MQTT_CLIENT_ID, MQTTEventBridge;

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_paho) {
      Paho = _paho['default'];
    }, function (_uuid) {
      uuid = _uuid['default'];
    }, function (_localforage) {
      localforage = _localforage['default'];
    }, function (_mqttConfig) {
      MQTTConfig = _mqttConfig.MQTTConfig;
    }, function (_mqttMessage) {
      MQTTMessage = _mqttMessage.MQTTMessage;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      MQTT_SERVER_HOST = 'mashtun.homebrew.lan';
      MQTT_SERVER_PORT = 1884;
      MQTT_CLIENT_ID = 'mqtt_event_bridge';

      MQTTEventBridge = (function () {
        function MQTTEventBridge(eventAggregator) {
          var marked2$0 = [loadUID].map(regeneratorRuntime.mark);

          _classCallCheck(this, _MQTTEventBridge);

          this.eventAggregator = eventAggregator;

          this.options = new MQTTConfig();
          this.subscriptions = {};

          this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));

          function loadUID(next) {
            var uid;
            return regeneratorRuntime.wrap(function loadUID$(context$3$0) {
              while (1) switch (context$3$0.prev = context$3$0.next) {
                case 0:
                  context$3$0.prev = 0;
                  context$3$0.next = 3;
                  return localforage.ready();

                case 3:
                  context$3$0.next = 5;
                  return localforage.getItem('mqtt-event-bridge-uid');

                case 5:
                  uid = context$3$0.sent;

                  if (!uid) {
                    uid = uuid.v1();
                    localforage.setItem('mqtt-event-bridge-uid', uid);
                  }
                  context$3$0.next = 12;
                  break;

                case 9:
                  context$3$0.prev = 9;
                  context$3$0.t5 = context$3$0['catch'](0);

                  console.error('failed to init localforage', context$3$0.t5);

                case 12:
                  context$3$0.next = 14;
                  return next;

                case 14:
                case 'end':
                  return context$3$0.stop();
              }
            }, marked2$0[0], this, [[0, 9]]);
          };

          this.uid = loadUID();
        }

        var _MQTTEventBridge = MQTTEventBridge;

        _createClass(_MQTTEventBridge, [{
          key: 'configure',
          value: function configure(callbackOrConfig) {
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
        }, {
          key: 'clientID',
          get: function () {
            console.log('client id', this.options.clientID, MQTT_CLIENT_ID, this.uid);
            return this.options.clientID || MQTT_CLIENT_ID + this.uid;
          }
        }, {
          key: 'connect',
          value: function connect() {
            if (!this.client) {
              console.log('creating mqtt client');

              this.client = new Paho.MQTT.Client(this.options.hostname, this.options.port, this.clientID);

              this.client.onConnectionLost = this.onConnectionLost.bind(this);

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
        }, {
          key: 'disconnect',
          value: function disconnect() {
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
        }, {
          key: 'publish',
          value: function publish(message) {
            var opts = arguments[1] === undefined ? {} : arguments[1];

            if (message.io === 'inbound') {
              return;
            }var mqttMessage = new Paho.MQTT.Message(message.payload);
            mqttMessage.destinationName = this.resolve(message.topic);

            if (opts.qos) mqttMessage.qos = opts.qos;
            if (opts.retained) mqttMessage.retained = opts.retained;

            console.log('publish to mqtt', mqttMessage, message, opts);
            this.client.send(mqttMessage);
          }
        }, {
          key: 'subscribe',
          value: function subscribe(topic) {
            var opts = arguments[1] === undefined ? {} : arguments[1];

            if (!topic) {
              console.warn('empty topic', topic);
              return;
            }

            var dest = this.resolve(topic);

            if (this.subscriptions[topic] && this.subscriptions[topic].status !== -1) {
              console.log('adding subscriber to topic', dest, topic, opts);
              ++this.subscriptions[topic].subscribers;
              return;
            }

            console.log('subscribing to mqtt topic', dest, opts);

            if (!this.subscriptions[topic]) {
              this.subscriptions[topic] = { dest: dest, opts: opts, status: 0, subscribers: 0 };
            } else {
              this.subscriptions[topic].opts = opts;
              this.subscriptions[topic].status = 0;
            }

            opts.invocationContext = { topic: topic };
            opts.onSuccess = this.onSubscribeSuccess.bind(this);
            opts.onFailure = this.onSubscribeFailure.bind(this);

            this.client.subscribe(dest, opts);
          }
        }, {
          key: 'unsubscribe',
          value: function unsubscribe(topic) {
            var opts = arguments[1] === undefined ? {} : arguments[1];

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

            opts.invocationContext = { topic: topic };
            opts.onSuccess = this.onUnsubscribeSuccess.bind(this);
            opts.onFailure = this.onUnsubscribeFailure.bind(this);

            this.client.unsubscribe(dest, opts);
          }
        }, {
          key: 'destroy',
          value: function destroy() {
            this.disconnect();
            this.dispose();
          }
        }, {
          key: 'resolve',
          value: function resolve(topic) {
            return topic.charAt(0) === '/' ? topic.slice(1) : this.prefixer(topic.replace(/^\.(\/)?/, ''));
          }
        }, {
          key: 'prefixer',
          value: function prefixer(topic) {
            if (!this.options.prefix) {
              return topic;
            }return [this.options.prefix, topic].join('/');
          }
        }, {
          key: 'unprefixer',
          value: function unprefixer(topic) {
            var re = new RegExp('^(/)?' + this.options.prefix, 'i');
            return topic.replace(re, '');
          }
        }, {
          key: 'onConnectSuccess',
          value: function onConnectSuccess() {
            console.info('connected to mqtt', this.clientID);

            this.eventAggregator.publish('mqtt-event-bridge', 'connected');

            this.publish(new MQTTMessage('/broadcast/client/' + this.clientID, 'connect'));
          }
        }, {
          key: 'onConnectFailed',
          value: function onConnectFailed() {
            console.error('failed to connect to mqtt', arguments);
          }
        }, {
          key: 'onConnectionLost',
          value: function onConnectionLost(res) {
            console.warn('connection lost', arguments);

            if (res.errorCode !== 0) {
              console.error('onConnectionLost', res);
            }
          }
        }, {
          key: 'onSubscribeSuccess',
          value: function onSubscribeSuccess(res) {
            if (res.invocationContext) {
              this.subscriptions[res.invocationContext.topic].status = 1;
            }
          }
        }, {
          key: 'onSubscribeFailure',
          value: function onSubscribeFailure(res) {
            console.error('subscribe failure', arguments);
          }
        }, {
          key: 'onUnsubscribeSuccess',
          value: function onUnsubscribeSuccess(res) {
            if (res.invocationContext) {
              this.subscriptions[res.invocationContext.topic].status = -1;
            }
          }
        }, {
          key: 'onUnsubscribeFailure',
          value: function onUnsubscribeFailure(res) {
            console.error('unsubscribe failure', arguments);
          }
        }, {
          key: 'onMessageInbound',
          value: function onMessageInbound(message) {
            var dest = message.destinationName,
                payload = message.payloadString,
                topic = this.unprefixer(dest);

            console.info('received client message', dest, topic, payload, message);

            this.eventAggregator.publish(new MQTTMessage(message, topic));
          }
        }, {
          key: 'onMessageOutbound',
          value: function onMessageOutbound(message) {
            console.info('received app message', message);

            this.publish(message);
          }
        }]);

        MQTTEventBridge = inject(EventAggregator)(MQTTEventBridge) || MQTTEventBridge;
        return MQTTEventBridge;
      })();

      _export('MQTTEventBridge', MQTTEventBridge);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQvbXF0dC1ldmVudC1icmlkZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtnSEFTSSxnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBRWhCLGNBQWMsRUFHTCxlQUFlOzs7O2lDQWZwQixNQUFNOztnREFDTixlQUFlOzs7Ozs7OzsrQkFJZixVQUFVOztpQ0FDVixXQUFXOzs7Ozs7Ozs7QUFHZixzQkFBZ0IsR0FBRyxzQkFBc0I7QUFDekMsc0JBQWdCLEdBQUcsSUFBSTtBQUV2QixvQkFBYyxHQUFHLG1CQUFtQjs7QUFHM0IscUJBQWU7QUFDZixpQkFEQSxlQUFlLENBQ2QsZUFBZSxFQUFFOzJCQVVqQixPQUFPOzs7O0FBVGpCLGNBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDOztBQUV2QyxjQUFJLENBQUMsT0FBTyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDaEMsY0FBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7O0FBR3hCLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFHOUYsbUJBQVUsT0FBTyxDQUFDLElBQUk7Z0JBQ2hCLEdBQUc7Ozs7Ozt5QkFHQyxXQUFXLENBQUMsS0FBSyxFQUFFOzs7O3lCQUNiLFdBQVcsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUM7OztBQUF4RCxxQkFBRzs7QUFDSCxzQkFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLHVCQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2hCLCtCQUFXLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO21CQUNuRDs7Ozs7Ozs7QUFFRCx5QkFBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsaUJBQUksQ0FBQzs7Ozt5QkFHM0MsSUFBSTs7Ozs7OztXQUNYLENBQUM7O0FB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UyxDQUFDLENBQUM7V0FDdkQ7OztpQkFFZSwwQkFBQyxHQUFHLEVBQUU7QUFDcEIsbUJBQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRTNDLGdCQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssQ0FBQyxFQUFFO0FBQ3ZCLHFCQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3hDO1dBQ0Y7OztpQkFFaUIsNEJBQUMsR0FBRyxFQUFFO0FBQ3RCLGdCQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QixrQkFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUM1RDtXQUNGOzs7aUJBRWlCLDRCQUFDLEdBQUcsRUFBRTtBQUN0QixtQkFBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxTQUFTLENBQUMsQ0FBQztXQUMvQzs7O2lCQUVtQiw4QkFBQyxHQUFHLEVBQUU7QUFDeEIsZ0JBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFO0FBQ3pCLGtCQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDN0Q7V0FDRjs7O2lCQUVtQiw4QkFBQyxHQUFHLEVBQUU7QUFDeEIsbUJBQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLENBQUM7V0FDakQ7OztpQkFHZSwwQkFBQyxPQUFPLEVBQUU7QUFDeEIsZ0JBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxlQUFlO2dCQUNoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWE7Z0JBQy9CLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxtQkFBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFPdkUsZ0JBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1dBQy9EOzs7aUJBR2dCLDJCQUFDLE9BQU8sRUFBRTtBQUN6QixtQkFBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFHOUMsZ0JBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7V0FDdkI7OztBQXRRVSx1QkFBZSxHQUQzQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQ1gsZUFBZSxLQUFmLGVBQWU7ZUFBZixlQUFlOzs7aUNBQWYsZUFBZSIsImZpbGUiOiJpby9tcXR0L21xdHQtZXZlbnQtYnJpZGdlLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9