System.register([], function (_export) {
  var _createClass, _classCallCheck, Welcome, UpperValueConverter;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Welcome = _export("Welcome", (function () {
        function Welcome() {
          _classCallCheck(this, Welcome);

          this.heading = "Welcome to the Bahn Commander Navigation App!";
          this.firstName = "John";
          this.lastName = "Doe";
        }

        _createClass(Welcome, {
          fullName: {
            get: function () {
              return "" + this.firstName + " " + this.lastName;
            }
          },
          welcome: {
            value: function welcome() {
              alert("Welcome, " + this.fullName + "!");
            }
          }
        });

        return Welcome;
      })());
      UpperValueConverter = _export("UpperValueConverter", (function () {
        function UpperValueConverter() {
          _classCallCheck(this, UpperValueConverter);
        }

        _createClass(UpperValueConverter, {
          toView: {
            value: function toView(value) {
              return value && value.toUpperCase();
            }
          }
        });

        return UpperValueConverter;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9yb3V0ZXMvd2VsY29tZS93ZWxjb21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7cUNBQWEsT0FBTyxFQWdCUCxtQkFBbUI7Ozs7Ozs7Ozs7O0FBaEJuQixhQUFPO0FBQ1AsaUJBREEsT0FBTyxHQUNKO2dDQURILE9BQU87O0FBRWhCLGNBQUksQ0FBQyxPQUFPLEdBQUcsK0NBQStDLENBQUM7QUFDL0QsY0FBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDeEIsY0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDdkI7O3FCQUxVLE9BQU87QUFPZCxrQkFBUTtpQkFBQSxZQUFHO0FBQ2IsMEJBQVUsSUFBSSxDQUFDLFNBQVMsU0FBSSxJQUFJLENBQUMsUUFBUSxDQUFHO2FBQzdDOztBQUVELGlCQUFPO21CQUFBLG1CQUFHO0FBQ1IsbUJBQUssZUFBYSxJQUFJLENBQUMsUUFBUSxPQUFJLENBQUM7YUFDckM7Ozs7ZUFiVSxPQUFPOztBQWdCUCx5QkFBbUI7aUJBQW5CLG1CQUFtQjtnQ0FBbkIsbUJBQW1COzs7cUJBQW5CLG1CQUFtQjtBQUM5QixnQkFBTTttQkFBQSxnQkFBQyxLQUFLLEVBQUM7QUFDWCxxQkFBTyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3JDOzs7O2VBSFUsbUJBQW1CIiwiZmlsZSI6ImFwcC9yb3V0ZXMvd2VsY29tZS93ZWxjb21lLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9