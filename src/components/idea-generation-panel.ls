{
  post_json
} = require 'libs_backend/ajax_utils'

{load_css_file} = require 'libs_common/content_script_utils'

{
  get_user_id
  get_install_id
} = require 'libs_backend/background_common'

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

{
  addtolist
  getlist
} = require 'libs_backend/db_utils'

prelude = require 'prelude-ls'

require! {
  shuffled
}

{polymer_ext} = require 'libs_frontend/polymer_utils'

fetchjson = (url) ->>
  if localStorage.getItem('local_logging_server') == 'true'
    logging_server_url = 'http://localhost:5000/'
  else
    logging_server_url = 'https://habitlab-intervention.herokuapp.com/'
  return await fetch(logging_server_url + url).then((.json!))

postjson = (url, data) ->>
  if localStorage.getItem('local_logging_server') == 'true'
    logging_server_url = 'http://localhost:5000/'
  else
    logging_server_url = 'https://habitlab-intervention.herokuapp.com/'
  return await post_json(logging_server_url + url, data)

polymer_ext {
  is: 'idea-generation-panel'
  properties: {
    # properties
    idea_contribution_money: {
      type: Boolean
      value: localStorage.idea_contribution_money == 'true'
    }
    ideavoting_submit_prompt: {
      type: Boolean
      value: localStorage.ideavoting_submit_prompt == 'true'
    }
    display_suggest_idea: {
      type: Boolean
      value: false
    }
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
    current_left_idea: {
      type: String
      value: ''
    }
    current_right_idea: {
      type: String
      value: ''
    }
    num_votes: {
      type: Number
      value: 0
    }
    max_votes: {
      type: Number
      value: 3
    }
  }
  # TODO: remove this helper function
  /*
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
          console.log 'Posting data to: postideas'
          response = await postjson('postideas', data)
          if response.success
            dlog 'success'
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
  */
  upvote_idea: (option) ->>
    self = this
    # call upvote for the current website with current option
    goal = this.current_site
    this.num_votes++
    userid = await get_user_id()
    install_id = await get_install_id()
    downvote_idea = ''
    upvote_idea = ''
    winner = ''
    loser = ''
    if option == 'right'
      upvote_idea = self.current_right_idea_id
      downvote_idea = self.current_left_idea_id
      winner = self.current_right_idea
      loser = self.current_left_idea
    else
      upvote_idea = self.current_left_idea_id
      downvote_idea = self.current_right_idea_id
      winner = self.current_left_idea
      loser = self.current_right_idea
    #console.log "Upvoting website: " + self.current_site + " for idea: " + upvote_idea + "."
    ### TODO: remove for testing
    # localStorage.setItem('local_logging_server', true) 
    ###
    #data = await fetchjson('upvote_proposed_idea?idea_id=' + upvote_idea)
    data = await postjson('upvote_proposed_idea', {goal: goal, winnerid: upvote_idea, loserid: downvote_idea, winner: winner, loser: loser, userid: userid, installid: install_id})
    this.pairs_voted.add(this.current_site + '|||' + self.current_left_idea_id + '|||' + self.current_right_idea_id)
    await addtolist('idea_pairs_voted', this.current_site + '|||' + self.current_left_idea_id + '|||' + self.current_right_idea_id)
    #console.log(data)
  # functions
  select_answer_leftside: (evt) ->>
    self = this
    if this.animation_inprogress
      return
    # upvote current
    self.upvote_idea('left')
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
    self.upvote_idea('right')
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
    
    goal = this.current_site
    userid = await get_user_id()
    install_id = await get_install_id()
    leftidea = self.current_left_idea
    rightidea = self.current_right_idea
    leftideaid = self.current_left_idea_id
    rightideaid = self.current_right_idea_id

    this.pairs_voted.add(this.current_site + '|||' + self.current_left_idea_id + '|||' + self.current_right_idea_id)
    postjson('opt_out_nudgeidea', {goal: goal, leftidea: leftidea, rightidea: rightidea, leftideaid: leftideaid, rightideaid: rightideaid, userid: userid, installid: install_id})
    addtolist('idea_pairs_voted', this.current_site + '|||' + self.current_left_idea_id + '|||' + self.current_right_idea_id)
    
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
    selected_goal_idx = this.$$('#idea_site_selector').selected
    goal_info = this.goal_info_list[selected_goal_idx]
    # console.log this.sites_list[idea_site]
    idea_text = this.$$('#nudge_typing_area').value
    idea_email = this.$$('#email_typing_area').value
    this.$$('#nudge_typing_area').value = ''
    this.$$('#email_typing_area').value = ''
    this.idea_text = ''
    userid = await get_user_id()
    install_id = await get_install_id()
    # console.log(idea_text)
    
    # submit to server as candidate for idea
    # it will need admin approval for showing up on the list
    # to avoid flush of bad ideas, etc..
    ### TODO: remove for testing
    # localStorage.setItem('local_logging_server', true) 
    ###
    # console.log("posting this site: " + site + " with this idea: " + idea) 
    site_idea_pair = { goal : goal_info.name, idea : idea_text, userid: userid, installid: install_id, email: idea_email}
    console.log(site_idea_pair)
    data = {} <<< site_idea_pair
    console.log data
    # 4. Send it
    upload_successful = true
    try
      response = await postjson('postidea_candidate', data)
      if response.response == 'success'
        dlog 'success'
        # return {status: 'success'}
      else
        upload_successful = false
        dlog 'response from server was not successful in postidea_candidate'
        dlog response
        dlog data
        # return {status: 'failure', url: 'https://habitlab.stanford.edu'}
    catch
      upload_successful = false
      dlog 'error thrown in postidea_candidate'
      dlog e
      dlog data
      # return {status: 'failure', url: 'https://habitlab.stanford.edu'}

    this.$$('#add_idea_dialog').close()
  /*
  display_idea: ->>
    self = this
    all_goals = await get_goals()
    # display initial choice
    for site_ideas_pair in self.site_ideas_mapping
      for site_counter_pair in self.site_ideas_mapping_counter
        if site_ideas_pair.goal == site_counter_pair.goal
          # check if all the pairs has been rotated, if not we display
          if site_counter_pair.counter < site_ideas_pair.ideas.length/2
            # corner case
            self.$$('.vote-question').innerText = msg("Which do you think would be a better nudge for " + all_goals[site_ideas_pair.goal].sitename_printable + "?")
            self.current_site = site_ideas_pair.goal
            index = site_counter_pair.counter * 2
            if site_counter_pair.counter == Math.floor(site_ideas_pair.ideas.length/2)
              self.$$('.fix_left').innerText = msg(site_ideas_pair.ideas[index])
              self.$$('.fix_right').innerText = msg(site_ideas_pair.ideas[0])
              self.current_left_idea = site_ideas_pair.ideas[index]
              self.current_right_idea = site_ideas_pair.ideas[0]
              self.current_left_idea_id = site_ideas_pair.ideas_id[index]
              self.current_right_idea_id = site_ideas_pair.ideas_id[0]
            else
              self.$$('.fix_left').innerText = msg(site_ideas_pair.ideas[index])
              self.$$('.fix_right').innerText = msg(site_ideas_pair.ideas[index + 1])
              self.current_left_idea = site_ideas_pair.ideas[index]
              self.current_right_idea = site_ideas_pair.ideas[index + 1]
              self.current_left_idea_id = site_ideas_pair.ideas_id[index]
              self.current_right_idea_id = site_ideas_pair.ideas_id[index + 1]
            site_counter_pair.counter = site_counter_pair.counter + 1
            # console.log self.site_ideas_mapping_counter
            return
    # if get to this point, then we should disable button
    self.$$('.fix_left').innerText = 'No more nudge ideas to vote on'
    self.$$('.fix_right').innerText = 'No more nudge ideas to vote on'
    document.getElementById("disable_left").disabled = true; 
    document.getElementById("disable_right").disabled = true;
    document.getElementById("disable_opt_out").disabled = true;
  */
  display_idea: ->>
    self = this
    all_goals = await get_goals()
    # If they've submitted max-votes votes, prompt them to suggest an idea
    console.log this.num_votes
    console.log this.max_votes
    console.log self.ideavoting_submit_prompt
    if this.num_votes == this.max_votes and self.ideavoting_submit_prompt
      console.log self.ideavoting_submit_prompt
      console.log 'should display prompt'
      self.display_suggest_idea = true
    console.log self.display_suggest_idea
    # display initial choice
    for site_ideas_pair in self.site_ideas_mapping
      goal = site_ideas_pair.goal
      for [leftidea, leftidea_id] in shuffled(prelude.zip(site_ideas_pair.ideas, site_ideas_pair.ideas_id))
        for [rightidea, rightidea_id] in shuffled(prelude.zip(site_ideas_pair.ideas, site_ideas_pair.ideas_id))
          if leftidea == rightidea
            continue
          if this.pairs_voted.has(goal + '|||' + leftidea + '|||' + rightidea) or this.pairs_voted.has(goal + '|||' + rightidea + '|||' + leftidea)
            continue
          self.current_site = site_ideas_pair.goal
          self.$$('.vote-question').innerText = msg("Which do you think would be a better nudge for " + all_goals[site_ideas_pair.goal].sitename_printable + "?")
          self.$$('.fix_left').innerText = leftidea
          self.$$('.fix_right').innerText = rightidea
          self.current_left_idea = leftidea
          self.current_left_idea_id = leftidea_id
          self.current_right_idea = rightidea
          self.current_right_idea_id = rightidea_id
          document.getElementById("disable_left").disabled = false
          document.getElementById("disable_right").disabled = false
          document.getElementById("disable_opt_out").disabled = false
          return
    # if get to this point, then we should disable button
    console.log 'disabling'
    self.$$('.fix_left').innerText = 'No more nudge ideas to vote on'
    self.$$('.fix_right').innerText = 'No more nudge ideas to vote on'
    document.getElementById("disable_left").disabled = true
    document.getElementById("disable_right").disabled = true
    document.getElementById("disable_opt_out").disabled = true
  ready: ->>
    allideas = await fetchjson('getideas_vote_all')
    # console.log allideas
    this.allideas = allideas
    this.rerender()
  continue_voting: ->
    this.display_suggest_idea = false
  rerender: ->>
    allideas = this.allideas
    if not allideas?
      return
    this.pairs_voted = new Set()
    idea_pairs_voted_list = await getlist('idea_pairs_voted')
    for item in idea_pairs_voted_list
      this.pairs_voted.add(item)
    self = this
    all_goals = await get_goals()
    # console.log all_goals
    goal_info_list = Object.values(all_goals)
    # console.log goal_info_list
    goal_info_list.unshift({name: "generic/spend_less_time", sitename_printable: "Any Website"})
    self.goal_info_list = goal_info_list
    # console.log self.goal_info_list
    goals_list = goal_info_list.map (.name)
    enabled_goals = await get_enabled_goals()
    goal_to_idea_info = {}
    for idea_info in allideas
      goal = idea_info.goal
      if not goal_to_idea_info[goal]?
        goal_to_idea_info[goal] = []
      goal_to_idea_info[goal].push(idea_info)
    # console.log goal_to_idea_info
    site_ideas_mapping = []
    site_ideas_mapping_counter = []
    for goal in goals_list
      if not enabled_goals[goal]
        continue
      idea_temp = []
      idea_id_temp = []
      idea_info_list = goal_to_idea_info[goal]
      if idea_info_list?
        for idea_info in idea_info_list
          idea_temp.push(idea_info.idea)
          idea_id_temp.push(idea_info._id)
      site_ideas_mapping.push({
        goal: goal
        ideas: idea_temp
        ideas_id: idea_id_temp
        counter: 0
      })
      site_ideas_mapping_counter.push({
        goal: goal,
        counter: 0
      })
    # console.log site_ideas_mapping
    # console.log site_ideas_mapping_counter
    self.site_ideas_mapping = site_ideas_mapping
    self.site_ideas_mapping_counter = site_ideas_mapping_counter
    await self.display_idea()
  /*
  oldready: ->>
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
    for site in enabled_spend_less_site
      site_upper = site.charAt(0).toUpperCase() + site.slice(1)
      console.log("Fetching from the server of shared interventions from: " + site_upper);
      data = await fetchjson('getideas_vote?website=' + site_upper)
      idea_temp = []
      idea_id_temp = []
      for item in data
        idea_temp.push(item.idea)
        idea_id_temp.push(item._id)
      self.site_ideas_mapping.push({
        site: site
        ideas: idea_temp
        ideas_id: idea_id_temp
        counter: 0
      });
      self.site_ideas_mapping_counter.push({
        site: site,
        counter: 0
      });
    # console.log self.site_ideas_mapping
    await self.display_idea()
    */
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