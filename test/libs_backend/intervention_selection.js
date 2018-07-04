/**
 * This test code will test our intervention selection algorithms on various generated data sets.
 * Written for mocha. 
 * Run`./node_modules/mocha/bin/mocha test/libs_backend/intervention_selection.js`
 */

 /**
  * A simulated user with somewhat predictable behavior between different interventions.
  */
 class User {
   /**
    * Instantiates user with behavior.
    * @param {intervention: {min, max}} behavior min and max seconds user will spend on intervention
    */
  constructor(behavior){
    if (typeof behavior == undefined) {
      this.behavior = gen_random_behavior(); //TODO
    } else {
      this.behavior = behavior;
    }
  }

  /**
    * Spends time on intervention.
    * @param {string} intervention name of intervention.
    * @return {time, regret} number of seconds spent on intervention and calculated regret.
    */
  spendTime(intervention) {
    var best_choice, intervention_time;
    for (var intervention_name in this.behavior) {
      let time = this.behavior[intervention_name].min + Math.random() * (this.behavior[intervention_name].max - this.behavior[intervention_name].min);   
      if (best_choice == null || best_choice > time) {
        best_choice = time;   
      }
      if (intervention_name == intervention) {
        intervention_time = time;
      }
    }
    return {time: intervention_time, regret: intervention_time - best_choice}
  }
}

let interventions = ["facebook/feed_injection_timer", "facebook/remove_news_feed", "facebook/rich_notifications", "facebook/remove_comments", "facebook/remove_clickbait", "facebook/toast_notifications", "facebook/show_timer_banner", "facebook/scroll_blocker", "facebook/show_user_info_interstitial", "facebook/make_user_wait", "facebook/close_tab_timer", "facebook/block_after_interval_per_visit", "facebook/prompt_reason"];

/**
 * @param {string} special name of intervention to favor.
 * @param {[string]} interventions listo f interventions.
 * @return {intervention: {min, max}} behavior with one intervention's time
 * significantly smaller than the other interventions.
 */
let gen_behavior_to_favor_one_intervention = function(interventions, special) {
  var behavior = {};
  let small_range = {};
  small_range.min =  Math.random() * 50;
  small_range.max = small_range.min + 10;
  let large_range = {};
  large_range.min =  100 + Math.random() * 50;
  large_range.max = large_range.min + 10;
  for (var i = 0; i < interventions.length; i++) {
    intervention = interventions[i];
    if (special == intervention) {
      behavior[intervention] = small_range;
    }  else {
      behavior[intervention] = large_range;
    }
  }
  return behavior;
}

var assert = require('assert');
let ThompsonMAB = require('libs_backend/multi_armed_bandit_thompson').ThompsonMAB;
let algorithms = require('libs_backend/intervention_selection_algorithms');
let log_utils = require('libs_backend/log_utils');

describe ('Thompson Sampling', function() {
  let special_intervention = "facebook/rich_notifications";
  it('Should choose the intervention ' + special_intervention + ' over time after sufficient training', function() {
    // Note: there is a very, very small chance this test will not pass.
    let behavior = gen_behavior_to_favor_one_intervention(interventions, special_intervention);
    let user = new User(behavior);
    let bandit = new ThompsonMAB(interventions);
    //Now, let's train this guy.
    for (var i = 0; i < 10000; i++) {
      intervention = bandit.predict();
      bandit.learn(intervention, user.spendTime(intervention).time);
    }
    assert(bandit.predict() == special_intervention);
  });
  it('Prediction should be stochastic', function() {
     // Note: there is a very, very small chance this test will not pass. 
     let bandit = new ThompsonMAB(interventions);
     for (var i = 0; i < 10; i++) {
      if (bandit.predict() != bandit.predict()) {
        return;
      }
     }
     throw 'Got same result 20 times in a row. Probably not stochastic.';   
  });
  it('Regret should converge to 0.', function () {
    let epsilon = .15;
    let behavior = gen_behavior_to_favor_one_intervention(interventions, special_intervention);
    let user = new User(behavior);
    let bandit = new ThompsonMAB(interventions);
    let cumulative_regret = 0;
    let num_sessions = 1;
    let ATTEMPTS = 1000000000;
    for (var i = 0; i < ATTEMPTS; i++) {
      intervention = bandit.predict();
      let session = user.spendTime(intervention);
      cumulative_regret += session.regret;
      if (cumulative_regret/++num_sessions < epsilon) {
        return;
      }
      bandit.learn(intervention, session.time);
    }
    throw 'Did not converge to 0 within ' + ATTEMPTS + ' attempts!!';
  });
});
/*
This code doesn't work because it uses the DB and the testing environment doesn't deal with the DB too well.
describe('Novelty', async function(){
  it('Should choose same option each time.', async function() {
    //precondition: must have at least one goal.
    let prevChoice = (await algorithms.novelty());
    console.log('prevChoice: ' + prevChoice);
    for (var i = 0; i < 1000; i++) {
      assert (prevChoice == (await algorithms.novelty())[0]);
    }   
  });
  it('Should recommend different choice each time.', async function() {
    //var prevChoice = (await algorithms.novelty())[0];
    //console.log("Over here: " + prevChoice);
    for (var i = 0; i < 1000; i++) {
      // Note: this will mess up the user's db information regarding time since last session with that intervention.
      // Update last_time_checked to reflect that we had that nudge.
      // Must have at least one goal.
      //await log_utils.log_intervention_suggested_internal(prevChoice, {});
      //let newChoice = (await algorithms.novelty())[0];
      //assert(newChoice != prevChoice);
      //prevChoice = newChoice;
    }
  });
});*/