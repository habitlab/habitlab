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
    "bcrypt-pbkdf": "npm:bcrypt-pbkdf@1.0.1",
    "brace": "npm:brace@0.9.1",
    "cheerio": "npm:cheerio@0.22.0",
    "child_process": "npm:jspm-nodelibs-child_process@0.2.0",
    "co": "npm:co@4.6.0",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "dgram": "npm:jspm-nodelibs-dgram@0.2.0",
    "dns": "npm:jspm-nodelibs-dns@0.2.0",
    "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
    "esprima": "npm:esprima@3.1.3",
    "http": "npm:jspm-nodelibs-http@0.2.0",
    "https": "npm:jspm-nodelibs-https@0.2.1",
    "icojs": "npm:icojs-min@0.5.0",
    "jimp": "npm:jimp-min@0.2.32",
    "jodid25519": "npm:jodid25519@1.0.2",
    "js-yaml": "github:nodeca/js-yaml@master",
    "jsbn": "npm:jsbn@0.1.1",
    "jspm-nodelibs-process": "npm:jspm-nodelibs-process@0.2.0",
    "list_requires_multi": "npm:list_requires_multi@1.0.0",
    "livescript15": "npm:livescript15@1.5.4",
    "async": "npm:async@2.1.4",
    "assert": "npm:jspm-nodelibs-assert@0.2.0",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.1",
    "cfy": "npm:cfy@1.0.20",
    "dexie": "npm:dexie@1.5.1",
    "enable-webcomponents-in-content-scripts": "npm:enable-webcomponents-in-content-scripts@1.0.7",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "jquery": "npm:jquery@3.1.1",
    "mathjs": "npm:mathjs@3.9.0",
    "moment": "npm:moment@2.17.1",
    "net": "npm:jspm-nodelibs-net@0.2.0",
    "nodeca/js-yaml": "github:nodeca/js-yaml@master",
    "os": "npm:jspm-nodelibs-os@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.1",
    "percipio": "npm:percipio@0.1.2",
    "prelude-ls": "npm:prelude-ls@1.1.2",
    "prettier-min": "npm:prettier-min@0.15.3",
    "prettyprintjs": "npm:prettyprintjs@0.1.11",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "promise-debounce": "npm:promise-debounce@1.0.1",
    "querystring": "npm:jspm-nodelibs-querystring@0.2.0",
    "readable-stream": "npm:readable-stream@2.2.3",
    "readline": "npm:jspm-nodelibs-readline@0.2.0",
    "repl": "npm:jspm-nodelibs-repl@0.2.0",
    "shuffled": "npm:shuffled@1.0.0",
    "sortablejs": "npm:sortablejs@1.5.0-rc1",
    "stream": "npm:jspm-nodelibs-stream@0.2.0",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.0",
    "sweetalert2": "npm:sweetalert2@6.3.2",
    "sweetjs-min": "npm:sweetjs-min@2.2.14",
    "text": "github:systemjs/plugin-text@0.0.8",
    "timers": "npm:jspm-nodelibs-timers@0.2.0",
    "tls": "npm:jspm-nodelibs-tls@0.2.0",
    "tty": "npm:jspm-nodelibs-tty@0.2.0",
    "tweetnacl": "npm:tweetnacl@0.14.5",
    "underscore": "npm:underscore@1.8.3",
    "url": "npm:jspm-nodelibs-url@0.2.0",
    "util": "npm:jspm-nodelibs-util@0.2.1",
    "vm": "npm:jspm-nodelibs-vm@0.2.0",
    "zlib": "npm:jspm-nodelibs-zlib@0.2.2"
  },
  packages: {
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
        "readable-stream": "npm:readable-stream@2.2.3",
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
        "elliptic": "npm:elliptic@6.4.0",
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
        "elliptic": "npm:elliptic@6.4.0",
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
    "npm:cipher-base@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.1.0"
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
        "util-arity": "npm:util-arity@1.1.0",
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
    },
    "npm:cfy@1.0.20": {
      "map": {
        "co": "npm:co@4.6.0",
        "unthenify": "npm:unthenify@1.0.4"
      }
    },
    "npm:sweetjs-min@2.2.14": {
      "map": {
        "immutable": "npm:immutable@3.8.1",
        "shift-reducer": "npm:shift-reducer@3.0.3",
        "ramda": "npm:ramda@0.19.1",
        "ramda-fantasy": "npm:ramda-fantasy@0.4.1",
        "shift-codegen": "npm:shift-codegen@4.0.3",
        "shift-parser": "npm:shift-parser@4.1.3",
        "transit-js": "npm:transit-js@0.8.846",
        "sweet-spec": "npm:sweet-spec@1.1.0"
      }
    },
    "npm:ramda-fantasy@0.4.1": {
      "map": {
        "ramda": "npm:ramda@0.17.1"
      }
    },
    "npm:shift-codegen@4.0.3": {
      "map": {
        "shift-reducer": "npm:shift-reducer@3.0.3",
        "object-assign": "npm:object-assign@3.0.0",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:shift-parser@4.1.3": {
      "map": {
        "shift-reducer": "npm:shift-reducer@3.0.3",
        "esutils": "npm:esutils@2.0.2",
        "es6-map": "npm:es6-map@0.1.4",
        "multimap": "npm:multimap@0.1.1"
      }
    },
    "npm:elliptic@6.4.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.6",
        "hmac-drbg": "npm:hmac-drbg@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "hash.js": "npm:hash.js@1.0.3",
        "brorand": "npm:brorand@1.1.0"
      }
    },
    "npm:hmac-drbg@1.0.0": {
      "map": {
        "hash.js": "npm:hash.js@1.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:readable-stream@2.2.3": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "inherits": "npm:inherits@2.0.3",
        "string_decoder": "npm:string_decoder@0.10.31",
        "util-deprecate": "npm:util-deprecate@1.0.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "core-util-is": "npm:core-util-is@1.0.2",
        "buffer-shims": "npm:buffer-shims@1.0.0"
      }
    },
    "npm:jimp-min@0.2.32": {
      "map": {
        "bignumber.js": "npm:bignumber.js@2.4.0",
        "file-type": "npm:file-type@3.9.0",
        "request": "npm:request@2.80.0",
        "tinycolor2": "npm:tinycolor2@1.4.1",
        "url-regex": "npm:url-regex@3.2.0",
        "mime": "npm:mime@1.3.4",
        "pngjs": "npm:pngjs@3.0.1",
        "stream-to-buffer": "npm:stream-to-buffer@0.1.0",
        "read-chunk": "npm:read-chunk@1.0.1",
        "load-bmfont": "npm:load-bmfont@1.3.0",
        "jpeg-js": "npm:jpeg-js@0.2.0",
        "pixelmatch": "npm:pixelmatch@4.0.2",
        "exif-parser": "npm:exif-parser@0.1.9",
        "bmp-js": "npm:bmp-js@0.0.2"
      }
    },
    "npm:url-regex@3.2.0": {
      "map": {
        "ip-regex": "npm:ip-regex@1.0.3"
      }
    },
    "npm:request@2.80.0": {
      "map": {
        "caseless": "npm:caseless@0.12.0",
        "aws-sign2": "npm:aws-sign2@0.6.0",
        "aws4": "npm:aws4@1.6.0",
        "form-data": "npm:form-data@2.1.2",
        "har-validator": "npm:har-validator@4.2.1",
        "is-typedarray": "npm:is-typedarray@1.0.0",
        "extend": "npm:extend@3.0.0",
        "combined-stream": "npm:combined-stream@1.0.5",
        "http-signature": "npm:http-signature@1.1.1",
        "forever-agent": "npm:forever-agent@0.6.1",
        "isstream": "npm:isstream@0.1.2",
        "json-stringify-safe": "npm:json-stringify-safe@5.0.1",
        "mime-types": "npm:mime-types@2.1.14",
        "stringstream": "npm:stringstream@0.0.5",
        "performance-now": "npm:performance-now@0.2.0",
        "oauth-sign": "npm:oauth-sign@0.8.2",
        "tough-cookie": "npm:tough-cookie@2.3.2",
        "tunnel-agent": "npm:tunnel-agent@0.4.3",
        "uuid": "npm:uuid@3.0.1",
        "qs": "npm:qs@6.3.1",
        "hawk": "npm:hawk@3.1.3"
      }
    },
    "npm:load-bmfont@1.3.0": {
      "map": {
        "mime": "npm:mime@1.3.4",
        "xtend": "npm:xtend@4.0.1",
        "buffer-equal": "npm:buffer-equal@0.0.1",
        "parse-bmfont-binary": "npm:parse-bmfont-binary@1.0.6",
        "xhr": "npm:xhr@2.4.0",
        "parse-bmfont-xml": "npm:parse-bmfont-xml@1.1.3",
        "parse-bmfont-ascii": "npm:parse-bmfont-ascii@1.0.6"
      }
    },
    "npm:pixelmatch@4.0.2": {
      "map": {
        "pngjs": "npm:pngjs@3.0.1"
      }
    },
    "npm:form-data@2.1.2": {
      "map": {
        "combined-stream": "npm:combined-stream@1.0.5",
        "mime-types": "npm:mime-types@2.1.14",
        "asynckit": "npm:asynckit@0.4.0"
      }
    },
    "npm:har-validator@4.2.1": {
      "map": {
        "har-schema": "npm:har-schema@1.0.5",
        "ajv": "npm:ajv@4.11.4"
      }
    },
    "npm:combined-stream@1.0.5": {
      "map": {
        "delayed-stream": "npm:delayed-stream@1.0.0"
      }
    },
    "npm:stream-to-buffer@0.1.0": {
      "map": {
        "stream-to": "npm:stream-to@0.2.2"
      }
    },
    "npm:http-signature@1.1.1": {
      "map": {
        "jsprim": "npm:jsprim@1.3.1",
        "assert-plus": "npm:assert-plus@0.2.0",
        "sshpk": "npm:sshpk@1.11.0"
      }
    },
    "npm:mime-types@2.1.14": {
      "map": {
        "mime-db": "npm:mime-db@1.26.0"
      }
    },
    "npm:tough-cookie@2.3.2": {
      "map": {
        "punycode": "npm:punycode@1.4.1"
      }
    },
    "npm:jspm-nodelibs-url@0.2.0": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "npm:hawk@3.1.3": {
      "map": {
        "boom": "npm:boom@2.10.1",
        "cryptiles": "npm:cryptiles@2.0.5",
        "sntp": "npm:sntp@1.0.9",
        "hoek": "npm:hoek@2.16.3"
      }
    },
    "npm:jspm-nodelibs-http@0.2.0": {
      "map": {
        "http-browserify": "npm:stream-http@2.6.3"
      }
    },
    "npm:jspm-nodelibs-zlib@0.2.2": {
      "map": {
        "browserify-zlib": "npm:browserify-zlib@0.1.4"
      }
    },
    "npm:sshpk@1.11.0": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0",
        "dashdash": "npm:dashdash@1.14.1",
        "asn1": "npm:asn1@0.2.3",
        "getpass": "npm:getpass@0.1.6"
      }
    },
    "npm:xhr@2.4.0": {
      "map": {
        "xtend": "npm:xtend@4.0.1",
        "global": "npm:global@4.3.1",
        "is-function": "npm:is-function@1.0.1",
        "parse-headers": "npm:parse-headers@2.0.1"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "npm:cryptiles@2.0.5": {
      "map": {
        "boom": "npm:boom@2.10.1"
      }
    },
    "npm:boom@2.10.1": {
      "map": {
        "hoek": "npm:hoek@2.16.3"
      }
    },
    "npm:ajv@4.11.4": {
      "map": {
        "json-stable-stringify": "npm:json-stable-stringify@1.0.1",
        "co": "npm:co@4.6.0"
      }
    },
    "npm:jsprim@1.3.1": {
      "map": {
        "extsprintf": "npm:extsprintf@1.0.2",
        "json-schema": "npm:json-schema@0.2.3",
        "verror": "npm:verror@1.3.6"
      }
    },
    "npm:sntp@1.0.9": {
      "map": {
        "hoek": "npm:hoek@2.16.3"
      }
    },
    "npm:parse-bmfont-xml@1.1.3": {
      "map": {
        "xml2js": "npm:xml2js@0.4.17",
        "xml-parse-from-string": "npm:xml-parse-from-string@1.0.0"
      }
    },
    "npm:stream-http@2.6.3": {
      "map": {
        "xtend": "npm:xtend@4.0.1",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "builtin-status-codes": "npm:builtin-status-codes@3.0.0",
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.2.3"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "readable-stream": "npm:readable-stream@2.2.3",
        "pako": "npm:pako@0.2.9"
      }
    },
    "npm:dashdash@1.14.1": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0"
      }
    },
    "npm:getpass@0.1.6": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0"
      }
    },
    "npm:jodid25519@1.0.2": {
      "map": {
        "jsbn": "npm:jsbn@0.1.1"
      }
    },
    "npm:bcrypt-pbkdf@1.0.1": {
      "map": {
        "tweetnacl": "npm:tweetnacl@0.14.5"
      }
    },
    "npm:ecc-jsbn@0.1.1": {
      "map": {
        "jsbn": "npm:jsbn@0.1.1"
      }
    },
    "npm:verror@1.3.6": {
      "map": {
        "extsprintf": "npm:extsprintf@1.0.2"
      }
    },
    "npm:json-stable-stringify@1.0.1": {
      "map": {
        "jsonify": "npm:jsonify@0.0.0"
      }
    },
    "npm:xml2js@0.4.17": {
      "map": {
        "xmlbuilder": "npm:xmlbuilder@4.2.1",
        "sax": "npm:sax@1.2.2"
      }
    },
    "npm:global@4.3.1": {
      "map": {
        "process": "npm:process@0.5.2",
        "min-document": "npm:min-document@2.19.0",
        "node-min-document": "npm:min-document@2.19.0"
      }
    },
    "npm:parse-headers@2.0.1": {
      "map": {
        "trim": "npm:trim@0.0.1",
        "for-each": "npm:for-each@0.3.2"
      }
    },
    "npm:for-each@0.3.2": {
      "map": {
        "is-function": "npm:is-function@1.0.1"
      }
    },
    "npm:jspm-nodelibs-timers@0.2.0": {
      "map": {
        "timers-browserify": "npm:timers-browserify@1.4.2"
      }
    },
    "npm:xmlbuilder@4.2.1": {
      "map": {
        "lodash": "npm:lodash@4.17.4"
      }
    },
    "npm:min-document@2.19.0": {
      "map": {
        "dom-walk": "npm:dom-walk@0.1.1"
      }
    },
    "npm:timers-browserify@1.4.2": {
      "map": {
        "process": "npm:process@0.11.9"
      }
    }
  }
});
