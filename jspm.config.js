SystemJS.config({});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "cfy": "npm:cfy@1.0.18",
    "jquery": "npm:jquery@3.1.0"
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
    }
  }
});
