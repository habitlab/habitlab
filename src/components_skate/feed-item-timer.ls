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

skate.define 'feed-item-timer', {
  props: {
    site: { default: url_to_domain(window.location.href)}
    seconds: { default: 0 }
    example_array: { default: ['foo', 'bar', 'baz', 'qux']}
  }
  render: (elem) !->
    elem_style = {
      'background-color': '#3498DB',
      'width': '500px',
      'height': '300px',
      'color': 'white',
      'font-size': '1.5em',
      'text-align': 'center',     /* Centering text horizontally and vertically */
      'display': 'table-cell',
      'vertical-align': 'middle',
    }
    ``
    return (
    <div style={elem_style}>
    You have already spent {elem.seconds} seconds on {elem.site}.<br/><br/>
    Time is running out!
    </div>
    )
    ``
  attached: (elem) ->
    update_page(elem)
    setInterval ->
      update_page(elem)
    , 1000
}
