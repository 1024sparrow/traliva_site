'use strict';

//document.addEventListener("DOMContentLoaded", function(){
//    console.log(123)
//});

function Text(wText){
	this._widget = wText;
}
Text.prototype = Object.create(B.StateSubscriber.prototype);
Text.prototype.constructor = Text;
Text.prototype.processStateChanges = function(s){
	if (!s.hasOwnProperty('text_scroll'))
		return;
	var scrollPosCand = s.text_scroll;
	delete s.text_scroll;
	this._registerStateChanges();
	this._widget._div.scrollTop = scrollPosCand;
}

function Contents(wButton, wContents, eTextHtml){
	var eContentsTitle = document.createElement('p');
	eContentsTitle.style.textAlign = 'center';
	eContentsTitle.style.color = '#888';
	eContentsTitle.style.fontSize = '24pt';
	eContentsTitle.style.cursor = 'default';
	var eContentsTitleText = document.createTextNode('Содержание');
	eContentsTitle.appendChild(eContentsTitleText);
	wButton.setContent(eContentsTitle, '#048');
	
	wContents.setVisible(false);
	(function(self){
		wButton._div.addEventListener('click', function(){
			if (self._state.hasOwnProperty('show_contents')){
				delete self._state.show_contents;
				wContents.setVisible(false);
			}
			else{
				self._state.show_contents = 1;
				wContents.setVisible(true);
			}
			self._registerStateChanges();
		});
	})(this);
	
	var eContents = document.createElement('div');
	var list = eTextHtml.children;
	var reHeaderTags = /^H([1-6])$/;
    var eLink;
    var eLinkText;
	for (var i = 0 ; i < list.length ; i++){
		var e = list[i];
		var res = e.tagName.match(reHeaderTags);
		if (!res)
			continue;

        eLink = document.createElement('a');
        eLink.name = i;
        eTextHtml.insertBefore(eLink, e);

        eLink = document.createElement('a');
        //eLinkText = document.createTextNode('qwertyuio');
        //eLink.appendChild(eLinkText);
        eLink.href = '#'+ i;
        //eLink.target = '_blank';
        i++;

		var eContentsItem = eLink;
        var eLocalHeaderCopy = e.cloneNode(true);
        eContentsItem.appendChild(eLocalHeaderCopy);
		//eContentsItem.style.cursor = 'pointer';
		eContentsItem.style.color = '#ffa';
		(function(self, goal){
			eContentsItem.addEventListener('click', function(){
				//eTextHtml.scrollTop = goal.offsetTop;
				//self._state.text_scroll = goal.offsetTop;
				delete self._state.show_contents;
				self._registerStateChanges();
				wContents.setVisible(false);
			});
		})(this, e);
		var level = res[1];
		eLocalHeaderCopy.style.marginLeft = (level * level * 4) + 'px';
		eContents.appendChild(eContentsItem);
		//console.log(level);
	}
	//wContents.setContent(eContents, '#ffa');
	wContents.setContent(eContents, 'rgba(0,0,0,0.9)');
}
Contents.prototype = Object.create(B.StateSubscriber.prototype);
Contents.prototype.constructor = Contents;
Contents.prototype.processStateChanges = function(s){
}

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

/*var eDebug = document.createElement('div');
var wDebug = new B.Widget(wRoot, false);
wDebug.setContent(eDebug, '#000');
wRoot.addItem(wDebug, '250px');*/

var statePublisher = new B.StatePublisher();
statePublisher.registerSubscriber(new Contents(wHeader, wContents, eText));
statePublisher.registerSubscriber(new Text(wText));
//statePublisher.registerSubscriber(new B.StateDebugWidget(eDebug));
