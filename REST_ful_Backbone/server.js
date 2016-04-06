var application_root = __dirname,
express = require('express'),
path = require('path'),
mongoose = require('mongoose');



mongoose.connect('mongodb://localhost/library_database');

var Keywords = new mongoose.Schema({
  keyword : String
});

var Book = new mongoose.Schema({
  title:String,
  author:String,
  releaseDate:Date,
  keywords:[ Keywords ]//
});
var BookModel = mongoose.model('Book',Book);



var app = express();

app.configure(function(){
// 요청된 body를 파싱하고 request.body에 넣는다.
  app.use(express.bodyParser());
// HTTP 메서드를 오버라이드하여 request.body를 확인한다.
  app.use(express.methodOverride());
// HTTP 메서드와 URL을 기반으로 경로를 확인한다.
  app.use(app.router);
// 정적컨텐츠를 제공한다.
  app.use(express.static(path.join(application_root, 'site')));
// 개발 시에 필요한 모든 에러를 보여준다.
  app.use(express.errorHandler({dumpExceptions:true, showStact:true}));

});

app.get('/api', function(request, response){
  response.send('Library API is running');
});

// books
app.get('/api/books', function(request, response){
  return BookModel.find(function(err, books){
    if(!err){
      return response.send(books);
    }else{
      return console.log(err);
    }
  })
});

// book add
app.post('/api/books', function(request, response){
  console.log(request.body.keywords);
  var book = new BookModel({
    title : request.body.title,
    author : request.body.author,
    releaseDate : request.body.releaseDate,
    keywords : request.body.keywords
  });
  book.save(function(err){
    if(!err){
      return console.log('created');
    }else{
      return console.log(err);
    }
    return response.send(book);
  })
});

// book
app.get('/api/books/:id', function(req, res){
  return BookModel.findById(req.params.id, function(err, book){
    if(!err){
      return res.send(book);
    }else{
      return console.log(err);
    }
  })
});

// book update
app.put('/api/books/:id', function(req, res){
  console.log('Updating book' + req.body.title);
  return BookModel.findById(req.params.id, function(err, book){
    book.title = req.body.title;
    book.author = req.body.author;
    book.releaseDate = req.body.releaseDate;
    return book.save(function(err){
      if(!err){
        console.log('book updated');
      }else{
        console.log(err);
      }
    });
  });
});

// book delete
app.delete('/api/books/:id', function(req, res){
  return BookModel.findById(req.params.id, function(err, book){
    return book.remove(function(err){
      if(!err){
        console.log('book deleted');
        return res.send('');
      }else{
        console.log(err);
      }
    })
  })
})

var port = 4711;
app.listen(port, function(){
  console.log('Express server listening on poert %d in %s mode', port, app.settings.evn);
});
