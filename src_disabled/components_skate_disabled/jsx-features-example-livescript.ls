skate = require 'skatejs'

{
  url_to_domain,
} = require 'libs_common/domain_utils'

{
  get_seconds_spent_on_domain_today,
} = require 'libs_common/time_spent_utils'

update_page = (elem) ->
  get_seconds_spent_on_domain_today elem.site, (seconds_spent) ->
    elem.seconds = seconds_spent

skate.define 'jsx-features-example-livescript', {
  props: {
    site: { default: url_to_domain(window.location.href) }
    seconds: { default: 0 }
    example_array: { default: ['foo', 'bar', 'baz', 'qux']}
  }
  render: (elem) !->
    elem_style = {
      'background-color': 'red',
      'position': 'fixed',
      'color': 'white',
      'width': '100px',
      'top': '0px',
      'right': '0px',
      'z-index': 99999,
    }
    ``
    return (
    <div style={elem_style}>
    Spent {elem.seconds} seconds on {elem.site}<br/>
    {
      elem.example_array.map((obj, idx) => {
        return <div>{obj} at index {idx}</div>
      })
    }
    </div>
    )
    ``
  attached: (elem) ->
    update_page(elem)
    setInterval ->
      update_page(elem)
    , 1000
}
