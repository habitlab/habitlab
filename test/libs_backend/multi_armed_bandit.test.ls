require! {
  rewire
}

describe 'libs_backend/multi_armed_bandit', ->
  sandbox = null
  multi_armed_bandit = null
  expose_method = (rewired_module, func_name) !->
    func_body = rewired_module.__get__(func_name)
    rewired_module[func_name] = func_body
  beforeEach !->
    sandbox := sinon.sandbox.create()
    multi_armed_bandit := rewire('libs_backend/multi_armed_bandit')
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
    multi_armed_bandit := null
    sandbox := null
  describe 'generic tests', ->
    specify 'train_multi_armed_bandit_for_data should return a predictor', ->
      predictor = multi_armed_bandit.train_multi_armed_bandit_for_data [
        {intervention: 'a', reward: 1}
        {intervention: 'b', reward: 0}
      ], [
        'a'
        'b'
      ]
      predictor.predict.should.be.a 'function'
    specify 'get_next_intervention_to_test_for_data should return an intervention', ->
      next_intervention = multi_armed_bandit.get_next_intervention_to_test_for_data [
        {intervention: 'a', reward: 1}
        {intervention: 'b', reward: 0}
      ], [
        'a'
        'b'
      ]
      next_intervention.should.be.oneOf ['a', 'b']

    specify 'get_next_intervention_to_test_for_data should return best intervention once trained', ->
      training_data = [{intervention: 'a', reward: 1} for i from 0 til 100]
      training_data = training_data.concat [{intervention: 'b', reward: 0} for i from 0 til 100]
      next_intervention = multi_armed_bandit.get_next_intervention_to_test_for_data training_data, [
        'a'
        'b'
      ]
      next_intervention.should.equal 'a'

    specify 'get_next_intervention_to_test_for_data should return best intervention once trained with noise', ->
      training_data = [{intervention: 'a', reward: Math.random()*0.7} for i from 0 til 100]
      training_data = training_data.concat [{intervention: 'b', reward: 0.3 + Math.random()*0.7} for i from 0 til 100]
      next_intervention = multi_armed_bandit.get_next_intervention_to_test_for_data training_data, [
        'a'
        'b'
      ]
      next_intervention.should.equal 'b'
