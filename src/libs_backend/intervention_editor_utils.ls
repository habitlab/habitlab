{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  get_css_for_package_list
  get_requires_for_package_list
  get_requires_for_component_list
} = require 'libs_backend/require_utils'

swal = require 'sweetalert2'

get_list_requires = memoizeSingleAsync ->>
  await SystemJS.import('list_requires_multi')

get_sweetjs_utils = memoizeSingleAsync ->>
  await SystemJS.import('libs_backend/sweetjs_utils')

export compile_intervention_code = (intervention_info) ->>
  sweetjs_utils = await get_sweetjs_utils()
  code = intervention_info.code
  try
    /*
    wrapped_code = """
    var intervention = require('libs_common/intervention_info').get_intervention();
    var tab_id = require('libs_common/intervention_info').get_tab_id();
    (async function() {
      #{code}
      window.debugeval = (x) => eval(x);
    })();
    """
    */
    compiled_code = await sweetjs_utils.compile(code)
    /*
    compiled_code = """
    SystemJS.import('co').then(function(co) {
      co(function*() {
        #{compiled_code}
      })
    })
    """
    */
  catch err
    swal {
      title: 'syntax error in your code'
      text: err
      type: 'error'
    }
    return false
  intervention_info.content_scripts = [
    {
      code: compiled_code
      run_at: 'document_end'
      jspm_require: true
    }
  ]
  return true

export add_requires_to_intervention_info = (intervention_info) ->>
  code = intervention_info.code
  list_requires = await get_list_requires()
  dependencies = list_requires(code, ['require', 'require_css', 'require_style', 'require_package', 'require_component'])
  required_css_files_from_require_css = dependencies.require_css
  required_css_files_from_require_package = await get_css_for_package_list(dependencies.require_package)
  required_css_files = required_css_files_from_require_css.concat required_css_files_from_require_package
  jspm_deps_from_require = await get_requires_for_package_list(dependencies.require)
  jspm_deps_from_require_package = await get_requires_for_package_list(dependencies.require_package)
  jspm_deps_from_require_component = await get_requires_for_component_list(dependencies.require_component)
  required_jspm_deps = jspm_deps_from_require.concat jspm_deps_from_require_package.concat jspm_deps_from_require_component
  if jspm_deps_from_require_component.length > 0
    required_jspm_deps = ['enable-webcomponents-in-content-scripts'].concat required_jspm_deps
  for css_file in required_css_files_from_require_css
    try
      css_file_request = await fetch(css_file)
      css_file_text = await css_file_request.text()
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
      css_file_request = await fetch(css_file)
      css_file_text = await css_file_request.text()
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
      jspm_request = await fetch(required_jspm_path)
      jspm_text = await jspm_request.text()
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
      jspm_request = await fetch(required_jspm_path)
      jspm_text = await jspm_request.text()
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
      js_file_request = await fetch(required_component)
      js_file_text = await js_file_request.text()
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
