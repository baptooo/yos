const express = require('express')
const path = require('path');
const {readdirSync, statSync, access, createReadStream} = require('fs');
const { directorytoJson } = require('./json-helper');

const app = express()
const port = 3001;
const args = process.argv
const absolutePath = path.resolve(args[args.length - 1])

const apiRouter = express.Router()
const startedAt = Date.now();

apiRouter.get('/', (req, res) => {
  res.send('This is the API server, please run <strong>yarn start</strong> command.')
})

apiRouter.get('/info', (req, res) => {
  const lastPartAbsolutePath = absolutePath.split('/').slice(-1);

  res.json({
    startedAt,
    absolutePath,
    originPath: lastPartAbsolutePath,
  })
})

apiRouter.get('/path/:path?*', async (req, res) => {
  const decodedPath = decodeURI(req.path)
  const toReadPath = path.resolve(absolutePath, decodedPath.replace(/\/path\/?/, ''))

  try {
    const paths = readdirSync(toReadPath);
    const json = await directorytoJson(paths, toReadPath);

    console.log('-<[json]>-', json)

    res.json(json)
  } catch (err) {
    res.send(`Error: ${err}`)
  }
})

apiRouter.get('/play/:path*', (req, res) => {
  const decodedPath = decodeURI(req.path)
  const toPlayFile = path.resolve(absolutePath, decodedPath.replace(/\/play\/?/, ''))

  const stat = statSync(toPlayFile);
  const total = stat.size;
  if (req.headers.range) {

  }
  access(toPlayFile, (accessError) => {
      if (accessError == null) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, '').split('-');
        const partialStart = parts[0];
        const partialEnd = parts[1];

        const start = parseInt(partialStart, 10);
        const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
        const chunksize = (end - start) + 1;
        const rstream = createReadStream(toPlayFile, {start: start, end: end});

        res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
          'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
          'Content-Type': 'audio/flac'
        });
        rstream.pipe(res);
      } else {
          res.send('Error - 404');
          res.end();
      }
  });

  // try {
  //   const stats = lstatSync(toReadFile)

  //   if (stats.isFile()) {
  //     console.log('-<[Playing]>-', toReadFile)
  //     return readFileSync(toReadFile);
  //   }
  // } catch (err) {
  //   res.send(`Error: ${err}`)
  // }
})

app.use('/api', apiRouter)

app.listen(port, () => {
  console.log(`Server started for ${absolutePath}`)
})
