(function(){
/*
var eText = document.getElementById('text');

var wRoot = new B.Strip(B.Strip__Orient__vert);
var wHeader = new B.Widget(wRoot);
var wBody = new B.Stack(wRoot);
var wText = new B.Widget(wRoot, false);
wText.setContent(eText, '#fff');
var wContents = new B.Widget(wRoot, false);
wBody.addItem(wText);
wBody.addItem(wContents);
wRoot.addItem(wHeader, '50px');
wRoot.addItem(wBody);

var statePublisher = new B.StatePublisher();
statePublisher.registerSubscriber(new Contents(wHeader, wContents, eText));
statePublisher.registerSubscriber(new Text(wText));
//statePublisher.registerSubscriber(new B.StateDebugWidget(eDebug));
*/

/*var eText = EXTERNAL.html.text;

var wRoot = new B.Strip(B.Strip__Orient__vert);
var wHeader = new B.Widget(wRoot);
var wBody = new B.Stack(wRoot);
var wText = new B.Widget(wBody);
wText.setContent(undefined, '#FFF');

wBody.addItem(wText);
wRoot.addItem(wHeader, '64px');
wRoot.addItem(wBody);


EXTERNAL.canvas.setContent(wRoot, '#f00');*/

//var w = new B.Widget(EXTERNAL.canvas);
//w.setContent(undefined, '#afa');

var wRoot = new B.Strip(B.Strip__Orient__vert, EXTERNAL.canvas);
var wHeader = new B.Widget(wRoot);
var wBody = new B.Stack(wRoot);
var wText = new B.Widget(wBody, false);
wText.setContent(EXTERNAL.html.text);
var wContents = new B.Widget(wBody, false);
wBody.addItem(wText);
wBody.addItem(wContents);
wRoot.addItem(wHeader, '64px');
wRoot.addItem(wBody);

//statePublisher.registerSubscriber(new Contents(wHeader, wContents, eText));
//statePublisher.registerSubscriber(new Text(wText));
EXTERNAL.subscribers.push(new EXTERNAL.scope.Contents(wHeader, wContents, EXTERNAL.html.text));
EXTERNAL.subscribers.push(new EXTERNAL.scope.Text(wText));

EXTERNAL.canvas.setContent(wRoot, '#fff');

//EXTERNAL.canvas.setContent(undefined, '#000');

var a2 = 2;
console.log('2.js выполнен');

})();
