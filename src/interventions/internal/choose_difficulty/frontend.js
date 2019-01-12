const $ = require('jquery')

const {
  load_intervention_by_name
} = require('libs_frontend/intervention_loader')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  append_to_body_shadow,
  once_body_available  
} = require('libs_frontend/frontend_libs')

const {
  get_goal_name,
  get_is_new_session
} = require('libs_common/intervention_info')

const {
  get_intervention_session_var,
  set_intervention_session_var,
} = require('libs_frontend/intervention_session_vars')

const {
  choose_intervention_for_each_difficulty_level_and_goal,
  set_temporary_difficulty,
} = require('libs_frontend/intervention_utils')

var interst_screen = null

var choose_difficulty_interface = parameters.choose_difficulty_interface
if (choose_difficulty_interface == 'time_afford') {
  require_component('interstitial-screen-choose-difficulty-v2')
  interst_screen = $('<interstitial-screen-choose-difficulty-v2>')
} else if (choose_difficulty_interface == 'settings_update') {
  require_component('interstitial-screen-choose-difficulty-v3')
  interst_screen = $('<interstitial-screen-choose-difficulty-v3>')
} else {
  require_component('interstitial-screen-choose-difficulty')
  interst_screen = $('<interstitial-screen-choose-difficulty>')
}

/*
if () {
} else 
*/

var shadow_div = null

var difficulty_to_chosen_intervention = null

const is_new_session = get_is_new_session();
if (is_new_session) {
  once_body_available().then(function() {
    shadow_div = append_to_body_shadow(interst_screen);
    let goal_name = get_goal_name()
    choose_intervention_for_each_difficulty_level_and_goal(goal_name).then(function(result) {
      difficulty_to_chosen_intervention = result
    })
    interst_screen[0].addEventListener('difficulty_chosen', async function(evt) {
      let difficulty = evt.detail.difficulty
      $(shadow_div).remove()

      set_temporary_difficulty(difficulty)
      if (difficulty == 'nothing') {
        log_action({'difficulty': difficulty, 'new_session': true, 'choose_difficulty_interface': choose_difficulty_interface})
        set_intervention_session_var('chosen_intervention_info', JSON.stringify({difficulty: 'nothing'}))
        return
      }
      let intervention_name = difficulty_to_chosen_intervention[difficulty]
      log_action({'difficulty': difficulty, 'intervention_name': intervention_name, 'new_session': true, 'choose_difficulty_interface': choose_difficulty_interface})
      set_intervention_session_var('chosen_intervention_info', JSON.stringify({name: intervention_name, difficulty: difficulty}))
      load_intervention_by_name(intervention_name)
    })
  })
} else {
  get_intervention_session_var('chosen_intervention_info').then(function(chosen_intervention_info) {
    if (chosen_intervention_info == null) {
      return
    }
    chosen_intervention_info = JSON.parse(chosen_intervention_info)
    if (chosen_intervention_info.name == null) {
      log_action({'difficulty': chosen_intervention_info.difficulty, 'new_session': false, 'choose_difficulty_interface': choose_difficulty_interface})
      return
    }
    log_action({'difficulty': chosen_intervention_info.difficulty, 'intervention_name': chosen_intervention_info.name, 'new_session': false, 'choose_difficulty_interface': choose_difficulty_interface})
    load_intervention_by_name(chosen_intervention_info.name)
  })
}

window.on_intervention_disabled = () => {
  $(shadow_div).remove()
}
