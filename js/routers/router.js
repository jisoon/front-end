$(function() {
  var Workspace = Backbone.Router = Backbone.Router.extend({

    routes: {
      '*filter': 'setFilter'
        // routes
    },

    initialize: function(args) {
      // super
    },

    setFilter: function(param) {
      
      app.Todos.trigger('filter');
    }
  });

  app.TodoRouter = new Workspace();
  Backbone.history.start();
});
