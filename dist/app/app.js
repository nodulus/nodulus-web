System.register(['aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator', '../io/mqtt/mqtt-event-bridge', '../app'], function (_export) {
  var inject, Router, EventAggregator, MQTTEventBridge, AppConfig, _classCallCheck, App;

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
            config.map([{ route: ['', 'welcome'], moduleId: 'app/routes/welcome/welcome', nav: true, title: 'Welcome' }, { route: 'grid', moduleId: 'app/routes/grid/grid', nav: true, title: 'Grid' }]);
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
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtvRkFPYSxHQUFHOzs7O2lDQVBSLE1BQU07OzhCQUNOLE1BQU07O2dEQUNOLGVBQWU7OytDQUNmLGVBQWU7O3VCQUNmLFNBQVM7Ozs7Ozs7QUFHSixTQUFHO0FBQ0gsaUJBREEsR0FBRyxDQUNGLE1BQU0sRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRTs7Ozs7QUFDakQsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDdkMsY0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWpCLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQzlCLGtCQUFNLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO0FBQ2hDLGtCQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDaEMsa0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FDVCxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQy9GLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxRQUFRLEVBQUUsc0JBQXNCLEVBQUksR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQ3hGLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0QyxjQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLE9BQU8sRUFBSTtBQUM3RCxnQkFBSSxPQUFPLElBQUksV0FBVyxFQUFFO0FBQzFCLG9CQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbkMsb0JBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNuQyxvQkFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ2xDO1dBQ0YsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDckI7O21CQTNCVSxHQUFHO0FBQUgsV0FBRyxHQURmLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FDL0MsR0FBRyxLQUFILEdBQUc7ZUFBSCxHQUFHOzs7cUJBQUgsR0FBRyIsImZpbGUiOiJhcHAvYXBwLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9