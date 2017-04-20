require! {
  fs
  path
  process
}

{copySync} = require 'fs-extra'
{exec} = require 'shelljs'

exec 'scripts/make_docs'

habitlab_dir = process.cwd()

if fs.existsSync('../habitlab.wiki')
  process.chdir('../habitlab.wiki')
else
  process.chdir('..')
  exec 'git clone git@github.com:habitlab/habitlab.wiki.git'
  process.chdir('habitlab.wiki')
exec 'git reset --hard'
exec 'git pull origin master'
copySync path.join(habitlab_dir, 'doc', 'API.md'), 'API.md'
exec 'git add API.md'
exec 'git commit -m "updated API.md"'
exec 'git push origin master'

process.chdir habitlab_dir
exec 'netlify deploy -p doc'
