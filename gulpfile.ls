require! {
  'livescript'
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-livescript-async': 'gulp-livescript'
  'gulp-yaml'
  'gulp-eslint'
  'gulp-header'
  'path'
  'fs'
  'vinyl-named'
  'webpack'
  'gulp-vulcanize'
  'gulp-crisper'
  'del'
  'deepcopy'
  'js-yaml'
  'mkdirp'
  'glob'
  'bestzip'
  'chrome-web-store-item-property'
  'livereload'
  'semver'
  'deepmerge'
}

is_debug_build = false

#UglifyJSPlugin = require 'uglifyjs-webpack-plugin'
BabiliPlugin = require 'babel-minify-webpack-plugin'
UglifyJsPlugin = require 'uglifyjs-webpack-plugin'
HabitLabComponentRenamePlugin = require './webpack_habitlab_component_rename_plugin'
HabitLabComponentListPlugin = require './webpack_habitlab_component_list_plugin'

fse = require 'fs-extra'
webpack-stream = require 'webpack4-stream-watch'

process.on 'unhandledRejection', (reason, p) ->
  throw new Error(reason)

prelude = require 'prelude-ls'

gen_deps = require './scripts/generate_polymer_dependencies_lib.ls'
function_signatures = require './src/libs_common/function_signatures.ls'
webpack_config_frontend = require './webpack_config_frontend.ls'
webpack_config_backend = require './webpack_config_backend.ls'

lspattern = [
  'src/redirect.ls'
  'src/habitlab_website_redirect.ls'
  'src/components/*.ls'
  'src/fields/*.ls'
  'src/libs_frontend/**/*.ls'
  'src/libs_common/**/*.ls'
  'src/libs_backend/**/*.ls'
  'src/goals/**/*.ls'
]

lspattern_srcgen = [
  'src/**/*.ls'
]

enabled_intervention_list = []

do ->
  for info_yaml_filepath in glob.sync('src/interventions/**/*.yaml')
    info_yaml_data = js-yaml.safeLoad fs.readFileSync info_yaml_filepath
    if not info_yaml_data?
      console.log 'syntax error in yaml file: ' + info_yaml_filepath
    if not info_yaml_data.description?
      console.log 'missing description: ' + info_yaml_filepath
      continue
    if info_yaml_data.disabled
      console.log 'intervention disabled: ' + info_yaml_filepath
      continue
    basepath = info_yaml_filepath.substr(0, info_yaml_filepath.length - 10) # '/info.yaml'.length 
    basepath_parts = basepath.split('/')
    basepath = basepath_parts[basepath_parts.length - 2 to].join('/')
    enabled_intervention_list.push basepath

yamlpattern_manifest = [
  'src/manifest.yaml'
  'src/manifest_extra.yaml'
]

yamlpattern_base = [
  'src/goals/**/*.yaml'
  #'src/interventions/**/*.yaml'
  'src/fields/**/*.yaml'
]

do ->
  for enabled_intervention_name in enabled_intervention_list
    yamlpattern_base.push 'src/interventions/' + enabled_intervention_name + '/*.yaml'

yamlpattern = yamlpattern_manifest.concat(yamlpattern_base)

eslintpattern = [
  'src/**/*.js'
  'src_gen/**/*.js'
  #'src/components_skate/**/*.jsx'
  #'src_gen/components_skate/**/*.js'
  '!src/flowtypes/*.js'
  '!src/bundles/*.js'
  '!src_gen/bundles/*.js'
  '!src/bugmuncher/*.js'
  '!src_gen/bugmuncher/*.js'
  '!src/bower_components/**/*.js'
  '!src_gen/bower_components/**/*.js'
  '!src/**/*.deps.js'
  '!src/**/*.jspm.js'
  '!src/jspm_packages/**/*.js'
  '!src_gen/jspm_packages/**/*.js'
  '!src/modules_custom/**/*.js'
  '!src_gen/modules_custom/**/*.js'
]

jspattern_srcgen = [
  'src/**/*.js'
  '!src/flowtypes/*.js'
  '!src/**/*.deps.js'
]

htmlpattern_srcgen = [
  'src/**/*.html'
]

intervention_copypattern = []
do ->
  for enabled_intervention_name in enabled_intervention_list
    intervention_copypattern.push 'src_gen/interventions/' + enabled_intervention_name + '/**/*.js'
    intervention_copypattern.push 'src_gen/interventions/' + enabled_intervention_name + '/*.js'

#intervention_copypattern = [
#  'src_gen/interventions/**/*.js'
#]

copypattern = [
  'src/**/*.html'
  'src/**/*.png'
  'src/**/*.jpg'
  'src/**/*.gif'
  'src/**/*.svg'
  'src/*.json'
  'src/*.js'
  'src/*.css'
  'src/_locales/**/*'
  'src/bugmuncher/*'
  'src/bundles/*'
  'src/libs_common/*.js'
  'src/libs_backend/*.js'
  'src/libs_frontend/*.js'
  'src/goals/**/*.js'
  'src/generated_libs/**/*.js'
  'src/bower_components/**/*'
  'src/components/**/*.js'
  'src/modules_custom/**/*.js'
  'src/modules_custom/**/*.css'
  '!src/**/*.deps.js'
  '!src/**/*.jspm.js'
  '!src/jspm_packages/**/*'
]

