const $ = require('jquery')
const {polymer_ext} = require('libs_frontend/polymer_utils')

polymer_ext({
  is: 'positive-site-trigger',
  properties: {
    site: {
      type: String,
      value: 'Duolingo'
    }
  }
})