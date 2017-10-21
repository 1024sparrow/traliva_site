"use strict";

var wRoot = new B.Strip(B.Strip__Orient__vert);
wRoot._div.style.background = '{{global_bg}}';

var wHeader = new B.Widget(wRoot);
wRoot.addItem(wHeader, '{{header_height}}px');

var wCanvas = new B.Stack(wRoot);
wRoot.addItem(wCanvas);

var publisher = new B.StatePublisher();

