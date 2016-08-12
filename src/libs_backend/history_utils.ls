{cfy, yfy, add_noerr} = require 'cfy'
{url_to_domain} = require 'libs_common/domain_utils'
{memoizeSingleAsync} = require 'libs_common/memoize'
$ = require 'jquery'

require! {
  moment
  prelude
}

export get_pages_visited_today = cfy ->*
  yesterday = Date.now() - 24*3600*1000
  pages_list = yield add_noerr -> chrome.history.search {text: '', startTime: yesterday, maxResults: 2**31 - 1}, it
  return pages_list

export get_pages_visited_all_time = cfy ->*
  pages_list = yield add_noerr -> chrome.history.search {text: '', startTime: 0, maxResults: 2**31 - 1}, it
  return pages_list

export get_productivity_classifications = memoizeSingleAsync cfy ->*
  classifications = yield $.get '/productivity_classifications.json'
  return JSON.parse classifications

export get_work_pages_visited_today = cfy ->*
  yesterday = Date.now() - 24*3600*1000
  pages_list = yield add_noerr -> chrome.history.search {text: '', startTime: yesterday, maxResults: 2**31 - 1}, it
  productivity_classifications = yield get_productivity_classifications()
  productive_pages_list = pages_list.filter (page_info) ->
    {url} = page_info
    domain = url_to_domain url
    if productivity_classifications[domain] == 'work'
      return true
    return false
  return productive_pages_list

export get_url_to_visits = cfy (start_time, end_time) ->*
  pages_list = yield add_noerr -> chrome.history.search {text: '', startTime: start_time, endTime: end_time, maxResults: 2**31-1}, it
  url_list = []
  seen_urls = {}
  for page in pages_list
    {url} = page
    if not url? or url == ''
      continue
    seen_urls[url] = true
    url_list.push url
  url_to_visits = {}
  for url in url_list
    visits = yield add_noerr -> chrome.history.getVisits {url: url}, it
    url_to_visits[url] = visits
  return url_to_visits

export get_url_and_visit_time_sorted_for_url_to_visits = (url_to_visits, start_time, end_time) ->
  url_and_visit_time = []
  for url,visits of url_to_visits
    for visit in visits
      visitTime = visit.visitTime
      if start_time <= visitTime <= end_time
        url_and_visit_time.push {url, visitTime}
  url_and_visit_time = prelude.sortBy (.visitTime), url_and_visit_time
  return url_and_visit_time

export get_url_and_visit_time_sorted = cfy (start_time, end_time) ->*
  url_to_visits = yield get_url_to_visits(start_time, end_time)
  return get_url_and_visit_time_sorted_for_url_to_visits(url_to_visits, start_time, end_time)

export get_url_to_time_spent_for_url_and_visit_time = (url_and_visit_time, start_time, end_time) ->
  url_to_time_spent = {}
  for item,idx in url_and_visit_time
    {visitTime, url} = item
    nextitem = url_and_visit_time[idx + 1]
    visit_duration = 5*60*1000 # 5 minutes in milliseconds
    if nextitem?
      nextVisitTime = nextitem.visitTime
      visit_duration = Math.min(visit_duration, nextVisitTime - visitTime)
    if visitTime + visit_duration > end_time
      visit_duration = end_time - visitTime
    if visit_duration < 0
      console.log 'visit duration negative'
      console.log item
      console.log start_time
      console.log end_time
      console.log nextitem
      console.log visit_duration
    if not url_to_time_spent[url]?
      url_to_time_spent[url] = visit_duration
    else
      url_to_time_spent[url] += visit_duration
  return url_to_time_spent

export get_url_to_time_spent = cfy (start_time, end_time) ->*
  url_and_visit_time = yield get_url_and_visit_time_sorted(start_time, end_time)
  return get_url_to_time_spent_for_url_and_visit_time(url_and_visit_time, start_time, end_time)

export get_domain_to_time_spent_for_url_to_visits = (url_to_visits, start_time, end_time) ->
  url_and_visit_time = get_url_and_visit_time_sorted_for_url_to_visits(url_to_visits, start_time, end_time)
  url_to_time_spent = get_url_to_time_spent_for_url_and_visit_time(url_and_visit_time, start_time, end_time)
  return get_domain_to_time_spent_for_url_to_time_spent(url_to_time_spent)

