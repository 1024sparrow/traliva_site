'use strict';

/*#### The State Machine Framework ###################
 #
 # author:	Vasilyev Boris Pavlovich
 # codepage:	utf-8
 # description:	JavaScript clone of the StateMachine module written on C++/Qt initially
 # date:	2017, march
 #
 #####################################################
 */
var B;
if (B)
	console.log('epic fail');
else (function(){
	B = {};

/***** class StatePublisher **************************
 *
 * Не допускайте подписывания одного и того же подписчика более одного раза!
 *
 * PREVENT MORE THEN ONCE SUBSCRIBING THE SAME SUBSCRIBER!
 *****************************************************
 */
var StatePublisher = function(){
	this.__state = {};//empty state by default untill be set
	this.__subscribers = [];
	this.xmlDocument
};
StatePublisher.prototype.state = function(){
	return this__state;
};
StatePublisher.prototype.setState = function(state){//parameter is an Object
	this.__state = state;
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		subscr._state = state;
		subscr.processStateChanges(state, true);
	}
};
StatePublisher.prototype.registerSubscriber = function(subscr){
	subscr.__m_publisher = this;
	subscr._state = this.__state;
	subscr.processStateChanges(this.__state, true);
	this.__subscribers.push(subscr);
};
StatePublisher.prototype.unregisterSubscriber = function(subscr){
	var index = this.__subscribers.indexOf(subscr);
	if (index > -1)
		this.__subscribers.splice(index, 1);
	else
		console.log("epic fail");
};
StatePublisher.prototype.processStateChanges = function(sender){
	this.__state = sender._state;
	for (var i = 0 ; i < this.__subscribers.length ; i++){
		var subscr = this.__subscribers[i];
		if (subscr == sender)
			continue;
		subscr._state = this.__state;
		subscr.processStateChanges(this.__state, false);
	}
};

/****** class StateSubscriber ************************
 */

var StateSubscriber = function(){
	this._state = {};//empty state by default untill be set
};
StateSubscriber.prototype.processStateChanges = function(state, ifResetStateChain){
	console.log("critical error: method processStateChanges must be reimplemented! class '"+this.constructor.name+"'");
	//console.log("Class name: "+this.constructor);
};
StateSubscriber.prototype._registerStateChanges = function(){
	if (this.__m_publisher)
	{
		this.__m_publisher.processStateChanges(this);
//		console.log("xml subscriber : _registerStateChanges -> ok");
	}
//	else
//		console.log("xml subscriber : _registerStateChanges -> aborted");
};

/****** class StateDebugWidget ***********************
 */
var StateDebugWidget = function(divId){
	var eDiv = (typeof divId == 'string') ? document.getElementById(divId) : divId;
	this.__eTextEdit = document.createElement("textarea");
	this.__eTextEdit.setAttribute("rows", "16");
	this.__eTextEdit.setAttribute("cols", "64");
	this.__eTextEdit.value = "";
	var eBn = document.createElement("button");
	(function(button, textEdit, stateDebugWidget){
		button.onclick = function(){
			//stateDebugWidget._state = {stub:"stub"};//JSON.parse(textEdit.value);
			stateDebugWidget._state = JSON.parse(textEdit.value);
			stateDebugWidget._registerStateChanges();
		};
	})(eBn, this.__eTextEdit, this);
	var eBnText = document.createTextNode("Apply JSON");
	eBn.appendChild(eBnText);
	eDiv.appendChild(this.__eTextEdit);
	eDiv.appendChild(eBn);
};
StateDebugWidget.prototype = Object.create(StateSubscriber.prototype);
StateDebugWidget.prototype.constructor = StateDebugWidget;
StateDebugWidget.prototype.processStateChanges = function(s){
	this.__eTextEdit.value = JSON.stringify(s);
};

B.StatePublisher = StatePublisher;
B.StateSubscriber = StateSubscriber;
B.StateDebugWidget = StateDebugWidget;


//=========== WIDGETBASE (not for direct usage) ==============
function _WidgetBase(p_parentWidget, p_ifCutTails){
	//Обрубать хвосты по умолчанию (style.overflow='hidden')
	var ifCutTails = (typeof p_ifCutTails == 'undefined') ? true : p_ifCutTails;

	if (p_parentWidget && p_parentWidget instanceof HTMLDivElement)
		this._div = p_parentWidget;
	else
		this._div = document.createElement('div');
	this._div.style.overflow = ifCutTails ? 'hidden' : 'auto';
	this._div.onscroll = (function(self){
		return function(){
			self._onScrolled(self._div.scrollTop)
		};
	})(this);
	this._content = this._createContentElem();
	this._div.appendChild(this._content);
	if (!this._content)
		console.log('epic fail');
	if (p_parentWidget){
		if (p_parentWidget instanceof HTMLDivElement){
			//console.log(p_parentWidget.constructor.name);
			(function(self){
				setInterval(function(){
					var w = p_parentWidget.clientWidth;
					var h = p_parentWidget.clientHeight;
					if (!self.hasOwnProperty('_WidgetBase')){
						self._WidgetBase = {w : w, h : h};
						self._onResized(w, h);
					}
					else{
						if (w != self._WidgetBase.w || h != self._WidgetBase.h){
							self._WidgetBase.w = w;
							self._WidgetBase.h = h;
							self._onResized(w, h);
						}
					}
				}, 20);
			})(this);
		}
		else if (!(p_parentWidget instanceof _WidgetBase)){
			console.log('class ' + this.constructor.name +
				': incorrect parent passed to constructor: ' + p_parentWidget.constructor.name +
				'. Available types to use: HTMLDivElement and B._WidgetBase.');
		}
	}
	else{
		var eBody = document.getElementsByTagName('body')[0];
		eBody.style.overflow = "hidden";
		eBody.style.margin = '0';
		this._div.style.background='#444';
		this._div.style.margin = '0';
		eBody.appendChild(this._div);

		(function(self){
			var f = function(){
				var w = window.innerWidth;
				var h = window.innerHeight;
				self.resize(w,h);
			}
			if(window.attachEvent) {
				window.attachEvent('onresize', f);
				window.attachEvent('onload', f);
	 		}
			else if(window.addEventListener) {
				window.addEventListener('resize', f, true);
				window.addEventListener('load', f, true);
			}
			else{
				console.log('epic fail.')
			}
		})(this);
	}
	this._divInitialDisplayProperty = this._div.style.display;
}
_WidgetBase.prototype._createContentElem = function(){
	console.log('this method must be reimplemented');
	var retVal = document.createElement('div');
	retVal.style.background = '#f00';
	return retVal;
}
_WidgetBase.prototype.resize = function(w, h){
	this._div.style.height = h + 'px';
	this._div.style.maxHeight = h + 'px';
	this._div.style.minHeight = h + 'px';
	this._div.style.width = w + 'px';
	this._div.style.maxWidth = w + 'px';
	this._div.style.minWidth = w + 'px';

	this._content.style.height = h + 'px';
	this._content.style.maxHeight = h + 'px';
	this._content.style.minHeight = h + 'px';
	this._content.style.width = w + 'px';
	this._content.style.maxWidth = w + 'px';
	this._content.style.minWidth = w + 'px';
	this._onResized(w, h);
}
_WidgetBase.prototype.setVisible = function(p_visible){
	this._div.style.display = p_visible ? this._divInitialDisplayProperty : 'none';
}
_WidgetBase.prototype._onResized = function(w, h){
	console.log('this method must be reimplemented: update content or child elements sizes for <this._content> for given in parameters new size');
}
_WidgetBase.prototype._onScrolled = function(pos){
	// reimplement this method if you need
}
_WidgetBase.prototype._onVisibilityChanged = function(childWidget, p_visible){
}
var WidgetBase__reSize = /^(\d+)(\s*)((px)|(part))$/;
_WidgetBase.prototype._transformStringSize = function(str){
	//Почему невалидное значение по умолчанию - чтобы для программиста не прошло незамеченным.
	var retVal = {value:undefined, unit:undefined};
	if (str){
		//работа с регулярными выражениями
		var res = str.match(WidgetBase__reSize);
		if (res){
			retVal.value = parseInt(res[1]);
			retVal.unit = res[3];
		}
		else{
			console.log('error: incorrect size parameter (incorrect string)');
		}
	}
	else{
		retVal.value = 1;
		retVal.unit = 'part';
	}
	//console.log(JSON.stringify(retVal));
	return retVal;
}

//=========== WIDGET ==============
//Если собираетесь устанавливать Виджет, а не DOM-элемент, в качестве содержимого,
//не указывайте второй параметр (или указывайте true), чтобы не получилось скрола внутри скрола
function Widget(p_parentWidget, p_ifCutTails){
	this._contentDiv = document.createElement('div');
	this.__w;
	this.__h;
	this.__contentWidget;
	_WidgetBase.call(this, p_parentWidget, p_ifCutTails);
}
Widget.prototype = Object.create(_WidgetBase.prototype);
Widget.prototype.constructor = Widget;
Widget.prototype._onResized = function(w, h){
	this.__w = w;
	this.__h = h;
	if (this.__contentWidget)
		this.__contentWidget.resize(w,h);
}
Widget.prototype._createContentElem = function(){
	return this._contentDiv;
}
Widget.prototype.setContent = function(p_div, p_bgColor){
	this.__contentWidget = undefined;
	if (p_div && (typeof p_div == 'object')){
		this._div.removeChild(this._contentDiv);//здесь мы должны убрать предыдущий DIV
		if (p_div instanceof HTMLElement){//dom element
			p_div.style.margin = '0';
			this._contentDiv = p_div;

			this._content = this._contentDiv;
			this._div.appendChild(this._content);
			if (this.__w)
				this._onResized(this.__w, this.__h);
		}
		else if (p_div instanceof _WidgetBase){//widget
			this._contentDiv = p_div._div;
			this._content = this._contentDiv;
			this._div.appendChild(this._content);
			this.__contentWidget = p_div;
			if (this.__w)
				p_div.resize(this.__w, this.__h);
		}
		else{
			console.log('epic fail: '+p_div.constructor.name);
			console.log(p_div);
		}	
	}
	this._div.style.background = p_bgColor ? p_bgColor : 'rgba(0,0,0,0)';
	//if (p_bgColor)
	//	this._div.style.background = p_bgColor;
}
/*Widget.prototype.setContent = function(content){
	if (typeof content == 'string'){//color
		this._div.style.background = content;
	}
	else if (typeof content == 'object'){
		if (content.constructor.name == 'HTMLParagraphElement'){//dom element
			content.style.margin = '0';
			this._contentDiv = content;

			this._content = this._contentDiv;
			this._div.appendChild(this._content);
			if (this.__w)
				this._onResized(this.__w, this.__h);
		}
		else if (content instanceof _WidgetBase){//widget
		}
		else
			console.log('epic fail');
	}
	else{
		console.log('epic fail');
	}
}*/

//=========== STRIP ==============
B.Strip__Orient__hor = 1;
B.Strip__Orient__vert = 2;
function Strip(p_orient, p_parentWidget, p_ifCutTails){
	this.__orient = p_orient;
	this.__items = [];
	this.__sizes = [];
	this.__w;
	this.__h;

	this._eTable = document.createElement('table');
	this._eTable.style.border = 'none';
	this._eTable.cellSpacing = '0';
	if (this.__orient == B.Strip__Orient__hor){
		this._eRowSingle = this._eTable.insertRow(0);
	}
	_WidgetBase.call(this, p_parentWidget, p_ifCutTails);
}
Strip.prototype = Object.create(_WidgetBase.prototype);
Strip.prototype.constructor = Strip;
Strip.prototype._createContentElem = function(){
	return this._eTable;
}
Strip.prototype._onResized = function(w,h){
	this.__w = w;
	this.__h = h;
	this.__updateSizes();
}
Strip.prototype.__updateSizes = function(){
	var totalForParts = (this.__orient == B.Strip__Orient__hor) ? this.__w : this.__h;
	if (totalForParts < 0)
		return;
	var totalParts = 0;
	for (var i = 0 ; i < this.__items.length ; i++){
		if (this.__sizes[i].unit == 'px'){
			totalForParts -= this.__sizes[i].value;
		}
		else if (this.__sizes[i].unit == 'part'){
			totalParts += this.__sizes[i].value;
		}
	}
	for (var i = 0 ; i < this.__items.length ; i++){
		var tmpSize = undefined;
		if (this.__sizes[i].unit == 'px'){
			tmpSize = this.__sizes[i].value;
		}
		else if (this.__sizes[i].unit == 'part'){
			tmpSize = this.__sizes[i].value * totalForParts / totalParts;
		}
		if (!tmpSize){
			console.log('epic fail');
			continue;
		}

		var item = this.__items[i];
		if (this.__orient == B.Strip__Orient__hor)
			item.resize(tmpSize,this.__h);
		else
			item.resize(this.__w, tmpSize);
	}
}
Strip.prototype.addItem = function(p_itemWidget, p_size){
	if (typeof p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!(p_itemWidget instanceof _WidgetBase)){
		console.log('epic fail');
		return;
	}
	var size = this._transformStringSize(p_size);

	var eCell;
	if (this.__orient == B.Strip__Orient__hor){
		eCell = this._eRowSingle.insertCell(this._eRowSingle.cells.length);
	}
	else {
		var eRow = this._eTable.insertRow(this._eTable.rows.length);
		eCell = eRow.insertCell(0);
	}
	eCell.appendChild(p_itemWidget._div);
	eCell.style.padding = '0';
	this.__items.push(p_itemWidget);
	this.__sizes.push(size);
}
Strip.prototype.setItemSize = function(sizeMap){//usage example: wRoot.setItemSize({0:'2part'});
	for (var i in sizeMap){
		if (i >= this.__sizes){
			console.log('epic fail');
			continue;
		}
		var candidate = this._transformStringSize(sizeMap[i]);
		this.__sizes[i] = candidate;
	}
	this.__updateSizes();
}

function Stack(p_parentWidget, p_ifCutTails){
	this.__items = [];
	this.__zIndexCounter = 1;

	this._eStack = document.createElement('div');
	this._eStack.style.position = 'relative';
	_WidgetBase.call(this, p_parentWidget, p_ifCutTails);
}
Stack.prototype = Object.create(_WidgetBase.prototype);
Stack.prototype.constructor = Stack;
Stack.prototype._createContentElem = function(){
	return this._eStack;
}
Stack.prototype._onResized = function(w,h){
	for (var i = 0 ; i < this.__items.length ; i++){
		var item = this.__items[i];
		item.resize(w,h);
	}
}
Stack.prototype.addItem = function(p_itemWidget){
	if (typeof p_itemWidget != 'object'){
		console.log('epic fail');
		return;
	}
	if (!(p_itemWidget instanceof _WidgetBase)){
		console.log('epic fail');
		return;
	}
	p_itemWidget._div.style.position = 'absolute';
	p_itemWidget._div.style.zIndex = this.__zIndexCounter;
	p_itemWidget._div.style.left = '0';
	p_itemWidget._div.style.top = '0';
	this._eStack.appendChild(p_itemWidget._div);
	this.__items.push(p_itemWidget);

	this.__zIndexCounter++;
}

B._WidgetBase = _WidgetBase;
B.Widget = Widget;
B.Strip = Strip;
B.Stack = Stack;

/*
function ajax - take data from server (always asynchroniusly!). Realized partially (just simplest realization).
return value - none
if called without parameter will be printed short help in console
parameter is an object with the following fields:
	type		name		description
	+===		+===		+==========
	string		sourcePath	network path to load data from
	function	readyFunc(result) take result in this function
	function	errorFunc(isNetworkProblem)
					parameter of this function is Boolean
					("true" if caused of timeout or network connection breakup)
					default is write error to console
	int		timeout		timeout in milliseconds. default is 3000.
	string		dataToPost	if set, method is "post" instead of default "get". This data will be sent to server.
	string		mimetype	mimetype of content. default is "text/plain"
Caution: if some fields in parameter "p" absense, it will be added as undefined. Take this into account if you would use that object later.
*/
function ajax(p){
	if (!p){
		console.log("B.ajax(p). Available fileds for p: sourcePath, readyFunc(result), errorFunc(isNetworkProblem), *timeout, *dataToPost, *mimetype.");
		return;
	}
//http://stackoverflow.com/questions/22099706/handling-ajax-error-native-js
	var sourcePath = p.sourcePath;
	var readyFunc = p.readyFunc;
	var errorFunc = p.errorFunc;//unsupported yet: error handling is not working on local file systems
	var timeout = p.timeout;//unsupported yet: always infinity
	var dataToPost = p.dataToPost;//unsupported yet: always GET requests
	var mimetype = p.mimetype;//unsupported yet: only text

	var xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		var errorDescr = '';
		var netwError = false;
		if (this.status == 200 || this.status == 0) {
			if (this.readyState == 4){
			        if (readyFunc)
						readyFunc(xhttp.responseText);
				else
					console.log("for ajax request '"+ sourcePath +"' readyFunc not set");
			}
		}
		/*else if (this.status >= 500){
			errorDescr = 'internal server error';
		}
		else if (this.status >= 402 && this.status <= 420){
			errorDescr = 'error';
		}
		else if (this.status == 400 || this.status == 401){
			errorDescr = 'bad request or unauthorized error';
		}
		else if (this.status == 0){// local file case
			console.log('ready state: '+this.readyState);
			if (readyFunc)
				readyFunc(xhttp.responseText);
		}*/

/*		else if([404, 500 , 503, 504].indexOf(xhttp.status) > -1){
			if (errorFunc)
				errorFunc(false);
			else
				console.log("ajax error for request '" + sourcePath + "'");
		}*/
		/*if (errorDescr){
			if (errorFunc)
				errorFunc(netwError);
			else
				console.log("ajax error for request '" + sourcePath + "'");
		}
		console.log(xhttp.readyState);
		console.log(xhttp.responseText);*/
	};
	xhttp.open("GET", sourcePath, true);
	//xhttp.onerror = function(e){console.log(e);return true;}
	//onerror = function(e){console.log(e);return true;}
	//try{
		xhttp.send();
	//}
	/*catch(e){
		console.log('network error: '+e);
		e.stopPropagation();
	}*/
}
B.ajax = ajax;

/*function getViewport() {

	var viewPortWidth;
	var viewPortHeight;

	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	if (typeof window.innerWidth != 'undefined') {
		viewPortWidth = window.innerWidth,
		viewPortHeight = window.innerHeight
	}

	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
	else if (typeof document.documentElement != 'undefined'
		&& typeof document.documentElement.clientWidth !='undefined'
		&& document.documentElement.clientWidth != 0) {

		viewPortWidth = document.documentElement.clientWidth,
	 	viewPortHeight = document.documentElement.clientHeight
	 }

	// older versions of IE
	else {
		viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
		viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
	}
	return [viewPortWidth, viewPortHeight];
}*/

B.checkVisible = function(e) {
	var rect = e.getBoundingClientRect();
	var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

})();
