var {
  yfy,
  cfy,
  yfy_multi,
} = require('../index'); // require('cfy')

var cfy_example = cfy(function*() {
  var result = yield Promise.resolve(5); // 5
  return result;
});

cfy_example(function(x) { console.log(x) }); // 5

cfy_example().then(function(x) { console.log(x) }); // 5

function add_async(x, y, callback) {
  setTimeout(function() {
    callback(x + y);
  }, 1000);
}

var yfy_example = cfy(function*() {
  var result = yield yfy(add_async)(5, 1); // 6
  return result;
});

yfy_example(function(x) { console.log(x) }); // 6

function addone_multiarg_callback_async(x, callback) {
  setTimeout(function() {
    callback(x + 1, 'foo', 'bar');
  }, 1000);
}

var yfy_example_with_arguments = cfy(function*(a, b) {
  var result = yield yfy(add_async)(5, 1); // 6
  return result + a + b;
});

yfy_example_with_arguments(2, 7, function(x) { console.log(x) }); // 15

var yfy_multi_example = cfy(function*() {
  var [result, result2, result3] = yield yfy_multi(addone_multiarg_callback_async)(5); // result=6, result2='foo', result3='bar'
  return [result, result2, result3];
});

yfy_multi_example(function(x) { console.log(x) }); // [6, 'foo', 'bar']

var sleep = cfy(function*(time) {
  function sleep_base(msecs, callback) {
    setTimeout(callback, msecs);
  }
  yield yfy(sleep_base)(time);
});

var sleep_example = cfy(function*() {
  yield sleep(3000); // sleeps for 3 seconds
  return 7;
});

sleep_example(function(x) { console.log(x) }); // 7
