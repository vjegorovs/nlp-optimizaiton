# A simple frontend for Minimizing/Maximizing Non-restricted Linear Programming functions with two variables

## More on Linear Programming [Here](https://en.wikipedia.org/wiki/Linear_programming)

![Screenshot](pic.png)

## You have the option to build out a function based on the template function by providing arguments a,b,c,d | starting coordinates x,y. Additionally, you can specify precision and constant t step, which by default is dynamic. All unentered arguments are defaulted to "1".

## As a result, an iteration table is generated with baseline 10 iterations. If by then the precision target was not met, a button appears to perform 10 more iterations per request.

To compare results, you can query the function in Wolframalpha [like so](https://www.wolframalpha.com/input/?i=minimize%5Bx+-+2*y+%2B+1*x%5E2+%2B+2*x*y+%2B+2*y%5E2%2C%7Bx%2Cy%7D%5D)
