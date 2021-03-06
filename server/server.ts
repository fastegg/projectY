'use strict';

import * as boot from 'loopback-boot';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as expressFlash from 'express-flash';
import * as expressSession from 'express-session';
import * as loopback from 'loopback';
import * as loopbackPassport from 'loopback-component-passport';
import * as connectMongo from 'connect-mongo';

let mongoStore = connectMongo(expressSession);

let app = module.exports = loopback();

let PassportConfigurator = loopbackPassport.PassportConfigurator;
let passportConfigurator = new PassportConfigurator(app);

let config;
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());

// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', expressSession({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
  store: new mongoStore({url: 'mongodb://localhost:27017/projecty'}),
}));

passportConfigurator.init();

// We need flash messages to see passport errors
app.use(expressFlash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});

for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var loggedInFunc = ensureLoggedIn('/login');

app.get('/auth/account', function(req:any, res:any, next:any) {
    loggedInFunc(req,res,next);
  }, function(req:any, res:any, _next:any) {
  res.send(JSON.stringify(req.user) + ' ' + req.url + '<br/><a href="/auth/logout">Logout</a>');
});

app.get('/login', function(_req:any, res:any) {
  res.send('please login in <a href="/auth/facebook">using fb</a>');
});

app.post('/signup', function(req:any, res:any, _next:any) {
  console.log('Signup!');
  var User = app.models.user;

  var newUser :any = {};
  newUser.email = req.body.email.toLowerCase();
  newUser.username = req.body.username.trim();
  newUser.password = req.body.password;

  User.create(newUser, function(err:any, user:any) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    } else {
      // Passport exposes a login() function on req (also aliased as logIn())
      // that can be used to establish a login session. This function is
      // primarily used when users sign up, during which req.login() can
      // be invoked to log in the newly registered user.
      req.login(user, function(err) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.redirect('/auth/account');
      });
    }
  });
});

app.get('/auth/logout', function(req, res, _next) {
  req.logout();
  res.redirect('/');
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}