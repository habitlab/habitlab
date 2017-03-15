{cfy} = require 'cfy'

swal = require 'sweetalert2'

{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  load_css_file
} = require 'libs_common/content_script_utils'

{
  start_syncing_all_data
  stop_syncing_all_data
} = require 'libs_backend/log_sync_utils'

polymer_ext {
  is: 'onboarding-view'
  properties: {
    slide_idx: {
      type: Number
      value: 0
      observer: 'slide_changed'
    }
    prev_slide_idx: {
      type: Number
      value: 0
    }
    allow_logging: {
      type: Boolean
      value: do ->
        stored_value = localStorage.getItem('allow_logging')
        if stored_value?
          return stored_value == 'true'
        return true
      observer: 'allow_logging_changed'
    }
  }
  listeners: {
    keydown: 'on_keydown'
  }
  get_stanford_icon: ->
    return chrome.extension.getURL('icons/stanford.svg')
  allow_logging_changed: ->
    localStorage.setItem('allow_logging', this.allow_logging)
    if this.allow_logging
      start_syncing_all_data()
    else
      stop_syncing_all_data()
  slide_changed: (evt) ->
    self = this
    this.SM('.slide').stop()
    prev_slide_idx = this.prev_slide_idx
    this.prev_slide_idx = this.slide_idx
    if prev_slide_idx == this.slide_idx - 1 # scrolling forward
      prev_slide = this.SM('.slide').eq(prev_slide_idx)
      slide = this.SM('.slide').eq(this.slide_idx)
      prev_slide.animate({
        top: '-100vh'
      }, 1000)
      slide.css('top', '100vh')
      slide.show()
      slide.animate({
        top: '0px'
      }, 1000)
      this.animation_inprogress = true
      setTimeout ->
        self.animation_inprogress = false
      , 1000
    else if prev_slide_idx == this.slide_idx + 1 # scrolling backward
      prev_slide = this.SM('.slide').eq(prev_slide_idx)
      slide = this.SM('.slide').eq(this.slide_idx)
      prev_slide.animate({
        top: '+100vh'
      }, 1000)
      slide.css('top', '-100vh')
      slide.show()
      slide.animate({
        top: '0px'
      }, 1000)
      this.animation_inprogress = true
      setTimeout ->
        self.animation_inprogress = false
      , 1000
    else
      this.SM('.slide').hide()
      slide = this.SM('.slide').eq(this.slide_idx)
      slide.show()
      slide.css('top', '0px')
      this.animation_inprogress = false
  onboarding_complete: ->
    this.allow_logging_changed()
    this.fire 'onboarding-complete', {}
  next_button_clicked: cfy ->*
    if this.animation_inprogress
      return
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx
      this.onboarding_complete()
      return
    this.next_slide()
  next_slide: cfy ->*
    if this.animation_inprogress
      return
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx
      return
      /*
      try
        yield swal({
          title: "Let's start by setting your goals"
        })
        console.log 'ok pressed'
        this.fire 'onboarding-complete', {}
      catch
        return
      return
      */
    this.slide_idx = Math.min(last_slide_idx, this.slide_idx + 1)
  prev_slide: ->
    if this.animation_inprogress
      return
    this.slide_idx = Math.max(0, this.slide_idx - 1)
  get_icon: (img_path) ->
    return chrome.extension.getURL('icons/' + img_path)
  keydown_listener: (evt) ->
    if evt.which == 39 or evt.which == 40
      this.next_slide()
    else if evt.which == 37 or evt.which == 38
      this.prev_slide()
  mousewheel_listener: (evt) ->
    if this.animation_inprogress
      evt.preventDefault()
      return
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx
      irb_text = this.SM('#irb_text')
      irb_text_offset = irb_text.offset()
      irb_text_left = irb_text_offset.left
      irb_text_right = irb_text_left + irb_text.width()
      irb_text_top = irb_text_offset.top
      irb_text_bottom = irb_text_top + irb_text.height()
      if (irb_text_left <= evt.pageX <= irb_text_right) and (irb_text_top <= evt.pageY <= irb_text_bottom)
        if (irb_text[0].scrollTop <= 0) and evt.deltaY < 0
          # scrolling up and at top
          evt.preventDefault()
        if (irb_text[0].scrollTop + irb_text[0].offsetHeight >= irb_text[0].scrollHeight) and evt.deltaY > 0
          # scrolling down and at bottom
          evt.preventDefault()
        return
    evt.preventDefault()
    now_time = Date.now()
    if (this.last_mousewheel_time + 2000 >= now_time) and Math.abs(evt.deltaY) <= Math.abs(this.last_mousewheel_deltaY)
      this.last_mousewheel_deltaY := evt.deltaY
      return
    this.last_mousewheel_deltaY := evt.deltaY
    if evt.deltaY == 0
      return
    this.last_mousewheel_time := now_time
    if evt.deltaY > 0
      this.next_slide()
    else if evt.deltaY < 0
      this.prev_slide()
  detached: ->
    window.removeEventListener 'keydown', this.keydown_listener_bound
    window.removeEventListener 'mousewheel', this.mousewheel_listener_bound
    window.removeEventListener 'resize', this.window_resized_bound
  window_resized: ->
    current_height = 400
    target_height = window.innerHeight - 80
    current_width = 600
    target_width = window.innerWidth - 20
    scale_height = target_height / current_height
    scale_width = target_width / current_width
    scale = Math.min(scale_height, scale_width)
    this.SM('.inner_slide').css({
      transform: 'scale(' + scale + ')'
    })
  attached: ->
    this.window_resized()
  ready: cfy ->*
    self = this
    this.last_mousewheel_time = 0
    this.last_mousewheel_deltaY = 0
    this.keydown_listener_bound = this.keydown_listener.bind(this)
    this.mousewheel_listener_bound = this.mousewheel_listener.bind(this)
    this.window_resized_bound = this.window_resized.bind(this)
    window.addEventListener 'keydown', this.keydown_listener_bound
    window.addEventListener 'mousewheel', this.mousewheel_listener_bound
    window.addEventListener 'resize', this.window_resized_bound
    yield load_css_file('sweetalert2')
    if not chrome.runtime.getManifest().update_url?
      # developer mode
      if not localStorage.getItem('enable_debug_terminal')?
        localStorage.setItem('enable_debug_terminal', 'true')
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'SM'
  ]
}
