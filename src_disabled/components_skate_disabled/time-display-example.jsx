const skate = require('skatejs')

skate.define('time-display-example', {
  props: {
    name: { default: 'somename' },
    time: { },
  },
  render(elem) {
    return (
      <div>Hello {elem.name} the current time is {elem.time}</div>
    )
  },
  ready(elem) {
    setInterval(() => {
      elem.time = new Date().toString()
    }, 1000)
  }
});
