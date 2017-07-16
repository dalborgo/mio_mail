require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var csession = require('cookie-session');
mongoose.connect('mongodb://localhost/myapp',{ useMongoClient: true });
var app = express();
var env = process.env.NODE_ENV || 'dev';



//app.locals.mail=undefined
var assets = require('connect-assets');
app.use(assets({
        helperContext: app.locals,
        paths: ['public/stylesheets', 'public/javascripts','public/images']
    })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
if(env === 'production') {
    console.log('\x1b[46m%s\x1b[0m', '*** produzione ***');
    app.use(session({
        secret: 'keyboard cat',
        saveUninitialized: true, // don't create session until something stored
        resave: true, //don't save session if unmodified
        store: new MongoStore({mongooseConnection: mongoose.connection,
        ttl: 2 * 24 * 60 * 60})
    }));
}else{
    app.use(session({
        secret: 'ilovescotchscotchyscotchscotch', // session secret
        resave: true,
        saveUninitialized: true
    }));
}
/*
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(csession({
        name: 'session',
        keys: ['key1', 'key2'],
        cookie: { secure: true,
            httpOnly: true,
            domain: 'example.com',
            path: 'foo/bar',
            expires: expiryDate
        }
    })
);
*/

//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use('/', index);
app.use('/users', users);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) { // tolto next
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
