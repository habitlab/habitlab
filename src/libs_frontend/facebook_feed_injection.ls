$ = require('jquery')
require('jquery.isinview')($)
require('jquery-inview')($)

export inject_into_feed = (component_generator) ->
  window.numitems = 0

  window.mostrecentmousemove = Date.now()
  window.timeopened = Date.now()
  window.prev_visible_quiz_ids = []
  window.all_shown_times = {} # id -> Date.now()
  window.itemsseen = 0
  window.active = true

  

  randstr = ->
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'
    output = ''
    for i from 0 til 24
      output += chars.charAt(Math.random() * chars.length)
    return output

  insertBeforeItem = (jfeeditem) ->
    quizid = randstr()
    console.log "about to insert... items="
    console.log window.itemsseen
    jfeeditem.before component_generator(window.numitems)
    return

  insertIfMissing = ->
    
    

    for $feeditem in $('.mbm._5jmm,.userContentWrapper._5pcr')
      # if $($feeditem).isInView()  
      #   if $feeditem.seen
      #     console.log 'you already saw me'
      #   else
      #     $($feeditem).prop('seen': true)
      #     console.log 'new feed'
      #     window.itemsseen += 1
      #     if window.itemsseen % 10 == 5
      #       console.log \injected
      #       insertBeforeItem $($feeditem)
      
  
      if not $feeditem.feedlearninserted
        $feeditem.feedlearninserted = true
        window.numitems += 1
      
        if window.numitems % 10 == 5
          if window.active
            insertBeforeItem $($feeditem)
    return

  idArraysEqual = (a1, a2) ->
    if a1.length != a2.length
      return false
    for i from 0 til a1.length
      if a1[i] != a2[i]
        return false
    return true

  keysInFirstButNotSecond = (m1, m2) ->
    output = []
    for k in Object.keys(m1)
      if not m2[k]?
        output.push k
    return output

  updateVisibleIds = ->
    visible_quiz_ids = [quiz.id for quiz in $('.feedlearnquiz').inViewport()]
    if not idArraysEqual(visible_quiz_ids, window.prev_visible_quiz_ids) # making assumption that inViewport will return arrays in same order
      visible_quiz_ids_map = {[id,true] for id in visible_quiz_ids}
      prev_visible_quiz_ids_map = {[id,true] for id in window.prev_visible_quiz_ids}
      shown_ids = keysInFirstButNotSecond(visible_quiz_ids_map, window.prev_visible_quiz_ids_map)
      curtime = Date.now()
      showntimes = {}
      for newid in shown_ids
        window.all_shown_times[newid] = curtime
        showntimes[newid] = curtime
      hidden_ids = keysInFirstButNotSecond(prev_visible_quiz_ids_map, visible_quiz_ids)
      for newid in hidden_ids
        showntimes[newid] = window.all_shown_times[newid]
      changed_info = {}
      if shown_ids.length > 0 or hidden_ids.length > 0
        fburl = $('.fbxWelcomeBoxName').attr('href')
        fbname = $('.fbxWelcomeBoxName').text()
        chrome.runtime.send-message {feedlearn: 'shownquizzeschanged', 'visibleids': visible_quiz_ids, 'shownids': shown_ids, 'hiddenids': hidden_ids, 'showntimes': showntimes, fburl: fburl, fbname: fbname}
      window.prev_visible_quiz_ids = visible_quiz_ids
    return

  initialize = (format) ->
    if not (format == 'link' or format == 'interactive' or format == 'none')
      fburl = $('.fbxWelcomeBoxName').attr('href')
      fbname = $('.fbxWelcomeBoxName').text()
      chrome.runtime.send-message {feedlearn: 'missingformat', fburl: fburl, fbname: fbname}
    if format != 'none' #format == 'link' or format == 'interactive'
      setInterval ->
        updateVisibleIds()
        insertIfMissing()
        return
      , 1500
    $(document).mousemove ->
      window.mostrecentmousemove = Date.now()
      return

  preinitialize = (format) ->
    if /*window.location.toString() == 'https://www.facebook.com/' and*/ $('#feedlearn').length == 0
      clearInterval window.firststartprocess
      $('html').append $('<div>').attr('id', 'feedlearn').css({
        position: 'absolute'
        display: 'none'
        top: '0px'
        left: '0px'
        z-index: 1000
      })
      initialize(format)

  loadfirststart = ->
    if $('#feedlearn').length == 0
      fburl = $('.fbxWelcomeBoxName').attr('href')
      fbname = $('.fbxWelcomeBoxName').text()
      preinitialize 'interactive'


  loadfirststart()
  window.firststartprocess = setInterval loadfirststart, 5000
