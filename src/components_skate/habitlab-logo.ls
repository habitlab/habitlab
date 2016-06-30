skate = require 'skatejs'

skate.define 'habitlab-logo', {
  props: {

  }
  render: (elem) !->
    elem_style = {
      'position': 'fixed',
      'top': '0px',
      'left': '0px',
      'z-index': 999999,
      'width': '30px'
    }
    ``
    return (
    <img src="./icons/icon_38.png" style={elem_style} alt="icon"></img>
    )
    ``
}