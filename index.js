var spawn = require('child_process').spawn
var gifsicle = require('gifsicle').path
var streamify = require('streamify')
var fs = require('graceful-fs')
var rimraf = require('rimraf')
var async = require('async')
var path = require('path')
var tmp = require('tmp')

module.exports = createStream

function createStream(frameCreated) {
  var stream = streamify()

  tmp.dir({
    unsafeCleanup: true
  }, function(err, location) {
    if (err) throw err

    var ps = spawn(gifsicle, [
        '--unoptimize'
      , '--explode'
    ], {
        cwd: location
      , env: {}
    })

    stream.resolve(ps.stdin)
    ps.once('exit', function(code) {
      fs.readdir(location, handleFiles)
    })

    function handleFiles(err, files) {
      if (err) return stream.emit('error', err)

      if (!files.length) return stream.emit('error', new Error(
        'No frames could be extracted from the supplied GIF. ' +
        'This could be because of a processing error, ' +
        'such as piping in a non-GIF buffer'
      ))

      async.mapLimit(files, 10, function(file, next, i) {
        file = path.resolve(location, file)

        var fileStream = fs.createReadStream(file)
          .once('error', next)
          .once('close', next)

        frameCreated(fileStream, i)
      }, finished)
    }

    function finished(err) {
      if (err) stream.emit('error', err)
      rimraf(location, function(error) {
        if (error && !err) return stream.emit('error', error)
      })
    }
  })

  return stream
}
