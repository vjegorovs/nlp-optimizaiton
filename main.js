// let Fraction = algebra.Fraction;
// let Expression = algebra.Expression;
// let Equation = algebra.Equation;
const globalSettings = { xStart: null, yStart: null, eps: null, t: null };

function run() {
  // getting all input settings from user
  let inputArray = [...document.querySelectorAll("input")].map((x) => x.value);
  inputArray = inputArray.slice(0, -1);
  console.log(inputArray);
  const startExpression = expressionBuilder(inputArray);

  console.log(startExpression);
  const deltaFx = calculateDeltaFx(startExpression);
  const newCoords = calculateTCoords(deltaFx);
  const tExpression = calculateTStar(newCoords, startExpression);
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
  //I thought abough converting to floats/ints here, but I guess I will carry on all the way with Strings, since math.js work with Strings for derivatives etc
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
  const globalX = globalSettings.xStart.toString();
  const globalY = globalSettings.yStart.toString();
  console.log(deltaFx[1].toString());
  console.log(`${globalY} + ${deltaFx[1].toString()} * t`);

  // here not ===, but just ==, due to me passing in ints. Something something math.js is wonky when negative signs in strings, thus it was just quicker for me. Potential #TODO
  // added a second ternary to eliminate returns in fomr of "0 + 5t", checking for the first zero and ommiting it if its there
  // const firstTvalue =
  //   deltaFx[0].toString() === "0"
  //     ? globalX
  //     : globalX === "0"
  //     ? new Expression("t").multiply(deltaFx[0].toString()).toString()
  //     : globalX
  //         .add(new Expression("t").multiply(deltaFx[0].toString()))
  //         .toString();
  // const secondTvalue =
  //   deltaFx[1].toString() === "0"
  //     ? globalY
  //     : globalY === "0"
  //     ? new Expression("t").multiply(new Expression(deltaFx[1])).toString()
  //     : globalY.add(
  //         new Expression("t").multiply(new Expression(deltaFx[1])).toString()
  //       );

  const firstTvalue =
    deltaFx[0].toString() === "0"
      ? globalX
      : globalX === "0"
      ? `${deltaFx[0].toString()} * t`
      : `${globalX} + ${deltaFx[0].toString()} * t`;
  const secondTvalue =
    deltaFx[1].toString() === "0"
      ? globalY
      : globalY === "0"
      ? `${deltaFx[1].toString()} * t`
      : `${globalY} + ${deltaFx[1].toString()} * t`;
  console.log(firstTvalue.toString());
  console.log(secondTvalue.toString());

  return [firstTvalue, secondTvalue];
}

function calculateTStar(coords, expression) {
  console.log("Start expr = ", expression);
  console.log(`Coords = (${coords[0]},${coords[1]})`);
  //console.log(new Expression(expression).toString());

  const lol = "(" + coords[1].toString() + ")";
  const result = math.simplify(expression, {
    x: math.parse(coords[0].toString()),
    y: math.parse(coords[1].toString()),
  });

  console.log("result = ", result.toString());
  // console.log("exptest = ", algebra.parse(result.toString().toString()));
  // console.log("deriv = ", math.derivative(result, "t").toString());
  // console.log(
  //   new Equation(algebra.parse(math.derivative(result, "t").toString()), 0)
  //     .solveFor("t")
  //     .toString()
  // );
  // return new Equation(algebra.parse(math.derivative(result, "t").toString()), 0)
  //   .solveFor("t")
  //   .toString();
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

// const eq = "2 * (1 - t) - t + -(2 * (1 - t) ^ 2)";
