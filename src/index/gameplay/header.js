function Header(wContainer){
    var eContainer = document.createElement('div');
    eContainer.id = 'header';
    this._currentTab = '';
    this._tabbuttons = {}
    var tabs_descr={%% input_data/tabs_descr %%};
    var i, e;
    for (i = 0 ; i < tabs_descr.length ; i++){
        e = document.createElement('a');
        e.href = '/' + tabs_descr[i] + '/';
        e.style.outline = 'none';
        e.className = tabs_descr[i];
        e.addEventListener('click', (function(header, tabname){return function(event){
            event.preventDefault();
            header._onTabClicked(tabname);
        };})(this, tabs_descr[i]));

        this._tabbuttons[tabs_descr[i]] = e;
        eContainer.appendChild(e);
    }
    wHeader.setContent(eContainer);
}
Header.prototype = Object.create(B.StateSubscriber.prototype);
Header.prototype.constructor = Header;
Header.prototype._onTabClicked = function(tabname){
    if (this._state.common.tab_loading)
        return;
    if (tabname === this._currentTab)
        return;
    this._state.common.show_page = tabname;
    this._registerStateChanges();
    this._currentTab = tabname;
    //this.processStateChanges();
        for (var i in this._tabbuttons){
            if (i === this._currentTab)
                this._tabbuttons[i].className = i + ' active';
            else
                this._tabbuttons[i].className = i;
        }
}
Header.prototype.processStateChanges = function(s){
    if (s.common.show_page !== this._currentTab){
        this._currentTab = s.common.show_page;
        for (var i in this._tabbuttons){
            if (i === this._currentTab)
                this._tabbuttons[i].className = i + ' active';
            else
                this._tabbuttons[i].className = i;
        }
    }
}
