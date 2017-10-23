#!/usr/bin/node

//headerlevel_style.js
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

const imagePath = '/static/header.png';

var retVal = `body{}
#header{background:#000;}
#header *{display: inline-block;}
`;
var x_accum = 0;
for (const tabObj of g.tabs){
    if (tabObj.type !== 'normal')
        continue;
    const tabId = tabObj.id;
    let shiftX = x_accum;
    if (x_accum > 0)
        shiftX = `-${x_accum}px`;
    retVal += `
#header .${tabId}{
    background: url(${imagePath}) ${shiftX} 0;
    width: ${tabObj.width}px;
    height: ${g.height}px;
}
#header .${tabId}:not(.active):hover{
    background: url(${imagePath}) ${shiftX} -${g.height}px;
}
#header .${tabId}.active{
    background: url(${imagePath}) ${shiftX} -${2*g.height}px;
}
    `;
    x_accum += tabObj.width;
}




fs.writeFileSync(process.argv[2], retVal, 'utf8');
