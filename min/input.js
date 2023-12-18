import {jsdType} from './core_min.js'
import {
    toFormCsh
}
from "../csh.js"
if(!jsdType.input){
alert('自动初始化')
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
}
jsdType.addmore('color', function(returnObj, key, formDiv, value, worker) {
let v = {
    type:'color',
    dv:value.dv||value.list||"#ffffff"
    }
    let newElement = jsdType.input(returnObj, key, formDiv, v, worker)
    return newElement
})

jsdType.addmore('date', (returnObj, key, formDiv, value, worker) => {
    function parseBdaytimeInput(inputElement) {

        const dateString = inputElement.value;
        const timestamp = Date.parse(dateString);

        if (!isNaN(timestamp)) {
            return new Date(timestamp);
        }
    }
    let v = {
    type:'datetime-local',
    dv:worker.getDv(key) || value.dv || ""
    }
    let newElement = jsdType.input(returnObj, key, formDiv, v, worker)
    newElement.on('change', () => {
        returnObj[key] = parseBdaytimeInput(newElement)
    })
    return newElement
})

