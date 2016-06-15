(function(){
  var root, execute_content_script, insert_css, load_intervention, load_experiment, load_intervention_for_location, load_experiment_for_location, getLocation, getTabInfo, sendTab, split_list_by_length, message_handlers, ext_message_handlers, confirm_permissions, out$ = typeof exports != 'undefined' && exports || this;
  root = typeof exports != 'undefined' && exports !== null ? exports : this;
  execute_content_script = function(tabid, options, callback){
    if (options.run_at == null) {
      options.run_at = 'document_end';
    }
    if (options.all_frames == null) {
      options.all_frames = false;
    }
    if (tabid == null) {
      if (callback != null) {
        callback();
      }
      return;
    }
    return chrome.tabs.executeScript(tabid, {
      file: options.path,
      allFrames: options.all_frames,
      runAt: options.run_at
    }, function(){
      if (callback != null) {
        return callback();
      }
    });
  };
  insert_css = function(css_path, callback){
    if (callback != null) {
      return callback();
    }
  };
  out$.load_intervention = load_intervention = function(intervention_name, callback){
    console.log('start load_intervention ' + intervention_name);
    return get_interventions(function(all_interventions){
      var intervention_info;
      intervention_info = all_interventions[intervention_name];
      return chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function(tabs){
        var tabid;
        tabid = tabs[0].id;
        return async.eachSeries(intervention_info.content_scripts, function(options, ncallback){
          if (typeof options === 'string') {
            options = {
              path: options
            };
          }
          if (options.path[0] === '/') {
            options.path = 'interventions' + options.path;
          } else {
            options.path = "interventions/" + intervention_name + "/" + options.path;
          }
          return execute_content_script(tabid, options, ncallback);
        }, function(){
          console.log('done load_experiment ' + intervention_name);
          return typeof callback == 'function' ? callback() : void 8;
        });
      });
    });
  };
  load_experiment = function(experiment_name, callback){
    console.log('start load_experiment ' + experiment_name);
    return get_experiments(function(all_experiments){
      var experiment_info;
      experiment_info = all_experiments[experiment_name];
      return chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function(tabs){
        var tabid;
        tabid = tabs[0].id;
        return async.eachSeries(experiment_info.scripts, function(options, ncallback){
          if (typeof options === 'string') {
            options = {
              path: options
            };
          }
          if (options.path[0] === '/') {
            options.path = 'experiments' + options.path;
          } else {
            options.path = "experiments/" + experiment_name + "/" + options.path;
          }
          return execute_content_script(tabid, options, ncallback);
        }, function(){
          console.log('done load_experiment ' + experiment_name);
          if (callback != null) {
            return callback();
          }
        });
      });
    });
  };
  load_intervention_for_location = function(location, callback){
    return list_available_interventions_for_location(location, function(possible_interventions){
      return async.eachSeries(possible_interventions, function(intervention, ncallback){
        return load_intervention(intervention, ncallback);
      }, function(errors, results){
        return typeof callback == 'function' ? callback() : void 8;
      });
    });
  };
  load_experiment_for_location = function(location, callback){
    return list_available_experiments_for_location(location, function(possible_experiments){
      return async.eachSeries(possible_experiments, function(experiment, ncallback){
        return load_experiment(experiment, ncallback);
      }, function(errors, results){
        if (callback != null) {
          return callback();
        }
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
    'load_experiment': function(data, callback){
      var experiment_name;
      experiment_name = data.experiment_name;
      return load_experiment(experiment_name, function(){
        return callback();
      });
    },
    'load_experiment_for_location': function(data, callback){
      var location;
      location = data.location;
      return load_experiment_for_location(location, function(){
        return callback();
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
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (tab.url) {
      return list_available_interventions_for_location(tab.url, function(possible_interventions){
        if (possible_interventions.length > 0) {
          chrome.pageAction.show(tabId);
        } else {
          chrome.pageAction.hide(tabId);
        }
        return load_intervention_for_location(tab.url);
      });
    }
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
