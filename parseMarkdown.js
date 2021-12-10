const katex = require('katex');
require('katex/contrib/mhchem');
const fs = require("fs");
const path = require('path')
const inputFilePath = "./test.md"
const outputFilePath = "./md.html"
const errorPattern = ["\\begin{eqnarray}","\\end{eqnarray}", "\\left{", "\\right}","\\right."]

const head =
    "<!DOCTYPE html>\n" +
    "    <html lang=\"ch\">\n" +
    "    <head>\n" +
    "        <meta charset=UTF-8>\n" +
    "        <title>" +
    path.parse(inputFilePath).name +
    "</title>\n" +
    "       <style>\n" +
    "/* From extension vscode.markdown-math */\n" +
    "\n" +
    "/*---------------------------------------------------------------------------------------------\n" +
    " *  Copyright (c) Microsoft Corporation. All rights reserved.\n" +
    " *  Licensed under the MIT License. See License.txt in the project root for license information.\n" +
    " *--------------------------------------------------------------------------------------------*/\n" +
    "\n" +
    ".katex-error {\n" +
    "    color: var(--vscode-editorError-foreground);\n" +
    "}\n" +
    "\n" +
    "</style>\n" +
    "        <link rel=stylesheet href=../css/kate.min.css integrity=sha384-yFRtMMDnQtDRO8rLpMIKrtPCD5jdktao2TV19YiZYWMDkUR5GQZR/NOVTdquEx1j crossorigin=anonymous>\n" +
    "<link href=../css/katex-copytex.min.css rel=stylesheet type=text/css>\n" +
    "        <link rel=stylesheet href=../css/markdown.css>\n" +
    "<link rel=stylesheet href=../css/highlight.css>\n" +
    "<style>\n" +
    "            body {\n" +
    "                font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif;\n" +
    "                font-size: 14px;\n" +
    "                line-height: 1.6;\n" +
    "            }\n" +
    "        </style>\n" +
    "        <style>\n" +
    ".task-list-item { list-style-type: none; } .task-list-item-checkbox { margin-left: -20px; vertical-align: middle; }\n" +
    "</style>\n" +
    "\n" +
    "        <script src=../js/katex-copytex.min.js></script>\n" +
    "\n" +
    "    </head>\n" +
    "    <body>"
const tail = "\n" +
    "    </body>\n" +
    "</html>"

const md = require('markdown-it')();

fs.readFile(inputFilePath, 'utf8' , (err, data) => {
    if (err) {
        console.error(err)
    }

    let result = md.render(data)
    // 替换转义字符
    let re = new RegExp("&lt;","g")
    result = result.replace(re, '<')
    re = new RegExp("&gt;", 'g')
    result = result.replace(re, '>')
    re = new RegExp("&amp;",'g')
    result = result.replace(re, "")

    result = parseFortran(result)
    result = head + result + tail
    fs.writeFile(outputFilePath, result, err => {
        if (err) {
            console.error(err)
        }
    })

})

// 通过katex转换公式
function parseFortran(html){
    let mdHtml = html
    const re = /\$+([^\$]+)\$+/g        // g 代表全局搜索
    const segment = html.match(re)
    const re2 = /\$/g
    for(let i=0;i<segment.length;i++){
        if (count(segment[i])===2){
            try {
                let mathFortran = katex.renderToString(segment[i].replace(re2,''),{
                    macros:{
                        "\#":"\\#"
                    },
                    strict: "ignore"
                });
                mdHtml = mdHtml.replace(segment[i], mathFortran)
            }
            catch{
                let duplication = segment[i]
                for(let k=0;k<errorPattern.length;k++){
                    duplication = duplication.replace(errorPattern[k], '')
                }
                try{
                    let mathFortran = katex.renderToString(duplication.replace(re2,''),{
                        macros:{
                            '\#': "\\#"
                        }
                    });
                    mdHtml = mdHtml.replace(segment[i], mathFortran)
                }catch {
                }
            }
        }
        else {
            try {
                let mathFortran = katex.renderToString(segment[i].replace(re2,''),{
                    displayMode: true,
                    macros:{
                        "\#":"\\#"
                    },
                    strict: "ignore"
                });
                mdHtml = mdHtml.replace(segment[i], mathFortran)
            }
            catch{
                let duplication = segment[i]
                for(let k=0;k<errorPattern.length;k++){
                    duplication = duplication.replace(errorPattern[k], '')
                }
                try{
                    let mathFortran = katex.renderToString(duplication.replace(re2,''),{
                        displayMode: true,
                        macros:{
                            '\#': "\\#"
                        }
                    });
                    mdHtml = mdHtml.replace(segment[i], mathFortran)
                }catch {
                }
            }
        }
    }
    return mdHtml
}

// 计算公式中$的个数，用于判断是内嵌公式还是显示公式
function count(str){
    let ret = 0;
    for(let i=0; i<str.length; i++){if(str.charAt(i)==='$') ret++;}
    return ret;
}
