// @flow

type GoalInfo = {
  /**
   * An object that describes the goal info
   * @typedef {Object} GoalInfo
   * @property {string} name - Name of the goal, ie facebook/spend_less_time
   * @property {string} domain - Domain on which this goal operates, ie www.facebook.com
   * @property {string} sitename - Name of site on which the goal operates, ie facebook
   * @property {string} sitename_printable - Human-readable name of site on which the goal operates, ie Facebook
   * @property {string} description - Human-readable description of the goal
   * @property {Array.<InterventionName>} interventions - The list of interventions that satisfy this goal
   */
  name: string,
  domain: string,
  sitename: string,
  sitename_printable: string,
  description: string,
  interventions: Array<InterventionName>,
}
