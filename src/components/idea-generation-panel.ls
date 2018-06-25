{
  post_json
} = require 'libs_backend/ajax_utils'

{load_css_file} = require 'libs_common/content_script_utils'

{
  get_enabled_goals
  get_goals
} = require 'libs_backend/goal_utils'

{
  unique
} = require 'libs_common/array_utils'

{
  msg
} = require 'libs_common/localization_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'idea-generation-panel'
  properties: {
    # properties
    index_background_color: {
      type: String
      value: 'rgb(81, 167,249)'
    }
    sites_list: {
      type: Array
    }
    site_ideas_mapping: {
      type: Array
      value: []
    }
    site_ideas_mapping_counter: {
      type: Array
      value: []
    }
    current_site: {
      type: String
      value: ''
    }
    current_left_idea_id: {
      type: String
      value: ''
    }
    current_right_idea_id: {
      type: String
      value: ''
    }
  }
  # TODO: remove this helper functions
  inject_site_ideas_mapping: (site_list) ->>
    if not site_list?
      site_list = this.site_list
    # localStorage.setItem('testing_firsttime', true)
    #if localStorage.getItem('testing_firsttime') == 'true'
    #  localStorage.setItem('testing_firsttime', false)
    # inject site ideas mappings to db
    # 1. get the server loc
    ### TODO: remove for testing
    # localStorage.setItem('local_logging_server', true) 
    ###
    if localStorage.getItem('local_logging_server') == 'true'
      console.log "posting to local server"
      logging_server_url = 'http://localhost:5000/'
    else
      console.log "posting to cloud server"
      logging_server_url = 'https://habitlab.herokuapp.com/'
    # 2. Concat data to transmit
    ### TODO: currently mannuly get from reddit
    ideas_placeholder = ['placeholder_1', 'placeholder_2', 'placeholder_3', 'placeholder_4', 'placeholder_5', 'placeholder_6']
    for site in site_list
      for idea in ideas_placeholder
        # console.log("posting this site: " + site + " with this idea: " + idea)
        site_idea_pair = { site : site, idea : idea , vote : 0}
        console.log(site_idea_pair)
        data = {} <<< site_idea_pair
        # 4. Send it
        upload_successful = true
        try
          console.log 'Posting data to: ' + logging_server_url + 'postideas'
          response = await post_json(logging_server_url + 'postideas', data)
          if response.success
              console.log 'success'
              # return {status: 'success'}
          else
            upload_successful = false
            dlog 'response from server was not successful in postideas'
            dlog response
            dlog data
            console.log 'response from server was not successful in postideas'
            # return {status: 'failure', url: 'https://habitlab.stanford.edu'}
        catch
          upload_successful = false
          dlog 'error thrown in postideas'
          dlog e
          dlog data
          console.log 'error thrown in postideas'
          # return {status: 'failure', url: 'https://habitlab.stanford.edu'}
  upvote_idea: (option) ->>
    self = this
    # call upvote for the current website with current option
    upvote_idea = ''
    if option == 'right'
      upvote_idea = self.current_right_idea_id
    else
      upvote_idea = self.current_left_idea_id
    console.log "Upvoting website: " + self.current_site + " for idea: " + upvote_idea + "."
    ### TODO: remove for testing
    # localStorage.setItem('local_logging_server', true) 
    ###
    if localStorage.getItem('local_logging_server') == 'true'
      console.log "posting to local server"
      logging_server_url = 'http://localhost:5000/'
    else
      console.log "posting to cloud server"
      logging_server_url = 'https://habitlab.herokuapp.com/'
    request = logging_server_url + 'upvote_proposed_idea' + '?idea_id=' + upvote_idea;
    data = await fetch(request).then (.json!)
    console.log(data)
  # functions
  select_answer_leftside: (evt) ->>
    self = this
    if this.animation_inprogress
        return
    # upvote current
    await self.upvote_idea('left')
    # clicked left-side
    this.SM('.animate_left').css("filter", "grayscale(0%)");
    this.SM('.animate_left').css("background-color", "#0000FF");
    # temp = this.$$('.fix_left').innerText
    this.$$('.animate_left').innerText = this.$$('.fix_left').innerText
    this.SM('.answer-leftside-animate').css("margin-top", '0');
    this.SM('.answer-leftside-animate').css("z-index", '1');
    this.SM('.answer-leftside-fix').css("z-index", '0');
    this.SM('.answer-leftside-animate').animate({
        margin-top: '+120px'
    }, 1000)
    # non-clicked right-side
    this.SM('.animate_right').css("background-color", "#0000FF");
    this.SM('.animate_right').css("filter", "grayscale(30%)");
    # temp = this.$$('.fix_right').innerText
    this.$$('.animate_right').innerText = this.$$('.fix_right').innerText
    this.SM('.answer-rightside-animate').css("margin-top", '0');
    this.SM('.answer-rightside-animate').css("z-index", '1');
    this.SM('.answer-rightside-fix').css("z-index", '0');
    this.SM('.answer-rightside-animate').animate({
        margin-top: '+120px'
    }, 1000)
    # change the fix test
    await self.display_idea()
    this.animation_inprogress = true
    setTimeout ->
      self.animation_inprogress = false
    , 1000
  select_answer_rightside: (evt) ->>
    self = this
    if this.animation_inprogress
        return
    await self.upvote_idea('right')
    # clicked right-side
    this.SM('.animate_right').css("filter", "grayscale(0%)");
    this.SM('.animate_right').css("background-color", "#0000FF");
    this.$$('.animate_right').innerText = this.$$('.fix_right').innerText
    this.SM('.answer-rightside-animate').css("margin-top", '0');
    this.SM('.answer-rightside-animate').css("z-index", '1');
    this.SM('.answer-rightside-fix').css("z-index", '0');
    this.SM('.answer-rightside-animate').animate({
        margin-top: '+120px'
    }, 1000)
    # non-clicked left-side
    this.SM('.animate_left').css("background-color", "#0000FF");
    this.SM('.animate_left').css("filter", "grayscale(30%)");
    this.$$('.animate_left').innerText = this.$$('.fix_left').innerText
    this.SM('.answer-leftside-animate').css("margin-top", '0');
    this.SM('.answer-leftside-animate').css("z-index", '1');
    this.SM('.answer-leftside-fix').css("z-index", '0');
    this.SM('.answer-leftside-animate').animate({
        margin-top: '+120px'
    }, 1000)
    # change the fix test
    await self.display_idea()
    this.animation_inprogress = true
    setTimeout ->
      self.animation_inprogress = false
    , 1000
  select_opt_out: (evt) ->>
    # console.log("cli!!")
    self = this
    if this.animation_inprogress
        return
    # clicked right-side
    this.SM('.animate_right').css("filter", "grayscale(30%)");
    this.SM('.animate_right').css("background-color", "#0000FF");
    this.$$('.animate_right').innerText = this.$$('.fix_right').innerText
    this.SM('.answer-rightside-animate').css("margin-top", '0');
    this.SM('.answer-rightside-animate').css("z-index", '1');
    this.SM('.answer-rightside-fix').css("z-index", '0');
    this.SM('.answer-rightside-animate').animate({
        margin-top: '+120px'
    }, 1000)
    # non-clicked left-side
    this.SM('.animate_left').css("filter", "grayscale(30%)");
    this.SM('.animate_left').css("background-color", "#0000FF");
    this.$$('.animate_left').innerText = this.$$('.fix_left').innerText
    this.SM('.answer-leftside-animate').css("margin-top", '0');
    this.SM('.answer-leftside-animate').css("z-index", '1');
    this.SM('.answer-leftside-fix').css("z-index", '0');
    this.SM('.answer-leftside-animate').animate({
        margin-top: '+120px'
    }, 1000)
    # change the fix test
    await self.display_idea()

    this.animation_inprogress = true
    setTimeout ->
      self.animation_inprogress = false
    , 1000
  user_typing_idea: (evt) ->
    this.idea_text = this.$$('#nudge_typing_area').value
  add_own_idea: ->
    this.$$('#add_idea_dialog').open()
    if this.idea_text? and this.idea_text.length > 0
      this.$$('#nudge_typing_area').value = this.idea_text
  submit_idea: ->>
    idea_site = this.$$('#idea_site_selector').selected
    idea_site = this.sites_list[idea_site]
    # console.log this.sites_list[idea_site]
    idea_text = this.$$('#nudge_typing_area').value
    this.$$('#nudge_typing_area').value = ''
    this.idea_text = ''
    # console.log(idea_text)
    
    # submit to server as candidate for idea
    # it will need admin approval for showing up on the list
    # to avoid flush of bad ideas, etc..
    ### TODO: remove for testing
    # localStorage.setItem('local_logging_server', true) 
    ###
    if localStorage.getItem('local_logging_server') == 'true'
      console.log "posting to local server"
      logging_server_url = 'http://localhost:5000/'
    else
      console.log "posting to cloud server"
      logging_server_url = 'https://habitlab.herokuapp.com/'
    # console.log("posting this site: " + site + " with this idea: " + idea)
    site_idea_pair = { site : idea_site, idea : idea_text}
    console.log(site_idea_pair)
    data = {} <<< site_idea_pair
    console.log data
    # 4. Send it
    upload_successful = true
    try
      console.log 'Posting data to: ' + logging_server_url + 'postidea_candidate'
      response = await post_json(logging_server_url + 'postidea_candidate', data)
      if response.success
          console.log 'success'
          # return {status: 'success'}
      else
        upload_successful = false
        dlog 'response from server was not successful in postidea_candidate'
        dlog response
        dlog data
        console.log 'response from server was not successful in postidea_candidate'
        # return {status: 'failure', url: 'https://habitlab.stanford.edu'}
    catch
      upload_successful = false
      dlog 'error thrown in postidea_candidate'
      dlog e
      dlog data
      console.log 'error thrown in postidea_candidate'
      # return {status: 'failure', url: 'https://habitlab.stanford.edu'}

    this.$$('#add_idea_dialog').close()
  display_idea: ->>
    self = this
    # display initial choice
    for site_ideas_pair in self.site_ideas_mapping
      for site_counter_pair in self.site_ideas_mapping_counter
        if site_ideas_pair.site == site_counter_pair.site
          # check if all the pairs has been rotated, if not we display
          if site_counter_pair.counter < site_ideas_pair.ideas.length/2
            # corner case
            self.$$('.vote-question').innerText = msg("Which do you think would be a better nudge for " + site_ideas_pair.site + " ?")
            self.current_site = site_ideas_pair.site
            index = site_counter_pair.counter * 2
            if site_counter_pair.counter == Math.floor(site_ideas_pair.ideas.length/2)
              self.$$('.fix_left').innerText = msg(site_ideas_pair.ideas[index])
              self.$$('.fix_right').innerText = msg(site_ideas_pair.ideas[0])
              self.current_left_idea_id = site_ideas_pair.ideas_id[index]
              self.current_right_idea_id = site_ideas_pair.ideas_id[0]
            else
              self.$$('.fix_left').innerText = msg(site_ideas_pair.ideas[index])
              self.$$('.fix_right').innerText = msg(site_ideas_pair.ideas[index + 1])
              self.current_left_idea_id = site_ideas_pair.ideas_id[index]
              self.current_right_idea_id = site_ideas_pair.ideas_id[index + 1]
            site_counter_pair.counter = site_counter_pair.counter + 1
            # console.log self.site_ideas_mapping_counter
            return
    # if get to this point, then we should disable button
    document.getElementById("disable_left").disabled = true; 
    document.getElementById("disable_right").disabled = true;
    document.getElementById("disable_opt_out").disabled = true;  
  ready: ->>
    self = this
    all_goals = await get_goals()
    goal_info_list = Object.values all_goals
    sites_list = goal_info_list.map (.sitename_printable)
    sites_list = sites_list.filter -> it?
    sites_list = unique sites_list
    sites_list.sort()
    this.sites_list = sites_list
    ### TODO: remove this
    #self.inject_site_ideas_mapping(sites_list)
    # getting the site ideas mapping
    enabled_goals = await get_enabled_goals()
    enabled_goals_keys = Object.keys(enabled_goals)
    enabled_spend_less_site = []
    for item in enabled_goals_keys
      enabled_spend_less_site.push(item.split("/")[0])
    console.log(enabled_spend_less_site)
    ### TODO: remove for testing
    # localStorage.setItem('local_logging_server', true) 
    ###
    if localStorage.getItem('local_logging_server') == 'true'
      console.log "posting to local server"
      logging_server_url = 'http://localhost:5000/'
    else
      console.log "posting to cloud server"
      logging_server_url = 'https://habitlab.herokuapp.com/'
    for site in enabled_spend_less_site
      site_upper = site.charAt(0).toUpperCase() + site.slice(1)
      request = logging_server_url + 'getideas_vote' + '?website=' + site_upper;
      console.log("Fetching from the server of shared interventions from: " + site_upper);
      data = await fetch(request).then (.json!)
      idea_temp = []
      idea_id_temp = []
      for item in data
        idea_temp.push(item.idea)
        idea_id_temp.push(item._id)
      self.site_ideas_mapping.push({
        site: site,
        ideas: idea_temp
        ideas_id: idea_id_temp
      });
      self.site_ideas_mapping_counter.push({
        site: site,
        counter: 0
      });
    # console.log self.site_ideas_mapping
    await self.display_idea()
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
      'text_if'
      'once_available'
      'S'
      'SM'
    ]
  }
  {
    source: require 'libs_frontend/polymer_methods_resize'
    methods: [
      'on_resize'
    ]
  }
]