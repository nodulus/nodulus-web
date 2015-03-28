System.register(["aurelia-router", "bootstrap"], function (_export) {
  var Router, bootstrap, _createClass, _classCallCheck, App;

  return {
    setters: [function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_bootstrap) {
      bootstrap = _bootstrap["default"];
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      App = _export("App", (function () {
        function App(router) {
          _classCallCheck(this, App);

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
              return [Router];
            }
          }
        });

        return App;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLE1BQU0sRUFDUCxTQUFTLGlDQUVILEdBQUc7Ozs7QUFIUixZQUFNLGtCQUFOLE1BQU07O0FBQ1AsZUFBUzs7Ozs7Ozs7O0FBRUgsU0FBRztBQUVILGlCQUZBLEdBQUcsQ0FFRixNQUFNLEVBQUU7Z0NBRlQsR0FBRzs7QUFHWixjQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixjQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUM5QixrQkFBTSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztBQUNoQyxrQkFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLGtCQUFNLENBQUMsR0FBRyxDQUFDLENBQ1QsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLFNBQVMsRUFBRSxFQUM5RixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQVUsUUFBUSxFQUFFLHdCQUF3QixFQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FDNUUsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0o7O3FCQVpVLEdBQUc7QUFDUCxnQkFBTTttQkFBQSxrQkFBRztBQUFFLHFCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7YUFBRTs7OztlQUR6QixHQUFHIiwiZmlsZSI6ImFwcC9hcHAuanMiLCJzb3VyY2VSb290IjoiLy4ifQ==