import {
    jsd,c
}
from "http://localhost:8080/module/jsd14/core.js"
import {jsdType} from 'http://localhost:8080/module/jsd14/matrix.js'
import {
    jq,$,btn
}
from "http://localhost:8080/module/wheel/jq.js"
// index.js
try{
//alert('hshs')
const q = {
    "a": new c.text("颜色",['大概序号']),
    "b": new c.array("数组",[new c.text('文本')]),
    "jsd_class": "aaaaaaaa",
    "cc":new c.boolean('不是说'),
    'ooo':{
    'nn':new c.text("限制"),
    aaa:new c.color('',['#ff00ff']),
    aaaaa:new c.radio('',[['a','1'],['b','2']]),
    num:new c.number('年龄',[1,18,5]),
    'opo':new c.text("颜色",['大概序号'])
    }
};
const aa = [new c.text("颜色"),new c.text("颜色")]
/*这是一个使用示例，解析了一个wb类型的自定义项目，在生产环境中删掉它
printObjectProperties(q, d, divv, function(w, o){
    let ttt
    switch (w.type) {
        case "wb":
            ttt = divv.createNewElement("p", w.list)
            alert(JSON.stringify(w))
            break;
    }
});
*/

//alert('婚纱徐'+aa.constructor)
let d = {}

d = jsd(q, document.querySelector("#di"),{omitDefaults:true,setCallback:(a,b,c,d)=>{
$('#text').innerHTML = `设置了属性a:${JSON.stringify(a)}b:${b}c:${c}特殊:${JSON.stringify(d[b])}`
}
},{"a":"大概","b":[""],"ooo":{"nn":"hhhh","opo":"大概序号"}})

btn('#text',()=>{
var code = "";
        if (localStorage.code) {
            code = localStorage.code;
        }
        let proCode = prompt("请输入代码", code)
        let pro = "try{" + proCode + ";alert('命令执行成功')}catch(err){alert('命令错误：'+err.message)}";
        if (proCode) {
            eval(pro)
            localStorage.code = proCode;
        }
})
$('#bu').on('click',()=>{
alert(JSON.stringify(d))
})
}catch(err){alert("error:"+err.message)}
