{
  localstorage_getbool
  localstorage_setbool
} = require 'libs_common/localstorage_utils'

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
    localstorage_setbool(option_name, checked)
  ready: ->
    categories_and_option_info = [
      {
        category: 'Intervention Manager Page Options'
        options: [
          {
            name: 'display_dlog'
            description: 'Recommended: Display info logged with dlog under console.log'
          }
          {
            name: 'intervention_view_show_internal_names'
            description: 'Recommended: Show internal names of goals and interventions'
          }
          {
            name: 'index_show_url_bar'
            description: 'Recommended for developers using Opera: Show URL bar on the bottom of extension pages'
          }
          {
            name: 'intervention_view_show_debug_all_interventions_goal'
            description: 'Show the debug/all_interventions goal'
          }
          {
            name: 'intervention_view_show_parameters'
            description: 'Show the parameters for each intervention'
          }
          {
            name: 'intervention_view_show_randomize_button'
            description: 'Show the randomize interventions button'
          }
        ]
      }
    ]
    for {options} in categories_and_option_info
      for option in options
        option.value = localstorage_getbool(option.name)
    this.categories_and_option_info = categories_and_option_info
}
