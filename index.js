var iterate = require('stream-iterate')
var from = require('from2')

function defaultKey (val) {
  return val.key || val
}

module.exports = function merge (streamA, streamB, toKey, opts) {
  var readA = iterate(streamA)
  var readB = iterate(streamB)

  if (typeof toKey !== 'function') {
    opts = toKey
    toKey = defaultKey
  }

  opts = opts || {}
  var reverse = !!opts.reverse

  var stream = from.obj(function loop (size, cb) {
    readA(function (err, dataA, nextA) {
      if (err) return cb(err)
      readB(function (err, dataB, nextB) {
        if (err) return cb(err)

        if (!dataA && !dataB) return cb(null, null)

        if (!dataA) {
          nextB()
          return cb(null, dataB)
        }

        if (!dataB) {
          nextA()
          return cb(null, dataA)
        }

        var keyA = toKey(dataA)
        var keyB = toKey(dataB)

        if (keyA === keyB) {
          nextB()
          cb(null, dataB)
          return loop(size, cb)
        }

        if ((keyA < keyB && !reverse) || (keyA > keyB && reverse)) {
          nextA()
          return cb(null, dataA)
        }

        nextB()
        cb(null, dataB)
      })
    })
  })

  stream.on('close', function () {
    if (streamA.destroy) streamA.destroy()
    if (streamB.destroy) streamB.destroy()
  })

  return stream
}
