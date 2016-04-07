var app = app || {};

$(function() {

  var TodoList = Backbone.Collection.extend({

    // 컬렉션의 모델들
    model: app.Todo,

    // todos-backbone 네임스페이스 아래 모든 todo 항목들을 저장한다.
    // 이 작업을 위해 이 페이지에는
    // Backbone localStorage 플러그인이 필요하다.
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // 완료된 todo 항목만 filter 해서 새로운 collection 을 리턴
    completed: function() {
      console.log('completed');
      console.log(this);
      // filter 는 underscore 함수
      return this.filter(function(todo) {
        return todo.get('completed');
      })
    },

    // 남아 있는 항목만(active)
    remaining: function() {
      // apply는 이 함수의 스코프 내에 this를 정의할 수 있도록 해준다.???
      // 여기에서는 underscore without 함수를 사용
      // without_.without(array, *values) Returns a copy of the array with all instances of the values removed.

      /**
      JavaScript에는 이러한 내부적인 this 바인딩 이외에도 this를 특정 객체에 명시적으로
      바인딩시키는 apply()와 call()메소드를 제공합니다.
      call()과 apply() 메소드로 함수를 호출할 때,
      함수의 this는 첫 번째 인자로 넘겨받은 객체를 참조한다.
      apply()과 call() 메소드로 함수를 호출할 때,
      함수는 첫 번째 인자로 넘겨받은 객체를 this로 바인딩하고,
      두 번째 인자로 넘긴 값들은 함수의 인자로 전달됩니다.
      두 메소드의 차이점은 두 번째 인자에서 apply() 메소드는 배열 형태로 인자를 넘기고,
      call()메소드는 배열 형태로 넘긴 것을 각각 하나의 인자로 넘기는 것입니다.

      그렇다면 여기서 this 는 remaining 을 호출 하는 객체 인데 누가 호출하지
      this 를 this.completed 메소드로 넘긴다는 건데..

      app.AppView 에서 app.Todos.remaining() 으로 호출함
      그렇다면 여기서 this 는 app.Todos(todo collection);
      그렇다면 apply 는 필요 없지 않을까?
      어차피 메소드에서 this 는 호출 하는 부모 객체를 참조 한다는데...
      apply 를 하지 않으면 remaining 값이 변하지 않는다.
      */
      //return this.without.apply(this, this.completed());

      // 근데 apply 진짜 모르겠다.. 왜 apply 써야지 allCheckbox 가 체크가 될까.
      // 결국 이뜻은 without completed in todos
      return this.without.apply(this, this.completed());
    },

    // 데이터베이스 내에 특별한 순서 없이 저장이 되었다고 해도 순번을 유지할 수 있다.
    // 이는 새로운 항목을 위해 다음순번을 생성한다.
    nextOrder: function() {
      if (!this.length) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    // Todo는 삽입된 순서대로 정렬된다.
    comparator: function(todo) {
      return todo.get('order');
    }
  });

  // Todos 모록의 전역 컬렉션을 생성한다.
  app.Todos = new TodoList();

});
