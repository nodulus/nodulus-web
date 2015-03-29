import {Behavior} from 'aurelia-templating';

export class ViewStyleCustomElement {
  static metadata(){
    return Behavior.withProperty('href').withView('./view-style.html');
  }
}
