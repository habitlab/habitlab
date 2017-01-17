<- (-> it!)

window.global_exports = {}

window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

dlog = window.dlog = (...args) ->
  if localStorage.getItem('display_dlog') == 'true'
    console.log(...args)

require 'libs_common/systemjs'
co = require 'co'

co ->*

  add_url_input_if_needed = ->
    if localStorage.index_show_url_bar == 'true'
      url_input = document.createElement('input')
      url_input.style.position = 'fixed'
      url_input.style.bottom = '0px'
      url_input.style.left = '0px'
      url_input.value = window.location.href
      url_input.style.width = '100vw'
      url_input.style.backgroundColor = 'transparent'
      url_input.style.border = 'none'
      url_input.style.color = 'red'
      url_input.addEventListener 'keydown', (evt) ->
        if evt.keyCode == 13
          if url_input.value != window.location.href
            window.location.href = url_input.value
          else
            window.location.reload()
      document.body.appendChild(url_input)
    return

  window.developer_options = ->
    window.location.href = '/index.html?tag=options-dev'

  {
    getUrlParameters
  } = yield System.import 'libs_frontend/common_libs'

  use_polyfill = getUrlParameters().polyfill
  if use_polyfill and use_polyfill != 'false' and parseInt(use_polyfill) != 0
    # force the usage of polyfills
    document.registerElement = null
    yield System.import 'webcomponentsjs-custom-element-v0'

  # this script must run before Polymer is imported
  window.Polymer = {
    dom: 'shady',
    #dom: 'shadow',
    lazyRegister: true,
  }

  js-yaml = yield System.import 'js-yaml'
  {cfy} = yield System.import 'cfy'
  {get_interventions} = yield System.import 'libs_backend/intervention_utils'

  /*
  export getUrlParameters = ->
    url = window.location.href
    hash = url.lastIndexOf('#')
    if hash != -1
      url = url.slice(0, hash)
    map = {}
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) ->
      #map[key] = decodeURI(value).split('+').join(' ').split('%2C').join(',') # for whatever reason this seems necessary?
      map[key] = decodeURIComponent(value).split('+').join(' ') # for whatever reason this seems necessary?
    )
    return map
  */

  set_nested_property = (tag, property_name, property_value) ->
    dot_index = property_name.indexOf('.')
    if dot_index == -1
      tag[property_name] = property_value
      return
    property_name_start = property_name.substr(0, dot_index)
    property_name_remainder = property_name.substr(dot_index + 1)
    set_nested_property tag[property_name_start], property_name_remainder, property_value

  start_page_index = cfy ->*
    interventions = yield get_interventions()
    window.intervention = interventions['debug/fake_intervention']
    params = getUrlParameters()
    tagname = params.tag
    {index_body_width, index_body_height} = params
    if not tagname?
      tagname = 'debug-view'
    yield System.import('components/' + tagname + '.jspm')
    #yield System.import('components/components.jspm')
    #require 'components/components.deps'
    tag = document.createElement(tagname)
    num_properties = 0
    for k,v of params
      if k == 'tag' or k == 'index_body_width' or k == 'index_body_height'
        continue
      v = js-yaml.safeLoad(v)
      set_nested_property tag, k, v
      num_properties += 1
      #if k.startsWith('style.')
      #  tag.customStyle[k.replace('style.', '')] = v
      #  continue
      #if k.startsWith('customStyle.')
      #  tag.customStyle[k.replace('customStyle.', '')] = v
      #  continue
      #  #tag.updateStyles() or Polymer.updateStyles() doesn't seem to be necessary
      #tag[k] = v
    if num_properties == 0
      tag.isdemo = true
    document.getElementById('index_contents').appendChild(tag)
    index_body = document.getElementById('index_body')
    if index_body_width?
      index_body.style.width = index_body_width
    if index_body_height
      index_body.style.height = index_body_height
    add_url_input_if_needed()
    return

  start_page_index()

  # systemjs_require <- System.import('libs_common/systemjs_require').then()
  # drequire <- systemjs_require.make_require_frontend().then()
  # window.require = drequire
  window.uselib = (libname, callback) ->
    if typeof(callback) == 'function'
      System.import(libname).then(callback)
    else if typeof(callback) == 'string'
      System.import(libname).then (imported_lib) ->
        window[callback] = imported_lib
        console.log('imported as window.' + callback)
    else if typeof(libname) == 'string'
      callback = libname.toLowerCase().split('').filter((x) -> 'abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(x) != -1).join('')
      System.import(libname).then (imported_lib) ->
        window[callback] = imported_lib
        console.log('imported as window.' + callback)
    else
      console.log([
        'Use uselib() to import jspm libraries.'
        'The first argument is the library name (under SystemJS, see jspm)'
        'The second argument is the name it should be given (in the \'window\' object)'
        'Example of using moment:'
        '    uselib(\'moment\', \'moment\')'
        '    window.moment().format()'
        'Example of using jquery:'
        '    uselib(\'jquery\', \'$\')'
        '    window.$(\'body\').css(\'background-color\', \'black\')'
        'Example of using sweetalert2:'
        '    uselib(\'libs_common/content_script_utils\', \'content_script_utils\')'
        '    content_script_utils.load_css_file(\'bower_components/sweetalert2/dist/sweetalert2.css\')'
        '    uselib(\'sweetalert2\', \'swal\')'
        '    swal(\'hello world\')'
      ].join('\n'))

  yield System.import 'libs_common/global_exports_post'
