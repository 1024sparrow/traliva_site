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

publisher.registerSubscriber(new HeaderWidget(wHeader));
