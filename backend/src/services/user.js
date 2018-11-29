import request from 'request'
import config from '../config'

var getUserInformation = function(cip, callback) {
    var uri = 'http://zeus.gel.usherbrooke.ca:8080/ms/rest/etudiant_groupe?inscription=200-01-01&cip_etudiant=' + cip
    request.get(uri, { json: true }, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            callback(null, { cip: cip, firstName: body[0].prenom, lastName: body[0].nom })
        } else {
            callback(err, null)
        }
    })
}

module.exports = {
    getUser: function(cip, callback) {
        request.get(config.configurationServiceUrl + '/users/' + cip, { json: true }, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                callback(null, body)
            } else {
                callback(err, null)
            }
        })
    },
    createUser: function(cip, callback) {
        getUserInformation(cip, (err, user) => {
            if (!err && user) {
                request.post(config.configurationServiceUrl + '/users', { json: true, body: user }, (err, response, body) => {
                    if (!err && response.statusCode == 200) {
                        callback(null)
                    } else {
                        callback(err)
                    }
                })
            } else {
                callback(err)
            }
        })
    }
}