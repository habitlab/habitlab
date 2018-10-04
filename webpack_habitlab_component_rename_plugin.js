require('livescript-async')

const fs = require('fs')

const {
  RawSource
} = require('webpack-sources')

const {add_habitlab_prefix_to_polymer_elements, list_all_custom_polymer_elements} = require('./add_habitlab_prefix_to_polymer_elements')

let cached_storage = null

async function get_storage() {
  if (cached_storage != null) {
    return cached_storage
  }
  const storage = require('node-persist')

  await storage.init()

  //await storage.clear()
  cached_storage = storage
  return storage
}

const process = require('process')

let list_of_components_to_rename_cached = null

async function get_list_of_components_to_rename() {
  if (list_of_components_to_rename_cached != null) {
    return list_of_components_to_rename_cached
  }
  let storage = await get_storage()
  list_of_components_to_rename_cached = await storage.keys()
  return list_of_components_to_rename_cached
}

function HabitLabComponentRenamePlugin(options) {
}

HabitLabComponentRenamePlugin.prototype.apply = function(compiler) {
  const filename_to_cached_source = {}
  const filename_to_cached_output = {}
  compiler.plugin('emit', async function(compilation, callback) {
    console.log('rename plugin')
    for (let filename of Object.keys(compilation.assets)) {
      // console.log(filename)
      //Should I add 
      if (!(filename.startsWith('frontend_utils/') || filename.startsWith('interventions/') || filename.match(/^\d/))) {
        continue
      }
      console.log(filename);
      let source_text = compilation.assets[filename].source()
      let output_text
      if (source_text === filename_to_cached_source[filename]) {
        output_text = filename_to_cached_output[filename]
      } else {
        let list_of_components_to_rename = await get_list_of_components_to_rename()
        let list_of_components_declared_in_file = list_all_custom_polymer_elements(source_text)
        // console.log('components to rename')
        // console.log(list_of_components_to_rename)
        for (let component_name of list_of_components_declared_in_file) {
          if (!list_of_components_to_rename.includes(component_name)) {
            console.log('you must run the following command first:')
            console.log('gulp listcomponents')
            process.exit()
          }
        }
        output_text = 'window.habitlab_content_script = true;\n\n' + add_habitlab_prefix_to_polymer_elements(source_text, list_of_components_to_rename)
        filename_to_cached_output[filename] = output_text
        filename_to_cached_source[filename] = source_text
      }

      //let new_source_text = '/* inserted during postrocessing */\n\n' + source_text
      compilation.assets[filename] = new RawSource(output_text)
    }
    //console.log(Object.keys(compilation.assets))
    // console.log('CHUNKS')
    // compilation.chunks.forEach(function(chunk) {
    //   console.log('next chunk:')
    //   //console.log(chunk)
    //   console.log('\n\n')

    // })

    callback()
  })
}

module.exports = HabitLabComponentRenamePlugin
