System.register(['aurelia-event-aggregator', 'bahn-commander/io/mqtt-message'], function (_export) {
  var EventAggregator, MQTTMessage, _classCallCheck, _createClass, Welcome, UpperValueConverter;

  return {
    setters: [function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_bahnCommanderIoMqttMessage) {
      MQTTMessage = _bahnCommanderIoMqttMessage.MQTTMessage;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Welcome = (function () {
        function Welcome(eventAggregator) {
          _classCallCheck(this, Welcome);

          this.eventAggregator = eventAggregator;

          this.heading = 'Welcome to the Bahn Commander Navigation App!';
          this.firstName = 'John';
          this.lastName = 'Doe';
        }

        _createClass(Welcome, [{
          key: 'fullName',
          get: function () {
            return '' + this.firstName + ' ' + this.lastName;
          }
        }, {
          key: 'welcome',
          value: function welcome() {
            console.log(this.eventAggregator);
            var message = new MQTTMessage('welcome', this.fullName);
            this.eventAggregator.publish(message);
          }
        }], [{
          key: 'inject',
          value: function inject() {
            return [EventAggregator];
          }
        }]);

        return Welcome;
      })();

      _export('Welcome', Welcome);

      UpperValueConverter = (function () {
        function UpperValueConverter() {
          _classCallCheck(this, UpperValueConverter);
        }

        _createClass(UpperValueConverter, [{
          key: 'toView',
          value: function toView(value) {
            return value && value.toUpperCase();
          }
        }]);

        return UpperValueConverter;
      })();

      _export('UpperValueConverter', UpperValueConverter);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9yb3V0ZXMvd2VsY29tZS93ZWxjb21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7bUVBR2EsT0FBTyxFQXNCUCxtQkFBbUI7Ozs7Z0RBekJ4QixlQUFlOztnREFDZixXQUFXOzs7Ozs7Ozs7QUFFTixhQUFPO0FBR1AsaUJBSEEsT0FBTyxDQUdOLGVBQWUsRUFBRTtnQ0FIbEIsT0FBTzs7QUFJaEIsY0FBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7O0FBRXZDLGNBQUksQ0FBQyxPQUFPLEdBQUcsK0NBQStDLENBQUM7QUFDL0QsY0FBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDeEIsY0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDdkI7O3FCQVRVLE9BQU87O2VBV04sWUFBRztBQUNiLHdCQUFVLElBQUksQ0FBQyxTQUFTLFNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBRztXQUM3Qzs7O2lCQUVNLG1CQUFHO0FBQ1IsbUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2xDLGdCQUFJLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELGdCQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUN2Qzs7O2lCQWxCWSxrQkFBRTtBQUFFLG1CQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7V0FBRTs7O2VBRGpDLE9BQU87Ozt5QkFBUCxPQUFPOztBQXNCUCx5QkFBbUI7aUJBQW5CLG1CQUFtQjtnQ0FBbkIsbUJBQW1COzs7cUJBQW5CLG1CQUFtQjs7aUJBQ3hCLGdCQUFDLEtBQUssRUFBQztBQUNYLG1CQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7V0FDckM7OztlQUhVLG1CQUFtQjs7O3FDQUFuQixtQkFBbUIiLCJmaWxlIjoiYXBwL3JvdXRlcy93ZWxjb21lL3dlbGNvbWUuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=