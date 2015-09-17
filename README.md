# sorted-merge-stream

Merge two sorted streams. 

[![Build Status](https://travis-ci.org/cshum/sorted-merge-stream.svg?branch=master)](https://travis-ci.org/cshum/sorted-merge-stream)

```
npm install sorted-merge-stream
```

Shamelessly taken from [sorted-union-stream](https://github.com/mafintosh/sorted-union-stream) with slight modifications, where values with repeated key are also emitted.

### merge(streamA, streamB, [toKey])
Merge two sorted streams. 
By default keys are mapped by `value.key` or `value` itself. Add a `toKey` function if you need custom key mapping.

```js
var merge = require('sorted-merge-stream')

var from = require('from2')
var a = from.obj(['a', 'b', 'd', 'e', 'g', 'h'])
var b = from.obj(['b', 'c', 'f'])

var stream = merge(a, b)

stream.pipe(...)

// 'a', 'b', 'b', 'c', 'd', 'e', 'f', 'g', 'h'
```

Merging multiple streams with custom key mapping:

```js
var merge = require('sorted-merge-stream')

var from = require('from2')
var a = from.obj([{id: 1}, {id: 3}, {id: 6}])
var b = from.obj([{id: 1}, {id: 2}, {id: 6}])
var c = from.obj([{id: 3}, {id: 5}, {id: 6}])

function toKey (data) {
  return data.id
}

var stream = [a, b, c].reduce(function (a, b) {
  return merge(a, b, toKey)
})

stream.pipe(...)

// {id: 1}, {id: 1}, {id: 2}, {id: 3}, {id: 3}, {id: 5}, {id: 6}, {id: 6}, {id: 6}
```

## License

MIT
