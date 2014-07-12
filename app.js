
var express = require('express');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware');
var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(lessMiddleware(__dirname));
app.use(express.static(__dirname));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
