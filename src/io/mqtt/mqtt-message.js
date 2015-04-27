import Paho from 'paho';

export class MQTTMessage {
  constructor(topic, payload, io = 'outbound') {
    // convert incoming mqtt message
    if (topic instanceof Paho.MQTT.Message) {
      // overloaded args
      var message = topic;

      this.topic = payload;
      this.io = 'inbound';

      this.payload = message.payloadString;
      this.raw = message;

      return;
    }

    // build outgoing app message
    this.topic = topic;
    this.payload = payload;
    this.io = io;
  }
}
