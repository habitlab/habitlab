const skate = require('skatejs')

const {
  url_to_domain,
} = require('libs_common/domain_utils')

const {
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

update_page = (elem) => {
  get_seconds_spent_on_domain_today(elem.site, (seconds_spent) => {
    elem.seconds = seconds_spent
  })
}

skate.define('time-spent-display', {
  props: {
    site: { default: url_to_domain(window.location.href) },
    seconds: { default: 0 },
  },
  render(elem) {
    /*{Number.MAX_SAFE_INTEGER}*/
    return (
      <div style="background-color: red; position: fixed; color: white; width: 100px; 50px; top: 0px; right: 0px; z-index: 99999">
      Spent {elem.seconds} seconds on {elem.site}
      </div>
    )
  },
  attached(elem) {
    update_page(elem)
    setInterval(() => update_page(elem), 1000)
  },
})
