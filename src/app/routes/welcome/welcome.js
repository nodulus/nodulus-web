import {EventAggregator} from 'aurelia-event-aggregator';
import {MQTTMessage} from 'bahn-commander/io/mqtt-message';

export class Welcome {
  static inject(){ return [EventAggregator]; }

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    this.heading = 'Welcome to the Bahn Commander Navigation App!';
    this.firstName = 'John';
    this.lastName = 'Doe';
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  welcome() {
    console.log(this.eventAggregator);
    var message = new MQTTMessage('welcome', this.fullName);
    this.eventAggregator.publish(message);
  }
}

export class UpperValueConverter {
  toView(value){
    return value && value.toUpperCase();
  }
}
