$(function() {
  'use strict';

  var Workspace = Backbone.Router = Backbone.Router.extend({

    routes: {
      '*filter': 'setFilter'
        // routes
    },

    initialize: function(args) {
      // super
    },

    setFilter: function(param) {
      app.TodoFilter = param || '';
      // trigger a collection filter event, causing hiding/unhiding
      // of Todo view items
      app.Todos.trigger('filter', param);
    }
  });

  app.TodoRouter = new Workspace();
  Backbone.history.start();
});
