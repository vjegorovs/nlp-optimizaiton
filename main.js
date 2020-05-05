const globalSettings = { xStart: null, yStart: null, eps: null, t: null };

function run() {
  // getting all input settings from user
  let inputArray = [...document.querySelectorAll("input")]
    .map((x) => x.value)
    .slice(0, -1);

  console.log(inputArray);
  const startExpression = expressionBuilder(inputArray);

  console.log("Start expression =", startExpression);

  let flag = true;

  let finalResult;
  let iterations = 0;
  while (flag && iterations < 25) {
    const deltaFx = calculateDeltaFx(startExpression);
    console.log(
      "The deltaFx coords are = (",
      deltaFx[0].toString(),
      ",",
      deltaFx[1].toString(),
      ")"
    );
    const newCoords = calculateTCoords(deltaFx);

    const tStar = calculateTStar(newCoords, startExpression);

    const nextIterationCoordinates = calculateNewCoordinates(tStar, deltaFx);

    flag = ([] = loopCheck(startExpression, deltaFx)).includes(false);
    // console.log(`          DeltaFx = (${deltaFx[0].toString()},${deltaFx[1].toString()})
    //       newCoords =(${newCoords[0].toString()},${newCoords[1].toString()})
    //       tStar = ${tStar}
    //       nextIterCoordinates = (${nextIterationCoordinates[0]},${
    //   nextIterationCoordinates[1]
    // })`);
    // finalResult = `    DeltaFx = (${deltaFx[0].toString()},${deltaFx[1].toString()})
    // newCoords =(${newCoords[0].toString()},${newCoords[1].toString()})
    // tStar = ${tStar}
    // nextIterCoordinates = (${nextIterationCoordinates[0]},${
    //   nextIterationCoordinates[1]
    // })`;
    // console.log("------------------------");
    console.log("function value! = ", functionResult(startExpression).text());
    [globalSettings.xStart, globalSettings.yStart] = nextIterationCoordinates;
    // console.log(globalSettings);
    // console.log("------------------------");
    console.log("Iterations performed: ", iterations + 1);
    console.log("one more iteration? ", flag);
    iterations++;
  }
  console.log("-------------------END-----------------");
  //console.log(finalResult);
}

function functionResult(expr) {
  return nerdamer(nerdamer(expr).toString(), {
    x: globalSettings.xStart,
    y: globalSettings.yStart,
  });
}

// function to display analyzed expression
function expressionBuilder(inputArgs) {
  const baseExpression = "x − ay + bx^2 + cxy + dy^2";
  const finalExpression = inputArgs
    ? `${finalExpressionBuilder(inputArgs)}`
    : baseExpression;
  const finalExpressionEnd = "f(x, y) = " + finalExpression;
  //console.log(finalExpressionEnd);
  const expressionOutput = document.querySelector(".expression");

  // removes previous expr
  [...expressionOutput.childNodes].forEach((x) => x.parentNode.removeChild(x));

  expressionOutput.appendChild(document.createTextNode(finalExpressionEnd));

  return finalExpression;
}

function finalExpressionBuilder(inputs) {
  let finalExpressionConcatenated = `x - ${inputs[1]}*y + ${inputs[2]}*x^2 + ${inputs[3]}*x*y + ${inputs[4]}*y^2`;
  globalSettings.xStart = inputs[5] ? nerdamer(inputs[5]).text() : "0";
  globalSettings.yStart = inputs[6] ? nerdamer(inputs[6]).text() : "0";
  globalSettings.eps = inputs[7] ? inputs[7] : "0.5";
  globalSettings.t = inputs[8] ? inputs[8] : "0";
  console.log(globalSettings);

  // #TODO work in custom input from inputs[0] here!!
  //return finalExpressionConcatenated;
  return "2*x*y + 2* y - x^2 - 2*y^2";
}

