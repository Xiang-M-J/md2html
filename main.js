const http = require('http');//创建服务器的
const fs = require('fs');
//引入进来的是模块，模块中有方法，下一步就是使用方法
//Node.js一个最主要的特点：执行的基本都是函数

//创建服务
const myServer = http.createServer(function (req, res) {
    //req->请求变量：客户端请求服务器的
    //res->响应变量:服务器要给客户端写回的变量
    //前端页面应该给客户端显示，即写回去
    //这之前应该先把文件内容读出来
    const html = fs.readFileSync('./index.html');
    res.write(html);

    //结束写的操作
    res.end();

});


//服务端等着客户端请求需要做一个监听。通过创建的服务。
//监听
myServer.listen('8000',function(err){
    if(err){
        console.log(err);
        throw err;
    }
    console.log("server is running at http://127.0.0.1:8000");
})

const join = require('path').join;

function getMdFiles(mdPath){
    let mdFiles = [];
    function findMdFile(path){
        let files = fs.readdirSync(path);
        files.forEach(function (item, index) {
            let fPath = join(path,item);
            let stat = fs.statSync(fPath);
            if(stat.isDirectory() === true) {
                findMdFile(fPath);
            }
            if (stat.isFile() === true) {
                let arr = fPath.split('.')
                if (fPath.split('.')[arr.length -1] === 'md' && fPath.split('.')[arr.length -1] === 'markdown'){
                    mdFiles.push(fPath);
                }
            }
        });
    }
    findMdFile(mdPath)
    return mdFiles
}

let l = getMdFiles("layui");
