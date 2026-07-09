function sortNumbers(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError("sortNumbers expects an array of numbers.");
  }

  if (!numbers.every((value) => typeof value === "number")) {
    throw new TypeError("sortNumbers expects every item to be a number.");
  }

  return [...numbers].sort((a, b) => a - b);
}

module.exports = sortNumbers;

