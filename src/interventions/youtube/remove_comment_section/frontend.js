const $ = require('jquery')

const {
  once_available
} = require('libs_frontend/common_libs')

once_available('#watch-discussion', () => {
  $('#watch-discussion').hide();
})
