System.register(['url', 'rethinkdb'], function (_export) {
  var url, rethink, _classCallCheck, _createClass, RethinkConfig;

  return {
    setters: [function (_url) {
      url = _url['default'];
    }, function (_rethinkdb) {
      rethink = _rethinkdb['default'];
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      RethinkConfig = (function () {
        function RethinkConfig() {
          var config = arguments[0] === undefined ? {} : arguments[0];

          _classCallCheck(this, RethinkConfig);

          this.uri = config.uri || 'ws://localhost:28015/test';
          this.timeout = 20;

          this.url = url.parse(this.uri);
        }

        _createClass(RethinkConfig, [{
          key: 'hostname',
          get: function () {
            return url.parse(this.uri).hostname;
          }
        }, {
          key: 'port',
          get: function () {
            return +url.parse(this.uri).port;
          }
        }, {
          key: 'db',
          get: function () {
            return url.parse(this.uri).path.replace(/(^\/)/g, '');
          }
        }, {
          key: 'auth',
          get: function () {
            var auth = url.parse(this.uri).auth,
                parts = auth ? auth.split(':') : [];
            return parts.pop();
          }
        }, {
          key: 'get',
          value: function get() {
            return {
              host: this.hostname,
              port: this.port,
              pathname: '/'
            };
          }
        }]);

        return RethinkConfig;
      })();

      _export('RethinkConfig', RethinkConfig);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL3JldGhpbmsvcmV0aGluay1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjttREFHYSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7QUFBYixtQkFBYTtBQUNiLGlCQURBLGFBQWEsR0FDQztjQUFiLE1BQU0sZ0NBQUcsRUFBRTs7Z0NBRFosYUFBYTs7QUFFdEIsY0FBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLDJCQUEyQixDQUFDO0FBQ3JELGNBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixjQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hDOztxQkFOVSxhQUFhOztlQVFaLFlBQUc7QUFDYixtQkFBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7V0FDckM7OztlQUVPLFlBQUc7QUFDVCxtQkFBTyxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQUFBQyxDQUFDO1dBQ3BDOzs7ZUFFSyxZQUFHO0FBQ1AsbUJBQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7V0FDdkQ7OztlQUVPLFlBQUc7QUFDVCxnQkFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSTtnQkFDakMsS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0QyxtQkFBTyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDcEI7OztpQkFFRSxlQUFHO0FBQ0osbUJBQU87QUFDTCxrQkFBSSxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQ25CLGtCQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixzQkFBUSxFQUFFLEdBQUc7YUFDZCxDQUFBO1dBQ0Y7OztlQWhDVSxhQUFhOzs7K0JBQWIsYUFBYSIsImZpbGUiOiJpby9yZXRoaW5rL3JldGhpbmstY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9