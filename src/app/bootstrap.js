import {App} from './app';

export function configure() {
  console.log(arguments);
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.start().then(a => a.setRoot('app/app', document.body));
}
