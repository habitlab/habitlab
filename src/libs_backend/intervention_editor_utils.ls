{cfy} = require 'cfy'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  get_css_for_package_list
  get_requires_for_package_list
  get_requires_for_component_list
} = require 'libs_backend/require_utils'

swal = require 'sweetalert2'

get_list_requires = memoizeSingleAsync cfy ->*
  yield SystemJS.import('list_requires_multi')

export add_requires_to_intervention_info = cfy (intervention_info, code) ->*
  list_requires = yield get_list_requires()
  dependencies = list_requires(code, ['require', 'require_css', 'require_style', 'require_package', 'require_component'])
  required_css_files_from_require_css = dependencies.require_css
  required_css_files_from_require_package = yield get_css_for_package_list(dependencies.require_package)
  required_css_files = required_css_files_from_require_css.concat required_css_files_from_require_package
  jspm_deps_from_require = yield get_requires_for_package_list(dependencies.require)
  jspm_deps_from_require_package = yield get_requires_for_package_list(dependencies.require_package)
  jspm_deps_from_require_component = yield get_requires_for_component_list(dependencies.require_component)
  required_jspm_deps = jspm_deps_from_require.concat jspm_deps_from_require_package.concat jspm_deps_from_require_component
  if jspm_deps_from_require_component.length > 0
    required_jspm_deps = ['enable-webcomponents-in-content-scripts'].concat required_jspm_deps
  for css_file in required_css_files_from_require_css
    try
      css_file_request = yield fetch(css_file)
      css_file_text = yield css_file_request.text()
    catch
      swal {
        title: 'missing css file'
        html: css_file + '''<br>
        check your require_css statements
        '''
      }
      return false
  for css_file in required_css_files_from_require_package
    try
      css_file_request = yield fetch(css_file)
      css_file_text = yield css_file_request.text()
    catch
      swal {
        title: 'missing css file'
        html: css_file + '''<br>
        check your require_package statements
        '''
      }
      return false
  available_libs = SystemJS.getConfig().map
  for required_jspm_dep in jspm_deps_from_require
    if available_libs[required_jspm_dep]?
      continue
    try
      required_jspm_path = required_jspm_dep
      if not required_jspm_path.endsWith('.js')
        required_jspm_path = required_jspm_path + '.js'
      console.log required_jspm_dep
      jspm_request = yield fetch(required_jspm_path)
      jspm_text = yield jspm_request.text()
    catch e
      console.log e
      swal {
        title: 'missing jspm package'
        html: required_jspm_dep + '''<br>
        check your require statements
        '''
      }
      return false
  for required_jspm_dep in jspm_deps_from_require_package
    if available_libs[required_jspm_dep]?
      continue
    try
      required_jspm_path = required_jspm_dep
      if not required_jspm_path.endsWith('.js')
        required_jspm_path = required_jspm_path + '.js'
      console.log required_jspm_dep
      jspm_request = yield fetch(required_jspm_path)
      jspm_text = yield jspm_request.text()
    catch e
      console.log e
      swal {
        title: 'missing jspm package'
        html: required_jspm_dep + '''<br>
        check your require_package statements
        '''
      }
      return false
  for required_component in jspm_deps_from_require_component
    try
      js_file_request = yield fetch(required_component)
      js_file_text = yield js_file_request.text()
    catch e
      console.log e
      swal {
        title: 'missing component'
        html: required_component + '''<br>
        check your require_component statements
        '''
      }
      return false
  intervention_info.css_files = required_css_files
  intervention_info.styles = dependencies.require_style
  for content_script in intervention_info.content_scripts
    content_script.jspm_deps = required_jspm_deps
  return true
