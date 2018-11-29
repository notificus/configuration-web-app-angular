import request from 'request'
import config from '../config'

module.exports = {
    listConfigurations: function(cip, callback) {
        request.get(config.configurationServiceUrl + '/users/' + cip + '/configurations', { json: true }, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                callback(null, body)
            } else {
                callback(err, null)
            }
        })
    },
    updateConfigurations: function(cip, configurations, callback) {
        request.put(config.configurationServiceUrl + '/users/' + cip + '/configurations', { json: true, body: configurations }, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                callback(null, body)
            } else {
                callback(err, null)
            }
        })
    }
}