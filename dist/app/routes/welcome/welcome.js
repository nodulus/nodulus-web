System.register(['aurelia-framework', 'aurelia-event-aggregator', '../../../app', '../../entities/message', '../../../io/mqtt/mqtt-message'], function (_export) {
  var inject, EventAggregator, AppConfig, Message, MQTTMessage, _classCallCheck, _createClass, Welcome, UpperValueConverter;

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_app) {
      AppConfig = _app.AppConfig;
    }, function (_entitiesMessage) {
      Message = _entitiesMessage.Message;
    }, function (_ioMqttMqttMessage) {
      MQTTMessage = _ioMqttMqttMessage.MQTTMessage;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Welcome = (function () {
        function Welcome(eventAggregator, message) {
          _classCallCheck(this, _Welcome);

          this.eventAggregator = eventAggregator;
          this.message = message;

          this.heading = 'Welcome to the Bahn Commander Navigation App!';
          this.firstName = 'John';
          this.lastName = 'Doe';
        }

        var _Welcome = Welcome;

        _createClass(_Welcome, [{
          key: 'fullName',
          get: function () {
            return '' + this.firstName + ' ' + this.lastName;
          }
        }, {
          key: 'welcome',
          value: function welcome() {
            var message = new MQTTMessage('welcome', this.fullName);
            this.eventAggregator.publish(message);
            this.message.create(message);
          }
        }]);

        Welcome = inject(EventAggregator, Message)(Welcome) || Welcome;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9yb3V0ZXMvd2VsY29tZS93ZWxjb21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7K0ZBT2EsT0FBTyxFQXFCUCxtQkFBbUI7Ozs7aUNBNUJ4QixNQUFNOztnREFDTixlQUFlOzt1QkFDZixTQUFTOztpQ0FDVCxPQUFPOzt1Q0FDUCxXQUFXOzs7Ozs7Ozs7QUFHTixhQUFPO0FBQ1AsaUJBREEsT0FBTyxDQUNOLGVBQWUsRUFBRSxPQUFPLEVBQUU7OztBQUNwQyxjQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUN2QyxjQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdkIsY0FBSSxDQUFDLE9BQU8sR0FBRywrQ0FBK0MsQ0FBQztBQUMvRCxjQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUN4QixjQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN2Qjs7dUJBUlUsT0FBTzs7OztlQVVOLFlBQUc7QUFDYix3QkFBVSxJQUFJLENBQUMsU0FBUyxTQUFJLElBQUksQ0FBQyxRQUFRLENBQUc7V0FDN0M7OztpQkFFTSxtQkFBRztBQUNSLGdCQUFJLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELGdCQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QyxnQkFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7V0FDOUI7OztBQWxCVSxlQUFPLEdBRG5CLE1BQU0sQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQ3BCLE9BQU8sS0FBUCxPQUFPO2VBQVAsT0FBTzs7O3lCQUFQLE9BQU87O0FBcUJQLHlCQUFtQjtpQkFBbkIsbUJBQW1CO2dDQUFuQixtQkFBbUI7OztxQkFBbkIsbUJBQW1COztpQkFDeEIsZ0JBQUMsS0FBSyxFQUFDO0FBQ1gsbUJBQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztXQUNyQzs7O2VBSFUsbUJBQW1COzs7cUNBQW5CLG1CQUFtQiIsImZpbGUiOiJhcHAvcm91dGVzL3dlbGNvbWUvd2VsY29tZS5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==