import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import db from 'rethinkdb';
import {RethinkConfig} from './rethink-config';

@inject(EventAggregator)
export class Rethink {
  static r = db;

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    this.options = new RethinkConfig();
    this.db = this.options.db;
  }

  configure(callbackOrConfig) {
    this.isConfigured = true;

    if (typeof callbackOrConfig == 'function') {
      callbackOrConfig(this.options);
    } else if (RethinkConfig.isPrototypeOf(callbackOrConfig)) {
      this.options = callbackOrConfig;
    } else {
      this.options = new RethinkConfig(callbackOrConfig);
    }

    return this;
  }

  // connect to mqtt
  connect() {
    if (!this.promise) {
      console.log('creating rethink connection', this.options.get());
      this.promise = db.connect(this.options.get());
      this.promise.then(this.onConnect.bind(this)).error(this.onConnectError.bind(this));
    }
    return this.promise;
  }

  reconnect() {
    if (!this.conn) {
      return this.connect();
    }
    this.promise = this.conn.reconnect();
    this.promise.then(this.onReconnect.bind(this)).error(this.onReconnectError.bind(this));
    return this.promise;
  }

  disconnect() {
    if (!this.conn) {
      console.log('nothing to disconnect');
      return;
    }

    var promise = this.conn.close();
    promise.then(this.onClose.bind(this)).error(this.onCloseError.bind(this));
    return promise;
  }

  use(db) {
    this.db = db;
    return conn.use(db);
  }

  destroy() {
    return this.close();
  }

  onConnect(conn) {
    console.info('connected to db', conn);
    this.conn = conn;

    con.on('connect', this.onConnect.bind(this));
    con.on('close', this.onClose.bind(this));
    con.on('error', this.onError.bind(this));
  }

  onConnectError(err) {
    console.error('error connecting to db', err);
    this.promise = undefined;
  }

  onReconnect(conn) {
    console.info('reconnected to db', conn);
  }

  onReconnectError(err) {
    console.error('error reconnecting to db', err);
    this.promise = undefined;
  }

  onClose() {
    console.info('disconnected from db');
    this.promise = undefined;
  }

  onCloseError(err) {
    console.error('error disconnecting from db', err);
    this.promise = undefined;
  }

  onError(err) {
    console.error('db error', err);
  }
}
