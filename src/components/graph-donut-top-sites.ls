{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_seconds_spent_on_all_domains_today        # map for all domains
  get_seconds_spent_on_all_domains_days_before_today
} = require 'libs_common/time_spent_utils'

{cfy} = require 'cfy'

polymer_ext {
  is: 'graph-donut-top-sites'
  properties: {
  }

  timeSpentButtonAction: ->
    a <~ get_seconds_spent_on_all_domains_days_before_today(1)
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

  ready: ->>
    self = this
    
    #MARK: Donut Graph
    a = await get_seconds_spent_on_all_domains_today()
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