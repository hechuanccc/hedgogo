var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST: 'http://52.184.29.244:8000',
  NAME: 'Lottery'
})
