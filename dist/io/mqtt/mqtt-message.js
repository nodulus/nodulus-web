System.register(['paho'], function (_export) {
  var Paho, _classCallCheck, MQTTMessage;

  return {
    setters: [function (_paho) {
      Paho = _paho['default'];
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      MQTTMessage = function MQTTMessage(topic, payload) {
        var io = arguments[2] === undefined ? 'outbound' : arguments[2];

        _classCallCheck(this, MQTTMessage);

        if (topic instanceof Paho.MQTT.Message) {
          var message = topic;

          this.topic = payload;
          this.io = 'inbound';

          this.payload = message.payloadString;
          this.raw = message;

          return;
        }

        this.topic = topic;
        this.payload = payload;
        this.io = io;
      };

      _export('MQTTMessage', MQTTMessage);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQvbXF0dC1tZXNzYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7NkJBRWEsV0FBVzs7Ozs7Ozs7Ozs7QUFBWCxpQkFBVyxHQUNYLFNBREEsV0FBVyxDQUNWLEtBQUssRUFBRSxPQUFPLEVBQW1CO1lBQWpCLEVBQUUsZ0NBQUcsVUFBVTs7OEJBRGhDLFdBQVc7O0FBR3BCLFlBQUksS0FBSyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBRXRDLGNBQUksT0FBTyxHQUFHLEtBQUssQ0FBQzs7QUFFcEIsY0FBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDckIsY0FBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7O0FBRXBCLGNBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUNyQyxjQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQzs7QUFFbkIsaUJBQU87U0FDUjs7QUFHRCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixZQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixZQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztPQUNkOzs2QkFwQlUsV0FBVyIsImZpbGUiOiJpby9tcXR0L21xdHQtbWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==