require('livescript-async')

const {
  RawSource
} = require('webpack-sources')

const add_habitlab_prefix_to_polymer_elements = require('./add_habitlab_prefix_to_polymer_elements')

function HabitLabComponentRenamePlugin(options) {
}

HabitLabComponentRenamePlugin.prototype.apply = function(compiler) {
  const filename_to_cached_source = {}
  compiler.plugin('emit', function(compilation, callback) {
    for (let filename of Object.keys(compilation.assets)) {
      if (!(filename.startsWith('frontend_utils/') || filename.startsWith('interventions/'))) {
        continue
      }
      let source_text = compilation.assets[filename].source()
      if (source_text === filename_to_cached_source[filename]) {
        continue
      }
      console.log(filename);
      filename_to_cached_source[filename] = source_text
      //let new_source_text = '/* inserted during postrocessing */\n\n' + source_text
      let new_source_text = 'window.habitlab_content_script = true;\n\n' + add_habitlab_prefix_to_polymer_elements(source_text)
      compilation.assets[filename] = new RawSource(new_source_text)
    }
    //console.log(Object.keys(compilation.assets))
    callback()
  })
}

module.exports = HabitLabComponentRenamePlugin
