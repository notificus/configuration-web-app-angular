var config = {}

config.port = process.env.CONFIGURATION_WEB_APP_PORT || 4000
config.configurationServiceUrl = process.env.CONFIGURATION_SERVICE_URL || 'http://localhost:8081'

module.exports = config