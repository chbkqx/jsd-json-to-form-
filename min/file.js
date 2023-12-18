import {jsdType} from './core_min.js'

jsdType.addmore('blob', (returnObj, key, formDiv, value, worker) => {
    let input = formDiv.createNewElement('input', {
        type: 'file',
        accept: value.list || ''
    })
    input.on('change', () => {
        returnObj[key] = input.value
    })
    return input
}, '')
jsdType.addmore('image', (returnObj, key, formDiv, value, worker) => {
    try {
        let v = {
            list: 'image/*'
        }
        let input = jsdType.blob(returnObj, key, formDiv, v, worker)
        value.dv = value.dv||value.list ||'/icons/inputImg.png'
        let img = formDiv.createNewElement('img', {
            'class': 'preview',
            src: worker.getDv() || value.dv
        })
        let work = new Worker('http://localhost:8080/module/jsd14/readWorker.js');

        // 监听文件输入变化
        input.on('change', function() {
            const file = input.files[0];
            work.postMessage(file);
        });

        // 监听来自 Worker 的消息
        work.onmessage = function(e) {
            img.src = e.data;
            returnObj[key] = e.data;
        };
    } catch (err) {
        alert("error:" + err.message)
    }
}, '')

jsdType.addmore('filetext', (returnObj, key, formDiv, value, worker) => {
    let v = {
        list: 'text/*'
    }
    let input = jsdType.blob(returnObj, key, formDiv, v, worker)
    value.dv = value.dv||value.list ||''
    let p = formDiv.createNewElement('pre', {
        innerHTML: worker.getDv() || value.dv
    })
    let work = new Worker('http://localhost:8080/module/jsd14/readTextWorker.js');

    // 监听文件输入变化
    input.on('change', function() {
        const file = input.files[0];
        work.postMessage(file);
    });

    // 监听来自 Worker 的消息
    work.onmessage = function(e) {
        p.innerHTML = e.data.slice(0,50);
        returnObj[key] = e.data;
    };
}, '')