export class MQTTMessage {
  constructor(topic, payload, io = 'outbound') {
    // build outgoing app message
    this.topic = topic;
    this.payload = payload;
    this.io = io;
  }
}
