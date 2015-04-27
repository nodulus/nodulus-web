System.register(['aurelia-framework'], function (_export) {
  var bindable, _classCallCheck, _createDecoratedClass, _defineDecoratedPropertyDescriptor, Panel;

  return {
    setters: [function (_aureliaFramework) {
      bindable = _aureliaFramework.bindable;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

      _defineDecoratedPropertyDescriptor = function (target, key, descriptors) { var _descriptor = descriptors[key]; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer(); Object.defineProperty(target, key, descriptor); };

      Panel = (function () {
        var _instanceInitializers = {};

        function Panel() {
          _classCallCheck(this, Panel);

          _defineDecoratedPropertyDescriptor(this, 'title', _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, 'position', _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, 'content', _instanceInitializers);
        }

        _createDecoratedClass(Panel, [{
          key: 'title',
          decorators: [bindable],
          initializer: function () {
            return '';
          },
          enumerable: true
        }, {
          key: 'position',
          decorators: [bindable],
          initializer: function () {},
          enumerable: true
        }, {
          key: 'content',
          decorators: [bindable],
          initializer: function () {},
          enumerable: true
        }], null, _instanceInitializers);

        return Panel;
      })();

      _export('Panel', Panel);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9yb3V0ZXMvZ3JpZC9wYW5lbC9wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzRGQUVhLEtBQUs7Ozs7bUNBRlYsUUFBUTs7Ozs7Ozs7Ozs7QUFFSCxXQUFLOzs7aUJBQUwsS0FBSztnQ0FBTCxLQUFLOzs7Ozs7Ozs7OEJBQUwsS0FBSzs7dUJBQ2YsUUFBUTs7bUJBQVMsRUFBRTs7Ozs7dUJBQ25CLFFBQVE7Ozs7O3VCQUNSLFFBQVE7Ozs7O2VBSEUsS0FBSzs7O3VCQUFMLEtBQUsiLCJmaWxlIjoiYXBwL3JvdXRlcy9ncmlkL3BhbmVsL3BhbmVsLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9