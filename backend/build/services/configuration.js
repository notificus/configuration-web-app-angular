'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    listConfigurations: function listConfigurations(cip, callback) {
        _request2.default.get(_config2.default.configurationServiceUrl + '/users/' + cip + '/configurations', { json: true }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                callback(null, body);
            } else {
                callback(err, null);
            }
        });
    },
    updateConfigurations: function updateConfigurations(cip, configurations, callback) {
        _request2.default.put(_config2.default.configurationServiceUrl + '/users/' + cip + '/configurations', { json: true, body: configurations }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                callback(null, body);
            } else {
                callback(err, null);
            }
        });
    }
};