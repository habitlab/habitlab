require! {
  rewire
}

paper_button_html = require('html!./dom_utils_test_files/paper-button.html')
paper_slider_html = require('html!./dom_utils_test_files/paper-slider.html')

describe 'libs_frontend/dom-utils', ->
  sandbox = null
  dom_utils = null
  expose_method = (rewired_module, func_name) !->
    func_body = rewired_module.__get__(func_name)
    rewired_module[func_name] = func_body
  beforeEach !->
    sandbox := sinon.sandbox.create()
    dom_utils := rewire('libs_frontend/dom_utils')
    sandbox.spy_rewire = (rewired_module, func_name) ->
      spy = sandbox.spy(rewired_module, func_name)
      rewired_module.__set__(func_name, spy)
      return spy
    sandbox.spy_internal = (rewired_module, func_name) ->
      func_body = rewired_module.__get__(func_name)
      tmp_obj = {'func_body': func_body}
      spy = sandbox.spy(tmp_obj, 'func_body')
      rewired_module.__set__(func_name, spy)
      return spy
  afterEach !->
    sandbox.restore()
    dom_utils := null
    sandbox := null
  describe 'generic tests', ->
    specify '3 should equal 3', ->
      3.should.equal(3)
  describe 'parseHTML', ->
    specify 'document.implementation.createHTMLDocument() called', ->
      expose_method(dom_utils, 'parseHTML')
      result = dom_utils.parseHTML('<div>hello world</div>')
      result.length.should.equal(1)
      result[0].tagName.should.equal('DIV')
      result[0].innerHTML.should.equal('hello world')
    specify 'test that stubbing works', ->
      expose_method(dom_utils, 'parseHTML')
      sandbox.stub dom_utils, 'parseHTML', ->
        return 'foo'
      result = dom_utils.parseHTML('<div>hello world</div>')
      result.should.equal('foo')
    specify 'test that spying works', ->
      expose_method(dom_utils, 'parseHTML')
      spy = sandbox.spy_rewire dom_utils, 'parseHTML'
      result = dom_utils.parseHTML('<div>hello world</div>')
      spy.callCount.should.equal(1)
  describe 'import_dom_modules', ->
    specify 'no dom module calls on non-dom module', ->
      expose_method(dom_utils, 'recreateDomModule')
      spy = sandbox.spy_rewire dom_utils, 'recreateDomModule'
      result = dom_utils.import_dom_modules('<div>hello world</div>')
      spy.callCount.should.equal(0)
    specify 'test that spy_rewire works', ->
      spy = sandbox.spy_internal dom_utils, 'recreateDomModule'
      result = dom_utils.import_dom_modules('<dom-module id="foodom"></dom-module>')
      spy.callCount.should.equal(1)
    specify 'test that spy_rewire works 2', ->
      spy = sandbox.spy_internal dom_utils, 'recreateDomModule'
      result = dom_utils.import_dom_modules('<dom-module id="foodom"></dom-module><dom-module id="foodom2"></dom-module>')
      spy.callCount.should.equal(2)
    specify 'works if wrapped in html and body', ->
      spy = sandbox.spy_internal dom_utils, 'recreateDomModule'
      result = dom_utils.import_dom_modules('<html><body><dom-module id="foodom"></dom-module></body></html>')
      spy.callCount.should.equal(1)
    specify 'paper-button dom-module imported', ->
      spy = sandbox.spy_internal dom_utils, 'recreateDomModule'
      result = dom_utils.import_dom_modules(paper_button_html)
      spy.callCount.should.equal(1)
    specify 'paper-slider dom-module imported', ->
      spy = sandbox.spy_internal dom_utils, 'recreateDomModule'
      result = dom_utils.import_dom_modules(paper_slider_html)
      spy.callCount.should.equal(1)
