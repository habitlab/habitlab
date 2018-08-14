const {
  get_abtest_set,
  set_abtest,
} = require('libs_backend/abtest_utils')

const {
  getUrlParameters
} = require('libs_frontend/frontend_libs')

Polymer({
  is: 'abtest-adjust',
  ready: async function() {
    let url_parameters = getUrlParameters()
    let abtest_set = get_abtest_set()
    let newly_set_parameters = []
    for (let key of Object.keys(url_parameters)) {
      if (key == 'tag') {
        continue
      }
      if (!abtest_set.has(key)) {
        console.log('skipping unknown abtest: ' + key)
        continue
      }
      let val = url_parameters[key]
      await set_abtest(key, val)
      newly_set_parameters.push({
        key: key,
        val: val,
      })
    }
    this.newly_set_parameters = newly_set_parameters
  }
})
