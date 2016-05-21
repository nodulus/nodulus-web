console.log('Bahn Commander is GO!');

import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export class AppConfig {
  constructor() {
    this.entities = {
      uri: 'http://localhost:3000'
    }

    this.rethinkdb = {
      uri: 'ws://localhost:28015/bahn_commander'
    }

    this.mqtt = {
      uri: 'ws://mashtun.homebrew.lan:1884',
      qos: 1
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
