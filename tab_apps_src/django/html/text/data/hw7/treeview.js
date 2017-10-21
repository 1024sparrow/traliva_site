/*
author Vasilyev Boris Pavlovich
codepage utf-8
Дерево (воинских формирований)с ленивой загрузкой.
При сворачивании элемента дочерние к нему узлы не просто скрываются, а удаляются, и отписываются от обновлений.
Обновления запрашиваются ежесекундно.
Протокол взаимодействия см. в методах для переопределения, где реализовано демо.
*/

/*var getChildren = function(parentObject){
	var xhttp = new XMLHttpRequest();
	var retVal = [];
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			retVal = JSON.parse(this.responseText);
		}
	};
	var requestString = "/index/load_children/";//?unit_id=
	if (parentObject)
		requestObject += ("?unit_id=" + parentObject.id);
	xhttp.open("GET", requestString, false);//false - из метода не выходим пока не дождёмся ответа (блокируем поток)
	xhttp.send();
	return retVal;
}*/

function TreeView(containerWidget, getTreeDataInStateFunc, getChildrenUrl, getUpdatesUrl){
	if (this === window){
		//отображаем справку по использования и выходим
		var text = 	'класс TreeView.\nПараметры конструктора:\n'+
					'1.) containerWidget - экземпляр B.Widget\n'+
					'2.) getTreeDataInStateFunc - функция, которая получает'+
					' на вход объект состояния, должна вернуть объект из состава'+
					' объекта состояния, где данные для дерева\n'+
					'3.) getChildrenUrl - сетевой адрес, по которому будут запрашиваться дети.'+
					' Для некорневых элементов параметром передаётся id родительского элемента'+
					' (имя параметра - "id", параметры с другими именами игнорируются).\n'+
					'Или функция, которая на вход берёт id родителя (или undefined),'+
					' а на выход даёт сетевой адрес, где брать детей.\n'+
					'Игнорируется, если переопределён метод \'_getChildren\'.\n'+
					'Формат данных, получаемых от сервера: список объектов [{id:1,name:"xx",hasChildren:false,state:0}, ...].\n'+
					'4.) getUpdatesUrl - Сетевой адрес, по которому дерево будет запрашивать изменения.\n'+
					'Формат данных, получаемых от сервера: \n'+
					'{\n\tremoved:[1,2,3],\n\tadded:[{id:7,parentId:4,name:"t7",hasChildren:false,state:2}, ...],\n'+
					'\tchanged:[{id:5,state:2}]<- id + перечисляем только те свойства, которые были изменены\n}';
		return text;
	}
	this._getTreeDataInStateFunc = getTreeDataInStateFunc;
	this._getChildrenUrl = getChildrenUrl;
	this._getUpdatesUrl = getUpdatesUrl;
	B.StateSubscriber.call(this);
	this.eTable = document.createElement('table');
	this.eTable.style.width = "100%";
    this.eTable.style.tableLayout = "fixed";
	this.eTable.style.borderSpacing = "0";
	this.__objectMap = {};//eDiv by id
	this.__objects = {};//object by id
	this.__currentRow = -1;
	/*if (this._getUpdatesUrl){
		(function(myself){
			var func = function(){myself.__onUpdateTimer();};
			myself.intervalID = window.setInterval(func, 1000);
		})(this);
	}*/
	
	var eDest = document.createElement('div');
	eDest.className = '__tree_base';
	eDest.style.overflow = "auto";
	eDest.appendChild(this.eTable);
	this.__createElementForObject(undefined, this._getChildren());
	eDest.style.background = "rgb(194,194,193)";
	eDest.style.cursor = 'default';
	
	var stylePrefix = ".__treeview ";
	var eGlobalStylesheet = document.createElement('style');
	document.head.appendChild(eGlobalStylesheet);
	var vitrinaStylesheet = eGlobalStylesheet.sheet;
	//vitrinaStylesheet.insertRule(stylePrefix + "*{cursor: default;-webkit-user-select: none;/*Chrome/Safari*/-moz-user-select: none;/*Firefox*/-ms-user-select: none;/*IE10+*/-o-user-select: none;user-select: none;}", 0);
	vitrinaStylesheet.insertRule(stylePrefix + "*{cursor: default;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;-o-user-select: none;user-select: none;}", 0);
	vitrinaStylesheet.insertRule(stylePrefix + "div.icon_container{border: 2px solid rgb(194,194,193);}", 1);
	vitrinaStylesheet.insertRule(stylePrefix + ".selectedRow{background: rgb(204,230,214);}", 2);
	vitrinaStylesheet.insertRule(stylePrefix + ".selectedRow div.icon_container{border-color: rgb(204,230,214);}", 3);
	
	containerWidget.setContent(eDest);
};
TreeView.prototype = Object.create(B.StateSubscriber.prototype);
TreeView.prototype.constructor = TreeView;
TreeView.prototype._getChildren = function(parentObject){//<-- необходимо переопределить
	var sourcePath;
	if (typeof this._getChildrenUrl == 'string'){
		sourcePath = this._getChildrenUrl;
		if (parentObject)
			sourcePath += ('?id=' + parentObject.id);
	}
	else if (typeof this._getChildrenUrl == 'function'){
		if (parentObject)
			sourcePath = this._getChildrenUrl(parentObject.id);
		else
			sourcePath = this._getChildrenUrl();
	}
	else{
		console.log('epic fail');
		return [];
	}
	(function(self){
		B.ajax({
			sourcePath: sourcePath,
			readyFunc:function(result){
				var childrenObj = JSON.parse(result);
				if (parentObject){
					for (var i = 0 ; i < childrenObj.length ; i++){
						childrenObj[i].parentId = parentObject.id;
					}
				}
				var changes = {added:childrenObj};
				self._applyChanges(changes);
			}
		});
	})(this);
	return [];//
/*	if (parentObject === undefined)
		return [{id:111,name:"1 мсв",hasChildren:true,state:0}];
	else{
		if (parentObject.id == 111)
			return [
				{id:222,name:"1 мсо",hasChildren:true,state:1},
				{id:333,name:"2 мсо",hasChildren:false,state:0}
			];
		if (parentObject.id == 222)
			return [
				{id:444,name:"1 солдат",hasChildren:false,state:0},
				{id:555,name:"2 солдат",hasChildren:false,state:0},
				{id:666,name:"3 солдат",hasChildren:false,state:3}
			];
	}
	return [];*/
	/*
	Common options needed:
	- legend (icons for states)
	- if start update item data loop
	*/
};
TreeView.prototype._getUpdates = function(treeViewState){//<-- необходимо переопределить
	return {};
	//return {
	//	removed:[],//[1,2,3]
	//	added:[],//[{id:777,parentId:444,name:"левая почка",state:2"},{..}]//перечисляем все свойства как при подгрузке элементов + parentId
	//	changed:[]//[{id:555,state:2},{..}]//кроме id перечисляем только те свойства, которые были изменены
	//};
	
	var retVal =  {
		removed:[],//[1,2,3]
		added:[],//[{id:777,parentId:444,name:"левая почка",state:2"},{..}]//перечисляем все свойства как при подгрузке элементов + parentId
		changed:[]//[{id:555,state:2},{..}]//кроме id перечисляем только те свойства, которые были изменены
	};
	var candidate = {id:111};
	candidate.state = Math.floor(Math.random()*4);
	retVal.changed.push(candidate);
	return retVal;
};
TreeView.prototype._getTreeDataInState = function(s){
	var retVal = this._getTreeDataInStateFunc(s);
	if (!retVal){
		this._tmpState = {};
		retVal = this._tmpState;
	}
	if (!retVal.hasOwnProperty('selected'))
		retVal.selected = -1;
	if (!retVal.hasOwnProperty('removed'))
		retVal.removed = [];
	return retVal;
}
TreeView.prototype.processStateChanges = function(state){
	var treeData = this._getTreeDataInState(state);
	if (this.__currentRow !== treeData.selected){
		//
	}
};

