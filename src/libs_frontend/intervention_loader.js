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
  get_tab_id,
  get_session_id,
  get_is_new_session,
} = require('libs_common/intervention_info')

function load_intervention_by_name(intervention_name) {
  console.log('load_intervention_by_name sending message')
  let tab_id = get_tab_id();
  let session_id = get_session_id();
  let is_new_session = get_is_new_session();
  let domain = window.location.host
  //send_message_to_background('print_message', {foo: 'bar'})
  send_message_to_background('load_intervention', {domain: domain, tabId: tab_id, intervention_name: intervention_name, session_id: session_id, is_new_session: is_new_session})
}

// function load_intervention_by_difficulty_for_goal(difficulty, goal) {
//   console.log('load_intervention_by_difficulty sending message')
//   let tab_id = get_tab_id()
//   send_message_to_background('load_intervention_by_difficulty_for_goal', {tabId: tab_id, difficulty: difficulty, goal: goal})
// }

module.exports = {
  load_intervention_by_name
}
