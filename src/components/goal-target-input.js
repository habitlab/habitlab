const {
  set_goal_target,
  get_goal_target
} = require('libs_backend/goal_utils')

Polymer({
  is: 'goal-target-input',
  properties: {
    goal: {
      type: Object,
      observer: 'goal_set'
    },
    prefix: {
      type: String,
      value: ""
    },
    suffix: {
      type: String,
      value: ""
    },
    daily_goal_values: {
      type: Array,
      value: [5, 10, 15, 20, 25, 30, 45, 60]
    },
    goal_target: {
      type: Number,
      value: 5
    }
  },
  target_updated: async function(evt, obj) {
    if (this.goal != null) {
      let target = Number(obj.item.value)
      console.log('Target set to ' + target)
      set_goal_target(this.goal.name, target)
    }
  },
  goal_set: async function(goal_info) {
    let statement = goal_info.goal_statement_to_fill_in
    if (!goal_info.goal_statement_units) {
      if (this.goal.is_positive) {
        this.prefix = "Spend at least "
      } else {
        this.prefix = "Spend no more than "
      }
      this.suffix = "on " + this.goal.sitename_printable + " each day"
    } else {
      let idx = statement.indexOf("TARGET UNITS")
      this.prefix = statement.substring(0, idx) 
      statement = statement.replace("TARGET UNITS", "")
      this.suffix = statement.substring(idx)
    }
    if (!goal_info.is_positive) {
      this.daily_goal_values = [5, 10, 15, 20, 25, 30, 45, 60]
    } else if (goal_info.target.units == "minutes") {
      this.daily_goal_values = [1, 2, 5, 10, 15, 20, 30, 45, 60]      
    } else {
      this.daily_goal_values = [1, 2, 3]
    }
    this.goal_target = await get_goal_target(this.goal.name)
  },
  compute_unit_for: function(value) {  
    if (this.goal == null) {
      return "minutes"
    }
    console.log(this.goal)
    let unit = this.goal.target.units
    if ('goal_statement_units' in this.goal) {
      unit = this.goal.goal_statement_units
    }
    if (value == 1) {
      // TODO: handle words that have es added, like "potatoes"
      unit = unit.substring(0, unit.length-1)
    }
    console.log("result:" + unit)
    return unit
  }
})