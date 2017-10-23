var wDebug = new B.Widget(wRoot);
var eDebug = document.createElement('div');
wDebug.setContent(eDebug, '#000');
wRoot.addItem(wDebug, '300px');

var wWaiting = new B.Widget(wCanvas);
wCanvas.addItem(wWaiting);

publisher.registerSubscriber(new WaitingWidget(wWaiting));
publisher.registerSubscriber(new Pager());
publisher.registerSubscriber(new Header(wHeader));
publisher.registerSubscriber(new B.StateDebugWidget(eDebug));
