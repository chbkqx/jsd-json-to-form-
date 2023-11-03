import {
    jq
}
from "http://localhost:8080/module/wheel/jq.js"
import {
    toFormCsh
}
from "./csh.js"
let jsdType = {}
let c = {};
(() => {
    //alert('睡觉就睡觉')
    window.jsdTypeDv = {}
})();

jsdType.addmore = function(name, code, dv) {
    try {
        jsdType[name] = code
        c[name] = class {
            constructor(infor, list = [], className, more) {
                this.jsdlist = {}
                this.jsdlist.type = name;
                this.jsdlist.infor = infor;
                this.jsdlist.className = className
                this.jsdlist.list = list;
                for (let i in more) {
                    this.jsdlist[i] = more[i]
                }
            }
        }
        window.jsdTypeDv[name] = dv
    } catch (err) {
        alert("jsdType.addmore error:" + err.message)
    }
}
jsdType.addmore('boolean', function(returnObj, key, formDiv,value, worker) {
    value.list = value.list||{}
    worker.useName(formDiv, value)
    let newValue = worker.getDv(key) || value.list[0] || jsdTypeDv.text
    let newElement = formDiv.createNewElement("input", {
        "type": "checkbox",
        "checked": newValue
    })
    toFormCsh("click", "checked", newElement, returnObj, key)
})

jsdType.addmore('color', function(returnObj, key, formDiv,value, worker) {
value.list = value.list||{}
        worker.useName(formDiv, value)
        let newValue = worker.getDv(key) || value.list[0] || jsdTypeDv.text
    let newElement = formDiv.createNewElement("input", {
        "type": "color",
        "value": newValue
    })
    toFormCsh("change", "value", newElement, returnObj, key, worker);
})

jsdType.addmore('radio', function(returnObj, key, formDiv, value, worker) {
if(value.list==null){
alert('jsd错误：radio没有值范围')
return
}
        worker.useName(formDiv, value)
        let dek = worker.getDv(key) || value.list[0] || jsdTypeDv.text
    let newElement = formDiv.createNewElement("select", {
        "value": dek
    })
    value.list.forEach((forValue) => {
        newElement.createNewElement("option", {
            "innerHTML": forValue[0]
        })
            .value = forValue[1];
    })
    toFormCsh("change", "value", newElement, returnObj, key, worker)
})

jsdType.addmore('number', function(returnObj, key, formDiv, value, worker) {
    //worker.removeTitle()
        value.list = value.list||{}
        worker.useName(formDiv, value)
        let dek = worker.getDv(key) || value.list[2] || jsdTypeDv.text
    let newElement = formDiv.createNewElement("input", {
        type: "range",
        min: value.list[0],
        max: value.list[1],
        value: dek
    })
    let newp = formDiv.createNewElement("input", {
        type: "number",
        value: dek
    })
    newElement.on("input", () => {
        returnObj[key] = newElement.value;
        newp.value = newElement.value;
    });
    newp.on("input", () => {
        if (newp.value >= value.list[1]) {
            newp.value = value.list[1]
        } else if (newp.value <= value.list[0]) {
            newp.value = value.list[0]
        }
        newElement.value = newp.value;
        returnObj[key] = newElement.value;
    });
    //returnObj[key] = value.list[2];
})
jsdType.addmore('text', function(returnObj, key, formDiv, value, worker) {
    try {
        value.list = value.list||{}
        worker.useName(formDiv, value)
        let newValue = worker.getDv(key) || value.list[0] || jsdTypeDv.text
        let newElement = formDiv.createNewElement("input", {
            "type": "text",
            "value": newValue
        })
        toFormCsh("input", "value", newElement, returnObj, key, worker)
    } catch (err) {
        alert("textbug error:" + err.message)
    }
}, 'shsh')
jsdType.addmore('title', function(returnObj, key, formDiv, dek, value, worker) {
    Reflect.deleteProperty(returnObj, key);
})

//4个参数分别是：tempObj 待解析对象(obj) formDiv 输出表单位置(HTMLElement) defaultObj 默认状态对象(obj) setCallback 修改时运行回调(函数)(传入：1.被设置属性，2.被设置key，3.被设置value)
//补充解析函数(函数)(系统传入参数1:项目 2.目标项目)
//核心源代码
function jsd(tempObj, formDiv, config, defalutObj) {
    formDiv.classList.add('jsdBase')
    //双向绑定如果需要，那么就至少需要一个方法层来控制元素
    //proxy配置，用于动态执行方法
    let proxyConfig = {}
    //返回对象层，要套proxy
    let returnObjb = new tempObj.constructor()
    let returnObj = new Proxy(returnObjb, proxyConfig);
    proxyConfig.set = function(target, property, value, re) {
        target[property] = value
        if (typeof tempObj[property] == 'object' && config.omitDefaults && tempObj[property].jsdlist.dv == value) {
            Reflect.deleteProperty(target, property);
        }
        return true
    }
    for (let key in tempObj) {
        let worker
        try {
            worker = {
                useName: () => {
                    if(tempObj[key].jsdlist.infor !== ''){
                    formDiv.createNewElement('p', {
                        innerHTML: tempObj[key].jsdlist.infor
                    })
                    }
                },
                getDv: () => {
                    if (defalutObj) {
                        return defalutObj[key]
                    }
                }
            };
        } catch (err) {
            alert("jsd14.js worker error:" + err.message)
        }
        if (tempObj[key].jsdlist) {
            //如果是一个jsd对象，那么：

            try {
                jsdType[tempObj[key].jsdlist.type](returnObj, key, formDiv, tempObj[key].jsdlist, worker);
                if (config.createInputCallback) {
                    config.createInputCallback(tempObj, returnObj, formDiv, key)
                }
            } catch (err) {
                if (err.message == "jsdType[tempObj[key].jsdlist.type] is not a function") {
                    alert('jsd错误：未定义的表单类型：' + tempObj[key].jsdlist.type)
                } else {
                    alert('jsd错误：' + err.message)
                }
            }
        } else if (typeof tempObj[key] === "object" && tempObj[key] !== null) {
            //嵌套执行jsd

            let nextDiv = formDiv.createNewElement("div", {
                'class': key
            })
            if (defalutObj) {
                returnObjb[key] = jsd(tempObj[key], nextDiv, config, defalutObj[key]);
            } else {
                returnObjb[key] = jsd(tempObj[key], nextDiv, config);
            }
        } else {
            try {
                switch (key) {
                    case 'jsd_class':
                        formDiv.classList.add(tempObj[key])
                        break;
                    case 'jsd_setPos':
                        formDiv = $(tempObj[key])
                        break;
                    case 'jsd_element':
                        useTemp($(tempObj[key]), formDiv.createNewElement('div'))
                        break;
                    default:
                        //保留数据(对于默认定义值)
                        returnObj[key] = tempObj[key]
                }
            } catch (err) {
                alert("jsd14.js jsdCommand error:" + err.message)
            }
        }
    }

    //自定义proxyConfig
    if (config.customProxyConfig) {
        proxyConfig = config.customProxyConfig
    } else {
        proxyConfig.set = function(target, property, value, re) {
            target[property] = value
            try {
                config.setCallback(target, property, value, tempObj);
            } catch (err) {
                alert("设置时处理函数错误:" + err.message)
            }
            if (typeof tempObj[property] == 'object' && config.omitDefaults && tempObj[property].jsdlist.dv == value) {
                Reflect.deleteProperty(target, property);
            }
            return true
        }
    }
    return returnObj
}
export {
    jsdType, jsd, c
}