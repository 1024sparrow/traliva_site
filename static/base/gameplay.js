'use strict';

var publisher = new B.StatePublisher();
publisher.setState(init_state);

var wRoot = new B.Strip(B.Strip__Orient__vert);
var wHeader = new B.Widget(wRoot);
var wTopPanel = new B.Widget(wRoot);
var wContent = new B.Widget(wRoot);
wRoot.addItem(wHeader, '64px');
wRoot.addItem(wTopPanel, '64px');
wRoot.addItem(wContent);

wHeader.setContent(undefined, '#f00');
wTopPanel.setContent(undefined, '#0f0');
wContent.setContent(undefined, '#00f');

var wDebug = new B.Widget();
var eDebug = document.createElement('div');
wDebug.setContent(eDebug, '#000');
wRoot.addItem(wDebug, '300px');
publisher.registerSubscriber(new B.StateDebugWidget(eDebug));

publisher.registerSubscriber(new HeaderWidget(wHeader));
