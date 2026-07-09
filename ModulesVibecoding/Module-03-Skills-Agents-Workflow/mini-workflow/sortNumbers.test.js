const assert = require("node:assert/strict");
const sortNumbers = require("./sortNumbers");

assert.deepEqual(sortNumbers([3, 1, 2]), [1, 2, 3]);
assert.deepEqual(sortNumbers([10, 2, -4, 2.5]), [-4, 2, 2.5, 10]);
assert.deepEqual(sortNumbers([4, 4, 1, 1]), [1, 1, 4, 4]);
assert.deepEqual(sortNumbers([]), []);

const original = [3, 1, 2];
const sorted = sortNumbers(original);

assert.deepEqual(sorted, [1, 2, 3]);
assert.deepEqual(original, [3, 1, 2]);
assert.notEqual(sorted, original);

assert.throws(() => sortNumbers("3,1,2"), TypeError);
assert.throws(() => sortNumbers([3, "1", 2]), TypeError);
assert.throws(() => sortNumbers([3, null, 2]), TypeError);

console.log("All sortNumbers tests passed.");

