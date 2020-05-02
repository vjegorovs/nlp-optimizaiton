let Fraction = algebra.Fraction;
let Expression = algebra.Expression;
let Equation = algebra.Equation;
const globalSettings = { xStart: null, yStart: null, eps: null, t: null };

// let expr = new Expression("x");
// expr = expr.multiply("x").subtract(3).add("x*y");

// console.log(expr.toString());

// console.log(math.derivative(expr.toString(), "x").toString());

// let expr2 = new Expression("1").subtract("x");
// let expr3 = new Expression("1").add("t");
// expr2 = expr2.multiply(expr3);
// console.log(expr2.toString());

function run() {
  // getting all input settings from user
  let inputArray = [...document.querySelectorAll("input")].map((x) => x.value);
  inputArray = inputArray.slice(0, -1);
  console.log(inputArray);
  const startExpression = expressionBuilder(inputArray);

  console.log(startExpression);
  const deltaFx = calculateDeltaFx(startExpression);
  calculateTCoords(deltaFx);
}

// function to display analyzed expression
function expressionBuilder(inputArgs) {
  const baseExpression = "x − ay + bx^2 + cxy + dy^2";
  const finalExpression = inputArgs
    ? `${finalExpressionBuilder(inputArgs)}`
    : baseExpression;
  const finalExpressionEnd = "f(x, y) = " + finalExpression;
  console.log(finalExpressionEnd);
  const expressionOutput = document.querySelector(".expression");

  // removes previous expr
  [...expressionOutput.childNodes].forEach((x) => x.parentNode.removeChild(x));

  expressionOutput.appendChild(document.createTextNode(finalExpressionEnd));

  return finalExpression;
}

function finalExpressionBuilder(inputs) {
  //I thought abough converting to floats/ints here, but I guess I will carry on all the way with Strings, since math.js / algebra.js work with Strings for derivatives etc
  let finalExpressionConcatenated = `x - ${inputs[0]}*y + ${inputs[1]}*x^2 + ${inputs[2]}*x*y + ${inputs[3]}*y^2`;
  globalSettings.xStart = inputs[4] ? inputs[4] : 0;
  globalSettings.yStart = inputs[5] ? inputs[5] : 0;
  globalSettings.eps = inputs[6] ? inputs[6] : 0.5;
  globalSettings.t = inputs[7] ? inputs[7] : 0;
  console.log(globalSettings);
  //return finalExpressionConcatenated;
  return "2*x*y + y - x^2 - 2*y^2";
}

function calculateDeltaFx(inputExpression) {
  const firstDerivative = math.derivative(inputExpression, "x").toString();
  const secondDerivative = math.derivative(inputExpression, "y").toString();

  // potentially return derivative as well, or display them here in dom already, even before calculations start
  console.log("first derivative= ", firstDerivative);
  console.log("second derivative= ", secondDerivative);

  const deltaFx = [
    math.evaluate(firstDerivative, {
      x: globalSettings.xStart,
      y: globalSettings.yStart,
    }),
    math.evaluate(secondDerivative, {
      x: globalSettings.xStart,
      y: globalSettings.yStart,
    }),
  ];
  return deltaFx;
}

function calculateTCoords(deltaFx) {
  console.log("deltaFx = ", deltaFx);
  const globalX = new Expression(globalSettings.xStart);
  const globalY = new Expression(globalSettings.yStart);

  // here not ===, but just ==, due to me passing in ints. Something something math.js is wonky when negative signs in strings, thus it was just quicker for me potential #TODO
  const firstTvalue =
    deltaFx[0] == "0"
      ? globalX
      : globalX.add(new Expression("t").multiply(deltaFx[0])).toString();
  const secondTvalue =
    deltaFx[1] == "0"
      ? globalY
      : globalY.add(new Expression("t").multiply(deltaFx[1])).toString();
  console.log(firstTvalue.toString());
  console.log(secondTvalue.toString());
}

function intiializeApp() {
  expressionBuilder();
  // bind submit button to run everything
  document.querySelector(".submitBtn").addEventListener("click", run);
}

intiializeApp();
console.log("----------------------");
console.log("----------------------");
console.log("----------------------");
console.log("----------------------");

//console.log(new Expression("t"))
