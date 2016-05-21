import url from 'url';

export class MQTTConfig {
  constructor(config = {}) {
    this.clientID = config.clientID || undefined;
    this.uri = config.uri || 'ws://localhost:8884';
    this.qos = config.qos || 0;

    this.prefix = config.prefix || '';

    this.url = url.parse(this.uri);
  }

  get hostname() {
    return url.parse(this.uri).hostname;
  }

  get port() {
    return +(url.parse(this.uri).port);
  }

  // get database() {
  //   return url.parse(this.uri).path.replace(/(^\/)|(\/$)/g, '');
  // }
}
