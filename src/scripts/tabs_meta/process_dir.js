#!/usr/bin/node

var process = require('process');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var dirpath = path.resolve(process.argv[2], process.argv[3]);
var filepath = path.resolve(dirpath, 'src_header.json');
try{
    var h = JSON.parse(fs.readFileSync(filepath, 'utf8'));
} catch(e) {
    console.log(`'${filepath}' is not valid JSON-file.`);
    console.log('error: '+e);
    return;
}

//---- html_names  & tabs_descr-----
var html_names = {};
var tabs_descr = [];
for (const tabObj of h.tabs){
    if (tabObj.type === 'normal'){
        tabs_descr.push(tabObj.id);
        let tmp = path.resolve(dirpath, 'tab_apps', tabObj.id, 'html');
        html_names[tabObj.id] = [];
        for (const i of fs.readdirSync(tmp)){
            html_names[tabObj.id].push(i); 
        }
    }
}
fs.writeFileSync(path.resolve(dirpath, 'html_names'), JSON.stringify(html_names), 'utf8');
fs.writeFileSync(path.resolve(dirpath, 'tabs_descr'), JSON.stringify(tabs_descr), 'utf8');

//---- Объединение css-ников и их сжатие ----
//boris here: Перед чтением запустить скрипт, сжимающий тот файл
var style = fs.readFileSync(path.resolve(dirpath, 'headerlevel_style.css'));
// После чтения того файла, мы должны его удалить.
child_process.execSync(`rm ${path.resolve(dirpath, 'headerlevel_style.css')}`);
//boris here: Перед чтением запустить скрипт, сжимающий тот файл
style += fs.readFileSync(path.resolve(dirpath, 'tab_apps', 'style.css'));
child_process.execSync(`rm ${path.resolve(dirpath, 'tab_apps', 'style.css')}`);
for (const tabObj of h.tabs){
    //boris here: Перед чтением запустить скрипт, сжимающий тот файл
    style += fs.readFileSync(path.resolve(dirpath, 'tab_apps', tabObj.id, 'style.css'));
    //boris here: После чтения того файла, мы должны его удалить.
    child_process.execSync(`rm ${path.resolve(dirpath, 'tab_apps', tabObj.id, 'style.css')}`);
}
fs.writeFileSync(path.resolve(dirpath, 'style.css'), style, 'utf8');


child_process.execSync(`rm ${path.resolve(filepath)}`);
