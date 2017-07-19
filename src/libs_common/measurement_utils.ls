{
  getkey_dictdict
  setkey_dictdict
  addtokey_dictdict
} = require 'libs_common/db_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export set_measurement = (measurement_name, new_value) ->>
  await set_measurement_for_days_before_today measurement_name, 0, new_value

export set_measurement_for_days_before_today = (measurement_name, days_ago, new_value) ->>
  current_day = get_days_since_epoch()
  await setkey_dictdict 'custom_measurements_each_day', measurement_name, current_day - days_ago, new_value

export increment_measurement = (measurement_name) ->>
  await add_to_measurement measurement_name, 1

export add_to_measurement = (measurement_name, amount_to_add) ->>
  current_day = get_days_since_epoch()
  await addtokey_dictdict 'custom_measurements_each_day', measurement_name, current_day, amount_to_add

export get_measurement = (measurement_name) ->>
  return await get_measurement_for_days_before_today measurement_name, 0

export get_measurement_for_days_before_today = (measurement_name, days_ago) ->>
  current_day = get_days_since_epoch()
  result = await getkey_dictdict 'custom_measurements_each_day', measurement_name, current_day - days_ago
  return result ? 0

gexport_module 'measurement_utils', -> eval(it)
