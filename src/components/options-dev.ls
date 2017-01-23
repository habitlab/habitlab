{
  localstorage_getbool
  localstorage_setbool
} = require 'libs_common/localstorage_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

detect_if_opera = ->
  return navigator.userAgent.indexOf(' OPR/') != -1

polymer_ext {
  is: 'options-dev'
  properties: {
    categories_and_option_info: {
      type: Array
      value: []
    }
    categories_and_option_info_default: {
      type: Array
      value: [
        {
          category: 'General HabitLab Developer Options'
          options: [
            {
              name: 'display_dlog'
              description: 'Display info logged with dlog under console.log'
              recommended: 'all'
            }
          ]
        }
        {
          category: 'Browser Action Page (popup-view) Options'
          options: [
            {
              name: 'enable_debug_terminal'
              description: 'Show Debug tab (terminal for debugging interventions) in popup-view'
              recommended: 'all'
            }
          ]
        }
        {
          category: 'Intervention Manager Page Options'
          options: [
            {
              name: 'index_show_url_bar'
              description: 'Show URL bar on the bottom of extension pages'
              recommended: 'opera'
            }
            {
              name: 'intervention_view_show_internal_names'
              description: 'Show internal names of goals and interventions'
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
    }
  }
  option_changed: (evt) ->
    checked = evt.target.checked
    option_name = evt.target.option_name
    localstorage_setbool(option_name, checked)
  enable_recommended: ->
    is_opera = detect_if_opera()
    for {options} in this.categories_and_option_info_default
      for option in options
        if option.recommended == 'all'
          localstorage_setbool(option.name, true)
        else if is_opera and option.recommended == 'opera'
          localstorage_setbool(option.name, true)
  register_protocol_handler: ->
    navigator.registerProtocolHandler('web+habitlab', chrome.extension.getURL('/redirect.html?query=') + '%s', 'HabitLab')
  ready: ->
    if not localstorage_getbool('options_dev_already_opened')
      this.enable_recommended()
      localstorage_setbool('options_dev_already_opened', true)
    is_opera = detect_if_opera()
    categories_and_option_info = JSON.parse JSON.stringify this.categories_and_option_info_default
    for {options} in categories_and_option_info
      for option in options
        if option.recommended == 'all'
          option.description = 'Recommended: ' + option.description
        else if is_opera and option.recommended == 'opera'
          option.description = 'Recommended: ' + option.description
        option.value = localstorage_getbool(option.name)
    this.categories_and_option_info = categories_and_option_info
}
