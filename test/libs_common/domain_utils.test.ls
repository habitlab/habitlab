{
  url_to_domain
  get_canonical_domain
} = require 'libs_common/domain_utils'

describe 'libs_common/domain_utils', ->
  describe 'generic tests', ->
    specify 'url_to_domain test', ->
      url = 'http://www.facebook.com/sdklfj'
      domain = url_to_domain url
      domain.should.equal 'www.facebook.com'
      