var app = app || {};

$(function(){
  // var books = [
  //   {title : 'JavaScript : The Good Parts', author:'Douglas Crockford', releaseDate : '2008', keywords:'JavaScript Programing'},
  //   {title : 'The Little Book on CoffeeScript', author:'Alex MaxCaw', releaseDate : '2012', keywords:'CoffeeScript Programing'},
  //   {title : 'Scala for the Impatient', author:'Cay S. Horstmann', releaseDate : '2012', keywords:'Scala Programing'},
  //   {title : 'America Psycho', author:'Bret Easton Ellis', releaseDate : '1991', keywords:'Novel Splatter'},
  //   {title : 'Eloquent Javascript', author:'Marijn Haverbeke', releaseDate : '2011', keywords:'JavaScript Programing'}
  // ];

  $("#releaseDate").datepicker();

  new app.LibraryView();
});
