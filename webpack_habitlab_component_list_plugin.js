require('livescript-async')

const fs = require('fs')

const {
  RawSource
} = require('webpack-sources')

const {list_all_custom_polymer_elements} = require('./add_habitlab_prefix_to_polymer_elements')

let cached_storage = null

async function get_storage() {
  if (cached_storage != null) {
    return cached_storage
  }
  const storage = require('node-persist')

  await storage.init()

  await storage.clear()
  cached_storage = storage
  return storage
}

function HabitLabComponentRenamePlugin(options) {
}

HabitLabComponentRenamePlugin.prototype.apply = function(compiler) {
  const filename_to_cached_source = {}
  const filename_to_cached_output = {}
  compiler.plugin('emit', async function(compilation, callback) {
    for (let filename of Object.keys(compilation.assets)) {
      // console.log(filename)
      //Should I add 
      if (!(filename.startsWith('frontend_utils/') || filename.startsWith('interventions/') || filename.match(/^\d/))) {
        continue
      }
      console.log(filename);
      let source_text = compilation.assets[filename].source()
      console.log('source text is')
      console.log(source_text)
      let custom_elements = list_all_custom_polymer_elements(source_text)
      console.log('custom elements is')
      console.log(custom_elements)
      let storage = await get_storage()
      console.log('got storage')
      for (let custom_element of custom_elements) {
        await storage.setItem(custom_element, true)
      }
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
