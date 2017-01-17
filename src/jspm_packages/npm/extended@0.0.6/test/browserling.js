var it = require("it");

it.reporter("tap");

require("./extended.test");

it.run();