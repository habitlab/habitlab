{polymer_ext} = require 'libs_frontend/polymer_utils'

require! {
  moment
}

{
  ThompsonMAB
} = require 'libs_backend/multi_armed_bandit_thompson'

prelude = require 'prelude-ls'

{
  get_multi_armed_bandit_algorithm
} = require 'libs_backend/multi_armed_bandit'

intervention_utils = require 'libs_common/intervention_utils'

class User
  /**
    * Instantiates user with behavior.
    * @param {intervention: {min, max}} behavior min and max seconds user will spend on intervention
    */
  (@behavior) ->
    console.log(@behavior)

  /**
    * Spends time on intervention.
    * @param {string} intervention name of intervention.
    * @return {time, regret} number of seconds spent on intervention and calculated regret.
    */
  spendTime: (intervention) ->
    best_choice = undefined
    for intervention_name of this.behavior
      time = this.behavior[intervention_name].min + Math.random() * (this.behavior[intervention_name].max - this.behavior[intervention_name].min)
      if !best_choice? or best_choice > time
        console.log("best_choice = " + time)
        best_choice = time   
      if intervention_name == intervention
        intervention_time = time
    console.log({time: intervention_time, regret: intervention_time - best_choice})
    return {time: intervention_time, regret: intervention_time - best_choice}


polymer_ext {
  is: 'thompson-novelty-debug'
  properties: {
    goal: {
      type: String
      value: 'facebook/spend_less_time'
      observer: 'goal_changed'
    }
    weight : {
      type: Number
      value: 0.5
    }
    interventions: {
      type: Array
      value: [
        {
          name: "facebook/scroll_blocker"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
        {
          name: "facebook/feed_injection_timer"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
        {
          name: "facebook/remove_news_feed"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
        {
          name: "facebook/rich_notifications"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
        {
          name: "facebook/remove_comments"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
        {
          name: "facebook/remove_clickbait"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
        {
          name: "facebook/toast_notifications"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
        {
          name: "facebook/show_timer_banner"
          time_min: 3000
          time_max: 4000
          novelty: 10000000
          choice_freq: 0
          last_chosen: Date.now()
        }
      ]
    }
  }
  slider_changed: (evt) ->
    console.log("NEW WEIGHT: "  + this.weight)
  to_id: (intervention_name) ->
    alphabet = ['a' to 'z'].concat ['A' to 'Z'].concat ['0' to '9']
    output = intervention_name.split('').filter(-> alphabet.indexOf(it) != -1).join('')
    return output
  get_novelty: ->
    novelty = {}
    for intervention in this.interventions
      intervention.novelty = Date.now() - intervention.last_chosen
      novelty[intervention.name] = intervention.novelty
    return novelty
  choose_intervention: ->>
    for intervention in this.interventions
      this.S("#" + this.to_id(intervention.name)).css("background-color","white")
    user = new User(this.extract_behavior())
    console.log(this.extract_behavior())
    if !this.bandit?
      this.bandit = new ThompsonMAB(this.get_intervention_list(), this.weight, 1-this.weight)
    # Now, choose an intervention.
    chosen_intervention = this.bandit.predict(this.get_novelty())
    console.log(chosen_intervention)
    time = user.spendTime(chosen_intervention)
    this.bandit.learn(chosen_intervention, time.time)
    this.regret_this_round = time.regret
    if !@total_regret?
      @total_regret = 0
    this.total_regret += this.regret_this_round
    if !this.rounds?
      this.rounds = 0
    this.rounds += 1
    this.average_regret = this.total_regret/this.rounds
    # Now, increment choice_freq for the corresponding intervention.
    new_interventions = []
    for intervention in this.interventions
      if intervention.name == chosen_intervention
        intervention.choice_freq += 1
        intervention.last_chosen = Date.now()
        this.S("#" + this.to_id(intervention.name)).css("background-color","yellow")
      new_interventions.push(intervention)
    this.interventions = JSON.parse(JSON.stringify(new_interventions))
  choose_50_interventions: ->>
    for i from 1 to 50 by 1
      this.choose_intervention()
  extract_behavior: ->
    behavior = {}
    for intervention in this.interventions
      behavior[intervention.name] = {min: intervention.time_min, max: intervention.time_max}
    return behavior
  get_intervention_list: ->
    intervention_list = []
    for intervention in this.interventions
      intervention_list.push(intervention.name)
    return intervention_list
  ready: ->
    self = this
    self.once_available '.intervention_score_range', ->
      self.slider_changed()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    '$$$'
    'SM'
    'S'
    'once_available'
  ]
}