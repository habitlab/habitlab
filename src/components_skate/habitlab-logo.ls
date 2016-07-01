skate = require 'skatejs'
$ = require 'jquery'
require 'jquery-contextmenu'

{
  load_css_file
} = require 'libs_frontend/content_script_utils'

load_css_file 'bower_components/jQuery-contextMenu/dist/jquery.contextMenu.min.css'

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

skate.define 'habitlab-logo', {
  props: {
    invisible_div_id: {default: generate_random_invisible_div_id(), attribute: true}
    width: {default: '38px', attribute: true}
    height: {default: '38px', attribute: true}
    position: {default: 'absolute', attribute: true}
    top: {default: '0px', attribute: true}
    left: {default: '0px', attribute: true}
    'z-index': {default: 9999999, attribute:true}
  }
  attached: (elem) ->
    invisible_div = get_invisible_div(elem)
    set_position_equal_to_elem(elem, invisible_div)
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
        "edit": {name: "Edit", icon: "edit"},
        "cut": {name: "Cut", icon: "cut"},
        "copy": {name: "Copy", icon: "copy"},
        "paste": {name: "Paste", icon: "paste"},
        "delete": {name: "Delete", icon: "delete"},
        "sep1": "---------",
        "quit": {name: "Quit", icon: ($element, key, item) -> 'context-menu-icon context-menu-icon-quit' }
      }
    })
  events: {
    'mouseover #habitlab_logo': (elem, eventObject) ->
      invisible_div = get_invisible_div(elem)
      set_position_equal_to_elem(elem, invisible_div)
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
