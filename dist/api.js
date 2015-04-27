System.register([], function (_export) {
  var marked0$0, koa, serve, parse, router, http, r, config, app;

  function createConnection(next) {
    var conn;
    return regeneratorRuntime.wrap(function createConnection$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return r.connect(config.rethinkdb);

        case 3:
          conn = context$1$0.sent;

          this._rdbConn = conn;
          context$1$0.next = 11;
          break;

        case 7:
          context$1$0.prev = 7;
          context$1$0.t0 = context$1$0['catch'](0);

          this.status = 500;
          this.body = e.message || http.STATUS_CODES[this.status];

        case 11:
          context$1$0.next = 13;
          return next;

        case 13:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[0], this, [[0, 7]]);
  }

  function get(next) {
    var cursor, result;
    return regeneratorRuntime.wrap(function get$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return r.table('messages').orderBy({
            index: 'createdAt'
          }).run(this._rdbConn);

        case 3:
          cursor = context$1$0.sent;
          context$1$0.next = 6;
          return cursor.toArray();

        case 6:
          result = context$1$0.sent;

          this.body = JSON.stringify(result);
          context$1$0.next = 14;
          break;

        case 10:
          context$1$0.prev = 10;
          context$1$0.t1 = context$1$0['catch'](0);

          this.status = 500;
          this.body = context$1$0.t1.message || http.STATUS_CODES[this.status];

        case 14:
          context$1$0.next = 16;
          return next;

        case 16:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[1], this, [[0, 10]]);
  }

  function create(next) {
    var message, result;
    return regeneratorRuntime.wrap(function create$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return parse(this);

        case 3:
          message = context$1$0.sent;

          message.createdAt = r.now();context$1$0.next = 7;
          return r.table('messages').insert(message, {
            returnVals: true
          }).run(this._rdbConn);

        case 7:
          result = context$1$0.sent;

          message = result.new_val;
          this.body = JSON.stringify(message);
          context$1$0.next = 16;
          break;

        case 12:
          context$1$0.prev = 12;
          context$1$0.t2 = context$1$0['catch'](0);

          this.status = 500;
          this.body = context$1$0.t2.message || http.STATUS_CODES[this.status];

        case 16:
          context$1$0.next = 18;
          return next;

        case 18:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[2], this, [[0, 12]]);
  }

  function update(next) {
    var message, result;
    return regeneratorRuntime.wrap(function update$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return parse(this);

        case 3:
          message = context$1$0.sent;

          delete message._saving;

          if (!(message == null || message.id == null)) {
            context$1$0.next = 7;
            break;
          }

          throw new Error('The message must have a field `id`.');

        case 7:
          context$1$0.next = 9;
          return r.table('messages').get(message.id).update(message, {
            returnVals: true
          }).run(this._rdbConn);

        case 9:
          result = context$1$0.sent;

          this.body = JSON.stringify(result.new_val);
          context$1$0.next = 17;
          break;

        case 13:
          context$1$0.prev = 13;
          context$1$0.t3 = context$1$0['catch'](0);

          this.status = 500;
          this.body = context$1$0.t3.message || http.STATUS_CODES[this.status];

        case 17:
          context$1$0.next = 19;
          return next;

        case 19:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[3], this, [[0, 13]]);
  }

  function del(next) {
    var message, result;
    return regeneratorRuntime.wrap(function del$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return parse(this);

        case 3:
          message = context$1$0.sent;

          if (!(message == null || message.id == null)) {
            context$1$0.next = 6;
            break;
          }

          throw new Error('The message must have a field `id`.');

        case 6:
          context$1$0.next = 8;
          return r.table('messages').get(message.id)['delete']().run(this._rdbConn);

        case 8:
          result = context$1$0.sent;

          this.body = '';
          context$1$0.next = 16;
          break;

        case 12:
          context$1$0.prev = 12;
          context$1$0.t4 = context$1$0['catch'](0);

          this.status = 500;
          this.body = context$1$0.t4.message || http.STATUS_CODES[this.status];

        case 16:
          context$1$0.next = 18;
          return next;

        case 18:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[4], this, [[0, 12]]);
  }

  function closeConnection(next) {
    return regeneratorRuntime.wrap(function closeConnection$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          this._rdbConn.close();

        case 1:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[5], this);
  }

  function startKoa() {
    app.listen(config.koa.port);
    console.log('Listening on port ' + config.koa.port);
  }
  return {
    setters: [],
    execute: function () {
      'use strict';

      marked0$0 = [createConnection, get, create, update, del, closeConnection].map(regeneratorRuntime.mark);
      koa = require('koa');
      serve = require('koa-static');
      parse = require('co-body');
      router = require('koa-router');
      http = require('http');
      r = require('rethinkdb');
      config = module.exports = {
        rethinkdb: {
          host: 'localhost',
          port: 28015,
          authKey: '',
          db: 'bahn_commander'
        },
        koa: {
          port: 3000
        }
      };
      app = koa();

      app.use(serve(__dirname + '/../dist'));

      app.use(createConnection);

      app.use(router(app));
      app.get('/message/get', get);
      app.put('/message/new', create);
      app.post('/message/update', update);
      app.post('/message/delete', del);

      app.use(closeConnection);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixXQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDckQ7Ozs7OzttQkFsSVMsZ0JBQWdCLEVBYWhCLEdBQUcsRUFlSCxNQUFNLEVBb0JOLE1BQU0sRUFzQk4sR0FBRyxFQW9CSCxlQUFlO0FBdElyQixTQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUdwQixXQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUM3QixXQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUMxQixZQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztBQUM5QixVQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUd0QixPQUFDLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUd4QixZQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUM1QixpQkFBUyxFQUFFO0FBQ1QsY0FBSSxFQUFFLFdBQVc7QUFDakIsY0FBSSxFQUFFLEtBQUs7QUFDWCxpQkFBTyxFQUFFLEVBQUU7QUFDWCxZQUFFLEVBQUUsZ0JBQWdCO1NBQ3JCO0FBQ0QsV0FBRyxFQUFFO0FBQ0gsY0FBSSxFQUFFLElBQUk7U0FDWDtPQUNGO0FBRUcsU0FBRyxHQUFHLEdBQUcsRUFBRTs7QUFHZixTQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQzs7QUFHdkMsU0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUUxQixTQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLFNBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFNBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLFNBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFHakMsU0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyIsImZpbGUiOiJhcGkuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=