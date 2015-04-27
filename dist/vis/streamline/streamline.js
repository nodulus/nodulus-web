System.register(['aurelia-framework', '../vis', 'd3', 'nvd3', 'firespray/firespray-0.1.3'], function (_export) {
  var bindable, inject, VisElement, d3, nvd3, firespray, _classCallCheck, _createDecoratedClass, _defineDecoratedPropertyDescriptor, VisStreamline;

  return {
    setters: [function (_aureliaFramework) {
      bindable = _aureliaFramework.bindable;
      inject = _aureliaFramework.inject;
    }, function (_vis) {
      VisElement = _vis.VisElement;
    }, function (_d3) {
      d3 = _d3['default'];
    }, function (_nvd3) {
      nvd3 = _nvd3['default'];
    }, function (_firesprayFirespray013) {
      firespray = _firesprayFirespray013['default'];
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

      _defineDecoratedPropertyDescriptor = function (target, key, descriptors) { var _descriptor = descriptors[key]; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer(); Object.defineProperty(target, key, descriptor); };

      VisStreamline = (function () {
        var _instanceInitializers = {};

        function VisStreamline(element) {
          _classCallCheck(this, _VisStreamline);

          _defineDecoratedPropertyDescriptor(this, 'panel', _instanceInitializers);

          this.element = element;
        }

        var _VisStreamline = VisStreamline;

        _createDecoratedClass(_VisStreamline, [{
          key: 'panel',
          decorators: [bindable],
          initializer: function () {
            return null;
          },
          enumerable: true
        }, {
          key: 'render',
          value: function render() {
            var _this = this;

            var lastEpoch = new Date().getTime();
            var generatedData = firespray.dataUtils.generateData({ epoch: lastEpoch, pointCount: 100, lineCount: 3, valueCount: 2 });

            this.chart = firespray.chart().setConfig({
              container: this.element.querySelector('.chart-container'),
              width: 600,
              height: 400,
              theme: 'default',
              progressiveRenderingRate: 100,
              geometryType: 'stackedBar'
            });

            setInterval(function () {
              var newEpoch = lastEpoch + 500;
              generatedData.forEach(function (d) {
                d.values.shift();
                d.values.push(firespray.dataUtils.generateDataPoint({ epoch: newEpoch, valueCount: 2 }));
              });
              lastEpoch = newEpoch;
              _this.chart.setData(generatedData);
            }, 500);
          }
        }], null, _instanceInitializers);

        VisStreamline = inject(Element)(VisStreamline) || VisStreamline;
        return VisStreamline;
      })();

      _export('VisStreamline', VisStreamline);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpcy9zdHJlYW1saW5lL3N0cmVhbWxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtxSUFPYSxhQUFhOzs7O21DQVBsQixRQUFRO2lDQUFFLE1BQU07O3dCQUNoQixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7OztBQU1MLG1CQUFhOzs7QUFHYixpQkFIQSxhQUFhLENBR1osT0FBTyxFQUFFOzs7OztBQUNuQixjQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4Qjs7NkJBTFUsYUFBYTs7Ozt1QkFDdkIsUUFBUTs7bUJBQVMsSUFBSTs7Ozs7aUJBTWhCLGtCQUFHOzs7QUFDUCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQyxnQkFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQzs7QUFFdkgsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUMzQixTQUFTLENBQUM7QUFDVCx1QkFBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0FBQ3pELG1CQUFLLEVBQUUsR0FBRztBQUNWLG9CQUFNLEVBQUUsR0FBRztBQUNYLG1CQUFLLEVBQUUsU0FBUztBQUNoQixzQ0FBd0IsRUFBRSxHQUFHO0FBQzdCLDBCQUFZLEVBQUUsWUFBWTthQUMzQixDQUFDLENBQUM7O0FBRUwsdUJBQVcsQ0FBQyxZQUFNO0FBQ2hCLGtCQUFJLFFBQVEsR0FBRyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQy9CLDJCQUFhLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQyxFQUFFO0FBQ2hDLGlCQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2pCLGlCQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2VBQ3hGLENBQUMsQ0FBQztBQUNILHVCQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3JCLG9CQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDbkMsRUFBRSxHQUFHLENBQUMsQ0FBQztXQUNUOzs7QUE5QlUscUJBQWEsR0FEekIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUNILGFBQWEsS0FBYixhQUFhO2VBQWIsYUFBYTs7OytCQUFiLGFBQWEiLCJmaWxlIjoidmlzL3N0cmVhbWxpbmUvc3RyZWFtbGluZS5qcyIsInNvdXJjZVJvb3QiOiIvLi9zcmMifQ==