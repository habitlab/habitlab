{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  cfy
} = require 'cfy'

polymer_ext {
  is: 'number-count-up'
  properties: {
    start: {
      type: Number
      value: 60
    }
    end: {
      type: Number
      value: 80
    }
    duration: {
      type: Number
      value: 3
    }
    time_per_tick: {
      type: Number
      computed: 'compute_time_per_tick(start, end, duration)'
      observer: 'changed_time_per_tick'
    }
  }
  changed_time_per_tick: ->
    console.log 'changed_time_per_tick'
    console.log this.time_per_tick
    self = this
    start_value = self.start
    current_value = self.start
    end_value = self.end
    self.$.number_display.innerText = current_value
    count_up_task = setInterval ->
      if end_value != self.end or start_value != self.start
        clearInterval count_up_task
        return
      current_value := current_value + 1
      self.$.number_display.innerText = current_value
      if current_value == end_value
        clearInterval count_up_task
        return
    , self.time_per_tick
  ready: ->
    console.log 'number-count-up ready'
    console.log this.time_per_tick
  compute_time_per_tick: (start, end, duration) ->
    increment_amount = end - start
    return duration / increment_amount
}
