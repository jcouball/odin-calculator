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

let outputElement = document.querySelector("#output");
let keyboardElement = document.querySelector("#keyboard");

function trimForDisplay(string) {
  let result = "";
  for (let i = 0 ; i < string.length; i++) {
    digit = string[i];
    if (digit != "0" || result.length > 0) result += digit;
  }
  if (result === "") result = "0";
  return result;
}

function updateDisplay(numberString, _operator) {
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

function keyPress(event) {
  let button = event.target;

  if (!isButton(button)) return;

  if (isSpecialButton(button)) {
    if (event.target.textContent === "AC") {
      clearCalculator();
    }
    else if (event.target.textContent === "BS") {
      if (input.length > 0) {
        input = input.slice(0, -1);
        updateDisplay(input, operator);
      }
    }
  }
  else if (isOperatorButton(button)) {
    let newOperator = button.textContent;

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
  else if (isEqualsButton(button)) {
    if (operator) {
      result = operate(operator, result, inputAsNumber());
      operator = undefined;
      updateDisplay(result, operator);
      input = "";
    }
  }
  else if (isDigitButton(button)) {
    inputKey = button.textContent;

    if (input === "0" && inputKey !== ".") {
      console.log(inputKey);
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
