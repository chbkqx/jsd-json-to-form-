function $(ele) {
    let e = document.querySelectorAll(ele)
    if(e[1]){
    return [...e]
    }else{
    return e[0]
    }
}
function edelete(object,property){
return Reflect.deleteProperty(object, property);
}
let jq = (function(){
window.btnTree = document
//alert('jq完成')
function $(ele) {
    let e = document.querySelectorAll(ele)
    if(e[1]){
    return [...e]
    }else{
    return e[0]
    }
}
Element.prototype.on = function(event, callback) {
this.addEventListener(event, callback);
}
Element.prototype.clearOn = function(){
const cloneElement = this.cloneNode(true);
this.parentNode.replaceChild(cloneElement, this);
}
Element.prototype.createNewElement = function(nodeName, attributes = {}, mode = "c") {
try{
    //alert('特殊')
    const element = document.createElement(nodeName);
    setAllAttributes(element,attributes)
    switch (mode) {
        case "c":
            this.appendChild(element);
            break;
        case "a":
            this.parentNode.insertBefore(element, this.nextSibling);
            break;
        case "b":
            this.parentNode.insertBefore(element, this);
            break;
    }
    return element;
}catch(err){alert("creeeeeeerror:"+err.message)}
};

//jq over
})()
//使用模板
function useTemp(templateElement, targetElement) {
  try {
    const content = document.importNode(templateElement.content, true);
    targetElement.parentNode.replaceChild(content, targetElement);
  } catch (err) {
    alert("wheel jq.js useTempError: " + err.message);
  }
}
//创建下载文件
function downloadFile(text,downloadElement){
try{const blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });
    downloadElement.download = "myTextFile.txt";
    downloadElement.href = URL.createObjectURL(blob);
    downloadElement.click()
}catch(err){alert("jq.js downloadFile error:"+err.message)}
}
//读取指定input文件，使用例子：readFile(document.querySelector('#infi')).then(function(value){alert(value)})
//第一次用Promise，有点紧张。
function readFile(input){
    return new Promise((resolve)=>{
        let reader = new FileReader();
    reader.onload = function(e) {
        resolve(reader.result);
    }
    reader.readAsText(input.files[0]);
    })
}
//js对象转属性
function setAllAttributes(element, attrObject) {
    for (let key in attrObject) {
        if(key=="innerHTML"){
        element.innerHTML = attrObject[key]
        }else if (attrObject[key]){
        //一般值，不是undefined
        if(typeof attrObject[key]=='object'){
        element.setAttribute(key,JSON.stringify(attrObject[key]))
        }else{
        element.setAttribute(key,attrObject[key])
        }
        }else{
        //alert('undefined')
        }
    }
}
//获取属性转对象
function getAllAttributes(element) {
let obj = {}
let attrs = element.attributes
for (var i = 0; i < attrs.length; i++) { // 遍历NamedNodeMap中的每个元素
  var attr = attrs[i]; // 获取当前的Attr对象
  obj[attr.name] = attr.value; // 将Attr对象的名称和值作为属性和值添加到对象中
}
return obj
}
//随机数生成
function randomN(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*按序遍历程序，比较方便*/
function nfor(element, func) {
    let i = 0;
    let elementL = element.length
    for (i = 0; i < elementL; i++) {
        func(element[i], i)
    }
}
//toggle切换隐藏与显示
function toggle(list) {
    let dis = list.style.display;
    if (dis == "block") {
        dis = "none"
    } else {
        dis = "block"
    }
}
//添加css文件
function addCssFile(cssLink){
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssLink;
    document.head.appendChild(link);
}
//btn简化
function btn(e,f){
window.btnTree.querySelector(e).addEventListener('click',(event)=>{f(event)})
}

//获取坐标

function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        zx:centerX,
        zy:centerY
    };
}
function ajax(data, php) {
var xhttp = new XMLHttpRequest();
    return new Promise((r)=>{
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        r(this.responseText)
}
        }
    
    xhttp.open("POST", php, true);
    xhttp.send(data);
    })
}
export {$,jq,useTemp,setAllAttributes,getAllAttributes,randomN,nfor,toggle,addCssFile,btn,downloadFile,readFile,getElementPosition,ajax}
//export default $