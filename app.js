var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

var db;
if (process.env.ENV == 'Test')
    db = mongoose.connect('mongodb://localhost:27017/bookAPI_test');
else
    db = db = mongoose.connect('mongodb://localhost:27017/bookAPI');

var Book = require('./model/bookModel');
var User = require('./model/userModel');

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

var bookRouter = require('./Routes/bookRoutes')(Book);
var usersRouter = require('./Routes/usersRoutes')(User);
app.use('/api/books', bookRouter);
app.use('/api/users', usersRouter);

app.get('/', function (req, res) {
    res.send('Hello');
});

app.get('/setup', function(req, res) {

    // create a sample user
    var user = new User({ 
      name: 'Debu', 
      password: 'password',
      admin: true 
    });
  
    // save the sample user
    user.save(function(err) {
      if (err) throw err;
  
      console.log('User saved successfully');
      res.json({ success: true });
    });
  });

 

app.listen(port, function () {
    console.log('listening on PORT: ' + port);
});

module.exports = app;