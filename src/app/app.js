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
      config.map([
        { route: ['', 'welcome'], moduleId: 'app/routes/welcome/welcome', nav: true, title: 'Welcome' },
        { route: 'grid',         moduleId: 'app/routes/grid/grid',   nav: true, title: 'Grid' }
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
