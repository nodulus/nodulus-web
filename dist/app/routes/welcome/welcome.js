System.register(['aurelia-framework', 'aurelia-event-aggregator', '../../entities/message', '../../../io/mqtt/mqtt-message'], function (_export) {
  var inject, EventAggregator, Message, MQTTMessage, _classCallCheck, _createClass, Welcome, UpperValueConverter;

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9yb3V0ZXMvd2VsY29tZS93ZWxjb21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7b0ZBTWEsT0FBTyxFQW9CUCxtQkFBbUI7Ozs7aUNBMUJ4QixNQUFNOztnREFDTixlQUFlOztpQ0FDZixPQUFPOzt1Q0FDUCxXQUFXOzs7Ozs7Ozs7QUFHTixhQUFPO0FBQ1AsaUJBREEsT0FBTyxDQUNOLGVBQWUsRUFBRSxPQUFPLEVBQUU7OztBQUNwQyxjQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQzs7QUFFdkMsY0FBSSxDQUFDLE9BQU8sR0FBRywrQ0FBK0MsQ0FBQztBQUMvRCxjQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUN4QixjQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN2Qjs7dUJBUFUsT0FBTzs7OztlQVNOLFlBQUc7QUFDYix3QkFBVSxJQUFJLENBQUMsU0FBUyxTQUFJLElBQUksQ0FBQyxRQUFRLENBQUc7V0FDN0M7OztpQkFFTSxtQkFBRztBQUNSLGdCQUFJLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELGdCQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUV2Qzs7O0FBakJVLGVBQU8sR0FEbkIsTUFBTSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FDcEIsT0FBTyxLQUFQLE9BQU87ZUFBUCxPQUFPOzs7eUJBQVAsT0FBTzs7QUFvQlAseUJBQW1CO2lCQUFuQixtQkFBbUI7Z0NBQW5CLG1CQUFtQjs7O3FCQUFuQixtQkFBbUI7O2lCQUN4QixnQkFBQyxLQUFLLEVBQUM7QUFDWCxtQkFBTyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1dBQ3JDOzs7ZUFIVSxtQkFBbUI7OztxQ0FBbkIsbUJBQW1CIiwiZmlsZSI6ImFwcC9yb3V0ZXMvd2VsY29tZS93ZWxjb21lLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9