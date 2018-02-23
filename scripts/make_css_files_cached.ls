require! {
  fs
}

CleanCSS = require('clean-css')
options = {compatibility: '*'}
cssmin = new CleanCSS(options)

list_of_files_to_make_cached = [
  'bower_components/sweetalert2/dist/sweetalert2.css'
  'modules_custom/jquery.terminal/css/jquery.terminal.min.css'
]

output = {}
for filename in list_of_files_to_make_cached
  output[filename] = cssmin.minify(fs.readFileSync('src/' + filename, 'utf-8')).styles
fs.writeFileSync 'src/libs_common/css_files_cached.js', 'module.exports = ' + JSON.stringify(output) + ';'
