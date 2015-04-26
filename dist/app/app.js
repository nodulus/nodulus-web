System.register(['aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator', '../io/mqtt-event-bridge'], function (_export) {
  var inject, Router, EventAggregator, MQTTEventBridge, _classCallCheck, App;

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_ioMqttEventBridge) {
      MQTTEventBridge = _ioMqttEventBridge.MQTTEventBridge;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      App = (function () {
        function App(router, eventAggregator, mqtt) {
          var _this = this;

          _classCallCheck(this, _App);

          this.router = router;
          this.eventAggregator = eventAggregator;
          this.mqtt = mqtt;

          this.router.configure(function (config) {
            config.title = 'Bahn Commander';
            config.options.pushState = true;
            config.map([{ route: ['', 'welcome'], moduleId: 'app/routes/welcome/welcome', nav: true, title: 'Welcome' }, { route: 'grid', moduleId: 'app/routes/grid/grid', nav: true, title: 'Grid' }]);
          });

          this.mqtt.configure({
            uri: 'http://mashtun.homebrew.lan:1884',
            qos: 1
          });

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
        App = inject(Router, EventAggregator, MQTTEventBridge)(App) || App;
        return App;
      })();

      _export('App', App);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijt5RUFRYSxHQUFHOzs7O2lDQVJSLE1BQU07OzhCQUNOLE1BQU07O2dEQUNOLGVBQWU7OzJDQUNmLGVBQWU7Ozs7Ozs7QUFLVixTQUFHO0FBRUgsaUJBRkEsR0FBRyxDQUVGLE1BQU0sRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFOzs7OztBQUN6QyxjQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixjQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUN2QyxjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsY0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDOUIsa0JBQU0sQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7QUFDaEMsa0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUNoQyxrQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUNULEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFDL0YsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFVLFFBQVEsRUFBRSxzQkFBc0IsRUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FDeEYsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2xCLGVBQUcsRUFBRSxrQ0FBa0M7QUFDdkMsZUFBRyxFQUFFLENBQUM7V0FDUCxDQUFDLENBQUM7O0FBRUgsY0FBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsVUFBQSxPQUFPLEVBQUk7QUFDN0QsZ0JBQUksT0FBTyxJQUFJLFdBQVcsRUFBRTtBQUMxQixvQkFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25DLG9CQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbkMsb0JBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNsQztXQUNGLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3JCOzttQkE5QlUsR0FBRztBQUFILFdBQUcsR0FEZixNQUFNLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FDcEMsR0FBRyxLQUFILEdBQUc7ZUFBSCxHQUFHOzs7cUJBQUgsR0FBRyIsImZpbGUiOiJhcHAvYXBwLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9