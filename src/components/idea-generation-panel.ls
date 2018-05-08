prelude = require 'prelude-ls'
$ = require 'jquery'

swal = require 'sweetalert2'


{load_css_file} = require 'libs_common/content_script_utils'

{
  get_enabled_goals
  get_goals
  set_goal_target
  get_goal_target
  remove_custom_goal_and_generated_interventions
  add_enable_custom_goal_reduce_time_on_domain
  set_goal_enabled_manual
  set_goal_disabled_manual
} = require 'libs_backend/goal_utils'

{
  get_interventions
  get_enabled_interventions
  set_intervention_disabled
} = require 'libs_backend/intervention_utils'


{
  enable_interventions_because_goal_was_enabled

} = require 'libs_backend/intervention_manager'

{
  get_baseline_time_on_domains
  list_all_domains_in_history
} = require 'libs_backend/history_utils'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  get_canonical_domain
} = require 'libs_backend/canonical_url_utils'

{
  get_favicon_data_for_domain_cached
} = require 'libs_backend/favicon_utils'

{
  promise_all_object
} = require 'libs_common/promise_utils'

{
  msg
} = require 'libs_common/localization_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'idea-generation-panel'
  properties: {
    # properties
  }
  # functions


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