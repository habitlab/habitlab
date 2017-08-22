const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils');

const {cfy} = require('cfy');

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

async function view_more_interventions(site) {
  alert("view more: " + site);
  const result = await remoteget_json("https://habitlab.github.io/contributed_interventions.json");
  console.log(result);
}

function test() {
    console.log("hello 2");
}

// document.getElementById("view_more_button").addEventListener("click", test);

function make_intervention_table(interventions) {
  var rows = Object.keys(interventions).length;
  var cols = 2;
  var i=0;
  var grid = document.createElement('table');
  grid.className = 'grid';
  for (var r = 1 ; r < rows; ++r){
    var tr = grid.appendChild(document.createElement('tr'));
    for (var c = 0; c < cols; ++c){
      var cell = tr.appendChild(document.createElement('td'));
      cell.innerHTML = "here be the intervention";
      cell.setAttribute( 'class', 'custom_intervention' );
    }
  }
  return grid;
}

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
    }
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
      Each visit, HabitLab will test a new intervention and measure how much time you spend on the site. Then it determines the efficacy of each intervention by comparing the time spent per visit when that intervention was deployed, compared to when other interventions are deployed. HabitLab uses an algorithmic technique called <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">multi-armed-bandit</a> to learn which interventions work best and choose which interventions to deploy, to minimize your time wasted online.
      `,
      allowOutsideClick: true,
      allowEscapeKey: true,
      //showCancelButton: true,
      //confirmButtonText: 'Visit Facebook to see an intervention in action',
      //cancelButtonText: 'Close'
    })
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
    //if (this.site != site) {
    //  return;
    //}
    this.intervention_name_to_info_map = intervention_name_to_info_map;
    this.goal_info = goal_info_list[0];
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
  code_custom_nudge_clicked: async function(){
    let create_intervention_dialog = document.createElement('create-intervention-dialog')
    document.body.appendChild(create_intervention_dialog)
    let all_goals=await get_goals()
    let goals_list= await list_all_goals()
    create_intervention_dialog.goal_info_list = goals_list.map(x => all_goals[x])
    create_intervention_dialog.current_goal = this.goal_info.name
    create_intervention_dialog.open_create_new_intervention_dialog();
    create_intervention_dialog.addEventListener('display_new_intervention', function(evt) {
      localStorage.setItem('intervention_editor_new_intervention_info', JSON.stringify(evt.detail));
    });
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S',
    'once_available',
    'first_elem'
  ]
})
