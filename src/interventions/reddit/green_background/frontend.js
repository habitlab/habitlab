const $ = require('jquery')

const {
  once_available
} = require('libs_frontend/frontend_libs')

// const once_available = require('libs_frontend/frontend_libs')['once_available']

//setTimeout(() => {
//  $('body').css('background-color', 'green')
//}, 3000)

once_available('body', () => {
  $('body').css('background-color', 'green')
})
