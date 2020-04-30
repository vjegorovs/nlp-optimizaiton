let Fraction = algebra.Fraction;
let Expression = algebra.Expression;
let Equation = algebra.Equation;
const globalSettings = { xStart: null, yStart: null, eps: null, t: null };

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
  expressionBuilder(inputArray);
}

// function to display analyzed expression
function expressionBuilder(inputArgs) {
  const baseExpression = "f(x, y) = x − ay + bx^2 + cxy + dy^2";
  const finalExpression = inputArgs
    ? `f(x, y) = ${finalExpressionBuilder(inputArgs)}`
    : baseExpression;
  console.log(finalExpression);
  const expressionOutput = document.querySelector(".expression");

  // removes previous expr
  [...expressionOutput.childNodes].forEach((x) => x.parentNode.removeChild(x));

  expressionOutput.appendChild(document.createTextNode(finalExpression));

  function finalExpressionBuilder(inputs) {
    //I thought abough converting to floats/ints here, but I guess I will carry on all the way with Strings, since math.js / algebra.js work with Strings for derivatives etc
    let finalExpressionConcatenated = `x − ${inputs[0]}y + ${inputs[1]}x^2 + ${inputs[2]}xy + ${inputs[3]}y^2`;
    globalSettings.xStart = inputs[4] ? inputs[4] : 0;
    globalSettings.yStart = inputs[5] ? inputs[5] : 0;
    globalSettings.eps = inputs[6] ? inputs[6] : 0;
    globalSettings.t = inputs[7] ? inputs[7] : 0;
    console.log(globalSettings);
    return finalExpressionConcatenated;
  }
}

function intiializeApp() {
  expressionBuilder();
  // bind submit button to run everything
  document.querySelector(".submitBtn").addEventListener("click", run);
}

intiializeApp();
