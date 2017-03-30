{
  url_to_domain
  domain_to_url
} = require 'libs_common/domain_utils'

{cfy} = require 'cfy'

get_canonical_url_cache = {}

export get_canonical_url = (url) ->>
  if get_canonical_url_cache[url]?
    return get_canonical_url_cache[url]
  try
    response = await fetch url
    output = response.url
    if output?
      get_canonical_url_cache[url] = output
    return output
  catch
    return null

export get_canonical_domain = (domain) ->>
  url = domain_to_url domain
  canonical_url = await get_canonical_url url
  if canonical_url?
    return url_to_domain canonical_url
  return null
