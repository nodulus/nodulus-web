import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AppConfig} from '../../../app';
import {Message} from '../../entities/message';
import {MQTTMessage} from '../../../io/mqtt/mqtt-message';

@inject(EventAggregator, Message)
export class Welcome {
  constructor(eventAggregator, message) {
    this.eventAggregator = eventAggregator;
    this.message = message;

    this.heading = 'Stupid MQTT event bridge test';
    
    this.firstName = 'Bob';
    this.lastName = 'Dylan';
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  welcome() {
    var message = new MQTTMessage('welcome', this.fullName);
    this.eventAggregator.publish(message);
    this.message.create(message);
  }
}

export class UpperValueConverter {
  toView(value) {
    return value && value.toUpperCase();
  }
}
