const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils');

const swal = require('sweetalert2');

const {load_css_file} = require('libs_common/content_script_utils');

const {
  list_site_info_for_sites_for_which_goals_are_enabled,
  list_goals_for_site
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
  return result;
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
  is: 'custom-interventions-list',
  properties: {
    custom_interventions: {
      type: Array,
      value: []
    },
    site: {
      type: String,
      observer: 'site_changed'
    }
  },
  site_changed: async function() {
    this.custom_interventions = await view_more_interventions(this.site);
  },
  ready: async function() {
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
  },
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S',
    'once_available',
    'first_elem'
  ]
})
