const $ = require('jquery')
require('bower_components/paper-toast/paper-toast.deps')

/**
 * Show a toast on the webpage
 * @param {Object} options - a string of toast text or an object of toast properties
 * @param {string} options.text - toast text
 * @param {string} options.duration - duration of the toast
 * @param {string} options.close_button - close button
 * @return {HTMLElement} - The created toast
 */
function show_toast(options) {
  if (typeof(options) == 'string') {
    options = {text: options}
  }
  if (options.close_button == null) {
    options.close_button = true
  }
  if (options.duration == null) {
    options.duration = 0
  }
  let $toast = $('<paper-toast>')
  $toast.css({
    'z-index': 2147483646,
    'margin': '12px',
    'padding': '16px 24px',
    'box-sizing': 'content-box',
    'font-family': 'Verdana, Geneva, Tahoma, "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    'font-size': '14px',
    'line-height': 1,
    //'opacity': 1,
  })
  $toast.attr('text', options.text)
  $toast.attr('vertical-align', 'top')
  $toast.attr('horizontal-align', 'right')
  $toast.attr('duration', options.duration)
  if (options.close_button) {
    let $close_button = $('<div>')
    $close_button.text(' Close')
    $close_button.css({
      'color': '#eeff41',
      'cursor': 'pointer',
      //'float': 'right',
      //'margin-left': '5px'
    })
    $close_button.click(function() {
      $toast[0].hide()
    })
    $close_button.appendTo($toast)
    $toast.append('<br>')
    //$toast.append($('<paper-button text="Close">'))
  }
  //let toast_shadow = wrap_in_shadow($toast[0])
  //document.body.appendChild(toast_shadow)
  document.body.appendChild($toast[0])
  $toast[0].show()
  return $toast[0]
}

module.exports = {
  show_toast
}