do ->
  for src_subfolder in ['goals', 'modules_custom', 'components']
    for extension in ['html', 'png', 'jpg', 'gif', 'svg']
      copypattern.push 'src/' + src_subfolder + '/**/*.' + extension
  for enabled_intervention_name in enabled_intervention_list
    for extension in ['html', 'png', 'jpg', 'gif', 'svg']
      copypattern.push 'src/interventions/' + enabled_intervention_name + '/*.' + extension
      copypattern.push 'src/interventions/' + enabled_intervention_name + '/**/*.' + extension

#copyjspmpattern = [
#  'src/components/**/*.jspm.js'
#  'src/components/*.jspm.js'
#  'src/bower_components/**/*.jspm.js'
#]

copyrootpattern = [
  'jspm.config.js'
  'jspm_config_frontend.js'
  'jspm_config_backend.js'
]

webpack_pattern = [
  'src/backend/background.ls'
  'src/index.ls'
  'src/index_jspm.ls'
  'src/options.ls'
  'src/popup.ls'
  'src/index_loader.js'
]

webpack_pattern_content_scripts = [
  #'src/interventions/**/*.ls'
  #'src/interventions/**/*.js'
  'src/intervention_utils/**/*.ls'
  'src/intervention_utils/**/*.js'
  'src/frontend_utils/**/*.ls'
  'src/frontend_utils/**/*.js'
  'src/frontend_utils/*.ls'
  'src/frontend_utils/*.js'
  #'src/components_skate/components_skate.js'
  '!src/**/*.deps.js'
  '!src/**/*.jspm.js'
]

do ->
  for enabled_intervention_name in enabled_intervention_list
    webpack_pattern_content_scripts.push 'src/interventions/' + enabled_intervention_name + '/*.ls'
    webpack_pattern_content_scripts.push 'src/interventions/' + enabled_intervention_name + '/*.js'

webpack_vulcanize_pattern = [
  'src_vulcanize/components/components.js'
]

vulcanize_html_pattern = [
  'src_gen/components/components.html'
]

vulcanize_html_output_pattern = [
  'src_vulcanize/components/components.html'
]

vulcanize_watch_pattern = [
  'src/components/**/*.html'
  'src/components/**/*.js'
  'src/components/**/*.ls'
  '!src/**/*.deps.js'
  '!src/**/*.jspm.js'
]

eslint_config = js-yaml.safeLoad fs.readFileSync('.eslintrc.yaml', 'utf-8')
eslint_config.globals = Object.keys(eslint_config.globals)

gulp.task 'livescript_srcgen', ->
  gulp.src(lspattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen', {extension: '.js'}))
  #.pipe(gulp-print( -> "livescript_srcgen: #{it}" ))
  .pipe(gulp-livescript({bare: true}))
  .pipe(gulp-header('/* livescript */\n\n'))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('src_gen'))

gulp.task 'js_srcgen', ->
  return gulp.src(jspattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen'))
  #.pipe(gulp-print( -> "js_srcgen: #{it}" ))
  .pipe(gulp.dest('src_gen'))

gulp.task 'eslint', gulp.series gulp.parallel('livescript_srcgen', 'js_srcgen'), ->
  gulp.src(eslintpattern, {base: 'src'})
  #.pipe(gulp-print( -> "eslint_frontend: #{it}" ))
  .pipe(gulp-eslint(eslint_config))
  .pipe(gulp-eslint.formatEach('compact', process.stderr))

gulp.task 'livescript_build', ->
  gulp.src(lspattern, {base: 'src'})
  .pipe(gulp-changed('dist', {extension: '.js'}))
  .pipe(gulp-print( -> "livescript: #{it}" ))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))

empty_or_updated = (stream, cb, sourceFile, targetPath) ->
  if not fs.existsSync(targetPath)
    stream.push sourceFile
    return cb!
  if fs.statSync(targetPath).size == 0
    stream.push sourceFile
    return cb!
  return gulp-changed.compareLastModifiedTime(stream, cb, sourceFile, targetPath)

fromcwd = (x) ->
  path.join(process.cwd(), x)

run_gulp_webpack = (myconfig, options) ->
  options ?= {}
  {src_pattern, src_base} = options
  src_pattern ?= webpack_pattern
  src_base ?= 'src'
  current_dir = process.cwd()
  return gulp.src(src_pattern, {base: src_base})
  #.pipe(gulp-changed('dist', {extension: '.js', hasChanged: empty_or_updated}))
  .pipe(gulp-print( -> "webpack: #{it}" ))
  .pipe(vinyl-named( (file) ->
    relative_path = path.relative(path.join(current_dir, src_base), file.path)
    relative_path_noext = relative_path.replace(/\.jsx$/, '').replace(/\.js$/, '').replace(/\.ls$/, '')
    return relative_path_noext
  ))
  #.pipe(webpack-stream(myconfig).on('error', gulp-util.log))
  .pipe(webpack-stream(myconfig))
  .on('error', (err) ->
    gulp-util.log(err.message)
    this.emit('end')
  )
  .pipe(gulp.dest('dist'))

with_created_object = (orig_obj, func_to_apply) ->
  new_obj = deepcopy(orig_obj)
  func_to_apply(new_obj)
  return new_obj

webpack_config_watch = with_created_object webpack_config_backend, (o) ->
  o.watch = true
  o.devtool = false # comment out to generate source maps

webpack_config_nowatch = with_created_object webpack_config_backend, (o) ->
  o.watch = false
  o.devtool = false # comment out to generate source maps

webpack_config_watch_content_scripts = with_created_object webpack_config_frontend, (o) ->
  o.watch = true
  o.devtool = false # comment out to generate source maps
  o.plugins.push new HabitLabComponentRenamePlugin()

