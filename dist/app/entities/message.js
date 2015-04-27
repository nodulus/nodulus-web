System.register(['aurelia-framework', 'aurelia-http-client', '../../app'], function (_export) {
  var transient, inject, HttpClient, AppConfig, _classCallCheck, _createClass, Message;

  return {
    setters: [function (_aureliaFramework) {
      transient = _aureliaFramework.transient;
      inject = _aureliaFramework.inject;
    }, function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }, function (_app) {
      AppConfig = _app.AppConfig;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Message = (function () {
        function Message(config, http) {
          var _this = this;

          _classCallCheck(this, _Message);

          this.config = config.entities;
          this.options = { uri: '/' };
          this.http = http;

          this.name = 'message';

          http.configure(function (x) {
            x.withBaseUri(_this.config.uri + '/' + _this.name);
          });
        }

        var _Message = Message;

        _createClass(_Message, [{
          key: 'list',
          value: function list() {
            return this.http.get();
          }
        }, {
          key: 'get',
          value: function get(id) {
            return this.http.get('/' + id);
          }
        }, {
          key: 'create',
          value: function create(message) {
            return this.http.post('', message);
          }
        }, {
          key: 'update',
          value: function update(message) {
            return this.http.put('/' + message.id, message);
          }
        }, {
          key: 'destroy',
          value: function destroy(id) {
            return this.http['delete']('/' + id);
          }
        }]);

        Message = inject(AppConfig, HttpClient)(Message) || Message;
        Message = transient()(Message) || Message;
        return Message;
      })();

      _export('Message', Message);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9lbnRpdGllcy9tZXNzYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7K0VBTWEsT0FBTzs7OztvQ0FOWixTQUFTO2lDQUFFLE1BQU07O3NDQUNqQixVQUFVOzt1QkFDVixTQUFTOzs7Ozs7Ozs7QUFJSixhQUFPO0FBQ1AsaUJBREEsT0FBTyxDQUNOLE1BQU0sRUFBRSxJQUFJLEVBQUU7Ozs7O0FBQ3hCLGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUM5QixjQUFJLENBQUMsT0FBTyxHQUFHLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFDO0FBQzFCLGNBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixjQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzs7QUFFdEIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUNsQixhQUFDLENBQUMsV0FBVyxDQUFDLE1BQUssTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBSyxJQUFJLENBQUMsQ0FBQztXQUNsRCxDQUFDLENBQUM7U0FDSjs7dUJBWFUsT0FBTzs7OztpQkFhZCxnQkFBRztBQUNMLG1CQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDeEI7OztpQkFFRSxhQUFDLEVBQUUsRUFBRTtBQUNOLG1CQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztXQUNoQzs7O2lCQUVLLGdCQUFDLE9BQU8sRUFBRTtBQUNkLG1CQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztXQUNwQzs7O2lCQUVLLGdCQUFDLE9BQU8sRUFBRTtBQUNkLG1CQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1dBQ2pEOzs7aUJBRU0saUJBQUMsRUFBRSxFQUFFO0FBQ1gsbUJBQU8sSUFBSSxDQUFDLElBQUksVUFBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztXQUNsQzs7O0FBL0JVLGVBQU8sR0FEbkIsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FDakIsT0FBTyxLQUFQLE9BQU87QUFBUCxlQUFPLEdBRm5CLFNBQVMsRUFBRSxDQUVDLE9BQU8sS0FBUCxPQUFPO2VBQVAsT0FBTzs7O3lCQUFQLE9BQU8iLCJmaWxlIjoiYXBwL2VudGl0aWVzL21lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=