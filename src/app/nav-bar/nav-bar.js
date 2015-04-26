import {bindable} from 'aurelia-framework';

export class NavBar {
  @bindable router = null;

  constructor() {
    this.open = false;
  }

  toggle(open) {
    this.open = open || !this.open;
  }
}