webpack_config_nowatch_content_scripts = with_created_object webpack_config_frontend, (o) ->
  o.watch = false
  o.devtool = false # comment out to generate source maps
  o.plugins.push new HabitLabComponentRenamePlugin()

webpack_config_nowatch_content_scripts_listcomponents = with_created_object webpack_config_frontend, (o) ->
  o.watch = false
  o.devtool = false # comment out to generate source maps
  o.plugins.push new HabitLabComponentListPlugin()


webpack_config_nosrcmap_watch = with_created_object webpack_config_backend, (o) ->
  o.watch = true
  o.devtool = false

webpack_config_nosrcmap_nowatch = with_created_object webpack_config_backend, (o) ->
  o.watch = false
  o.devtool = false

webpack_config_prod_nowatch = with_created_object webpack_config_backend, (o) ->
  #o.mode = 'production'
  o.watch = false
  o.devtool = false
  o.plugins.push new webpack.LoaderOptionsPlugin {
    debug: false
  }
  #o.plugins.push new HabitLabComponentRenamePlugin()
  #o.plugins.push new BabiliPlugin {}, {
  #  comments: false
  #}
  o.plugins.push new UglifyJsPlugin({
    uglifyOptions: {
      ie8: false,
      ecma: 8,
      output: {
        comments: false,
        beautify: false
      }
    }
  })
  /*
  if not o.optimization?
    o.optimization = {}
  o.optimization.minimizer = [
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        }
      }
    })
  ]
  */
  # o.optimization.push {
  #   runtimeChunk: false,
  #   splitChunks: {
  #     cacheGroups: {
  #       default: false,
  #       commons: {
  #         test: /[\\/]node_modules[\\/]/,
  #         name: 'vendor_app',
  #         chunks: 'all',
  #         minChunks: 2
  #       }
  #     }
  #   }
  # }

  # o.plugins.push new UglifyJSPlugin {
  #   uglifyOptions: {
  #     ie8: false
  #     ecma: 8
  #     output: {
  #       comments: false
  #       beautify: false
  #     }
  #   }
  # }

webpack_config_prod_nowatch_content_scripts = with_created_object webpack_config_frontend, (o) ->
  #o.mode = 'production'
  o.watch = false
  o.devtool = false
  o.plugins.push new webpack.LoaderOptionsPlugin {
    debug: false
  }
  o.plugins.push new HabitLabComponentRenamePlugin()
  #o.plugins.push new BabiliPlugin {}, {
  #  comments: false
  #}
  o.plugins.push new UglifyJsPlugin({
    uglifyOptions: {
      ie8: false,
      ecma: 8,
      output: {
        comments: false,
        beautify: false
      }
    }
  })
  /*
  if not o.optimization?
    o.optimization = {}
  o.optimization.minimizer = [
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        }
      }
    })
  ]
  */
  # o.plugins.push new UglifyJSPlugin {
  #   uglifyOptions: {
  #     ie8: false
  #     ecma: 8
  #     output: {
  #       comments: false
  #       beautify: false
  #     }
  #   }
  # }


gulp.task 'webpack_vulcanize', ->
  run_gulp_webpack webpack_config_nosrcmap_nowatch, {
    src_pattern: webpack_vulcanize_pattern
    src_base: 'src_vulcanize'
  }

gulp.task 'webpack_vulcanize_watch', ->
  run_gulp_webpack webpack_config_nosrcmap_watch, {
    src_pattern: webpack_vulcanize_pattern
    src_base: 'src_vulcanize'
  }

gulp.task 'webpack_vulcanize_prod', ->
  run_gulp_webpack webpack_config_prod_nowatch, {
    src_pattern: webpack_vulcanize_pattern
    src_base: 'src_vulcanize'
  }

gulp.task 'yaml_build_base', ->
  return gulp.src(yamlpattern_base, {base: 'src'})
  .pipe(gulp-changed('dist', {extension: '.json'}))
  .pipe(gulp-print( -> "yaml: #{it}" ))
  .pipe(gulp-yaml({space: 2}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))

gulp.task 'yaml_build_manifest', (done) ->
  manifest_file_contents = js-yaml.safeLoad fs.readFileSync('src/manifest.yaml')
  if is_debug_build
    manifest_file_contents.devtools_page = 'devtools.html'
  if fs.existsSync 'src/manifest_extra.yaml'
    manifest_file_extra = js-yaml.safeLoad fs.readFileSync 'src/manifest_extra.yaml'
    manifest_file_contents = deepmerge(manifest_file_contents, manifest_file_extra)
  fs.writeFileSync 'dist/manifest.json', JSON.stringify(manifest_file_contents, null, 2)
  done()

gulp.task 'yaml_build', gulp.parallel('yaml_build_base', 'yaml_build_manifest')

gulp.task 'copy_interventions', gulp.series gulp.parallel('livescript_srcgen', 'js_srcgen'), ->
  return gulp.src(intervention_copypattern, {root: 'src_gen/interventions'})
  .pipe(gulp-changed('dist/intervention_templates'))
  #.pipe(gulp-print( -> "copy: #{it}" ))
  .pipe(gulp.dest('dist/intervention_templates'))

gulp.task 'copy_build', ->
  return gulp.src(copypattern, {base: 'src'})
  .pipe(gulp-changed('dist'))
  #.pipe(gulp-print( -> "copy: #{it}" ))
  .pipe(gulp.dest('dist'))

