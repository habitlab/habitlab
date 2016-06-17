(function(){
  var getUrlParameters, once_available, once_true, memoizeSingleAsync, run_only_one_at_a_time, on_url_change, out$ = typeof exports != 'undefined' && exports || this;
  out$.getUrlParameters = getUrlParameters = function(){
    var url, hash, map, parts;
    url = window.location.href;
    hash = url.lastIndexOf('#');
    if (hash !== -1) {
      url = url.slice(0, hash);
    }
    map = {};
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
      return map[key] = decodeURIComponent(value).split('+').join(' ');
    });
    return map;
  };
  out$.once_available = once_available = function(selector, callback){
    var current_result;
    current_result = document.querySelectorAll(selector);
    if (current_result.length > 0) {
      return callback(current_result);
    } else {
      return setTimeout(function(){
        return once_available(selector, callback);
      }, 100);
    }
  };
  out$.once_true = once_true = function(condition, callback){
    if (condition()) {
      return callback();
    } else {
      return setTimeout(function(){
        return once_true(condition, callback);
      }, 100);
    }
  };
  out$.memoizeSingleAsync = memoizeSingleAsync = function(func){
    var cached_val;
    cached_val = null;
    return function(callback){
      if (cached_val != null) {
        callback(cached_val);
        return;
      }
      return func(function(result){
        cached_val = result;
        return callback(result);
      });
    };
  };
  out$.run_only_one_at_a_time = run_only_one_at_a_time = function(func){
    var is_running;
    is_running = false;
    return function(){
      if (is_running) {
        return;
      }
      is_running = true;
      return func(function(){
        return is_running = false;
      });
    };
  };
  out$.on_url_change = on_url_change = function(func){
    var prev_url;
    prev_url = window.location.href;
    return chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
      var type, data, prev_url;
      type = msg.type, data = msg.data;
      if (type === 'navigation_occurred') {
        if (data.url !== prev_url) {
          prev_url = data.url;
          return func();
        }
      }
    });
  };
}).call(this);
