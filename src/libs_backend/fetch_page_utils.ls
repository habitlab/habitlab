{cfy} = require 'cfy'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

#get_cheerio = memoizeSingleAsync cfy ->*
#  yield SystemJS.import('cheerio')

export fetch_page_text = cfy (url) ->*
  page_request = yield fetch(url)
  page_text = yield page_request.text()
  return page_text

/*
export fetch_and_parse_page = cfy (url) ->*
  page_text = yield fetch_page_text(url)
  cheerio = yield get_cheerio()
  $ = cheerio.load(page_text)
  return $
*/
