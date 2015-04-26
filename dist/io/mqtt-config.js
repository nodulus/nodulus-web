System.register(['url'], function (_export) {
  var url, _classCallCheck, _createClass, MQTTConfig;

  return {
    setters: [function (_url) {
      url = _url['default'];
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      MQTTConfig = (function () {
        function MQTTConfig() {
          var config = arguments[0] === undefined ? {} : arguments[0];

          _classCallCheck(this, MQTTConfig);

          this.clientID = config.clientID || undefined;
          this.uri = config.uri || 'ws://localhost:1883';
          this.qos = config.qos || 0;

          this.prefix = config.prefix || '';

          this.url = url.parse(this.uri);
        }

        _createClass(MQTTConfig, [{
          key: 'hostname',
          get: function () {
            return url.parse(this.uri).hostname;
          }
        }, {
          key: 'port',
          get: function () {
            return +url.parse(this.uri).port;
          }
        }]);

        return MQTTConfig;
      })();

      _export('MQTTConfig', MQTTConfig);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQtY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7MENBRWEsVUFBVTs7Ozs7Ozs7Ozs7OztBQUFWLGdCQUFVO0FBQ1YsaUJBREEsVUFBVSxHQUNJO2NBQWIsTUFBTSxnQ0FBRyxFQUFFOztnQ0FEWixVQUFVOztBQUVuQixjQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDO0FBQzdDLGNBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQztBQUMvQyxjQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDOztBQUUzQixjQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDOztBQUVsQyxjQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hDOztxQkFUVSxVQUFVOztlQVdULFlBQUc7QUFDYixtQkFBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7V0FDckM7OztlQUVPLFlBQUc7QUFDVCxtQkFBTyxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQUFBQyxDQUFDO1dBQ3BDOzs7ZUFqQlUsVUFBVTs7OzRCQUFWLFVBQVUiLCJmaWxlIjoiaW8vbXF0dC1jb25maWcuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=