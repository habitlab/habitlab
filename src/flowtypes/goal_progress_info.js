// @flow

type GoalProgressInfo = {
  /**
   * An object that describes progress made on a goal
   * @typedef {Object} GoalProgressInfo
   * @property {string} message - Human-readable measurement, ie 4 minutes
   * @property {number} progress - Numeric value of progress, in the units described by the units field
   * @property {number} reward - Numeric value for the reward function, between 0 to 1
   * @property {string} units - Units that the value of progress is measured in - ie, minutes
   */
  message: string,
  progress: number,
  reward: number,
  units: string,
}
