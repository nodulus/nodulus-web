import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MQTTEventBridge} from '../io/mqtt-event-bridge';

// import ViewStyleCustomElement from '../behaviors/view-style/view-style';

@inject(Router, EventAggregator, MQTTEventBridge)
export class App {

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

    this.mqtt.configure({
      uri: 'http://mashtun.homebrew.lan:1884',
      qos: 1
    });

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
