var app = app || {};

$(function() {
  app.TodoView = Backbone.View.extend({

    // 이러면 새로운 태그를 만든다.
    tagName: 'li',

    // tageName (여기에서는 li) 하단으로 들어갈 template 를 가져온다.
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
      // tageName.html(template) 의미;
      this.$el.html(this.template(this.model.toJSON()));

      this.$el.toggleClass('completed', this.model.get('completed'));
      this.toggleVisible();
      this.$input = this.$('.edit');
      return this;
    },

    // event callback
    toggleVisible: function() {
      // hidden 클래스 토글함 기존에 $el 에 hidden class 가 있다면
      // hidden 이 없어지고 hidden 클래스가 없다면 hidden 클래스가 생김
      // 말글대로 toggle class 임
      this.$el.toggleClass('hidden', this.isHidden());
    },
    isHidden: function() {
      // completed 면  active 상태가 hidden
      // completed 아니면 completed 가 hidden
      return this.model.get('completed') ?
				app.TodoFilter === 'active' :
				app.TodoFilter === 'completed' ;
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