TreeView.prototype.__onUpdateTimer = function(){
	//-(отсылаем изменения состояния (какие скрыли, какие выделили))
	//-грузим список изменившихся элементов
	var treeData = this._getTreeDataInState(this._state);

	var changes = this._getUpdates(treeData);
	//console.log(JSON.stringify(this._state.wsTree)+" --> "+JSON.stringify(changes.changed));//
	//проверка должна быть на успешность загрузки
	if (treeData.removed && (treeData.removed.length > 0)){
		treeData.removed = [];
		this._registerStateChanges();
	}
};

TreeView.prototype._applyChanges = function(changes){
	if (changes.removed){
	}
	if (changes.changed){
		for (var i = 0 ; i < changes.changed.length ; i++){
			var item = changes.changed[i];
			var id = item.id;
			if (!this.__objectMap.hasOwnProperty(id)){
				console.log("Error! server make update me an item, that I have not!");
				continue;
			}

			var newState = item.state;
			var eRowDiv = this.__objectMap[id];
			for (var ii = 0 ; ii < eRowDiv.childNodes.length ; ii++){
				if (eRowDiv.childNodes[ii].classList.contains("icon_container")){
					eRowDiv.childNodes[ii].style.backgroundPosition = "-"+(parseInt(newState) * 16).toString()+"px 0px";
				}
			}
		}
	}
	if (changes.added){
		//console.log('added: '+changes.added);
		for (var i = 0 ; i < changes.added.length ; i++){
			//console.log(JSON.stringify(changes.added[i]));
			var o = changes.added[i];
			if (this.__objects.hasOwnProperty(o.id))
				this.__removeObjectChildren(o);
		}
		var groupsByParentId = {};
		for (var i = 0 ; i < changes.added.length ; i++){
			var o = changes.added[i];
			if (!o.hasOwnProperty('parentId')){
				if (!groupsByParentId.hasOwnProperty('-1'))
					groupsByParentId[-1] = [];
				groupsByParentId[-1].unshift(o);
			}
			else{
				var parentId = o.parentId;
				if (!groupsByParentId.hasOwnProperty(parentId))
					groupsByParentId[parentId] = [];
				groupsByParentId[parentId].unshift(o);
			}
		}
		for (var i in groupsByParentId){
			var oParent;//leave undefined
			if (i >= 0){
				oParent = this.__objects[i];
				if (!oParent){
					console.log('epic fail');
					continue;
				}
			}
			this.__createElementForObject(oParent, groupsByParentId[i])
		}
	}
}

