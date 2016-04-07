var TodoMVC = TodoMVC || {};

$(function(){
  'use strict';

  var filterChannel = Backbone.Radio.channel('filter');

  // Tdo List Item view
  // ------------------
  //
  // Display an individual todo item, and response to changes
  // that are made to the time, including marking completed
  TodoMVC.TodoView = Backbone.Marionette.ItemView.extend({

    tagName: 'li',
    template: '#template-todoItemView',
    className: function() {
      return this.model.get('completed') ? 'completed' : 'active';
    },

    ui: {
      edit: '.edit',
      destroy: 'destroy',
      label: 'label',
      toggle: '.toggle'
    },

    events: {
      'click @ui.destroy': 'deleteModel',
      'dbclick @ui.label': 'onEditClick',
      'keydown @ui.edit': 'onEditKeypress',
      'focusout @ui.edit': 'onEditFocusout',
      'click @ui.toggle': 'toggle'
    },

    modelEvents: {
      change: 'render'
    },

    deleteModel: function() {
      this.model.destroy();
    },

    toggle: function() {
      this.model.toggle().save();
    },
    onEditClick: function() {
      this.$el.addClass('editing');
      this.ui.edit.focus();
      this.ui.edit.val(this.ui.edit.trim());
    },
    onEditFocusout: function() {
      var todoText = this.ui.edit.val().trim();
      if (todoText) {
        this.model.set('title', todoText).save();
        this.$el.removeClass('editing');
      } else {
        this.destroy();
      }
    },
    onEditKeypress: function(e) {
      var ENTER_KEY = 13;
      var ESC_KEY = 27;
      if (e.which === ENTER_KEY) {
        this.onEditFocusout();
        return;
      };
      if (e.which === ESC_KEY) {
        this.ui.edit.val(this.model.get('title'));
        this.$el.removeClass('editing');
      }
    }
  });

  // Item List View
  // --------------
  //
  // Controls the rendering of the list of items, including the
  // filtering of active vs completed for Display
  TodoMVC.ListView = Backbone.Marionette.CompositeView.extend({
    template: '#template-todoListCompositeView',
    childView: TodoMVC.TodoView,
    childViewContainer: '#todo-list',
    ui: {
      toggle: '#toggle-all'
    },
    events: {
      'click @ui.toggle': 'onToggleAllClick'
    },
    collectionEvents: {
      'change:completed': 'render',
      all: 'setCheckAllState'
    },
    initialize: function() {
      // filterChannel 중에서 filterState 요청을 listen 하는데..그중에 filterState change 라면 this.render 실행
      this.listenTo(filterChannel.request('filterState'), 'change:filterState', this.render, this);
    },
    filter: function(child) {
      var filteredOn = filterChannel.request('filterState').get('filter');
      return child.matchesFilter(filteredOn);
    },
    setCheckAllState: function() {
      function reduceCompleted(left, right) {
        return left & right.get('completed');
      }
      var allCompleted = this.collection.reduce(reduceCompleted, true);
      this.ui.toggle.prop('checked', allCompleted);
      this.$el.parent().toggle(!!this.collection.length);
    },
    onToddleAllClick: function(e) {
      var isChecked = e.currentTarget.checked;
      this.collection.each(function(todo) {
        todo.save({
          completed: isChecked
        });
      })
    }
  });
});
