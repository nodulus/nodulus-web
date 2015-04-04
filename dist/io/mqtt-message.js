System.register(["paho"], function (_export) {
  var Paho, _classCallCheck, MQTTMessage;

  return {
    setters: [function (_paho) {
      Paho = _paho["default"];
    }],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      MQTTMessage = _export("MQTTMessage", function MQTTMessage(topic, payload) {
        var io = arguments[2] === undefined ? "outbound" : arguments[2];

        _classCallCheck(this, MQTTMessage);

        // convert incoming mqtt message
        if (topic instanceof Paho.MQTT.Message) {
          // overloaded args
          var message = topic;

          this.topic = payload;
          this.io = "inbound";

          this.payload = message.payloadString;
          this.raw = message;

          return;
        }

        // build outgoing app message
        this.topic = topic;
        this.payload = payload;
        this.io = io;
      });
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQtbWVzc2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO01BQU8sSUFBSSxtQkFFRSxXQUFXOzs7O0FBRmpCLFVBQUk7Ozs7Ozs7QUFFRSxpQkFBVywwQkFDWCxTQURBLFdBQVcsQ0FDVixLQUFLLEVBQUUsT0FBTyxFQUFtQjtZQUFqQixFQUFFLGdDQUFHLFVBQVU7OzhCQURoQyxXQUFXOzs7QUFHcEIsWUFBSSxLQUFLLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRXRDLGNBQUksT0FBTyxHQUFHLEtBQUssQ0FBQzs7QUFFcEIsY0FBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDckIsY0FBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7O0FBRXBCLGNBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUNyQyxjQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQzs7QUFFbkIsaUJBQU87U0FDUjs7O0FBR0QsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsWUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7T0FDZCIsImZpbGUiOiJpby9tcXR0LW1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=