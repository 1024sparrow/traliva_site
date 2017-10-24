#!/usr/bin/node

var process = require('process');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var StringDecoder = require('string_decoder').StringDecoder;
var DECODER = new StringDecoder('utf8');

console.log('%%%:'+process.argv);

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
compress_css(path.resolve(dirpath, 'headerlevel_style.css'));
var style = fs.readFileSync(path.resolve(dirpath, 'headerlevel_style.css'));
// После чтения того файла, мы должны его удалить.
child_process.execSync(`rm ${path.resolve(dirpath, 'headerlevel_style.css')}`);
compress_css(path.resolve(dirpath, 'tab_apps', 'style.css'));
style += fs.readFileSync(path.resolve(dirpath, 'tab_apps', 'style.css'));
child_process.execSync(`rm ${path.resolve(dirpath, 'tab_apps', 'style.css')}`);
for (const tabObj of h.tabs){
    compress_css(path.resolve(dirpath, 'tab_apps', tabObj.id, 'style.css'), tabObj.id);
    style += fs.readFileSync(path.resolve(dirpath, 'tab_apps', tabObj.id, 'style.css'));
    child_process.execSync(`rm ${path.resolve(dirpath, 'tab_apps', tabObj.id, 'style.css')}`);
}
fs.writeFileSync(path.resolve(dirpath, 'style.css'), style, 'utf8');


child_process.execSync(`rm ${path.resolve(filepath)}`);



function compress_css(filepath, prefix){
    const processScriptPath = path.resolve(path.dirname(process.argv[1]), 'css.sh');
    let tt = `${processScriptPath} ${filepath}`;
    if (prefix)
        tt += ` ${prefix}`;
    const ou = child_process.execSync(tt, {encoding:'utf8', stdio:[0,1,2]});
    if (ou)
        console.log(DECODER.write(ou));
}
