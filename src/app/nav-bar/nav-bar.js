import {Behavior} from 'aurelia-framework';

export class NavBar {
  static metadata(){
    return Behavior
      .withProperty('router');
    }

  constructor() {
    this.open = false;
  }

  toggle(open) {
    this.open = open || !this.open;
  }
}
