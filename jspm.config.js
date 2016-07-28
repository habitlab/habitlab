SystemJS.config({});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "cfy": "npm:cfy@1.0.18",
    "enable-webcomponents-in-content-scripts": "npm:enable-webcomponents-in-content-scripts@1.0.7",
    "jquery": "npm:jquery@3.1.0",
    "moment": "npm:moment@2.14.1",
    "prelude-ls": "npm:prelude-ls@1.1.2",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "promise-debounce": "npm:promise-debounce@1.0.1",
    "sweetalert2": "npm:sweetalert2@4.0.15",
    "text": "github:systemjs/plugin-text@0.0.8"
  },
  packages: {
    "npm:cfy@1.0.18": {
      "map": {
        "co": "npm:co@4.6.0",
        "unthenify": "npm:unthenify@1.0.2"
      }
    },
    "npm:unthenify@1.0.2": {
      "map": {
        "util-arity": "npm:util-arity@1.0.2"
      }
    },
    "npm:enable-webcomponents-in-content-scripts@1.0.7": {
      "map": {
        "webcomponentsjs-custom-element-v0": "npm:webcomponentsjs-custom-element-v0@1.0.1"
      }
    },
    "npm:sweetalert2@4.0.15": {
      "map": {
        "es6-promise": "npm:es6-promise@3.2.1"
      }
    }
  }
});
