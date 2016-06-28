{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_seconds_spent_on_current_domain_today     # current domain
  get_seconds_spent_on_all_domains_today        # map for all domains
  get_seconds_spent_on_domain_today             # specific domain
  get_seconds_spent_on_all_domains_days_since_today
  get_seconds_spent_on_domain_all_days
} = require 'libs_common/time_spent_utils'

{
  printable_time_spent
} = require 'libs_common/time_utils'

#d3 = require 'd3'
#Chart = require 'chart.js'

polymer_ext {
  is: 'dashboard-view'
  #Apparently this is syntax for polymer bindings... so it doesn't work exactly like js functions
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
        label: "Yesterday",
        data: [sorted[0][1], sorted[1][1], sorted[2][1], sorted[3][1], sorted[4][1]],
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

  numTimesDeployedButtonAction: ->  
    myButton = this.$$('.numTimesDeployedButton')
    if (myButton.value === "neverClicked")
      myButton.innerText = "View Today's Data"
      myButton.value = "clicked"
      this.push('bardata.datasets', {
        label: "Yesterday",
        backgroundColor: "rgba(135,211,124,0.7)",
        borderColor: "rgba(135,211,124,1)",      
        borderWidth: 1,
        data: [65, 100, 30, 81, 56]
      })
    else if (myButton.value === "clicked")
      myButton.innerText = "Compare with Previous Day"
      myButton.value = "neverClicked"
      this.pop('bardata.datasets') #removes dataset

  timeSavedButtonAction: ->
    myButton = this.$$('.timeSavedButton')  
    if (myButton.value === "neverClicked")
      myButton.innerText = "View Today's Data"
      myButton.value = "clicked"
      this.push('reductionEfficacyData.datasets', {
        label: "Avg. Minutes Saved",
        backgroundColor: "rgba(239,72,54,0.5)",
        borderColor: "rgba(239,72,54,1)",      
        borderWidth: 1,
        data: [3, 1, 2, 5, 6]  
      })    
    else if (myButton.value === "clicked")
      myButton.innerText = "Compare with Previous Day"
      myButton.value = "neverClicked"
      this.pop('reductionEfficacyData.datasets')

  ready: ->
    a <~ get_seconds_spent_on_all_domains_today()
    sorted = bySortedValue(a)
    #accounts for visiting less than 5 websites
    if sorted.length < 5 
      for i from sorted.length to 4
        sorted.push(["", 0])
    length = sorted.length
    for i from 0 to sorted.length - 1 by 1
      console.log "Key: #{sorted[i][0]} Value: #{sorted[i][1]}"

    this.donutdata = {
      labels: [
          sorted[0][0],
          sorted[1][0],
          sorted[2][0],
          sorted[3][0],
          sorted[4][0]  
      ],
      datasets: [
      {
          data: [sorted[0][1], sorted[1][1], sorted[2][1], sorted[3][1], sorted[4][1]],
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

    goal1 <~ get_seconds_spent_on_domain_today('www.facebook.com')
    goal2 <~ get_seconds_spent_on_domain_today('www.youtube.com')
    goal3 <~ get_seconds_spent_on_domain_today('mail.google.com')
    this.goalOverviewData = {
      labels: ["Spend Less Time on Facebook", "Spend Less Time on Youtube", "Spend Less Time on Gmail"],
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(89,171,227,0.7)",
          borderColor: "rgba(89,171,227,1)",
          borderWidth: 1,
          data: [goal1, goal2, goal3]
        }
      ]
    }

    fb <~ get_seconds_spent_on_domain_all_days('www.facebook.com')
    if fb.length < 10
      for i from 0 to 9 by 1
        if fb[i] === undefined
          fb[i] = 0
    this.facebookData = {
      labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
      datasets: [
        {
          label: "Time Spent on Facebook",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          data: [fb[9], fb[8], fb[7], fb[6], fb[5], fb[4], fb[3], fb[2], fb[1], fb[0]]
        }
      ]
    }

    yt <~ get_seconds_spent_on_domain_all_days('www.youtube.com')
    if yt.length < 10
      for i from 0 to 9 by 1
        if yt[i] === undefined
          yt[i] = 0
    this.youtubeData = {
      labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
      datasets: [
        {
          label: "Time Spent on Youtube",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          data: [yt[9], yt[8], yt[7], yt[6], yt[5], yt[4], yt[3], yt[2], yt[1], yt[0]]
        }
      ]
    }  

    gm <~ get_seconds_spent_on_domain_all_days('mail.google.com')
    if gm.length < 10
      for i from 0 to 9 by 1
        if gm[i] === undefined
          gm[i] = 0
    this.gmailData = {
      labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
      datasets: [
        {
          label: "Time Spent on Gmail",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          data: [gm[9], gm[8], gm[7], gm[6], gm[5], gm[4], gm[3], gm[2], gm[1], gm[0]]
        }
      ]
    }  

    this.bardata = {
      labels: ["Duolingo", "Facebook", "Gmail", "Google", "Youtube"],
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(89,171,227,0.7)",
          borderColor: "rgba(89,171,227,1)",
          borderWidth: 1,
          data: [28, 95, 40, 19, 50]
        }
      ]
    }  

    this.reductionEfficacyData = {
      labels: ["Duolingo", "Facebook", "Gmail", "Google", "Youtube"],
      datasets: [
        {
          label: "Your Minutes Saved",
          backgroundColor: "rgba(230,126,34,0.5)",
          borderColor: "rgba(230,126,34,1)",
          borderWidth: 1,
          data: [4, 3, 12, 15, 6]
        }
      ]
    }
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}

``
//Sorts array in descending order 
//http://stackoverflow.com/questions/5199901/how-to-sort-an-associative-array-by-its-values-in-javascript
function bySortedValue(obj) {
    var tuples = [];
    for (var key in obj) tuples.push([key, obj[key]]);
    tuples.sort(function(a, b) { 
      return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0 
    });

    return tuples;
}
``