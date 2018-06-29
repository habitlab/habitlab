let developer_mode;
if (chrome != null && chrome.runtime != null && chrome.runtime.getManifest != null) {
  const chrome_manifest = chrome.runtime.getManifest();
  developer_mode = chrome_manifest.update_url == null;
} else {
  developer_mode = true;
}

function make_substitutions (text, substitutions) {
  if (substitutions == null) {
    return text;
  }
  for (let i = 0; i < 9; ++i) {
    if (substitutions[i] == null) {
      return text;
    }
    const sub_str = '$' + (i+1);
    text = text.split(sub_str).join(substitutions[i]);
  }
  return text;
}

function to_ascii_localization_keyname(text) {
  var output = [];
  for (let c of text) {
    if (c == ' ') {
      output.push('_');
    } else if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(c) != -1) {
      output.push(c);
    }
  }
  return output.join('');
}

function msg(text, substitutions) {
  const keyname = to_ascii_localization_keyname(text);
  const translation = chrome.i18n.getMessage(keyname, substitutions)
  if (translation == null || translation == '') {
    if (developer_mode) {
      /*
      SystemJS.import('libs_common/localization_utils_backend').then(localization_utils => {
        localization_utils.record_unlocalized_string(text);
      });
      */
    }
    if (substitutions == null || substitutions.length == 0) {
      return text;
    }
    return make_substitutions(text, substitutions);
  }
  if (developer_mode) {
    /*
    SystemJS.import('libs_common/localization_utils_backend').then(localization_utils => {
      localization_utils.record_localized_string(text);
    });
    */
  }
  return translation;
}

module.exports = {
  to_ascii_localization_keyname,
  msg
}