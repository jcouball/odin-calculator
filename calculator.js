function add(operand1, operand2) {
  return operand1 + operand2;
}

function subtract(operand1, operand2) {
  return operand1 - operand2;
}

function multiply(operand1, operand2) {
  return operand1 * operand2;
}

function divide(operand1, operand2) {
  if (operand2 === 0) {
    throw new Error("DIV_BY_ZERO");
  }

  return operand1 / operand2;
}

let errors = {
  "DIV_BY_ZERO": "Divide by Zero",
  "OVERFLOW": "Number Too Large",
}

function errorMessage(error) {
  return errors[error];
}

function operate(operator, num1, num2) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
  }
}

let operatorElement = document.querySelector("#operator");
let outputElement = document.querySelector("#output");
let keyboardElement = document.querySelector("#keyboard");

function formatForDisplay(num) {
  const integerPart = String(Math.trunc(num));

  if (integerPart.length > 12) throw new Error('OVERFLOW');

  const numStr = String(num);

  // If the number already fits, return it.
  if (numStr.length <= 12) return numStr;

  // It's a long decimal, so round it to fit.
  const decimalPlaces = 12 - integerPart.length - 1;

  // If the integer part is 12 digits, we can't show any decimals.
  if (decimalPlaces < 0) {
    return integerPart;
  }

  return num.toFixed(decimalPlaces);
}

function updateDisplay(numberString, operator) {
  operatorElement.textContent = operator ? operator : "";

  if (numberString === "") {
    outputElement.textContent = "0";
  }
  else {
    outputElement.textContent = numberString;
  }
}

function isButton(element) {
  return element.nodeName === "BUTTON";
}

function isSpecialButton(button) {
  return button.classList.contains("special");
}

function isOperatorButton(button) {
  return button.classList.contains("operator");
}

function isEqualsButton(button) {
  return button.classList.contains("equals");
}

function isDigitButton(button) {
  return button.classList.contains("digit");
}

function inputAsNumber() {
  return Number(input);
}

function handleSpecialFunction(specialFunction) {
  if (specialFunction === "AC") {
    clearCalculator();
  }
  else if (specialFunction === "BS") {
    if (input.length > 0) {
      input = input.slice(0, -1);
      updateDisplay(input, operator);
    }
  }
}

function handleError(error) {
  clearCalculator();
  displayMessage = errorMessage(error) || `ERR: ${error}`;
  outputElement.textContent = displayMessage;
}

function handleOperator(newOperator) {
  if (input === "" && result == undefined) return;

  try {
    if (operator) {
      const calculationResult = operate(operator, result, inputAsNumber());
      result = calculationResult;
    } else if (input !== "") {
      result = inputAsNumber();
    }

    const displayValue = formatForDisplay(result);
    operator = newOperator;
    updateDisplay(displayValue, operator);
    input = "";
  }
  catch (error) {
    handleError(error.message);
  }
}

function handleEquals() {
  if (!operator) return;

  try {
    const calculationResult = operate(operator, result, inputAsNumber());
    const displayValue = formatForDisplay(calculationResult);

    result = calculationResult;
    operator = undefined;
    updateDisplay(displayValue, operator);
    input = "";

  }
  catch (error) {
    handleError(error.message);
  }
}

function handleDigit(inputKey) {
  if (input.length >= 12) return;

  if (input === "0" && inputKey !== ".") {
    input = inputKey;
  }
  else if (input === "0" && inputKey === "0") {
    // Reject input -- do not allow multiple leading zeros
  }
  else if (input === "" && inputKey === ".") {
    input = "0.";
  }
  else if (input !== "" && input.includes(".") && inputKey === ".") {
    // Reject input -- do not allow multiple decimal points
  }
  else {
    input += inputKey;
  }

  updateDisplay(input, operator);
}

function keyPress(event) {
  let button = event.target;

  if (!isButton(button)) return;

  if (isSpecialButton(button)) {
    handleSpecialFunction(event.target.textContent);
  }
  else if (isOperatorButton(button)) {
    handleOperator(button.textContent);
  }
  else if (isEqualsButton(button)) {
    handleEquals();
  }
  else if (isDigitButton(button)) {
    handleDigit(button.textContent)
  }
}

let input; // String
let result; // Number or undefined
let operator; // Single character string or undefined

function clearCalculator() {
  input = "";
  result = undefined;
  operator = undefined;
  updateDisplay(input, operator);
}

clearCalculator();
keyboardElement.addEventListener('click', keyPress);
