console.log 'custom intervention running'

require 'libs_common/systemjs'

require! list_requires

intervention_info <- System.import('libs_common/intervention_info').then()
intervention_info.set_intervention(intervention)

do ->
  require! 'js-yaml'
  if not intervention.params.params.value? or intervention.params.params.value.length == 0
    return
  for k,v of js-yaml.safeLoad(intervention.params.params.value)
    intervention.params[k] = {value: v}

javascript_code = intervention.params.code.value
if intervention.params.livescript.value
  LiveScript = require 'livescript15'
  console.log 'compiled with livescript'
  javascript_code = LiveScript.compile javascript_code, {bare: true, header: false}
  console.log javascript_code

systemjs_require <- System.import('libs_common/systemjs_require').then()
console.log 'requires are'
console.log list_requires(javascript_code)
require <- systemjs_require.make_require(list_requires(javascript_code)).then()

console.log 'starting eval in custom intervention'
eval(javascript_code)
console.log 'finishing eval in custom intervention'
