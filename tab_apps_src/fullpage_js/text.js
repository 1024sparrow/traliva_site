(function(){

function Text(wText){
	this._widget = wText;
}
Text.prototype = Object.create(B.StateSubscriber.prototype);
Text.prototype.constructor = Text;
Text.prototype.processStateChanges = function(s){
	if (!s.page.hasOwnProperty('text_scroll'))
		return;
	var scrollPosCand = s.page.text_scroll;
	delete s.page.text_scroll;
	this._registerStateChanges();
	this._widget._div.scrollTop = scrollPosCand;
}


EXTERNAL.scope.Text = Text;
})();
