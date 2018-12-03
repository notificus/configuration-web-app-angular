import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import cas from 'connect-cas';
import configurationService from './services/configuration'
import userService from './services/user'
import config from './config'

const app = express();
const router = express.Router();
cas.configure({
    protocol: 'https',
    host: 'cas.usherbrooke.ca',
    paths: {
        login: '/login',
        logout: '/logout',
        serviceValidate: '/serviceValidate'
    }
})

var corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session({
    secret: 'some-key',
    resave: false,
    saveUninitialized: true
}))

router.route('/users/me/configurations').get((request, response) => {
    if (request.session.cas && request.session.cas.user) {
        configurationService.listConfigurations(request.session.cas.user, (err, configurations) => {
            if (!err && configurations) {
                return response.json(configurations)
            } else {
                return response.json('you suck')
            }
        })
    } else {
        return response.redirect('/login')
    }
})

router.route('/users/me/configurations').put((request, response) => {
    if (request.session.cas && request.session.cas.user) {
        configurationService.updateConfigurations(request.session.cas.user, request.body, (err, configurations) => {
            if (!err && configurations) {
                return response.json(configurations)
            } else {
                return response.json('you suck')
            }
        })
    } else {
        return response.redirect('/login')
    }
})

router.route('/users/me').get((request, response) => {
    if (request.session.cas && request.session.cas.user) {
        userService.getUser(request.session.cas.user, (err, user) => {
            if (!err && user) {
                return response.json(user)
            } else if (!err && !user) {
                return response.json('you suck')
            } else {
                return response.json('you suck')
            }
        })
    } else {
        // return response.redirect('/login')
        userService.getUser('garp2405', (err, user) => {
            return response.json(user)
        })
    }
})

router.route('/login').get(cas.serviceValidate(), cas.authenticate(), (request, response) => {
    return response.redirect('/users/me/add')
})

router.route('/users/me/add').get((request, response) => {
    if (request.session.cas && request.session.cas.user) {
        var cip = request.session.cas.user
        userService.getUser(cip, (err, user) => {
            if (!err && user) {
                return response.redirect('http://localhost:4200/list')
            } else if (!err && !user) {
                userService.createUser(cip, (err) => {
                    if (!err) {
                        return response.redirect('http://localhost:4200/list')
                    } else {
                        return response.json('you suck')
                    }
                })
            } else {
                return response.json('you suck')
            }
        })
    } else {
        return response.redirect('/login')
    }
})

router.route('/logout').get((request, response) => {
    if (!request.session) {
        return response.redirect('/')
    }
    if (request.session.destroy) {
        request.session.destroy((err) => {
            console.log("Couldn't destroy session")
        })
    } else {
        request.session = null
        console.log('Session null')
    }

    var options = cas.configure();
    options.pathname = options.paths.logout
    return response.redirect('https://' + options.host + options.pathname)
})

app.use('/', router);

app.listen(config.port, () => console.log('Express server is running on port ' + config.port));