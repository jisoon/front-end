// 이건 뭘의미 하는 건지..
var app = app || {};

// 이거 없으면.. 생성 할 수 없음.
$(function() {

  'use strict';

  app.AppView = Backbone.View.extend({
    /**
     el 을 사용하면 html 에 정의된 엘리멘트를 사용하고
     tagName 을 사용하면 새로운 엘리멘트를 생성한다.
    */
    el: "#todoapp",
    /**
    index.html 에 id 가 stats-template 인 text/template 의
    html 정보를 statsTemplate 변수에 저장한다.
    _.template 를 호출하여 Inderscore의 마이크로템플릿티으로 statsTemplate 개체를
    #stats-template로부터 추출하여 구성하고 있다.
    이 템플릿을 나중에 뷰로 랜더링할 것이다.
    */
    statsTemplate: _.template($('#stats-template').html()),

    /**
    신규
    새로운 아이템이 만들어질 때 발생하는 이벤트라
    아이템이 완료되었을 때 발생되는 이벤트의 처리를 위임한다.
    */
    events: {
      'keypress #new-todo': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

    /**
    initialize 에서 항목이 추가되거나 변경될 때 필요한
    Todos 컬렉션에 관련 이벤트를 바인딩한다.
    */
    initialize: function() {
      // this.$() -> this.el 에서 $() 에 있는 요소를 찾는다.
      // 결국 this 는 해당 view el 에 정의된 엘리멘트 이다.

      // #todoapp 에서 #toggle-all 을 찼는다.
      // 그리고 app.view.allCheckbox 프로퍼티에 object 저장
      this.allCheckbox = this.$('#toggle-all')[0];

      // #todoapp 에서 #new-todo 을 찼는다.
      // this(app.view).$input 프로퍼티에 id="new-todo" 인 엘리멘트를
      // jquery 객체로 저장한다. $ 은 jquery 객체라는것을 표시하기 위해서...
      this.$input = this.$('#new-todo');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      // app.Todos 에 add event 가 발생하면 this.addOne 메소드 실행
      this.listenTo(app.Todos, 'add', this.addOne);
      this.listenTo(app.Todos, 'reset', this.addAll);

      // app.Todos 는 collection 이다. collection 은 change 이벤트가 없다.
      // 그렇다면 아래에 change:attributes 는 collection 이벤트가 아니라
      // model 이벤트 이다.
      // 참조(http://iwidgets.kr/document/backbonejs.html#Model-change)
      this.listenTo(app.Todos, 'change:completed', this.filterOne);


      // filter 는 underscore 이벤트 이다.
      // app.Todos collection 에 filter 이벤트가 발생하면 this.filterAll
      // 메소드가 실행
      this.listenTo(app.Todos, 'filter', this.filterAll);

      // app.Todos(Todos collections) 에 어떤 이벤트가 발생하여도 render
      // 를 한다는 의미
      //"all" — this special event fires for any triggered event,
      // passing the event name as the first argument.
      this.listenTo(app.Todos, 'all', this.render);

      // collection fetch
      app.Todos.fetch({
        reset: true
      });
    },

    /**
    신규
    통계 정보를 갱신하기 위해 어플리케이션을 다시 랜더링한다.
    애플리케이션의 다른 부분은 변경이 없다.
    this.listenTo(app.Todos, 'all', this.render);
    이부분 때문에 Todos 가 변경이 이루엉 지면 render를 다시 한다.
    */
    render: function() {
      var completed = app.Todos.completed().length;
      var remaining = app.Todos.remaining().length;

      if (app.Todos.length) {

        // 화면에서는 todo list
        this.$main.show();
        // 화면에서는 todo stats
        this.$footer.show();

        // footer 에 완료 된것가 남은것에 대한 값을 부여
        this.$footer.html(this.statsTemplate({
          completed: completed,
          remaining: remaining
        }));

        this.$('.filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');

      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      // 의미가 어려워..
      this.allCheckbox.checked = this.isAllCompleted(remaining);
    },

    isAllCompleted : function(remainingCount){
      if(remainingCount === 0){
        return true;
      }else{
        return false;
      }
    },

    // 항목을 추가하기 위한 뷰를 생성해서
    addOne: function(todo) {
      var view = new app.TodoView({
        model: todo
      });
      $('#todo-list').append(view.render().el);
    },

    // Todos 컬렉션에 있는 모든 아이템을 한 번에 추가한다.
    addAll: function() {
      this.$('#todo-list').html('');
      app.Todos.each(this.addOne, this);
    },

    //
    filterOne: function(todo) {
      todo.trigger('visible');
    },

    // 신규
    filterAll: function(param) {
      // this.completed = param;
      app.Todos.each(this.filterOne, this);
      this.render();
    },

    // 신규
    // input 에 있는 내용을 으로 새로운 todo 항목을 위한 속성을 생성한다.
    newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: app.Todos.nextOrder(),
        completed: false
      };
    },

    // 신규
    // input 필드에서 return 키를 누르면
    // 새로운 Todo 모델을 만들고 이를 localStorage 에 저장한다.
    createOnEnter: function(e) {
      if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
        return;
      }

      app.Todos.create(this.newAttributes());
      this.$input.val('');
    },

    // 신규
    // 완료된 todo 항목들을 모두 삭제하고, 모델 삭제한다.
    clearCompleted: function() {
      _.invoke(apTodos.completed(), 'destroy');
      return false;
    },

    // 신규
    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      app.Todos.each(function(todo) {
        todo.save({
          'completed': completed
        })
      })
    }
  });
});
