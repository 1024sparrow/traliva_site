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

    eContainer.appendChild(eLogo);
    eContainer.appendChild(eVm);
    eContainer.appendChild(eDjango);
    wHeader.setContent(eContainer);
}
HeaderWidget.prototype = Object.create(B.StateSubscriber.prototype);
HeaderWidget.constructor = HeaderWidget;
HeaderWidget.prototype.processStateChanges = function(s){
}
