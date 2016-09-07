console.log 'jspm example running'

require 'libs_common/systemjs'

systemjs_require <- System.import('libs_common/systemjs_require').then()
require <- systemjs_require.make_require_frontend().then()
