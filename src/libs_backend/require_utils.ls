package_name_to_css = {
  sweetalert2: 'bower_components/sweetalert2/dist/sweetalert2.css'
  'jquery.terminal': 'modules_custom/jquery.terminal/css/jquery.terminal.min.css'
}

package_name_to_css_list = {
}

package_aliases = {
  sweetalert: 'sweetalert2'
  swal: 'sweetalert2'
}

export get_css_for_package_list = (packages) ->>
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

export get_requires_for_package_list = (packages) ->>
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

extra_file_list_cached_list = null
extra_file_list_cached_dict = null

get_extra_files_cached_list = ->>
  if extra_file_list_cached_list?
    return extra_file_list_cached_list
  extra_file_list_cached_list := await fetch('/extra_file_list.json').then (.json!)
  return extra_file_list_cached_list

get_extra_files_cached_dict = ->>
  if extra_file_list_cached_dict?
    return extra_file_list_cached_dict
  newdict = {}
  extra_file_list = await get_extra_files_cached_list()
  for x in extra_file_list
    newdict[x] = true
  extra_file_list_cached_dict := newdict

export does_extra_file_exist = (filepath) ->>
  extra_files_dict = await get_extra_files_cached_dict()
  return extra_files_dict[filepath] == true

export get_path_for_file = (filename) ->>
  extra_files_list = await get_extra_files_cached_list()
  for filepath in extra_files_list
    if filepath.endsWith('/' + filename)
      return filepath
  return null

export get_requires_for_component_list = (components) ->>
  output = []
  for component in components
    component_path = "bower_components/#{component}/#{component}.deps.js"
    if (await does_extra_file_exist(component_path))
      output.push(component_path)
      continue
    component_path = "components/#{component}.deps.js"
    if (await does_extra_file_exist(component_path))
      output.push(component_path)
      continue
    component_path = await get_path_for_file("#{component}.deps.js")
    if component_path?
      output.push(component_path)
  return output

export get_components_to_require_statements = (components) ->>
  output = {}
  for component in components
    component_path = "bower_components/#{component}/#{component}.deps.js"
    if (await does_extra_file_exist(component_path))
      output[component] = component_path
      continue
    component_path = "components/#{component}.deps.js"
    if (await does_extra_file_exist(component_path))
      output[component] = component_path
      continue
    component_path = await get_path_for_file("#{component}.deps.js")
    if component_path?
      output[component] = component_path
  return output
