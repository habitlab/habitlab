(function(){
  document.querySelector('body').style.backgroundColor = 'blue';
  setInterval(function(){
    return console.log('make background blue content script running');
  }, 1000);
}).call(this);
