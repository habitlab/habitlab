{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'star-display'
  docs: 'Display stars earned through the current nudge'
  properties: {
    num_stars: {
      type: Number
      value: 10
    }
    num_filled_stars: {
      type: Number
      value: 1
    }
    num_unfilled_stars: {
      type: Number
      computed: 'compute_num_unfilled_stars(num_stars, num_filled_stars)'
    }
  }
  compute_num_unfilled_stars: (num_stars, num_filled_stars) ->
    return num_stars - num_filled_stars
  ready: ->
    console.log 'star-display loaded'
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S'
    'once_available'
    'xrange'
  ]
}