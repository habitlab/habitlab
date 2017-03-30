{polymer_ext} = require 'libs_frontend/polymer_utils'

{cfy} = require 'cfy'

{
  get_domain_to_time_spent_days_since_today
  get_baseline_time_on_domains
} = require 'libs_backend/history_utils'

prelude = require 'prelude-ls'

sorted_by_values_descending = (dict) ->
  items = [[k,v] for k,v of dict]
  return prelude.reverse(prelude.sortBy (.1), items)

polymer_ext {
  is: 'history-time-spent'
  properties: {
  }
  ready: ->>
    for days_since_today from 0 til 7
      console.log "=========== #{days_since_today} days ago ============"
      time_spent_on_domains = await get_domain_to_time_spent_days_since_today(days_since_today)
      top_domains = sorted_by_values_descending time_spent_on_domains
      for [domain,time_spent] in top_domains[til 5]
        console.log "#{domain} #{time_spent / (60*1000)}"
    console.log "============ time spent on Facebook =============="
    for days_since_today from 0 til 7
      time_spent_on_domains = await get_domain_to_time_spent_days_since_today(days_since_today)
      time_spent_on_facebook = time_spent_on_domains['www.facebook.com'] ? 0
      console.log "#{days_since_today} days ago: #{time_spent_on_facebook / (60*1000)}"
    console.log '========== baseline time on domains ============'
    baseline_time_on_domains = await get_baseline_time_on_domains()
    top_domains = sorted_by_values_descending baseline_time_on_domains
    for [domain,time_spent] in top_domains[til 5]
      console.log "#{domain} #{time_spent / (60*1000)}"

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    '$$$'
    'SM'
    'S'
    'once_available'
  ]
}
