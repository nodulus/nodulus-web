import {transient, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {AppConfig} from '../../app';

@transient()
@inject(AppConfig, HttpClient)
export class Message {
  constructor(config, http) {
    this.config = config.entities;
    this.options = {uri: '/'};
    this.http = http;

    this.name = 'message';

    http.configure(x => {
      x.withBaseUri(this.config.uri + '/' + this.name);
    });
  }

  list() {
    return this.http.get();
  }

  get(id) {
    return this.http.get('/' + id);
  }

  create(message) {
    return this.http.post('', message);
  }

  update(message) {
    return this.http.put('/' + message.id, message);
  }

  destroy(id) {
   return this.http.delete('/' + id); 
  }
}