#gulp.task 'copy_jspm_build', ->
#  console.log glob.sync('src/components/*.jspm.js')
#  #console.log gulp.src(copyjspmpattern, {base: 'src'}).pipe(gulp-print( -> "copy_jspm_available_files: #{it}" ))
#  return gulp.src(copyjspmpattern, {base: 'src'})
#  #.pipe(gulp-changed('dist'))
#  .pipe(gulp-print( -> "copy_jspm: #{it}" ))
#  .pipe(gulp.dest('dist'))

gulp.task 'copy_root_build', ->
  return gulp.src(copyrootpattern, {base: ''})
  .pipe(gulp-changed('dist'))
  .pipe(gulp.dest('dist'))

gulp.task 'generate_polymer_dependencies', (done) ->
  gen_deps.set_src_path(path.join(process.cwd(), 'src'))
  gen_deps.set_options()
  gen_deps.generate_dependencies_for_all_files_in_src_path()
  copy_file_pattern 'bower_components/**/*.deps.js', false
  copy_file_pattern 'components/**/*.deps.js', true
  done()

copy_file_patterns = (patterns, overwrite) ->
  if not overwrite?
    overwrite = false
  for pattern in patterns
    copy_file_pattern pattern, overwrite
  return

copy_file_pattern = (pattern, overwrite) ->
  if not overwrite?
    overwrite = false
  files_list = glob.sync path.join('src', pattern)
  existing_files_list = glob.sync path.join('dist', pattern)
  existing_files = {[x, true] for x in existing_files_list}
  for src_file in files_list
    dist_file = src_file.replace(/^src\//, 'dist/')
    if not overwrite
      if existing_files[dist_file]?
        continue
    fse.copySync src_file, dist_file
  return

gulp.task 'generate_polymer_dependencies_jspm', (done) ->
  gen_deps.set_src_path(path.join(process.cwd(), 'src'))
  gen_deps.set_options({target_jspm: true})
  gen_deps.generate_dependencies_for_all_files_in_src_path()
  copy_file_pattern 'bower_components/**/*.jspm.js', false
  copy_file_pattern 'components/**/*.jspm.js', true
  done()

gulp.task 'generate_interventions_list', (done) ->
  mkdirp.sync 'dist/interventions'
  #if fs.existsSync('src/interventions/interventions.yaml')
  #  fs.unlinkSync('src/interventions/interventions.yaml')
  output = []
  for info_yaml_filepath in glob.sync('src/interventions/**/info.yaml')
    intervention_info = js-yaml.safeLoad fs.readFileSync(info_yaml_filepath, 'utf-8')
    if not intervention_info?
      console.log "no intervention_info for intervention #{info_yaml_filepath}"
      continue
    if intervention_info.disabled
      continue
    intervention_name = info_yaml_filepath.replace(/^src\/interventions\//, '').replace(/\/info\.yaml$/, '')
    output.push intervention_name
  fs.writeFileSync 'dist/interventions/interventions.json', JSON.stringify(prelude.sort(output))
  done()

gulp.task 'generate_goals_list', (done) ->
  mkdirp.sync 'dist/goals'
  #if fs.existsSync('src/goals/goals.yaml')
  #  fs.unlinkSync('src/goals/goals.yaml')
  output = []
  for info_yaml_filepath in glob.sync('src/goals/**/info.yaml')
    goal_info = js-yaml.safeLoad fs.readFileSync(info_yaml_filepath, 'utf-8')
    if not goal_info?
      console.log "no goal_info for goal #{info_yaml_filepath}"
      continue
    if goal_info.disabled
      continue
    goal_name = info_yaml_filepath.replace(/^src\/goals\//, '').replace(/\/info\.yaml$/, '')
    output.push goal_name
  output.push 'debug/all_interventions'
  fs.writeFileSync 'dist/goals/goals.json', JSON.stringify(prelude.sort(output))
  done()

gulp.task 'generate_goal_intervention_info', (done) ->
  interventions = []
  goals = []
  output = {interventions, goals}
  intervention_name_to_info = {}
  for info_yaml_filepath in glob.sync('src/interventions/**/info.yaml')
    intervention_info = js-yaml.safeLoad fs.readFileSync(info_yaml_filepath, 'utf-8')
    if not intervention_info?
      console.log "no intervention_info for intervention #{info_yaml_filepath}"
      continue
    if intervention_info.disabled
      continue
    intervention_name = info_yaml_filepath.replace(/^src\/interventions\//, '').replace(/\/info\.yaml$/, '')
    intervention_name_to_info[intervention_name] = intervention_info
  goal_name_to_info = {}
  for info_yaml_filepath in glob.sync('src/goals/**/info.yaml')
    goal_info = js-yaml.safeLoad fs.readFileSync(info_yaml_filepath, 'utf-8')
    if not goal_info?
      console.log "no goal_info for goal #{info_yaml_filepath}"
      continue
    if goal_info.disabled
      continue
    goal_name = info_yaml_filepath.replace(/^src\/goals\//, '').replace(/\/info\.yaml$/, '')
    goal_name_to_info[goal_name] = goal_info
  # goals
  for goal_name in prelude.sort(Object.keys(goal_name_to_info))
    goal_info = goal_name_to_info[goal_name]
    if not goal_info?
      continue
    goal_info.name = goal_name
    if not goal_info.sitename?
      goal_info.sitename = goal_name.split('/')[0]
    if not goal_info.sitename_printable?
      goal_info.sitename_printable = goal_info.sitename.substr(0, 1).toUpperCase() + goal_info.sitename.substr(1)
    if not goal_info.homepage?
      goal_info.homepage = "https://www.#{goal_info.sitename}.com/"
    interventions_for_goal_new = []
    if not goal_info.interventions?
      console.log 'goal is missing interventions: ' + goal_name
      continue
    generic_intervention_categories = ['generic', 'generic_positive', 'video']
    generic_intervention_name_to_specific_name = {}
    for intervention_name in goal_info.interventions
      generic_intervention_name_to_specific_name[intervention_name] = intervention_name
      for generic_intervention_category in generic_intervention_categories
        generic_intervention_category_with_slash = generic_intervention_category + '/'
        if intervention_name.startsWith(generic_intervention_category_with_slash)
          generic_intervention = intervention_name
          make_absolute_path = (content_script) ->
            if content_script.path?
              if content_script.path[0] == '/'
                return content_script
              content_script.path = '/interventions/' + generic_intervention + '/' + content_script.path
              return content_script
            if content_script[0] == '/'
              return content_script
            return '/interventions/' + generic_intervention + '/' + content_script
          intervention_info = JSON.parse JSON.stringify intervention_name_to_info[generic_intervention]
          intervention_name = goal_info.sitename + '/' + generic_intervention.substr(generic_intervention_category_with_slash.length)
          intervention_info.generic_intervention = generic_intervention
          intervention_info.matches = [goal_info.domain]
          if intervention_info.content_scripts?
            intervention_info.content_scripts = intervention_info.content_scripts.map make_absolute_path
          if intervention_info.background_scripts?
            intervention_info.background_scripts = intervention_info.background_scripts.map make_absolute_path
          intervention_name_to_info[intervention_name] = intervention_info
          generic_intervention_name_to_specific_name[generic_intervention] = intervention_name
      intervention_info = intervention_name_to_info[intervention_name]
      if not intervention_info?
        console.log 'error: goal ' + goal_info.name + ' lists nonexistent intervention ' + intervention_name
        continue
      intervention_info.goals = [goal_info.name]
      interventions_for_goal_new.push intervention_name
    goal_info.interventions = interventions_for_goal_new
    if goal_info.default_interventions?
      goal_info.default_interventions = goal_info.default_interventions.map(-> generic_intervention_name_to_specific_name[it])
    else
      goal_info.default_interventions = goal_info.interventions
    goal_name_to_info[goal_name] = goal_info
    goals.push goal_info
  # interventions
  for intervention_name in prelude.sort(Object.keys(intervention_name_to_info))
    intervention_info = intervention_name_to_info[intervention_name]
    intervention_info.name = intervention_name
    generic_name = intervention_info.generic_intervention ? intervention_name
    if not intervention_info.sitename?
      intervention_info.sitename = intervention_name.split('/')[0]
    if not intervention_info.sitename_printable?
      intervention_info.sitename_printable = intervention_info.sitename.substr(0, 1).toUpperCase() + intervention_info.sitename.substr(1)
    is_default = false
    if intervention_info.goals?
      for goal_name in intervention_info.goals
        goal_info = goal_name_to_info[goal_name]
        if goal_info.default_interventions? and goal_info.default_interventions.includes(intervention_name)
          is_default = true
    intervention_info.is_default = is_default
    interventions.push intervention_info
  fs.writeFileSync 'dist/goal_intervention_info.json', JSON.stringify(output)
  done()

gulp.task 'generate_libs_frontend', (done) ->
  mkdirp.sync 'src/generated_libs/libs_frontend'
  for lib_name in prelude.sort(function_signatures.list_libs())
    lib_contents = """// This file is generated from libs_common/function_signatures.ls
    // Do not edit this file directly. To regenerate, run gulp
    const {import_lib} = require('libs_frontend/import_lib');
    module.exports = import_lib('#{lib_name}');

    """
    fs.writeFileSync "src/generated_libs/libs_frontend/#{lib_name}.js", lib_contents
  done()

gulp.task 'generate_expose_backend_libs', (done) ->
  mkdirp.sync 'src/generated_libs/libs_backend'
  output = []
  output.push "const {expose_lib} = require('libs_backend/expose_lib');"
  for lib_name in prelude.sort(function_signatures.list_libs())
    output.push "expose_lib('#{lib_name}', require('libs_backend/#{lib_name}'));"
  output.push ''
  fs.writeFileSync "src/generated_libs/libs_backend/expose_backend_libs.js", output.join("\n")
  done()

gulp.task 'generate_jspm_config_frontend', (done) ->
  {get_alias_info} = require './alias_utils'
  output = []
  path_map = {}
  for alias_info in get_alias_info()
    {path, frontend} = alias_info
    path_map[path] = frontend
  for libname in fs.readdirSync 'src/modules_custom'
    if libname.startsWith('.')
      continue
    package_json_file = "src/modules_custom/#{libname}/package.json"
    package_json = JSON.parse fs.readFileSync(package_json_file, 'utf-8')
    path_map[libname] = "modules_custom/#{libname}/#{package_json.main}"
  fs.writeFileSync 'jspm_config_frontend.js', """
  SystemJS.config({
  map: #{JSON.stringify(path_map, null, 2)}
  });
  """
  done()

gulp.task 'generate_jspm_config_backend', (done) ->
  {get_alias_info} = require './alias_utils'
  output = []
  path_map = {}
  for alias_info in get_alias_info()
    {path, backend} = alias_info
    path_map[path] = backend
  for libname in fs.readdirSync 'src/modules_custom'
    if libname.startsWith('.')
      continue
    package_json_file = "src/modules_custom/#{libname}/package.json"
    package_json = JSON.parse fs.readFileSync(package_json_file, 'utf-8')
    path_map[libname] = "modules_custom/#{libname}/#{package_json.main}"
  fs.writeFileSync 'jspm_config_backend.js', """
  SystemJS.config({
  map: #{JSON.stringify(path_map, null, 2)}
  });
  """
  done()

gulp.task 'generate_jspm_config', gulp.parallel('generate_jspm_config_frontend', 'generate_jspm_config_backend')

gulp.task 'generate_polymer_components_html', (done) ->
  #if fs.existsSync('src/components/components.html')
  #  fs.unlinkSync('src/components/components.yaml')
  output = []
  output.push '<!-- This file is generated by gulp. Do not edit -->'
  for filepath in prelude.sort(glob.sync('src/components/**/*.html'))
    file_name = filepath.replace(/^src\/components\//, '')
    if file_name == 'components.html'
      continue
    output.push "<link rel='import' href='#{file_name}'>"
  output.push ''
  fs.writeFileSync 'src/components/components.html', output.join("\n")
  done()

extra_folders = ['modules_custom', 'intervention_templates', 'generated_libs', 'bundles', 'bower_components', 'libs_frontend', 'libs_common', 'libs_backend', 'components']

gulp.task 'make_extra_file_list', (done) ->
  complete_file_list = []
  for subfolder in extra_folders
    for entry in glob.sync('dist/' + subfolder + '/**')
      entry = entry.replace('dist/', '')
      complete_file_list.push entry
  fs.writeFileSync 'dist/extra_file_list.json', JSON.stringify(complete_file_list)
  done()

gulp.task 'remove_extra_files', (done) ->
  for subfolder in extra_folders
    fse.removeSync 'dist/' + subfolder
  done()

gulp.task 'generate_skate_components_js', (done) ->
  #if fs.existsSync('src/components/components.html')
  #  fs.unlinkSync('src/components/components.yaml')
  output = []
  output.push '/* This file is generated by gulp. Do not edit */'
  all_files = glob.sync('src/components_skate/**/*.jsx').concat glob.sync('src/components_skate/**/*.ls')
  for filepath in prelude.sort(all_files)
    file_name = filepath.replace(/^src\//, '').replace(/\.jsx$/, '').replace(/\.ls$/, '')
    output.push "require('#{file_name}')"
  output.push ''
  fs.writeFileSync 'src/components_skate/components_skate.js', output.join("\n")
  done()

gulp.task 'set_is_debug_build_true', (done) ->
  is_debug_build := true
  done()

gulp.task 'build_base', gulp.series('set_is_debug_build_true', gulp.parallel(
  gulp.series('generate_polymer_components_html', 'generate_polymer_dependencies')
  gulp.series('generate_jspm_config', 'copy_root_build')
  #'generate_skate_components_js'
  'generate_libs_frontend'
  'generate_expose_backend_libs'
  'generate_interventions_list'
  'generate_goals_list'
  'generate_goal_intervention_info'
  'yaml_build'
  'copy_build'
  'livescript_build'
  'copy_interventions'
), 'make_extra_file_list')

# based on
# https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
# https://github.com/shama/webpack-stream
gulp.task 'webpack_build', ->
  run_gulp_webpack webpack_config_nowatch

gulp.task 'webpack_watch', ->
  run_gulp_webpack webpack_config_watch

gulp.task 'webpack_prod', ->
  run_gulp_webpack webpack_config_prod_nowatch

gulp.task 'webpack_content_scripts', ->
  run_gulp_webpack webpack_config_nowatch_content_scripts, {
    src_pattern: webpack_pattern_content_scripts
  }

gulp.task 'webpack_content_scripts_watch', ->
  run_gulp_webpack webpack_config_watch_content_scripts, {
    src_pattern: webpack_pattern_content_scripts
  }

gulp.task 'webpack_content_scripts_prod', ->
  run_gulp_webpack webpack_config_prod_nowatch_content_scripts, {
    src_pattern: webpack_pattern_content_scripts
  }

gulp.task 'html_srcgen', ->
  return gulp.src(htmlpattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen'))
  #.pipe(gulp-print( -> "html_srcgen: #{it}" ))
  .pipe(gulp.dest('src_gen'))

gulp.task 'vulcanize', gulp.series gulp.parallel('livescript_srcgen', 'js_srcgen', 'html_srcgen'), ->
  return gulp.src(vulcanize_html_pattern, {base: 'src_gen'})
  .pipe(gulp-vulcanize({
    #abspath: ''
    #excludes: []
    #stripExcludes: false
    inlineScripts: true
    inlineCss: false
  }))
  .pipe(gulp-crisper({
    #scriptInHead: false
    #onlySplit: false
    #jsFileName: 'components.js'
  }))
  .pipe(gulp.dest('src_vulcanize'))

gulp.task 'copy_vulcanize', gulp.series 'vulcanize', ->
  return gulp.src(vulcanize_html_output_pattern, {base: 'src_vulcanize'})
  .pipe(gulp.dest('dist'))

/*
tasks_and_patterns = [
  #['livescript_build', lspattern]
  #['copy_vulcanize', vulcanize_watch_pattern]
  #['typescript', tspattern]
  #['es6', es6pattern]
  ['yaml', yamlpattern]
  #['browserify_js', browserify_js_pattern]
  #['browserify_ls', browserify_ls_pattern]
  ['copy', copypattern]
  #['eslint', eslintpattern]
  #['livescript_browserify', lspattern_browserify]
]
*/

gulp.task 'make_docs_markdown', (done) ->
  {exec} = require 'shelljs'
  if not fs.existsSync('doc')
    fs.mkdirSync('doc')
  exec('node ./node_modules/documentation-habitlab/bin/documentation.js build src_gen/libs_frontend/*.js src_gen/libs_backend/*.js src_gen/libs_common/*.js src/flowtypes/*.js -f md -o doc/API.md --github')
  fse.copySync 'doc/API.md', 'dist/API.md'
  done()

gulp.task 'make_docs', gulp.series('livescript_srcgen', 'js_srcgen', 'make_docs_markdown')

#gulp.task 'build', ['webpack', 'webpack_content_scripts', 'webpack_vulcanize']
gulp.task 'build', gulp.parallel('build_base', 'webpack_build', 'webpack_content_scripts')

gulp.task 'listcomponents', ->
  run_gulp_webpack webpack_config_nowatch_content_scripts_listcomponents, {
    src_pattern: webpack_pattern_content_scripts
  }

gulp.task 'print_components_to_rename', (done) ->>
  storage = require 'node-persist'
  await storage.init()
  components_list = await storage.keys()
  console.log components_list
  done()

gulp.task 'build_release', gulp.parallel(gulp.series('build_base', 'make_docs_markdown'), 'webpack_prod', 'webpack_content_scripts_prod')

mkzip_function = (actually_delete, suffix, done) ->
  mkdirp.sync 'releases'
  manifest_info = js-yaml.safeLoad(fs.readFileSync('src/manifest.yaml'))
  version = manifest_info.version
  output_zip_file = path.join('releases', "habitlab_#{version}.zip")
  if suffix? and suffix.length > 0
    output_zip_file = path.join('releases', "habitlab_#{version}_#{suffix}.zip")
  if fs.existsSync('mkzip_tmp')
    fse.removeSync('mkzip_tmp')
  mkdirp.sync 'mkzip_tmp'
  files_to_skip = [
    'interventions/interventions.json'
    'goals/goals.json'
    'API.md'
    'popup_loader.js'
    'index_jspm.html'
    'index_jspm.js'
    'index_loader.js'
    'index.js'
    'systemjs_paths.js'
    'logs.html'
    'logs.js'
  ]
  input_files = []
  for filename in glob.sync('dist/**')
    if not fs.lstatSync(filename).isFile()
      continue
    skip_file = false
    x = filename.replace('dist/', '')
    for extra_folder in extra_folders
      if x.startsWith(extra_folder)
        skip_file = true
    if x.endsWith('/info.json') and (x.startsWith('goals/') or x.startsWith('interventions/'))
      skip_file = true
    if skip_file
      continue
    if files_to_skip.includes(x)
      continue
    input_files.push filename
  for x in input_files
    fse.ensureFileSync(x.replace('dist/', 'mkzip_tmp/'))
    fse.copySync(x, x.replace('dist/', 'mkzip_tmp/'))
  if not actually_delete
    done()
    return
  <- bestzip output_zip_file, ['mkzip_tmp/*']
  fse.removeSync('mkzip_tmp')
  done()
  return

gulp.task 'mkzip_fake', (done) ->
  mkzip_function(false, null, done)

gulp.task 'mkzip', (done) ->
  mkzip_function(true, null, done)

gulp.task 'mkzip_beta', (done) ->
  mkzip_function(true, 'beta', done)

gulp.task 'mkzip_release', (done) ->
  mkzip_function(true, 'release', done)

gulp.task 'buildmanifest_beta', (done) ->
  manifest_file_contents = js-yaml.safeLoad fs.readFileSync('src/manifest.yaml')
  if is_debug_build
    manifest_file_contents.devtools_page = 'devtools.html'
  if fs.existsSync 'src/manifest_extra_beta.yaml'
    manifest_file_extra = js-yaml.safeLoad fs.readFileSync 'src/manifest_extra_beta.yaml'
    manifest_file_contents = deepmerge(manifest_file_contents, manifest_file_extra)
  fs.writeFileSync 'dist/manifest.json', JSON.stringify(manifest_file_contents, null, 2)
  done()

gulp.task 'buildmanifest_release', (done) ->
  manifest_file_contents = js-yaml.safeLoad fs.readFileSync('src/manifest.yaml')
  if is_debug_build
    manifest_file_contents.devtools_page = 'devtools.html'
  if fs.existsSync 'src/manifest_extra_release.yaml'
    manifest_file_extra = js-yaml.safeLoad fs.readFileSync 'src/manifest_extra_release.yaml'
    manifest_file_contents = deepmerge(manifest_file_contents, manifest_file_extra)
  fs.writeFileSync 'dist/manifest.json', JSON.stringify(manifest_file_contents, null, 2)
  done()

gulp.task 'mkzip_beta', gulp.series('buildmanifest_beta', 'mkzip_beta')

gulp.task 'mkzip_release', gulp.series('buildmanifest_release', 'mkzip_release')

get_latest_published_version = ->>
  latest_published_version = '0.0.0'
  for extension_id in ['obghclocpdgcekcognpkblghkedcpdgd', 'bleifeoekkfhicamkpadfoclfhfmmina']
    chrome_store_item = await chrome-web-store-item-property(extension_id)
    published_version = chrome_store_item.version
    if semver.gt(published_version, latest_published_version)
      latest_published_version = published_version
  return latest_published_version

gulp.task 'newver', (done) ->>
  published_version = await get_latest_published_version()
  manifest_info = js-yaml.safeLoad(fs.readFileSync('src/manifest.yaml'))
  version = manifest_info.version
  if published_version == version
    version_parts = version.split('.')
    version_parts[*-1] = (parseInt(version_parts[*-1]) + 1).toString()
    manifest_info.version = version_parts.join('.')
    fs.writeFileSync 'src/manifest.yaml', js-yaml.safeDump(manifest_info)
  if done?
    done()
  return

gulp.task 'newver_forced', (done) ->
  manifest_info = js-yaml.safeLoad(fs.readFileSync('src/manifest.yaml'))
  version = manifest_info.version
  version_parts = version.split('.')
  version_parts[*-1] = (parseInt(version_parts[*-1]) + 1).toString()
  manifest_info.version = version_parts.join('.')
  fs.writeFileSync 'src/manifest.yaml', js-yaml.safeDump(manifest_info)
  done()

gulp.task 'yaml_watch_base', ->
  gulp.watch yamlpattern_base, gulp.series('yaml_build_base')

gulp.task 'yaml_watch_manifest', ->
  gulp.watch yamlpattern_manifest, gulp.series('yaml_build_manifest')

gulp.task 'yaml_watch', gulp.parallel('yaml_watch_base', 'yaml_watch_manifest')

gulp.task 'copy_watch', ->
  gulp.watch copypattern, gulp.series('copy_build')

gulp.task 'copy_root_watch', ->
  gulp.watch copyrootpattern, gulp.series('copy_root_build')

gulp.task 'livescript_watch', ->
  gulp.watch lspattern, gulp.series('livescript_build')

gulp.task 'generate_skate_components_js_watch', ->
  gulp.watch ['src/components_skate/**/*.jsx', 'src/components_skate/**/*.ls'], gulp.series('generate_skate_components_js')

gulp.task 'generate_polymer_dependencies_watch', ->
  gulp.watch ['src/components/**/*.html', '!src/components/components.html'], gulp.series('generate_polymer_components_html', 'generate_polymer_dependencies')

gulp.task 'generate_libs_frontend_watch', ->
  gulp.watch ['src/libs_common/function_signatures.ls'], gulp.parallel('generate_expose_backend_libs', 'generate_libs_frontend')

gulp.task 'generate_interventions_list_watch', ->
  gulp.watch ['src/interventions/**/info.yaml'], gulp.series('generate_interventions_list')

gulp.task 'generate_goals_list_watch', ->
  gulp.watch ['src/goals/**/info.yaml'], gulp.series('generate_goals_list')

gulp.task 'generate_goal_intervention_info_watch', ->
  gulp.watch ['src/interventions/**/info.yaml', 'src/goals/**/info.yaml'], gulp.series('generate_goal_intervention_info')

# TODO we can speed up the watch speed for browserify by using watchify
# https://github.com/marcello3d/gulp-watchify/blob/master/examples/simple/gulpfile.js
# https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
gulp.task 'watch_base', gulp.parallel(
  'webpack_watch'
  'webpack_content_scripts_watch'
  'yaml_watch'
  'copy_watch'
  'copy_root_watch'
  'livescript_watch'
  'generate_polymer_dependencies_watch'
  #'generate_skate_components_js_watch'
  'generate_libs_frontend_watch'
  'generate_interventions_list_watch'
  'generate_goals_list_watch'
  'generate_goal_intervention_info_watch'
)

/*
gulp.task 'watch_base', gulp.parallel 'webpack_watch', 'webpack_content_scripts_watch', ->
  for [task,pattern] in tasks_and_patterns
    gulp.watch pattern, [task]
  return
*/

gulp.task 'lint', gulp.series('eslint')

gulp.task 'lint_watch', gulp.series 'lint', ->
  gulp.watch eslintpattern, gulp.series('eslint')

gulp.task 'clean', ->
  del [
    'dist'
    'src_vulcanize'
    'src_gen'
    'src/generated_libs'
    'src/**/*.deps.js'
    'src/**/*.jspm.js'
    #'src/components_skate/components_skate.js'
    'src/components/components.html'
  ]

#gulp.task 'build_then_lint', ['webpack_watch', 'webpack_content_scripts_watch'], ->


#gulp.task 'watch', ['webpack_watch', 'webpack_content_scripts_watch', 'webpack_vulcanize_watch', 'lint_watch']
/*
gulp.task 'watch', ['build'], (done) ->
  gulp-util.log 'run-sequence starting'
  <- run-sequence ['webpack_watch', 'webpack_content_scripts_watch', 'lint_watch']
  gulp-util.log 'run-sequence done'
  done()
*/

gulp.task 'release', gulp.series 'newver', 'clean', 'build_release', 'mkzip_beta', 'mkzip_release'

gulp.task 'releasenew', gulp.series 'clean', 'build_release', 'mkzip_beta', 'mkzip_release'

gulp.task 'fakerelease', gulp.series 'build', 'mkzip_fake'

gulp.task 'watch', gulp.series('build_base', gulp.parallel('watch_base', 'lint', 'lint_watch', 'make_docs_markdown'))

gulp.task 'livereload', ->
  livereload_server = livereload.createServer({
    applyCSSLive: false
    applyImgLive: false
    exclusions: [
      '*.jspm.js'
      'components/*'
      'components/**/*'
    ]
    delay: 500
  })
  livereload_server.watch([
    'dist/index.js'
  ])

gulp.task 'default', gulp.parallel('watch', 'livereload')
