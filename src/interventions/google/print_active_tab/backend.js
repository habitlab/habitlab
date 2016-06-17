(function(){
  var print_loop;
  print_loop = setInterval(function(){
    return console.log('background script running');
  }, 1000);
  env.unload = function(){
    return clearInterval(print_loop);
  };
}).call(this);
