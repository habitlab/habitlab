{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

#d3 = require 'd3'
#Chart = require 'chart.js'

polymer_ext {
  is: 'dashboard-view'
  ready: ->
    this.bardata = {
      labels: ["Duolingo", "Facebook", "Gmail", "Google", "Youtube"],
      datasets: [
        {
          label: "Today",
          backgroundColor: "rgba(89,171,227,0.7)",
          borderColor: "rgba(89,171,227,1)",
          borderWidth: 1,
          data: [65, 59, 80, 81, 56]
        },
        {
          label: "Yesterday",
          backgroundColor: "rgba(135,211,124,0.7)",
          borderColor: "rgba(135,211,124,1)",
          borderWidth: 1,
          data: [28, 48, 40, 19, 86]
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
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
