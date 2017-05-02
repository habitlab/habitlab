const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils');

const {
  get_num_enabled_goals
} = require('libs_backend/goal_utils');

const {
  get_num_goals_met_this_week
} = require('libs_backend/goal_progress');

const {cfy} = require('cfy');

const moment = require('moment');

const $ = require('jquery');

polymer_ext({
  is: 'goals-met-over-time',
  properties: {
    day_num_to_success_object: {
      type: Array
    },
    day_num_to_day_name: {
      type: Object
    }
  },
  get_day_name: function(day_num) {
    return this.day_num_to_day_name[day_num];
  },
  is_first_day: function(day_num) {
    return day_num == 0;
  },
  ready: async function() {
    let self = this
    let day = moment().startOf('date')
    let day_num_to_day_name = {}
    let day_num_to_num_goals_met = await get_num_goals_met_this_week()
    let num_enabled_goals = await get_num_enabled_goals()

    for (let day_num = 0; day_num <= 6; ++day_num) {
      day_num_to_day_name[day_num] = day.format("dddd");
      day.subtract(1, 'days');
    }

    this.day_num_to_success_object = day_num_to_num_goals_met.map(function(x) { return {num_met: x, num_goals: num_enabled_goals} });
    this.day_num_to_day_name = day_num_to_day_name
  }
})
