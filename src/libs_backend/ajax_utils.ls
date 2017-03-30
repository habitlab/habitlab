{cfy} = require 'cfy'
$ = require 'jquery'

ajax = (options) ->>
  await $.ajax options

module.exports = {
  ajax: ajax
}