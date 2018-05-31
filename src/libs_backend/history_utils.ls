{url_to_domain} = require 'libs_common/domain_utils'
{memoizeSingleAsync} = require 'libs_common/memoize'

{gexport, gexport_module} = require 'libs_common/gexport'

require! {
  moment
}

{median} = require 'libs_common/math_utils'

{
  localget
} = require 'libs_common/cacheget_utils'

{
  get_seconds_spent_on_domain_all_days
} = require 'libs_common/time_spent_utils'

{
  getvar_history
  setvar_history
  getdict
  setdict
} = require 'libs_backend/db_utils'

prelude = require 'prelude-ls'

lzstring = require 'lz-string'

export get_pages_visited_today = ->>
  yesterday = Date.now() - 24*3600*1000
  pages_list = await new Promise -> chrome.history.search {text: '', startTime: yesterday, maxResults: 2**31 - 1}, it
  return pages_list

export get_pages_visited_all_time = ->>
  pages_list = await new Promise -> chrome.history.search {text: '', startTime: 0, maxResults: 2**31 - 1}, it
  return pages_list

export get_productivity_classifications = memoizeSingleAsync ->>
  classifications = await localget('/productivity_classifications.json')
  return JSON.parse classifications

export get_work_pages_visited_today = ->>
  yesterday = Date.now() - 24*3600*1000
  pages_list = await new Promise -> chrome.history.search {text: '', startTime: yesterday, maxResults: 2**31 - 1}, it
  productivity_classifications = await get_productivity_classifications()
  productive_pages_list = pages_list.filter (page_info) ->
    {url} = page_info
    domain = url_to_domain url
    if productivity_classifications[domain] == 'work'
      return true
    return false
  return productive_pages_list

export get_url_to_visits = (start_time, end_time) ->>
  pages_list = await new Promise -> chrome.history.search {text: '', startTime: start_time, endTime: end_time, maxResults: 2**31-1}, it
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
    visits = await new Promise -> chrome.history.getVisits {url: url}, it
    url_to_visits[url] = visits
  return url_to_visits

export get_url_to_visits_from_pages_list = (pages_list) ->>
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
    visits = await new Promise -> chrome.history.getVisits {url: url}, it
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

export get_url_and_visit_time_sorted = (start_time, end_time) ->>
  url_to_visits = await get_url_to_visits(start_time, end_time)
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

export get_url_to_time_spent = (start_time, end_time) ->>
  url_and_visit_time = await get_url_and_visit_time_sorted(start_time, end_time)
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

export get_domain_to_time_spent = (start_time, end_time) ->>
  url_to_time_spent = await get_url_to_time_spent(start_time, end_time)
  return get_domain_to_time_spent_for_url_to_time_spent(url_to_time_spent)

export get_url_to_time_spent_days_before_today = (days_before_today) ->>
  start_time = moment().subtract(days_before_today, 'days').hour(0).minute(0).second(0).valueOf() # milliseconds since unix epoch
  end_time = moment().subtract(days_before_today, 'days').hour(23).minute(59).second(59).valueOf() # milliseconds since unix epoch
  await get_url_to_time_spent(start_time, end_time)

export get_url_to_time_spent_today = ->>
  await get_url_to_time_spent_days_before_today(0)

export get_domain_to_time_spent_days_before_today = (days_before_today) ->>
  start_time = moment().subtract(days_before_today, 'days').hour(0).minute(0).second(0).valueOf() # milliseconds since unix epoch
  end_time = moment().subtract(days_before_today, 'days').hour(23).minute(59).second(59).valueOf() # milliseconds since unix epoch
  await get_domain_to_time_spent(start_time, end_time)

export get_domain_to_time_spent_today = ->>
  await get_domain_to_time_spent_days_before_today(0)

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

export get_domain_to_earliest_visit = ->>
  url_to_visits = await get_url_to_visits(0, Date.now())
  return get_domain_to_earliest_visit_for_url_to_visits(url_to_visits)

export get_baseline_time_on_domains_real_passing_url_to_visits_and_time = (url_to_visits, date_now) ->
  total_time_spent_on_domains = get_domain_to_time_spent_for_url_to_visits(url_to_visits, 0, date_now)
  earliest_visit_to_domains = get_domain_to_earliest_visit_for_url_to_visits(url_to_visits)
  #total_time_spent_on_domains = await get_domain_to_time_spent(0, Date.now())
  #earliest_visit_to_domains = await get_domain_to_earliest_visit()
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

export get_baseline_time_on_domains_real = ->>
  url_to_visits = await get_url_to_visits(0, Date.now())
  return get_baseline_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, Date.now())

export get_baseline_time_on_domains = memoizeSingleAsync ->>
  baseline_time_on_domains = await getdict 'baseline_time_on_domains'
  if baseline_time_on_domains? and Object.keys(baseline_time_on_domains).length > 0
    return baseline_time_on_domains
  baseline_time_on_domains = await get_baseline_time_on_domains_real()
  await setdict 'baseline_time_on_domains', baseline_time_on_domains
  return baseline_time_on_domains

# milliseconds
export get_baseline_time_on_domain = (domain) ->>
  baseline_time_on_domains = await get_baseline_time_on_domains()
  if baseline_time_on_domains[domain]?
    return baseline_time_on_domains[domain]
  return 0

