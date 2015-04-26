System.register([], function (_export) {
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

      console.log('Bahn Commander is GO!');
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO3VCQUVnQixTQUFTOztBQUFsQixXQUFTLFNBQVMsQ0FBRSxPQUFPLEVBQUU7QUFDbEMsV0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRXRDLFFBQUksSUFBSSxFQUFFO0FBQ1IsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQ2xDOztBQUVELFdBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7QUFHcEMsV0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3ZDLGFBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDMUMsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7QUFmRCxhQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9