const {
  localstorage_getbool,
  localstorage_setbool
} = require('libs_common/localstorage_utils');

const {
  log_pageclick
} = require('libs_backend/log_utils');

Polymer({
  is: 'advanced-features',
  properties: {
    show_beta_goals_and_interventions: {
      type: Boolean,
      value: localstorage_getbool('show_beta_goals_and_interventions'),
      observer: 'show_beta_goals_and_interventions_changed'
    }
  },
  show_beta_goals_and_interventions_changed: function(show_beta_goals_and_interventions, prev_show_beta_goals_and_interventions) {
    if (prev_show_beta_goals_and_interventions == null) {
      return; // was initializing
    }
    if (show_beta_goals_and_interventions == null) {
      return; // was initializing
    }
    localstorage_setbool('show_beta_goals_and_interventions', show_beta_goals_and_interventions);
    window.location.reload();
  },
  open_intervention_editor: function() {
    chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor')});
    log_pageclick({from: 'settings-advanced-features', to: 'intervention-editor'})
    // chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor-onboard')});
  }
})
