import {bindable} from 'aurelia-framework';

export class Panel {
  @bindable title = '';
  @bindable position;
  @bindable content;
}
