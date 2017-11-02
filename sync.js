require('dotenv/config')

module.exports = {
  // server: 'server/public',
  port: process.env.SYNC_PORT,
  proxy: `localhost:${process.env.PORT}`,
  files: 'server/public/*'
}
