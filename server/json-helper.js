const { lstatSync } = require("fs");
const path = require('path');
const mm = require('music-metadata')

const isFlac = path => path.endsWith('.flac')

async function getMetaData(path) {
  const metadata = await mm.parseFile(path);
  const [artist, title, album, date] = metadata.native?.vorbis||[];
  
  return {
    artist: artist?.value ?? '',
    title: title?.value ?? '',
    album: album?.value ?? '',
    date: date?.value ?? '',
  }
}

const directorytoJson = async (paths = [], absolutePath = '') => {
  if (paths == null || !Array.isArray(paths)) { return [] }

  const result = [];

  for (let fileOrDirectory of paths) {
    const filePath = path.resolve(absolutePath, fileOrDirectory);
    const stats = lstatSync(filePath)

    if (stats.isFile() && isFlac(filePath)) {
      const metadata = await getMetaData(filePath)

      result.push({
        type: 'flac',
        path: fileOrDirectory,
        metadata,
      })
    }

    if (stats.isDirectory(filePath)) {
      result.push({
        type: 'directory',
        path: fileOrDirectory,
      })
    }
  }

  return result;
}

module.exports = {
  directorytoJson
}
