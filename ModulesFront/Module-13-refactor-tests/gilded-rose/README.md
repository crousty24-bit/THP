# Gilded Rose JS/Jasmine

JavaScript implementation of the Gilded Rose refactoring kata based on the
`js-jasmine` version from
[`emilybache/GildedRose-Refactoring-Kata`](https://github.com/emilybache/GildedRose-Refactoring-Kata/tree/main/js-jasmine).

## Features

- Refactored `Shop.updateQuality()` rules into smaller methods.
- Keeps the original `Item` constructor and properties unchanged.
- Supports `Conjured` items by detecting names that start with `Conjured`.
- Covers the inventory rules with Jasmine unit tests.
- Includes a regression test for the original text-test inventory after 2 days.

## Refactor Details

The original kata implementation put every inventory rule inside a single nested
`updateQuality()` method. The refactor keeps the same public API, but separates
the behavior by item category:

- `updateQuality()` iterates over the inventory and returns the updated items.
- `updateItem()` routes each item to the matching rule.
- `updateAgedBrie()` handles the increasing quality of `Aged Brie`.
- `updateBackstagePass()` handles the 10-day, 5-day, and post-concert rules.
- `updateStandardItem()` handles normal items and `Conjured` items.
- `changeQuality()` centralizes the `0..50` quality bounds for non-legendary
  items.
- Type-checking helpers such as `isSulfuras()` and `isConjured()` keep item name
  comparisons in one place.

The `Item` class was intentionally left unchanged. This preserves the kata
constraint that external code may depend on the existing constructor and public
properties: `name`, `sellIn`, and `quality`.

`Sulfuras` is handled as an early return. It does not decrease `sellIn`, does not
change `quality`, and is not clamped to `50`. A later code-quality audit found
that forcing `Sulfuras` quality to `80` was too aggressive because the rule says
the item never changes. The current implementation preserves the exact incoming
values.

`Conjured` support is implemented as a prefix rule:

```js
item.name.startsWith('Conjured')
```

This matches names such as `Conjured Mana Cake` and `Conjured Dark Blade`.
Conjured items degrade twice as fast as normal items, including after the sell
date.

## Code Quality Guardian Review

The refactor was reviewed with the `code-quality-guardian` skill to avoid
unnecessary rewrites. The intervention was classified as `Level 1 Local` because
the work is limited to one kata module, has no external API change, and can be
verified with the Jasmine test suite.

The review focused on:

- preserving observable behavior while making the rule flow easier to read;
- keeping the diff small instead of introducing a larger architecture;
- avoiding new dependencies or extra files that are not required by the brief;
- checking that `Sulfuras` remains fully unchanged;
- using tests as the verification source instead of assuming the refactor works.

The only follow-up found by the audit was the `Sulfuras` behavior: the first
refactor normalized its quality to `80`, while the stricter interpretation of the
rule is that it must not change at all. That was fixed and covered by an
additional test case.

## Test Coverage

The Jasmine suite in `spec/gilded_rose_spec.js` covers both regression behavior
and individual business rules.

The full-inventory regression test updates the original sample inventory for 2
days and checks every resulting `sellIn` and `quality` value. This protects the
main kata scenario while the implementation is refactored.

The individual tests verify that:

- normal items decrease `sellIn` by 1;
- normal item quality decreases by 1 before the sell date;
- normal item quality decreases by 2 after the sell date;
- item quality never becomes negative;
- non-legendary item quality never increases above `50`;
- `Aged Brie` increases in quality;
- `Sulfuras` does not change `sellIn` or `quality`;
- `Backstage passes` increase by 2 with 10 days or fewer left;
- `Backstage passes` increase by 3 with 5 days or fewer left;
- `Backstage passes` drop to `0` after the concert;
- `Conjured` items degrade twice as fast as normal items;
- `updateQuality()` returns the same updated inventory array.

These tests are intentionally behavior-oriented. They do not assert private
helper methods, so the implementation can still be improved without rewriting
the test suite.

## Setup

```bash
pnpm install
```

## Run Tests

```bash
pnpm test
```

## Structure

```text
package.json
src/
  gilded_rose.js
spec/
  gilded_rose_spec.js
  texttest_fixture.js
  support/
    jasmine.json
README.md
```
