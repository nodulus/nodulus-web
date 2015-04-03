import {Router} from 'aurelia-router';
import MQTTEventBridge from '../io/mqtt-event-bridge';

// import ViewStyleCustomElement from '../behaviors/view-style/view-style';

export class App {
  static inject() { return [Router, MQTTEventBridge]; }
  constructor(router, mqtt) {
    this.mqtt = mqtt;
    this.router = router;
    this.router.configure(config => {
      config.title = 'Bahn Commander';
      config.options.pushState = true;
      config.map([
        { route: ['', 'welcome'], moduleId: 'app/routes/welcome/welcome', nav: true, title:'Welcome' },
        { route: 'deuce',         moduleId: 'app/routes/deuce/deuce',   nav: true }
      ]);
    });
  }
}
