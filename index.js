const express = require('express')
const app = express()

app
  .get('/', (req, res) => {
    res.json({
      name: 'continuous-delivery',
      description: 'A practice repository for testing and deployment'
    })
  })
  .listen(3000 || process.env.PORT, () => console.log('Listening to PORT 3000'))
