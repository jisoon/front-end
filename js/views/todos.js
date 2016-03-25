var app = app || {};

$(function() {
  app.TodoView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#item-template').html()),

    events: {
      'click .toggle': 'togglecompleted',
      'click .destroy': 'clear',
      'dblclick label': 'edit',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'visible', this.toggleVisible);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      this.$el.toggleClass('completed', this.model.get('completed'));
      this.toggleVisible();

      this.$input = this.$('.edit');
      return this;
    },
    // event callback
    toggleVisible: function() {
      this.$el.toggleClass('hidden', this.isHidden());
    },
    isHidden: function() {
      var isCompleted = this.model.get('completed');
      return this.model.get('completed') ?
  				app.TodoFilter === 'active' :
  				app.TodoFilter === 'completed';
    },
    // 항목의 상태를 completed 로 변경
    togglecompleted: function() {
      this.model.toggle();
    },
    // 항목을 editing 모드로 변경하고 input 필드에 출력
    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
    },
    // editing 모드를 빠져 나오고 todo의 변경 사항들을 저장
    close: function() {
      var value = this.$input.val().trim();

      if (value) {
        this.model.save({
          title: value
        });
      }
      this.$el.removeClass('editing');
    },
    // 엔터키를 누르면 편집 모드를 빠져 나온다.
    updateOnEnter: function(e) {
      if (e.which === ENTER_KEY) {
        this.close();
      }
    },
    // localStorage 에서 모델을 삭제하고 뷰를 제거한다.
    clear : function(){
      this.model.destroy();
    }
  });
});
