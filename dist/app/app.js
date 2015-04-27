System.register(['aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator', '../io/mqtt/mqtt-event-bridge', '../app'], function (_export) {
  var inject, Router, EventAggregator, MQTTEventBridge, AppConfig, _createClass, _classCallCheck, App, AuthorizeStep;

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_ioMqttMqttEventBridge) {
      MQTTEventBridge = _ioMqttMqttEventBridge.MQTTEventBridge;
    }, function (_app) {
      AppConfig = _app.AppConfig;
    }],
    execute: function () {
      'use strict';

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      App = (function () {
        function App(config, router, eventAggregator, mqtt) {
          var _this = this;

          _classCallCheck(this, _App);

          this.config = config;
          this.router = router;
          this.eventAggregator = eventAggregator;
          this.mqtt = mqtt;

          this.router.configure(function (config) {
            config.title = 'Bahn Commander';
            config.options.pushState = true;

            config.addPipelineStep('authorize', AuthorizeStep);
            config.map([{ route: ['welcome'], moduleId: 'app/routes/welcome/welcome', nav: true, title: 'Welcome' }, { route: 'grid', moduleId: 'app/routes/grid/grid', nav: true, title: 'Grid' }, { route: 'settings', moduleId: 'app/routes/settings/settings', nav: true, auth: true, title: 'Settings' }, { route: '', redirect: 'welcome' }]);
          });

          this.mqtt.configure(this.config.mqtt);

          this.eventAggregator.subscribe('mqtt-event-bridge', function (payload) {
            if (payload == 'connected') {
              _this.mqtt.subscribe('broadcast/#');
              _this.mqtt.subscribe('owntracks/#');
              _this.mqtt.subscribe('welcome/#');
            }
          });

          this.mqtt.connect();
        }

        var _App = App;
        App = inject(AppConfig, Router, EventAggregator, MQTTEventBridge)(App) || App;
        return App;
      })();

      _export('App', App);

      AuthorizeStep = (function () {
        function AuthorizeStep() {
          _classCallCheck(this, AuthorizeStep);
        }

        _createClass(AuthorizeStep, [{
          key: 'run',
          value: function run(routingContext, next) {
            if (routingContext.nextInstructions.some(function (i) {
              return i.config.auth;
            })) {
              var isLoggedIn = false;
              if (!isLoggedIn) {
                return next.cancel(new Redirect('login'));
              }
            }

            return next();
          }
        }]);

        return AuthorizeStep;
      })();
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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