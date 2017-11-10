const $ = require('jquery')
const {
  once_available_fast,
  on_url_change,
  wrap_in_shadow,
} = require('libs_frontend/frontend_libs')

once_available_fast('.first', removeComments);
function removeComments(){
  for (let item of $('.first')) {
    $(item).css('display','none');
  }
}
