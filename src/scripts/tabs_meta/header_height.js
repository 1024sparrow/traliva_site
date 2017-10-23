#!/usr/bin/node

//header_height.js
var process = require('process');
var fs = require('fs');
var path = require('path');

var filepath = process.argv[2];
try{
    var g = JSON.parse(fs.readFileSync(filepath, 'utf8'));
} catch(e) {
    console.log(`'${filepath}' is not valid JSON-file.`);
    console.log('error: '+e);
    return;
}
fs.writeFileSync(process.argv[2], g.height, 'utf8');
