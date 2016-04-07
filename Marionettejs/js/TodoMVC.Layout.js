/*global TodoMVC:true, Backbone */

var TodoMVC = TodoMVC || {};

/**
화면 구성은 Header Main Footer 로 구성되어 있다.
Header 는 Todo 를 작성하는 부분이고
Main 은 Todo를 표현 하는 부분이고
Footer 는 Todo 의 요약정보(전체,진행,완료)를 보여 주는 부분이다.
아래 소스를 보면 LayoutView 는 region 보다 상위 개념인듯
region 들 등록하고 UI / event binding 을 할 수 있다.
*/

(function() {
  'use strict';

  var filterChannel = Backbone.Radio.channel('filter');

  // root layout 은 하위 레이아웃들의 region 을 구성한다.
  TodoMVC.RootLayout = Backbone.Marionette.LayoutView.extend({
    el: '#todoapp',
    regions: {
      header: '#header',
      main: '#main',
      footer: '#footer'
    }
  });

  // Layout Header View
  // index.html 에 있는 template-header 를 View 롤 사용한다.
  TodoMVC.HeaderLayout = Backbone.Marionette.ItemView.extend({
    template: '#template-header',

    // UI bindings create cached attribute that
    // point to jQuery selected objects
    // 이렇게 하면 ui.input 으로 해당 엘리멘트를 참조 할 수 있다.
    ui: {
      input: '#new-todo'
    },

    // ui.input = @ui.input 으로 사용한 이유는??
    // event는 저렇게 사용해야됨?
    events: {
      'keypress @ui.input': 'onInputKeypress',
      'keyup @ui.input': 'onInputKeyup'
    },

    // According to the spec
    // If escape is pressed during the edit, the edit state should be left
    // and any changes be discarded.
    // 요구사항에 따르면
    // 입력중에  escape 키를 누르면 입력 상태는 유지 되고 다른 변화는 취소된다.
    onInputKeyup: function(e) {
      var ESC_KEY = 27;
      // The event.which property returns which keyboard key or mouse button was pressed for the event.
      if (e.which === ESC_KEY) {
        this.render();
      }
    },

    // @ui.input 에 키가 눌려질때 마다 이벤트 발생
    onInputKeypress: function(e) {
      console.log(e.which);
      var ENTER_KEY = 13;
      var todoText = this.ui.input.val().trim();
      // 누른 키 값이 ENTER_KEY 라면 collection 에 input 내용 추가
      if (e.which === ENTER_KEY) {
        this.collection.create({
          title: todoText
        });
        // input 초기화
        this.ui.input.val('');
      }
    }
  }); // end HeaderLayout

  // Layout Footer View
  TodoMVC.FooterLayout = Backbone.Marionette.ItemView.extend({
    template: '#template-footer',
    // UI bindings create cached attribute that
    // point to jQuery selected objects
    // UI 바인딩은 만든다. 캐쉬드한 속성을 jQuery로 선택된 객체를
    ui: {
      filters: '#filters a',
      completed: '.completed a',
      active: '.active a',
      all: '.all a',
      summary: '#todo-count',
      clear: '#clear-completed'
    },
    events: {
      'click @ui.clear': 'onClearClick'
    },

    collectionEvents: {
      all: 'render'
    },

    templateHelpers: {
      activeCountLabel: function() {
        return (this.activeCount === 1 ? 'item' : 'items') + ' left';
      }
    },

    initialize: function() {
      this.listenTo(filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection, this);
    },

    serializeData: function() {
      var active = this.collection.getActive().length;
      var total = this.collection.length;
      return {
        activeCount: active,
        totalCount: total,
        completedCount: total - active
      };
    },

    onRender: function() {
      this.$el.parent().toggle(this.collection.length > 0);
      this.updateFilterSelection();
    },

    updateFilterSelection: function() {
      this.ui.filters.removeClass('selected');
			this.ui[filterChannel.request('filterState').get('filter')].addClass('selected');
    },

    onClearClick: function() {
      var completed = this.collection.getCompleted();
      completed.forEach(function(todo) {
        todo.destroy();
      });
    }
  })
})();
