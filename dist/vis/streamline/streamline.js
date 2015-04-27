System.register(['aurelia-framework', '../vis-element', 'd3', 'nvd3', 'firespray/firespray-0.1.3'], function (_export) {
  var bindable, inject, VisElement, d3, nvd3, firespray, _classCallCheck, _createDecoratedClass, _get, _defineDecoratedPropertyDescriptor, _inherits, VisStreamline;

  return {
    setters: [function (_aureliaFramework) {
      bindable = _aureliaFramework.bindable;
      inject = _aureliaFramework.inject;
    }, function (_visElement) {
      VisElement = _visElement.VisElement;
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

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _defineDecoratedPropertyDescriptor = function (target, key, descriptors) { var _descriptor = descriptors[key]; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer(); Object.defineProperty(target, key, descriptor); };

      _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      VisStreamline = (function (_VisElement) {
        var _instanceInitializers = {};

        function VisStreamline(element) {
          _classCallCheck(this, _VisStreamline);

          _get(Object.getPrototypeOf(_VisStreamline.prototype), 'constructor', this).call(this);

          _defineDecoratedPropertyDescriptor(this, 'panel', _instanceInitializers);

          this.element = element;
          this.name = 'I am a streamer';
        }

        _inherits(VisStreamline, _VisElement);

        var _VisStreamline = VisStreamline;

        _createDecoratedClass(_VisStreamline, [{
          key: 'panel',
          decorators: [bindable],
          initializer: function () {
            return null;
          },
          enumerable: true
        }, {
          key: 'attached',
          value: function attached() {
            console.log('streamline attached', arguments, this);

            var generatedData = firespray.dataUtils.generateData({ pointCount: 100, lineCount: 3,
              valueCount: 2 });
            var chart = firespray.chart().setConfig({
              container: this.element.querySelector('.chart-container'),
              width: 600,
              height: 400,
              theme: 'default',
              progressiveRenderingRate: 100,
              geometryType: 'stackedBar'
            }).setData(generatedData);
            var lastEpoch = chart.getDataExtent().x[1];
            setInterval(function () {
              var newEpoch = lastEpoch + 1000;
              generatedData.forEach(function (d) {
                d.values.shift();
                d.values.push(firespray.dataUtils.generateDataPoint({ epoch: newEpoch, valueCount: 2 }));
              });
              lastEpoch = newEpoch;
              chart.setData(generatedData);
            }, 500);
          }
        }], null, _instanceInitializers);

        VisStreamline = inject(Element)(VisStreamline) || VisStreamline;
        return VisStreamline;
      })(VisElement);

      _export('VisStreamline', VisStreamline);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpcy9zdHJlYW1saW5lL3N0cmVhbWxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtzSkFPYSxhQUFhOzs7O21DQVBsQixRQUFRO2lDQUFFLE1BQU07OytCQUNoQixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNTCxtQkFBYTs7O0FBR2IsaUJBSEEsYUFBYSxDQUdaLE9BQU8sRUFBRTs7O0FBQ25CLGdHQUFROzs7O0FBRVIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsY0FBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztTQUMvQjs7a0JBUlUsYUFBYTs7NkJBQWIsYUFBYTs7Ozt1QkFDdkIsUUFBUTs7bUJBQVMsSUFBSTs7Ozs7aUJBU2Qsb0JBQUc7QUFDVCxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXBELGdCQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUM7QUFDakYsd0JBQVUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQzFCLFNBQVMsQ0FBQztBQUNULHVCQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7QUFDekQsbUJBQUssRUFBRSxHQUFHO0FBQ1Ysb0JBQU0sRUFBRSxHQUFHO0FBQ1gsbUJBQUssRUFBRSxTQUFTO0FBQ2hCLHNDQUF3QixFQUFFLEdBQUc7QUFDN0IsMEJBQVksRUFBRSxZQUFZO2FBQzNCLENBQUMsQ0FDRCxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUIsZ0JBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsdUJBQVcsQ0FBQyxZQUFXO0FBQ3JCLGtCQUFJLFFBQVEsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLDJCQUFhLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQyxFQUFFO0FBQ2hDLGlCQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2pCLGlCQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2VBQ3hGLENBQUMsQ0FBQztBQUNILHVCQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3JCLG1CQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzlCLEVBQUUsR0FBRyxDQUFDLENBQUM7V0FDVDs7O0FBbkNVLHFCQUFhLEdBRHpCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDSCxhQUFhLEtBQWIsYUFBYTtlQUFiLGFBQWE7U0FBUyxVQUFVOzsrQkFBaEMsYUFBYSIsImZpbGUiOiJ2aXMvc3RyZWFtbGluZS9zdHJlYW1saW5lLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9