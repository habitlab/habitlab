skate = require 'skatejs'

skate.define 'habitlab-logo', {
  props: {

  }
  render: (elem) !->
    elem_style = {
      'position': 'absolute',
      'top': '3px',
      'left': '0px',
      'z-index': 999999,
      'width': '30px'
    }
    url = chrome.extension.getURL('icons/icon_38.png')
    ``
    return (
    <img src= {url} style={elem_style} alt="icon"></img>
    )
    ``
}