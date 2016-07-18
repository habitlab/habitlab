window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

require 'webcomponentsjs-custom-element-v0'
require 'components/options-view.deps'
swal = require 'sweetalert' 
{load_css_file} = require 'libs_frontend/content_script_utils'
{cfy} = require 'cfy'

window.addEventListener 'WebComponentsReady', cfy ->*
  hash = window.location.hash
  if not hash? or hash == ''
    hash = '#goals'
    window.location.hash = '#goals'
  if hash.startsWith('#')
    hash = hash.substr(1)
  if hash == 'introduction'
    yield load_css_file('bower_components/sweetalert/dist/sweetalert.css')
    swal "Welcome to HabitLab!", "HabitLab is a Chrome Extension that will help prevent you from getting distracted on the web. \n\n
          You will see an icon on every intervention inserted on your page, so you can tell which page elements are from HabitLab. When an intervention is active, you can click the icon to get more information about the intervention, or easily disable it.\n\n
          In order to optimize the interventions shown to you, HabitLab needs to modify the webpages you visit and send data to our server about when you see and respond to those interventions.\n\n
          Click the info icon in the top right to see this window again. Best of luck achieving your internet goals!
          "
    console.log \intro_view
  options_view = document.querySelector('#options_view')
  options_view.set_selected_tab_by_name(hash)
  options_view.addEventListener 'options_selected_tab_changed', (evt) ->
    window.location.hash = evt.detail.selected_tab_name

  #  options_view
  return
