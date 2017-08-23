swal = require 'sweetalert2'
$ = require 'jquery'
#require('jquery.pagepiling')($)

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

{
  send_logging_enabled
  send_logging_disabled
} = require 'libs_backend/logging_enabled_utils'

{
  get_user_id
} = require 'libs_backend/background_common'

{
  msg
} = require 'libs_common/localization_utils'

polymer_ext {
  is: 'onboarding-view'
  properties: {
    slide_idx: {
      type: Number
      value: if (window.hashdata_unparsed == 'last') then 3 else 0
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
    # welcome_slide_line1: {
    #   type: String
    #   value: msg("We're here to help you build better habits online.")
    # }
    # welcome_slide_line2: {
    #   type: String
    #   value: msg("Let's do a quick tutorial and get you set up.")
    # }
    geza_meoaddr: {
      type: String
      value: [['gko', 'vacs'].join(''), ['stan', 'ford', '.', 'edu'].join('')].join('@')
    }
    habitlab_logo_url: {
      type: String,
      value: chrome.extension.getURL('icons/logo_gradient.svg') 
    },
    habitlab_logo_white_url: {
      type: String,
      value: chrome.extension.getURL('icons/habitlab_icon_white_gradient.svg') 
    },

  }
  see_what_gets_loggged_clicked: (evt) ->
    #evt.preventDefault()
    evt.stopPropagation()
  get_stanford_icon: ->
    return chrome.extension.getURL('icons/stanford.svg')
  allow_logging_changed: (allow_logging, prev_value_allow_logging) ->
    if not prev_value_allow_logging?
      return # was initializing
    if not allow_logging?
      return
    send_change = true
    prev_allow_logging = localStorage.getItem('allow_logging')
    if prev_allow_logging?
      prev_allow_logging = (prev_allow_logging == 'true')
      if prev_allow_logging == allow_logging # no change
        send_change = false
    localStorage.setItem('allow_logging', allow_logging)
    if allow_logging
      if send_change
        send_logging_enabled({page: 'onboarding', manual: true})
      start_syncing_all_data()
    else
      if send_change
        send_logging_disabled({page: 'onboarding', manual: true})
      stop_syncing_all_data()
  slide_changed: (evt) ->
    self = this
    this.SM('.slide').stop()
    #this.SM('.slide').show()
    prev_slide_idx = this.prev_slide_idx
    this.prev_slide_idx = this.slide_idx
    slide = this.SM('.slide').eq(this.slide_idx)
    if slide.find('.scroll_wrapper').length > 0
      slide.find('.scroll_wrapper')[0].scrollTop = 0
    if prev_slide_idx == this.slide_idx - 1 # scrolling forward
      prev_slide = this.SM('.slide').eq(prev_slide_idx)
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
      #prev_slide.css('top', '100vh')
      #prev_slide.css('top', '0px')
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
        prev_slide.hide()
      , 1000
    else
      this.SM('.slide').hide()
      slide.show()
      slide.css('top', '0px')
      this.animation_inprogress = false
  onboarding_complete: ->
    if not localStorage.getItem('allow_logging')? # user is accepting the default
      #this.allow_logging_changed(true, false) # enables logging
      localStorage.setItem('allow_logging_on_default_with_onboarding', true)
      localStorage.setItem('allow_logging', true)
      send_logging_enabled {page: 'onboarding', manual: false, allow_logging_on_default_with_onboarding: true}
      start_syncing_all_data()
    localStorage.setItem('onboarding_complete', 'true')
    # $('#pagepiling').pagepiling.setAllowScrolling(false)
    # $('#pagepiling').pagepiling.setKeyboardScrolling(false)
    $('body').css('overflow', 'auto')
    this.fire 'onboarding-complete', {}
  next_button_clicked: ->>
    if this.animation_inprogress
      return
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx
      this.onboarding_complete()
      return
    this.next_slide()
  next_slide: (evt) ->
    if this.animation_inprogress
      return
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx
      return
    # $.fn.pagepiling.moveSectionDown();
    # return

    this.slide_idx = Math.min(last_slide_idx, this.slide_idx + 1)
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx-1
      return
    this.SM('.onboarding_complete').show()


  # prev_slide: (evt) ->
  #   $.fn.pagepiling.moveSectionUp();
  #   return
  prev_slide: ->
    if this.animation_inprogress
      return
    this.slide_idx = Math.max(0, this.slide_idx - 1)
    last_slide_idx = this.SM('.slide').length - 1
    if this.slide_idx == last_slide_idx
      return
    this.SM('.onboarding_complete').hide()

  rerender_onboarding_badges: ->
    this.$$('#badges_received').rerender()
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
    return
    /*
    if this.slide_idx == 1
      console.log 'ignoring mouse on slide 1'
      return
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
    */
  detached: ->
    window.removeEventListener 'keydown', this.keydown_listener_bound
    window.removeEventListener 'mousewheel', this.mousewheel_listener_bound
    window.removeEventListener 'resize', this.window_resized_bound
  window_resized: ->
    if this.slide_idx == 1 # on the goal selector page
      this.$.goal_selector.repaint_due_to_resize()
      return
    else if this.slide_idx == 2
      this.$.positive_goal_selector.repaint_due_to_resize()
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
  insert_iframe_for_setting_userid: ->>
    userid = await get_user_id()
    userid_setting_iframe = $('<iframe id="setuseridiframe" src="https://habitlab.stanford.edu/setuserid?userid=' + userid + '" style="width: 0; height: 0; pointer-events: none; opacity: 0; display: none"></iframe>')
    $('body').append(userid_setting_iframe)
  ready: ->>
    $('body').css('overflow', 'hidden')
    self = this
    this.$$('#goal_selector').set_sites_and_goals()
    this.$$('#positive_goal_selector').set_sites_and_goals()
    this.last_mousewheel_time = 0
    this.last_mousewheel_deltaY = 0
    this.keydown_listener_bound = this.keydown_listener.bind(this)
    this.mousewheel_listener_bound = this.mousewheel_listener.bind(this)
    this.window_resized_bound = this.window_resized.bind(this)
    window.addEventListener 'keydown', this.keydown_listener_bound
    window.addEventListener 'mousewheel', this.mousewheel_listener_bound
    window.addEventListener 'resize', this.window_resized_bound
    await load_css_file('sweetalert2')
    # await load_css_file('jquery.pagepiling')
    # await load_css_file('sweetalert2')
    # #$(this.$.pagepiling).pagepiling({
    # this.$.screen2.addEventListener 'wheel', (evt) ->
    #   console.log 'wheel on screen1'
    #   #evt.preventDefault()
    #   evt.stopPropagation()
    #   return
    # this.$.screen2.addEventListener 'mousewheel', (evt) ->
    #   console.log 'mousewheel on screen1'
    #   #evt.preventDefault()
    #   evt.stopPropagation()
    #   return
    # this.$.screen3.addEventListener 'wheel', (evt) ->
    #   console.log 'wheel on screen1'
    #   #evt.preventDefault()
    #   evt.stopPropagation()
    #   return
    # this.$.screen3.addEventListener 'mousewheel', (evt) ->
    #   console.log 'mousewheel on screen1'
    #   #evt.preventDefault()
    #   evt.stopPropagation()
    #   return
    /*
    this.$.pagepiling.addEventListener 'mousewheel', (evt) ->
      console.log 'mousewheel on pagepiling'
      evt.preventDefault()
      evt.stopPropagation()
      return
    this.$.pagepiling.addEventListener 'wheel', (evt) ->
      console.log 'wheel on pagepiling'
      evt.preventDefault()
      evt.stopPropagation()
      return
    window.addEventListener 'mousewheel', (evt) ->
      console.log 'mousewheel on window'
      evt.preventDefault()
      evt.stopPropagation()
      return
    window.addEventListener 'wheel', (evt) ->
      console.log 'wheel on window'
      evt.preventDefault()
      evt.stopPropagation()
      return
    */
    # $('#pagepiling').pagepiling({
    #   menu: null,
    #   direction: 'vertical',
    #   verticalCentered: true,
    #   sectionsColor: [],
    #   anchors: [],
    #   scrollingSpeed: 1,
    #   easing: 'swing',
    #   loopBottom: false,
    #   loopTop: false,
    #   css3: true,
    #   navigation: {
    #     'textColor': 'rgb(144, 206,233)',
    #     'bulletsColor': '#000',
    #     'position': 'right',
    #     'tooltips': ['', '','','']
    #   },
    #   normalScrollElements: null,
    #   normalScrollElementTouchThreshold: 5,
    #   touchSensitivity: 5,
    #   keyboardScrolling: true,
    #   sectionSelector: '.section',
    #   swing: 'linear',
    #   animateAnchor: false,
    #   onLeave: (index, nextIndex, direction) ->
    #     console.log 'onLeave called'
    #     console.log 'index: ' + index
    #     console.log 'nextIndex: ' + nextIndex
    #     self.slide_idx = nextIndex - 1
    # })
    if not chrome.runtime.getManifest().update_url?
      # developer mode
      if not localStorage.getItem('enable_debug_terminal')?
        localStorage.setItem('enable_debug_terminal', 'true')
    console.log('calling set_sites_and_goals')
    this.$$('#goal_selector').repaint_due_to_resize_once_in_view()
    this.$$('#positive_goal_selector').repaint_due_to_resize_once_in_view()
    this.insert_iframe_for_setting_userid()
    /*
    self = this
    this.$$('#goal_selector').set_sites_and_goals()
    this.last_mousewheel_time = 0
    this.last_mousewheel_deltaY = 0
    this.keydown_listener_bound = this.keydown_listener.bind(this)
    this.mousewheel_listener_bound = this.mousewheel_listener.bind(this)
    this.window_resized_bound = this.window_resized.bind(this)
    window.addEventListener 'keydown', this.keydown_listener_bound
    #window.addEventListener 'mousewheel', this.mousewheel_listener_bound
    window.addEventListener 'resize', this.window_resized_bound
    await load_css_file('sweetalert2')
    await load_css_file('jquery.pagepiling')
    if not chrome.runtime.getManifest().update_url?
      # developer mode
      if not localStorage.getItem('enable_debug_terminal')?
        localStorage.setItem('enable_debug_terminal', 'true')
    console.log('calling set_sites_and_goals')
    self.$.goal_selector.repaint_due_to_resize_once_in_view()
    this.insert_iframe_for_setting_userid()
    */
}, [{
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'SM'
    'is_not_equal_to_any'
  ]
}, {
  source: require 'libs_common/localization_utils'
  methods: [
    'msg'
  ]
}]
