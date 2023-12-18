import {
    jq,useTemp
}
from "http://localhost:8080/module/wheel/jq.js"

let jsdType = {}
let c = {};

jsdType.addmore = function(type, code, dv) {
    try {
        jsdType[type] = code
        c[type] = class {
            constructor(infor, list, dv, more) {
                this.jsdlist = {}
                this.jsdlist.type = type;
                this.jsdlist.infor = infor;
                this.jsdlist.dv = dv;
                this.jsdlist.list = list;
                for (let i in more) {
                    this.jsdlist[i] = more[i]
                }
            }
        }
    } catch (err) {
        alert("jsdType.addmore error:" + err.stack)
    }
}

//4个参数分别是：tempObj 待解析对象(obj) formDiv 输出表单位置(HTMLElement) defaultObj 默认状态对象(obj) setCallback 修改时运行回调(函数)(传入：1.被设置属性，2.被设置key，3.被设置value)
//补充解析函数(函数)(系统传入参数1:项目 2.目标项目)
//核心源代码
function jsd(tempObj, formDiv, config={}, defalutObj={}) {
    //加入底层元素的class
    function deleteDefaultValue(target,property,value){
        try {
            //是个jsdType对象，而且有有默认值，
            if (typeof tempObj[property] == 'object' && tempObj[property].jsdlist.dv == value) {
                //alert('其实')
                Reflect.deleteProperty(target, property);
            }
        } catch (err) {
            alert("测试错误 jsd删除属性失败:" + err.stack)
        }
        return true
    }
    formDiv.classList.add('jsdBase')
    //双向绑定如果需要，那么就至少需要一个方法层来控制元素
    //proxy配置，用于动态执行方法
    let proxyConfig = {}
    //返回对象层，要套proxy
    let returnObjb = new tempObj.constructor()
    let returnObj = new Proxy(returnObjb, proxyConfig);
    if(config.omitDefaults){
    proxyConfig.set = function(target, property, value, re) {
        target[property] = value
        deleteDefaultValue(target,property,value)
        return true
    }
    }
    //遍历tempObj，识别jsdType对象
    for (let key in tempObj) {
        //构建worker对象，用于在jsdType自定义函数内与主系统通信
        let worker
        try {
            worker = {
                useName: () => {alert('useName已弃用')},
                getDv: () => {
                    if (defalutObj) {
                        return defalutObj[key]
                    }else {return null}
                }
            };
        } catch (err) {
            alert("jsd14.js worker error:" + err.stack)
        }
        if (tempObj[key].jsdlist) {
            //如果是一个jsdType对象，那么：
            //判断是否有介绍
            if (tempObj[key].jsdlist.infor !== '') {
                formDiv.createNewElement('p', {
                    innerHTML: tempObj[key].jsdlist.infor
                })
            }
            try {
                jsdType[tempObj[key].jsdlist.type](returnObj, key, formDiv, tempObj[key].jsdlist, worker);
                if (config.createInputCallback) {
                    config.createInputCallback(key,tempObj,formDiv,returnObj,defalutObj,config)
                }
            } catch (err) {
                if (err.stack == "jsdType[tempObj[key].jsdlist.type] is not a function") {
                    alert('jsd错误：未定义的表单类型：' + tempObj[key].jsdlist.type)
                } else {
                    alert('jsd常规错误：' + err.stack)
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
                    case 'jsd_custom_command':
                        tempObj[key](key,tempObj,formDiv,returnObj,defalutObj,config)
                        useTemp($(tempObj[key]), formDiv.createNewElement('div'))
                        break;
                    default:
                        //保留数据(对于默认定义值)
                        returnObj[key] = tempObj[key]
                }
            } catch (err) {
                alert("jsd14.js jsdCommand error:" + err.stack)
            }
        }
    }

    //自定义proxyConfig
    if (config.customProxyConfig) {
        proxyConfig = config.customProxyConfig
    } else {
        proxyConfig.set = function(target, property, value, re) {
            target[property] = value
            if (config.setCallback) {
                try {
                    config.setCallback(target, property, value, tempObj);
                } catch (err) {
                    alert("设置时处理函数错误:" + err.stack)
                }
            }
            if(config.omitDefaults){
            deleteDefaultValue(target,property,value)
            }
            return true
        }
    }
    return returnObj
}
export {
    jsdType, jsd, c
}