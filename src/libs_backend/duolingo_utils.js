const {
  getvar,
  setvar,
} = require('libs_backend/db_utils')


const {
  get_measurement_for_days_before_today,
  add_to_measurement_days_before_today
} = require('libs_common/measurement_utils')

const {
  getvar_intervention_unsynced_backend,
  setvar_intervention_unsynced_backend
} = require('libs_backend/intervention_vars_backend')

const {
  promise_all_object
} = require ('libs_common/promise_utils')

const {
  sleep
} = require('libs_common/common_libs')

const moment = require('moment')

async function get_duolingo_username_uncached() {
  let duolingo_text = await fetch('https://www.duolingo.com/info', {credentials: 'include'}).then(x => x.text())
  let username_text_query = "'username': "
  let username_idx = duolingo_text.indexOf(username_text_query)
  if (username_idx == -1) {
    return ''
  }
  let duolingo_text_after_username = duolingo_text.substr(username_idx + username_text_query.length + 1)
  let username_end_idx = duolingo_text_after_username.indexOf("'")
  if (username_end_idx == -1) {
    return ''
  }
  return duolingo_text_after_username.substr(0, username_end_idx)
}

async function reset_cached_username() {
  await setvar('duolingo_username', '')
}

async function get_duolingo_username() {
  let cached_duolingo_username = await getvar('duolingo_username')
  if (cached_duolingo_username != null && cached_duolingo_username.length > 0) {
    return cached_duolingo_username
  }
  let duolingo_username = await get_duolingo_username_uncached()
  if (duolingo_username != null && duolingo_username.length > 0) {
    await setvar('duolingo_username', duolingo_username)
  }
  return duolingo_username
}

async function wait_until_user_is_logged_in(timeout) {
  let wait_start_time = moment()
  while (moment().diff(wait_start_time, 'seconds') < timeout) {
    let is_logged_in = await get_duolingo_is_logged_in()
    if (is_logged_in) {
      return true
    }
    await sleep(200)
  }
  return false
}

async function get_duolingo_info_for_user(username) {
  if (username == null || username.length == 0) {
    console.log('null username')    
    return {}
  }
  return await fetch('https://www.duolingo.com/users/' + username, {credentials: 'include'}).then(x => x.json())
}

async function get_duolingo_info() {
  var duolingo_username = await get_duolingo_username()
  try {
    return await get_duolingo_info_for_user(duolingo_username)
  } catch (err) {
    console.error(err)
    console.log('resetting username cache and trying again...')
    await reset_cached_username()
    duolingo_username = await get_duolingo_username()
    return await get_duolingo_info_for_user(duolingo_username)
  }
}

async function get_duolingo_is_logged_in() {
  let username = await get_duolingo_username_uncached()
  return username != ''
}

/// Precondition: user is logged in (call get_whether_logged_in() first)
async function get_duolingo_streak() {
  let info = await get_duolingo_info()
  return info.site_streak
}

async function get_last_duolingo_progress_update_time() {
  return await getvar_intervention_unsynced_backend('duolingo/complete_lesson_each_day', 'last_progress_update_time')
}

async function update_duolingo_progress() {
  // Use intervention_vars_backend
  let logged_in = await get_duolingo_is_logged_in()
  if (!logged_in) {
    console.error("not logged in to duolingo, can't update duolingo progress")
    return
  }

  let [last_progress_update, duolingo_info] = await Promise.all([
    get_last_duolingo_progress_update_time(),
    get_duolingo_info()
  ])

  // Iterate through the lesson events backward in time until last_progress_update, incrementing the lesson completed counts along the way
  let lesson_update_counts = new Map()
  for (let i = duolingo_info.calendar.length - 1; i >= 0; i--) {
    let lesson = duolingo_info.calendar[i]
    if (lesson == null) {
      console.error("Lesson is undefined! Calendar is:")
      console.error(duolingo_info.calendar)      
      continue
    }
    let lesson_moment = moment().year(1970).month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(lesson.datetime)
    if (lesson_moment.isBefore(last_progress_update)) {
      break
    }
    let lesson_days_ago = moment().diff(lesson_moment, 'days')
    if (!(lesson_days_ago in lesson_update_counts)) {
      lesson_update_counts.set(lesson_days_ago, 0)
    }
    let old_count = lesson_update_counts.get(lesson_days_ago)
    lesson_update_counts.set(lesson_days_ago, old_count + 1)
  }
  for (let [days_ago, count] of lesson_update_counts.entries()) {
    await add_to_measurement_days_before_today('duolingo_lessons_completed', days_ago, count)
  }
  setvar_intervention_unsynced_backend('duolingo/complete_lesson_each_day', 'last_progress_update_time', moment().format())  
}

module.exports = {
  get_duolingo_username,
  get_duolingo_username_uncached,
  get_duolingo_info_for_user,
  get_duolingo_info,
  get_duolingo_streak,
  get_duolingo_is_logged_in,
  update_duolingo_progress,
  get_last_duolingo_progress_update_time,
  wait_until_user_is_logged_in
}
