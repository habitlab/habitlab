fetch = require 'node-fetch'
fetch_favicon = require 'fetch-favicon'
icojs = require 'icojs'

require! {
  co
  cfy
}

toBuffer = (ab) ->
  buf = new Buffer(ab.byteLength);
  view = new Uint8Array(ab);
  for i from 0 til buf.length
    buf[i] = view[i]
  return buf

get_canonical_url = cfy (url) ->*
  try
    response = yield fetch url
    return response.url
  catch
    return null

get_canonical_domain = cfy (domain) ->*
  url = domain_to_url domain
  canonical_url = yield get_canonical_url url
  if canonical_url?
    return url_to_domain canonical_url
  return null

url_to_domain = (url) ->
  # http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
  # find & remove protocol (http, ftp, etc.) and get domain
  if url.indexOf("://") > -1
    domain = url.split('/')[2]
  else
    domain = url.split('/')[0]
  # find & remove port number
  domain = domain.split(':')[0]
  return domain

domain_to_url = (domain) ->
  return "http://" + url_to_domain(domain) + '/'

make_async = (sync_func) ->
  return (x) -> Promise.resolve(sync_func(x))

does_file_exist = cfy (url) ->*
  if typeof(url) != 'string' and typeof(url.href) == 'string'
    url = url.href
  try
    request = yield fetch url
    if not request.ok
      return false
    yield request.text()
    return true
  catch
    return false

async_filter = cfy (list, async_function) ->*
  output = []
  for x in list
    if (yield async_function(x))
      output.push x
  return output

get_favicon_data_for_url = cfy (domain) ->*
  if domain.endsWith('.ico')
    favicon_path = domain
  else
    if not domain.startsWith('http://') or domain.startsWith('https://')
      domain = 'http://' + domain
    all_favicon_paths = yield fetch_favicon.fetchFavicons(domain)
    filter_functions = [
      does_file_exist
    ]
    filter_functions = filter_functions.concat ([
      -> (it.name == 'favicon.ico')
      -> it.href.endsWith('favicon.ico')
      -> it.href.includes()
      -> it.href.endsWith('.ico')
      -> it.href.includes('favicon')
    ].map(make_async))
    for filter_function in filter_functions
      new_all_favicon_paths = yield async_filter(all_favicon_paths, filter_function)
      if new_all_favicon_paths.length > 0
        all_favicon_paths = new_all_favicon_paths
    favicon_path = yield get_canonical_url(all_favicon_paths[0].href)
  favicon_response = yield fetch(favicon_path)
  favicon_buffer = new Uint8Array(yield favicon_response.buffer()).buffer
  favicon_ico_parsed = yield icojs.parse(favicon_buffer)
  favicon_png_buffer = toBuffer(favicon_ico_parsed[0].buffer)
  return 'data:image/png;base64,' + favicon_png_buffer.toString('base64')

get_favicon_data_for_domain = cfy (domain) ->*
  try
    return yield get_favicon_data_for_url(domain)
  catch
  domain = yield get_canonical_domain(domain)
  return yield get_favicon_data_for_url(domain)

co ->*
  domain = process.argv[2]
  if not domain?
    console.log 'please specify a domain'
    return
  #response = yield fetch('https://www.google.com/s2/favicons?domain_url=' + domain)
  #console.log 'data:image/png;base64,' + (yield response.buffer()).toString('base64')
  #domain = yield get_canonical_domain(domain)
  favicon_data = yield get_favicon_data_for_domain(domain)
  console.log favicon_data