function loopCheck(inputExpression, deltaFx) {
  const firstDerivative = nerdamer(`diff(${inputExpression}, x)`).toString();
  const secondDerivative = nerdamer(`diff(${inputExpression}, y)`).toString();

  const loopLeftSides = [
    nerdamer(nerdamer(firstDerivative).toString(), {
      x: globalSettings.xStart,
      y: globalSettings.yStart,
    }),
    nerdamer(nerdamer(secondDerivative).toString(), {
      x: globalSettings.xStart,
      y: globalSettings.yStart,
    }),
  ];
  // console.log(
  //   "loopcheck value 1= ",
  //   loopLeftSides[0].text(),
  //   "loopcheck value 2= ",
  //   loopLeftSides[1].text()
  // );
  const lol = loopLeftSides.map((x) =>
    nerdamer(`${x.toString()}`).lte(`${globalSettings.eps}`)
  );
  console.log(lol);
  return lol;
}

function calculateDeltaFx(inputExpression) {
  const firstDerivative = nerdamer(`diff(${inputExpression}, x)`).toString();
  const secondDerivative = nerdamer(`diff(${inputExpression}, y)`).toString();
  //console.log("first derivative by x =", firstDerivative);
  //console.log("first derivative by y =", secondDerivative);

  const deltaFx = [
    nerdamer(nerdamer(firstDerivative).toString(), {
      x: globalSettings.xStart,
      y: globalSettings.yStart,
    }),
    nerdamer(nerdamer(secondDerivative).toString(), {
      x: globalSettings.xStart,
      y: globalSettings.yStart,
    }),
  ];

  return deltaFx;
}

function calculateTCoords(deltaFx) {
  //console.log("deltaFx = ", deltaFx);
  const globalX = globalSettings.xStart.toString();
  const globalY = globalSettings.yStart.toString();

  const firstTvalue = nerdamer(
    deltaFx[0].toString() === "0"
      ? globalX.toString()
      : globalX === "0"
      ? `${deltaFx[0].toString()} * t`
      : `${globalX} + ${deltaFx[0].toString()} * t`
  );
  const secondTvalue = nerdamer(
    deltaFx[1].toString() === "0"
      ? globalY.toString()
      : globalY === "0"
      ? `${deltaFx[1].toString()} * t`
      : `${globalY} + ${deltaFx[1].toString()} * t`
  );

  //console.log("first coord", firstTvalue.toString());
  //console.log("second coord", secondTvalue.toString());

  return [firstTvalue, secondTvalue];
}

function calculateTStar(coords, expression) {
  //console.log("start expression = ", nerdamer(expression).toString());
  //console.log(`Coords = (${coords[0]},${coords[1]})`);

  const simplifiedExpression = nerdamer(nerdamer(expression).toString(), {
    x: coords[0].toString(),
    y: coords[1].toString(),
  });

  //console.log("Expression with t^2 = ", simplifiedExpression.toString());

  const firstDerivative = nerdamer(
    `diff(${simplifiedExpression}, t)`
  ).toString();

  //console.log("derivative from t = ", firstDerivative.toString());
  const finalTstar = nerdamer.solveEquations(firstDerivative.toString(), "t");

  //console.log("t* =", finalTstar.toString());
  return finalTstar.toString();
}

function calculateNewCoordinates(tStar, deltaFx) {
  const globalX = globalSettings.xStart;
  const globalY = globalSettings.yStart;

  const firstNewCoordinate = nerdamer(
    `${globalX} + ${tStar} * ${deltaFx[0].toString()}`
  );
  const secondNewCoordinate = nerdamer(
    `${globalY} + ${tStar} * ${deltaFx[1].toString()}`
  );
  //console.log("new X coordinate = ", firstNewCoordinate.toString());
  //console.log("new Y coordinate = ", secondNewCoordinate.toString());

  return [firstNewCoordinate.toString(), secondNewCoordinate.toString()];
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
// globalSettings.xStart = "-5";
// globalSettings.yStart = "-5";

// console.log(functionResult("x-2*y+10*x^2+-4*x*y+10*y^2").text());
