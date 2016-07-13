const skate = require('skatejs')

const {
  url_to_domain,
} = require('libs_common/domain_utils')

const {
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const update_page = (elem) => {
  get_seconds_spent_on_domain_today(elem.site, (seconds_spent) => {
    elem.seconds = seconds_spent
  })
}

skate.define('jsx-control-statements-example', {
  props: {
    site: { default: url_to_domain(window.location.href) },
    seconds: { default: 0 },
    example_array: { default: ['foo', 'bar', 'baz', 'qux']},
  },
  render: (elem) => {
    const elem_style = {
      'background-color': 'green',
      'position': 'fixed',
      'color': 'white',
      'width': '100px',
      'top': '0px',
      'right': '0px',
      'z-index': 99999,
    }
    return (
    <div style={elem_style}>
    Spent {elem.seconds} seconds on {elem.site}<br/>
    {
      <For each="obj" index="idx" of={elem.example_array}>
        <div>{obj} is at index {idx}</div>
      </For>
    }
    </div>
    )
  },
  attached: (elem) => {
    update_page(elem)
    setInterval(() => {
      update_page(elem)
    }, 1000)
  },
})
