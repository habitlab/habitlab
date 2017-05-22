// @flow

type InterventionInfo = {
  /**
   * An object that describes the intervention info
   * @typedef {Object} InterventionInfo
   * @property {string} name - Name of the intervention, ie facebook/remove_comments
   * @property {string} sitename - Name of site on which the intervention operates
   * @property {string} sitename_printable - Human-readable name of site on which the intervention operates
   * @property {string} description - Human-readable description of the intervention
   * @property {Array.<string>} goals - List of goals this intervention satisfies
   */
  name: string,
  sitename: string,
  sitename_printable: string,
  description: string,
  goals: Array<string>,
}
