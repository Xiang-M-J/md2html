let result = "#(x_j,c_i)"
result = result.match("/\#/")
console.log(result)

const katex = require('katex');
require('katex/contrib/mhchem');
const fs = require("fs");

const mathp = "D_{KL}(p(x;\\theta)||p(x;\\theta+\\delta\\theta))=\\int p(x;\\theta)(f(\\theta)-f(\\theta+\\delta\\theta))dx\\\n" +
    "=-\\int p(x;\\theta)(\\delta\\theta^T\\frac{\\partial f(\\theta)}{\\partial\\theta}+\\frac{1}{2}\\delta\\theta^T\\frac{\\partial f(\\theta)}{\\partial\\theta}\\frac{\\p\n" +
    "artial f(\\theta)^T}{\\partial\\theta}\\delta\\theta)dx\\\n" +
    "=-\\delta\\theta^T\\int p(x;\\theta)\\frac{\\partial logp(x;\\theta)}{\\partial\\theta}dx\\\n" +
    "-\\frac{1}{2}\\delta\\theta^T\\int p(x;\\theta)\\frac{\\partial f(\\theta)}{\\partial\\theta}\\frac{\\partial f(\\theta)^T}{\\partial\\theta}dx\\delta\\theta\\\n" +
    "=-\\delta\\theta^T\\int p(x;\\theta)\\frac{\\frac{\\partial p(x;\\theta)}{\\partial\\theta}}{p(x;\\theta)}dx-\\frac{1}{2}\\delta\\theta^TG\\delta\\theta\\\n" +
    "=-\\frac{1}{2}\\delta\\theta^TG\\delta\\theta\n"

let mathFortran = katex.renderToString(mathp,{
    displayMode: true,
});
console.log(mathFortran)
