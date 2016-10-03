const $ = require('jquery')

const {
  once_available
} = require('libs_frontend/common_libs')

once_available('body', () => {
  $('.first').remove();
  $('.redditSingleClick').remove();
  alert("Habitlab has removed links to the comment sections. Don't go down the rabbit hole!");
});
