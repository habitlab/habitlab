{cfy} = require 'cfy'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

#get_cheerio = memoizeSingleAsync ->>
#  await SystemJS.import('cheerio')

export fetch_page_text = (url) ->>
  page_request = await fetch(url, {credentials: 'include'})
  page_text = await page_request.text()
  return page_text

/*
export fetch_and_parse_page = (url) ->>
  page_text = await fetch_page_text(url)
  cheerio = await get_cheerio()
  $ = cheerio.load(page_text)
  return $
*/
