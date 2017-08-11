
var num_episodes = 0
var prev_episode = ''
var running_episode_tracker = null

/**
 * If there's no running episode tracker, start one to track the number of episodes watched
 */
function start_episode_tracker() {
  if (running_episode_tracker != null) {
    return
  }
  function check_if_new_episode() {
    if (!window.location.pathname.includes('/watch/')) {
      return
    }
    var current_episode = window.location.pathname.replace('/watch/', '')
    if (prev_episode != current_episode) {
      num_episodes++
      prev_episode = current_episode
    }
  }
  check_if_new_episode()
  running_episode_tracker = setInterval(check_if_new_episode, 1000)
  /*
  var idnumber = (window.location.href).parseInt('/watch/','')
  numepisodes=
  return idnumber
  */
}

/**
 * Stop running episode tracker
 */
function stop_episode_tracker() {
  clearInterval(running_episode_tracker)
}

/**
 * Return the number of episodes watched (must call start_episode_tracker first)
 * @return {int} number of episodes wathced 
 */
function get_num_episodes_watched() {
  return num_episodes
}

module.exports = {
  start_episode_tracker,
  stop_episode_tracker,
  get_num_episodes_watched
}
