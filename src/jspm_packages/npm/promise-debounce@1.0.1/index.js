module.exports = promiseDebounce;
function promiseDebounce(fn, ctx) {
	var pending = null;
	function clear() { pending = null; }
	return function() {
		if (pending) return pending;
		pending = fn.apply(ctx, arguments);
		pending.then(clear, clear);
		return pending;
	}
}
