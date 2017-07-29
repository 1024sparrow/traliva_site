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

    //(function(self){
        var self = this;
        eLogo.addEventListener('click', function(){
            self._state.show_page = 0;
            self._registerStateChanges();
        });
        eVm.addEventListener('click', function(){
            self._state.show_page = 1;
            self._registerStateChanges();
        });
        eDjango.addEventListener('click', function(){
            self._state.show_page = 2;
            self._registerStateChanges();
        });
    //})(this);

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
}
