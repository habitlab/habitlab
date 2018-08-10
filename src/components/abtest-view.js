const {
  get_abtest_list,
  get_assigned_abtest_conditions,
} = require('libs_backend/abtest_utils')

const {
  getvar_experiment,
} = require('libs_backend/db_utils')


Polymer({
  is: 'abtest-view',
  properties: {
    
  },
  ready: async function() {
    console.log('abtest-view')
    let abtest_list = get_abtest_list()
    let abtest_assignments = await get_assigned_abtest_conditions()
    for (let abtest of abtest_list) {
      if (abtest_assignments[abtest] == null) {
        continue
      }
      console.log(abtest)
      console.log(abtest_assignments[abtest])
    }
  }
})
