{cfy} = require 'cfy'

{
  get_canonical_domain
  get_canonical_url
} = require 'libs_backend/canonical_url_utils'

describe 'libs_backend/canonical_url_utils', ->
  describe 'get_canonical_domain', ->
    specify 'test 1', cfy ->*
      domain = 'www.amazon.com'
      result = yield get_canonical_domain(domain)
      result.should.equal 'www.amazon.com'
      return
    specify 'test 2', cfy ->*
      domain = 'amazon.com'
      result = yield get_canonical_domain(domain)
      result.should.equal 'www.amazon.com'
      return
    specify 'test 3', cfy ->*
      domain = 'naver.com'
      result = yield get_canonical_domain(domain)
      result.should.equal 'www.naver.com'
      return
