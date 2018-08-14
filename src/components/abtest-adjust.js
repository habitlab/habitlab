const {
  get_abtest_set
} = require('libs_backend/abtest_utils')

const {
  getUrlParameters
} = require('libs_frontend/frontend_libs')

const {
  setvar_experiment
} = require('libs_backend/db_utils')

Polymer({
  is: 'abtest-adjust',
  ready: async function() {
    let url_parameters = getUrlParameters()
    let abtest_set = get_abtest_set()
    for (let key of Object.keys(url_parameters)) {
      if (key == 'tag') {
        continue
      }
      if (!abtest_set.has(key)) {
        console.log('skipping unknown abtest: ' + key)
        continue
      }
      let val = url_parameters[key]
      await setvar_experiment(key, val)
    }
  }
})
