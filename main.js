import { Calculator } from './calculator.js';

const calculator1Element = document.querySelector("#calculator-1");
const calculator1 = new Calculator(calculator1Element);
calculator1.init();

const calculator2Element = document.querySelector("#calculator-2");
const calculator2 = new Calculator(calculator2Element);
calculator2.init();
