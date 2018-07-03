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
    "ajv": "npm:ajv@5.2.3",
    "babel-preset-react": "npm:babel-preset-react@6.24.1",
    "babel-standalone": "npm:babel-standalone@6.26.0",
    "bcrypt-pbkdf": "npm:bcrypt-pbkdf@1.0.1",
    "brace": "npm:brace@0.10.0",
    "cheerio": "npm:cheerio@0.22.0",
    "child_process": "npm:jspm-nodelibs-child_process@0.2.0",
    "co": "npm:co@4.6.0",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "css-element-queries": "npm:css-element-queries@0.4.0",
    "dgram": "npm:jspm-nodelibs-dgram@0.2.0",
    "dns": "npm:jspm-nodelibs-dns@0.2.0",
    "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
    "eslint": "npm:eslint@4.8.0",
    "espree": "npm:espree@3.5.1",
    "esprima": "npm:esprima@3.1.3",
    "http": "npm:jspm-nodelibs-http@0.2.0",
    "https": "npm:jspm-nodelibs-https@0.2.1",
    "icojs": "npm:icojs-min@0.5.0",
    "jimp": "npm:jimp-min@0.2.32",
    "jodid25519": "npm:jodid25519@1.0.2",
    "js-yaml": "github:nodeca/js-yaml@master",
    "jsbn": "npm:jsbn@0.1.1",
    "jspm-nodelibs-process": "npm:jspm-nodelibs-process@0.2.0",
    "list_requires_multi": "npm:list_requires_multi@1.0.2",
    "livescript15": "npm:livescript15@1.5.6",
    "assert": "npm:jspm-nodelibs-assert@0.2.0",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.3",
    "cfy": "npm:cfy@1.0.20",
    "dexie": "npm:dexie@1.5.1",
    "enable-webcomponents-in-content-scripts": "npm:enable-webcomponents-in-content-scripts@1.0.7",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "jquery": "npm:jquery@3.1.1",
    "mathjs": "npm:mathjs@3.9.0",
    "module": "npm:jspm-nodelibs-module@0.2.1",
    "moment": "npm:moment@2.17.1",
    "net": "npm:jspm-nodelibs-net@0.2.0",
    "nodeca/js-yaml": "github:nodeca/js-yaml@master",
    "os": "npm:jspm-nodelibs-os@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.1",
    "percipio": "npm:percipio@0.1.2",
    "prelude-ls": "npm:prelude-ls@1.1.2",
    "prettier-min": "npm:prettier-min@0.15.3",
    "prettyprintjs": "npm:prettyprintjs@0.1.12",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "promise-debounce": "npm:promise-debounce@1.0.1",
    "querystring": "npm:jspm-nodelibs-querystring@0.2.0",
    "readable-stream": "npm:readable-stream@2.3.3",
    "readline": "npm:jspm-nodelibs-readline@0.2.0",
    "repl": "npm:jspm-nodelibs-repl@0.2.0",
    "shuffled": "npm:shuffled@1.0.0",
    "sortablejs": "npm:sortablejs@1.5.0-rc1",
    "stream": "npm:jspm-nodelibs-stream@0.2.0",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.2",
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
        "readable-stream": "npm:readable-stream@2.3.3",
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
    "npm:jspm-nodelibs-crypto@0.2.0": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.1"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "randombytes": "npm:randombytes@2.0.5",
        "bn.js": "npm:bn.js@4.11.8",
        "miller-rabin": "npm:miller-rabin@4.0.1"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "randombytes": "npm:randombytes@2.0.5",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.1.0",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "browserify-aes": "npm:browserify-aes@1.1.1"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "elliptic": "npm:elliptic@6.4.0",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "randombytes": "npm:randombytes@2.0.5",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:asn1.js@4.9.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
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
        "readable-stream": "npm:readable-stream@2.3.3",
        "node-readable-stream": "npm:readable-stream@2.3.3",
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
        "js-tokens": "npm:js-tokens@3.0.2",
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
        "bn.js": "npm:bn.js@4.11.8",
        "hmac-drbg": "npm:hmac-drbg@1.0.1",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "hash.js": "npm:hash.js@1.1.3",
        "brorand": "npm:brorand@1.1.0"
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
        "readable-stream": "npm:readable-stream@2.3.3"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "readable-stream": "npm:readable-stream@2.3.3",
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
        "lodash": "npm:lodash@4.17.10"
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
    },
    "npm:browserify-sign@4.0.4": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.6",
        "inherits": "npm:inherits@2.0.3",
        "create-hash": "npm:create-hash@1.1.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "bn.js": "npm:bn.js@4.11.8",
        "elliptic": "npm:elliptic@6.4.0",
        "parse-asn1": "npm:parse-asn1@5.1.0"
      }
    },
    "npm:parse-asn1@5.1.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "pbkdf2": "npm:pbkdf2@3.0.14",
        "asn1.js": "npm:asn1.js@4.9.1"
      }
    },
    "npm:hmac-drbg@1.0.1": {
      "map": {
        "hash.js": "npm:hash.js@1.1.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:livescript15@1.5.6": {
      "map": {
        "prelude-ls": "npm:prelude-ls@1.1.2"
      }
    },
    "npm:acorn-jsx@3.0.1": {
      "map": {
        "acorn": "npm:acorn@3.3.0"
      }
    },
    "npm:list_requires_multi@1.0.2": {
      "map": {
        "espree": "npm:espree@3.5.1",
        "esprima-walk": "npm:esprima-walk@0.1.0"
      }
    },
    "npm:eslint@4.8.0": {
      "map": {
        "eslint-scope": "npm:eslint-scope@3.7.1",
        "esquery": "npm:esquery@1.0.0",
        "is-resolvable": "npm:is-resolvable@1.0.0",
        "file-entry-cache": "npm:file-entry-cache@2.0.0",
        "levn": "npm:levn@0.3.0",
        "natural-compare": "npm:natural-compare@1.4.0",
        "imurmurhash": "npm:imurmurhash@0.1.4",
        "estraverse": "npm:estraverse@4.2.0",
        "doctrine": "npm:doctrine@2.0.0",
        "pluralize": "npm:pluralize@7.0.0",
        "cross-spawn": "npm:cross-spawn@5.1.0",
        "chalk": "npm:chalk@2.1.0",
        "ignore": "npm:ignore@3.3.5",
        "strip-ansi": "npm:strip-ansi@4.0.0",
        "strip-json-comments": "npm:strip-json-comments@2.0.1",
        "semver": "npm:semver@5.4.1",
        "esutils": "npm:esutils@2.0.2",
        "table": "npm:table@4.0.2",
        "glob": "npm:glob@7.1.2",
        "babel-code-frame": "npm:babel-code-frame@6.22.0",
        "inquirer": "npm:inquirer@3.3.0",
        "path-is-inside": "npm:path-is-inside@1.0.2",
        "progress": "npm:progress@2.0.0",
        "text-table": "npm:text-table@0.2.0",
        "json-stable-stringify": "npm:json-stable-stringify@1.0.1",
        "functional-red-black-tree": "npm:functional-red-black-tree@1.0.1",
        "require-uncached": "npm:require-uncached@1.0.3",
        "optionator": "npm:optionator@0.8.2",
        "concat-stream": "npm:concat-stream@1.6.0",
        "minimatch": "npm:minimatch@3.0.4",
        "globals": "npm:globals@9.18.0",
        "mkdirp": "npm:mkdirp@0.5.1",
        "debug": "npm:debug@3.1.0",
        "espree": "npm:espree@3.5.1",
        "js-yaml": "npm:js-yaml@3.10.0",
        "lodash": "npm:lodash@4.17.10",
        "ajv": "npm:ajv@5.2.3"
      }
    },
    "npm:eslint-scope@3.7.1": {
      "map": {
        "estraverse": "npm:estraverse@4.2.0",
        "esrecurse": "npm:esrecurse@4.2.0"
      }
    },
    "npm:esquery@1.0.0": {
      "map": {
        "estraverse": "npm:estraverse@4.2.0"
      }
    },
    "npm:doctrine@2.0.0": {
      "map": {
        "esutils": "npm:esutils@2.0.2",
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "npm:file-entry-cache@2.0.0": {
      "map": {
        "flat-cache": "npm:flat-cache@1.3.0",
        "object-assign": "npm:object-assign@4.1.1"
      }
    },
    "npm:glob@7.1.2": {
      "map": {
        "minimatch": "npm:minimatch@3.0.4",
        "fs.realpath": "npm:fs.realpath@1.0.0",
        "inflight": "npm:inflight@1.0.6",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "once": "npm:once@1.4.0",
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:table@4.0.2": {
      "map": {
        "chalk": "npm:chalk@2.1.0",
        "lodash": "npm:lodash@4.17.10",
        "slice-ansi": "npm:slice-ansi@1.0.0",
        "string-width": "npm:string-width@2.1.1",
        "ajv-keywords": "npm:ajv-keywords@2.1.0",
        "ajv": "npm:ajv@5.2.3"
      }
    },
    "npm:inquirer@3.3.0": {
      "map": {
        "chalk": "npm:chalk@2.1.0",
        "strip-ansi": "npm:strip-ansi@4.0.0",
        "lodash": "npm:lodash@4.17.10",
        "string-width": "npm:string-width@2.1.1",
        "cli-cursor": "npm:cli-cursor@2.1.0",
        "mute-stream": "npm:mute-stream@0.0.7",
        "ansi-escapes": "npm:ansi-escapes@3.0.0",
        "cli-width": "npm:cli-width@2.2.0",
        "run-async": "npm:run-async@2.3.0",
        "external-editor": "npm:external-editor@2.0.5",
        "figures": "npm:figures@2.0.0",
        "through": "npm:through@2.3.8",
        "rx-lite-aggregates": "npm:rx-lite-aggregates@4.0.8",
        "rx-lite": "npm:rx-lite@4.0.8"
      }
    },
    "npm:cross-spawn@5.1.0": {
      "map": {
        "shebang-command": "npm:shebang-command@1.2.0",
        "which": "npm:which@1.3.0",
        "lru-cache": "npm:lru-cache@4.1.1"
      }
    },
    "npm:levn@0.3.0": {
      "map": {
        "type-check": "npm:type-check@0.3.2",
        "prelude-ls": "npm:prelude-ls@1.1.2"
      }
    },
    "npm:chalk@2.1.0": {
      "map": {
        "ansi-styles": "npm:ansi-styles@3.2.0",
        "supports-color": "npm:supports-color@4.4.0",
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5"
      }
    },
    "npm:optionator@0.8.2": {
      "map": {
        "type-check": "npm:type-check@0.3.2",
        "levn": "npm:levn@0.3.0",
        "deep-is": "npm:deep-is@0.1.3",
        "prelude-ls": "npm:prelude-ls@1.1.2",
        "fast-levenshtein": "npm:fast-levenshtein@2.0.6",
        "wordwrap": "npm:wordwrap@1.0.0"
      }
    },
    "npm:esrecurse@4.2.0": {
      "map": {
        "estraverse": "npm:estraverse@4.2.0",
        "object-assign": "npm:object-assign@4.1.1"
      }
    },
    "npm:is-resolvable@1.0.0": {
      "map": {
        "tryit": "npm:tryit@1.0.3"
      }
    },
    "npm:concat-stream@1.6.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "typedarray": "npm:typedarray@0.0.6",
        "readable-stream": "npm:readable-stream@2.3.3"
      }
    },
    "npm:require-uncached@1.0.3": {
      "map": {
        "caller-path": "npm:caller-path@0.1.0",
        "resolve-from": "npm:resolve-from@1.0.1"
      }
    },
    "npm:type-check@0.3.2": {
      "map": {
        "prelude-ls": "npm:prelude-ls@1.1.2"
      }
    },
    "npm:string-width@2.1.1": {
      "map": {
        "strip-ansi": "npm:strip-ansi@4.0.0",
        "is-fullwidth-code-point": "npm:is-fullwidth-code-point@2.0.0"
      }
    },
    "npm:inflight@1.0.6": {
      "map": {
        "once": "npm:once@1.4.0",
        "wrappy": "npm:wrappy@1.0.2"
      }
    },
    "npm:flat-cache@1.3.0": {
      "map": {
        "circular-json": "npm:circular-json@0.3.3",
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "write": "npm:write@0.2.1",
        "del": "npm:del@2.2.2"
      }
    },
    "npm:minimatch@3.0.4": {
      "map": {
        "brace-expansion": "npm:brace-expansion@1.1.8"
      }
    },
    "npm:figures@2.0.0": {
      "map": {
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5"
      }
    },
    "npm:rx-lite-aggregates@4.0.8": {
      "map": {
        "rx-lite": "npm:rx-lite@4.0.8"
      }
    },
    "npm:which@1.3.0": {
      "map": {
        "isexe": "npm:isexe@2.0.0"
      }
    },
    "npm:lru-cache@4.1.1": {
      "map": {
        "pseudomap": "npm:pseudomap@1.0.2",
        "yallist": "npm:yallist@2.1.2"
      }
    },
    "npm:supports-color@4.4.0": {
      "map": {
        "has-flag": "npm:has-flag@2.0.0"
      }
    },
    "npm:shebang-command@1.2.0": {
      "map": {
        "shebang-regex": "npm:shebang-regex@1.0.0"
      }
    },
    "npm:debug@3.1.0": {
      "map": {
        "ms": "npm:ms@2.0.0"
      }
    },
    "npm:strip-ansi@4.0.0": {
      "map": {
        "ansi-regex": "npm:ansi-regex@3.0.0"
      }
    },
    "npm:espree@3.5.1": {
      "map": {
        "acorn-jsx": "npm:acorn-jsx@3.0.1",
        "acorn": "npm:acorn@5.1.2"
      }
    },
    "npm:mkdirp@0.5.1": {
      "map": {
        "minimist": "npm:minimist@0.0.8"
      }
    },
    "npm:ansi-styles@3.2.0": {
      "map": {
        "color-convert": "npm:color-convert@1.9.0"
      }
    },
    "npm:once@1.4.0": {
      "map": {
        "wrappy": "npm:wrappy@1.0.2"
      }
    },
    "npm:cli-cursor@2.1.0": {
      "map": {
        "restore-cursor": "npm:restore-cursor@2.0.0"
      }
    },
    "npm:caller-path@0.1.0": {
      "map": {
        "callsites": "npm:callsites@0.2.0"
      }
    },
    "npm:run-async@2.3.0": {
      "map": {
        "is-promise": "npm:is-promise@2.1.0"
      }
    },
    "npm:slice-ansi@1.0.0": {
      "map": {
        "is-fullwidth-code-point": "npm:is-fullwidth-code-point@2.0.0"
      }
    },
    "npm:ajv@5.2.3": {
      "map": {
        "json-stable-stringify": "npm:json-stable-stringify@1.0.1",
        "fast-deep-equal": "npm:fast-deep-equal@1.0.0",
        "co": "npm:co@4.6.0",
        "json-schema-traverse": "npm:json-schema-traverse@0.3.1"
      }
    },
    "npm:readable-stream@2.3.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "isarray": "npm:isarray@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "util-deprecate": "npm:util-deprecate@1.0.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "string_decoder": "npm:string_decoder@1.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:external-editor@2.0.5": {
      "map": {
        "jschardet": "npm:jschardet@1.5.1",
        "tmp": "npm:tmp@0.0.33",
        "iconv-lite": "npm:iconv-lite@0.4.19"
      }
    },
    "npm:js-yaml@3.10.0": {
      "map": {
        "argparse": "npm:argparse@1.0.9",
        "esprima": "npm:esprima@4.0.0"
      }
    },
    "npm:write@0.2.1": {
      "map": {
        "mkdirp": "npm:mkdirp@0.5.1"
      }
    },
    "npm:del@2.2.2": {
      "map": {
        "object-assign": "npm:object-assign@4.1.1",
        "is-path-in-cwd": "npm:is-path-in-cwd@1.0.0",
        "is-path-cwd": "npm:is-path-cwd@1.0.0",
        "pinkie-promise": "npm:pinkie-promise@2.0.1",
        "pify": "npm:pify@2.3.0",
        "globby": "npm:globby@5.0.0",
        "rimraf": "npm:rimraf@2.6.2"
      }
    },
    "npm:brace-expansion@1.1.8": {
      "map": {
        "concat-map": "npm:concat-map@0.0.1",
        "balanced-match": "npm:balanced-match@1.0.0"
      }
    },
    "npm:color-convert@1.9.0": {
      "map": {
        "color-name": "npm:color-name@1.1.3"
      }
    },
    "npm:restore-cursor@2.0.0": {
      "map": {
        "onetime": "npm:onetime@2.0.1",
        "signal-exit": "npm:signal-exit@3.0.2"
      }
    },
    "npm:argparse@1.0.9": {
      "map": {
        "sprintf-js": "npm:sprintf-js@1.0.3"
      }
    },
    "npm:string_decoder@1.0.3": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:globby@5.0.0": {
      "map": {
        "glob": "npm:glob@7.1.2",
        "object-assign": "npm:object-assign@4.1.1",
        "pify": "npm:pify@2.3.0",
        "pinkie-promise": "npm:pinkie-promise@2.0.1",
        "array-union": "npm:array-union@1.0.2",
        "arrify": "npm:arrify@1.0.1"
      }
    },
    "npm:rimraf@2.6.2": {
      "map": {
        "glob": "npm:glob@7.1.2"
      }
    },
    "npm:is-path-in-cwd@1.0.0": {
      "map": {
        "is-path-inside": "npm:is-path-inside@1.0.0"
      }
    },
    "npm:onetime@2.0.1": {
      "map": {
        "mimic-fn": "npm:mimic-fn@1.1.0"
      }
    },
    "npm:pinkie-promise@2.0.1": {
      "map": {
        "pinkie": "npm:pinkie@2.0.4"
      }
    },
    "npm:tmp@0.0.33": {
      "map": {
        "os-tmpdir": "npm:os-tmpdir@1.0.2"
      }
    },
    "npm:is-path-inside@1.0.0": {
      "map": {
        "path-is-inside": "npm:path-is-inside@1.0.2"
      }
    },
    "npm:array-union@1.0.2": {
      "map": {
        "array-uniq": "npm:array-uniq@1.0.3"
      }
    },
    "npm:crypto-browserify@3.11.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "browserify-sign": "npm:browserify-sign@4.0.4",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "create-hash": "npm:create-hash@1.1.3",
        "randombytes": "npm:randombytes@2.0.5",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hmac": "npm:create-hmac@1.1.6",
        "pbkdf2": "npm:pbkdf2@3.0.14",
        "browserify-cipher": "npm:browserify-cipher@1.0.0"
      }
    },
    "npm:create-hash@1.1.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "ripemd160": "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.9",
        "cipher-base": "npm:cipher-base@1.0.4"
      }
    },
    "npm:randombytes@2.0.5": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:create-hmac@1.1.6": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "ripemd160": "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.9",
        "cipher-base": "npm:cipher-base@1.0.4"
      }
    },
    "npm:pbkdf2@3.0.14": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "create-hmac": "npm:create-hmac@1.1.6",
        "create-hash": "npm:create-hash@1.1.3",
        "ripemd160": "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.9"
      }
    },
    "npm:miller-rabin@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "brorand": "npm:brorand@1.1.0"
      }
    },
    "npm:ripemd160@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "hash-base": "npm:hash-base@2.0.2"
      }
    },
    "npm:sha.js@2.4.9": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:cipher-base@1.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:evp_bytestokey@1.0.3": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "md5.js": "npm:md5.js@1.3.4"
      }
    },
    "npm:hash.js@1.1.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:md5.js@1.3.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "hash-base": "npm:hash-base@3.0.4"
      }
    },
    "npm:hash-base@2.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:hash-base@3.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:brace@0.10.0": {
      "map": {
        "w3c-blob": "npm:w3c-blob@0.0.1"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.3": {
      "map": {
        "buffer": "npm:buffer@5.0.8"
      }
    },
    "npm:buffer@5.0.8": {
      "map": {
        "ieee754": "npm:ieee754@1.1.8",
        "base64-js": "npm:base64-js@1.2.1"
      }
    },
    "npm:browserify-aes@1.1.1": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.2": {
      "map": {
        "string_decoder": "npm:string_decoder@0.10.31"
      }
    },
    "npm:babel-preset-react@6.24.1": {
      "map": {
        "babel-plugin-transform-react-jsx-self": "npm:babel-plugin-transform-react-jsx-self@6.22.0",
        "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
        "babel-preset-flow": "npm:babel-preset-flow@6.23.0",
        "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.24.1",
        "babel-plugin-transform-react-display-name": "npm:babel-plugin-transform-react-display-name@6.25.0",
        "babel-plugin-transform-react-jsx-source": "npm:babel-plugin-transform-react-jsx-source@6.22.0"
      }
    },
    "npm:babel-plugin-transform-react-jsx-self@6.22.0": {
      "map": {
        "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
        "babel-runtime": "npm:babel-runtime@6.26.0"
      }
    },
    "npm:babel-plugin-transform-react-jsx@6.24.1": {
      "map": {
        "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
        "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.26.0",
        "babel-runtime": "npm:babel-runtime@6.26.0"
      }
    },
    "npm:babel-plugin-transform-react-jsx-source@6.22.0": {
      "map": {
        "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
        "babel-runtime": "npm:babel-runtime@6.26.0"
      }
    },
    "npm:babel-preset-flow@6.23.0": {
      "map": {
        "babel-plugin-transform-flow-strip-types": "npm:babel-plugin-transform-flow-strip-types@6.22.0"
      }
    },
    "npm:babel-plugin-transform-react-display-name@6.25.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.26.0"
      }
    },
    "npm:babel-plugin-transform-flow-strip-types@6.22.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.26.0",
        "babel-plugin-syntax-flow": "npm:babel-plugin-syntax-flow@6.18.0"
      }
    },
    "npm:babel-helper-builder-react-jsx@6.26.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.26.0",
        "esutils": "npm:esutils@2.0.2",
        "babel-types": "npm:babel-types@6.26.0"
      }
    },
    "npm:babel-runtime@6.26.0": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.11.1",
        "core-js": "npm:core-js@2.5.7"
      }
    },
    "npm:babel-types@6.26.0": {
      "map": {
        "esutils": "npm:esutils@2.0.2",
        "babel-runtime": "npm:babel-runtime@6.26.0",
        "to-fast-properties": "npm:to-fast-properties@1.0.3",
        "lodash": "npm:lodash@4.17.10"
      }
    }
  }
});