export get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time = (url_to_visits, date_now) ->
  url_and_visit_time_sorted = get_url_and_visit_time_sorted_for_url_to_visits(url_to_visits, 0, date_now)
  prev_domain = null
  prev_visit_time_start = 0
  prev_visit_time_most_recent = 0
  domain_to_visit_lengths = {}
  for {url, visitTime} in url_and_visit_time_sorted
    domain = url_to_domain url
    if not domain_to_visit_lengths[domain]?
      domain_to_visit_lengths[domain] = []
    if visitTime > prev_visit_time_most_recent + 60*60*1000
      # more than 60 minutes of idle time since last visit
      if prev_domain?
        # we will consider the visit to have been the final minute
        domain_to_visit_lengths[prev_domain].push(prev_visit_time_most_recent + 60*1000 - prev_visit_time_start)
      prev_domain = domain
      prev_visit_time_start = visitTime
      prev_visit_time_most_recent = visitTime
      continue
    if domain != prev_domain
      if prev_domain?
        prev_visit_end_time = Math.min(visitTime, prev_visit_time_most_recent + 60*60*1000)
        domain_to_visit_lengths[prev_domain].push(prev_visit_end_time - prev_visit_time_start)
      prev_domain = domain
      prev_visit_time_start = visitTime
      prev_visit_time_most_recent = visitTime
      continue
    prev_visit_time_most_recent = visitTime
  domain_to_average_visit_lengths = {}
  for domain,visit_lengths of domain_to_visit_lengths
    if visit_lengths.length == 0
      continue
    domain_to_average_visit_lengths[domain] = median(visit_lengths) / 1000
  return domain_to_average_visit_lengths

export get_baseline_session_time_on_domains_real = ->>
  url_to_visits = await get_url_to_visits(0, Date.now())
  return get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, Date.now())

export get_baseline_session_time_on_domains = memoizeSingleAsync ->>
  baseline_time_on_domains = await getdict 'baseline_session_time_on_domains'
  if baseline_time_on_domains? and Object.keys(baseline_time_on_domains).length > 0
    return baseline_time_on_domains
  baseline_time_on_domains = await get_baseline_session_time_on_domains_real()
  await setdict 'baseline_session_time_on_domains', baseline_time_on_domains
  return baseline_time_on_domains

export get_baseline_session_time_on_domain = (domain) ->>
  baseline_time_on_domains = await get_baseline_session_time_on_domains()
  if baseline_time_on_domains[domain]?
    return baseline_time_on_domains[domain]
  return 0

export get_domain_visit_info = (pages_list) ->
  output = {} # domain -> [num unique urls, num unique urls typed, total visits, total typed, first visit time, last visit time]
  for x in pages_list
    url = x.url
    if not (url.startsWith('https://') or url.startsWith('http://'))
      continue
    domain = url_to_domain(url)
    curitem = output[domain]
    if not curitem?
      output[domain] = [0, 0, 0, 0, x.lastVisitTime, x.lastVisitTime]
      curitem = output[domain]
    else
      curitem[4] = Math.min(curitem[4], x.lastVisitTime)
      curitem[5] = Math.max(curitem[5], x.lastVisitTime)
    curitem[0] += 1
    curitem[2] += x.visitCount
    if x.typedCount > 0
      curitem[1] += 1
      curitem[3] += x.typedCount
  return output

export ensure_history_utils_data_cached = ->>
  date_now = Date.now()
  if localStorage.cached_domain_visit_info != 'true'
    domain_visit_info_compressed = await getvar_history 'domain_visit_info'
    if not domain_visit_info_compressed?
      pages_list = await new Promise -> chrome.history.search {text: '', startTime: 0, endTime: date_now, maxResults: 2**31-1}, it
      domain_visit_info_compressed = lzstring.compressToEncodedURIComponent(JSON.stringify(get_domain_visit_info(pages_list)))
      await setvar_history 'domain_visit_info', domain_visit_info_compressed
    localStorage.cached_domain_visit_info = 'true'
  if localStorage.cached_domain_baseline_times != 'true'
    baseline_session_time_on_domains = await getdict 'baseline_session_time_on_domains'
    baseline_time_on_domains = await getdict 'baseline_time_on_domains'
    if not (baseline_session_time_on_domains? and baseline_time_on_domains? and Object.keys(baseline_session_time_on_domains).length > 0 and Object.keys(baseline_time_on_domains).length > 0)
      if not pages_list?
        pages_list = await new Promise -> chrome.history.search {text: '', startTime: 0, endTime: date_now, maxResults: 2**31-1}, it
      url_to_visits = await get_url_to_visits_from_pages_list(pages_list)
      baseline_session_time_on_domains = await get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, date_now)
      await setdict 'baseline_session_time_on_domains', baseline_session_time_on_domains
      baseline_time_on_domains = await get_baseline_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, date_now)
      await setdict 'baseline_time_on_domains', baseline_time_on_domains
    localStorage.cached_domain_baseline_times = 'true'

export list_all_domains_in_history = ->>
  start_time = 0
  end_time = Date.now()
  url_history_info_list = await new Promise -> chrome.history.search {text: '', startTime: start_time, endTime: end_time, maxResults: 2**31-1}, it
  output_set = {}
  output = []
  for {url} in url_history_info_list
    domain = url_to_domain(url)
    if domain.length == 0
      continue
    if not output_set[domain]?
      output_set[domain] = true
      output.push(domain)
  output.sort()
  return output

# seconds
export get_average_seconds_spent_on_domain = (domain) ->>
  days_before_to_seconds_spent = await get_seconds_spent_on_domain_all_days(domain)
  num_days_of_data = Object.keys(days_before_to_seconds_spent).length
  if num_days_of_data < 2
    return (await get_baseline_time_on_domain(domain)) / 1000.0
  return prelude.sum(Object.values(days_before_to_seconds_spent)) / num_days_of_data

gexport_module 'history_utils', -> eval(it)
