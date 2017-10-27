function WaitingWidget(wContainer){
    B.StateSubscriber.call(this);
    this.isLoading = false;
    this.widget = wContainer;
    var e = document.createElement('div');
    e.className = 'toplevel_waiting';
    wContainer.setContent(e);
    wContainer.setVisible(false);
}
WaitingWidget.prototype = Object.create(B.StateSubscriber.prototype);
WaitingWidget.prototype.constructor = WaitingWidget;
WaitingWidget.prototype.processStateChanges = function(s){
    if (!(s && s.hasOwnProperty('common') && s.common.hasOwnProperty('tab_loading')))
        return;
    if (s.common.tab_loading == this.isLoading)
        return;
    this.isLoading = s.common.tab_loading;
    this.widget.setVisible(this.isLoading);
}
