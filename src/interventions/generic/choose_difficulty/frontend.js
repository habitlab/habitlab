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
  load_intervention_by_difficulty
} = require('libs_frontend/intervention_loader')

const {
  append_to_body_shadow,
  once_body_available  
} = require('libs_frontend/frontend_libs')

console.log('choose difficulty intervention running 2')

require_component('interstitial-screen-choose-difficulty')

var interst_screen = $('<interstitial-screen-choose-difficulty>')

var shadow_div = null

once_body_available().then(function() {
  shadow_div = append_to_body_shadow(interst_screen);
  interst_screen[0].addEventListener('difficulty_chosen', function(evt) {
    console.log('difficulty chosen')
    console.log(evt)
    let difficulty = evt.detail.difficulty
    $(shadow_div).remove()
    load_intervention_by_name('generic/close_tab_timer')
    //load_intervention_by_difficulty(difficulty)
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


