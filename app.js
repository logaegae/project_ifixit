var app = require('express')(),
  swig = require('swig'),
  express = require('express'),
  mysql = require('mysql'),
  bodyParser = require('body-parser'),
  http = require('http');


var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, require("./service/mysql"));

/**
 * Root Path 설정
 */
require('app-module-path').addPath(__dirname);

app.engine('html', swig.renderFile);

app.set('port', process.env.PORT || 3060);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));


app.use(require('express-domain-middleware'));


app.set('view cache', false);
swig.setDefaults({ cache: false });



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("./routes/router"));
app.all("/", function(req, res) {
	if(req._parsedUrl.search) {
		res.redirect("/html/src/home.html"+req._parsedUrl.search);	
	} else {
		res.redirect("/html/src/home.html");
	}
	
});	
app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
});
