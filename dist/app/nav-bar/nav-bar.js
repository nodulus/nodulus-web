System.register(['aurelia-framework'], function (_export) {
  var bindable, _classCallCheck, _createDecoratedClass, _defineDecoratedPropertyDescriptor, NavBar;

  return {
    setters: [function (_aureliaFramework) {
      bindable = _aureliaFramework.bindable;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

      _defineDecoratedPropertyDescriptor = function (target, key, descriptors) { var _descriptor = descriptors[key]; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer(); Object.defineProperty(target, key, descriptor); };

      NavBar = (function () {
        var _instanceInitializers = {};

        function NavBar() {
          _classCallCheck(this, NavBar);

          _defineDecoratedPropertyDescriptor(this, 'router', _instanceInitializers);

          this.open = false;
        }

        _createDecoratedClass(NavBar, [{
          key: 'router',
          decorators: [bindable],
          initializer: function () {
            return null;
          },
          enumerable: true
        }, {
          key: 'toggle',
          value: function toggle(open) {
            this.open = open || !this.open;
          }
        }], null, _instanceInitializers);

        return NavBar;
      })();

      _export('NavBar', NavBar);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9uYXYtYmFyL25hdi1iYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs0RkFFYSxNQUFNOzs7O21DQUZYLFFBQVE7Ozs7Ozs7Ozs7O0FBRUgsWUFBTTs7O0FBR04saUJBSEEsTUFBTSxHQUdIO2dDQUhILE1BQU07Ozs7QUFJZixjQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUNuQjs7OEJBTFUsTUFBTTs7dUJBQ2hCLFFBQVE7O21CQUFVLElBQUk7Ozs7O2lCQU1qQixnQkFBQyxJQUFJLEVBQUU7QUFDWCxnQkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1dBQ2hDOzs7ZUFUVSxNQUFNOzs7d0JBQU4sTUFBTSIsImZpbGUiOiJhcHAvbmF2LWJhci9uYXYtYmFyLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9