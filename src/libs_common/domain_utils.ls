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

module.exports = {
  url_to_domain
}
