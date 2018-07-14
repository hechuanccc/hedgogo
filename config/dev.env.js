var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST: '"http://b583747.eastasia.cloudapp.azure.com:8000"',
  CHATHOST: '"http://b583747.eastasia.cloudapp.azure.com:8003"',  
  NAME: '"Lottery"'
})
