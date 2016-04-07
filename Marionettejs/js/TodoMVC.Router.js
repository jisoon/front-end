var TodoMVC = TodoMVC || {};

$(function() {

  'use strict';

  var filterChannel = Backbone.Radio.channel('filter');

  // TodoList router
  // handles a single dynamic route to show
  // the active vs complete todo items
  TodoMVC.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      '*filter': 'filterItems'
    }
  });

  // TodoList Controller(Mediator)
  // -----------------------------
  //
  // Control the workflow and logic that exists at the appplication level,
  // above the implementation detail of views and models
  TodoMVC.Controller = Backbone.Marionette.Object.extend({
    initialize: function() {
      this.todoList = new TodoMVC.TodoList();
    },

    // Start the app by showing the appropriate views
    // and fetching the list of todo items, if there are any
    start: function() {
      console.log("control start");
      this.showHeader(this.todoList);
      this.showFooter(this.todoList);
      this.showTodoList(this.todoList);
      this.todoList.fetch();
    },

    updateHiddenElements: function() {
      $('#main, #foot').toggle(!!this.todoList.length);
    },

    showHeader: function(todoList) {
      var header = new TodoMVC.HeaderLayout({
        collection: todoList
      });
      TodoMVC.App.root.showChildView('header', header);
    },

    showTodoList: function(todoList) {
      TodoMVC.App.root.showChildView('main', new TodoMVC.ListView({
        collection: todoList
      }));
    },

    showFooter : function(todoList){
      var footer = new TodoMVC.FooterLayout({
        collection : todoList
      });
      TodoMVC.App.root.showChildView('footer', footer);
    },

    // Set the filter to show complete or all items
    filterItems: function(filter) {
      // filter && filter.trim() :  filter 가 false 면 filter 반환
      // true 면 filter.trim() 반환 여기서는 filter 가 문자 이므로 null 이나 undefind 면 false
      //
      // filter || 'all' : filter 가 true 면 filter 반환  false 면 'all' 반환
      // 익숙하지 않다.
      var newFilter = filter && filter.trim() || 'all';
      filterChannel.request('filterState').set('filter', newFilter);
    }
  });
});
