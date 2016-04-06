var TodoMVC = TodoMVC || {};

$(function() {
  // "use strict";  Defines that JavaScript code should be executed in "strict mode".
  // 안전한 코딩 가이드 라인을 사용하겠다는걸 명시
  // http://www.w3schools.com/js/js_strict.asp 참고
  'use strict';

  // After we initialize the app, we want to kick off the router
  // and controller, which will handle initializing our Views
  TodoMVC.App.on('start', function() {
    console.log("TodoMVC_Marionettejs on start");
    var controller = new TodoMVC.Controller();
    controller.router = new TodoMVC.Router({
      controller: controller
    });

    controller.start();
    Backbone.history.start();
  });

  // start the TodoMVC app(defined in js/TodoMVC.js)
  // Backbone.Marionette.Application.start()
  // Once you have your application configured, you can kick everything off by
  // calling: MyApp.start(options).
  TodoMVC.App.start();

});
