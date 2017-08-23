const {polymer_ext} = require('libs_frontend/polymer_utils')

const {
  get_random_quote
} = require('libs_frontend/quote_utils')

polymer_ext({
  is: 'quote-message',
  properties: {
    quote: {
      type: Object,
      value: {
        text: "Test",
        source: "Matt",
        id: -1
      }
    }
  },
  ready: function() {
    this.quote = get_random_quote()
  }
})