fetch = require 'node-fetch'

require! {
  co
}

co ->*
  domain = process.argv[2]
  if not domain?
    console.log 'please specify a domain'
    return
  response = yield fetch('https://www.google.com/s2/favicons?domain_url=' + domain)
  console.log 'data:image/png;base64,' + (yield response.buffer()).toString('base64')
