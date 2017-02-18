var {
  yfy_node,
  cfy_node,
  cfy,
} = require('../index'); // require('cfy')

var cfy_node_example = cfy_node(function*() {
  var result = yield Promise.resolve(5); // 5
  return result;
});

cfy_node_example(function(err, x) { console.log(x) }); // 5

cfy_node_example().then(function(x) { console.log(x) });

function add_async_node(x, y, nodeback) {
  setTimeout(function() {
    nodeback(null, x + 1);
  }, 1000);
}

var yfy_node_example = cfy_node(function*() {
  var result = yield yfy_node(add_async_node)(5, 1); // 6
  return result;
});

yfy_node_example(function(err, x) { console.log(x) }); // 6

var yfy_nodeback_to_callback_example = cfy(function*() {
  var result = yield yfy_node(add_async_node)(5, 1); // 6
  return result;
});

yfy_nodeback_to_callback_example(function(x) { console.log(x) }); // 6

var yfy_node_example_with_arguments = cfy_node(function*(a, b) {
  var result = yield yfy_node(add_async_node)(5, 1); // 6
  return result + a + b;
});

yfy_node_example_with_arguments(2, 7, function(err, x) { console.log(x) }); // 15
