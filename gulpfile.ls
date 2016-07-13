require! {
  'livescript'
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-livescript'
  'gulp-yaml'
  'gulp-eslint'
  'path'
  'fs'
  'webpack-stream'
  'vinyl-named'
  'webpack'
  'gulp-vulcanize'
  'gulp-crisper'
  'del'
  'deepcopy'
  'js-yaml'
  'mkdirp'
  'glob'
}

prelude = require 'prelude-ls'

gen_deps = require './scripts/generate_polymer_dependencies_lib.ls'
function_signatures = require './src/libs_common/function_signatures.ls'
webpack_config_frontend = require './webpack_config_frontend.ls'
webpack_config_backend = require './webpack_config_backend.ls'

lspattern = [
  'src/*.ls'
  'src/fields/*.ls'
  'src/libs_frontend/**/*.ls'
  'src/libs_common/**/*.ls'
  'src/libs_backend/**/*.ls'
]

lspattern_srcgen = [
  'src/**/*.ls'
]

yamlpattern = [
  'src/manifest.yaml'
  'src/goals/**/*.yaml'
  'src/interventions/**/*.yaml'
  'src/fields/**/*.yaml'
]

eslintpattern = [
  'src/**/*.js'
  'src_gen/**/*.js'
  'src/components_skate/**/*.jsx'
  'src_gen/components_skate/**/*.js'
  '!src/bower_components/**/*.js'
  '!src_gen/bower_components/**/*.js'
  '!src/**/*.deps.js'
]

jspattern_srcgen = [
  'src/**/*.js'
  '!src/**/*.deps.js'
]

htmlpattern_srcgen = [
  'src/**/*.html'
]

copypattern = [
  'src/**/*.html'
  'src/**/*.png'
  'src/*.js'
  'src/bower_components/**/*'
  '!src/components/components.html'
  '!src/**/*.deps.js'
]

webpack_pattern = [
  'src/backend/**/*.ls'
  'src/backend/**/*.js'
  'src/commonjs_compat/**/*.ls'
  'src/commonjs_compat/**/*.js'
  'src/index.ls'
  'src/options.ls'
  'src/popup.ls'
  '!src/**/*.deps.js'
]

webpack_pattern_content_scripts = [
  'src/interventions/**/*.ls'
  'src/interventions/**/*.js'
  #'src/components_skate/components_skate.js'
  '!src/**/*.deps.js'
]

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
]

