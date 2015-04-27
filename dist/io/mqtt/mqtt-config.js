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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvL21xdHQvbXF0dC1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjswQ0FFYSxVQUFVOzs7Ozs7Ozs7Ozs7O0FBQVYsZ0JBQVU7QUFDVixpQkFEQSxVQUFVLEdBQ0k7Y0FBYixNQUFNLGdDQUFHLEVBQUU7O2dDQURaLFVBQVU7O0FBRW5CLGNBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUM7QUFDN0MsY0FBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLHFCQUFxQixDQUFDO0FBQy9DLGNBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7O0FBRTNCLGNBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7O0FBRWxDLGNBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEM7O3FCQVRVLFVBQVU7O2VBV1QsWUFBRztBQUNiLG1CQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztXQUNyQzs7O2VBRU8sWUFBRztBQUNULG1CQUFPLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxBQUFDLENBQUM7V0FDcEM7OztlQWpCVSxVQUFVOzs7NEJBQVYsVUFBVSIsImZpbGUiOiJpby9tcXR0L21xdHQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9