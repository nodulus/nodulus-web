System.register(["aurelia-router", "bootstrap"], function (_export) {
  "use strict";

  var Router, bootstrap, _prototypeProperties, _classCallCheck, App;
  return {
    setters: [function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_bootstrap) {
      bootstrap = _bootstrap["default"];
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      App = _export("App", (function () {
        function App(router) {
          _classCallCheck(this, App);

          this.router = router;
          this.router.configure(function (config) {
            config.title = "Bahn Commander";
            config.map([{
              route: ["", "welcome"],
              moduleId: "welcome",
              nav: true,
              title: "Welcome"
            }]);
          });
        }

        _prototypeProperties(App, {
          inject: {
            value: function inject() {
              return [Router];
            },
            writable: true,
            configurable: true
          }
        });

        return App;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7TUFBUSxNQUFNLEVBQ1AsU0FBUyx5Q0FFSCxHQUFHOzs7QUFIUixZQUFNLGtCQUFOLE1BQU07O0FBQ1AsZUFBUzs7Ozs7OztBQUVILFNBQUc7QUFFSCxpQkFGQSxHQUFHLENBRUYsTUFBTTtnQ0FGUCxHQUFHOztBQUdaLGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQzlCLGtCQUFNLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO0FBQ2hDLGtCQUFNLENBQUMsR0FBRyxDQUFDLENBQ1Q7QUFDRSxtQkFBSyxFQUFFLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQztBQUN0QixzQkFBUSxFQUFFLFNBQVM7QUFDbkIsaUJBQUcsRUFBRSxJQUFJO0FBQ1QsbUJBQUssRUFBQyxTQUFTO2FBQ2hCLENBQ0YsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0o7OzZCQWZVLEdBQUc7QUFDUCxnQkFBTTttQkFBQSxrQkFBRztBQUFFLHFCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7YUFBRTs7Ozs7O2VBRHpCLEdBQUciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=