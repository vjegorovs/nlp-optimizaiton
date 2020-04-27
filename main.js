let Fraction = algebra.Fraction;
let Expression = algebra.Expression;
let Equation = algebra.Equation;

let expr = new Expression("x");
expr = expr.multiply("x").subtract(3).add("x*y");

console.log(expr.toString());

console.log(math.derivative(expr.toString(), "x").toString());

let expr2 = new Expression("1").subtract("x");
let expr3 = new Expression("1").add("t");
expr2 = expr2.multiply(expr3);
console.log(expr2.toString());

function run() {
  // getting all input settings from user
  let inputArray = [...document.querySelectorAll("input")].map((x) => x.value);
  inputArray = inputArray.slice(0, -1);
  console.log(inputArray);
}
