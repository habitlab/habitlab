{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-dev'
  properties: {
    categories_and_option_info: {
      type: Array
      value: []
    }
  }
  option_changed: (evt) ->
    checked = evt.target.checked
    option_name = evt.target.option_name
    if checked
      localStorage.setItem(option_name, 'true')
    else
      localStorage.setItem(option_name, 'false')
  ready: ->
    categories_and_option_info = [
      {
        category: 'Intervention Manager Page Options'
        options: [
          {
            name: 'intervention_view_display_internal_names'
            description: 'Display internal names of interventions'
          }
        ]
      }
    ]
    for {options} in categories_and_option_info
      for option in options
        option.value = localStorage.getItem(option.name) == 'true'
    this.categories_and_option_info = categories_and_option_info
}
