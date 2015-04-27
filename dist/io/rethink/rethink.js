System.register(['aurelia-framework', 'aurelia-event-aggregator', 'rethinkdb', './rethink-config'], function (_export) {
  var inject, EventAggregator, db, RethinkConfig, _classCallCheck, _createClass, Rethink;

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_rethinkdb) {
      db = _rethinkdb['default'];
    }, function (_rethinkConfig) {
      RethinkConfig = _rethinkConfig.RethinkConfig;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Rethink = (function () {
        function Rethink(eventAggregator) {
          _classCallCheck(this, _Rethink);

          this.eventAggregator = eventAggregator;

          this.options = new RethinkConfig();
          this.db = this.options.db;
        }

        var _Rethink = Rethink;

        _createClass(_Rethink, [{
          key: 'configure',
          value: function configure(callbackOrConfig) {
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
        }, {
          key: 'connect',
          value: function connect() {
            if (!this.promise) {
              console.log('creating rethink connection', this.options.get());
              this.promise = db.connect(this.options.get());
              this.promise.then(this.onConnect.bind(this)).error(this.onConnectError.bind(this));
            }
            return this.promise;
          }
        }, {
          key: 'reconnect',
          value: function reconnect() {
            if (!this.conn) {
              return this.connect();
            }
            this.promise = this.conn.reconnect();
            this.promise.then(this.onReconnect.bind(this)).error(this.onReconnectError.bind(this));
            return this.promise;
          }
        }, {
          key: 'disconnect',
          value: function disconnect() {
            if (!this.conn) {
              console.log('nothing to disconnect');
              return;
            }

            var promise = this.conn.close();
            promise.then(this.onClose.bind(this)).error(this.onCloseError.bind(this));
            return promise;
          }
        }, {
          key: 'use',
          value: function use(db) {
            this.db = db;
            return conn.use(db);
          }
        }, {
          key: 'destroy',
          value: function destroy() {
            return this.close();
          }
        }, {
          key: 'onConnect',
          value: function onConnect(conn) {
            console.info('connected to db', conn);
            this.conn = conn;

            con.on('connect', this.onConnect.bind(this));
            con.on('close', this.onClose.bind(this));
            con.on('error', this.onError.bind(this));
          }
        }, {
          key: 'onConnectError',
          value: function onConnectError(err) {
            console.error('error connecting to db', err);
            this.promise = undefined;
          }
        }, {
          key: 'onReconnect',
          value: function onReconnect(conn) {
            console.info('reconnected to db', conn);
          }
        }, {
          key: 'onReconnectError',
          value: function onReconnectError(err) {
            console.error('error reconnecting to db', err);
            this.promise = undefined;
          }
        }, {
          key: 'onClose',
          value: function onClose() {
            console.info('disconnected from db');
            this.promise = undefined;
          }
        }, {
          key: 'onCloseError',
          value: function onCloseError(err) {
            console.error('error disconnecting from db', err);
            this.promise = undefined;
          }
        }, {
          key: 'onError',
          value: function onError(err) {
            console.error('db error', err);
          }
        }], [{
          key: 'r',
          value: db,
          enumerable: true
        }]);

        Rethink = inject(EventAggregator)(Rethink) || Rethink;
        return Rethink;
      })();

      _export('Rethink', Rethink);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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RUFBRSxDQUFDO0FBQ2IsbUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztXQUNyQjs7O2lCQUVNLG1CQUFHO0FBQ1IsbUJBQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1dBQ3JCOzs7aUJBRVEsbUJBQUMsSUFBSSxFQUFFO0FBQ2QsbUJBQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEMsZ0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixlQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdDLGVBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDekMsZUFBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztXQUMxQzs7O2lCQUVhLHdCQUFDLEdBQUcsRUFBRTtBQUNsQixtQkFBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3QyxnQkFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7V0FDMUI7OztpQkFFVSxxQkFBQyxJQUFJLEVBQUU7QUFDaEIsbUJBQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDekM7OztpQkFFZSwwQkFBQyxHQUFHLEVBQUU7QUFDcEIsbUJBQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0MsZ0JBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1dBQzFCOzs7aUJBRU0sbUJBQUc7QUFDUixtQkFBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3JDLGdCQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztXQUMxQjs7O2lCQUVXLHNCQUFDLEdBQUcsRUFBRTtBQUNoQixtQkFBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsRCxnQkFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7V0FDMUI7OztpQkFFTSxpQkFBQyxHQUFHLEVBQUU7QUFDWCxtQkFBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7V0FDaEM7OztpQkFqR1UsRUFBRTs7OztBQURGLGVBQU8sR0FEbkIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUNYLE9BQU8sS0FBUCxPQUFPO2VBQVAsT0FBTzs7O3lCQUFQLE9BQU8iLCJmaWxlIjoiaW8vcmV0aGluay9yZXRoaW5rLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9