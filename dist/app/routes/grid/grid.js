System.register(['d3', 'nvd3'], function (_export) {
  var d3, nvd3, _classCallCheck, Grid;

  return {
    setters: [function (_d3) {
      d3 = _d3['default'];
    }, function (_nvd3) {
      nvd3 = _nvd3['default'];
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      Grid = function Grid() {
        _classCallCheck(this, Grid);

        this.heading = 'This is a grid';

        this.panels = [{
          name: 'Streamer',
          module: '../../vis/streamline/streamline',
          pos: { x: 0, y: 0, w: 2, h: 1 }
        }];
      };

      _export('Grid', Grid);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9yb3V0ZXMvZ3JpZC9ncmlkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7aUNBR2EsSUFBSTs7Ozs7Ozs7Ozs7OztBQUFKLFVBQUksR0FDSixTQURBLElBQUksR0FDRDs4QkFESCxJQUFJOztBQUViLFlBQUksQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7O0FBRWhDLFlBQUksQ0FBQyxNQUFNLEdBQUcsQ0FDWjtBQUNFLGNBQUksRUFBRSxVQUFVO0FBQ2hCLGdCQUFNLEVBQUUsaUNBQWlDO0FBQ3pDLGFBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUM7U0FDOUIsQ0FDRixDQUFDO09BQ0g7O3NCQVhVLElBQUkiLCJmaWxlIjoiYXBwL3JvdXRlcy9ncmlkL2dyaWQuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=