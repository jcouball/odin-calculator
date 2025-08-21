const errorCodes = {
  DIV_BY_ZERO: "DIV_BY_ZERO",
  OVERFLOW: "OVERFLOW",
};

/**
 * The raw calculation layer
 */
const calculation = {
  add: (num1, num2) => num1 + num2,
  subtract: (num1, num2) => num1 - num2,
  multiply: (num1, num2) => num1 * num2,
  divide: (num1, num2) => {
    if (num2 == 0) throw new Error(errorCodes.DIV_BY_ZERO);
    return num1 / num2;
  },

  operate: function(operator, num1, num2) {
    switch (operator) {
      case '+': return this.add(num1, num2);
      case '-': return this.subtract(num1, num2);
      case '*': return this.multiply(num1, num2);
      case '/': return this.divide(num1, num2);
    }
  }
};

/**
 * The display layer for the calculator
 *
 * It knows how to display values, the effective operator, and errors.
 */
const display = {
  operatorElement: document.querySelector("#operator"),
  outputElement: document.querySelector("#output"),

  /**
   * Formats a value for display and displays the value and effective operator
   *
   * @param {string|number} value - The number to be formatted and displayed
   * @param {string|undefined} operator - The current operator that is in effect (or undefined)
   * @returns {void}
   * @throws {Error} Throws an error with the message 'OVERFLOW' if the display text exceeds 12 characters
   */
  update: function(value, operator) {
    // Only format the value if it is a number
    let valueToDisplay = typeof value === 'number' ? this.format(value) : value;

    this.operatorElement.textContent = operator ? operator : "";
    this.outputElement.textContent = valueToDisplay === "" ? "0" : valueToDisplay;
  },

  errors: {
    [errorCodes.DIV_BY_ZERO]: "Divide by Zero",
    [errorCodes.OVERFLOW]: "Number Too Large",
  },

  error: function(errorCode) {
    const displayMessage = this.errors[errorCode] || `ERR: ${errorCode}`;
    this.operatorElement.textContent = "";
    this.outputElement.textContent = displayMessage;
  },

  /**
   * Formats a number for display, ensuring it fits within a 12-character limit.
   *
   * This function rounds long decimals to fit the display and throws an error
   * for numbers whose integer part is too large to be shown.
   *
   * @param {number} num The number to be formatted.
   * @returns {string} The formatted number as a string, no longer than 12 characters.
   * @throws {Error} Throws an error with the message 'OVERFLOW' if the integer part of the number exceeds 12 digits.
   */
  format: function(num) {
    const integerPart = String(Math.trunc(num));

    if (integerPart.length > 12) throw new Error(errorCodes.OVERFLOW);

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
  },
};

/**
 * Main application layer for the calculator application
 */
const calculator = {
  input: "", // String
  result: undefined, // Number or undefined
  operator: undefined, // Single character string or undefined

  resetState: function() {
    this.input = "";
    this.result = undefined;
    this.operator = undefined;
  },

  handleError: function(error) {
    this.resetState();
    display.error(error.message);
  },

  handleSpecialFunction: function(specialFunction) {
    if (specialFunction === "AC") {
      this.clearCalculator();
    }
    else if (specialFunction === "BS") {
      if (this.input.length > 0) {
        this.input = this.input.slice(0, -1);
        display.update(this.input, this.operator);
      }
    }
  },

  handleOperator: function(newOperator) {
    if (this.input === "" && this.result == undefined) return;

    try {
      if (this.operator) {
        this.result = calculation.operate(this.operator, this.result, Number(this.input));
      } else if (this.input !== "") {
        this.result = Number(this.input);
      }

      this.operator = newOperator;
      this.input = "";

      display.update(this.result, this.operator);
    }
    catch (error) {
      this.handleError(error);
    }
  },

  handleEquals: function() {
    if (!this.operator) return;

    try {
      this.result = calculation.operate(this.operator, this.result, Number(this.input));
      this.input = "";
      this.operator = undefined;
      display.update(this.result, this.operator);
    }
    catch (error) {
      this.handleError(error);
    }
  },

  handleDigit: function(inputDigit) {
    if (this.input.length >= 12) return;

    if (this.input === "0" && inputDigit !== ".") {
      this.input = inputDigit;
    }
    else if (this.input === "0" && inputDigit === "0") {
      // Reject input -- do not allow multiple leading zeros
    }
    else if (this.input === "" && inputDigit === ".") {
      this.input = "0.";
    }
    else if (this.input.includes(".") && inputDigit === ".") {
      // Reject input -- do not allow multiple decimal points
    }
    else {
      this.input += inputDigit;
    }

    display.update(this.input, this.operator);
  },

  clearCalculator: function() {
    this.resetState();
    display.update(this.input, this.operator);
  },

  dispatchAction: function(action, value) {
    switch (action) {
      case 'digit': this.handleDigit(value); break;
      case 'operator': this.handleOperator(value); break;
      case 'equals': this.handleEquals(); break;
      case 'special': this.handleSpecialFunction(value); break;
    }
  },

  onClick: function(event) {
    let target = event.target;
    if (target.nodeName !== "BUTTON") return;

    const { action } = target.dataset;
    const value = target.textContent;

    this.dispatchAction(action, value);
  },

  keyMap: {
    '0': { action: 'digit' }, '1': { action: 'digit' }, '2': { action: 'digit' },
    '3': { action: 'digit' }, '4': { action: 'digit' }, '5': { action: 'digit' },
    '6': { action: 'digit' }, '7': { action: 'digit' }, '8': { action: 'digit' },
    '9': { action: 'digit' }, '.': { action: 'digit' },
    '+': { action: 'operator' }, '-': { action: 'operator' },
    '*': { action: 'operator' }, '/': { action: 'operator' },
    'Enter': { action: 'equals' }, '=': { action: 'equals' },
    'Backspace': { action: 'special', value: 'BS' },
    'Escape': { action: 'special', value: 'AC' },
    'c': { action: 'special', value: 'AC' }, 'C': { action: 'special', value: 'AC' },
  },

  handleKeyboardInput: function(e) {
    e.preventDefault();
    const keyInfo = this.keyMap[e.key];
    if (keyInfo) {
      // Use the specific value from the map (for BS/AC) or the key itself
      const value = keyInfo.value || e.key;
      this.dispatchAction(keyInfo.action, value);
    }
  },

  init: function() {
    let keyboardElement = document.querySelector("#keyboard");
    this.clearCalculator();
    keyboardElement.addEventListener('click', this.onClick.bind(this));
    window.addEventListener('keydown', this.handleKeyboardInput.bind(this));
  }
};

calculator.init();
