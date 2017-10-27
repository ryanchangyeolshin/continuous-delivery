const { describe, before, beforeEach, after, it } = require('mocha')
const { expect } = require('chai')
const express = require('express')
const axios = require('axios')

describe('app', () => {

  let _repo
  let server

  before(done => {
    const app = express()
    _repo = { name: 'continuous-delivery', description: 'A practice repository for testing and deployment' }
    server = app
      .get('/', (req, res) => res.json(_repo))
      .listen(3000 || process.env.PORT, () => done())
  })

  after(done => {
    server.close(() => done())
  })

  describe('GET /', () => {
    it('should return a json object with the repository name and description', async () => {
      const { data } = await axios.get('http://localhost:3000/')
      expect(data).to.deep.equal(_repo)
      expect(data).to.not.equal('LOL')
    })
  })

})
