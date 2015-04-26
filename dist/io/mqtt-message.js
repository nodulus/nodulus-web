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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQtbWVzc2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzZCQUVhLFdBQVc7Ozs7Ozs7Ozs7O0FBQVgsaUJBQVcsR0FDWCxTQURBLFdBQVcsQ0FDVixLQUFLLEVBQUUsT0FBTyxFQUFtQjtZQUFqQixFQUFFLGdDQUFHLFVBQVU7OzhCQURoQyxXQUFXOztBQUdwQixZQUFJLEtBQUssWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUV0QyxjQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7O0FBRXBCLGNBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDOztBQUVwQixjQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDckMsY0FBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7O0FBRW5CLGlCQUFPO1NBQ1I7O0FBR0QsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsWUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7T0FDZDs7NkJBcEJVLFdBQVciLCJmaWxlIjoiaW8vbXF0dC1tZXNzYWdlLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9