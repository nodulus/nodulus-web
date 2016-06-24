var koa = require('koa');

// Middleware and helpers
var serve = require('koa-static');
var parse = require('co-body');
var router = require('koa-router');
var http = require('http');

// Import rethinkdb
var r = require('rethinkdb');

// Load config for RethinkDB and koa
var config = module.exports = {
  rethinkdb: {
    host: "localhost",
    port: 28015,
    authKey: "",
    db: "nodulus_web"
  },
  koa: {
    port: 3000
  }
};

var app = koa();

// Logging
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// Static content
app.use(serve(__dirname + '/../dist'));

// CORS
app.use(function *(next) {
  this.set('Access-Control-Allow-Origin', '*');
  yield next;
});

// Create a RethinkDB connection
app.use(createConnection);

app.use(router(app));
app.get('/message', get);
app.get('/message/:id', get);
app.post('/message', create);
app.put('/message', update);
app.del('/message/:id', del);

// Close the RethinkDB connection
app.use(closeConnection);

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
function* createConnection(next) {
  try {
    var conn = yield r.connect(config.rethinkdb);
    this._rdbConn = conn;
  } catch (err) {
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
  yield next;
}

// Retrieve all messages
function* get(next) {
  var cursor = r.table('messages');

  if (this.params.id) {
    cursor = cursor.get(this.params.id);
  } else {
    cursor = cursor.orderBy({
      index: "createdAt"
    });
  }

  try {
    cursor = yield cursor.run(this._rdbConn);
    var result = yield cursor.toArray();
    this.body = JSON.stringify(result);
  } catch (e) {
    console.error(e);
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
  yield next;
}

// Create a new message
function* create(next) {
  try {
    console.log(parse.json(this));
    
    var message = yield parse.json(this);
    message.createdAt = r.now(); // Set the field `createdAt` to the current time
    
    var result = yield r.table('messages').insert(message, {
        returnChanges: true
      }).run(this._rdbConn);

    message = result.new_val; // message now contains the previous message + a field `id` and `createdAt`

    console.log("result", result);
    this.body = JSON.stringify(message);
  } catch (e) {
    console.error(e);
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
  yield next;
}

// Update a message
function* update(next) {
  try {
    var message = yield parse.json(this);
    delete message._saving;
    if (!message || !message.id) {
      throw new Error("The message must have a field `id`.");
    }

    var result = yield r.table('messages').get(message.id).update(message, {
        returnChanges: true
      }).run(this._rdbConn);
    this.body = JSON.stringify(result.new_val);
  } catch (e) {
    console.error(e);
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
  yield next;
}

// Delete a message
function* del(next) {
  var id = this.params.id,
    message;

  try {
    message = yield parse(this);
    if (!id && (!message || !message.id)) throw new Error("Missing message id.");
    var result = yield r.table('messages').get(id || message.id).delete().run(this._rdbConn);
    this.body = "";
  } catch (e) {
    console.error(e);
    this.status = 500;
    this.body = e.message || http.STATUS_CODES[this.status];
  }
  yield next;
}

/*
 * Close the RethinkDB connection
 */
function* closeConnection(next) {
  this._rdbConn.close();
  yield next;
}

// r.connect(config.rethinkdb, function(err, conn) {
//     if (err) {
//         console.log("Could not open a connection to initialize the database");
//         console.log(err.message);
//         process.exit(1);
//     }

//     r.table('messages').indexWait('createdAt').run(conn).then(function(err, result) {
//         console.log("Table and index are available, starting koa...");
//         startKoa();
//     }).error(function(err) {
//         // The database/table/index was not available, create them
//         r.tableCreate('messages').run(conn).finally(function() {
//             r.table('messages').indexCreate('createdAt').run(conn);
//         }).finally(function(result) {
//             r.table('messages').indexWait('createdAt').run(conn)
//         }).then(function(result) {
//             console.log("Table and index are available, starting koa...");
//             startKoa();
//             conn.close();
//         }).error(function(err) {
//             if (err) {
//                 console.log("Could not wait for the completion of the index `messages`");
//                 console.log(err);
//                 process.exit(1);
//             }
//             console.log("Table and index are available, starting koa...");
//             startKoa();
//             conn.close();
//         });
//     });
// });
startKoa();

function startKoa() {
  app.listen(config.koa.port);
  console.log('Listening on port ' + config.koa.port);
}
