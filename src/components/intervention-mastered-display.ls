{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  get_intervention
} = require 'libs_common/intervention_info'

{
  get_intervention_info
} = require 'libs_common/intervention_utils'

polymer_ext {
  is: 'intervention-mastered-display'
  properties: {
    intervention: {
      type: Object
      value: get_intervention()
    }
  }
}
