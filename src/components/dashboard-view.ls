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
  buttonAction1: ->  
    myButton = this.$$('.button1')
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
  buttonAction2: ->
    a <~ get_seconds_spent_on_all_domains_days_since_today(1)
    sorted = bySortedValue(a)  
    #accounts for visiting less than 5 websites
    if sorted.length < 5 
      for i from sorted.length to 4
        sorted.push(["", 0])

    myButton = this.$$('.button2')
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
      
  buttonAction3: ->
    myButton = this.$$('.button3')  
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
    console.log "hey :)"
    a <~ get_seconds_spent_on_all_domains_today()
    sorted = bySortedValue(a)
    #accounts for visiting less than 5 websites
    if sorted.length < 5 
      for i from sorted.length to 4
        sorted.push(["", 0])
    #length = sorted.length
    #for i from 0 to sorted.length - 1 by 1
    #  console.log "Key: #{sorted[i][0]} Value: #{sorted[i][1]}"

    /*
    this.linedata = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40],
        }
      ]
    }
    */
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