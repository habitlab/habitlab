const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

polymer_ext({
  is: 'intervention-market',
  properties: {
    mailing_list: {
      type: String,
      value: [['habitlab', 'support'].join('-'), ['cs', 'stanford', 'edu'].join('.')].join('@')
    },
    site: {
      type: String
    }
  },
  ready: async function() {
    console.log('site is:')
    console.log(this.site)
    console.log('ready called in intervention market. fetching data')
    let data = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json').then(x => x.json())
    console.log('finished fetching data')
    console.log(data)
  },
  change_tab: function (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    let newtab = evt.target.getAttribute('newtab')
    this.fire('need_tab_change', {newtab: newtab})
  },
  get_icon: function() {
    return chrome.extension.getURL('icons/icon_19.png')
  },
  submit_feedback_clicked: async function() {
    //screenshot_utils = await SystemJS.import('libs_common/screenshot_utils')
    let screenshot = await screenshot_utils.get_screenshot_as_base64()
    let data = await screenshot_utils.get_data_for_feedback()
    let feedback_form = document.createElement('feedback-form')
    document.body.appendChild(feedback_form)
    feedback_form.screenshot = screenshot
    feedback_form.other = data
    feedback_form.open()
  }
})
