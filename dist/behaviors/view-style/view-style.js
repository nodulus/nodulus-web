System.register(['aurelia-templating'], function (_export) {
  var Behavior, _classCallCheck, _createClass, ViewStyleCustomElement;

  return {
    setters: [function (_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      ViewStyleCustomElement = (function () {
        function ViewStyleCustomElement() {
          _classCallCheck(this, ViewStyleCustomElement);
        }

        _createClass(ViewStyleCustomElement, null, [{
          key: 'metadata',
          value: function metadata() {
            return Behavior.withProperty('href').withView('./view-style.html');
          }
        }]);

        return ViewStyleCustomElement;
      })();

      _export('ViewStyleCustomElement', ViewStyleCustomElement);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJlaGF2aW9ycy92aWV3LXN0eWxlL3ZpZXctc3R5bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjsrQ0FFYSxzQkFBc0I7Ozs7b0NBRjNCLFFBQVE7Ozs7Ozs7OztBQUVILDRCQUFzQjtpQkFBdEIsc0JBQXNCO2dDQUF0QixzQkFBc0I7OztxQkFBdEIsc0JBQXNCOztpQkFDbEIsb0JBQUU7QUFDZixtQkFBTyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1dBQ3BFOzs7ZUFIVSxzQkFBc0I7Ozt3Q0FBdEIsc0JBQXNCIiwiZmlsZSI6ImJlaGF2aW9ycy92aWV3LXN0eWxlL3ZpZXctc3R5bGUuanMiLCJzb3VyY2VSb290IjoiLy4vc3JjIn0=