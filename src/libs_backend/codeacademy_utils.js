const {
  getvar,
  setvar,
} = require('libs_backend/db_utils')

const moment = require('moment')

const $ = require('jquery')

async function get_codeacademy_username_uncached() {
  let codeacademy_text = await fetch('https://www.codeacademy.com/learn', {credentials: 'include'}).then(x => x.text())
  let username_text_query = 'username":'
  let username_keyword_idx = codeacademy_text.indexOf(username_text_query)
  if (username_keyword_idx == -1) {
    console.log("couldn't find username keyword")
    return ''
  }
  let username_idx = username_keyword_idx + username_text_query.length + 1
  let username_end_idx = codeacademy_text.indexOf('"', username_idx)
  if (username_idx == -1 || username_end_idx == -1) {
    console.log("couldn't find username")
    return ''
  }
  return codeacademy_text.substring(username_idx, username_end_idx);
}

async function reset_cached_username() {
  await setvar('codeacademy_username', '')
}

async function get_codeacademy_username() {
  let cached_codeacademy_username = await getvar('codeacademy_username')
  if (cached_codeacademy_username != null && cached_codeacademy_username.length > 0) {
    return cached_codeacademy_username
  }
  let codeacademy_username = await get_codeacademy_username_uncached()
  if (codeacademy_username != null && codeacademy_username.length > 0) {
    await setvar('codeacademy_username', codeacademy_username)
  }
  console.log("username: " + codeacademy_username)
  return codeacademy_username
}

async function get_codeacademy_info_for_user(username) {
  if (username == null || username.length == 0) {
    return ''
  }
  return await fetch('https://www.codeacademy.com/' + username, {credentials: 'include'}).then(x => x.text())
}

async function get_codeacademy_info() {
  var codeacademy_username = await get_codeacademy_username()
  try {
    return await get_codeacademy_info_for_user(codeacademy_username)
  } catch (err) {
    console.log('resetting username cache and trying again...')
    await reset_cached_username()
    codeacademy_username = await get_codeacademy_username()
    return await get_codeacademy_info_for_user(codeacademy_username)
  }
}

async function get_codeacademy_is_logged_in() {
  let username = await get_codeacademy_username_uncached()
  return username != ''
}

async function get_codeacademy_streak() {
  let info = await get_codeacademy_info()
  let num_days = 0
  for (let elem of $(info).find('div').toArray()) {
    if (elem == null || elem.innerText == null) {
      continue
    }
    var text = elem.innerText.trim()
    if (text.endsWith('day streak')) {
      num_days = parseInt(text.replace('day streak', '').trim())
      break
    }
  }
  return num_days

  // // console.log(info)
  // let regex_query = /[0-9]+<\/h3>\n?[\n\t ]*<small>day streak/m
  // let streak_idx = info.search(regex_query)
  // let streak_end_idx = info.indexOf('<', streak_idx)
  // if (streak_idx == -1 || streak_end_idx == -1) {
  //   console.error('Could not find the Codeacademy streak.')
  //   return 0
  // }
  // let streak = parseInt(info.substring(streak_idx, streak_end_idx))
  // return streak
}

// async function get_codeacademy_did_submit_today() {
//   printcb('getting it...')
//   let profile_text = await get_codeacademy_info()
//   let keyword_query = '"time-ago" title="'
//   let keyword_idx = profile_text.indexOf(keyword_query)
//   console.log(profile_text)
//   if (keyword_idx == -1) {
//     console.log("couldn't find time-ago")
//     return false
//   }
//   let time_idx = keyword_idx + keyword_query.length
//   let time_end_idx = profile_text.indexOf('"', time_idx)
//   if (time_idx == -1 || time_end_idx == -1) {
//     console.log("couldn't find time")
//     return false
//   }

//   let time_text = profile_text.substr(time_idx, time_end_idx)
//   let sameDay = moment().isSame(time_text, 'day')
//   return sameDay
// }

module.exports = {
  get_codeacademy_username,
  get_codeacademy_username_uncached,
  get_codeacademy_info_for_user,
  get_codeacademy_info,
  get_codeacademy_is_logged_in,
  get_codeacademy_streak
}