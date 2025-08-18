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
