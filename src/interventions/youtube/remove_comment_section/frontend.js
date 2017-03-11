window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

const $ = require('jquery')

const {
  once_available,
  on_url_change,
  wrap_in_shadow,
  run_only_one_at_a_time,
} = require('libs_frontend/common_libs')

require('enable-webcomponents-in-content-scripts')
require('bower_components/paper-button/paper-button.deps')
require('components/habitlab-logo.deps')

var intervention_disabled = false;

function show_comments() {
  $('#habitlab_show_comments').remove();
  $('#watch-discussion').show();
}

function hide_comments() {
  if (intervention_disabled) {
    return
  }
  if ($('#habitlab_show_comments').length > 0) {
    return
  }
  $('#watch-discussion').hide();
  //Cheat button
  const $show_comments = $('<paper-button raised id="show_comment_btn" style="display: block; width: 110px; margin: 10px auto 0px auto; color: #fff; background-color: #415D67; text-align: center; -webkit-font-smoothing: antialiased; font-size: 14px; box-shadow: 2px 2px 2px #888888">')
  $show_comments.text("Show Comments")
  $show_comments.css({'cursor': 'pointer', 'padding': '5px'});
  $show_comments.click(() => {
    show_comments();
  })

  var show_comments_div = $('<div>');
  show_comments_div.append([
    $('<habitlab-logo id="hb_logo" style="display: block; width: 110px; margin: 10px auto 0px auto;">'),
    $show_comments,
  ])
  var show_comments_wrapper = $(wrap_in_shadow(show_comments_div)).attr('id', 'habitlab_show_comments')
  $('#action-panel-details').append(show_comments_wrapper)
}

var hide_comments_once_available = run_only_one_at_a_time((callback) => {
  if (intervention_disabled) {
    return
  }
  once_available('#watch-discussion', () => {
    hide_comments()
    callback()
  })
})

hide_comments_once_available()
on_url_change(() => {
  hide_comments_once_available()
})

document.body.addEventListener('disable_intervention', () => {
  intervention_disabled = true;
  show_comments();
});

/*
//event listener in the , undo the intervention (copy code from facebook intervention)
//ie. in frontend.js something like this:
//document.body.addEventListener('disable_intervention', (intervalID) => {
showFeed(window.intervalID);
});
//switch behavior to outright, so swith
//otherwise keep going on with github issues
*/

/*
    Issue 104
    -----
    - need to hook up the intervention effectivesness
    - check the comments for the correct code
    - keep going on front end stuff for youtube comment Section
    - edit the polymer component (intervention effectivesness graph), do it all in livescript
    - remember, that polymer component is then required into the dashboard
    - visual studio code
*/

window.debugeval = x => eval(x);