System.register(["aurelia-router", "../io/mqtt-event-bridge"], function (_export) {
  var Router, MQTTEventBridge, _createClass, _classCallCheck, App;

  return {
    setters: [function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_ioMqttEventBridge) {
      MQTTEventBridge = _ioMqttEventBridge["default"];
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      // import ViewStyleCustomElement from '../behaviors/view-style/view-style';

      App = _export("App", (function () {
        function App(router, mqtt) {
          _classCallCheck(this, App);

          this.mqtt = mqtt;
          this.router = router;
          this.router.configure(function (config) {
            config.title = "Bahn Commander";
            config.options.pushState = true;
            config.map([{ route: ["", "welcome"], moduleId: "app/routes/welcome/welcome", nav: true, title: "Welcome" }, { route: "deuce", moduleId: "app/routes/deuce/deuce", nav: true }]);
          });
        }

        _createClass(App, null, {
          inject: {
            value: function inject() {
              return [Router, MQTTEventBridge];
            }
          }
        });

        return App;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLE1BQU0sRUFDUCxlQUFlLGlDQUlULEdBQUc7Ozs7QUFMUixZQUFNLGtCQUFOLE1BQU07O0FBQ1AscUJBQWU7Ozs7Ozs7Ozs7O0FBSVQsU0FBRztBQUVILGlCQUZBLEdBQUcsQ0FFRixNQUFNLEVBQUUsSUFBSSxFQUFFO2dDQUZmLEdBQUc7O0FBR1osY0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDOUIsa0JBQU0sQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7QUFDaEMsa0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUNoQyxrQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUNULEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxTQUFTLEVBQUUsRUFDOUYsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFVLFFBQVEsRUFBRSx3QkFBd0IsRUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQzVFLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztTQUNKOztxQkFiVSxHQUFHO0FBQ1AsZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQzthQUFFOzs7O2VBRDFDLEdBQUciLCJmaWxlIjoiYXBwL2FwcC5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==