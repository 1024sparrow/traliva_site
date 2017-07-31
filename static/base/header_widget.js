'use strict';

function HeaderWidget(wHeader){
    var eContainer = document.createElement('div');
    eContainer.id = 'header';

    var eLogo = document.createElement('div');
    eLogo.className = 'logo';
    var eVm = document.createElement('div');
    eVm.className = 'vm';
    var eDjango = document.createElement('div');
    eDjango.className = 'django';

    var self = this;
    eLogo.addEventListener('click', function(){
            self._state.show_page = 'root';
            self._registerStateChanges();
            });
    eVm.addEventListener('click', function(){
            self._state.show_page = 'vm';
            self._registerStateChanges();
            });
    eDjango.addEventListener('click', function(){
            self._state.show_page = 'django';
            self._registerStateChanges();
            });

    eContainer.appendChild(eLogo);
    eContainer.appendChild(eVm);
    eContainer.appendChild(eDjango);
    wHeader.setContent(eContainer);

    this.eContainer = eContainer;
    this.eLogo = eLogo;
    this.eVm = eVm;
    this.eDjango = eDjango;
}
HeaderWidget.prototype = Object.create(B.StateSubscriber.prototype);
HeaderWidget.constructor = HeaderWidget;
HeaderWidget.prototype.processStateChanges = function(s){
    if (!s.hasOwnProperty('show_page'))
        s.show_page = 'root';
    this._registerStateChanges();
}
