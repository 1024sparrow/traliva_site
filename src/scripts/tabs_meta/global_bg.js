#!/usr/bin/node

//global_bg.js
var process = require('process');
var fs = require('fs');
var path = require('path');

//var filepath = path.resolve(process.argv[2]);
var filepath = process.argv[2];
//console.log('filepath: '+filepath);
try{
    var g = JSON.parse(fs.readFileSync(filepath, 'utf8'));
} catch(e) {
    console.log(`'${filepath}' is not valid JSON-file.`);
    console.log('error: '+e);
    return;
}
//console.log('json: '+JSON.stingify(g));
//console.log(g.global_bg);
fs.writeFileSync(process.argv[2], g.global_bg, 'utf8');
