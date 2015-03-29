System.register(["./app"], function (_export) {
  var App;

  _export("configure", configure);

  function configure() {
    console.log(arguments);
    aurelia.use.standardConfiguration().developmentLogging();

    aurelia.start().then(function (a) {
      return a.setRoot("app/app", document.body);
    });
  }

  return {
    setters: [function (_app) {
      App = _app.App;
    }],
    execute: function () {
      "use strict";
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9ib290c3RyYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLEdBQUc7O3VCQUVLLFNBQVM7O0FBQWxCLFdBQVMsU0FBUyxHQUFHO0FBQzFCLFdBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkIsV0FBTyxDQUFDLEdBQUcsQ0FDUixxQkFBcUIsRUFBRSxDQUN2QixrQkFBa0IsRUFBRSxDQUFDOztBQUV4QixXQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7S0FBQSxDQUFDLENBQUM7R0FDaEU7Ozs7QUFUTyxTQUFHLFFBQUgsR0FBRyIsImZpbGUiOiJhcHAvYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6Ii8uL3NyYyJ9