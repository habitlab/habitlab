const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils')

const {
  get_interventions,
  get_enabled_interventions,
  set_intervention_enabled,
  set_intervention_disabled,
} = require('libs_backend/intervention_utils')

const {
  add_log_interventions,
} = require('libs_backend/log_utils')

const {
  send_feature_option,
} = require('libs_backend/logging_enabled_utils')

const {
  chrome_get_token,
  get_user_id
} = require('libs_backend/background_common')

const $ = require('jquery')

const{
  get_log_names,
  getInterventionLogCollection
} = require('libs_backend/log_utils')

polymer_ext({
  is: 'sync-view',
  properties: {
    should_sync: {
      type: Boolean
    }
  },
  ask_permission: async function(evt) {
    let self = this
    let id_token = await chrome_get_token();
    let user_id = await get_user_id();
    let mobile_server = 'https://habitlab-mobile-website.herokuapp.com'
    if (localStorage.local_logging_server == 'true') {
      mobile_server = 'http://localhost:5000'
    }
    let result = new Promise( function(resolve, reject) {
      $.ajax({
        type: 'POST',
        url: mobile_server + '/register_user_with_email',
        data: {
          from: "browser",
          token: id_token,
          userid: user_id
        },
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
          localStorage.sync_with_mobile = 'true'
          localStorage.id_secret = data.secret
          self.should_sync = localStorage.sync_with_mobile == 'true'
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('error')
          console.log(jqXHR)
          reject(errorThrown) }
      });
    });

    result.then(function(msg) {
    }).catch(function(error) {
      throw(error);
    });
  },
  deny_permission: function(evt) {
    localStorage.sync_with_mobile = 'false'
    this.should_sync = localStorage.sync_with_mobile == 'true'
  },
  go_to_store: function(evt) {
    chrome.tabs.create({url: 'https://play.google.com/store/apps/details?id=com.stanfordhci.habitlab'});
  },
  ready: async function(evt) {

  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'json_stringify',
    'once_available'
  ]
})
