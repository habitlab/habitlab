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
  // alert("view more: " + site);
  console.log("hello from feedback-goals-list");
  const result = await remoteget_json("https://habitlab.github.io/contributed_interventions.json");
  console.log(result);
  return result;
}

function dummy_features() {
  var x = [{ name: 'Fishing', upvotes: 10, downvotes: 1 }, { name: 'Gardening', upvotes: 4, downvotes: 0 }, { name: 'Nothing', upvotes: 0, downvotes: 0 }, { name: 'Going for More Walks', upvotes: 3, downvotes: 0 }];
  return x;
}

polymer_ext({
  is: 'feedback-goals-list',
  properties: {
    custom_features: {
      type: Array,
      value: []
    },
    site: {
      type: String,
      observer: 'site_changed'
    }
  },
  site_changed: async function() {
    // this.custom_features = await view_more_interventions(this.site);
    // this.custom_features = dummy_features();
  },
  ready: async function() {
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
    this.custom_features = dummy_features();
  },
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S',
    'once_available',
    'first_elem'
  ]
})
