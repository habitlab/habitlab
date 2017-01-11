SystemJS.config({});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "child_process": "npm:jspm-nodelibs-child_process@0.2.0",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "js-yaml": "npm:js-yaml@3.7.0",
    "livescript15": "npm:livescript15@1.5.4",
    "async": "npm:async@2.0.1",
    "assert": "npm:jspm-nodelibs-assert@0.2.0",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.0",
    "cfy": "npm:cfy@1.0.18",
    "dexie": "npm:dexie@1.4.1",
    "enable-webcomponents-in-content-scripts": "npm:enable-webcomponents-in-content-scripts@1.0.7",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "jquery": "npm:jquery@3.1.0",
    "mathjs": "npm:mathjs@3.8.1",
    "moment": "npm:moment@2.14.1",
    "os": "npm:jspm-nodelibs-os@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.0",
    "percipio": "npm:percipio@0.1.2",
    "prelude-ls": "npm:prelude-ls@1.1.2",
    "prettyprintjs": "npm:prettyprintjs@0.1.10",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "promise-debounce": "npm:promise-debounce@1.0.1",
    "readline": "npm:jspm-nodelibs-readline@0.2.0",
    "repl": "npm:jspm-nodelibs-repl@0.2.0",
    "shuffled": "npm:shuffled@1.0.0",
    "sortablejs": "npm:sortablejs@1.5.0-rc1",
    "stream": "npm:jspm-nodelibs-stream@0.2.0",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.0",
    "sweetalert2": "npm:sweetalert2@6.2.4",
    "text": "github:systemjs/plugin-text@0.0.8",
    "tty": "npm:jspm-nodelibs-tty@0.2.0",
    "util": "npm:jspm-nodelibs-util@0.2.0",
    "vm": "npm:jspm-nodelibs-vm@0.2.0"
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
    "npm:async@2.0.1": {
      "map": {
        "lodash": "npm:lodash@4.14.1"
      }
    },
    "npm:shuffled@1.0.0": {
      "map": {
        "shuffle-array": "npm:shuffle-array@1.0.0"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.0": {
      "map": {
        "buffer-browserify": "npm:buffer@4.9.1"
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
    "npm:sweetalert2@6.2.4": {
      "map": {
        "es6-promise": "npm:es6-promise@4.0.5"
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
        "asn1.js": "npm:asn1.js@4.9.0"
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
    "npm:asn1.js@4.9.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
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
    "npm:js-yaml@3.7.0": {
      "map": {
        "argparse": "npm:argparse@1.0.9",
        "esprima": "npm:esprima@2.7.3"
      }
    },
    "npm:argparse@1.0.9": {
      "map": {
        "sprintf-js": "npm:sprintf-js@1.0.3"
      }
    },
    "npm:mathjs@3.8.1": {
      "map": {
        "complex.js": "npm:complex.js@2.0.1",
        "decimal.js": "npm:decimal.js@5.0.8",
        "tiny-emitter": "npm:tiny-emitter@1.0.2",
        "fraction.js": "npm:fraction.js@3.3.1",
        "typed-function": "npm:typed-function@0.10.5"
      }
    }
  }
});
