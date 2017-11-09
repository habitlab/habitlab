const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

polymer_ext({
  is: 'intervention-market',
  properties: {
    site: {
      type: String
    }
  },
  ready: async function() {
    console.log('site is:')
    console.log(this.site)
    console.log('ready called in intervention market. fetching data')
    let data = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json').then(x => x.json())
    console.log('finished fetching data')
    //console.log(data)
  }
})
