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

get_styles = ->
  {
    container: {
      'height': 'inherit',
      'width': 'inherit',
    }
    time_container: {
      'text-align': 'center',
      'display': 'flex',
      'flex-direction': 'column',
      'flex-wrap': 'nowrap',
      'justify-content': 'space-around',
      'height': 'inherit',
    }
    spacer: {
      'flex-grow': '1',
    }
    line: {
      'margin-top': '2px',
      'margin-bottom': '2px',
      'font-family': 'Helvetica, Arial, sans-serif',
      'padding': '0 12px',
    }
    timer: {
      'font-size': '2rem',
    }
    top_overlay: {
      'position': 'absolute',
      'top': '0px',
      'left': '0px',
      'margin-top': '12px',
      'margin-left': '12px',
      'height': 'initial',
    }
    fake_profile: {
      'height': '40px',
      'width': '40px',
      'margin-right': '12px',
      'margin-bottom': '12px',
    }
    name: {
      'color': '#3b5998',
      'font-family': 'helvetica, arial, sans-serif',
      'font-size': '14px',
      'font-weight': 'bold',
    }
    fbtimeposted: {
      'color': '#9197a3',
      'font-family': 'helvetica, arial, sans-serif',
      'font-size': '12px',
      'font-weight': 'normal',
    }
    question: {
      'font-weight': 'bold',
    }
    link: {
      'color': '#3b5998',
      'cursor': 'pointer',
      'text-decoration': 'none',
      'font-size': '13px',
    }
    container_info: {
      'width': '100%',
    }
    align_left: {
      'float: left',
      'width: 50%',
    }
    align_right: {
      'float: right',
      'width: 50%',
    }
    /*
    'elem_style': {
      'background-color': '#3498DB',
      'width': '500px',
      'height': '300px',
      'color': 'white',
      'font-size': '1.5em',
      'text-align': 'center',     # Centering text horizontally and vertically
      'display': 'table-cell',
      'vertical-align': 'middle',
    }
    */
  }

merge_dictionaries = (...dicts) ->
  output = {}
  for dict in dicts
    for k,v of dict
      output[k] = v
  return output

skate.define 'feed-item-stylized', {
  props: {
    site: { default: url_to_domain(window.location.href)}
    seconds: { default: 0 }
  }
  render: (elem) !->
    styles = get_styles()
    styles.container_top_overlay_layout_row = merge_dictionaries(styles.container, styles.top_overlay, styles.layout_row)
    styles.timer_line = merge_dictionaries(styles.timer, styles.line)
    url = chrome.extension.getURL('icons/icon_38.png')
    /*<img class="fake-profile" src="/img/effic-icon.png"></img>*/
    /*<div style={styles.heading} layout-column><div class="name"><a href="https://effic.herokuapp.com" style="color: #3b5998;text-decoration: none;">Effic</a></div><div style={fbtimeposted}>Now</div></div>*/
    /*<timer style={styles.timer_line} start-time="start_time" max-time-unit="'minute'"><b>{{mminutes}}</b> minute{{minutesS}} and <b>{{sseconds}}</b> second{{secondsS}}</timer>*/
    /*
    */
    ``
    return (
    <div style="width: 500px; height: 300px">
      <div style={styles.container}>
        <div style={styles.time_container}>
          <div style={styles.spacer}></div>
          <div style={styles.line}>
            <span style={styles.line}>You have already spent</span>
          </div>
          <div style={styles.timer_line}>{elem.seconds} seconds on {elem.site}</div>
          <div style={styles.line}>
            <span style={styles.line}>Consider doing something more productive!</span>
          </div>
          <div style={styles.spacer}></div>
        </div>
      </div>
      <div style={styles.container_top_overlay_layout_row}>
        <div style={styles.container_info}>
          <div style={styles.align_left}>
            <img style={styles.fake_profile} src={url}></img>
          </div>
          <div style={styles.align_right}>
            <div style={styles.name}><a href="https://habitlab.github.io" style="color: #3b5998;text-decoration: none;">HabitLab</a></div>
            <div style={styles.fbtimeposted}>Now</div>
          </div>
        </div>
      </div>
    </div>
    )
    ``
  attached: (elem) ->
    update_page(elem)
    setInterval ->
      update_page(elem)
    , 1000
}
