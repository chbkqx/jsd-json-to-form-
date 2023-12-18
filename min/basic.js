import {
    jsdType,jsd
}
from './core_min.js'
import {
    toFormCsh
}
from "../csh.js"

jsdType.addmore("array", function(returnObj, key, formDiv, value, worker) {
    //alert('事实就是')
    try {
 //   alert(returnObj+key)
    returnObj[key] = []
  //  alert(JSON.stringify(returnObj[key]))
        value.dv = value.dv || []
        if(value.dv){
        //alert('华东交大'+value.dv+typeof value.dv)
       // alert(JSON.stringify(value.dv))
        }
        //一个测试结果告诉我们，空数组也是true
        // returnObj[key] = worker.getDv(key) || value.dv || [];
        //注：由于某个未知的错误，array暂时不支持调整默认值
//alert(JSON.stringify(returnObj[key]))
        //alert(returnObj[key])
        //创建总的array div
        const arrayDiv = formDiv.createNewElement('div', {
            'class': 'array'
        })
        //创建一堆选项用的div
        const jsdDiv = arrayDiv.createNewElement('div')
        //显示数组内容的p
        const arraySee = formDiv.createNewElement('p')
        //添加项用的button
        const newElementButton = formDiv.createNewElement('button', {
            'type': 'button',
            'innerHTML': '添加项'
        })
        //alert(JSON.stringify(value))
        //在内部用于被jsd的数组，也就是构建出来的小表单
        let insideTempObj = []
        alert(returnObj[key])
        const updateArray = () => {
            jsdDiv.innerHTML = ''
            //维护单个表单的ID，方便找人避免删除和修改不了
            
            let i = 0
            //内部jsd的结果，展示在returnObj[key]上
            let insideReturnObj = []
            insideReturnObj = jsd(insideTempObj, jsdDiv, {
                setCallback: () => {
                    //alert('ddd')
                    //alert(JSON.stringify(returnObj[key]))
                    arraySee.innerHTML = JSON.stringify(returnObj[key])
                    returnObj[key] = insideReturnObj
                },
                createInputCallback: (t, r, itemDiv, k) => {
                    try {
                        //alert(i)
                        const deleteButton = itemDiv.createNewElement('button', {
                            'type': 'button',
                            'innerHTML': '删除'
                        }, "c");
                        deleteButton.id = i
                        // Delete button click event
                        deleteButton.on('click', () => {
                            //alert('dhdhdhsh:'+i)
                            //alert(deleteButton.id)
                            insideTempObj.pop()
                            returnObj[key].splice(deleteButton.id, 1); // Remove the item from the array
                            updateArray();
                            //alert(JSON.stringify(insideTempObj))
                        });
                        i++
                    } catch (err) {
                        alert("matrix.js createInputCallback error:" + err.stack)
                    }
                },
                omitDefault: true
            })
        }
        //初始化
        
        while (insideTempObj.length < returnObj[key].length) {
            insideTempObj.push(value.list[0])
        }
        updateArray()
        //添加项按钮
        newElementButton.on('click', () => {
            insideTempObj.push(value.list[0])
            updateArray()
        })
    } catch (err) {
        alert("matrix.js array error:" + err.stack)
    }
}, [""])

jsdType.addmore('boolean', function(returnObj, key, formDiv, value, worker) {
    value.dv = value.dv||value.list ||false
    let newValue = worker.getDv(key) || value.dv
    //alert(newValue)
    let newElement = formDiv.createNewElement("input", {
        "type": "checkbox",
        "checked": newValue
    })
    toFormCsh("click", "checked", newElement, returnObj, key)
}, false)



jsdType.addmore('radio', function(returnObj, key, formDiv, value, worker) {
    if (value.list == null) {
        alert('jsd错误：radio没有内容')
        return
    }
    value.dv = value.dv||value.list[0]
    let dek = worker.getDv(key) || value.dv
    let newElement = formDiv.createNewElement("select", {
        "value": dek
    })
    //向下兼容设计，可以用{}模式也可以堆叠[[]]
    if (Array.isArray(value)) {
        value.list.forEach((forValue) => {
            newElement.createNewElement("option", {
                "innerHTML": forValue[0]
            })
                .value = forValue[1];
        })
    } else {
        for (let i in value.list) {
            newElement.createNewElement("option", {
                "innerHTML": i
            })
                .value = value.list[i]
        }
    }
    toFormCsh("change", "value", newElement, returnObj, key, worker)
})



jsdType.addmore('number', function(returnObj, key, formDiv, value, worker) {
    //worker.removeTitle()
    if (!value.list) {
        alert('jsd错误：number表单没有规定范围')
        return
    }
    value.dv = value.dv||value.list[2] || value.list[0]
    let dek = worker.getDv(key) || value.dv
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

jsdType.addmore('input', function(returnObj, key, formDiv, value, worker) {
    try {
        value.value = worker.getDv(key) || value.dv || ""
        let newElement = formDiv.createNewElement("input",value)
        toFormCsh("input", "value", newElement, returnObj, key, worker)
        return newElement
    } catch (err) {
        alert("textbug error:" + err.stack)
    }
})

jsdType.addmore('text', function(returnObj, key, formDiv, value, worker) {
    try {
    let v = {
    type:'text',
    dv:worker.getDv(key) || value.dv || "",
    placeholder:value.list
    }
    let newElement = jsdType.input(returnObj, key, formDiv, v, worker)
    return newElement
    } catch (err) {
        alert("textbug error:" + err.stack)
    }
}, '')

/*jsdType.addmore('text', function(returnObj, key, formDiv, value, worker) {
    try {
    //alert('删了')
        value.dv = value.dv || value.list || ""
        let newValue = worker.getDv(key) || value.dv
        
        let newElement = formDiv.createNewElement("input", {
            "type": "text",
            "value": newValue
        })
        toFormCsh("input", "value", newElement, returnObj, key, worker)
    } catch (err) {
        alert("textbug error:" + err.stack)
    }
}, '')*/