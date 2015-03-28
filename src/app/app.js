import {Router} from 'aurelia-router';
import bootstrap from 'bootstrap';

export class App {
  static inject() { return [Router]; }
  constructor(router) {
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
