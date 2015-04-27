System.register(['aurelia-framework', 'aurelia-http-client', '../app'], function (_export) {
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
        function Message(http) {
          var _this = this;

          _classCallCheck(this, _Message);

          this.config = { uri: 'abc/123' };
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

        Message = inject(HttpClient)(Message) || Message;
        Message = transient()(Message) || Message;
        return Message;
      })();

      _export('Message', Message);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9lbnRpdGllcy9tZXNzYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7K0VBTWEsT0FBTzs7OztvQ0FOWixTQUFTO2lDQUFFLE1BQU07O3NDQUNqQixVQUFVOzt1QkFDVixTQUFTOzs7Ozs7Ozs7QUFJSixhQUFPO0FBQ1AsaUJBREEsT0FBTyxDQUNOLElBQUksRUFBRTs7Ozs7QUFFaEIsY0FBSSxDQUFDLE1BQU0sR0FBRyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQztBQUMvQixjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsY0FBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRXRCLGNBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDbEIsYUFBQyxDQUFDLFdBQVcsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQUssSUFBSSxDQUFDLENBQUM7V0FDbEQsQ0FBQyxDQUFDO1NBQ0o7O3VCQVhVLE9BQU87Ozs7aUJBYWQsZ0JBQUc7QUFDTCxtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQ3hCOzs7aUJBRUUsYUFBQyxFQUFFLEVBQUU7QUFDTixtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7V0FDaEM7OztpQkFFSyxnQkFBQyxPQUFPLEVBQUU7QUFDZCxtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7V0FDcEM7OztpQkFFSyxnQkFBQyxPQUFPLEVBQUU7QUFDZCxtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztXQUNqRDs7O2lCQUVNLGlCQUFDLEVBQUUsRUFBRTtBQUNYLG1CQUFPLElBQUksQ0FBQyxJQUFJLFVBQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7V0FDbEM7OztBQS9CVSxlQUFPLEdBRG5CLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FDTixPQUFPLEtBQVAsT0FBTztBQUFQLGVBQU8sR0FGbkIsU0FBUyxFQUFFLENBRUMsT0FBTyxLQUFQLE9BQU87ZUFBUCxPQUFPOzs7eUJBQVAsT0FBTyIsImZpbGUiOiJhcHAvZW50aXRpZXMvbWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==