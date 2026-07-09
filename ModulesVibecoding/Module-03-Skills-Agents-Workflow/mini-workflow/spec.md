# Specification: `sortNumbers`

## Purpose

Create a JavaScript function named `sortNumbers` that sorts a list of numbers in ascending numeric order.

## Function Signature

```js
sortNumbers(numbers)
```

## Input

- `numbers` must be an array.
- Every item in the array must be a JavaScript number.
- Empty arrays are valid.
- Negative numbers, decimal numbers, and duplicate values are valid.

## Output

- Returns a new array containing the same numbers sorted in ascending numeric order.
- The original input array must not be modified.

## Error Handling

The function must throw a `TypeError` when:

- the input is not an array;
- one or more items in the array are not numbers.

## Examples

```js
sortNumbers([3, 1, 2]);
// [1, 2, 3]

sortNumbers([10, 2, -4, 2.5]);
// [-4, 2, 2.5, 10]

sortNumbers([]);
// []
```

