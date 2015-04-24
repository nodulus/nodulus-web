System.register(["aurelia-router", "aurelia-event-aggregator", "../io/mqtt-event-bridge"], function (_export) {
  var Router, EventAggregator, MQTTEventBridge, _createClass, _classCallCheck, App;

  return {
    setters: [function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_ioMqttEventBridge) {
      MQTTEventBridge = _ioMqttEventBridge.MQTTEventBridge;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      // import ViewStyleCustomElement from '../behaviors/view-style/view-style';

      App = _export("App", (function () {
        function App(router, eventAggregator, mqtt) {
          var _this = this;

          _classCallCheck(this, App);

          this.router = router;
          this.eventAggregator = eventAggregator;
          this.mqtt = mqtt;

          this.router.configure(function (config) {
            config.title = "Bahn Commander";
            config.options.pushState = true;
            config.map([{ route: ["", "welcome"], moduleId: "app/routes/welcome/welcome", nav: true, title: "Welcome" }, { route: "grid", moduleId: "app/routes/grid/grid", nav: true, title: "Grid" }]);
          });

          this.eventAggregator.subscribe("mqtt-event-bridge", function (payload) {
            if (payload == "connected") {
              _this.mqtt.subscribe("broadcast/#");
              _this.mqtt.subscribe("owntracks/#");
              _this.mqtt.subscribe("welcome/#");
            }
          });
        }

        _createClass(App, null, {
          inject: {
            value: function inject() {
              return [Router, EventAggregator, MQTTEventBridge];
            }
          }
        });

        return App;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLE1BQU0sRUFDTixlQUFlLEVBQ2YsZUFBZSxpQ0FJVixHQUFHOzs7O0FBTlIsWUFBTSxrQkFBTixNQUFNOztBQUNOLHFCQUFlLDJCQUFmLGVBQWU7O0FBQ2YscUJBQWUsc0JBQWYsZUFBZTs7Ozs7Ozs7Ozs7QUFJVixTQUFHO0FBR0gsaUJBSEEsR0FBRyxDQUdGLE1BQU0sRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFOzs7Z0NBSGhDLEdBQUc7O0FBSVosY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDdkMsY0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWpCLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQzlCLGtCQUFNLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO0FBQ2hDLGtCQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDaEMsa0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FDVCxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQy9GLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxRQUFRLEVBQUUsc0JBQXNCLEVBQUksR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQ3hGLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLE9BQU8sRUFBSTtBQUM3RCxnQkFBSSxPQUFPLElBQUksV0FBVyxFQUFFO0FBQzFCLG9CQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbkMsb0JBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNuQyxvQkFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ2xDO1dBQ0YsQ0FBQyxDQUFDO1NBQ0o7O3FCQXhCVSxHQUFHO0FBQ1AsZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUM7YUFBRTs7OztlQUQzRCxHQUFHIiwiZmlsZSI6ImFwcC9hcHAuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=