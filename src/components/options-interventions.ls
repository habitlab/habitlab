require! {
  prelude
}

{
  get_interventions
  get_enabled_interventions
  get_manually_managed_interventions
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
} = require 'libs_backend/intervention_utils'

{
  get_and_set_new_enabled_interventions_for_today
  enable_interventions_because_goal_was_enabled
} = require 'libs_backend/intervention_manager'

{
  get_enabled_goals
  get_goals
  set_goal_enabled_manual
  set_goal_disabled_manual
} = require 'libs_backend/goal_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'


{cfy} = require 'cfy'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'options-interventions'
  properties: {
    goals_and_interventions: {
      type: Array
      value: []
    }
    sites_and_goals: {
      type: Array
      value: []
    }, 
    start_time_string: {
      type: String
      value: if localStorage.start_as_string then localStorage.start_as_string else '9:00 AM'
    },
    end_time_string: {
      type: String
      value: if localStorage.end_as_string then localStorage.end_as_string else '5:00 PM'
    },
    start_time_mins: {
      type: Number,
      value: if localStorage.start_mins_since_midnight then parseInt(localStorage.start_mins_since_midnight) else 540
    },
    end_time_mins: {
      type: Number,
      value: if localStorage.end_mins_since_midnight then parseInt(localStorage.end_mins_since_midnight) else 1020
    }
    always_active: {
      type: Boolean
      value: localStorage.work_hours_only != "true"
    }
  }
  disable_interventions_which_do_not_satisfy_any_goals: cfy (goal_name) ->*
    enabled_goals = yield get_enabled_goals()
    enabled_interventions = yield get_enabled_interventions()
    all_interventions = yield get_interventions()
    interventions_to_disable = []
    for intervention_name,intervention_enabled of enabled_interventions
      if not intervention_enabled
        continue
      intervention_info = all_interventions[intervention_name]
      intervention_satisfies_an_enabled_goal = false
      for goal_info in intervention_info.goals
        if enabled_goals[goal_info.name]
          intervention_satisfies_an_enabled_goal = true
      if not intervention_satisfies_an_enabled_goal
        interventions_to_disable.push intervention_name
    prev_enabled_interventions = {} <<< enabled_interventions
    for intervention_name in interventions_to_disable
      yield set_intervention_disabled intervention_name
    if interventions_to_disable.length > 0
      add_log_interventions {
        type: 'interventions_disabled_due_to_user_disabling_goal'
        manual: false
        goal_name: goal_name
        interventions_list: interventions_to_disable
        prev_enabled_interventions: prev_enabled_interventions
      }
  goal_changed: cfy (evt) ->*
    checked = evt.target.checked
    
    goal_name = evt.target.goal.name
    self = this
    if checked
      yield set_goal_enabled_manual goal_name
    else
      yield set_goal_disabled_manual goal_name
    yield this.disable_interventions_which_do_not_satisfy_any_goals(goal_name)
    if checked
      yield enable_interventions_because_goal_was_enabled(goal_name)
    console.log 'goal changed'
    self.fire 'goal_changed', {goal_name: goal_name}
  select_new_interventions: (evt) ->
    self = this
    self.goals_and_interventions = []
    <- get_and_set_new_enabled_interventions_for_today()
    self.rerender()
  on_goal_changed: (evt) ->
    this.rerender()
  ready: ->
    
    this.rerender()
  set_sites_and_goals: cfy ->*
    self = this
    goal_name_to_info = yield get_goals()
    sitename_to_goals = {}
    for goal_name,goal_info of goal_name_to_info
      if goal_name == 'debug/all_interventions' and localStorage.getItem('intervention_view_show_debug_all_interventions_goal') != 'true'
        continue
      sitename = goal_info.sitename
      if not sitename_to_goals[sitename]?
        sitename_to_goals[sitename] = []
      sitename_to_goals[sitename].push goal_info
    list_of_sites_and_goals = []
    list_of_sites = prelude.sort Object.keys(sitename_to_goals)
    enabled_goals = yield get_enabled_goals()
    for sitename in list_of_sites
      current_item = {sitename: sitename}
      current_item.goals = prelude.sort-by (.name), sitename_to_goals[sitename]
      for goal in current_item.goals
        goal.enabled = (enabled_goals[goal.name] == true)
      list_of_sites_and_goals.push current_item
    self.sites_and_goals = list_of_sites_and_goals
  show_internal_names_of_goals: ->
    return localStorage.getItem('intervention_view_show_internal_names') == 'true'
  show_randomize_button: ->
    return localStorage.getItem('intervention_view_show_randomize_button') == 'true'
  have_interventions_available: (goals_and_interventions) ->
    console.log \check_have_int
    return goals_and_interventions and goals_and_interventions.length > 0
  show_dialog: (evt) ->
    if evt.target.id == 'start-time'
      this.$$('#start-dialog').toggle!
    else
      this.$$('#end-dialog').toggle!
  toggle_timepicker: (evt) ->
    if evt.target.checked # if evt.target.checked is true, elem was just changed
      if this.$$('paper-radio-group').selected == 'always' #bizarre error, means currently selected is work_hours
        console.log ' just switched to Work Hours'
        
        localStorage.work_hours_only = true;
        @always_active = false
        localStorage.start_mins_since_midnight = @start_time_mins#this.$$('#start-picker').rawValue
        
        localStorage.end_mins_since_midnight = @end_time_mins#this.$$('#end-picker').rawValue
        localStorage.start_as_string = @start_time_string#this.$$('#start-picker').time
        localStorage.end_as_string = @end_time_string#this.$$('#end-picker').time
      else
        console.log ' just switched to Always On'
        
        localStorage.work_hours_only = false;
        @always_active = true

    # if not, it's a double click so you shouldn't do anything

    
  dismiss_dialog: (evt) ->
    console.log evt
    if evt.detail.confirmed and (this.$$('#end-picker').rawValue - this.$$('#start-picker').rawValue > 0)
      if evt.target.id == 'start-dialog'
        @start_time_string = this.$$('#start-picker').time
        @start_time_mins = this.$$('#start-picker').rawValue
        localStorage.start_mins_since_midnight = @start_time_mins
        localStorage.start_as_string = @start_time_string
      else
        @end_time_string = this.$$('#end-picker').time
        @end_time_mins = this.$$('#end-picker').rawValue
        localStorage.end_mins_since_midnight = @end_time_mins
        localStorage.end_as_string = @end_time_string
    else #reset the time picker time to saved time
      this.$$('#start-picker').time = @start_time_string
      this.$$('#end-picker').time = @end_time_string

  determine_selected: (always_active) ->
    if always_active
      return 'always'
    else 
      return 'workday'
  rerender: cfy ->*
    yield this.set_sites_and_goals()
    self = this
    intervention_name_to_info = yield get_interventions()
    enabled_interventions = yield get_enabled_interventions()
    enabled_goals = yield get_enabled_goals()
    all_goals = yield get_goals()
    manually_managed_interventions = yield get_manually_managed_interventions()
    goal_to_interventions = {}
    for intervention_name,intervention_info of intervention_name_to_info
      for goal in intervention_info.goals
        goalname = goal.name
        if not goal_to_interventions[goalname]?
          goal_to_interventions[goalname] = []
        goal_to_interventions[goalname].push intervention_info
    list_of_goals_and_interventions = []
    list_of_goals = prelude.sort as_array(enabled_goals)
    for goalname in list_of_goals
      current_item = {goal: all_goals[goalname]}
      current_item.interventions = prelude.sort-by (.name), goal_to_interventions[goalname]
      for intervention in current_item.interventions
        intervention.enabled_goals = []
        #if intervention.goals?
        #  intervention.enabled_goals = [goal for goal in intervention.goals when enabled_goals[goal.name]]
        intervention.enabled = (enabled_interventions[intervention.name] == true)
        intervention.automatic = (manually_managed_interventions[intervention.name] != true)
      list_of_goals_and_interventions.push current_item
    self.goals_and_interventions = list_of_goals_and_interventions
    console.log 'rerendered'

}
