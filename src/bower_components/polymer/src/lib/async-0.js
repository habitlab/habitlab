

Polymer.Async = {

  _currVal: 0,
  _lastVal: 0,
  _callbacks: [],
  _twiddleContent: 0,
  _twiddle: document.createTextNode(''),

  run: function (callback, waitTime) {
    if (waitTime > 0) {
      return ~setTimeout(callback, waitTime);
    } else {
      this._twiddle.textContent = this._twiddleContent++;
      this._callbacks.push(callback);
      return this._currVal++;
    }
  },

  cancel: function(handle) {
    if (handle < 0) {
      clearTimeout(~handle);
    } else {
      var idx = handle - this._lastVal;
      if (idx >= 0) {
        if (!this._callbacks[idx]) {
          throw 'invalid async handle: ' + handle;
        }
        this._callbacks[idx] = null;
      }
    }
  },

  _atEndOfMicrotask: function() {
    var len = this._callbacks.length;
    for (var i=0; i<len; i++) {
      var cb = this._callbacks[i];
      if (cb) {
        try {
          cb();
        } catch(e) {
          // Clear queue up to this point & start over after throwing
          i++;
          this._callbacks.splice(0, i);
          this._lastVal += i;
          this._twiddle.textContent = this._twiddleContent++;
          throw e;
        }
      }
    }
    this._callbacks.splice(0, len);
    this._lastVal += len;
  }
};

new window.MutationObserver(function() {
    Polymer.Async._atEndOfMicrotask();
  }).observe(Polymer.Async._twiddle, {characterData: true});

