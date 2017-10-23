(function(){

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
			if (self._state.page.hasOwnProperty('show_contents')){
				delete self._state.page.show_contents;
				wContents.setVisible(false);
			}
			else{
				self._state.page.show_contents = 1;
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
        eLink.href = '#'+ i;
        i++;

		var eContentsItem = eLink;
        var eLocalHeaderCopy = e.cloneNode(true);
        eContentsItem.appendChild(eLocalHeaderCopy);
		eContentsItem.style.color = '#ffa';
		(function(self, goal){
			eContentsItem.addEventListener('click', function(){
				delete self._state.page.show_contents;
				self._registerStateChanges();
				wContents.setVisible(false);
			});
		})(this, e);
		var level = res[1];
		eLocalHeaderCopy.style.marginLeft = (level * level * 4) + 'px';
		eContents.appendChild(eContentsItem);
	}
	wContents.setContent(eContents, 'rgba(0,0,0,0.9)');
}
Contents.prototype = Object.create(B.StateSubscriber.prototype);
Contents.prototype.constructor = Contents;
Contents.prototype.processStateChanges = function(s){
}


EXTERNAL.scope.Contents = Contents;
})();
