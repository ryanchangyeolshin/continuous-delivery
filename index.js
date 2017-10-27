const createApp = require('./create-app')

createApp()
  .listen(process.env.PORT, () => console.log('Listening to PORT' + process.env.PORT))
