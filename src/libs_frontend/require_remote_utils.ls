{remoteget} = require 'libs_frontend/cacheget_utils'

export add_remote_library_async = (libname, url) ->>
  library_contents = await remoteget url
  libname_mapping = {}
  libname_mapping[libname] = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(library_contents)))
  SystemJS.config({map: libname_mapping})
  return

hash_string = (s) ->
  hash = 0
  i = 0
  char = 0
  l = s.length
  if l == 0
    return hash
  while i < l
    char = s.charCodeAt(i)
    hash = (hash .<<. 5) - hash + char
    hash = hash .|. 0
    # Convert to 32bit integer
    i += 1
  return hash

hash_string_to_libname = (s) ->
  hash = hash_string s
  return ['abcdefghij'[parseInt(x)] for x in hash.toString()].join('')

export require_remote_async = (url) ->>
  if not url.includes('://')
    url = 'https://unpkg.com/' + url
  libname = hash_string_to_libname(url)
  #if not SystemJS.getConfig().map[libname]?
  #  await add_remote_library_async(libname, url)
  await add_remote_library_async(libname, url)
  return await SystemJS.import(libname)

