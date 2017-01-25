{cfy} = require 'cfy'

package_name_to_css = {
  sweetalert2: 'bower_components/sweetalert2/dist/sweetalert2.css'
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

export get_npm_for_package_list = cfy (packages) ->*
  output = []
  for package_name in packages
    if package_aliases[package_name]?
      package_name = package_aliases[package_name]
    output.push package_name
  return output
