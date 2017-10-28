require('dotenv/config')
const { MongoClient } = require('mongodb')
const { describe, before, after, it } = require('mocha')
const { expect } = require('chai')
const axios = require('axios')
const createApp = require('../create-app')

describe('app', () => {

  let _db
  let _repo
  let server

  before('connect to mongodb', done => {
    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      _db = db
      _repo = { name: 'continuous-delivery', description: 'A practice repository for testing and deployment' }
      server = createApp(db)
        .listen(process.env.PORT, () => done())
    })
  })

  after('disconnect from mongodb', done => {
    _db.close()
    server.close(() => done())
  })

  describe('GET /', () => {
    it('should return a json object with the repository name and description', async () => {
      const { data } = await axios.get('http://localhost:3000/')
      expect(data).to.deep.equal(_repo)
    })
  })
})
