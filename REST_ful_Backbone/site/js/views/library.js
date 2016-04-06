var app = app || {};


app.LibraryView = Backbone.View.extend({
  el: "#books",
  events:{
    'click #add':'addBook'
  },
  initialize: function() {
    this.collection = new app.Library();

    // reset:true 하게 되면 reset 이벤트가 발생
    this.collection.fetch({reset:true});
    this.render();

    // 데이터베이스에서 라이브러리로 데이터를 채우고 있기 때문에 intialize() 함수에서
    // 더 이상 인자로 샘플 데이터를 전달할 필요가 없고,
    // app.Library 생성자에 아무것도 전달할 필요가 없다.
    this.listenTo(this.collection, 'add', this.renderBook);

    // 비동기적으로 reset 이벤트를 듣기 위해 리스너를 추가해야 한다.
    this.listenTo(this.collection, 'reset', this.render);

  },
  render: function() {
    this.collection.each(function(item) {
      console.log(item);
      console.log(item.title);
      this.renderBook(item);
    }, this);
  },
  renderBook: function(item) {
    var bookView = new app.BookView({
      model: item
    });
    this.$el.append(bookView.render().el);
  },
  addBook:function(e){
    e.preventDefault();
    var formData = {};
    // jquery children 은 자식의 input 의 element 배열을 리턴한다.
    $('#addBook div').children('input').each(function(idx, el){
      if($(el).val() != ''){

        if(el.id === 'keywords'){
          formData[el.id] = [];
          _.each($(el).val().split( ' ' ), function( keyword ){
            formData[ el.id ].push({'keyword': keyword});
          });
        }else if(el.id === 'releaseDate'){
          formData[ el.id ] = $("#releaseDate").datepicker('getDate').getTime();
        }else{
          // Documnet.element.id 는 Element Object 의 내장 프로퍼티
          formData[el.id] = $(el).val();
        }
      }
      $(el).val('');
    });
    console.log(formData);
    // Backbone.Collection.add 는 서버와 동기화하지 못하기 때문에,
    // 모델은 서버 상에서 지속성을 유지하지 못한다.
    // create 메소드는 지속성을 유지한다.
    this.collection.create(formData);
  }
});

function testCreateMapArray(){
  var myCars = new Array();
  myCars['b'] = "BMW";
  myCars['h'] = "huyndai";
  myCars['k'] = "kia";
  console.log(myCars);
}
