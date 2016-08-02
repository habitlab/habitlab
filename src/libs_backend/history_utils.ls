{cfy, yfy, add_noerr} = require 'cfy'
{url_to_domain} = require 'libs_common/domain_utils'
{memoizeSingleAsync} = require 'libs_common/memoize'
$ = require 'jquery'

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
