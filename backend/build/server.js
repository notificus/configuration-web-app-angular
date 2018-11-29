'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _connectCas = require('connect-cas');

var _connectCas2 = _interopRequireDefault(_connectCas);

var _configuration = require('./services/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _user = require('./services/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var router = _express2.default.Router();
_connectCas2.default.configure({
    protocol: 'https',
    host: 'cas.usherbrooke.ca',
    paths: {
        login: '/login',
        logout: '/logout',
        serviceValidate: '/serviceValidate'
    }
});

var corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
};

app.use((0, _cors2.default)(corsOptions));
app.use(_bodyParser2.default.json());
app.use((0, _expressSession2.default)({
    secret: 'some-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/users/me/configurations').get(function (request, response) {
    if (request.session.cas && request.session.cas.user) {
        _configuration2.default.listConfigurations(request.session.cas.user, function (err, configurations) {
            if (!err && configurations) {
                return response.json(configurations);
            } else {
                return response.json('you suck');
            }
        });
    } else {
        return response.redirect('/login');
    }
});

router.route('/users/me/configurations').put(function (request, response) {
    if (request.session.cas && request.session.cas.user) {
        _configuration2.default.updateConfigurations(request.session.cas.user, request.body, function (err, configurations) {
            if (!err && configurations) {
                return response.json(configurations);
            } else {
                return response.json('you suck');
            }
        });
    } else {
        return response.redirect('/login');
    }
});

router.route('/users/me').get(function (request, response) {
    if (request.session.cas && request.session.cas.user) {
        _user2.default.getUser(request.session.cas.user, function (err, user) {
            if (!err && user) {
                return response.json(user);
            } else if (!err && !user) {
                return response.json('you suck');
            } else {
                return response.json('you suck');
            }
        });
    } else {
        // return response.redirect('/login')
        _user2.default.getUser('garp2405', function (err, user) {
            return response.json(user);
        });
    }
});

router.route('/login').get(_connectCas2.default.serviceValidate(), _connectCas2.default.authenticate(), function (request, response) {
    return response.redirect('/users/me/add');
});

router.route('/users/me/add').get(function (request, response) {
    if (request.session.cas && request.session.cas.user) {
        var cip = request.session.cas.user;
        _user2.default.getUser(cip, function (err, user) {
            if (!err && user) {
                return response.redirect(_config2.default.frontendUrl + '/list');
            } else if (!err && !user) {
                _user2.default.createUser(cip, function (err) {
                    if (!err) {
                        return response.redirect(_config2.default.frontendUrl + '/list');
                    } else {
                        return response.json('you suck');
                    }
                });
            } else {
                return response.json('you suck');
            }
        });
    } else {
        return response.redirect('/login');
    }
});

router.route('/logout').get(function (request, response) {
    if (!request.session) {
        return response.redirect('/');
    }
    if (request.session.destroy) {
        request.session.destroy(function (err) {
            console.log("Couldn't destroy session");
        });
    } else {
        request.session = null;
        console.log('Session null');
    }

    var options = _connectCas2.default.configure();
    options.pathname = options.paths.logout;
    return response.redirect('https://' + options.host + options.pathname);
});

app.use('/', router);

app.listen(_config2.default.port, function () {
    return console.log('Express server is running on port ' + _config2.default.port);
});