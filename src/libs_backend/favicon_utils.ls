#fetch_favicon = require 'fetch-favicon'

{
  domain_to_url
} = require 'libs_common/domain_utils'

{
  get_canonical_domain
  get_canonical_url
} = require 'libs_backend/canonical_url_utils'

require! {
  localforage
}

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  unique
} = require 'libs_common/array_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

get_jimp = memoizeSingleAsync ->>
  await SystemJS.import('jimp')

get_cheerio = memoizeSingleAsync ->>
  await SystemJS.import('cheerio')

get_icojs = memoizeSingleAsync ->>
  await SystemJS.import('icojs')

favicon_patterns_href = [
  'link[rel=apple-touch-icon-precomposed]'
  'link[rel=apple-touch-icon]'
  'link[rel="shortcut icon"]'
  'link[rel="Shortcut Icon"]'
  'link[rel=icon]'
]

#favicon_patterns_content = [
#  'meta[name=msapplication-TileImage]',
#  'meta[name=twitter\\:image]',
#  'meta[property=og\\:image]'
#]

localforage_store_iconcache = null
get_store_iconcache = ->
  if not localforage_store_iconcache?
    localforage_store_iconcache := localforage.createInstance({name: 'iconcache'})
  return localforage_store_iconcache

domain_to_favicons_cache = {}

export fetchFavicons = (domain) ->>
  domain = domain_to_url domain
  if domain_to_favicons_cache[domain]?
    return domain_to_favicons_cache[domain]
  response = await fetch domain
  text = await response.text()
  cheerio = await get_cheerio()
  $ = cheerio.load(text)
  output = []
  for pattern in favicon_patterns_href
    for x in $(pattern)
      url = $(x).attr('href')
      if url? and url.trim?
        output.push url.trim()
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
  output = unique output
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

does_file_exist = (url) ->>
  if typeof(url) != 'string' and typeof(url.href) == 'string'
    url = url.href
  if does_file_exist_cached[url]?
    return does_file_exist_cached[url]
  try
    request = await fetch url
    if not request.ok
      return false
    await request.text()
    does_file_exist_cached[url] = true
    return true
  catch
    does_file_exist_cached[url] = false
    return false

async_filter = (list, async_function) ->>
  output = []
  for x in list
    if (await async_function(x))
      output.push x
  return output

arrayBufferToBase64 = (buffer) ->
  binary = ''
  bytes = new Uint8Array(buffer)
  len = bytes.byteLength
  for i from 0 til len
    binary += String.fromCharCode(bytes[i])
  return window.btoa(binary)

favicon_domain_icojs_blacklist = {
  'news.ycombinator.com'
}

favicon_domain_jimp_blacklist = {}

export get_favicon_data_for_url = (domain) ->>
  icojs_convert = false
  #icojs_convert = true
  #if favicon_domain_icojs_blacklist[domain]?
  #  icojs_convert = false
  if domain.endsWith('.ico')
    favicon_path = domain
  else
    if not (domain.startsWith('http://') or domain.startsWith('https://') or domain.startsWith('//'))
      domain = 'https://' + domain
    else if domain.startsWith('//')
      domain = 'https:' + domain
    all_favicon_paths = await fetch_favicon.fetchFavicons(domain)
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
      new_all_favicon_paths = await async_filter(all_favicon_paths, filter_function)
      if new_all_favicon_paths.length > 0
        all_favicon_paths = new_all_favicon_paths
    favicon_path = await get_canonical_url(all_favicon_paths[0].href)
  if not favicon_path? or favicon_path.length == 0
    throw new Error('no favicon path found')
  try
    favicon_response = await fetch(favicon_path)
    favicon_buffer = await favicon_response.arrayBuffer();
    if icojs_convert
      #favicon_buffer = new Uint8Array(await favicon_response.buffer()).buffer
      icojs = await get_icojs()
      favicon_ico_parsed = await icojs.parse(favicon_buffer, 'image/png')
      favicon_png_buffer = toBuffer(favicon_ico_parsed[0].buffer)
      return 'data:image/png;base64,' + favicon_png_buffer.toString('base64')
    else
      favicon_ico_base64 = arrayBufferToBase64(favicon_buffer)
      return 'data:image/png;base64,' + favicon_ico_base64
      #return 'data:image/x-icon;base64,' + favicon_ico_base64
  catch
  try
    jimp = await get_jimp()
    favicon_data = await jimp.read(favicon_path)
    favicon_data.resize(40, 40)
    return await new Promise -> favicon_data.getBase64('image/png', it)
  catch
  return

export get_png_data_for_url = (domain) ->>
  jimp_convert = false
  #jimp_convert = true
  #if favicon_domain_jimp_blacklist[domain]?
  #  jimp_convert = false
  if domain.endsWith('.png') or domain.endsWith('.svg') or domain.endsWith('.ico')
    favicon_path = domain
  else
    if not (domain.startsWith('http://') or domain.startsWith('https://') or domain.startsWith('//'))
      domain = 'https://' + domain
    else if domain.startsWith('//')
      domain = 'https:' + domain
    all_favicon_paths = await fetch_favicon.fetchFavicons(domain)
    filter_functions = [
      does_file_exist
    ]
    filter_functions = filter_functions.concat ([
      -> it.href.includes('icon')
      -> it.href.endsWith('.png')
      -> it.href.includes('.png')
    ].map(make_async))
    for filter_function in filter_functions
      new_all_favicon_paths = await async_filter(all_favicon_paths, filter_function)
      if new_all_favicon_paths.length > 0
        all_favicon_paths = new_all_favicon_paths
    favicon_path = await get_canonical_url(all_favicon_paths[0].href)
  try
    if jimp_convert
      jimp = await get_jimp()
      favicon_data = await jimp.read(favicon_path)
      favicon_data.resize(40, 40)
      return await new Promise -> favicon_data.getBase64('image/png', it)
    else
      favicon_response = await fetch(favicon_path)
      favicon_buffer = await favicon_response.arrayBuffer()
      favicon_ico_base64 = arrayBufferToBase64(favicon_buffer)
      return 'data:image/png;base64,' + favicon_ico_base64
  catch
  return

export remove_cached_favicon_for_domain = (domain) ->>
  store = get_store_iconcache()
  await store.removeItem(domain)
  return

export get_favicon_data_for_domain_cached = (domain) ->>
  if not domain?
    return
  store = get_store_iconcache()
  res = await store.getItem(domain)
  if res?
    return res
  res = await get_favicon_data_for_domain(domain)
  if res?
    await store.setItem(domain, res)
  return res

export get_favicon_data_for_domain = (domain) ->>
  try
    output = await get_png_data_for_url(domain)
  catch
  if output?
    return output
  canonical_domain = await get_canonical_domain(domain)
  if domain != canonical_domain
    try
      output = await get_png_data_for_url(canonical_domain)
    catch
    if output?
      return output
  try
    output = await get_favicon_data_for_url(domain)
  catch
  if output?
    return output
  if domain != canonical_domain
    try
      output = await get_favicon_data_for_url(canonical_domain)
    catch
    if output?
      return output
  return

export get_favicon_data_for_domains_bulk = (domain_list) ->>
  output = {}
  favicon_promises_list = []
  for domain in domain_list
    favicon_promises_list.push get_favicon_data_for_domain(domain)
  favicon_list = await Promise.all(favicon_promises_list)
  for domain,idx in domain_list
    favicon = favicon_list[idx]
    output[domain] = favicon
  return output

gexport_module 'favicon_utils', -> eval(it)
