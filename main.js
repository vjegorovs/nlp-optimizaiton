/*
A list of potential nice to haves, todos, ideas:
- quick introduction on first visit, with a button in top left to open it again, show only on new visit, track via localstorage?
- add 100 more iterations button as well. Or 50, depends.
- Partially connected to the above point, create a rest api backend for the calculations, will allow to easily crank out
calculations way past 10 at a time. Currently any done past +/- 300 iteratinos load quite slowly since its client dependant
- Add media queries for mobile and fully fledged responsiveness
- what is lp, what this tool achieves, similar to intro, but somewhere clickable I guess
*/

const globalSettings = {
  xStart: null,
  yStart: null,
  eps: null,
  t: null,
  tSet: false,
};

function run() {
  // check if more iterations button is present before a fresh run

  let moreIterationsBtn = document.querySelector(".moreIterations");
  const toggleCSSClasses = () => {
    moreIterationsBtn.closest("li").classList.toggle("hidden_btn");
    moreIterationsBtn.closest("li").classList.toggle("visible_btn");
  };

  if (moreIterationsBtn.closest("li").classList.contains("visible_btn")) {
    toggleCSSClasses();
  }

  // check if previous runs present, clear table rows if yes
  if (globalSettings.xStart) {
    const tableRoot = document.querySelector(".table-rows");
    globalSettings.tSet = false;
    [...tableRoot.children].forEach((x) => x.parentNode.removeChild(x));
  }
  // getting all input settings from user
  // second map to check for empty fields, if yes then just replacing with 1
  let inputArray = [...document.querySelectorAll("input")]
    .map((x) => x.value)
    .slice(0, -1)
    .map((x) => (x === "" ? "1" : x));

  // in case any default 1's inserted perhaps a popup to inform user?

  console.log(inputArray);
  const startExpression = expressionBuilder(inputArray);

  console.log("Start expression =", startExpression);

  let flag = true;

  let finalResult;
  let iterations = 1;
  let iterationslimit = 10;
  let frontendObject = {};

  const iterationRun = () => {
    const deltaFx = calculateDeltaFx(startExpression);
    console.log(
      "The deltaFx coords are = (",
      deltaFx[0].toString(),
      ",",
      deltaFx[1].toString(),
      ")"
    );
    const newCoords = calculateTCoords(deltaFx);

    // if t = 1 by default than calculate, else use the user input(if user wants 1, boohoo, 1 will not change the coordinates)
    const tStar =
      globalSettings.tSet !== true
        ? calculateTStar(newCoords, startExpression)
        : globalSettings.t;

    const nextIterationCoordinates = calculateNewCoordinates(tStar, deltaFx);

    flag = ([] = loopCheck(startExpression, deltaFx)).includes(false);

    console.log("function value! = ", functionResult(startExpression).text());
    frontendObject = {
      iteration: iterations,
      startcoordinates: `(${globalSettings.xStart},${globalSettings.yStart})`,
      deltaFx: `(${deltaFx[0].toString()},${deltaFx[1].toString()})`,
      tCoordinates: `(${newCoords[0].toString()},${newCoords[1].toString()})`,
      tStar: `${tStar}`,
      functionValue: `${functionResult(startExpression).text()}`,
    };
    console.log(frontendObject);
    createDOMTableRow(frontendObject);
    [globalSettings.xStart, globalSettings.yStart] = nextIterationCoordinates;
    console.log("Iterations performed: ", iterations);
    console.log("one more iteration? ", flag);
    iterations++;
    const finalIterationsContainer = document.querySelector(".goal-iterations");
    const finalFunctionContainer = document.querySelector(".function-value");
    if (finalIterationsContainer.childNodes[2]) {
      finalIterationsContainer.replaceChild(
        document.createTextNode(frontendObject.iteration),
        finalIterationsContainer.childNodes[2]
      );
    }
    if (finalFunctionContainer.childNodes[2]) {
      finalFunctionContainer.replaceChild(
        document.createTextNode(frontendObject.functionValue),
        finalFunctionContainer.childNodes[2]
      );
    }
  };
  while (flag && iterations <= iterationslimit) {
    iterationRun();
  }

  if (flag) {
    // add button to dom, bind function

    function tenMoreiterations() {
      iterationslimit += 10;
      while (flag && iterations <= iterationslimit) {
        iterationRun();
      }
      if (!flag) toggleCSSClasses();
    }

    moreIterationsBtn.replaceWith(moreIterationsBtn.cloneNode(true));
    moreIterationsBtn = document.querySelector(".moreIterations");
    moreIterationsBtn.addEventListener("click", tenMoreiterations);

    toggleCSSClasses();
  }

  console.log("-------------------END-----------------");
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
  const expressionOutput = document.querySelector(".expre");

  // removes previous expr
  [...expressionOutput.childNodes].forEach((x) => x.parentNode.removeChild(x));

  expressionOutput.appendChild(document.createTextNode(finalExpressionEnd));

  return finalExpression;
}

