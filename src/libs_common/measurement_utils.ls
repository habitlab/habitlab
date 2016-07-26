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

{cfy} = require 'cfy'

export set_measurement = cfy (measurement_name, new_value) ->*
  current_day = get_days_since_epoch()
  yield setkey_dictdict 'custom_measurements_each_day', measurement_name, current_day, new_value

export increment_measurement = cfy (measurement_name) ->*
  yield add_to_measurement measurement_name, 1

export add_to_measurement = cfy (measurement_name, amount_to_add) ->*
  current_day = get_days_since_epoch()
  yield addtokey_dictdict 'custom_measurements_each_day', measurement_name, current_day, amount_to_add

export get_measurement = cfy (measurement_name) ->*
  yield get_measurement_for_days_since_today measurement_name, 0

export get_measurement_for_days_since_today = cfy (measurement_name, days_since) ->*
  current_day = get_days_since_epoch()
  result = yield getkey_dictdict 'custom_measurements_each_day', measurement_name, current_day
  return result ? 0

gexport_module 'measurement_utils', -> eval(it)
