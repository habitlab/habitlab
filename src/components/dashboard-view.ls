{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

require! {
  async
}

{cfy} = require 'cfy'

{
  get_seconds_spent_on_current_domain_today     # current domain
  get_seconds_spent_on_all_domains_today        # map for all domains
  get_seconds_spent_on_domain_today             # specific domain
  get_seconds_spent_on_all_domains_days_since_today
  get_seconds_spent_on_domain_all_days
} = require 'libs_common/time_spent_utils'

{  
  list_sites_for_which_goals_are_enabled
  list_goals_for_site
  getGoalInfo
  get_enabled_goals  
  get_goals
} = require 'libs_backend/goal_utils'

{
  get_progress_on_enabled_goals_today
  get_progress_on_goal_today
} = require 'libs_backend/goal_progress'

{
  get_enabled_interventions
  get_interventions
  get_effectiveness_of_intervention_for_goal  
  get_effectiveness_of_all_interventions_for_goal
} = require 'libs_backend/intervention_utils'

{
  get_num_impressions_today
  get_num_actions_today
  get_interventions_seen_today
} = require 'libs_backend/log_utils'

{
  get_baseline_time_on_domain
  get_baseline_time_on_domains  
  get_pages_visited_today
  get_pages_visited_all_time
  get_productivity_classifications
  get_work_pages_visited_today
  get_url_and_visit_time_sorted_for_url_to_visits  
} = require 'libs_backend/history_utils'

polymer_ext {
  is: 'dashboard-view'
  properties: {
    sites: {
      type: Array
    }
  }
  /*
  buttonAction1: ->
    this.linedata.datasets[0].label = 'a new label'
    this.$$('#linechart').chart.update()
  */
  timeSpentButtonAction: ->
    a <~ get_seconds_spent_on_all_domains_days_since_today(1)
    sorted = bySortedValue(a)  
    #accounts for visiting less than 5 websites
    if sorted.length < 5 
      for i from sorted.length to 4
        sorted.push(["", 0])

    myButton = this.$$('.timeSpentButton')
    if (myButton.value === "neverClicked")
      myButton.innerText = "View Today's Data"
      myButton.value = "clicked"
      this.push('donutdata.datasets', {
        data: [Math.round(10*(sorted[0][1]/60))/10, Math.round(10*(sorted[1][1]/60))/10, Math.round(10*(sorted[2][1]/60))/10, Math.round(10*(sorted[3][1]/60))/10, Math.round(10*(sorted[4][1]/60))/10],        
        backgroundColor: [
            "rgba(65,131,215,0.7)",
            "rgba(27,188,155,0.7)",
            "rgba(244,208,63,0.7)",
            "rgba(230,126,34,0.7)",
            "rgba(239,72,54,0.7)"
        ],
        hoverBackgroundColor: [
            "rgba(65,131,215,1)",
            "rgba(27,188,155,1)",
            "rgba(244,208,63,1)",
            "rgba(230,126,34,1)",
            "rgba(239,72,54,1)"          
        ]              
      })
    else if (myButton.value === "clicked")
      myButton.innerText = "Compare with Previous Day"
      myButton.value = "neverClicked"
      this.pop('donutdata.datasets')

  on_goal_changed: (evt) ->
    this.rerender()
  ready: ->
    this.rerender()
  rerender: cfy ->*
    #MARK: Polymer tabbing
    self = this
    self.once_available '#graphsOfGoalsTab', ->
      self.S('#graphsOfGoalsTab').prop('selected', 0)

    #MARK: Chrome History Graph
    goalsHistory = yield get_goals()
    enabledGoalsHistory = yield get_enabled_goals()

    #Retrieves urls associated with each enabled intervention
    intervention_urls = []
    for key, value of enabledGoalsHistory
      goal = goalsHistory[key]
      intervention_urls.push goal.domain

    intervention_time_spent = []
    for item in intervention_urls
      temp = yield get_baseline_time_on_domain(item)
      intervention_time_spent.push(temp / (60*1000))

    self.chromeHistoryData = {
      labels: intervention_urls
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: intervention_time_spent

        }
      ]
    }
    self.chromeHistoryOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Minutes'
          },                            
          ticks: {
            beginAtZero: true
          }
        }]
      }
    } 


    #MARK: Time saved daily due to interventions Graph  
    enabledGoals = yield get_enabled_goals()
    enabledGoalsKeys = Object.keys(enabledGoals)

    #Retrieves the number of impressions for each enabled intervention        
    time_saved_on_enabled_goals = []
    for item in enabledGoalsKeys
      enabledGoalsResults = yield get_effectiveness_of_all_interventions_for_goal(item)
      time_saved_on_enabled_goals.push(enabledGoalsResults)

    #Retrieves intervention names and values
    control = [] #for now, control is the max value 
    interventions_list = []
    intervention_progress = []
    for item in time_saved_on_enabled_goals
      for key,value of item

        #only push not-empty interventions
        if !isNaN value.progress
          intervention_progress.push value.progress
          interventions_list.push key

          if value.progress > control
            control = value.progress

    for i from 0 to intervention_progress.length - 1 by 1
      intervention_progress[i] = control - intervention_progress[i]    

    #Retrieves all intervention descriptions
    intervention_descriptions = yield get_interventions()

    #Retrieves necessary intervention descriptions
    intervention_descriptions_final = []
    for item in interventions_list
      intervention_descriptions_final.push(intervention_descriptions[item].description)

    self.timeSavedData = {
      labels: intervention_descriptions_final
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: [Math.round(v*10)/10 for k, v of intervention_progress]

        }
      ]
    }
    self.timeSavedOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Minutes'
          },                            
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }


    #MARK: Daily Overview Graph
    goalsDataToday = yield get_progress_on_enabled_goals_today();  
    goalKeys = Object.keys(goalsDataToday)
    
    results = []
    for item in goalKeys
      results.push yield getGoalInfo(item)

    self.goalOverviewData = {
      labels: results.map (.description)
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(75,192,192,0.5)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          data: [Math.round(v.progress*10)/10 for k, v of goalsDataToday]
        }
      ]
    }
    self.goalOverviewOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Units'
          },
          ticks: {
            beginAtZero: true
          }          
        }]
      }
    }     

    sites = yield list_sites_for_which_goals_are_enabled()
    self.sites = sites


    #MARK: Num Times Interventions Deployed Graph
    #Retrieves all interventions    
    seenInterventions = yield get_interventions_seen_today()

    results = []
    for intv in seenInterventions
      results.push yield get_num_impressions_today(intv)

    #Retrieves all intervention descriptions
    interv_descriptions = yield get_interventions()

    #Retrieves necessary intervention descriptions
    seenInterventionsLabels = []
    for item in seenInterventions
      seenInterventionsLabels.push(interv_descriptions[item].description)      

    #displays onto the graph
    self.interventionFreqData = {
      labels: seenInterventionsLabels
      datasets: [
        {
          label: "",
          backgroundColor: "rgba(65,131,215,0.5)",
          borderColor: "rgba(65,131,215,1)",
          borderWidth: 1,
          data: results
        }
      ]
    }

    self.interventionFreqOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Times'
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    #MARK: Donut Graph
    a = yield get_seconds_spent_on_all_domains_today()
    sorted = bySortedValue(a)
    #accounts for visiting less than 5 websites
    if sorted.length < 5 
      for i from sorted.length to 4
        sorted.push(["", 0])
    length = sorted.length
    #for i from 0 to sorted.length - 1 by 1
    #  console.log "Key: #{sorted[i][0]} Value: #{sorted[i][1]}"
    self.donutdata = {
      labels: [
          sorted[0][0],
          sorted[1][0],
          sorted[2][0],
          sorted[3][0],
          sorted[4][0]  
      ],
      datasets: [
      {
          data: [Math.round(10*(sorted[0][1]/60))/10, 
                Math.round(10*(sorted[1][1]/60))/10,
                Math.round(10*(sorted[2][1]/60))/10, 
                Math.round(10*(sorted[3][1]/60))/10, 
                Math.round(10*(sorted[4][1]/60))/10
          ],
          backgroundColor: [
              "rgba(65,131,215,0.7)",
              "rgba(27,188,155,0.7)",
              "rgba(244,208,63,0.7)",
              "rgba(230,126,34,0.7)",
              "rgba(239,72,54,0.7)"
          ],
          hoverBackgroundColor: [
              "rgba(65,131,215,1)",
              "rgba(27,188,155,1)",
              "rgba(244,208,63,1)",
              "rgba(230,126,34,1)",
              "rgba(239,72,54,1)"
          ]
      }]
    }

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}

#Sorts array in descending order 
#http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
bySortedValue = (obj) ->
  tuples = []
  for key of obj
    tuples.push [key, obj[key]]
  tuples.sort ((a, b) -> if a.1 < b.1 then 1 else if a.1 > b.1 then -1 else 0)
  tuples