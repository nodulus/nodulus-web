import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MQTTEventBridge} from '../io/mqtt/mqtt-event-bridge';
import {AppConfig} from '../app';

@inject(AppConfig, Router, EventAggregator, MQTTEventBridge)
export class App {
  constructor(config, router, eventAggregator, mqtt) {
    this.config = config;
    this.router = router;
    this.eventAggregator = eventAggregator;
    this.mqtt = mqtt;

    this.router.configure(config => {
      config.title = 'Bahn Commander';
      config.options.pushState = true;
      // Add auth route filter
      // config.addPipelineStep('authorize', AuthorizeStep);
      config.map([
        { route: ['welcome'],    moduleId: 'app/routes/welcome/welcome',      nav: true,             title: 'Welcome' },
        { route: 'grid',         moduleId: 'app/routes/grid/grid',            nav: true,             title: 'Grid' },
        { route: 'settings',     moduleId: 'app/routes/settings/settings',    nav: true, auth: true, title: 'Settings' },
        { route: '',             redirect: 'welcome' }
      ]);
    });

    this.mqtt.configure(this.config.mqtt);

    this.eventAggregator.subscribe('mqtt-event-bridge', payload => {
      if (payload == 'connected') {
        this.mqtt.subscribe('broadcast/#');
        this.mqtt.subscribe('owntracks/#');
        this.mqtt.subscribe('welcome/#');
      }
    });

    this.mqtt.connect();
  }
}


class AuthorizeStep {
  run(routingContext, next) {
    // Check if the route has an "auth" key
    // The reason for using `nextInstructions` is because
    // this includes child routes.
    if (routingContext.nextInstructions.some(i => i.config.auth)) {
      // todo: (iw) do auth here
      var isLoggedIn = false;
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}
