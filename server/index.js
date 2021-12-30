const express = require('express')
const path = require('path');
const handler = require('serve-handler');
const getApiRouter = require('./api-router');

const app = express()
const args = process.argv
const absolutePath = path.resolve(args[args.length - 1])
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? 8080 : 3001; // TODO: env var and default to 3001

// Handle api routes
app.use('/api', getApiRouter(absolutePath))

// Serve static files for production
if (isProduction) {
  app.use('/', (req, res) => {
    return handler(req, res, {
      public: './build',
      cleanUrls: true,
      unlisted: '/api/**/*',
    });
  })
}

app.listen(port, () => {
  console.log(`Server started for ${absolutePath} at http://localhost:${port}`)
})
