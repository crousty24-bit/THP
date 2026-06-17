const resultElement =
  typeof document !== "undefined" ? document.getElementById("result") : null;

let forcedWinningNumbers = null;

const showMessage = (message, isSuccess = false) => {
  if (!resultElement) {
    return message;
  }

  resultElement.textContent = message;
  resultElement.classList.toggle("success", isSuccess);
  return message;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@.]+\.[A-Za-z]{2,3}$/;
  return email.length > 8 && email.length < 30 && emailRegex.test(email);
};

const generateWinningNumbers = () => {
  if (forcedWinningNumbers) {
    return [...forcedWinningNumbers];
  }

  const numbers = [];

  while (numbers.length < 6) {
    const number = Math.floor(Math.random() * 49) + 1;

    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }

  return numbers;
};

const normalizeLotoNumbers = (lotoNumbers) =>
  lotoNumbers.map((number) => Number(number));

const hasCompleteValidGrid = (numbers) =>
  numbers.length === 6 &&
  numbers.every((number) => Number.isInteger(number) && number >= 1 && number <= 49) &&
  new Set(numbers).size === 6;

const hasWinningGrid = (playedNumbers, winningNumbers) =>
  playedNumbers.every((number) => winningNumbers.includes(number));

const checkLoto = (firstname, lastname, email, lotoNumbers) => {
  const cleanFirstname = String(firstname || "").trim();
  const cleanLastname = String(lastname || "").trim();
  const cleanEmail = String(email || "").trim();
  const playedNumbers = normalizeLotoNumbers(Array.isArray(lotoNumbers) ? lotoNumbers : []);

  if (!cleanFirstname) {
    return showMessage("Veuillez fournir un prénom");
  }

  if (!cleanLastname) {
    return showMessage("Veuillez fournir un nom");
  }

  if (!cleanEmail) {
    return showMessage("Veuillez fournir un email");
  }

  if (!isValidEmail(cleanEmail)) {
    return showMessage("Votre email n'est pas valide");
  }

  if (!hasCompleteValidGrid(playedNumbers)) {
    return showMessage("Veuillez fournir 6 nombres différents entre 1 et 49");
  }

  const winningNumbers = generateWinningNumbers();

  if (hasWinningGrid(playedNumbers, winningNumbers)) {
    return showMessage("Félicitations, vous avez gagné 1 million!!!!!", true);
  }

  return showMessage(
    `Désolé, vous avez perdu, les nombres gagnants sont: ${winningNumbers.join(", ")}`
  );
};

if (typeof document !== "undefined") {
  const form = document.getElementById("loto-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const lotoNumbers = [...document.querySelectorAll('input[name="loto-number"]')].map(
      (input) => input.value
    );

    checkLoto(firstname, lastname, email, lotoNumbers);
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    checkLoto,
    isValidEmail,
    __setWinningNumbersForTests(numbers) {
      forcedWinningNumbers = numbers;
    },
  };
}
