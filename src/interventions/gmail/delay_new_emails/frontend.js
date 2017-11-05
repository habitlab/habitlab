require_component('paper-card')
var $ = require('jquery')
require_component('habitlab-logo-v2')
require_component('time-until-tab-autoclose-view')
require_component('paper-button')

const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils')

const {
  close_selected_tab
} = require('libs_common/tab_utils')

/*
const LOAD_WAIT_INTERVAL = 100;
var waitForLoad = setInterval(() => {
  var mailfeed = $('#\\:4');
  if (mailfeed == null) return;
  stopWaitForLoad();
}, LOAD_WAIT_INTERVAL);
/*
function stopWaitForLoad() {
  clearInterval(waitForLoad);
  console.log("Loaded now.");
};*/

window.onload = function () {
  console.log("loaded");
  executeIntervention();
};


function executeIntervention() {
  //in seconds
  //Time between cycles. 5 minutes
  const PERIOD = 20;
  //Time (within period) after which emails are revealed. Hidden again at start of period
  const REVEAL_TIME = 15;
  // interval length of check to remove. in millisec
  const CHECK_TIME = 1000;

  var timeCounter = 0;
  var removed = null;
  var showAndHide = setInterval(() => {
    showAndHideForever();
  }, CHECK_TIME);

  var increaseTime = setInterval(() => {
    timeCounter += 1;
  }, 1000);

  function showAndHideForever() {
    console.log(Math.round(timeCounter) % PERIOD);
    if (Math.round(timeCounter) % PERIOD >= REVEAL_TIME) {
      console.log("could restore");
      removed = restoreFeed(removed);
    } else {
      console.log("could remove");
      removed = removeFeed();
    }
  }

  function restoreFeed(removed) {
    //quit if we are in a state where the feed is already visible
    if (removed == null) return null;
    console.log("restoring");
    $(removed.mailfeedParent).append(removed.mailfeed);
    $(revealButton).addClass('disabled');
    if (hasUnreadMail()) {
      var inbox = $('a.J-Ke.n0');
      $('div.aim.ain').css({ 'border-left': '4px solid #dd4b39' })
      $(inbox[0]).text(inbox[0].title).css({ 'color': '#dd4b39', 'font-weight': 'bold' });
    }
    return null;
  }

  function removeFeed() {
    //quit if the feed is already hidden
    if (removed != null) return removed;
    console.log("removing");
    var mailfeed = $('#\\:4');
    var mailfeedParent = $(mailfeed).parent();
    $(mailfeed).remove();
    $(revealButton).removeClass('disabled');
    if (hasUnreadMail()) {
      var inbox = $('a.J-Ke.n0');
      $(inbox[0]).text('Inbox').css({ 'color': 'black', 'font-weight': 'normal' });
    }
    return {
      mailfeed: mailfeed,
      mailfeedParent: mailfeedParent
    };
  }

  var revealButton = $('<paper-button raised/>', {
  }).addClass('indigo').text('Reveal Emails').on('click', function () {
    removed = restoreFeed(removed);
    timeCounter = REVEAL_TIME;
  }).prependTo('body');

  var disabled = false;
  var disableButton = $('<paper-button raised/>', {
  }).text('Disable Intervention').on('click', function () {
    if (!disabled) {
      console.log("intervention disabled");
      removed = restoreFeed(removed);
      clearInterval(showAndHide);
      disableButton.text('Enable Intervention');
      disabled = true;
    } else {
      console.log('enabling intervention');
      timeCounter = 0;
      showAndHide = setInterval(() => {
        showAndHideForever();
      }, CHECK_TIME);
      disableButton.text('Disable Intervention');
      disabled = false;
    }
  }).prependTo('body');

  function hasUnreadMail() {
    var inbox = $('a.J-Ke.n0');
    return inbox[0].title != 'Inbox'
  }

}





