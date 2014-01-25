# gif-explode [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/gif-explode&title=gif-explode&description=hughsk/gif-explode%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Pipe a GIF buffer in, get its individual frames out.

Currently using [gifsicle](https://github.com/yeoman/node-gifsicle) to explode
the frames, and as such it has to write them to disk before they're read
out as streams again. Certainly not ideal, but it works!

## Usage ##

[![gif-explode](https://nodei.co/npm/gif-explode.png?mini=true)](https://nodei.co/npm/gif-explode)

### `require('gif-explode')(frameCreated)` ###

Returns a [writable stream](http://nodejs.org/api/stream.html#stream_class_stream_writable).
Pipe your GIF file into this, and `frameCreated` will be called with readable
stream instances for each frame:

``` javascript
var gif = require('gif-explode')
var fs = require('fs')

fs.createReadStream('doge.gif')
  .pipe(gif(function(frame) {
    frame.pipe(fs.createWriteStream(
      'doge-frame-' + i + '.gif'
    ))
  }))
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/gif-explode/blob/master/LICENSE.md) for details.
