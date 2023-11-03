import {
    jsdType, jsd
}
from "./core.js"
jsdType.addmore("array", function(returnObj, key, formDiv, value, worker) {
    //alert('事实就是')
    try {
        returnObj[key] = worker.getDv(key) || value.list[1] || jsdTypeDv.array
        //alert(JSON.stringify(returnObj[key]))
        const arrayDiv = formDiv.createNewElement('div', {
            'class': 'array'
        })
        const jsdDiv = arrayDiv.createNewElement('div')
        const arraySee = formDiv.createNewElement('p')
        const newElementButton = formDiv.createNewElement('button', {
            'type': 'button',
            'innerHTML': '添加项'
        })
        //alert(JSON.stringify(value))
        //在内部用于jsd的数组。
        let insideJsdArray = []
        const updateArray = () => {
            jsdDiv.innerHTML = ''
            let oooooo = {}
            let i = 0
            oooooo = jsd(insideJsdArray, jsdDiv, {
                setCallback: () => {
                    //alert('ddd')
                    //alert(JSON.stringify(returnObj[key]))
                    arraySee.innerHTML = JSON.stringify(returnObj[key])
                    returnObj[key] = oooooo
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
                            insideJsdArray.pop()
                            returnObj[key].splice(deleteButton.id, 1); // Remove the item from the array
                            updateArray();
                            //alert(JSON.stringify(insideJsdArray))
                        });
                        i++
                    } catch (err) {
                        alert("matrix.js createInputCallback error:" + err.message)
                    }
                },
                omitDefault: true
            }, returnObj[key])
        }
        //初始化
        while (insideJsdArray.length < returnObj[key].length) {
            insideJsdArray.push(value.list[0])
        }
        updateArray()
        //添加项按钮
        newElementButton.on('click', () => {

            insideJsdArray.push(value.list[0])
            updateArray()
        })
    } catch (err) {
        alert("matrix.js array error:" + err.message)
    }
}, [""])
export {
    jsdType
}