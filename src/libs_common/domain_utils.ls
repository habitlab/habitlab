{
  gexport
  gexport_module
} = require 'libs_common/gexport'

# export url_to_domain = (url) ->
#   # http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
#   # find & remove protocol (http, ftp, etc.) and get domain
#   if url.indexOf("://") > -1
#     domain = url.split('/')[2]
#   else
#     domain = url.split('/')[0]
#   # find & remove port number
#   domain = domain.split(':')[0]
#   return domain

export url_to_domain = (url) ->
  # http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
  # find & remove protocol (http, ftp, etc.) and get domain
  if url.indexOf("://") > -1
    domain = url.split('/')[2]
  else
    domain = url.split('/')[0]
  # find & remove port number
  #domain = domain.split(':')[0]
  return domain

export domain_to_url = (domain) ->
  return "http://" + url_to_domain(domain) + '/'

# converts a url string to just the domain name, ex: https://www.example.com -> example
/*export url_to_domain_name = (url) ->
  first_period = null;
  second_period = null;

  index = 0;
  forwardslash_counter = 0;
  for char in url
    #console.log(url.substring(0, first_period) + '|' + url.substring(first_period, second_period) + '|' + url.substring(second_period))
    if char === '.'
      if period_counter == 3
      
      if first_period != -1
        first_period = second_period
      else
        first_period = index
    
      second_period = index

    # stop counting after the TLD
    if char === '/'
      forwardslash_counter++

      # 3 /'s means past domain
      if (forwardslash_counter == 3 or char === '?') and second_period?
        second_period = index
        break

    # if there was no subdomain and no route
    if index == url.length - 1 and second_period?
      second_period = index

    index++
  
  return url.substring(first_period, second_period)*/

gexport_module 'domain_utils', -> eval(it)