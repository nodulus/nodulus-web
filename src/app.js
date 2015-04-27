console.log('Bahn Commander is GO!');

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

  if (true) {
    aurelia.use.developmentLogging();
  }

  aurelia.use.standardConfiguration();
  // aurelia.use.es5();

  return aurelia.start().then(function (a) {
    return a.setRoot('app/app', 'page-host');
  });
}
