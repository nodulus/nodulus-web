System.register([], function (_export) {
  var _classCallCheck, AppConfig;

  _export('configure', configure);

  function configure(aurelia) {
    console.log('configure app', aurelia);

    if (true) {
      aurelia.use.developmentLogging();
    }

    aurelia.use.standardConfiguration();

    return aurelia.start().then(function (a) {
      return a.setRoot('app/app', 'page-host');
    });
  }

  return {
    setters: [],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      console.log('Bahn Commander is GO!');

      AppConfig = function AppConfig() {
        _classCallCheck(this, AppConfig);

        this.entities = {
          uri: 'http://localhost:3000'
        };

        this.rethinkdb = {
          uri: 'ws://localhost:28015/bahn_commander'
        };

        this.mqtt = {
          uri: 'ws://mashtun.homebrew.lan:1884',
          qos: 1
        };
      };

      _export('AppConfig', AppConfig);

      ;
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO3VCQUVhLFNBQVM7O3VCQWlCTixTQUFTOztBQUFsQixXQUFTLFNBQVMsQ0FBRSxPQUFPLEVBQUU7QUFDbEMsV0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRXRDLFFBQUksSUFBSSxFQUFFO0FBQ1IsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQ2xDOztBQUVELFdBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7QUFHcEMsV0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3ZDLGFBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDMUMsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7OztBQWhDRCxhQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRXhCLGVBQVMsR0FDVCxTQURBLFNBQVMsR0FDTjs4QkFESCxTQUFTOztBQUVsQixZQUFJLENBQUMsUUFBUSxHQUFHO0FBQ2QsYUFBRyxFQUFFLHVCQUF1QjtTQUM3QixDQUFBOztBQUVELFlBQUksQ0FBQyxTQUFTLEdBQUc7QUFDZixhQUFHLEVBQUUscUNBQXFDO1NBQzNDLENBQUE7O0FBRUQsWUFBSSxDQUFDLElBQUksR0FBRztBQUNWLGFBQUcsRUFBRSxnQ0FBZ0M7QUFDckMsYUFBRyxFQUFFLENBQUM7U0FDUCxDQUFBO09BQ0Y7OzJCQWRVLFNBQVM7O0FBZXJCLE9BQUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9