System.register(["aurelia-event-aggregator", "bahn-commander/io/mqtt-message"], function (_export) {
  var EventAggregator, MQTTMessage, _createClass, _classCallCheck, Welcome, UpperValueConverter;

  return {
    setters: [function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_bahnCommanderIoMqttMessage) {
      MQTTMessage = _bahnCommanderIoMqttMessage.MQTTMessage;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Welcome = _export("Welcome", (function () {
        function Welcome(eventAggregator) {
          _classCallCheck(this, Welcome);

          this.eventAggregator = eventAggregator;

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
              console.log(this.eventAggregator);
              var message = new MQTTMessage("welcome", this.fullName);
              this.eventAggregator.publish(message);
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [EventAggregator];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9yb3V0ZXMvd2VsY29tZS93ZWxjb21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxlQUFlLEVBQ2YsV0FBVyxpQ0FFTixPQUFPLEVBc0JQLG1CQUFtQjs7OztBQXpCeEIscUJBQWUsMkJBQWYsZUFBZTs7QUFDZixpQkFBVywrQkFBWCxXQUFXOzs7Ozs7Ozs7QUFFTixhQUFPO0FBR1AsaUJBSEEsT0FBTyxDQUdOLGVBQWUsRUFBRTtnQ0FIbEIsT0FBTzs7QUFJaEIsY0FBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7O0FBRXZDLGNBQUksQ0FBQyxPQUFPLEdBQUcsK0NBQStDLENBQUM7QUFDL0QsY0FBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDeEIsY0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDdkI7O3FCQVRVLE9BQU87QUFXZCxrQkFBUTtpQkFBQSxZQUFHO0FBQ2IsMEJBQVUsSUFBSSxDQUFDLFNBQVMsU0FBSSxJQUFJLENBQUMsUUFBUSxDQUFHO2FBQzdDOztBQUVELGlCQUFPO21CQUFBLG1CQUFHO0FBQ1IscUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2xDLGtCQUFJLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELGtCQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN2Qzs7O0FBbEJNLGdCQUFNO21CQUFBLGtCQUFFO0FBQUUscUJBQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUFFOzs7O2VBRGpDLE9BQU87O0FBc0JQLHlCQUFtQjtpQkFBbkIsbUJBQW1CO2dDQUFuQixtQkFBbUI7OztxQkFBbkIsbUJBQW1CO0FBQzlCLGdCQUFNO21CQUFBLGdCQUFDLEtBQUssRUFBQztBQUNYLHFCQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDckM7Ozs7ZUFIVSxtQkFBbUIiLCJmaWxlIjoiYXBwL3JvdXRlcy93ZWxjb21lL3dlbGNvbWUuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=