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

skate.define 'feed-item-example', {
  props: {
    site: { default: url_to_domain(window.location.href) }
    seconds: { default: 0 }
    example_array: { default: ['foo', 'bar', 'baz', 'qux']}
  }
  render: (elem) !->
    elem_style = {
      'background-color': 'red',
      'width': '495px',
      'height': '300px',
      'color': 'white',
    }
    ``
    return (
    <div style={elem_style}>
    Spent {elem.seconds} seconds on {elem.site}<br/>
    {
      elem.example_array.map((obj, idx) => {
        return <div>JSX-style looping: {obj} at index {idx}</div>
      })
    }
    {
      <For each="obj" index="idx" of={elem.example_array}>
        <div>looping with control statement elements: {obj} at index {idx}</div>
      </For>
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
