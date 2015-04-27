import url from 'url';
import rethink from 'rethinkdb';

export class RethinkConfig {
  constructor(config = {}) {
    this.uri = config.uri || 'ws://localhost:28015/test';
    this.timeout = 20;

    this.url = url.parse(this.uri);
  }

  get hostname() {
    return url.parse(this.uri).hostname;
  }

  get port() {
    return +(url.parse(this.uri).port);
  }

  get db() {
    return url.parse(this.uri).path.replace(/(^\/)/g, '');
  }

  get auth() {
    var auth = url.parse(this.uri).auth,
      parts = auth ? auth.split(':') : [];
    return parts.pop();
  }

  get() {
    return {
      host: this.hostname,
      port: this.port,
      pathname: '/'
    }
  }
}
