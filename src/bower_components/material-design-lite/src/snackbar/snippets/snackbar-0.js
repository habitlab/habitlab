
(function() {
  'use strict';
  var snackbarContainer = document.querySelector('#demo-snackbar-example');
  var showSnackbarButton = document.querySelector('#demo-show-snackbar');
  var handler = function(event) {
    showSnackbarButton.style.backgroundColor = '';
  };
  showSnackbarButton.addEventListener('click', function() {
    'use strict';
    showSnackbarButton.style.backgroundColor = '#' +
        Math.floor(Math.random() * 0xFFFFFF).toString(16);
    var data = {
      message: 'Button color changed.',
      timeout: 2000,
      actionHandler: handler,
      actionText: 'Undo'
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  });
}());
