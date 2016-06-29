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

skate.define 'scroll-block-display-example', {
  props: {
    site: { default: url_to_domain(window.location.href) }
    seconds: { default: 0 }
  }
  events: {
    'click #clickme': (elem, eventObject) ->
      console.log 'clickme div was clicked'
      skate.emit elem, 'continue_scrolling'
  }
  render: (elem) !->
    ``
    return (
    <div id="clickme" style="background-color: red; position: fixed; color: white; width: 100%; height: 50px; bottom: 0px; right: 0px; z-index: 99999">
    <br/>
    You have already spent {elem.seconds} seconds on {elem.site}. Click here to continue scrolling.
    </div>
    )
    ``
  attached: (elem) ->
    update_page(elem)
    setInterval ->
      update_page(elem)
    , 1000
}
