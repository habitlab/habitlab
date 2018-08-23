const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

const {
  list_site_info_for_sites_for_which_goals_are_enabled,
  list_goals_for_site,
  get_goals,
  list_all_goals,
} = require('libs_backend/goal_utils');

const {
  get_interventions,
  get_enabled_interventions
} = require('libs_backend/intervention_utils');

polymer_ext({
  is: 'market-upload',
  properties: {
    site: {
      type: String,
      observer: 'site_changed'
    },
    button_disable: {
      type: Boolean
    }
  },
  get_custom_intervention_icon_url: function() {
    //return chrome.extension.getURL('icons/habitlab_gear_with_text.svg');
    return chrome.extension.getURL('icons/custom_intervention_icon.svg');
  },
  get_list_of_uploadable: async function() {
    const [goal_info_list, intervention_name_to_info_map, enabled_interventions] = await Promise.all([
      list_goals_for_site(this.site),
      get_interventions(),
      get_enabled_interventions()
    ])
    for (let intervention_name of Object.keys(intervention_name_to_info_map)) {
      const intervention_info = intervention_name_to_info_map[intervention_name];
      intervention_info.enabled = (enabled_interventions[intervention_name] == true);
    }
    return [intervention_name_to_info_map, goal_info_list]
  },
  site_changed: async function() {
    this.button_disable = false
    // console.log('site is:')
    // console.log(this.site)
    let [intervention_name_to_info_map, goal_info_list] = await this.get_list_of_uploadable()
    // console.log(intervention_name_to_info_map)
    var li = []
    for (let intervention_name of Object.keys(intervention_name_to_info_map)) {
      if(intervention_name_to_info_map[intervention_name].sitename == this.site && !intervention_name_to_info_map[intervention_name].downloaded && intervention_name_to_info_map[intervention_name].custom) {
        // console.log(intervention_name_to_info_map[intervention_name])
        li.push(intervention_name_to_info_map[intervention_name])
      }
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  },
  handleTap: function() {
    document.getElementById("myDropdown").classList.toggle("show");
  },
  handle_submit: function() {
    this.fire('modal_close', {})
    location.reload();
    this.button_disable = true
  },
})
