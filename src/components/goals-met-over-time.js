const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils');

const {
  get_num_enabled_goals,
  get_goals,
  get_enabled_goals
} = require('libs_backend/goal_utils');

const {
  get_num_goals_met_this_week,
  get_progress_on_enabled_goals_this_week
} = require('libs_backend/goal_progress');

const moment = require('moment');

polymer_ext({
  is: 'goals-met-over-time',
  properties: {
    day_num_to_success_object: {
      type: Array
    },
    day_num_to_day_name: {
      type: Object
    },
    progress_on_enabled_goals: {
      type: Object
    },
    list_of_goals: {
      type: Array
    },
    selected_day_idx: {
      type: Number,
      value: 0
    },
  },
  get_day_name: function(day_num) {
    return this.day_num_to_day_name[day_num];
  },
  get_day_in_month: function(day_num) {
    return moment().subtract(day_num, 'days').date();
  },
  is_first_day: function(day_num) {
    return day_num == 0;
  },
  get_progress_message: function(progress_on_enabled_goals, day_idx, goal_name) {
    if (!progress_on_enabled_goals) {
      return ''
    }
    if (!progress_on_enabled_goals[goal_name]) {
      return ''
    }
    if (!progress_on_enabled_goals[goal_name][day_idx]) {
      return ''
    }
    return progress_on_enabled_goals[goal_name][day_idx].message
  },
  day_clicked: function(evt) {
    console.log('day_clicked called');
    console.log(evt);
    console.log(evt.target);
    console.log(evt.target.day_idx);
    console.log(evt.target.getAttribute('day_idx'));
    var day_idx = evt.target.day_idx;
    this.selected_day_idx = day_idx;
  },
  ready: async function() {
    let self = this
    let day = moment().startOf('date')
    let day_num_to_day_name = {}
    let day_num_to_num_goals_met = await get_num_goals_met_this_week()
    let num_enabled_goals = await get_num_enabled_goals()
    let enabled_goals = await get_enabled_goals()

    for (let day_num = 0; day_num <= 6; ++day_num) {
      day_num_to_day_name[day_num] = day.format("dddd");
      day.subtract(1, 'days');
    }

    //var today = day_num_to_day_name[0];
    //today.get_day_name();

    this.day_num_to_success_object = day_num_to_num_goals_met.map(function(x) { return {num_met: x, num_goals: num_enabled_goals} });
    this.day_num_to_day_name = day_num_to_day_name
    let goal_name_to_goal_info = await get_goals();
    let list_of_goals = []
    for (let goal_name of Object.keys(goal_name_to_goal_info)) {
      if (!enabled_goals[goal_name]) {
        continue
      }
      let goal_info = goal_name_to_goal_info[goal_name]
      list_of_goals.push(goal_info)
    }
    this.list_of_goals = list_of_goals

    this.progress_on_enabled_goals = await get_progress_on_enabled_goals_this_week()


  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'text_if_equal'
  ]
});
