var test = require('tape');

var debounce = require('..');
var Promise = require('es6-promise').Promise;

test('async', function(assert) {

	assert.plan(6);

	function run(input) {
		var fn = debounce(function(v) {
			return new Promise(function(resolve, reject) {
				setTimeout(function() {
					resolve(v);
				}, 100);
			});
		});

		fn(input + 0).then(function(v) { assert.equal(v, input); });
		fn(input + 1).then(function(v) { assert.equal(v, input); });
		fn(input + 2).then(function(v) { assert.equal(v, input); });	
	}

	setTimeout(function() { run(1); }, 0);
	setTimeout(function() { run(4); }, 200);

});
