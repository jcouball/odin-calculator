function add(operand1, operand2) {
  return Number(operand1) + Number(operand2);
}

function subtract(operand1, operand2) {
  return Number(operand1) - Number(operand2);
}

function multiply(operand1, operand2) {
  return Number(operand1) * Number(operand2);
}

function divide(operand1, operand2) {
  return Number(operand1) / Number(operand2);
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

function handleOperator(newOperator) {
  if (operator) {
    result = operate(operator, result, inputAsNumber());
  }
  else if (input !== "") {
    result = inputAsNumber();
  }

  operator = newOperator;
  updateDisplay(result, operator);
  input = "";
}

function handleEquals() {
  if (operator) {
    result = operate(operator, result, inputAsNumber());
    operator = undefined;
    updateDisplay(result, operator);
    input = "";
  }
}

function handleDigit(inputKey) {
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
  input = "0";
  result = undefined;
  operator = undefined;
  updateDisplay(input, operator);
}

clearCalculator();
keyboardElement.addEventListener('click', keyPress);
