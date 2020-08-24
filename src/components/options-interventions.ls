prelude = require 'prelude-ls'

hso_server_url = 'https://green-antonym-197023.wl.r.appspot.com'

{
  get_interventions
  get_enabled_interventions
  get_manually_managed_interventions
  set_intervention_enabled
  set_intervention_disabled
  set_intervention_automatically_managed
  set_intervention_manually_managed
  set_override_enabled_interventions_once
} = require 'libs_backend/intervention_utils'

{
  get_and_set_new_enabled_interventions_for_today
  enable_interventions_because_goal_was_enabled
} = require 'libs_backend/intervention_manager'

{
  get_enabled_goals
  get_goals
  set_goal_enabled_manual
  set_goal_disabled_manual
  set_goal_target
  get_goal_target
  remove_custom_goal_and_generated_interventions
} = require 'libs_backend/goal_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  localstorage_getjson
  localstorage_setjson
  localstorage_getbool
  localstorage_setbool
  localstorage_setstring
  localstorage_getstring
} = require 'libs_common/localstorage_utils'

{
  post_json
  get_json
} = require 'libs_backend/ajax_utils'

{
  once_available
} = require 'libs_frontend/frontend_libs'

{
  get_user_id
} = require 'libs_backend/background_common'

{
  get_canonical_domain
} = require 'libs_backend/canonical_url_utils'

{load_css_file} = require 'libs_common/content_script_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

swal = require 'sweetalert2'

