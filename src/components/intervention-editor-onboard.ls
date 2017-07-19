{polymer_ext} = require 'libs_frontend/polymer_utils'
{list_custom_interventions}=require 'libs_backend/intervention_utils'
polymer_ext {
  is: 'intervention-editor-onboard'
  properties:{
    custom_intervention_list:{
      type:Array
    }
    templates_list:{
      type:Array
    }
  }
  refresh_custom_intervention_list: ->>
    this.custom_intervention_list=await list_custom_interventions()
  ready: ->>
    self=this
    await self.refresh_custom_intervention_list()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
  ]
}