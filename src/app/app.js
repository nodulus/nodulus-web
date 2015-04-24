import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MQTTEventBridge} from '../io/mqtt-event-bridge';

// import ViewStyleCustomElement from '../behaviors/view-style/view-style';

export class App {
  static inject() { return [Router, EventAggregator, MQTTEventBridge]; }

  constructor(router, eventAggregator, mqtt) {
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

    this.eventAggregator.subscribe('mqtt-event-bridge', payload => {
      if (payload == 'connected') {
        this.mqtt.subscribe('broadcast/#');
        this.mqtt.subscribe('owntracks/#');
        this.mqtt.subscribe('welcome/#');
      }
    });
  }
}
