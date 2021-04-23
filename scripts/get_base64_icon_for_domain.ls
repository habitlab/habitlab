fetch = require 'node-fetch'
#fetch_favicon = require 'fetch-favicon'

require! {
  co
  cfy
  jimp
  icojs
  cheerio
  path
}

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
  return "https://" + url_to_domain(domain) + '/'

favicon_patterns_href = [
  'link[rel=apple-touch-icon-precomposed]',
  'link[rel=apple-touch-icon]',
  'link[rel="shortcut icon"]',
  'link[rel=icon]',
]

#favicon_patterns_content = [
#  'meta[name=msapplication-TileImage]',
#  'meta[name=twitter\\:image]',
#  'meta[property=og\\:image]'
#]

domain_to_favicons_cache = {}

export fetchFavicons = cfy (domain) ->*
  domain = domain_to_url domain
  if domain_to_favicons_cache[domain]?
    return domain_to_favicons_cache[domain]
  response = yield fetch domain
  text = yield response.text()
  $ = cheerio.load(text)
  output = []
  for pattern in favicon_patterns_href
    for x in $(pattern)
      url = $(x).attr('href')
      if url?
        output.push url
  #for pattern in favicon_patterns_content
  #  for x in $(pattern)
  #    url = $(x).attr('content')
  #    if url?
  #      output.push url
  output.push '/favicon.ico'
  output = output.map (x) ->
    if x.startsWith('http://') or x.startsWith('https://')
      return x
    if x.startsWith('//')
      return 'https:' + x
    domain_without_slash = domain
    if domain.endsWith('/') and x.startsWith('/')
      domain_without_slash = domain.substr(0, domain.length - 1)
    return domain_without_slash + x
  output = output.map -> {href: it, name: 'favicon.ico'}
  domain_to_favicons_cache[domain] = output
  return output

fetch_favicon = {fetchFavicons}

toBuffer = (ab) ->
  buf = new Buffer(ab.byteLength);
  view = new Uint8Array(ab);
  for i from 0 til buf.length
    buf[i] = view[i]
  return buf

make_async = (sync_func) ->
  return (x) -> Promise.resolve(sync_func(x))

does_file_exist_cached = {}

does_file_exist = cfy (url) ->*
  if typeof(url) != 'string' and typeof(url.href) == 'string'
    url = url.href
  if does_file_exist_cached[url]?
    return does_file_exist_cached[url]
  try
    request = yield fetch url
    if not request.ok
      return false
    yield request.text()
    does_file_exist_cached[url] = true
    return true
  catch
    does_file_exist_cached[url] = false
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
    if not (domain.startsWith('http://') or domain.startsWith('https://') or domain.startsWith('//'))
      domain = 'https://' + domain
    else if domain.startsWith('//')
      domain = 'https:' + domain
    all_favicon_paths = yield fetch_favicon.fetchFavicons(domain)
    filter_functions = [
      does_file_exist
    ]
    filter_functions = filter_functions.concat ([
      -> (it.name == 'favicon.ico')
      -> it.href.endsWith('favicon.ico')
      -> it.href.startsWith('favicon.ico')
      -> it.href.includes('favicon.ico')
      -> it.href.endsWith('.ico')
      -> it.href.includes('favicon')
    ].map(make_async))
    for filter_function in filter_functions
      new_all_favicon_paths = yield async_filter(all_favicon_paths, filter_function)
      if new_all_favicon_paths.length > 0
        all_favicon_paths = new_all_favicon_paths
    favicon_path = yield get_canonical_url(all_favicon_paths[0].href)
  if not favicon_path? or favicon_path.length == 0
    throw new Error('no favicon path found')
  try
    favicon_response = yield fetch(favicon_path)
    #favicon_buffer = new Uint8Array(yield favicon_response.buffer()).buffer
    favicon_buffer = new Uint8Array(yield favicon_response.buffer()).buffer
    favicon_ico_parsed = yield icojs.parse(favicon_buffer)
    favicon_png_buffer = toBuffer(favicon_ico_parsed[0].buffer)
    return 'data:image/png;base64,' + favicon_png_buffer.toString('base64')
  catch
    favicon_data = yield jimp.read(favicon_path)
    favicon_data.resize(40, 40)
    return yield -> favicon_data.getBase64('image/png', it)

get_png_data_for_url = cfy (domain) ->*
  if domain.endsWith('.png') or domain.endsWith('.svg') or domain.endsWith('.ico')
    favicon_path = domain
  else
    if not (domain.startsWith('http://') or domain.startsWith('https://') or domain.startsWith('//'))
      domain = 'https://' + domain
    else if domain.startsWith('//')
      domain = 'https:' + domain
    all_favicon_paths = yield fetch_favicon.fetchFavicons(domain)
    filter_functions = [
      does_file_exist
    ]
    filter_functions = filter_functions.concat ([
      -> it.href.includes('icon')
      -> it.href.endsWith('.png')
      -> it.href.includes('.png')
    ].map(make_async))
    for filter_function in filter_functions
      new_all_favicon_paths = yield async_filter(all_favicon_paths, filter_function)
      if new_all_favicon_paths.length > 0
        all_favicon_paths = new_all_favicon_paths
    favicon_path = yield get_canonical_url(all_favicon_paths[0].href)
  favicon_data = yield jimp.read(favicon_path)
  favicon_data.resize(40, 40)
  return yield -> favicon_data.getBase64('image/png', it)

export get_favicon_data_for_domain = cfy (domain) ->*
  try
    return yield get_png_data_for_url(domain)
  catch
  canonical_domain = yield get_canonical_domain(domain)
  try
    return yield get_png_data_for_url(canonical_domain)
  catch
  try
    return yield get_favicon_data_for_url(domain)
  catch
  return yield get_favicon_data_for_url(canonical_domain)

export get_favicon_data_for_domain_or_null = cfy (domain) ->*
  try
    return yield get_favicon_data_for_domain(domain)
  catch
  return

co ->*
  domain = process.argv[2]
  if not domain?
    console.log 'please specify a domain'
    return
  if domain.startsWith('/') or domain.startsWith('./') # is a file path
    favicon_path = path.resolve domain
    try
      favicon_data = yield jimp.read(favicon_path)
      favicon_data.resize(40, 40)
      console.log yield -> favicon_data.getBase64('image/png', it)
      return
    catch
      favicon_response = yield fetch(favicon_path)
      #favicon_buffer = new Uint8Array(yield favicon_response.buffer()).buffer
      favicon_buffer = new Uint8Array(yield favicon_response.buffer()).buffer
      favicon_ico_parsed = yield icojs.parse(favicon_buffer)
      favicon_png_buffer = toBuffer(favicon_ico_parsed[0].buffer)
      console.log 'data:image/png;base64,' + favicon_png_buffer.toString('base64')
      return
  #response = yield fetch('https://www.google.com/s2/favicons?domain_url=' + domain)
  #console.log 'data:image/png;base64,' + (yield response.buffer()).toString('base64')
  #domain = yield get_canonical_domain(domain)
  favicon_data = yield get_favicon_data_for_domain(domain)
  console.log favicon_data
