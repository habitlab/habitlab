var it = require("it");

it.reporter("tap");

require("./extender.test");

it.run();