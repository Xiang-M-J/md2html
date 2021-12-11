// import layui from './layui/layui'
// function TreeData(title,children) {
//     this.title = title
//     this.children = children
//     this.push = function () {
//
//     }
//     this.value = function () {
//
//     }
// }

let data = []
let dropzone = document.getElementById("dropzone");
let listing  = document.getElementById("listing");

// layui.use('tree', function(){
//     const tree = layui.tree;
//     //渲染
//     const inst = tree.render({
//         elem: '#fileTree'  //绑定元素
//         ,showLine: false
//         ,spread: true
//         , data: data
//     });
// });
/**
 * 读取文件
 * @param  item         FileSystemDirectoryEntry 对象实例（目录实体）
 * @param  container     显示容器
 * @return void
 */
function scanFiles(item, container) {
    // const fso = new ActiveXObject("Scripting.FileSystemObject");
    // var f = fso.GetFolder(document.all.fixfolder.value);
    // var fc = new Enumerator(f.files);
    // var s = "";
    // for (; !fc.atEnd(); fc.moveNext()) {
    //     s += fc.item();
    //     s += "<br/>";
    // }
    // fk = new Enumerator(f.SubFolders);
    // for (; !fk.atEnd(); fk.moveNext()) {
    //     s += fk.item();
    //     s += "<br/>";
    // }
    //
    // textarea.innerHTML = s

    let elem = document.createElement("li");
    if (item.isFile){
        let arr = item.name.split('.')
        if (arr[arr.length-1] === 'md' || arr[arr.length-1]==='markdown'){
            elem.innerHTML = item.name;
            container.appendChild(elem);
            // data.push({title: item.name, children:null })
        }
    }else {
        elem.innerHTML = item.name;
        container.appendChild(elem);
        // data.push({title: item.name, children:null })
    }

    // 如果是目录，则递归读取
    if (item.isDirectory) {
        // 使用目录实体来创建 FileSystemDirectoryReader 实例
        let directoryReader = item.createReader();
        let directoryContainer = document.createElement("ul");
        container.appendChild(directoryContainer);
        // data.push({title: item.name, children:null })
        // 上面只是创建了 reader 实例，现在使用 reader 实例来读取 目录实体（读取目录内容）
        directoryReader.readEntries(function(entries) {
            // 循环目录内容
            entries.forEach(function(entry) {
                // 处理内容（递归）
                scanFiles(entry, directoryContainer);
            });
        });
    }
}

// 此事件是必须的，且要阻止默认事件
dropzone.addEventListener("dragover", function(event) {
    event.preventDefault();
}, false);

// 拖拽结束时触发
dropzone.addEventListener("drop", function(event) {
    // 拖拽（转移）的对象列表
    let items = event.dataTransfer.items;
    event.preventDefault();
    listing.innerHTML = "";
    // console.log(items.length)
    for (let i=0; i<items.length; i++) {
        // file 对象（按实例拖拽的内容）转换成 FileSystemFileEntry 对象 或 FileSystemDirectoryEntry 对象
        let item = items[i].webkitGetAsEntry();
        if (item) {
            // 读取文件
            scanFiles(item, listing);
        }
    }
}, false);
function convertToData(data, listing) {
    if (listing === null){
        return
    }
    let child = listing.children
    for(let i=0;i<child.childElementCount;i++){
        data.push({title: child[i].name, children: null})
        convertToData(data.children,child)
    }
}
