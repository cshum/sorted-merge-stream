var test = require('tape')
var from = require('from2')
var callback = require('callback-stream')
var merge = require('./')

test('merge', function (t) {
  var a = from.obj(['a', 'b', 'd', 'e', 'g', 'h'])
  var b = from.obj(['b', 'c', 'f'])
  merge(a, b).pipe(callback.obj(function (err, data) {
    t.notOk(err)
    t.deepEqual(data, [
      'a', 'b', 'b', 'c', 'd', 'e', 'f', 'g', 'h'
    ], 'merge sort')
    t.end()
  }))
})

test('merge sort array custom key', function (t) {
  function toKey (data) {
    return data.id
  }

  var a = from.obj([{id: 1}, {id: 3}, {id: 6}])
  var b = from.obj([{id: 1}, {id: 2}, {id: 6}])
  var c = from.obj([{id: 3}, {id: 5}, {id: 6}]);

  [a, b, c].reduce(function (a, b) {
    return merge(a, b, toKey)
  }).pipe(callback.obj(function (err, data) {
    t.notOk(err)
    t.deepEqual(data, [
      {id: 1}, {id: 1},
      {id: 2},
      {id: 3}, {id: 3},
      {id: 5},
      {id: 6}, {id: 6}, {id: 6}
    ], 'merge sort')
    t.end()
  }))
})
