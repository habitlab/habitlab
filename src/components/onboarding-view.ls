{cfy} = require 'cfy'

swal = require 'sweetalert2'

{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  load_css_file
} = require 'libs_common/content_script_utils'

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
  }
  listeners: {
    keydown: 'on_keydown'
  }
  on_keydown: (evt) ->
    console.log 'on_keydown called'
    console.log evt
  slide_changed: (evt) ->
    self = this
    this.SM('.slide').stop()
    prev_slide_idx = this.prev_slide_idx
    this.prev_slide_idx = this.slide_idx
    if prev_slide_idx == this.slide_idx - 1 # scrolling forward
      console.log 'slide changed going forward'
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
      console.log 'slide changed going backward'
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
      console.log 'slide changed jump'
      this.SM('.slide').hide()
      slide = this.SM('.slide').eq(this.slide_idx)
      slide.show()
      slide.css('top', '0px')
      this.animation_inprogress = false
  next_slide: cfy ->*
    if this.animation_inprogress
      return
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx
      try
        yield swal({
          title: "Let's start by setting your goals"
        })
        console.log 'ok pressed'
        this.fire 'onboarding-complete', {}
      catch
        return
      return
    this.slide_idx = Math.min(last_slide_idx, this.slide_idx + 1)
  prev_slide: ->
    if this.animation_inprogress
      return
    this.slide_idx = Math.max(0, this.slide_idx - 1)
  get_icon: (img_path) ->
    return chrome.extension.getURL('icons/' + img_path)
  keydown_listener: (evt) ->
    console.log evt.which
    if evt.which == 39 or evt.which == 40
      this.next_slide()
    else if evt.which == 37 or evt.which == 38
      this.prev_slide()
  mousewheel_listener: (evt) ->
    evt.preventDefault()
    if this.animation_inprogress
      return
    now_time = Date.now()
    #console.log last_mousewheel_deltaY
    #if last_mousewheel_time + 1000 >= now_time
    #  last_mousewheel_deltaY := evt.deltaY
    #  return
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
  ready: cfy ->*
    self = this
    this.last_mousewheel_time = 0
    this.last_mousewheel_deltaY = 0
    this.keydown_listener_bound = this.keydown_listener.bind(this)
    this.mousewheel_listener_bound = this.mousewheel_listener.bind(this)
    window.addEventListener 'keydown', this.keydown_listener_bound
    window.addEventListener 'mousewheel', this.mousewheel_listener_bound
    yield load_css_file('sweetalert2')
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'SM'
  ]
}
