import {transient, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {AppConfig} from '../../app';

@transient()
@inject(AppConfig, HttpClient)
export class Message {
  constructor(config, http) {
    this.config = config.entities;
    this.options = {uri: '/'};
    this.http = http;

    this.name = 'message';

    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(this.config.uri + '/' + this.name);
    });
  }

  list() {
    return this.http.fetch();
  }

  get(id) {
    return this.http.fetch('/' + id);
  }

  create(message) {
    return this.http.fetch('', {
      method: 'post',
      body: message
    });
  }

  update(message) {
    return this.http.fetch('/' + message.id, {
      method: 'put',
      body: message
    });
  }

  destroy(id) {
    return this.http.fetch('/' + id, {
      method: 'delete'
    }); 
  }
}
