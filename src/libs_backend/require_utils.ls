{cfy} = require 'cfy'

package_name_to_css = {
  sweetalert2: 'bower_components/sweetalert2/dist/sweetalert2.css'
  'jquery.terminal': 'node_modules_custom/jquery.terminal/css/jquery.terminal.min.css'
}

package_name_to_css_list = {
}

package_aliases = {
  sweetalert: 'sweetalert2'
  swal: 'sweetalert2'
}

export get_css_for_package_list = cfy (packages) ->*
  output = []
  for package_name in packages
    if package_aliases[package_name]?
      package_name = package_aliases[package_name]
    if package_name_to_css[package_name]?
      output.push package_name_to_css[package_name]
    if package_name_to_css_list[package_name]?
      for css_file in package_name_to_css_list[package_name]
        output.push css_file
  return output

export get_requires_for_package_list = cfy (packages) ->*
  output = []
  for package_name in packages
    if package_aliases[package_name]?
      package_name = package_aliases[package_name]
    #else if package_name.endsWith('.deps')
    #  package_name = package_name.substr(0, package_name.length - 5) + '.jspm'
    #else if package_name.endsWith('.deps.js')
    #  package_name = package_name.substr(0, package_name.length - 8) + '.jspm.js'
    output.push package_name
  return output

export get_requires_for_component_list = cfy (components) ->*
  output = []
  for component in components
    try
      #component_path = "/bower_components/#{component}/#{component}.jspm.js"
      component_path = "/bower_components/#{component}/#{component}.deps.js"
      component_request = yield fetch(component_path)
      component_html = yield component_request.text()
    catch
      try
        #component_path = "components/#{component}.jspm.js"
        component_path = "components/#{component}.deps.js"
        component_request = yield fetch(component_path)
        component_html = yield component_request.text()
      catch
        component_path = component
    output.push component_path
  #console.log output
  return output
