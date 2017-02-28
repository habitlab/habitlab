window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

const $ = require('jquery')

require('enable-webcomponents-in-content-scripts')
require('bower_components/paper-button/paper-button.deps')
require('components/habitlab-logo.deps')

console.log("comments being removed!");

const {
  once_available
} = require('libs_frontend/common_libs')

once_available('#watch-discussion', () => {
  $('#watch-discussion').hide();
})

document.body.addEventListener('disable_intervention', (intervalID) => {
    $('#watch-discussion').show();
  $('#watch-discussion').show();
  $('#show_comment_btn').hide();
  $('#hb_logo').hide();
});

//Cheat button
const $show_comments = $('<paper-button raised id="show_comment_btn" style="display: block; width: 107px; margin: 10px auto 0px auto; color: #fff; background-color: #415D67; text-align: center; -webkit-font-smoothing: antialiased; font-size: 14px; box-shadow: 2px 2px 2px #888888">')
$show_comments.text("Show Comments")
$show_comments.css({'cursor': 'pointer', 'padding': '5px'});
$show_comments.click(() => {
  console.log("hiding buttons");
  $('#watch-discussion').show();
  $('#show_comment_btn').hide();
  $('#hb_logo').hide();
})


$('#action-panel-details').append($('<habitlab-logo id="hb_logo" style="display: block; width: 100px; margin: 10px auto 0px auto; padding-right: 10px">'))
$('#action-panel-details').append($show_comments)

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