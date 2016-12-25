{cfy} = require 'cfy'

{
  get_canonical_domain
  get_canonical_url
} = require 'libs_backend/canonical_url_utils'

describe 'libs_backend/canonical_url_utils', ->
  describe 'get_canonical_url', ->
    specify 'test 1', cfy ->*
      this.timeout 10000
      url = 'http://naver.com/'
      result = yield get_canonical_url url
      result.should.equal 'http://www.naver.com/'
      return
    specify 'test 2', cfy ->*
      this.timeout 10000
      url = 'http://skljdglkjagklasjghklsdghj.jck'
      result = yield get_canonical_url url
      expect(result).to.equal null
      return
  describe 'get_canonical_domain', ->
    specify 'test 1', cfy ->*
      this.timeout 10000
      domain = 'www.amazon.com'
      result = yield get_canonical_domain(domain)
      result.should.equal 'www.amazon.com'
      return
    specify 'test 2', cfy ->*
      this.timeout 5000
      domain = 'amazon.com'
      result = yield get_canonical_domain(domain)
      result.should.equal 'www.amazon.com'
      return
    specify 'test 3', cfy ->*
      this.timeout 10000
      domain = 'naver.com'
      result = yield get_canonical_domain(domain)
      result.should.equal 'www.naver.com'
      return
    specify 'test 4', cfy ->*
      this.timeout 10000
      domain = 'http://naver.com/asgjlsaj'
      result = yield get_canonical_domain(domain)
      result.should.equal 'www.naver.com'
      return
    specify 'test 5', cfy ->*
      this.timeout 10000
      domain = 'skljdglkjagklasjghklsdghj.jck'
      result = yield get_canonical_domain(domain)
      expect(result).to.equal null
      return