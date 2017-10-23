var LineInput = function(divId){
	var eDiv = document.getElementById(divId);
	this.__eLineEdit = document.createElement("input");
	var eBn = document.createElement("button");
	var eBnText = document.createTextNode("Применить");
	eBn.appendChild(eBnText);
	(function(button, lineInput){
		button.onclick = function(){
			lineInput._state.userText = lineInput.__eLineEdit.value;
			lineInput._registerStateChanges();
		}
	})(eBn, this);
	eDiv.appendChild(this.__eLineEdit);
	eDiv.appendChild(eBn);
};
LineInput.prototype = new B.StateSubscriber();
LineInput.prototype.processStateChanges = function(s){
	this.__eLineEdit.value = s.userText;
};
