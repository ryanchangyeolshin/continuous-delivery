const { describe, before, beforeEach, after, it } = require('mocha')
const { expect } = require('chai')
const express = require('express')
const axios = require('axios')

describe('app', () => {

  let _repo

  before(done => {
    const app = express()
    _repo = { name: 'continuous-delivery', description: 'A practice repository for testing and deployment' }
    app
      .get('/', (req, res) => res.json(_repo))
      .listen(3000 || process.env.PORT, () => done())
  })

  after(done => {
    app.close(() => done())
  })

  describe('GET /', () => {
    it('should return a json object with the repository name and description', async () => {
      const repo = await axios.get('http://localhost:3000/')
      expect(repo).to.deep.equal(_repo)
      expect(repo).to.not.equal('LOL')
    })
  })

})
