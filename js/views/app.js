// 이건 뭘의미 하는 건지..
var app = vapp || {};


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
  statsTemplate: _.template($('#stats-template').html),

  /**
  initialize 에서 항목이 추가되거나 변경될 때 필요한
  Todos 컬렉션에 관련 이벤트를 바인딩한다.
  */
  initialize: function(args) {
    // this.$() -> this.el 에서 $() 에 있는 요소를 찾는다.
    // 결국 this 는 해당 view el 에 정의된 엘리멘트 이다.

    // #todoapp 에서 #toggle-all 을 찼는다.
    this.allCheckbox = this.$('#toggle-all')[0];
    // #todoapp 에서 #new-todo 을 찼는다.
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
  },
  // 항목을 추가하기 위한 뷰를 생성해서
  // 목록에서 단일 todo g항목을추가하고 뷰를 <ul> 태그에 덧붙인다.
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
  }

});
