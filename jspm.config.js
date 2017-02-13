SystemJS.config({
  transpiler: false
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "brace": "npm:brace@0.9.1",
    "cheerio": "npm:cheerio@0.22.0",
    "child_process": "npm:jspm-nodelibs-child_process@0.2.0",
    "co": "npm:co@4.6.0",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "esprima": "npm:esprima@3.1.3",
    "js-yaml": "github:nodeca/js-yaml@master",
    "jspm-nodelibs-process": "npm:jspm-nodelibs-process@0.2.0",
    "list_requires_multi": "npm:list_requires_multi@1.0.0",
    "livescript15": "npm:livescript15@1.5.4",
    "async": "npm:async@2.1.4",
    "assert": "npm:jspm-nodelibs-assert@0.2.0",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.1",
    "cfy": "npm:cfy@1.0.18",
    "dexie": "npm:dexie@1.5.1",
    "enable-webcomponents-in-content-scripts": "npm:enable-webcomponents-in-content-scripts@1.0.7",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "jquery": "npm:jquery@3.1.1",
    "mathjs": "npm:mathjs@3.9.0",
    "moment": "npm:moment@2.17.1",
    "nodeca/js-yaml": "github:nodeca/js-yaml@master",
    "os": "npm:jspm-nodelibs-os@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.1",
    "percipio": "npm:percipio@0.1.2",
    "prelude-ls": "npm:prelude-ls@1.1.2",
    "prettier-min": "npm:prettier-min@0.15.3",
    "prettyprintjs": "npm:prettyprintjs@0.1.11",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "promise-debounce": "npm:promise-debounce@1.0.1",
    "readline": "npm:jspm-nodelibs-readline@0.2.0",
    "repl": "npm:jspm-nodelibs-repl@0.2.0",
    "shuffled": "npm:shuffled@1.0.0",
    "sortablejs": "npm:sortablejs@1.5.0-rc1",
    "stream": "npm:jspm-nodelibs-stream@0.2.0",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.0",
    "sweetalert2": "npm:sweetalert2@6.3.2",
    "sweetjs-min": "npm:sweetjs-min@2.2.3",
    "text": "github:systemjs/plugin-text@0.0.8",
    "tty": "npm:jspm-nodelibs-tty@0.2.0",
    "underscore": "npm:underscore@1.8.3",
    "util": "npm:jspm-nodelibs-util@0.2.1",
    "vm": "npm:jspm-nodelibs-vm@0.2.0"
  },
  packages: {
    "npm:cfy@1.0.18": {
      "map": {
        "co": "npm:co@4.6.0",
        "unthenify": "npm:unthenify@1.0.4"
      }
    },
    "npm:enable-webcomponents-in-content-scripts@1.0.7": {
      "map": {
        "webcomponentsjs-custom-element-v0": "npm:webcomponentsjs-custom-element-v0@1.0.1"
      }
    },
    "npm:percipio@0.1.2": {
      "map": {
        "fast-csv": "npm:fast-csv@0.5.7",
        "underscore": "npm:underscore@1.8.3"
      }
    },
    "npm:fast-csv@0.5.7": {
      "map": {
        "is-extended": "npm:is-extended@0.0.10",
        "extended": "npm:extended@0.0.6",
        "string-extended": "npm:string-extended@0.0.8",
        "object-extended": "npm:object-extended@0.0.7"
      }
    },
    "npm:is-extended@0.0.10": {
      "map": {
        "extended": "npm:extended@0.0.6"
      }
    },
    "npm:string-extended@0.0.8": {
      "map": {
        "extended": "npm:extended@0.0.6",
        "is-extended": "npm:is-extended@0.0.10",
        "date-extended": "npm:date-extended@0.0.6",
        "array-extended": "npm:array-extended@0.0.11"
      }
    },
    "npm:object-extended@0.0.7": {
      "map": {
        "extended": "npm:extended@0.0.6",
        "is-extended": "npm:is-extended@0.0.10",
        "array-extended": "npm:array-extended@0.0.11"
      }
    },
    "npm:extended@0.0.6": {
      "map": {
        "extender": "npm:extender@0.0.10"
      }
    },
    "npm:date-extended@0.0.6": {
      "map": {
        "extended": "npm:extended@0.0.6",
        "is-extended": "npm:is-extended@0.0.10",
        "array-extended": "npm:array-extended@0.0.11"
      }
    },
    "npm:array-extended@0.0.11": {
      "map": {
        "extended": "npm:extended@0.0.6",
        "is-extended": "npm:is-extended@0.0.10",
        "arguments-extended": "npm:arguments-extended@0.0.3"
      }
    },
    "npm:extender@0.0.10": {
      "map": {
        "declare.js": "npm:declare.js@0.0.8"
      }
    },
    "npm:arguments-extended@0.0.3": {
      "map": {
        "extended": "npm:extended@0.0.6",
        "is-extended": "npm:is-extended@0.0.10"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "readable-stream": "npm:readable-stream@2.2.2",
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:shuffled@1.0.0": {
      "map": {
        "shuffle-array": "npm:shuffle-array@1.0.0"
      }
    },
    "npm:jspm-nodelibs-stream@0.2.0": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:jspm-nodelibs-os@0.2.0": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "npm:buffer@4.9.1": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "base64-js": "npm:base64-js@1.2.0",
        "ieee754": "npm:ieee754@1.1.8"
      }
    },
    "npm:jspm-nodelibs-crypto@0.2.0": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.0",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.3",
        "create-hmac": "npm:create-hmac@1.1.4",
        "pbkdf2": "npm:pbkdf2@3.0.9",
        "randombytes": "npm:randombytes@2.0.3",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "public-encrypt": "npm:public-encrypt@4.0.0"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "inherits": "npm:inherits@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "elliptic": "npm:elliptic@6.3.2",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.3",
        "ripemd160": "npm:ripemd160@1.0.1",
        "sha.js": "npm:sha.js@2.4.8"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "bn.js": "npm:bn.js@4.11.6",
        "miller-rabin": "npm:miller-rabin@4.0.0"
      }
    },
    "npm:pbkdf2@3.0.9": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "randombytes": "npm:randombytes@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "browserify-aes": "npm:browserify-aes@1.0.6"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.3",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:browserify-aes@1.0.6": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "cipher-base": "npm:cipher-base@1.0.3",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "elliptic": "npm:elliptic@6.3.2",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.9",
        "asn1.js": "npm:asn1.js@4.9.1"
      }
    },
    "npm:elliptic@6.3.2": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "inherits": "npm:inherits@2.0.3",
        "hash.js": "npm:hash.js@1.0.3",
        "brorand": "npm:brorand@1.0.6"
      }
    },
    "npm:cipher-base@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.0.6"
      }
    },
    "npm:sha.js@2.4.8": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.0": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "npm:readable-stream@2.2.2": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "inherits": "npm:inherits@2.0.3",
        "string_decoder": "npm:string_decoder@0.10.31",
        "core-util-is": "npm:core-util-is@1.0.2",
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:livescript15@1.5.4": {
      "map": {
        "prelude-ls": "npm:prelude-ls@1.1.2"
      }
    },
    "npm:brace@0.9.1": {
      "map": {
        "w3c-blob": "npm:w3c-blob@0.0.1"
      }
    },
    "npm:asn1.js@4.9.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:list_requires_multi@1.0.0": {
      "map": {
        "esprima": "npm:esprima@3.1.3",
        "esprima-walk": "npm:esprima-walk@0.1.0"
      }
    },
    "npm:mathjs@3.9.0": {
      "map": {
        "decimal.js": "npm:decimal.js@5.0.8",
        "typed-function": "npm:typed-function@0.10.5",
        "complex.js": "npm:complex.js@2.0.1",
        "tiny-emitter": "npm:tiny-emitter@1.0.2",
        "fraction.js": "npm:fraction.js@3.3.1"
      }
    },
    "npm:sweetalert2@6.3.2": {
      "map": {
        "es6-promise": "npm:es6-promise@4.0.5"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.1": {
      "map": {
        "buffer": "npm:buffer@4.9.1"
      }
    },
    "npm:async@2.1.4": {
      "map": {
        "lodash": "npm:lodash@4.17.4"
      }
    },
    "npm:unthenify@1.0.4": {
      "map": {
        "util-arity": "npm:util-arity@1.0.2",
        "any-promise": "npm:any-promise@1.3.0"
      }
    },
    "npm:cheerio@0.22.0": {
      "map": {
        "lodash.defaults": "npm:lodash.defaults@4.2.0",
        "dom-serializer": "npm:dom-serializer@0.1.0",
        "entities": "npm:entities@1.1.1",
        "lodash.assignin": "npm:lodash.assignin@4.2.0",
        "lodash.pick": "npm:lodash.pick@4.4.0",
        "htmlparser2": "npm:htmlparser2@3.9.2",
        "css-select": "npm:css-select@1.2.0",
        "lodash.bind": "npm:lodash.bind@4.2.1",
        "lodash.reduce": "npm:lodash.reduce@4.6.0",
        "lodash.flatten": "npm:lodash.flatten@4.4.0",
        "lodash.foreach": "npm:lodash.foreach@4.5.0",
        "lodash.merge": "npm:lodash.merge@4.6.0",
        "lodash.map": "npm:lodash.map@4.6.0",
        "lodash.some": "npm:lodash.some@4.6.0",
        "lodash.filter": "npm:lodash.filter@4.6.0",
        "lodash.reject": "npm:lodash.reject@4.6.0"
      }
    },
    "npm:dom-serializer@0.1.0": {
      "map": {
        "entities": "npm:entities@1.1.1",
        "domelementtype": "npm:domelementtype@1.1.3"
      }
    },
    "npm:htmlparser2@3.9.2": {
      "map": {
        "entities": "npm:entities@1.1.1",
        "domutils": "npm:domutils@1.5.1",
        "inherits": "npm:inherits@2.0.3",
        "domelementtype": "npm:domelementtype@1.3.0",
        "readable-stream": "npm:readable-stream@2.2.2",
        "node-readable-stream": "npm:readable-stream@2.2.2",
        "domhandler": "npm:domhandler@2.3.0"
      }
    },
    "npm:css-select@1.2.0": {
      "map": {
        "domutils": "npm:domutils@1.5.1",
        "boolbase": "npm:boolbase@1.0.0",
        "css-what": "npm:css-what@2.1.0",
        "nth-check": "npm:nth-check@1.0.1"
      }
    },
    "npm:domutils@1.5.1": {
      "map": {
        "dom-serializer": "npm:dom-serializer@0.1.0",
        "domelementtype": "npm:domelementtype@1.3.0"
      }
    },
    "npm:nth-check@1.0.1": {
      "map": {
        "boolbase": "npm:boolbase@1.0.0"
      }
    },
    "npm:domhandler@2.3.0": {
      "map": {
        "domelementtype": "npm:domelementtype@1.3.0"
      }
    },
    "npm:shift-codegen@5.0.2": {
      "map": {
        "shift-reducer": "npm:shift-reducer@4.0.0",
        "object-assign": "npm:object-assign@4.1.1",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:shift-parser@5.0.2": {
      "map": {
        "shift-reducer": "npm:shift-reducer@4.0.0",
        "es6-map": "npm:es6-map@0.1.4",
        "shift-ast": "npm:shift-ast@4.0.0",
        "multimap": "npm:multimap@0.1.1",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:ramda-fantasy@0.7.0": {
      "map": {
        "ramda": "npm:ramda@0.23.0"
      }
    },
    "npm:shift-reducer@4.0.0": {
      "map": {
        "shift-ast": "npm:shift-ast@4.0.0"
      }
    },
    "npm:shift-reducer@3.0.3": {
      "map": {
        "shift-spec": "npm:shift-spec@2015.2.1"
      }
    },
    "npm:es6-map@0.1.4": {
      "map": {
        "event-emitter": "npm:event-emitter@0.3.4",
        "es6-set": "npm:es6-set@0.1.4",
        "es6-iterator": "npm:es6-iterator@2.0.0",
        "d": "npm:d@0.1.1",
        "es6-symbol": "npm:es6-symbol@3.1.0",
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:es6-set@0.1.4": {
      "map": {
        "es6-iterator": "npm:es6-iterator@2.0.0",
        "event-emitter": "npm:event-emitter@0.3.4",
        "d": "npm:d@0.1.1",
        "es6-symbol": "npm:es6-symbol@3.1.0",
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:event-emitter@0.3.4": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:es6-iterator@2.0.0": {
      "map": {
        "d": "npm:d@0.1.1",
        "es6-symbol": "npm:es6-symbol@3.1.0",
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:es6-symbol@3.1.0": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:d@0.1.1": {
      "map": {
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:es5-ext@0.10.12": {
      "map": {
        "es6-iterator": "npm:es6-iterator@2.0.0",
        "es6-symbol": "npm:es6-symbol@3.1.0"
      }
    },
    "npm:sweetjs-min@2.2.3": {
      "map": {
        "ramda-fantasy": "npm:ramda-fantasy@0.7.0",
        "sweet-spec": "npm:sweet-spec@1.1.0",
        "immutable": "npm:immutable@3.8.1",
        "shift-parser": "npm:shift-parser@5.0.2",
        "transit-js": "npm:transit-js@0.8.846",
        "ramda": "npm:ramda@0.23.0",
        "shift-reducer": "npm:shift-reducer@3.0.3",
        "shift-codegen": "npm:shift-codegen@5.0.2"
      }
    },
    "npm:babel-code-frame@6.22.0": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "js-tokens": "npm:js-tokens@3.0.1",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:chalk@1.1.3": {
      "map": {
        "has-ansi": "npm:has-ansi@2.0.0",
        "ansi-styles": "npm:ansi-styles@2.2.1",
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "supports-color": "npm:supports-color@2.0.0",
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5"
      }
    },
    "npm:jest-validate@18.2.0": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "leven": "npm:leven@2.0.0",
        "jest-matcher-utils": "npm:jest-matcher-utils@18.1.0",
        "pretty-format": "npm:pretty-format@18.1.0"
      }
    },
    "npm:has-ansi@2.0.0": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.1.1"
      }
    },
    "npm:strip-ansi@3.0.1": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.1.1"
      }
    },
    "npm:jest-matcher-utils@18.1.0": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "pretty-format": "npm:pretty-format@18.1.0"
      }
    },
    "npm:pretty-format@18.1.0": {
      "map": {
        "ansi-styles": "npm:ansi-styles@2.2.1"
      }
    },
    "npm:prettier-min@0.15.3": {
      "map": {
        "babel-code-frame": "npm:babel-code-frame@6.22.0",
        "esutils": "npm:esutils@2.0.2",
        "jest-validate": "npm:jest-validate@18.2.0",
        "babylon": "npm:babylon@6.15.0",
        "ast-types": "npm:ast-types@0.9.4"
      }
    }
  }
});
