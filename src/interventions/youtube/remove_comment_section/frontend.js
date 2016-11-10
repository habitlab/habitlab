const $ = require('jquery')

const {
  once_available
} = require('libs_frontend/common_libs')

once_available('#watch-discussion', () => {
  $('#watch-discussion').hide();
})

document.body.addEventListener('disable_intervention', (intervalID) => {
  $('#watch-discussion').show();
});

//Cheat button
const $show_comments = $('<paper-button raised style="display: block; width: 100px; margin: 10px auto 0px auto; color: #fff; background-color: red; text-align: center;">')
$show_comments.text("Show Comment Section")
$show_comments.css({'cursor': 'pointer', 'padding': '5px'});
$show_comments.click(() => {
  $('#watch-discussion').show();
})

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
