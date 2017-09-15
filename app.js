var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'), Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chewtool', {
	useMongoClient: true,
});
var db = mongoose.connection;

var UserService = require('./services/user')
var UserGroupPolicy = require('./services/group_policy')

var routes = require('./routes/index');
var users = require('./routes/users');
var tests = require('./routes/tests')
var logs = require('./routes/log');
var admins = require('./routes/admins')
var gallery = require('./routes/gallery')
var image = require('./routes/image')

// Init App
var app = express();

// View Engine
var hbs = exphbs.create({
	helpers: {
		ifCond: function (v1, operator, v2, options) {
			switch (operator) {
				case '==':
					return (v1 == v2) ? options.fn(this) : options.inverse(this);
				case '===':
					return (v1 === v2) ? options.fn(this) : options.inverse(this);
				case '!=':
					return (v1 != v2) ? options.fn(this) : options.inverse(this);
				case '!==':
					return (v1 !== v2) ? options.fn(this) : options.inverse(this);
				case '<':
					return (v1 < v2) ? options.fn(this) : options.inverse(this);
				case '<=':
					return (v1 <= v2) ? options.fn(this) : options.inverse(this);
				case '>':
					return (v1 > v2) ? options.fn(this) : options.inverse(this);
				case '>=':
					return (v1 >= v2) ? options.fn(this) : options.inverse(this);
				case '&&':
					return (v1 && v2) ? options.fn(this) : options.inverse(this);
				case '||':
					return (v1 || v2) ? options.fn(this) : options.inverse(this);
				default:
					return options.inverse(this);
			}
		}
	},
	defaultLayout: 'layout'
});
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
	secret: 'chewrobot-tool-secret',
	saveUninitialized: true,
	resave: true
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');	// for passport for
	res.locals.user = req.user || null;
	if (res.locals.user) {
		res.locals.show_manage_panel = UserGroupPolicy.accessToManagePanel(res.locals.user.group)
		res.locals.show_image_panel = UserGroupPolicy.accessToImagePanel(res.locals.user.group)
	}
	next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/test', UserService.ensureAuthenticated, tests);
app.use('/log', UserService.ensureAuthenticated, logs);
app.use('/admin', UserService.ensureAuthenticated, UserGroupPolicy.ensureManagerPrivilege, admins);
app.use('/gallery', UserService.ensureAuthenticated, UserGroupPolicy.accessToGallery, gallery)
app.use('/image',  UserService.ensureAuthenticated, image)

// Set Port
app.set('port', (process.env.PORT || 10010));

app.listen(app.get('port'), function () {
	console.log('Server started on port ' + app.get('port'));
});
