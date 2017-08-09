'use strict';

function HeaderWidget(wHeader){
    var eContainer = document.createElement('div');
    eContainer.id = 'header';

    var e;
    for (var i = 0 ; i < tab_urls.length ; i++){
        if (current_tab_name == tab_urls[i][0]){
            e = document.createElement('div');
            e.className = tab_urls[i][0] + ' active';
        }
        else{
            e = document.createElement('a');
            e.href=tab_urls[i][1];
            e.style.outline = 'none';
            e.className = tab_urls[i][0];
        }
        eContainer.appendChild(e);
    }

    wHeader.setContent(eContainer);

    this.eContainer = eContainer;
}
HeaderWidget.prototype = Object.create(B.StateSubscriber.prototype);
HeaderWidget.constructor = HeaderWidget;
HeaderWidget.prototype.processStateChanges = function(s){
    if (!s.hasOwnProperty('show_page'))
        s.show_page = 'root';
    this._registerStateChanges();
}
