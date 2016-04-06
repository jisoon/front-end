var app = app || {};

app.Book = Backbone.Model.extend({
  defaults : {
    coverImage : 'img/placeholder.jpg',
    title : 'No titlge',
    author : 'Unknown',
    releaseDate: 'Unknown',
    keywords : 'None'
  },
  // parse 함수는 모델 생성자에게 전달하기 전에 서버의 응답을 편집할 수 있도록 해준다.
  // 결국 모델 생성자가 실행되기 전에 parse 함수가 동작을 한다.
  // parse :function(response){
  //   response.id = response._id;
  //   return response;
  // }

  // 모델의 아이디를 설정하는 다른 방법은
  idAttribute : '_id'
});