polymer_ext {
  is: 'options-interventions'
  properties: {
    enabled_goals: {
      type: Array
      value: {}
    },
    start_time_string: {
      type: String
      value: if localStorage.start_as_string then localStorage.start_as_string else '9:00 AM'
    },
    end_time_string: {
      type: String
      value: if localStorage.end_as_string then localStorage.end_as_string else '5:00 PM'
    },
    start_time_mins: {
      type: Number,
      value: if localStorage.start_mins_since_midnight then parseInt(localStorage.start_mins_since_midnight) else 540
    },
    end_time_mins: {
      type: Number,
      value: if localStorage.end_mins_since_midnight then parseInt(localStorage.end_mins_since_midnight) else 1020
    },
    activedaysarray: {
      type: Array,
      value:  if localStorage.activedaysarray? then JSON.parse(localStorage.activedaysarray) else [0,1,2,3,4,5,6]
    }
    always_active: {
      type: Boolean
      value: localStorage.work_hours_only != "true"
    },
    days:{
      type: Array
      value: ['Su','M','Tu','W','Th','F','Sa']
    }
    seen_tutorial: {
      type: Boolean
      value: localStorage.seen_tutorial != "true"
    }
    popup_view_has_been_opened: {
      type: Boolean
      value: localStorage.popup_view_has_been_opened == 'true'
    }
    positive_goals_disabled: {
      type: Boolean
      value: localStorage.positive_goals_disabled == 'true'
    }
    sync_enabled: {
      type: Boolean
      value: localStorage.sync_with_mobile? && localStorage.sync_with_mobile == 'true'
    }
  }
  select_new_interventions: (evt) ->
    self = this
    self.goals_and_interventions = []
    <- get_and_set_new_enabled_interventions_for_today()
    self.rerender()
  on_goal_changed: (evt) ->
    this.rerender()
  is_active_for_day_idx: (dayidx, activedaysarray) ->
    return activedaysarray.includes(dayidx)
  change_intervention_activeness: (evt) ->
    localStorage.work_hours_only = true;
    day_index = evt.target.data-day
    if !evt.target.isdayenabled
      @activedaysarray.push day_index
      @activedaysarray = JSON.parse JSON.stringify @activedaysarray
      localStorage.activedaysarray = JSON.stringify(@activedaysarray)
      return
    else
      @activedaysarray = @activedaysarray.filter(-> it != day_index)
      @activedaysarray = JSON.parse JSON.stringify @activedaysarray
      localStorage.activedaysarray = JSON.stringify(@activedaysarray)
      return

  goals_set: (evt) ->
    if (Object.keys this.enabled_goals).length > 0
      evt.target.style.display = "none"
      this.$$('#intro1').style.display = "block"

  intro1_read: (evt) ->
    evt.target.style.display = "none"
    # this.$$('#intro2').style.display = "block"

  #intro2_read: (evt) ->
  #  evt.target.style.display = "none"
  #  this.$$('#intro3').style.display = "block"
  #  window.scrollTo 0, document.body.scrollHeight

  intro2_read: (evt) ->
    evt.target.style.display = "none"
    # this.$$('#intro4').style.display = "block"
    # this.$$('#intro4').scrollTop = this.$$('#intro4').scrollHeight
    window.scrollTo 0, document.body.scrollHeight

  show_how_hl_works: (evt) ->
    evt.target.style.display = "none"
    this.$$('#how_hl_works').style.display = "block"

  get_icon: ->
    return chrome.extension.getURL('icons/icon_19.png')

  intro3_read: (evt) ->
    evt.target.style.display = "none"
    # this.$$('#intro4').style.display = "block"
    # this.$$('#intro4').scrollTop = this.$$('#intro4').scrollHeight
    window.scrollTo 0, document.body.scrollHeight

  intro4_read: (evt) ->
    evt.target.style.display = "none"

    # this.$$('#intro6').style.display = "block"
    window.scrollTo 0, document.body.scrollHeight



  intro5_read: (evt) ->
    evt.target.style.display = "none"
    # this.$$('#intro6').style.display = "block"
    window.scrollTo 0, document.body.scrollHeight

  show_swal: ->
    #evt.target.style.display = "none"
    this.$$('#popup-button').style.display = 'none'
    swal {
      title: 'Tutorial Complete!'
      text: 'That\'s all you need to know to start using HabitLab. If you\'d like, you can configure more options and view the list of interventions for each goal at the bottom of this page.'
      type: 'success'
      allowOutsideClick: false
      allowEscapeKey: false
      #showCancelButton: true
      #confirmButtonText: 'Visit Facebook to see an intervention in action'
      #cancelButtonText: 'Close'
    }
    this.$$('#configurations').style.display = "block"
    # this.$$('#intro3').style.display = "block"
    window.scrollTo 0, document.body.scrollHeight

  show_intro_button_clicked: ->
    #this.$$('#show_intro_button').style.display = 'none'
    this.$$('#intro1_content').style.display = 'block'
    this.$$('#intro2').style.display = 'block'
    this.$$('#intro4').style.display = 'block'
  attached: ->
   if window.location.hash != '#introduction'
    for elem in Polymer.dom(this.root).querySelectorAll('.intro')
      elem.style.display = 'inline-flex';

  ready: ->>
    this.rerender()
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')

    survey_data = localstorage_getjson("survey_data")
    if typeof(survey_data) === 'undefined'
      localstorage_setjson("survey_data",{})
      this.check_for_survey
    else if survey_data !== {}
      once_available("survey_button", this.enable_survey_button())
    else
      this.check_for_survey()


  check_for_survey: ->>
    userid = await get_user_id()
    survey_data = JSON.parse(await get_json(hso_server_url + "/getSurvey", "userid=" + userid))
    if survey_data !== {}
      localstorage_setjson("survey_data", survey_data)
      once_available("survey_button", this.enable_survey_button())

  enable_survey_button: ->>
    survey_data = await localstorage_getjson("survey_data")
    button = document.getElementById("survey_button")
    button.innerHTML = survey_data.button_text
    button.style.display = "inline-block"
    button.disabled = false

  disable_survey_button: ->>
    localstorage_setjson("survey_data", {})
    button = document.getElementById("survey_button")
    button.style.display = "none"
    button.disabled = true

  survey_button_clicked: ->>
    survey_data = localstorage_getjson("survey_data")
    userid = await get_user_id()
    chrome.tabs.create {url: survey_data.url + '?habitlab_userid=' + userid + '&click_location=dropdown'}
    post_json(hso_server_url + "/surveyClicked", {"_id": survey_data._id, "userid":userid,"click_location":"dropdown"})
    this.disable_survey_button()

  show_randomize_button: ->
    return localStorage.getItem('intervention_view_show_randomize_button') == 'true'
  have_interventions_available: (goals_and_interventions) ->

    return goals_and_interventions and goals_and_interventions.length > 0
  show_dialog: (evt) ->
    if evt.target.id == 'start-time'
      this.$$('#start-dialog').toggle!
    else
      this.$$('#end-dialog').toggle!


  toggle_timepicker_idx: (evt) ->

    buttonidx = evt.detail.buttonidx
    if buttonidx == 1
      localStorage.work_hours_only = true;
      @always_active = false
      localStorage.start_mins_since_midnight = @start_time_mins#this.$$('#start-picker').rawValue
      localStorage.end_mins_since_midnight = @end_time_mins#this.$$('#end-picker').rawValue
      localStorage.start_as_string = @start_time_string#this.$$('#start-picker').time
      localStorage.end_as_string = @end_time_string#this.$$('#end-picker').time
    else
      localStorage.work_hours_only = false;
      @always_active = true
  toggle_timepicker: (evt) ->
    if evt.target.checked # if evt.target.checked is true, elem was just changed
      if this.$$('paper-radio-group').selected == 'always' #bizarre error, means currently selected is work_hours

        localStorage.work_hours_only = true;
        @always_active = false
        localStorage.start_mins_since_midnight = @start_time_mins#this.$$('#start-picker').rawValue

        localStorage.end_mins_since_midnight = @end_time_mins#this.$$('#end-picker').rawValue
        localStorage.start_as_string = @start_time_string#this.$$('#start-picker').time
        localStorage.end_as_string = @end_time_string#this.$$('#end-picker').time
      else
        localStorage.work_hours_only = false;
        @always_active = true

    # if not, it's a double click so you shouldn't do anything


  dismiss_dialog: (evt) ->
    if evt.detail.confirmed
      if evt.target.id == 'start-dialog'
        @start_time_string = this.$$('#start-picker').time
        @start_time_mins = this.$$('#start-picker').rawValue
        localStorage.start_mins_since_midnight = @start_time_mins
        localStorage.start_as_string = @start_time_string
      else
        @end_time_string = this.$$('#end-picker').time
        @end_time_mins = this.$$('#end-picker').rawValue
        localStorage.end_mins_since_midnight = @end_time_mins
        localStorage.end_as_string = @end_time_string
    else #reset the time picker time to saved time
      this.$$('#start-picker').time = @start_time_string
      this.$$('#end-picker').time = @end_time_string

  # get_selected: (name) ->>
  #   console.log "boo"
  #   console.log name
  #   ##time = await get_goal_target name
  #   #console.log time
  #   return 4
  #   return (time/5 - 1)

  determine_selected: (always_active) ->
    if always_active
      return 'always'
    else
      return 'workday'

  determine_selected_idx: (always_active) ->
    if always_active
      return 0
    else
      return 1
  sort_custom_goals_and_interventions_after: (goals_and_interventions) ->
    [custom_goals_and_interventions,normal_goals_and_interventions] = prelude.partition (.goal.custom), goals_and_interventions
    return normal_goals_and_interventions.concat custom_goals_and_interventions
  help_icon_clicked: ->
    swal {
      title: 'How HabitLab Works'
      html: '''
      HabitLab will help you achieve your goal by showing you a different <i>nudge</i>, like a news feed blocker or a delayed page loader, each time you visit your goal site.
      <br><br>
      At first, HabitLab will show you a random nudge each visit, and over time it will learn what works most effectively for you.
      <br><br>
      Each visit, HabitLab will test a new nudge and measure how much time you spend on the site. Then it determines the efficacy of each nudge by comparing the time spent per visit when that nudge was deployed, compared to when other nudges are deployed. HabitLab uses an algorithmic technique called <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">multi-armed-bandit</a> to learn which nudges work best and choose which nudges to deploy, to minimize your time wasted online.
      '''
      allowOutsideClick: true
      allowEscapeKey: true
      #showCancelButton: true
      #confirmButtonText: 'Visit Facebook to see an intervention in action'
      #cancelButtonText: 'Close'
    }
  rerender_idea_generation: ->
    this.$.idea_generation.rerender()
  rerender_privacy_options: ->
    this.$.privacy_options.rerender()
  rerender: ->>
    # this.$.privacy_options.rerender()
    await this.$$('#goal_selector').set_sites_and_goals()
    if this.$$('#positive_goal_selector')?
      await this.$$('#positive_goal_selector').set_sites_and_goals()





}, [
  {
    source: require 'libs_common/localization_utils'
    methods: [
      'msg'
    ]
  }
  {
    source: require 'libs_frontend/polymer_methods'
    methods: [
      'text_if_elem_in_array'
      'text_if_elem_not_in_array'
    ]
  }
]
