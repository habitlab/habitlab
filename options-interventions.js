(function(){
  Polymer({
    is: 'options-interventions',
    properties: {
      sites_and_interventions: {
        type: Array,
        value: [],
        notify: true
      }
    },
    intervention_changed: function(evt){
      var checked, intervention_name;
      checked = evt.target.checked;
      intervention_name = evt.target.intervention.name;
      if (checked) {
        return set_intervention_enabled(intervention_name);
      } else {
        return set_intervention_disabled(intervention_name);
      }
    },
    ready: function(){
      var self;
      self = this;
      return get_interventions(function(intervention_name_to_info){
        var sitename_to_interventions, intervention_name, intervention_info, sitename, list_of_sites_and_interventions, list_of_sites, enabled_interventions, i$, len$, current_item, j$, ref$, len1$, intervention, this$ = this;
        sitename_to_interventions = {};
        for (intervention_name in intervention_name_to_info) {
          intervention_info = intervention_name_to_info[intervention_name];
          sitename = intervention_name.split('/')[0];
          if (sitename_to_interventions[sitename] == null) {
            sitename_to_interventions[sitename] = [];
          }
          sitename_to_interventions[sitename].push(intervention_info);
        }
        list_of_sites_and_interventions = [];
        list_of_sites = prelude.sort(Object.keys(sitename_to_interventions));
        enabled_interventions = get_enabled_interventions();
        for (i$ = 0, len$ = list_of_sites.length; i$ < len$; ++i$) {
          sitename = list_of_sites[i$];
          current_item = {
            sitename: sitename
          };
          current_item.interventions = prelude.sortBy(fn$, sitename_to_interventions[sitename]);
          for (j$ = 0, len1$ = (ref$ = current_item.interventions).length; j$ < len1$; ++j$) {
            intervention = ref$[j$];
            intervention.enabled = enabled_interventions[intervention.name] != null;
          }
          list_of_sites_and_interventions.push(current_item);
        }
        return self.sites_and_interventions = list_of_sites_and_interventions;
        function fn$(it){
          return it.name;
        }
      });
    }
  });
}).call(this);
