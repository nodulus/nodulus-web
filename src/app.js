import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export class AppConfig {
  constructor() {
    // MQTT client
    //  if using Websockets, make sure your Mosquitto server is built and configured correctly
    this.mqtt = {
      uri: 'ws://mashtun.homebrew.lan:1884',
      qos: 1
    }

    // REST api base url
    this.entities = {
      uri: 'http://localhost:3000'
    }

    // Websocket connection to RethinkDB
    // FIXME: this is disabled, it didn't cut the mustard
    this.rethinkdb = {
      uri: 'ws://localhost:28015/nodulus_web'
    }
  }
};

export function configure (aurelia) {
  console.log('configure app', aurelia);
  
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .history()
    .router()
    .eventAggregator();

  if (true) {
    aurelia.use.developmentLogging();
  }

  return aurelia.start().then(function (a) {
    return a.setRoot('app/app', document.getElementById('page-host'));
  });
}
