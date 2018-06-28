{
  get_canonical_domain
  get_canonical_url
} = require 'libs_backend/canonical_url_utils'

describe 'libs_backend/canonical_url_utils', ->
  describe 'get_canonical_url', ->
    specify 'test 1', ->>
      this.timeout 10000
      url = 'https://naver.com/'
      result = await get_canonical_url url
      result.should.equal 'https://www.naver.com/'
      return
    specify 'test 2', ->>
      this.timeout 10000
      url = 'http://skljdglkjagklasjghklsdghj.jck'
      result = await get_canonical_url url
      expect(result).to.equal null
      return
  describe 'get_canonical_domain', ->
    specify 'test 1', ->>
      this.timeout 10000
      domain = 'www.amazon.com'
      result = await get_canonical_domain(domain)
      result.should.equal 'www.amazon.com'
      return
    specify 'test 2', ->>
      this.timeout 5000
      domain = 'amazon.com'
      result = await get_canonical_domain(domain)
      result.should.equal 'www.amazon.com'
      return
    specify 'test 3', ->>
      this.timeout 10000
      domain = 'naver.com'
      result = await get_canonical_domain(domain)
      result.should.equal 'www.naver.com'
      return
    specify 'test 4', ->>
      this.timeout 10000
      domain = 'http://naver.com/asgjlsaj'
      result = await get_canonical_domain(domain)
      result.should.equal 'www.naver.com'
      return
    specify 'test 5', ->>
      this.timeout 10000
      domain = 'skljdglkjagklasjghklsdghj.jck'
      result = await get_canonical_domain(domain)
      expect(result).to.equal null
      return