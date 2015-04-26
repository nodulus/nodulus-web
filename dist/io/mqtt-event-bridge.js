System.register(['aurelia-event-aggregator', 'bahn-commander/io/mqtt-config', 'bahn-commander/io/mqtt-message', 'paho', 'uuid', 'localforage'], function (_export) {
  var EventAggregator, MQTTConfig, MQTTMessage, Paho, uuid, localforage, _classCallCheck, _createClass, MQTT_SERVER_HOST, MQTT_SERVER_PORT, MQTT_CLIENT_ID, MQTTEventBridge;

  return {
    setters: [function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_bahnCommanderIoMqttConfig) {
      MQTTConfig = _bahnCommanderIoMqttConfig.MQTTConfig;
    }, function (_bahnCommanderIoMqttMessage) {
      MQTTMessage = _bahnCommanderIoMqttMessage.MQTTMessage;
    }, function (_paho) {
      Paho = _paho['default'];
    }, function (_uuid) {
      uuid = _uuid['default'];
    }, function (_localforage) {
      localforage = _localforage['default'];
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
          var _this = this;

          _classCallCheck(this, MQTTEventBridge);

          this.eventAggregator = eventAggregator;

          this.options = new MQTTConfig();

          this.subscriptions = {};

          this.dispose = this.eventAggregator.subscribe(MQTTMessage, this.onMessageOutbound.bind(this));

          var load = function load() {
            var uid;

            try {
              var ready = localforage.ready();
              uid = localforage.getItem('mqtt-event-bridge-uid');
            } catch (e) {
              console.error('failed to init localforage', e);
            }

            if (!uid) {
              uid = uuid.v1();
              localforage.setItem('mqtt-event-bridge-uid', uid);
            }

            _this.uid = uid;
          };
          load();
        }

        _createClass(MQTTEventBridge, [{
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
            return this.options.clientID || MQTT_CLIENT_ID + this.uid;
          }
        }, {
          key: 'connect',
          value: function connect() {
            if (!this.client) {
              console.log('creating client');

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
              console.log('Failed to connect', e);
            }
          }
        }, {
          key: 'disconnect',
          value: function disconnect() {
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
            console.info('connected to mqtt');

            this.client.subscribe(this.resolve('#'));

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
        }], [{
          key: 'inject',
          value: function inject() {
            return [EventAggregator];
          }
        }]);

        return MQTTEventBridge;
      })();

      _export('MQTTEventBridge', MQTTEventBridge);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQtZXZlbnQtYnJpZGdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7d0dBUUksZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUVoQixjQUFjLEVBRUwsZUFBZTs7OztnREFicEIsZUFBZTs7OENBQ2YsVUFBVTs7Z0RBQ1YsV0FBVzs7Ozs7Ozs7Ozs7Ozs7O0FBTWYsc0JBQWdCLEdBQUcsc0JBQXNCO0FBQ3pDLHNCQUFnQixHQUFHLElBQUk7QUFFdkIsb0JBQWMsR0FBRyxtQkFBbUI7O0FBRTNCLHFCQUFlO0FBR2YsaUJBSEEsZUFBZSxDQUdkLGVBQWUsRUFBRTs7O2dDQUhsQixlQUFlOztBQUl4QixjQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQzs7QUFFdkMsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDOztBQUVoQyxjQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQzs7QUFHeEIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUc5RixjQUFJLElBQUksR0FBRyxnQkFBTTtBQUNmLGdCQUFJLEdBQUcsQ0FBQzs7QUFFUixnQkFBSTtBQUNGLGtCQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEMsaUJBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDcEQsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLHFCQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hEOztBQUVELGdCQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsaUJBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDaEIseUJBQVcsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsR0FB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QyxDQUFDO1dBQ3ZEOzs7aUJBRWUsMEJBQUMsR0FBRyxFQUFFO0FBQ3BCLG1CQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUUzQyxnQkFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLENBQUMsRUFBRTtBQUN2QixxQkFBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN4QztXQUNGOzs7aUJBRWlCLDRCQUFDLEdBQUcsRUFBRTtBQUN0QixnQkFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUU7QUFDekIsa0JBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDNUQ7V0FDRjs7O2lCQUVpQiw0QkFBQyxHQUFHLEVBQUU7QUFDdEIsbUJBQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQUM7V0FDL0M7OztpQkFFbUIsOEJBQUMsR0FBRyxFQUFFO0FBQ3hCLGdCQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QixrQkFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1dBQ0Y7OztpQkFFbUIsOEJBQUMsR0FBRyxFQUFFO0FBQ3hCLG1CQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1dBQ2pEOzs7aUJBR2UsMEJBQUMsT0FBTyxFQUFFO0FBQ3hCLGdCQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZTtnQkFDaEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhO2dCQUMvQixLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsbUJBQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBT3ZFLGdCQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztXQUMvRDs7O2lCQUdnQiwyQkFBQyxPQUFPLEVBQUU7QUFDekIsbUJBQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRzlDLGdCQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1dBQ3ZCOzs7aUJBclFZLGtCQUFFO0FBQUUsbUJBQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztXQUFFOzs7ZUFEakMsZUFBZTs7O2lDQUFmLGVBQWUiLCJmaWxlIjoiaW8vbXF0dC1ldmVudC1icmlkZ2UuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=