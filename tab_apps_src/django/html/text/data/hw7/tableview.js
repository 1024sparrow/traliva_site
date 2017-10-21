'use strict';

var TableView;
(function(){

/*
Сокращения:
HH - horizontal header
VH - vertical header
*/

//-----------------------------------------------

var TableViewWidget__maxColumnWidth = 200;//pixels

function TableViewWidget(p_parentWidget){
	this.__w;
	this.__h;
	this._hhElements = [];
	this._eHHTable;
	this._eBodyTable
	B._WidgetBase.call(this, p_parentWidget, true);
}
TableViewWidget.prototype = Object.create(B._WidgetBase.prototype);
TableViewWidget.prototype.constructor = TableViewWidget;
TableViewWidget.prototype._createContentElem = function(){
	this._eTable = document.createElement('table');
	this._eTable.style.borderCollapse = 'collapse';
	this._tableData;
	
	this._eTopHalf = this._eTable.insertRow();
	
	this._eCorner = this._eTopHalf.insertCell();
	this._eCorner.style.margin = '0';
	
	var eHHCell = this._eTopHalf.insertCell();
	eHHCell.style.margin = '0';
	eHHCell.style.padding = '0';
	this._eHH = document.createElement('div');
	this._eHH.style.overflow = 'hidden';
	eHHCell.appendChild(this._eHH);
	
	this._eBottomHalf = this._eTable.insertRow();
	
	this._eVH = this._eBottomHalf.insertCell();
	this._eVH.style.margin = '0';
	this._eVH.style.padding = '0';
	
	var eBodyCell = this._eBottomHalf.insertCell();
	eBodyCell.style.margin = '0';
	eBodyCell.style.padding = '0';
	this._eBody = document.createElement('div');
	this._eBody.id="_eBody";
	this._eBody.style.overflow = 'auto';
	eBodyCell.appendChild(this._eBody);
	
	var  eDiv = document.createElement('div');
	eDiv.appendChild(this._eTable);
	return eDiv;
}
TableViewWidget.prototype._onResized = function(w,h){
	this.__w = w;
	this.__h = h;
	
	if (true){
		var tmpH = (h - this._eHH.offsetHeight) + 'px';
		var tmpW = w + 'px';
		
		this._eBody.style.height = tmpH;
		this._eBody.style.minHeight = tmpH;
		this._eBody.style.maxHeight = tmpH;
		this._eBody.style.width = tmpW;
		this._eBody.style.minWidth = tmpW;
		this._eBody.style.maxWidth = tmpW;
		
		//this._eHH.style.height = h;
		//this._eHH.style.minHeight = h;
		//this._eHH.style.maxHeight = h;
		this._eHH.style.width = tmpW;
		this._eHH.style.minWidth = tmpW;
		this._eHH.style.maxWidth = tmpW;
	}
}
function removeColItemsFromTable(eTable){
	var itemsToRemove = [];
	var list = eTable.childNodes;
	for (var i = 0 ; i < list.length ; i++){
		var e = list[i];
		if (e.tagName == 'TBODY'){
			var list1 = e.childNodes;
			var itemsToRemove1 = [];
			for (var i1 = 0 ; i1 < list1.length ; i1++){
				var e1 = list1[i1];
				if (e1.tagName == 'COL'){
					itemsToRemove1.push(e1);
				}
			}
			for (var i1 = 0 ; i1 < itemsToRemove1.length ; i1++){
				var e1 = itemsToRemove1[i1];
				console.log(1);//
				e.removeChild(e1);
			}
		}
		else if (e.tagName == 'COL'){
			itemsToRemove.push(e);
		}
	}
	for (var i = 0 ; i < itemsToRemove.length ; i++){
		var e = itemsToRemove[i];
		eTable.removeChild(e);
		console.log(1);//
	}
}
TableViewWidget.prototype._updateSizes = function(){
	//synchronize headers and body (header and body cell sizes)
	//здесь должны убрать предыдущие элементы "col" из "table"-ов
	removeColItemsFromTable(this._eHHTable);
	removeColItemsFromTable(this._eBodyTable);
	
	if (this.hasOwnProperty('_eBodyTable') && this.hasOwnProperty('_eHHTable')
		&& this._tableData && this._tableData.hasOwnProperty('h')){
		for (var i = 0 ; i < this._tableData.h.length ; i++){
			var maxWidth = 0;
			if (this._eBodyTable.rows.length){
				var row = this._eBodyTable.rows[0];
				if (row && row.cells.length > i)
					maxWidth = row.cells[i].offsetWidth;
			}
			if (this._hhElements[i]){
				var tmp = this._hhElements[i].offsetWidth;
				if (tmp > maxWidth)
				maxWidth = tmp;
			}
			var eHHCol = document.createElement('col');
			var eBodyCol = document.createElement('col');
			eHHCol.style.width = maxWidth + 'px';
			eBodyCol.style.width = maxWidth + 'px';
			this._eHHTable.appendChild(eHHCol);
			this._eBodyTable.appendChild(eBodyCol);
		}
	}
	else
		console.log(1);
	
	var totalWidth = 0;
	var totalHeight = 0;
	var h = this._eBodyTable.offsetHeight;
	var w = this._eBodyTable.offsetWidth;
	totalWidth += w;
	totalHeight += h;
	h = h + 'px';
	w = w + 'px';
	this._eBody.style.height = h;
	this._eBody.style.minHeight = h;
	this._eBody.style.maxHeight = h;
	this._eBody.style.width = w;
	this._eBody.style.minWidth = w;
	this._eBody.style.maxWidth = w;
	
	this._eBodyTable.style.height = h;
	this._eBodyTable.style.minHeight = h;
	this._eBodyTable.style.maxHeight = h;
	this._eBodyTable.style.width = w;
	this._eBodyTable.style.minWidth = w;
	this._eBodyTable.style.maxWidth = w;
	
	h = this._eHHTable.offsetHeight;
	w = this._eHHTable.offsetWidth;
	totalWidth += w;
	totalHeight += h;
	h = h + 'px';
	w = w + 'px';
	this._eHH.style.height = h;
	this._eHH.style.minHeight = h;
	this._eHH.style.maxHeight = h;
	this._eHH.style.width = w;
	this._eHH.style.minWidth = w;
	this._eHH.style.maxWidth = w;
	
	this._eHHTable.style.height = h;
	this._eHHTable.style.minHeight = h;
	this._eHHTable.style.maxHeight = h;
	this._eHHTable.style.width = w;
	this._eHHTable.style.minWidth = w;
	this._eHHTable.style.maxWidth = w;
}
TableViewWidget.prototype._reset = function(table_data){
	this._tableData = table_data;
	this._hhElements = [];
	if (table_data.hasOwnProperty('h')){ // build horizontal header
	
		if (this._eHHTable)
			this._eHH.removeChild(this._eHHTable);
		var tableWidthMaxLimit = table_data.h.length * TableViewWidget__maxColumnWidth;
		this._eBody.style.width = tableWidthMaxLimit + 'px';
		
		this._eHHTable = document.createElement('table');
		this._eHHTable.style.borderCollapse = 'collapse';	
		this._eHHTable.style.background = '#ccc';
		this._eHHTable.style.color = '#048';
		this._eHH.style.width = tableWidthMaxLimit + 'px';
		this._eHH.style.minWidth = tableWidthMaxLimit + 'px';
		this._eHH.style.maxWidth = tableWidthMaxLimit + 'px';
		var srcMatrix = new Array(table_data.h.length);
		var maxDepth = 0;
		for(var columnCounter = 0; columnCounter < table_data.h.length; ++columnCounter) {
			var column = [];
			srcMatrix[columnCounter] = column;
			var text = '  ';
			if (table_data.h[columnCounter].t === null)
				;
			else
				text = table_data.h[columnCounter].t;
		
			var rows = text.split('|');
			srcMatrix[columnCounter] = rows;
			if (rows.length > maxDepth){
				maxDepth = rows.length;
			}
			for (var rowCounter = 0 ; rowCounter < rows.length ; ++rowCounter) {
				srcMatrix[columnCounter][rowCounter] = rows[rowCounter];
			}
		}
		var horSpanCounter = 0;
		for (var rowCounter = 0 ; rowCounter < maxDepth ; ++rowCounter) {
			var row = this._eHHTable.insertRow();
			var prevText = 'no-text';
			var cell;
			for (var columnCounter = 0 ; columnCounter < srcMatrix.length ; ++columnCounter) {
				var rowCount = srcMatrix[columnCounter].length;
				if (rowCounter < rowCount) {
					//здесь идёт вставка ячейки. Возможно со спаном.
					//Возможно, мы должны пропустить вставку ячейки,
					//если она попадает в область горизонтального спана.
					var currentText = srcMatrix[columnCounter][rowCounter];
					//в последней строке шапки никогда не бывает спанов
					if ((rowCounter == (rowCount - 1)) || (currentText != prevText)) {
						if (columnCounter > 0) {
							if (horSpanCounter > 1){
								cell.setAttribute('colspan', horSpanCounter);
							}
						}
						horSpanCounter = 1;
						cell = row.insertCell();
						if (rowCounter == (rowCount - 1)){
							cell.setAttribute('rowspan', maxDepth - rowCount + 1);
						}
						this._hhElements[columnCounter] = cell;
						
						cell.style.margin = '0';
						cell.style.border = '1px solid #48a';
						var contentDiv = document.createElement('div');
						contentDiv.setAttribute('style', 'font-weight:bold; text-align:center;');
						contentDiv.innerHTML = currentText;
						cell.appendChild(contentDiv);
					}
					else {
						++horSpanCounter;
					}
					prevText = currentText;
				}
				else {
					prevText = 'no-text';
				}
			}
		}
		this._eHH.appendChild(this._eHHTable);
	}
	this._resetBody(table_data);
}
TableViewWidget.prototype._resetBody = function(table_data){
	if (this._eBodyTable)
		this._eBody.removeChild(this._eBodyTable);

	this._tableData = table_data;
	if (!table_data.hasOwnProperty('rows')) // build table body
		return;
	this._eBodyTable = document.createElement('table');
	this._eBodyTable.id = "_eBodyTable";
	this._eBodyTable.style.background = '#fff';
	this._eBodyTable.style.borderCollapse = 'collapse';

	var tableWidthMaxLimit = table_data.h.length * TableViewWidget__maxColumnWidth;
	this._eBody.style.width = tableWidthMaxLimit + 'px';
	this._eBody.style.minWidth = tableWidthMaxLimit + 'px';
	this._eBody.style.maxWidth = tableWidthMaxLimit + 'px';
	
	for (var rowCounter = 0 ; rowCounter < table_data.rows.length ; rowCounter++){
		var eRow = this._eBodyTable.insertRow();
		var rowData = table_data.rows[rowCounter];
		if (rowData.hasOwnProperty('h')){
			// вставляем ячейки, соответствующие вертикальному хидеру
			console.log('vertical header: not implemented');
		}
		if (rowData.hasOwnProperty('d')){
			for (var colCounter = 0 ; colCounter < rowData.d.length ; colCounter++){
				var eCell = eRow.insertCell();
				eCell.style.margin = '0';
				eCell.style.border = '1px solid #48a';
				var cellData = rowData.d[colCounter];
				if (cellData.hasOwnProperty('t')){
					eCell.innerHTML = cellData.t;
				}
			}
		}
	}
	this._eBody.appendChild(this._eBodyTable);
	(function(self){
		self._eBody.addEventListener('scroll', function(){
			self._eHH.scrollLeft = self._eBody.scrollLeft;
		});
	})(this);
}
TableViewWidget.prototype._updateCols = function(table_data, changes){
	this._tableData = table_data;
	console.log('not implemented');
}
TableViewWidget.prototype._updateRows = function(table_data, changes){
	this._tableData = table_data;
	console.log('not implemented');
}
TableViewWidget.prototype._updateCells = function(table_data, changes){
	this._tableData = table_data;
	console.log('not implemented');
}


//-----------------------------------------------
TableView = function TableView(getTableDataInStateFunction, containerWidget){
	if (!this || this === window){
		var retVal = 'класс TableView.\nПараметры конструктора:\n'+
		'1.) containerWidget - экземпляр B.Widget\n'+
		'2.) getTableDataInStateFunction - функция, которая получает на вход объект состояния,'+
		' должна вернуть объект из состава объекта состояния, где данные для таблицы\n'+
		'\n'+
		'Слушает state: как только появляется changes, выполняет команды (данные берёт из data) на обновление в следующей последовательности:\n'+
		'1.) reset:true - команда на полное обновление, если указана, последующие команды игнорируются\n'+
		/*'\n'+// пока не реализовано
		'2.) reset_body:true - команда на обновление всего кроме горизонтальной шапки, если указана, последующие команды игнорируются\n'+
		'3.) removed:{rows:[1,2,3], cols:[1,2,3]}\n'+
		'4.) inserted:{rows:[1,2,3], cols:[1,2,3]}\n'+
		'5.) updated:{rows:[1,2,3], cols:[1,2,3]}\n'+
		'\n'+*/
		'Общий формат данных для таблицы:\n'+
		'{\n'+
		'\t"data":{\n'+
		'\t\t"whole":{...},\n'+
		/*'\t\trows:{...},\n'+// пока не реализовано
		'\t\tcols:{...}\n'+*/
		'\t},\n'+
		'\t"changes":{\n'+
		'\t\t... (выше описаны поля: пока поддерживается только reset)\n'+
		'\t}\n'+
		'}\n'+
		'\n'+
		'Сами данные имеют следующий формат. \n'+
		'Строка:\n'+
		'{\n'+
		'\t"h":{t:\'верт. шапки текст\'},  <-- почему \'t\' - текст, это роль данных в ячейке, могут добавлены ещё роли\n'+
		'\t"d":[  <-- список ячеек в строке\n'+
		'\t{"t":"c1-r1"},{"t":"c2-r1"},{"t":"c3-r1"}, ...\n'+
		'\t]\n'+
		'}\n'+
//		'Стобец описывается аналогично строке, только смысл другой - данные столбца, и шапка горизонтальная\n'+
		'Вся таблица (whole) описывается JSON-ом следующего вида:\n'+
		'{\n'+
		'\th:[{t:\'c1|c2\'},{t:\'c1|c2\'},{t:\'c3\'},{t:\'c4\'}, ...] <-- горизонтальная шапка\n'+
		'\trows:[...] <-- список строк, см. описание строки выше\n'+
		'}\n'+
		'';
		return retVal;
	}
	this._view = new TableViewWidget(containerWidget);
	containerWidget.setContent(this._view, '#8cf');
	this._getTreeDataInState = getTableDataInStateFunction;
}
TableView.prototype = Object.create(B.StateSubscriber.prototype);
TableView.prototype.constructor = TableView;
TableView.prototype.processStateChanges = function(s){
	this.__currentTable = this._getTreeDataInState(s);
	var ss = this.__currentTable;
	if (!ss)
		return;
	if (!ss.hasOwnProperty('table_changes'))
		return;
	if (!ss.hasOwnProperty('table_data')){
		console.log("critical error: state property 'table_data' must be presented.");
		return;
	}
	var hasChanges = false;
	if (ss.table_changes.hasOwnProperty('reset')&& ss.table_changes.reset){
		this._view._reset(ss.table_data);
		hasChanges = true;
	}
	else if (ss.table_changes.hasOwnProperty('reset_body') && ss.table_changes.reset_body){
		this._view._resetBody(ss.table_data);
		hasChanges = true;
	}
	else{
		if (ss.table_changes.hasOwnProperty('cols')){
			this._view._updateCols(ss.table_data, ss.table_changes.cols);
			hasChanges = true;
		}
		if (ss.table_changes.hasOwnProperty('rows')){
			this._view._updateRows(ss.table_data, ss.table_changes.rows);
			hasChanges = true;
		}
		if (ss.table_changes.hasOwnProperty('cells')){
			this._view._updateCells(ss.table_data, ss.table_changes.cells);
			hasChanges = true;
		}
	}
	if (hasChanges){
		this._view._updateSizes();
		this._view._onResized(this._view.__w,this._view.__h);//самому непонятно, зачем это вызывать. Но без этого пропадают скролл-бары после обновления(т.е. повторной установки) содержимого.
		
		delete ss.table_changes;
		this._registerStateChanges();
	}
}

})();