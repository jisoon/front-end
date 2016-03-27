// 이건 뭘의미 하는 건지..
var app = app || {};

// 이거 없으면.. 생성 할 수 없음.
$(function() {
  app.AppView = Backbone.View.extend({
    /**
     새로운 엘리먼트를 만드는 대신에
     기존의 HTML에 존재하는 애플리케이션의 el에 바인딩한다.
     Html todoapp 이라는 엘리멘트의 view를 바인딩 한다. 이런 의미겠지요.
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
      this.allCheckbox = this.$('#toggle-all')[0];
      // #todoapp 에서 #new-todo 을 찼는다.
      this.$input = this.$('#new-todo');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      // app.Todos 에 add event 가 발생하면 this.addOne 메소드 실행
      this.listenTo(app.Todos, 'add', this.addOne);
      this.listenTo(app.Todos, 'reset', this.addAll);
      // 신규
      // todos 컬렉션에서 completed 된 모델이 있다면 filterOne 콜백 메소드를 호출
      // 이때 completed 된 모델이 파라미터로 간다.
      this.listenTo(app.Todos, 'change:completed', this.filterOne);

      // app.Todos(Todos collection) 에 filter event 가 발생하면
      // this.fiterAll 메소드를 실행
      this.listenTo(app.Todos, 'filter', this.filterAll);

      // app.Todos(Todos collections) 에 all 이벤트가 발생하면
      // 화면을 다시 render
      this.listenTo(app.Todos, 'all', this.render);

      app.Todos.fetch({
        reset: true
      });
    },

    /**
    신규
    통계 정보를 갱신하기 위해 어플리케이션을 다시 랜더링한다.
    애플리케이션의 다른 부분은 변경이 없다.
    */
    render: function() {
      var completed = app.Todos.completed().length;
      var remaining = app.Todos.remaining().length;

      if (app.Todos.length) {

        this.$main.show();
        this.$footer.show();

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
      $(this.allCheckbox).checked = !remaining;
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

    // 신규
    filterOne: function(todo) {
      console.log(todo);
      todo.trigger('visible');
    },

    // 신규
    filterAll: function() {
      console.log("filterAll call");
      console.log(this);
      app.Todos.each(this.filterOne, this);
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
