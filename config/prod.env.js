console.log('process.env.HOST: ', process.env.HOST)
console.log('HOST: ', '"' + process.env.HOST + '"')
console.log('process.env.chatApi: ', process.env.chatApi)
console.log('CHATHOST: ', '"' + process.env.chatApi + '"')
module.exports = {
  NODE_ENV: '"production"',
  HOST: '"' + process.env.HOST + '"',
  CHATHOST: '"' + process.env.chatApi + '"',  
  NAME: '"Lottery"'
}
