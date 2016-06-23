{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'



#d3 = require 'd3'
#Chart = require 'chart.js'

polymer_ext {
  is: 'dashboard-view'
  #Apparently this is syntax for polymer bindings... so it doesn't work exactly like js functions
  buttonAction1: ->
    myButton = document.querySelector('.button1')
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
    myButton = document.querySelector('.button2')
    if (myButton.value === "neverClicked")
      myButton.innerText = "View Today's Data"
      myButton.value = "clicked"
      this.push('donutdata.datasets', {
        label: "Yesterday",
        data: [700, 650, 310, 310, 110],
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
    myButton = document.querySelector('.button3')  
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
    this.donutdata = {
      labels: [
          "facebook.com",
          "youtube.com",
          "reddit.com",
          "mechanicalturk.com",
          "productivity.com"          
      ],
      datasets: [
      {
          data: [600, 460, 300, 240, 150],
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