TreeView.prototype.__removeObjectChildren = function(o){
	var treeData = this._getTreeDataInState(this._state);
	var eContainer = this.eTable;
	var candidates = [];
	var stack = [o];
	while (stack.length){
		var parent = stack.pop();
		candidates.push(parent);
		if (parent.children){
			for (var i = 0 ; i < parent.children.length ; i++){
				var child = parent.children[i];
				stack.push(child);
			}
		}
	}
	for (var i = candidates.length - 1 ; i >= 1 ; i--){
		eContainer.removeChild(candidates[i].element);
		delete candidates[i].children;
	}
	delete o.children;
	
	for (var i = candidates.length - 1 ; i >= 1 ; i--){
		var candidateId = candidates[i].id;
		treeData.removed.push(candidateId);
		delete this.__objectMap[candidateId];
		delete this.__objects[candidateId];
	}
	this._registerStateChanges();
};
TreeView.prototype.__onRowClicked = function(id){
	if (id === this.__currentRow)
		return;
	var treeData = this._getTreeDataInState(this._state);
	if (this.__objectMap.hasOwnProperty(this.__currentRow)){
		this.__objectMap[this.__currentRow].className = "";
	}
	if (this.__objectMap.hasOwnProperty(id)){
		this.__objectMap[id].className = "selectedRow";
		this.__currentRow = id;
		treeData.selected = id;
		this._registerStateChanges();
	}
	else{
		console.log('epic fail: clicked on absense row');
	}
};
TreeView.prototype.__createElementForObject = function(wsObject, children){
	//var children = this._getChildren(wsObject);
	var treeData = this._getTreeDataInState(this._state);
	if (treeData){
		if (treeData.removed){
			for (var i = children.length - 1 ; i >= 0 ; i--){
				var ii = treeData.removed.indexOf(children[i].id);
				if (ii >= 0)
					treeData.removed.splice(ii, 1);
			}
		}
	}
	this._registerStateChanges();
	if (wsObject){
		wsObject.children = children;
	}
	for (var i = children.length - 1 ; i >= 0 ; i--){
		var oChild = children[i];
		var eRow = document.createElement('tr');
		//eRow.className = "selectedRow";//boris return
		var eDiv = document.createElement("div");
		this.__objectMap[oChild.id] = eDiv;
		this.__objects[oChild.id] = oChild;
		oChild.element = eRow;//eDiv;
		if (wsObject){
			oChild.level = wsObject.level.concat(i === (children.length - 1) ? 1 : 0);
		}
		else
			oChild.level = (i === (children.length - 1)) ? [0] : [1];
		eDiv.style.width = "100%";
		eDiv.style.height = "20px";
		//eDiv.style.border = "1px solid #f00";
		//eDiv.style.color = "#fff";
		//eDiv.style.padding = "0 0 0 "+(oChild.level*constSingleLevelPadding)+"px";//insert (oChild.level) images instead (lines from sprite)
		eDiv.style.padding = 0;

		for (var ii = 0 ; ii < (oChild.level.length - 1) ; ii++){
			(function(num){
				//console.log(oChild.level[num]);
				var eLineElement = document.createElement("div");
				eLineElement.style.display = "inline-block";
				eLineElement.style.width = "20px";
				eLineElement.style.height = "20px";
				eLineElement.style.background = "url(/static/images/treeicons.png) no-repeat";
				var a = oChild.level[ii] ? '-40px -40px' : '0 0';//'-40px 0';
				eLineElement.style.backgroundPosition = a;
				eDiv.appendChild(eLineElement);
			})(ii);
		}
		if (oChild.level.length){
			var param = oChild.level[oChild.level.length - 1];
			var eLineElement = document.createElement("div");
			eLineElement.style.display = "inline-block";
			eLineElement.style.width = "20px";
			eLineElement.style.height = "20px";
			eLineElement.style.background = "url(/static/images/treeicons.png) no-repeat";
			
			if (oChild.hasChildren){
				eLineElement.style.backgroundPosition = param ? '-40px -20px' : '-40px 0';
				(function(object, div, wsTree){
					div.onclick = function(){
						if (object.children){//это минус
							div.style.backgroundPosition = param ? '-40px -20px' : '-40px 0';
							wsTree.__removeObjectChildren(object);
						}
						else{//это плюс
							div.style.backgroundPosition = param ? '-20px -20px' : '-20px 0';
							wsTree.__createElementForObject(object, wsTree._getChildren(object));
						}
					}
				})(oChild, eLineElement, this);
			}
			else{
				eLineElement.style.backgroundPosition = param ? '0 -40px' : '0 -20px';
			}
			eDiv.appendChild(eLineElement);
		}
		var eIcon = document.createElement("div");
		eIcon.className += "icon_container";
		//eIcon.src = "icons/state_" + oChild.state + ".png";
		eIcon.style.display = "inline-block";
		eIcon.style.height = "16px";
		eIcon.style.width = "16px";
		//eIcon.style.background = "black";
		eIcon.style.background = "url(/static/images/states.png) no-repeat";
		eIcon.style.backgroundPosition = "-"+(parseInt(oChild.state) * 16).toString()+"px 0";
		//eIcon.style.border = "2px solid red";
		//eIcon.style.border = "2px solid rgb(194,194,193)";
		
		var eTitle = document.createElement("div");
		eTitle.style.display = "inline-block";
		eTitle.style.verticalAlign = "top";
		eTitle.style.padding = "2px 0 0 0";
		var eTitleText = document.createTextNode(oChild.name);
		eTitle.appendChild(eTitleText);
		
		eDiv.appendChild(eIcon);
		eDiv.appendChild(eTitle);
		eDiv.style.maxHeight = "20px";
		eDiv.style.fontSize = "12px";
		eDiv.style.fontFamily = "'Open Sans', sans-serif";
		
		var eCol = document.createElement('td');
		eCol.style.padding = "0";
		eCol.appendChild(eDiv);
		eRow.appendChild(eCol);

		(function(manager, id){
			var func = function(){
				manager.__onRowClicked(id);
			};
			eIcon.onclick = func;
			eTitle.onclick = func;
		})(this, oChild.id);

		//{{ add addon columns here: start
		/*(function(){
			var eColSecond = document.createElement('td');
			eColSecond.style.maxHeight = "20px";
			eColSecond.style.height = "20px";
			eColSecond.style.overflow = "hidden";
			eColSecond.style.padding = "0";
			eColSecond.style.margin = "0";
			
			var eTest = document.createElement('p');
			var eTestText = document.createTextNode("bla-bla-bla");
			eTest.appendChild(eTestText);
			//eDest.appendChild(eTest);
			
			eColSecond.appendChild(eTest);
			eRow.appendChild(eColSecond);
		})();
		//}} add addon columns here: start
		*/
		
		if (wsObject)
			wsObject.element.parentNode.insertBefore(eRow, wsObject.element.nextSibling);
		else
			this.eTable.appendChild(eRow);
	}
};
TreeView.prototype.reset = function(){
    this.eTable.innerHTML = "";
    this.__createElementForObject();
    return;
};
TreeView.prototype.expand = function(row){
}
