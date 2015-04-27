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
          cursor = r.table('messages');

          if (this.params.id) {
            cursor = cursor.get(this.params.id);
          } else {
            cursor = cursor.orderBy({
              index: 'createdAt'
            });
          }

          context$1$0.prev = 2;
          context$1$0.next = 5;
          return cursor.run(this._rdbConn);

        case 5:
          cursor = context$1$0.sent;
          context$1$0.next = 8;
          return cursor.toArray();

        case 8:
          result = context$1$0.sent;

          this.body = JSON.stringify(result);
          context$1$0.next = 17;
          break;

        case 12:
          context$1$0.prev = 12;
          context$1$0.t1 = context$1$0['catch'](2);

          console.error(context$1$0.t1);
          this.status = 500;
          this.body = context$1$0.t1.message || http.STATUS_CODES[this.status];

        case 17:
          context$1$0.next = 19;
          return next;

        case 19:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[1], this, [[2, 12]]);
  }

  function create(next) {
    var message, result;
    return regeneratorRuntime.wrap(function create$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;

          console.log(parse.json(this));

          context$1$0.next = 4;
          return parse.json(this);

        case 4:
          message = context$1$0.sent;

          message.createdAt = r.now();context$1$0.next = 8;
          return r.table('messages').insert(message, {
            returnChanges: true
          }).run(this._rdbConn);

        case 8:
          result = context$1$0.sent;

          message = result.new_val;

          console.log('result', result);
          this.body = JSON.stringify(message);
          context$1$0.next = 19;
          break;

        case 14:
          context$1$0.prev = 14;
          context$1$0.t2 = context$1$0['catch'](0);

          console.error(context$1$0.t2);
          this.status = 500;
          this.body = context$1$0.t2.message || http.STATUS_CODES[this.status];

        case 19:
          context$1$0.next = 21;
          return next;

        case 21:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[2], this, [[0, 14]]);
  }

  function update(next) {
    var message, result;
    return regeneratorRuntime.wrap(function update$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return parse.json(this);

        case 3:
          message = context$1$0.sent;

          delete message._saving;

          if (!(!message || !message.id)) {
            context$1$0.next = 7;
            break;
          }

          throw new Error('The message must have a field `id`.');

        case 7:
          context$1$0.next = 9;
          return r.table('messages').get(message.id).update(message, {
            returnChanges: true
          }).run(this._rdbConn);

        case 9:
          result = context$1$0.sent;

          this.body = JSON.stringify(result.new_val);
          context$1$0.next = 18;
          break;

        case 13:
          context$1$0.prev = 13;
          context$1$0.t3 = context$1$0['catch'](0);

          console.error(context$1$0.t3);
          this.status = 500;
          this.body = context$1$0.t3.message || http.STATUS_CODES[this.status];

        case 18:
          context$1$0.next = 20;
          return next;

        case 20:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[3], this, [[0, 13]]);
  }

  function del(next) {
    var id, message, result;
    return regeneratorRuntime.wrap(function del$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          id = this.params.id;
          context$1$0.prev = 1;
          context$1$0.next = 4;
          return parse(this);

        case 4:
          message = context$1$0.sent;

          if (!(!id && (!message || !message.id))) {
            context$1$0.next = 7;
            break;
          }

          throw new Error('Missing message id.');

        case 7:
          context$1$0.next = 9;
          return r.table('messages').get(id || message.id)['delete']().run(this._rdbConn);

        case 9:
          result = context$1$0.sent;

          this.body = '';
          context$1$0.next = 18;
          break;

        case 13:
          context$1$0.prev = 13;
          context$1$0.t4 = context$1$0['catch'](1);

          console.error(context$1$0.t4);
          this.status = 500;
          this.body = context$1$0.t4.message || http.STATUS_CODES[this.status];

        case 18:
          context$1$0.next = 20;
          return next;

        case 20:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[4], this, [[1, 13]]);
  }

  function closeConnection(next) {
    return regeneratorRuntime.wrap(function closeConnection$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          this._rdbConn.close();
          context$1$0.next = 3;
          return next;

        case 3:
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

      app.use(regeneratorRuntime.mark(function callee$0$0(next) {
        var start, ms;
        return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
          while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
              start = new Date();
              context$1$0.next = 3;
              return next;

            case 3:
              ms = new Date() - start;

              console.log('%s %s - %s', this.method, this.url, ms);

            case 5:
            case 'end':
              return context$1$0.stop();
          }
        }, callee$0$0, this);
      }));

      app.use(serve(__dirname + '/../dist'));

      app.use(regeneratorRuntime.mark(function callee$0$1(next) {
        return regeneratorRuntime.wrap(function callee$0$1$(context$1$0) {
          while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
              this.set('Access-Control-Allow-Origin', '*');
              context$1$0.next = 3;
              return next;

            case 3:
            case 'end':
              return context$1$0.stop();
          }
        }, callee$0$1, this);
      }));

      app.use(createConnection);

      app.use(router(app));
      app.get('/message', get);
      app.get('/message/:id', get);
      app.post('/message', create);
      app.put('/message', update);
      app.del('/message/:id', del);

      app.use(closeConnection);

      startKoa();
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUFDLFdBQVcsQ0FBQztBQUd4QixZQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUM1QixpQkFBUyxFQUFFO0FBQ1QsY0FBSSxFQUFFLFdBQVc7QUFDakIsY0FBSSxFQUFFLEtBQUs7QUFDWCxpQkFBTyxFQUFFLEVBQUU7QUFDWCxZQUFFLEVBQUUsZ0JBQWdCO1NBQ3JCO0FBQ0QsV0FBRyxFQUFFO0FBQ0gsY0FBSSxFQUFFLElBQUk7U0FDWDtPQUNGO0FBRUcsU0FBRyxHQUFHLEdBQUcsRUFBRTs7QUFHZixTQUFHLENBQUMsR0FBRyx5QkFBQyxvQkFBVyxJQUFJO1lBQ2pCLEtBQUssRUFFTCxFQUFFOzs7O0FBRkYsbUJBQUssR0FBRyxJQUFJLElBQUksRUFBQTs7cUJBQ2QsSUFBSTs7O0FBQ04sZ0JBQUUsR0FBRyxJQUFJLElBQUksRUFBQSxHQUFHLEtBQUs7O0FBQ3pCLHFCQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7Ozs7T0FDdEQsRUFBQyxDQUFDOztBQUdILFNBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDOztBQUd2QyxTQUFHLENBQUMsR0FBRyx5QkFBQyxvQkFBVyxJQUFJOzs7O0FBQ3JCLGtCQUFJLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDOztxQkFDdkMsSUFBSTs7Ozs7OztPQUNYLEVBQUMsQ0FBQzs7QUFHSCxTQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRTFCLFNBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckIsU0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDekIsU0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0IsU0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDN0IsU0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUIsU0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRzdCLFNBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBK0l6QixjQUFRLEVBQUUsQ0FBQyIsImZpbGUiOiJhcGkuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=