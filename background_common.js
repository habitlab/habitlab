(function(){
  var getInterventionInfo, get_interventions, list_available_interventions_for_location, getDb, getCollection, getVarsCollection, getListsCollection, setvar, getvar, clearvar, printvar, addtolist, getlist, clearlist, printlist, clear_all_lists, clear_all_vars, clear_all, printcb, printfunc, out$ = typeof exports != 'undefined' && exports || this;
  out$.getInterventionInfo = getInterventionInfo = function(intervention_name, callback){
    return $.get("/interventions/" + intervention_name + "/info.yaml", function(intervention_info_text){
      var intervention_info;
      intervention_info = jsyaml.safeLoad(intervention_info_text);
      intervention_info.name = intervention_name;
      return callback(intervention_info);
    });
  };
  out$.get_interventions = get_interventions = memoizeSingleAsync(function(callback){
    return $.get('/interventions/interventions.yaml', function(interventions_list_text){
      var interventions_list, output, fix_content_script_options, fix_background_script_options;
      interventions_list = jsyaml.safeLoad(interventions_list_text);
      output = {};
      fix_content_script_options = function(options, intervention_name){
        if (typeof options === 'string') {
          options = {
            path: options
          };
        }
        if (options.path[0] === '/') {
          options.path = options.path.substr(1);
        } else {
          options.path = "interventions/" + intervention_name + "/" + options.path;
        }
        if (options.run_at == null) {
          options.run_at = 'document_end';
        }
        if (options.all_frames == null) {
          options.all_frames = false;
        }
        return options;
      };
      fix_background_script_options = function(options, intervention_name){
        if (typeof options === 'string') {
          options = {
            path: options
          };
        }
        if (options.path[0] === '/') {
          options.path = options.path.substr(1);
        } else {
          options.path = "interventions/" + intervention_name + "/" + options.path;
        }
        return options;
      };
      return async.mapSeries(interventions_list, function(intervention_name, ncallback){
        return getInterventionInfo(intervention_name, function(intervention_info){
          var res$, i$, ref$, len$, x;
          if (intervention_info.nomatches == null) {
            intervention_info.nomatches = [];
          }
          if (intervention_info.matches == null) {
            intervention_info.matches = [];
          }
          if (intervention_info.content_scripts == null) {
            intervention_info.content_scripts = [];
          }
          if (intervention_info.background_scripts == null) {
            intervention_info.background_scripts = [];
          }
          res$ = [];
          for (i$ = 0, len$ = (ref$ = intervention_info.content_scripts).length; i$ < len$; ++i$) {
            x = ref$[i$];
            res$.push(fix_content_script_options(x, intervention_name));
          }
          intervention_info.content_script_options = res$;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = intervention_info.background_scripts).length; i$ < len$; ++i$) {
            x = ref$[i$];
            res$.push(fix_background_script_options(x, intervention_name));
          }
          intervention_info.background_script_options = res$;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = intervention_info.matches).length; i$ < len$; ++i$) {
            x = ref$[i$];
            res$.push(new RegExp(x));
          }
          intervention_info.match_regexes = res$;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = intervention_info.nomatches).length; i$ < len$; ++i$) {
            x = ref$[i$];
            res$.push(new RegExp(x));
          }
          intervention_info.nomatch_regexes = res$;
          output[intervention_name] = intervention_info;
          return ncallback(null, null);
        });
      }, function(errors, results){
        return callback(output);
      });
    });
  });
  out$.list_available_interventions_for_location = list_available_interventions_for_location = function(location, callback){
    return get_interventions(function(all_interventions){
      var possible_interventions, intervention_name, intervention_info, blacklisted, i$, ref$, len$, regex, matches;
      possible_interventions = [];
      for (intervention_name in all_interventions) {
        intervention_info = all_interventions[intervention_name];
        blacklisted = false;
        for (i$ = 0, len$ = (ref$ = intervention_info.nomatch_regexes).length; i$ < len$; ++i$) {
          regex = ref$[i$];
          if (regex.test(location)) {
            blacklisted = true;
            break;
          }
        }
        if (blacklisted) {
          continue;
        }
        matches = false;
        for (i$ = 0, len$ = (ref$ = intervention_info.match_regexes).length; i$ < len$; ++i$) {
          regex = ref$[i$];
          if (regex.test(location)) {
            matches = true;
            break;
          }
        }
        if (matches) {
          possible_interventions.push(intervention_name);
        }
      }
      return callback(possible_interventions);
    });
  };
  out$.getDb = getDb = memoizeSingleAsync(function(callback){
    return new minimongo.IndexedDb({
      namespace: 'autosurvey'
    }, callback);
  });
  out$.getCollection = getCollection = function(collection_name, callback){
    return getDb(function(db){
      var collection;
      collection = db.collections[collection_name];
      if (collection != null) {
        callback(collection);
        return;
      }
      return db.addCollection(collection_name, function(){
        return callback(db.collections[collection_name]);
      });
    });
  };
  out$.getVarsCollection = getVarsCollection = memoizeSingleAsync(function(callback){
    return getCollection('vars', callback);
  });
  out$.getListsCollection = getListsCollection = memoizeSingleAsync(function(callback){
    return getCollection('lists', callback);
  });
  out$.setvar = setvar = function(name, val, callback){
    return getVarsCollection(function(data){
      return data.upsert({
        _id: name,
        val: val
      }, function(result){
        if (callback != null) {
          return callback();
        }
      });
    });
  };
  out$.getvar = getvar = function(name, callback){
    return getVarsCollection(function(data){
      return data.findOne({
        _id: name
      }, function(result){
        if (result != null) {
          callback(result.val);
        } else {
          callback(null);
        }
      });
    });
  };
  out$.clearvar = clearvar = function(name, callback){
    return getVarsCollection(function(data){
      return data.remove(name, function(){
        if (callback != null) {
          return callback();
        }
      });
    });
  };
  out$.printvar = printvar = function(name){
    return getvar(name, function(result){
      return console.log(result);
    });
  };
  out$.addtolist = addtolist = function(name, val, callback){
    return getListsCollection(function(data){
      return data.upsert({
        name: name,
        val: val
      }, function(result){
        if (callback != null) {
          return callback();
        }
      });
    });
  };
  out$.getlist = getlist = function(name, callback){
    return getListsCollection(function(data){
      return data.find({
        name: name
      }).fetch(function(result){
        var x;
        return callback((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = result).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.val);
          }
          return results$;
        }()));
      });
    });
  };
  out$.clearlist = clearlist = function(name, callback){
    return getListsCollection(function(data){
      return data.find({
        name: name
      }).fetch(function(result){
        return async.eachSeries(result, function(item, ncallback){
          return data.remove(item['_id'], function(){
            return ncallback();
          });
        }, function(){
          if (callback != null) {
            return callback();
          }
        });
      });
    });
  };
  out$.printlist = printlist = function(name){
    return getlist(name, function(result){
      return console.log(result);
    });
  };
  out$.clear_all_lists = clear_all_lists = function(callback){
    return getListsCollection(function(data){
      return data.find({}).fetch(function(result){
        return async.eachSeries(result, function(item, ncallback){
          return data.remove(item['_id'], function(){
            return ncallback();
          });
        }, function(){
          if (callback != null) {
            return callback();
          }
        });
      });
    });
  };
  out$.clear_all_vars = clear_all_vars = function(callback){
    return getVarsCollection(function(data){
      return data.find({}).fetch(function(result){
        return async.eachSeries(result, function(item, ncallback){
          return data.remove(item['_id'], function(){
            return ncallback();
          });
        }, function(){
          if (callback != null) {
            return callback();
          }
        });
      });
    });
  };
  out$.clear_all = clear_all = function(callback){
    return async.series([clear_all_vars, clear_all_lists], function(){
      if (callback != null) {
        return callback();
      }
    });
  };
  out$.printcb = printcb = function(x){
    return console.log(x);
  };
  out$.printfunc = printfunc = function(func){
    var args, res$, i$, to$, nargs, len$, x;
    res$ = [];
    for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    args = res$;
    res$ = [];
    for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
      x = args[i$];
      res$.push(x);
    }
    nargs = res$;
    nargs.push(printcb);
    return func.apply({}, nargs);
  };
}).call(this);
