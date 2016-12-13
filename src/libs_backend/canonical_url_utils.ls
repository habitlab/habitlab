{
  url_to_domain
  domain_to_url
} = require 'libs_common/domain_utils'

{cfy} = require 'cfy'

export get_canonical_url = cfy (url) ->*
  try
    response = yield fetch url
    return response.url
  catch
    return null

export get_canonical_domain = cfy (domain) ->*
  url = domain_to_url domain
  canonical_url = yield get_canonical_url url
  if canonical_url?
    return url_to_domain canonical_url
  return null