export get_domain_to_time_spent_for_url_to_time_spent = (url_to_time_spent) ->
  domain_to_time_spent = {}
  for url,time_spent of url_to_time_spent
    if url.startsWith('chrome://') or url.startsWith('chrome-extension://')
      continue
    domain = url_to_domain(url)
    if not domain_to_time_spent[domain]?
      domain_to_time_spent[domain] = time_spent
    else
      domain_to_time_spent[domain] += time_spent
  return domain_to_time_spent

export get_domain_to_time_spent = cfy (start_time, end_time) ->*
  url_to_time_spent = yield get_url_to_time_spent(start_time, end_time)
  return get_domain_to_time_spent_for_url_to_time_spent(url_to_time_spent)

export get_url_to_time_spent_days_since_today = cfy (days_since_today) ->*
  start_time = moment().subtract(days_since_today, 'days').hour(0).minute(0).second(0).valueOf() # milliseconds since unix epoch
  end_time = moment().subtract(days_since_today, 'days').hour(23).minute(59).second(59).valueOf() # milliseconds since unix epoch
  yield get_url_to_time_spent(start_time, end_time)

export get_url_to_time_spent_today = cfy ->*
  yield get_url_to_time_spent_days_since_today(0)

export get_domain_to_time_spent_days_since_today = cfy (days_since_today) ->*
  start_time = moment().subtract(days_since_today, 'days').hour(0).minute(0).second(0).valueOf() # milliseconds since unix epoch
  end_time = moment().subtract(days_since_today, 'days').hour(23).minute(59).second(59).valueOf() # milliseconds since unix epoch
  yield get_domain_to_time_spent(start_time, end_time)

export get_domain_to_time_spent_today = cfy ->*
  yield get_domain_to_time_spent_days_since_today(0)

export get_domain_to_earliest_visit_for_url_to_visits = (url_to_visits) ->
  domain_to_earliest_visit = {}
  for url,visits of url_to_visits
    domain = url_to_domain url
    for visit in visits
      visitTime = visit.visitTime
      if not domain_to_earliest_visit[domain]?
        domain_to_earliest_visit[domain] = visitTime
      else
        domain_to_earliest_visit[domain] = Math.min(visitTime, domain_to_earliest_visit[domain])
  return domain_to_earliest_visit

export get_domain_to_earliest_visit = cfy ->*
  url_to_visits = yield get_url_to_visits(0, Date.now())
  return get_domain_to_earliest_visit_for_url_to_visits(url_to_visits)

export get_baseline_time_on_domains_real = cfy ->*
  url_to_visits = yield get_url_to_visits(0, Date.now())
  total_time_spent_on_domains = get_domain_to_time_spent_for_url_to_visits(url_to_visits, 0, Date.now())
  earliest_visit_to_domains = get_domain_to_earliest_visit_for_url_to_visits(url_to_visits)
  #total_time_spent_on_domains = yield get_domain_to_time_spent(0, Date.now())
  #earliest_visit_to_domains = yield get_domain_to_earliest_visit()
  baseline_time_on_domains = {}
  current_time = Date.now()
  for domain,time_spent of total_time_spent_on_domains
    earliest_visit = earliest_visit_to_domains[domain]
    if not earliest_visit?
      continue
    num_days = Math.round ((current_time - earliest_visit) / (24*1000*3600))
    if num_days < 1
      continue
    daily_time_spent = time_spent / num_days
    baseline_time_on_domains[domain] = daily_time_spent
  return baseline_time_on_domains
  # TODO test whether this actually works?

export get_baseline_time_on_domains = cfy ->*
  #baseline_time_on_domains = localStorage.getItem 'baseline_time_on_domains'
  #if baseline_time_on_domains?
  #  return baseline_time_on_domains
  baseline_time_on_domains = yield get_baseline_time_on_domains_real()
  #localStorage.setItem 'baseline_time_on_domains', baseline_time_on_domains
  return baseline_time_on_domains

export get_baseline_time_on_domain = cfy (domain) ->*
  baseline_time_on_domains = yield get_baseline_time_on_domains()
  if baseline_time_on_domains[domain]?
    return baseline_time_on_domains[domain]
  return 0

