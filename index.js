const { MongoClient } = require('mongodb')
const createApp = require('./create-app')

MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
  createApp(db)
    .listen(process.env.PORT, () => console.log('Listening to PORT' + process.env.PORT))
})
