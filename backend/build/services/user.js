'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserInformation = function getUserInformation(cip, callback) {
    var uri = 'http://zeus.gel.usherbrooke.ca:8080/ms/rest/etudiant_groupe?inscription=200-01-01&cip_etudiant=' + cip;
    _request2.default.get(uri, { json: true }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            callback(null, { cip: cip, firstName: body[0].prenom, lastName: body[0].nom });
        } else {
            callback(err, null);
        }
    });
};

module.exports = {
    getUser: function getUser(cip, callback) {
        _request2.default.get(_config2.default.configurationServiceUrl + '/users/' + cip, { json: true }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                callback(null, body);
            } else {
                callback(err, null);
            }
        });
    },
    createUser: function createUser(cip, callback) {
        getUserInformation(cip, function (err, user) {
            if (!err && user) {
                _request2.default.post(_config2.default.configurationServiceUrl + '/users', { json: true, body: user }, function (err, response, body) {
                    if (!err && response.statusCode == 200) {
                        callback(null);
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    }
};