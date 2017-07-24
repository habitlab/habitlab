const $ = require('jquery')
require('bower_components/paper-toast/paper-toast.deps')

function show_toast(options) {
  if (typeof(options) == 'string') {
    options = {text: options}
  }
  let toast = $('<paper-toast>')
  toast.attr('text', options.text)
  $('body').append(toast)
  console.log(toast[0])
  console.log(toast[0].open)
  console.log(toast[0].show)
  toast[0].show()
}

module.exports = {
  show_toast
}