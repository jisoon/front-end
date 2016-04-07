/*global Backbone, TodoMVC:true */

//set TodoMVC's value to TodoMVC, or {} if TodoMVC is undefined
// TodoMVC 의 undefined 를 방지 하는 것
// 이전에 TodoMVC 를 사용 했다면 TodoMVC 를 기대로 사용을 하고
// 사용하지 않았다면 {} 로 대체함
var TodoMVC = TodoMVC || {};

$(function() {
  'use strict';

  var TodoApp = Backbone.Marionette.Application.extend({
    setRootLayout: function() {
      this.root = new TodoMVC.RootLayout();
    }
  });

  // The Apllication Object is responsible for kicking off
  // a Marionette application when its start function is called
  //
  // This application has a singler root Layout that is attached
  // before it is started. Other system components can listen
  // for the application start event, and perform initialization
  // on that event
  TodoMVC.App = new TodoApp();
  TodoMVC.App.on('before:start', function() {
    TodoMVC.App.setRootLayout();
  });

});
