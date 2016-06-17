(function(){
  var root, randstr, insertBeforeItem, insertIfMissing, idArraysEqual, keysInFirstButNotSecond, updateVisibleIds, initialize, preinitialize, loadfirststart;
  root = typeof exports != 'undefined' && exports !== null ? exports : this;
  randstr = function(){
    var chars, output, i$, i;
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
    output = '';
    for (i$ = 0; i$ < 24; ++i$) {
      i = i$;
      output += chars.charAt(Math.random() * chars.length);
    }
    return output;
  };
  insertBeforeItem = function(jfeeditem){
    var quizid;
    quizid = randstr();
    jfeeditem.before($('<a style="width: 495px; height: 300px" href="https://www.duolingo.com/" target="_blank"><img src="' + chrome.extension.getURL('interventions/duolingo/facebook_feed_link_injection/facebook-duolingo.png') + '"></a>'));
    /*
    jfeeditem.before $('<iframe>').css({
      width: '495px'
      height: '300px'
    }).attr('src', 'https://feedlearn.herokuapp.com/?facebook=true&quizid=' + quizid).attr('frameBorder', '0').addClass('feedlearnquiz').attr('id', quizid)
    */
  };
  root.numitems = 0;
  insertIfMissing = function(){
    var i$, ref$, len$, feeditem;
    for (i$ = 0, len$ = (ref$ = document.querySelectorAll('.mbm._5jmm,.userContentWrapper._5pcr')).length; i$ < len$; ++i$) {
      feeditem = ref$[i$];
      if (!feeditem.feedlearninserted) {
        feeditem.feedlearninserted = true;
        root.numitems += 1;
        if (root.numitems % 10 === 5) {
          insertBeforeItem($(feeditem));
        }
      }
    }
  };
  root.mostrecentmousemove = Date.now();
  root.timeopened = Date.now();
  root.prev_visible_quiz_ids = [];
  root.all_shown_times = {};
  idArraysEqual = function(a1, a2){
    var i$, to$, i;
    if (a1.length !== a2.length) {
      return false;
    }
    for (i$ = 0, to$ = a1.length; i$ < to$; ++i$) {
      i = i$;
      if (a1[i] !== a2[i]) {
        return false;
      }
    }
    return true;
  };
  keysInFirstButNotSecond = function(m1, m2){
    var output, i$, ref$, len$, k;
    output = [];
    for (i$ = 0, len$ = (ref$ = Object.keys(m1)).length; i$ < len$; ++i$) {
      k = ref$[i$];
      if (m2[k] == null) {
        output.push(k);
      }
    }
    return output;
  };
  updateVisibleIds = function(){
    var visible_quiz_ids, res$, i$, ref$, len$, quiz, visible_quiz_ids_map, id, prev_visible_quiz_ids_map, shown_ids, curtime, showntimes, newid, hidden_ids, changed_info, fburl, fbname;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = $('.feedlearnquiz').inViewport()).length; i$ < len$; ++i$) {
      quiz = ref$[i$];
      res$.push(quiz.id);
    }
    visible_quiz_ids = res$;
    if (!idArraysEqual(visible_quiz_ids, root.prev_visible_quiz_ids)) {
      res$ = {};
      for (i$ = 0, len$ = visible_quiz_ids.length; i$ < len$; ++i$) {
        id = visible_quiz_ids[i$];
        res$[id] = true;
      }
      visible_quiz_ids_map = res$;
      res$ = {};
      for (i$ = 0, len$ = (ref$ = root.prev_visible_quiz_ids).length; i$ < len$; ++i$) {
        id = ref$[i$];
        res$[id] = true;
      }
      prev_visible_quiz_ids_map = res$;
      shown_ids = keysInFirstButNotSecond(visible_quiz_ids_map, root.prev_visible_quiz_ids_map);
      curtime = Date.now();
      showntimes = {};
      for (i$ = 0, len$ = shown_ids.length; i$ < len$; ++i$) {
        newid = shown_ids[i$];
        root.all_shown_times[newid] = curtime;
        showntimes[newid] = curtime;
      }
      hidden_ids = keysInFirstButNotSecond(prev_visible_quiz_ids_map, visible_quiz_ids);
      for (i$ = 0, len$ = hidden_ids.length; i$ < len$; ++i$) {
        newid = hidden_ids[i$];
        showntimes[newid] = root.all_shown_times[newid];
      }
      changed_info = {};
      if (shown_ids.length > 0 || hidden_ids.length > 0) {
        fburl = $('.fbxWelcomeBoxName').attr('href');
        fbname = $('.fbxWelcomeBoxName').text();
        chrome.runtime.sendMessage({
          feedlearn: 'shownquizzeschanged',
          'visibleids': visible_quiz_ids,
          'shownids': shown_ids,
          'hiddenids': hidden_ids,
          'showntimes': showntimes,
          fburl: fburl,
          fbname: fbname
        });
      }
      root.prev_visible_quiz_ids = visible_quiz_ids;
    }
  };
  initialize = function(format){
    var fburl, fbname;
    if (!(format === 'link' || format === 'interactive' || format === 'none')) {
      fburl = $('.fbxWelcomeBoxName').attr('href');
      fbname = $('.fbxWelcomeBoxName').text();
      chrome.runtime.sendMessage({
        feedlearn: 'missingformat',
        fburl: fburl,
        fbname: fbname
      });
    }
    if (format !== 'none') {
      setInterval(function(){
        updateVisibleIds();
        insertIfMissing();
      }, 1000);
    }
    return $(document).mousemove(function(){
      root.mostrecentmousemove = Date.now();
    });
  };
  preinitialize = function(format){
    if ($('#feedlearn').length === 0) {
      clearInterval(root.firststartprocess);
      $('html').append($('<div>').attr('id', 'feedlearn').css({
        position: 'absolute',
        display: 'none',
        top: '0px',
        left: '0px',
        zIndex: 1000
      }));
      return initialize(format);
    }
  };
  /*
  chrome.runtime.on-message.add-listener (request, sender) ->
    #console.log 'contentscript received message'
    #console.log request
    #console.log sender
    if request.feedlearn
      preinitialize(request.format)
  */
  loadfirststart = function(){
    var fburl, fbname;
    if ($('#feedlearn').length === 0) {
      fburl = $('.fbxWelcomeBoxName').attr('href');
      fbname = $('.fbxWelcomeBoxName').text();
      return preinitialize('interactive');
    }
  };
  loadfirststart();
  root.firststartprocess = setInterval(loadfirststart, 5000);
}).call(this);
