'use strict';

/*
    Pager - обработчик изменения текущей вкладки на шапке сайта.
    При смене вкладки мы либо редиректимся на другую страницу, либо только устанавливаем какие-то атрибуты в объект состояния.
*/

function Pager(){
}
Pager.prototype = Object.create(B.StateSubscriber.prototype);
Pager.prototype.processStateChanges = function(s){
    if (!s.hasOwnProperty('show_page'))
        return;
    if (s.show_page === 'root')
        this.switchToRoot();
    if (s.show_page === 'vm')
        this.switchToVm();
    else if (s.show_page === 'django')
        this.switchToDjango();
}
Pager.prototype.switchToRoot = function(){
    //console.log(window.location.pathname);
    //window.location.search
    if (window.location.pathname == '/')
        return;
    window.location.href = "/";
}
Pager.prototype.switchToVm = function(){
    if (window.location.pathname == '/vm/')
        return;
    window.location.href = "/vm/";
}
Pager.prototype.switchToDjango = function(){
    if (window.location.pathname == '/django/')
        return;
    window.location.href = "/django/";
}