gulp.task 'livescript_srcgen', ->
  gulp.src(lspattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen', {extension: '.js'}))
  #.pipe(gulp-print( -> "livescript_srcgen: #{it}" ))
  .pipe(gulp-livescript({bare: false}))
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
  .pipe(gulp-eslint({
    #parser: 'babel-eslint'
    parserOptions: {
      sourceType: 'script'
      ecmaVersion: 6
      ecmaFeatures: {
        'impliedStrict': true
        'jsx': true
      }
    }
    plugins: [
      'jsx-control-statements'
    ]
    extends: [
      'eslint:recommended'
      #'plugin:jsx-control-statements/recommended'
    ]
    env: {
      "jsx-control-statements/jsx-control-statements": true
    }
    envs: [
      'es6'
      'browser'
      'webextensions'
      #'node'
    ]
    globals: {
      #'$': true
      'require': true
      'env': true
      'exports': true
      'module': true
      'global_exports': true
      'Polymer': true
      'intervention': true
      #'jsyaml': true
      'IS_CONTENT_SCRIPT': true
    }
    rules: {
      'no-console': 'off'
      'no-unused-vars': 'off'
      #'no-unused-vars': ['warn', {args: 'none', vars: 'local'}]
      'comma-dangle': ['warn', 'only-multiline']
      #'strict': 2
      "jsx-control-statements/jsx-choose-not-empty": 1
      "jsx-control-statements/jsx-for-require-each": 1
      "jsx-control-statements/jsx-for-require-of": 1
      "jsx-control-statements/jsx-if-require-condition": 1
      "jsx-control-statements/jsx-otherwise-once-last": 1
      "jsx-control-statements/jsx-use-if-tag": 1
      "jsx-control-statements/jsx-when-require-condition": 1
      "jsx-control-statements/jsx-jcs-no-undef": 1
      "no-undef": 0 # Replace this with jsx-jcs-no-undef
    }
  }))
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

webpack_config_nowatch = with_created_object webpack_config_backend, (o) ->
  o.watch = false

webpack_config_watch_content_scripts = with_created_object webpack_config_frontend, (o) ->
  o.watch = true

webpack_config_nowatch_content_scripts = with_created_object webpack_config_frontend, (o) ->
  o.watch = false

webpack_config_nosrcmap_watch = with_created_object webpack_config_backend, (o) ->
  o.watch = true
  o.devtool = null

webpack_config_nosrcmap_nowatch = with_created_object webpack_config_backend, (o) ->
  o.watch = false
  o.devtool = null

webpack_config_prod_nowatch = with_created_object webpack_config_backend, (o) ->
  o.watch = false
  o.devtool = null
  o.debug = false
  o.module.loaders.push {
    test: /\.js$/
    loader: 'uglify-loader'
    exclude: [
      fromcwd('src')
      fromcwd('node_modules/webcomponentsjs-custom-element-v1')
    ]
  }

webpack_config_prod_nowatch_content_scripts = with_created_object webpack_config_frontend, (o) ->
  o.watch = false
  o.devtool = null
  o.debug = false
  o.module.loaders.push {
    test: /\.js$/
    loader: 'uglify-loader'
    exclude: [
      fromcwd('src')
      fromcwd('node_modules/webcomponentsjs-custom-element-v1')
    ]
  }


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

gulp.task 'yaml_build', ->
  return gulp.src(yamlpattern, {base: 'src'})
  .pipe(gulp-changed('dist', {extension: '.json'}))
  .pipe(gulp-print( -> "yaml: #{it}" ))
  .pipe(gulp-yaml({space: 2}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))

gulp.task 'copy_build', ->
  return gulp.src(copypattern, {base: 'src'})
  .pipe(gulp-changed('dist'))
  #.pipe(gulp-print( -> "copy: #{it}" ))
  .pipe(gulp.dest('dist'))

gulp.task 'generate_polymer_dependencies', (done) ->
  gen_deps.set_src_path(path.join(process.cwd(), 'src'))
  gen_deps.set_options()
  gen_deps.generate_dependencies_for_all_files_in_src_path()
  done()

gulp.task 'generate_interventions_list', (done) ->
  mkdirp.sync 'dist/interventions'
  #if fs.existsSync('src/interventions/interventions.yaml')
  #  fs.unlinkSync('src/interventions/interventions.yaml')
  output = []
  for info_yaml_filepath in glob.sync('src/interventions/**/info.yaml')
    intervention_info = js-yaml.safeLoad fs.readFileSync(info_yaml_filepath, 'utf-8')
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
    if goal_info.disabled
      continue
    goal_name = info_yaml_filepath.replace(/^src\/goals\//, '').replace(/\/info\.yaml$/, '')
    output.push goal_name
  output.push 'debug/all_interventions'
  fs.writeFileSync 'dist/goals/goals.json', JSON.stringify(prelude.sort(output))
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

gulp.task 'build_base', gulp.parallel(
  gulp.series('generate_polymer_components_html', 'generate_polymer_dependencies')
  'generate_skate_components_js'
  'generate_libs_frontend'
  'generate_expose_backend_libs'
  'generate_interventions_list'
  'generate_goals_list'
  'yaml_build'
  'copy_build'
)

# based on
# https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
# https://github.com/shama/webpack-stream
gulp.task 'webpack_build' ->
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

#gulp.task 'build', ['webpack', 'webpack_content_scripts', 'webpack_vulcanize']
gulp.task 'build', gulp.parallel 'build_base', 'webpack_build', 'webpack_content_scripts'

gulp.task 'release', gulp.parallel 'build_base', 'webpack_prod', 'webpack_content_scripts_prod' #, 'webpack_vulcanize_prod'

gulp.task 'yaml_watch', ->
  gulp.watch yamlpattern, gulp.series('yaml_build')

gulp.task 'copy_watch', ->
  gulp.watch copypattern, gulp.series('copy_build')

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

# TODO we can speed up the watch speed for browserify by using watchify
# https://github.com/marcello3d/gulp-watchify/blob/master/examples/simple/gulpfile.js
# https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
gulp.task 'watch_base', gulp.parallel(
  'webpack_watch'
  'webpack_content_scripts_watch'
  'yaml_watch'
  'copy_watch'
  'generate_polymer_dependencies_watch'
  'generate_skate_components_js_watch'
  'generate_libs_frontend_watch'
  'generate_interventions_list_watch'
  'generate_goals_list_watch'
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
    'src/components_skate/components_skate.js'
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

gulp.task 'watch', gulp.series('build_base', gulp.parallel('watch_base', 'lint', 'lint_watch'))

gulp.task 'default', gulp.series('watch')
