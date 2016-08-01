{cfy, yfy, add_noerr} = require 'cfy'

export get_pages_visited_today = cfy ->*
  yesterday = Date.now() - 24*3600*1000
  pages_list = yield add_noerr -> chrome.history.search {text: '', startTime: yesterday, maxResults: 2**31 - 1}, it
  return pages_list

export get_pages_visited_all_time = cfy ->*
  pages_list = yield add_noerr -> chrome.history.search {text: '', startTime: 0, maxResults: 2**31 - 1}, it
  return pages_list
