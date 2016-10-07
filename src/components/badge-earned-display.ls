{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

{
  get_intervention
} = require 'libs_common/intervention_info'

polymer_ext {
  is: 'badge-earned-display'
  properties: {
    minutes_saved: {
      type: Number
      value: 30
    }
  }
}
