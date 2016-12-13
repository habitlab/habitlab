{
  url_to_domain
  domain_to_url
} = require 'libs_common/domain_utils'

describe 'libs_common/domain_utils', ->
  describe 'url_to_domain', ->
    specify 'test 1', ->
      url = 'http://www.facebook.com/sdklfj'
      domain = url_to_domain url
      domain.should.equal 'www.facebook.com'
  describe 'domain_to_url', ->
    specify 'test 1', ->
      domain = 'www.facebook.com'
      url = domain_to_url domain
      url.should.equal 'http://www.facebook.com/'
