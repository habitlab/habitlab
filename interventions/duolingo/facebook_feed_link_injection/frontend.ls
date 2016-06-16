root = exports ? this

randstr = ->
  chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'
  output = ''
  for i from 0 til 24
    output += chars.charAt(Math.random() * chars.length)
  return output


insertBeforeItem = (jfeeditem) ->
  #jfeeditem.before $('<div>').text('newfoobar')
  quizid = randstr()
  jfeeditem.before $('<a style="width: 495px; height: 300px" href="https://www.duolingo.com/" target="_blank"><img src="' + chrome.extension.getURL('interventions/duolingo/facebook_feed_link_injection/facebook-duolingo.png') + '"></a>')
  /*
  jfeeditem.before $('<iframe>').css({
    width: '495px'
    height: '300px'
  }).attr('src', 'https://feedlearn.herokuapp.com/?facebook=true&quizid=' + quizid).attr('frameBorder', '0').addClass('feedlearnquiz').attr('id', quizid)
  */
  return

root.numitems = 0

insertIfMissing = ->
  for feeditem in document.querySelectorAll('.mbm._5jmm,.userContentWrapper._5pcr')
    #jfeeditem = $(feeditem)
    #if not jfeeditem.attr('feedlearninserted')
    if not feeditem.feedlearninserted
      #jfeeditem.attr('feedlearninserted', true)
      feeditem.feedlearninserted = true
      root.numitems += 1
      if root.numitems % 10 == 5
        insertBeforeItem $(feeditem)
  return

root.mostrecentmousemove = Date.now()
root.timeopened = Date.now()
root.prev_visible_quiz_ids = []
root.all_shown_times = {} # id -> Date.now()

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
  if not idArraysEqual(visible_quiz_ids, root.prev_visible_quiz_ids) # making assumption that inViewport will return arrays in same order
    visible_quiz_ids_map = {[id,true] for id in visible_quiz_ids}
    prev_visible_quiz_ids_map = {[id,true] for id in prev_visible_quiz_ids}
    shown_ids = keysInFirstButNotSecond(visible_quiz_ids_map, prev_visible_quiz_ids_map)
    curtime = Date.now()
    showntimes = {}
    for newid in shown_ids
      root.all_shown_times[newid] = curtime
      showntimes[newid] = curtime
    hidden_ids = keysInFirstButNotSecond(prev_visible_quiz_ids_map, visible_quiz_ids)
    for newid in hidden_ids
      showntimes[newid] = root.all_shown_times[newid]
    changed_info = {}
    if shown_ids.length > 0 or hidden_ids.length > 0
      fburl = $('.fbxWelcomeBoxName').attr('href')
      fbname = $('.fbxWelcomeBoxName').text()
      chrome.runtime.send-message {feedlearn: 'shownquizzeschanged', 'visibleids': visible_quiz_ids, 'shownids': shown_ids, 'hiddenids': hidden_ids, 'showntimes': showntimes, fburl: fburl, fbname: fbname}
    root.prev_visible_quiz_ids = visible_quiz_ids
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
    , 1000
  $(document).mousemove ->
    root.mostrecentmousemove = Date.now()
    return
  /*
  setInterval ->
    fburl = $('.fbxWelcomeBoxName').attr('href')
    fbname = $('.fbxWelcomeBoxName').text()
    timesincemousemove = Date.now() - root.mostrecentmousemove
    if timesincemousemove > 10000
      return
    showntimes = {}
    for newid in root.prev_visible_quiz_ids
      showntimes[newid] = root.all_shown_times[newid]
    chrome.runtime.send-message {feedlearn: 'fbstillopen', mostrecentmousemove: root.mostrecentmousemove, timeopened: root.timeopened, timesincemousemove: timesincemousemove, 'visiblequizids': root.prev_visible_quiz_ids, 'showntimes': showntimes, fburl: fburl, fbname: fbname}
    return
  , 5000
  */
  #for feeditem in $('.mbm')
  #  $(feeditem).before($('<div>').text('newfoobar'))
  #$.get 'https://geza.herokuapp.com/index.html', (data) ->
  #  console.log data
  /*
  $('html').append $('<iframe>').attr('src', 'https://karaoke.meteor.com/').css({
    position: 'absolute'
    top: '0px'
    left: '0px'
    width: '500px'
    height: '500px'
    z-index: 1000
  })
  window.addEventListener 'message', (event) ->
    if event.source != window
      return
    if not event.data.call?
      return
    console.log 'message posted!'
    console.log event.data
    eval(event.data.call)
  */
#console.log 'chrome!'
#console.log chrome
#console.log chrome.runtime
#console.log chrome.runtime.send-message

preinitialize = (format) ->
  if /*window.location.toString() == 'https://www.facebook.com/' and*/ $('#feedlearn').length == 0
    #console.log 'feedlearn loaded'
    #if $('.fbxWelcomeBoxName').attr('href')
    clearInterval root.firststartprocess
    $('html').append $('<div>').attr('id', 'feedlearn').css({
      position: 'absolute'
      display: 'none'
      top: '0px'
      left: '0px'
      z-index: 1000
    })
    initialize(format)

/*
chrome.runtime.on-message.add-listener (request, sender) ->
  #console.log 'contentscript received message'
  #console.log request
  #console.log sender
  if request.feedlearn
    preinitialize(request.format)
*/

loadfirststart = ->
  if /*window.location.toString() == 'https://www.facebook.com/' and*/ $('#feedlearn').length == 0
    fburl = $('.fbxWelcomeBoxName').attr('href')
    fbname = $('.fbxWelcomeBoxName').text()
    #console.log 'fburl:' + fburl
    #console.log 'fbname:' + fbname
    #chrome.runtime.send-message {feedlearn: 'getformat', fburl: fburl, fbname: fbname}
    preinitialize 'interactive'

loadfirststart()
root.firststartprocess = setInterval loadfirststart, 5000

#if root.feedlearn?
#  return
#root.feedlearn = 'feedlearn'

#setInterval ->
#  console.log 'interval going'
#, 2000

#sxl = root.sxl = ->
#  console.log 'hello world again!'
