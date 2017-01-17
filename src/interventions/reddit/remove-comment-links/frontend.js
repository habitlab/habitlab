const $ = require('jquery')

const {
  once_available
} = require('libs_frontend/common_libs')

const swal = require('sweetalert2')

const {
  load_css_file
} = require('libs_common/content_script_utils')

const co = require('co')

co(function*() {
  yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
  once_available('body', () => {
    if(document.URL == "https://www.reddit.com/" ||
      (document.URL.includes('https://www.reddit.com/r/') && !document.URL.includes('comments'))){
      swal(
      {title: "Don't go down the rabbit hole!",
      text: "Should HabitLab remove links to comment sections on this page?",
      type: "info",
      showCancelButton: true,
      confirmButtonText: "Yep, get rid of them!",
      cancelButtonText: "Nope!"}).then(
        function(result) {
          $('.first').remove();
          $('.redditSingleClick').remove();
        }
      );
    }
  });
})

window.debugeval = x => eval(x);