skate = require 'skatejs'
$ = require 'jquery'
require 'jquery-contextmenu'

{
  load_css_file
} = require 'libs_frontend/content_script_utils'

load_css_file 'bower_components/jQuery-contextMenu/dist/jquery.contextMenu.min.css'

{
  set_intervention_disabled
  set_intervention_enabled
} = require 'libs_common/intervention_utils'

get_invisible_div = (elem) ->
  #console.log 'get_invisible_div'
  #console.log ('#' + elem.invisible_div_id)
  invisible_div = $('#' + elem.invisible_div_id)
  if invisible_div.length == 0
    invisible_div = $('<div>').attr('id', elem.invisible_div_id).css({
      'position': 'absolute'
      #'top': '50px'
      #'left': '50px'
      #'background-color': 'blue'
      #'opacity': 1.0
      opacity: 0.0
      'z-index': elem['z-index'] + 1
    })
    invisible_div.mouseover ->
      set_position_equal_to_elem(elem, invisible_div)
    invisible_div.appendTo $('body')
  #logo = $(elem.shadowRoot.querySelector('#logo'))
  #invisible_div.offset(logo.offset())
  return invisible_div

generate_random_invisible_div_id = ->
  return 'invisible_div_' + Math.floor(Math.random()*100000)

set_position_equal_to_elem = (elem, invisible_div) ->
  logo = $(elem.shadowRoot.querySelector('#habitlab_logo'))
  invisible_div.offset logo.offset()
  invisible_div.width logo.width()
  invisible_div.height logo.height()

disable_callback = (elem) ->
  console.log $('#habitlab-logo').parent()
  skate.emit elem, 'disable_intervention'
  set_intervention_disabled elem.intervention, ->
    console.log 'set_intervention_disabled complete for intervention ' + elem.intervention

skate.define 'habitlab-logo', {
  props: {
    invisible_div_id: {default: generate_random_invisible_div_id(), attribute: true}
    width: {default: '30px', attribute: true}
    height: {default: '30px', attribute: true}
    position: {default: 'absolute', attribute: true}
    top: {default: '0px', attribute: true}
    left: {default: '0px', attribute: true}
    'z-index': {default: 9999999, attribute: true}
    intervention: {default: '', attribute: true}
  }
  attached: (elem) ->
    invisible_div = get_invisible_div(elem)
    set_position_equal_to_elem(elem, invisible_div)
    console.log elem
    #setInterval ->
    #  set_position_equal_to_elem(elem, invisible_div)
    #, 1000
    $.contextMenu({
      selector: ('#' + elem.invisible_div_id),
      #appendTo: invisible_div,
      trigger: 'left',
      #callback: (key, options) ->
      #  console.log 'logo clicked'
      #  console.log 'key'
      #  console.log key
      #  console.log 'options'
      #  console.log options
      items: {
        "disable": {
          name: "Disable this intervention",
          callback: ->
            disable_callback(elem)
        },
        "info": {name: "This intervention is ____"},
      }
    })
  events: {
    'mouseover #habitlab_logo': (elem, eventObject) ->
      invisible_div = get_invisible_div(elem)
      set_position_equal_to_elem(elem, invisible_div)

    'click': (elem, eventObject) ->
      console.log 'clicked the logo'
  }

  render: (elem) !->
    #console.log 'elem is'
    #console.log elem
    #console.log elem.style
    elem_style = {
      'position': elem.position
      'top': elem.top
      'left': elem.left
      'z-index': elem['z-index']
      width: elem.width
      height: elem.width
    }
    url = chrome.extension.getURL('icons/icon_38.png')
    ``
    return (
      <img id="habitlab_logo" src={url} style={elem_style} alt="icon"></img>
    )
    ``
}
