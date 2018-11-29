/*
const $ = require('jquery')

const {
  close_selected_tab
} = require('libs_common/tab_utils')

const {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

require_component('habitlab-logo-v2')
require_component('time-until-tab-autoclose-view')

//Polymer button
require_component('paper-button')

var display_timespent_div = $('<time-until-tab-autoclose-view>');
var shadow_div;
once_body_available().then(function() {
  shadow_div = append_to_body_shadow(display_timespent_div);
})

window.on_intervention_disabled = () => {
  $(shadow_div).remove()
}
*/


const $ = require('jquery')

const {
  load_intervention_by_name,
  load_intervention_by_difficulty_for_goal,
} = require('libs_frontend/intervention_loader')

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
  chose_intervention_for_each_difficulty_level
} = require('libs_frontend/intervention_utils')

console.log('choose difficulty intervention running 2')

require_component('interstitial-screen-choose-difficulty')

var interst_screen = $('<interstitial-screen-choose-difficulty>')

var shadow_div = null

var difficulty_to_chosen_intervention = null

once_body_available().then(function() {
  shadow_div = append_to_body_shadow(interst_screen);
  chose_intervention_for_each_difficulty_level().then(function(result) {
    difficulty_to_chosen_intervention = result
  })
  interst_screen[0].addEventListener('difficulty_chosen', function(evt) {
    console.log('difficulty chosen')
    console.log(evt)
    let difficulty = evt.detail.difficulty
    $(shadow_div).remove()
    //load_intervention_by_name('generic/close_tab_timer')
    let goal_name = get_goal_name()
    console.log('goal_name is')
    console.log(goal_name)
    console.log('difficulty is')
    console.log(difficulty)
    const is_new_session = get_is_new_session();
    if (is_new_session) {
      load_intervention_by_difficulty_for_goal(difficulty, goal_name)
      set_intervention_session_var('chosen_intervention', )
    } else {

      load_intervention_by_name(intervention_name)
    }
  })
})

// setTimeout(function() {
//   load_intervention_by_name('generic/close_tab_timer')
// }, 5000)

console.log('choose difficulty intervention done')

window.on_intervention_disabled = () => {
  $(shadow_div).remove()
}

//alert('choose difficulty intervention running 2');


