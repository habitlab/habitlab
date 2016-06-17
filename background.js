(function(){
  var root, insert_css, running_background_scripts, load_background_script, wait_token_to_callback, make_wait_token, wait_for_token, finished_waiting, execute_content_scripts, load_intervention, load_intervention_for_location, getLocation, getTabInfo, sendTab, split_list_by_length, message_handlers, ext_message_handlers, confirm_permissions, navigation_occurred, out$ = typeof exports != 'undefined' && exports || this;
  root = typeof exports != 'undefined' && exports !== null ? exports : this;
  /*
  execute_content_script = (tabid, options, callback) ->
    #chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if not tabid?
      if callback?
        callback()
      return
    chrome.tabs.executeScript tabid, {file: options.path, allFrames: options.all_frames, runAt: options.run_at}, ->
      if callback?
        callback()
  */
  insert_css = function(css_path, callback){
    if (callback != null) {
      return callback();
    }
  };
  out$.running_background_scripts = running_background_scripts = {};
  load_background_script = function(options, intervention_info, callback){
    if (running_background_scripts[options.path] != null) {
      return typeof callback == 'function' ? callback() : void 8;
    }
    return $.get(options.path, function(background_script_text){
      var background_script_function, env;
      background_script_function = new Function('env', background_script_text);
      env = {
        intervention_info: intervention_info
      };
      background_script_function(env);
      running_background_scripts[options.path] = env;
      return typeof callback == 'function' ? callback() : void 8;
    });
  };
  out$.wait_token_to_callback = wait_token_to_callback = {};
  out$.make_wait_token = make_wait_token = function(){
    var wait_token;
    for (;;) {
      wait_token = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      if (!wait_token_to_callback[wait_token]) {
        return wait_token;
      }
    }
  };
  out$.wait_for_token = wait_for_token = function(wait_token, callback){
    return wait_token_to_callback[wait_token] = callback;
  };
  out$.finished_waiting = finished_waiting = function(wait_token, data){
    var callback;
    callback = wait_token_to_callback[wait_token];
    delete wait_token_to_callback[wait_token];
    return callback(data);
  };
  execute_content_scripts = function(content_script_options, callback){
    console.log('calling execute_content_scripts');
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      var tabid, wait_token, content_script_code;
      tabid = tabs[0].id;
      wait_token = make_wait_token();
      wait_for_token(wait_token, function(){
        console.log('wait token released');
        return typeof callback == 'function' ? callback() : void 8;
      });
      content_script_code = "(function(){\n  chrome.runtime.sendMessage({\n    type: 'load_content_scripts',\n    data: {\n      content_script_options: " + JSON.stringify(content_script_options) + ",\n      tabid: " + tabid + ",\n      wait_token: " + wait_token + ",\n      loaded_scripts: window.loaded_scripts || {},\n    },\n  });\n})();";
      console.log(content_script_code);
      return chrome.tabs.executeScript(tabid, {
        code: content_script_code
      });
    });
  };
  load_intervention = function(intervention_name, callback){
    console.log('start load_intervention ' + intervention_name);
    return get_interventions(function(all_interventions){
      var intervention_info;
      intervention_info = all_interventions[intervention_name];
      console.log(intervention_info);
      console.log('start load background scripts ' + intervention_name);
      return async.eachSeries(intervention_info.background_script_options, function(options, ncallback){
        return load_background_script(options, intervention_info, ncallback);
      }, function(){
        console.log('start load content scripts ' + intervention_name);
        return execute_content_scripts(intervention_info.content_script_options, function(){
          console.log('done load_intervention ' + intervention_name);
          return typeof callback == 'function' ? callback() : void 8;
        });
      });
    });
  };
  load_intervention_for_location = function(location, callback){
    return list_enabled_interventions_for_location(location, function(possible_interventions){
      return async.eachSeries(possible_interventions, function(intervention, ncallback){
        return load_intervention(intervention, ncallback);
      }, function(errors, results){
        return typeof callback == 'function' ? callback() : void 8;
      });
    });
  };
  getLocation = function(callback){
    console.log('calling getTabInfo');
    return getTabInfo(function(tabinfo){
      console.log('getTabInfo results');
      console.log(tabinfo);
      console.log(tabinfo.url);
      return callback(tabinfo.url);
    });
  };
  getTabInfo = function(callback){
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      console.log('getTabInfo results');
      console.log(tabs);
      if (tabs.length === 0) {
        return;
      }
      return chrome.tabs.get(tabs[0].id, callback);
    });
  };
  sendTab = function(type, data, callback){
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      console.log('sendTab results');
      console.log(tabs);
      if (tabs.length === 0) {
        return;
      }
      return chrome.tabs.sendMessage(tabs[0].id, {
        type: type,
        data: data
      }, {}, callback);
    });
  };
  out$.split_list_by_length = split_list_by_length = function(list, len){
    var output, curlist, i$, len$, x;
    output = [];
    curlist = [];
    for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
      x = list[i$];
      curlist.push(x);
      if (curlist.length === len) {
        output.push(curlist);
        curlist = [];
      }
    }
    if (curlist.length > 0) {
      output.push(curlist);
    }
    return output;
  };
  message_handlers = {
    'setvars': function(data, callback){
      return async.forEachOfSeries(data, function(v, k, ncallback){
        return setvar(k, v, function(){
          return ncallback();
        });
      }, function(){
        return callback();
      });
    },
    'getfield': function(name, callback){
      return getfield(name, callback);
    },
    'getfields': function(namelist, callback){
      return getfields(namelist, callback);
    },
    'getfields_uncached': function(namelist, callback){
      return getfields_uncached(namelist, callback);
    },
    'requestfields': function(info, callback){
      var fieldnames;
      fieldnames = info.fieldnames;
      return getfields(fieldnames, callback);
    },
    'requestfields_uncached': function(info, callback){
      var fieldnames;
      fieldnames = info.fieldnames;
      return getfields_uncached(fieldnames, callback);
    },
    'getvar': function(name, callback){
      return getvar(name, callback);
    },
    'getvars': function(namelist, callback){
      var output;
      output = {};
      return async.eachSeries(namelist, function(name, ncallback){
        return getvar(name, function(val){
          output[name] = val;
          return ncallback();
        });
      }, function(){
        return callback(output);
      });
    },
    'addtolist': function(data, callback){
      var list, item;
      list = data.list, item = data.item;
      return addtolist(list, item, callback);
    },
    'getlist': function(name, callback){
      return getlist(name, callback);
    },
    'getLocation': function(data, callback){
      return getLocation(function(location){
        console.log('getLocation background page:');
        console.log(location);
        return callback(location);
      });
    },
    'load_intervention': function(data, callback){
      var intervention_name;
      intervention_name = data.intervention_name;
      return load_intervention(intervention_name, function(){
        return callback();
      });
    },
    'load_intervention_for_location': function(data, callback){
      var location;
      location = data.location;
      return load_intervention_for_location(location, function(){
        return callback();
      });
    },
    'load_content_scripts': function(data, callback){
      var content_script_options, tabid, wait_token, loaded_scripts;
      content_script_options = data.content_script_options, tabid = data.tabid, wait_token = data.wait_token, loaded_scripts = data.loaded_scripts;
      return async.eachSeries(content_script_options, function(options, ncallback){
        if (loaded_scripts[options.path] != null) {
          return ncallback();
        }
        return chrome.tabs.executeScript(tabid, {
          file: options.path,
          allFrames: options.all_frames,
          runAt: options.run_at
        }, function(){
          return ncallback();
        });
      }, function(){
        var new_loaded_scripts, res$, k, ref$, v, i$, len$, options, content_script_code;
        res$ = {};
        for (k in ref$ = loaded_scripts) {
          v = ref$[k];
          res$[k] = v;
        }
        new_loaded_scripts = res$;
        for (i$ = 0, len$ = (ref$ = content_script_options).length; i$ < len$; ++i$) {
          options = ref$[i$];
          new_loaded_scripts[options.path] = true;
        }
        content_script_code = "(function() {\n  window.loaded_scripts = " + JSON.stringify(new_loaded_scripts) + "\n})();";
        return chrome.tabs.executeScript(tabid, {
          code: content_script_code
        }, function(){
          return finished_waiting(wait_token);
        });
      });
    }
  };
  ext_message_handlers = {
    'is_extension_installed': function(info, callback){
      return callback(true);
    },
    'requestfields': function(info, callback){
      return confirm_permissions(info, function(accepted){
        if (!accepted) {
          return;
        }
        return getfields(info.fieldnames, function(results){
          console.log('getfields result:');
          console.log(results);
          return callback(results);
        });
      });
    },
    'requestfields_uncached': function(info, callback){
      return confirm_permissions(info, function(accepted){
        if (!accepted) {
          return;
        }
        return getfields_uncached(info.fieldnames, function(results){
          console.log('getfields result:');
          console.log(results);
          return callback(results);
        });
      });
    },
    'get_field_descriptions': function(namelist, callback){
      return get_field_info(function(field_info){
        var output, i$, ref$, len$, x;
        output = {};
        for (i$ = 0, len$ = (ref$ = namelist).length; i$ < len$; ++i$) {
          x = ref$[i$];
          if (field_info[x] != null && field_info[x].description != null) {
            output[x] = field_info[x].description;
          }
        }
        return callback(output);
      });
    }
  };
  confirm_permissions = function(info, callback){
    var pagename, fieldnames;
    pagename = info.pagename, fieldnames = info.fieldnames;
    return get_field_info(function(field_info){
      var field_info_list, i$, ref$, len$, x, output;
      field_info_list = [];
      for (i$ = 0, len$ = (ref$ = fieldnames).length; i$ < len$; ++i$) {
        x = ref$[i$];
        output = {
          name: x
        };
        if (field_info[x] != null && field_info[x].description != null) {
          output.description = field_info[x].description;
        }
        field_info_list.push(output);
      }
      return sendTab('confirm_permissions', {
        pagename: pagename,
        fields: field_info_list
      }, callback);
    });
  };
  navigation_occurred = function(url, tabId){
    chrome.tabs.sendMessage(tabId, {
      type: 'navigation_occurred',
      data: {
        url: url,
        tabId: tabId
      }
    });
    return list_available_interventions_for_location(url, function(possible_interventions){
      if (possible_interventions.length > 0) {
        chrome.pageAction.show(tabId);
      } else {
        chrome.pageAction.hide(tabId);
      }
      return load_intervention_for_location(url);
    });
  };
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (tab.url) {
      if (changeInfo.status !== 'complete') {
        return;
      }
      return navigation_occurred(tab.url, tabId);
    }
  });
  chrome.webNavigation.onHistoryStateUpdated.addListener(function(info){
    return navigation_occurred(info.url, info.tabId);
  });
  chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse){
    var type, data, message_handler, whitelist, i$, len$, whitelisted_url, this$ = this;
    type = request.type, data = request.data;
    message_handler = ext_message_handlers[type];
    if (type === 'requestfields' || type === 'requestfields_uncached') {
      whitelist = ['http://localhost:8080/previewdata.html', 'http://tmi.netlify.com/previewdata.html', 'https://tmi.netlify.com/previewdata.html', 'https://tmi.stanford.edu/previewdata.html', 'https://tmisurvey.herokuapp.com/', 'http://localhost:8080/', 'https://localhost:8081/', 'https://tmi.stanford.edu/', 'http://localhost:3000/', 'http://browsingsurvey.herokuapp.com/', 'https://browsingsurvey.herokuapp.com/', 'http://browsingsurvey2.herokuapp.com/', 'https://browsingsurvey2.herokuapp.com/', 'http://browsingsurvey3.herokuapp.com/', 'https://browsingsurvey3.herokuapp.com/', 'http://browsingsurvey4.herokuapp.com/', 'https://browsingsurvey4.herokuapp.com/', 'http://browsingsurvey5.herokuapp.com/', 'https://browsingsurvey5.herokuapp.com/', 'http://browsingsurvey6.herokuapp.com/', 'https://browsingsurvey6.herokuapp.com/', 'http://browsingsurvey7.herokuapp.com/', 'https://browsingsurvey7.herokuapp.com/', 'http://browsingsurvey8.herokuapp.com/', 'https://browsingsurvey8.herokuapp.com/', 'http://browsingsurvey9.herokuapp.com/', 'https://browsingsurvey9.herokuapp.com/', 'http://browsingsurvey10.herokuapp.com/', 'https://browsingsurvey10.herokuapp.com/', 'http://browsingsurvey11.herokuapp.com/', 'https://browsingsurvey11.herokuapp.com/', 'http://browsingsurvey12.herokuapp.com/', 'https://browsingsurvey12.herokuapp.com/', 'http://browsingsurvey13.herokuapp.com/', 'https://browsingsurvey13.herokuapp.com/'];
      for (i$ = 0, len$ = whitelist.length; i$ < len$; ++i$) {
        whitelisted_url = whitelist[i$];
        if (sender.url.indexOf(whitelisted_url) === 0) {
          message_handler = message_handlers[type];
          break;
        }
      }
    }
    if (message_handler == null) {
      return;
    }
    message_handler(data, function(response){
      if (sendResponse != null) {
        return sendResponse(response);
      }
    });
    return true;
  });
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    var type, data, message_handler;
    type = request.type, data = request.data;
    console.log('onmessage');
    console.log(type);
    console.log(data);
    message_handler = message_handlers[type];
    if (message_handler == null) {
      return;
    }
    message_handler(data, function(response){
      if (sendResponse != null) {
        return sendResponse(response);
      }
    });
    return true;
  });
}).call(this);
