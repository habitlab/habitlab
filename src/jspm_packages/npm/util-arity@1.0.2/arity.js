var FUNCTIONS = {};

/**
 * Create a function wrapper that specifies the argument length.
 *
 * @param  {Number}   arity
 * @param  {Function} fn
 * @return {Function}
 */
module.exports = function (arity, fn) {
  if (!FUNCTIONS[arity]) {
    var params = Array(arity + 1).join(', _').substr(2);

    FUNCTIONS[arity] = new Function(
      'fn',
      'return function (' + params + ') { return fn.apply(this, arguments); }'
    );
  }

  return FUNCTIONS[arity](fn);
};
