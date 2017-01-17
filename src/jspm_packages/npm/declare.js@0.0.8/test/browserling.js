var it = require("it");

it.reporter("tap");

require("./declare.test");

it.run();