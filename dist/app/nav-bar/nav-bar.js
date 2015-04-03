System.register(["aurelia-framework"], function (_export) {
  var Behavior, _createClass, _classCallCheck, NavBar;

  return {
    setters: [function (_aureliaFramework) {
      Behavior = _aureliaFramework.Behavior;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      NavBar = _export("NavBar", (function () {
        function NavBar() {
          _classCallCheck(this, NavBar);

          this.open = false;
        }

        _createClass(NavBar, {
          toggle: {
            value: function toggle(open) {
              this.open = open || !this.open;
            }
          }
        }, {
          metadata: {
            value: function metadata() {
              return Behavior.withProperty("router");
            }
          }
        });

        return NavBar;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9uYXYtYmFyL25hdi1iYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLFFBQVEsaUNBRUgsTUFBTTs7OztBQUZYLGNBQVEscUJBQVIsUUFBUTs7Ozs7Ozs7O0FBRUgsWUFBTTtBQU1OLGlCQU5BLE1BQU0sR0FNSDtnQ0FOSCxNQUFNOztBQU9mLGNBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1NBQ25COztxQkFSVSxNQUFNO0FBVWpCLGdCQUFNO21CQUFBLGdCQUFDLElBQUksRUFBRTtBQUNYLGtCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDaEM7OztBQVhNLGtCQUFRO21CQUFBLG9CQUFFO0FBQ2YscUJBQU8sUUFBUSxDQUNaLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN6Qjs7OztlQUpRLE1BQU0iLCJmaWxlIjoiYXBwL25hdi1iYXIvbmF2LWJhci5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==