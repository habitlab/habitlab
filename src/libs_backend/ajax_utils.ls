{cfy} = require 'cfy'
$ = require 'jquery'

ajax = cfy (options) ->*
  yield $.ajax options

module.exports = {
  ajax: ajax
}