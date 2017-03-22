var log_viewing_server = localStorage.getItem('log_viewing_server')
if (!log_viewing_server) {
  log_viewing_server = 'http://localhost:5000'
}
window.location.href = log_viewing_server + '/viewlogs?user_id=' + localStorage.getItem('userid')
