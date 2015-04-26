console.log('Bahn Commander is GO!');

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