function finalExpressionBuilder(inputs) {
  let finalExpressionConcatenated = `x - ${inputs[1]}*y + ${inputs[2]}*x^2 + ${inputs[3]}*x*y + ${inputs[4]}*y^2`;
  globalSettings.xStart = inputs[5] !== "1" ? nerdamer(inputs[5]).text() : "0";
  globalSettings.yStart = inputs[6] !== "1" ? nerdamer(inputs[6]).text() : "0";
  globalSettings.eps = inputs[7] !== "1" ? inputs[7] : "0.5";

  console.log("x input =", inputs[5]);
  console.log("x =", nerdamer(inputs[5]).text());
  console.log("y =", nerdamer(inputs[6]).text());

  globalSettings.t = inputs[8] !== "1" ? inputs[8] : "1";

  // flag to use the same t all the way is its set by the user
  if (globalSettings.t === inputs[8] && inputs[8] !== "1")
    globalSettings.tSet = true;
  console.log(globalSettings);

  // perhaps a more elaborate check should be performed here, something like regexp for at least x, y and so on present, maybe some day
  return inputs[0] === "1" ? finalExpressionConcatenated : inputs[0];
  //return "2*x*y + 2* y - x^2 - 2*y^2";
}

function loopCheck(inputExpression, deltaFx) {
  // it is essentially the same as calculateDeltaFx, need to combine them into one #TODO
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

  console.log("loopcheck x/y = ", loopLeftSides.toString());
  const comparison = loopLeftSides.map((x) =>
    nerdamer(`abs(${x.toString()})`).lte(`${globalSettings.eps}`)
  );

  return comparison;
}

function calculateDeltaFx(inputExpression) {
  const firstDerivative = nerdamer(`diff(${inputExpression}, x)`).toString();
  const secondDerivative = nerdamer(`diff(${inputExpression}, y)`).toString();

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

  return [firstTvalue, secondTvalue];
}

function calculateTStar(coords, expression) {
  const simplifiedExpression = nerdamer(nerdamer(expression).toString(), {
    x: coords[0].toString(),
    y: coords[1].toString(),
  });

  const firstDerivative = nerdamer(
    `diff(${simplifiedExpression}, t)`
  ).toString();

  const finalTstar = nerdamer.solveEquations(firstDerivative.toString(), "t");

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

  return [firstNewCoordinate.toString(), secondNewCoordinate.toString()];
}

function createDOMTableRow(obj) {
  const newElement = document.createElement("li");
  newElement.className = "table-row";
  newElement.innerHTML = `
  <div class="iteration-number"><p>${obj.iteration}</p></div>
  <div class="start-coordinates"><p>${obj.startcoordinates}</p></div>
  <div class="deltaFx"><p>${obj.deltaFx}</p></div> 
  <div class="t-coordinates"><p>${obj.tCoordinates}</p></div>
  <div class="t-star"><p>${obj.tStar}</p></div>
  <div class="function-value"><p class="bold_p">${obj.functionValue}</p></div>
  `;
  const tableRoot = document.querySelector(".table-rows");
  tableRoot.append(newElement);
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
