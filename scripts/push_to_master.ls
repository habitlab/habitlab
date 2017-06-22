{exec} = require 'shelljs'

get_current_branch = ->
  exec('git branch').stdout.split('\n').filter(-> it.startsWith('*'))[0].replace('* ', '')

do ->
  current_branch = get_current_branch()
  if exec('git diff-index HEAD').stdout.length > 0
    console.log 'have uncommitted changes'
    return
  if current_branch == 'master'
    console.log 'is already on master'
    exec 'git pull origin master'
    exec 'git push origin master'
    return
  exec 'git pull origin ' + current_branch
  exec 'git push origin ' + current_branch
  exec 'git checkout master'
  exec 'git pull origin master'
  exec 'git merge ' + current_branch
  exec 'git push origin master'
  exec 'git checkout ' + current_branch

