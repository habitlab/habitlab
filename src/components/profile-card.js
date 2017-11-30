const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

polymer_ext({
  is: 'profile-card',
  properties: {
    name: {
      type: String
    },
    nudges:{
      type: String
    },
    average_rating:{
      type: String
    },
    downloads:{
      type: Number
    }
  },
  ready: async function() {
    //console.log('site is:')
    //console.log(this.site)
    //console.log('ready called in intervention market. fetching data')
    //let data = await fetch('').then(x => x.json())
    //console.log('finished fetching data')
    //console.log(data)
  }
})
