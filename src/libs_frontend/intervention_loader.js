function send_message_to_background(type, data) {
  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage({
      type,
      data
    }, function(result) {
      resolve(result)
      return true
    })
  })
}

const {
  get_tab_id
} = require('libs_common/intervention_info')

function load_intervention_by_name(intervention_name) {
  console.log('load_intervention_by_name sending message')
  let tab_id = get_tab_id();
  //send_message_to_background('print_message', {foo: 'bar'})
  send_message_to_background('load_intervention', {tabId: tab_id, intervention_name: intervention_name})
}

function load_intervention_by_difficulty(difficulty) {
  console.log('load_intervention_by_difficulty sending message')
  let tab_id = get_tab_id()
  send_message_to_background('load_intervention_by_difficulty', {tabId: tab_id, difficulty: difficulty})
}

module.exports = {
  load_intervention_by_name
}
