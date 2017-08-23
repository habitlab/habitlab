const {
  getvar,
  setvar,
} = require('libs_backend/db_utils')

const moment = require('moment')

async function get_hackerrank_username_uncached() {
  let hackerrank_text = await fetch('https://www.hackerrank.com/dashboard', {credentials: 'include'}).then(x => x.text())
  let username_text_query = "username "
  let username_keyword_idx = hackerrank_text.indexOf(username_text_query)
  if (username_keyword_idx == -1) {
    console.error("couldn't find username keyword")
    return ''
  }
  let username_idx = hackerrank_text.indexOf(">", username_keyword_idx) + 1
  let hackerrank_text_after_username = hackerrank_text.substr(username_idx)
  let username_end_idx = hackerrank_text_after_username.indexOf("<")
  if (username_idx == -1 || username_end_idx == -1) {
    console.error("couldn't find username")
    return ''
  }
  return hackerrank_text_after_username.substr(0, username_end_idx);
}

async function reset_cached_username() {
  await setvar('hackerrank_username', '')
}

async function get_hackerrank_username() {
  let cached_hackerrank_username = await getvar('hackerrank_username')
  if (cached_hackerrank_username != null && cached_hackerrank_username.length > 0) {
    return cached_hackerrank_username
  }
  let hackerrank_username = await get_hackerrank_username_uncached()
  if (hackerrank_username != null && hackerrank_username.length > 0) {
    await setvar('hackerrank_username', hackerrank_username)
  }
  console.log("username: " + hackerrank_username)
  return hackerrank_username
}

async function get_hackerrank_submissions_for_user(username) {
  if (username == null || username.length == 0) {
    return {}
  }
  return await fetch('https://www.hackerrank.com/rest/hackers/' + username + '/submission_histories', {credentials: 'include'}).then(x => x.json())
}

async function get_hackerrank_submissions() {
  var hackerrank_username = await get_hackerrank_username()
  try {
    return await get_hackerrank_submissions_for_user(hackerrank_username)
  } catch (err) {
    console.log('resetting username cache and trying again...')
    await reset_cached_username()
    hackerrank_username = await get_hackerrank_username()
    return await get_hackerrank_submissions_for_user(hackerrank_username)
  }
}

async function get_hackerrank_is_logged_in() {
  let username = await get_hackerrank_username_uncached()
  return username != ''
}

module.exports = {
  get_hackerrank_username,
  get_hackerrank_username_uncached,
  get_hackerrank_submissions_for_user,
  get_hackerrank_submissions,
  get_hackerrank_is_logged_in
}