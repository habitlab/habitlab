const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils');

const swal = require('sweetalert2');

const $ = require('jquery');

const {load_css_file} = require('libs_common/content_script_utils');

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

const {
  as_array
} = require('libs_common/collection_utils');

const {remoteget_json} = require('libs_common/cacheget_utils');

const {
  log_pageclick
} = require('libs_backend/log_utils');

polymer_ext({
  is: 'site-view',
  properties: {
    //site_info_list: {
    //  type: Array
    //},
    site: {
      type: String,
      observer: 'site_changed'
    },
    goal_info: {
      type: Object
    },
    intervention_name_to_info_map: {
      type: Object
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },
    interrupt_0: {
      type: Number,
      value: 0
    },
    show_market: {
      type: Boolean,
      value: localStorage.show_market == 'true'
    },
  },
  /*
  buttonAction1: ->
    this.linedata.datasets[0].label = 'a new label'
    this.$$('#linechart').chart.update()
  */
  isdemo_changed: function(isdemo) {
    if (isdemo) {
      this.site = 'facebook'
      this.rerender()
    }
  },
  intervention_name_to_info: function(intervention_name, intervention_name_to_info_map) {
    return intervention_name_to_info_map[intervention_name];
  },
  ready: function() {
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
  },
  help_icon_clicked: function() {
    swal({
      title: 'How HabitLab Works',
      html: `
      HabitLab will help you achieve your goal by showing you a different <i>nudge</i>, like a news feed blocker or a delayed page loader, each time you visit your goal site.
      <br><br>
      At first, HabitLab will show you a random nudge each visit, and over time it will learn what works most effectively for you.
      <br><br>
      Each visit, HabitLab will test a new nudge and measure how much time you spend on the site. Then it determines the efficacy of each nudge by comparing the time spent per visit when that nudge was deployed, compared to when other nudges are deployed. HabitLab uses an algorithmic technique called <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">multi-armed-bandit</a> to learn which nudges work best and choose which nudges to deploy, to minimize your time wasted online.
      `,
      allowOutsideClick: true,
      allowEscapeKey: true,
      //showCancelButton: true,
      //confirmButtonText: 'Visit Facebook to see an intervention in action',
      //cancelButtonText: 'Close'
    })
  },
  somemethod: function() {
    this.rerender()
  },
  rerender1: async function() {
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
  rerender: async function() {
    let [intervention_name_to_info_map, goal_info_list] = await this.rerender1()
    // console.log(intervention_name_to_info_map)
    //console.log("1.2222")
    this.goal_info = goal_info_list[0];
    this.intervention_name_to_info_map = intervention_name_to_info_map;
    this.interrupt_0 += 1
    if (this.interrupt_0 == 100) {
      this.interrupt_0 = 0;
    }
    //console.log("1.2222222")
    //console.log("Number: " + this.interrupt_0)
  },
  site_changed: async function(site) {
    /*
    let [intervention_name_to_info_map, goal_info_list] = await this.rerender1()
    if (this.site != site) {
      return;
    }
    this.intervention_name_to_info_map = intervention_name_to_info_map;
    this.goal_info = goal_info_list[0];
    */
  },
  // code_custom_nudge_clicked: async function(){
  //   let create_intervention_dialog = document.createElement('create-intervention-dialog')
  //   document.body.appendChild(create_intervention_dialog)
  //   let all_goals=await get_goals()
  //   let goals_list= await list_all_goals()
  //   create_intervention_dialog.goal_info_list = goals_list.map(x => all_goals[x])
  //   create_intervention_dialog.current_goal = this.goal_info.name
  //   create_intervention_dialog.open_create_new_intervention_dialog();
  //   create_intervention_dialog.addEventListener('display_new_intervention', function(evt) {
  //     localStorage.setItem('intervention_editor_new_intervention_info', JSON.stringify(evt.detail));
  //   });
  // }
  vote_for_nudge_clicked: function() {
    //chrome.tabs.create({url: 'https://www.reddit.com/r/habitlab/'});
    //log_pageclick({from: 'site-view', tab: this.site, to: 'https://www.reddit.com/r/habitlab/'});    
    console.log('nudge vote clicked')
    this.fire('go_to_voting', {})
  },
  code_custom_nudge_clicked: function() {
    chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor')});
    log_pageclick({from: 'site-view', tab: this.site, to: 'intervention-editor'});    
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'first_elem'
  ]
})
