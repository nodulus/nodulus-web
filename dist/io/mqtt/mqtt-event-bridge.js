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
          _classCallCheck(this, _MQTTEventBridge);

          this.eventAggregator = eventAggregator;

          this.options = new MQTTConfig();
          this.subscriptions = {};

          this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));

          localforage.ready().then((function () {
            return localforage.getItem('mqtt-event-bridge-uid').then((function (uid) {
              return this.uid = uid;
            }).bind(this));
          }).bind(this)).done((function (uid) {
            if (!this.uid) {
              uid = uuid.v1();
              localforage.setItem('mqtt-event-bridge-uid', uid);
            }
            return this.uid = uid;
          }).bind(this));
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
            return this.options.clientID || MQTT_CLIENT_ID + '-' + this.uid;
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
              console.error('topic required', topic);
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
              console.error('topic required', topic);
              return;
            }

            var dest = this.resolve(topic);

            console.log('unsubscribing from topic', dest, topic, opts);

            if (!this.subscriptions[topic] || this.subscriptions[topic].status === -1) {
              if (!this.subscriptions[topic]) {
                console.log('nothing to unsubscribe', topic);
              }
              console.log('unsubscribing from zombie topic', this.subscriptions[topic], topic, opts);
            }

            if (this.subscriptions[topic].subscribers > 1) {
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

            console.info('received client message', dest, topic, payload);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQvbXF0dC1ldmVudC1icmlkZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtnSEFTSSxnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBRWhCLGNBQWMsRUFHTCxlQUFlOzs7O2lDQWZwQixNQUFNOztnREFDTixlQUFlOzs7Ozs7OzsrQkFJZixVQUFVOztpQ0FDVixXQUFXOzs7Ozs7Ozs7QUFHZixzQkFBZ0IsR0FBRyxzQkFBc0I7QUFDekMsc0JBQWdCLEdBQUcsSUFBSTtBQUV2QixvQkFBYyxHQUFHLG1CQUFtQjs7QUFHM0IscUJBQWU7QUFDZixpQkFEQSxlQUFlLENBQ2QsZUFBZSxFQUFFOzs7QUFDM0IsY0FBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7O0FBRXZDLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNoQyxjQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQzs7QUFHeEIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUc5RixxQkFBVyxDQUFDLEtBQUssRUFBRSxDQUNoQixJQUFJLENBQUMsQ0FBQSxZQUFXO0FBQ2YsbUJBQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUNoRCxJQUFJLENBQUMsQ0FBQSxVQUFTLEdBQUcsRUFBRTtBQUNsQixxQkFBTyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzthQUN2QixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7V0FDakIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUNaLElBQUksQ0FBQyxDQUFBLFVBQVMsR0FBRyxFQUFFO0FBQ2xCLGdCQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNaLGlCQUFHLEdBQUcsSUFB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QUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUUzQyxnQkFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLENBQUMsRUFBRTtBQUN2QixxQkFBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN4QztXQUNGOzs7aUJBRWlCLDRCQUFDLEdBQUcsRUFBRTtBQUN0QixnQkFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUU7QUFDekIsa0JBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDNUQ7V0FDRjs7O2lCQUVpQiw0QkFBQyxHQUFHLEVBQUU7QUFDdEIsbUJBQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQUM7V0FDL0M7OztpQkFFbUIsOEJBQUMsR0FBRyxFQUFFO0FBQ3hCLGdCQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QixrQkFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1dBQ0Y7OztpQkFFbUIsOEJBQUMsR0FBRyxFQUFFO0FBQ3hCLG1CQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1dBQ2pEOzs7aUJBR2UsMEJBQUMsT0FBTyxFQUFFO0FBQ3hCLGdCQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZTtnQkFDaEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhO2dCQUMvQixLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsbUJBQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFPOUQsZ0JBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1dBQy9EOzs7aUJBR2dCLDJCQUFDLE9BQU8sRUFBRTtBQUN6QixtQkFBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFHOUMsZ0JBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7V0FDdkI7OztBQWhRVSx1QkFBZSxHQUQzQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQ1gsZUFBZSxLQUFmLGVBQWU7ZUFBZixlQUFlOzs7aUNBQWYsZUFBZSIsImZpbGUiOiJpby9tcXR0L21xdHQtZXZlbnQtYnJpZGdlLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9