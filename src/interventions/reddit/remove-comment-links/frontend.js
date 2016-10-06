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
    $('.first').remove();
    $('.redditSingleClick').remove();
    swal("Habitlab has removed links to the comment sections. Don't go down the rabbit hole!");
  });
})
