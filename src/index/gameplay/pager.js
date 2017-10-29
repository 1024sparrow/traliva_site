function Pager(){
    B.StateSubscriber.call(this);
    this.data = {
        state:{
            common:{
                show_page: '{{current_tab}}',
                tab_loading: false
            },
            tabs:{}
        },
        common:{
            html_names: {%% input_data/html_names %%}
        },
        tabs:{}
    };
    var tabs_descr={%% input_data/tabs_descr %%};
    var i, name, canvas;
    for (i = 0 ; i < tabs_descr.length ; i++){
        name = tabs_descr[i];
        canvas = new B.Widget(wCanvas);
        this.data.tabs[name] = {
            html: {},
            scope: {},
            subscribers: [],
            canvas: canvas,
            success: false
        }
        canvas._div.id = name;
        canvas.setVisible(false);
        wCanvas.addItem(canvas);
    }
    
    this.current_tab = '';
    var self = this;
    window.onpopstate = function(event){
        self._state.common.show_page = event.state;
        self._registerStateChanges();
    }
    this.taskStack = [];
    this.loadResults = [];
}
Pager.prototype = Object.create(B.StateSubscriber.prototype);
Pager.prototype.constructor = Pager;
Pager.prototype.iterateTaskStack = function(result, firstCall){
    if (firstCall !== true)
        this.loadResults.push(result);

    if (this.taskStack.length){
        var taskUrl = this.taskStack.pop();
        var self = this;
        B.ajax({
            sourcePath: taskUrl,
            readyFunc: function(result){self.iterateTaskStack(result);},
            errorFunc: function(isNetworkProblem){self.onLoadError();}
        });
    }
    else if (this.loadResults.length) { // если не было ошибки во время загрузки
        // рендерим html
        // выполняем скрипты
        var e, script;
        var htmlNames = this.data.common.html_names[this._state.common.show_page];
        for (var i = 0 ; i < htmlNames.length ; i++){
            e = document.createElement('div');
            e.innerHTML = this.loadResults.pop();
            this.data.tabs[this._state.common.show_page].html[htmlNames[i]] = e;
        }
        this.data.state.tabs[this._state.common.show_page] = JSON.parse(this.loadResults.pop());//init_state.js
        // this.current_tab - предыдущая вкладка
        // this.state.common.show_page - вкладка, на которую переключаемся
        this.data.tabs[this._state.common.show_page].success = true;
        //переключаем состояние 
        this._state.page = this.data.state.tabs[this._state.common.show_page];
        this._registerStateChanges();
        console.log(JSON.stringify(this._state));

        //Выполняем скрипты
        var EXTERNAL = this.data.tabs[this._state.common.show_page];
        // 1.js - классы
        try{eval(this.loadResults.pop());}catch(e){var err = e.constructor('Error in 1.js: '+e.message);err.lineNumber=e.lineNumber-err.lineNumber+1;throw err;};
        // 2.js - экземпляры
        try{eval(this.loadResults.pop());}catch(e){var err = e.constructor('Error in 2.js: '+e.message);err.lineNumber=e.lineNumber-err.lineNumber+1;throw err;};
        //eval(this.loadResults.pop());

        //Подключаем подписчиков
        for (var i = 0 ; i < EXTERNAL.subscribers.length ; i++){
            this.__m_publisher.registerSubscriber(EXTERNAL.subscribers[i]);
        }

        this.current_tab = this._state.common.show_page;
        this.taskStack = [];
        this.loadResults = [];
        this._state.common.tab_loading = false;

        this.data.tabs[this._state.common.show_page].canvas.setVisible(true);
        this._registerStateChanges();
    }
}
Pager.prototype.onLoadError = function(){
    console.log('Error: oops...');// здесь должны выставить состояние вейтеру "что-то пошло не так"

    var eErrorRoot = document.createElement('div');
    eErrorRoot.className = 'toplevel_loaderror';
    var e1 = document.createElement('div');
    e1.className = 'grouping';
    var e2 = document.createElement('div');
    e2.className = 'img';
    var e3 = document.createElement('div');
    e3.className = 'text';
    var e3Text = document.createTextNode('Произошла ошибка загрузки данных');
    e3.appendChild(e3Text);
    var e4wrap = document.createElement('div');
    e4wrap.className = 'bn_container';
    var e4 = document.createElement('div');
    e4.className = 'bn';
    e4.addEventListener('click', (function(self){return function(e){self.onRetryDownloadTabBnClicked();};})(this));
    e4.addEventListener('mousedown', function(e){e.preventDefault();});
    var e4Text = document.createTextNode('Повторить попытку');
    e4.appendChild(e4Text);
    e4wrap.appendChild(e4);
    e1.appendChild(e2);
    e1.appendChild(e3);
    e1.appendChild(e4wrap);
    eErrorRoot.appendChild(e1);

    var w = this.data.tabs[this._state.common.show_page].canvas;
    w.setContent(eErrorRoot);
    w.setVisible(true);

    this.taskStack = [];
    this.loadResults = [];
    this._state.common.tab_loading = false;
    this._registerStateChanges();
}
Pager.prototype.processStateChanges = function(s){
    if (Object.keys(s).length == 0){
        for (var i in this.data.state){
            s[i] = this.data.state[i];
        }
        this._registerStateChanges();
    }
    if (this.current_tab != s.common.show_page){
        //console.log('Меняю вкладку');

        //для текущей вкладки (this.current_tab) запускаем выжималку Состояния... - ?
        if (this.current_tab.length){
            if (this.current_tab.length)
                history.pushState(s.common.show_page, '', '/'+s.common.show_page+'/');
            //else
            //    history.replaceState(...)//boris return
        }

        if (this.data.tabs.hasOwnProperty(this.current_tab)){
            //снимаем подписчиков для this.current_tab
            for (var i = 0 ; i < this.data.tabs[this.current_tab].subscribers.length ; i++){
                publisher.unregisterSubscriber(this.data.tabs[this.current_tab].subscribers[i]);
            }
            //this.data.state.tabs[this.current_tab] = this._state.page;// this._state - ссылка на объект. Так что копировать не нужно. (а если и копировать, то надо было клонировать)
            //делаем соотв. this.current_tab виджет невидимым
            this.data.tabs[this.current_tab].canvas.setVisible(false);
            this.current_tab = this._state.common.show_page;
        }
        if (this.data.state.tabs.hasOwnProperty(this._state.common.show_page) && this.data.tabs[this._state.common.show_page].success){//boris here: проверить условие. По-моему, что-то тут не то...
            //регистрируем подписчиков для this._state.common.show_page
            for (var i = 0 ; i < this.data.tabs[this._state.common.show_page].subscribers.length ; i++){
                publisher.registerSubscriber(this.data.tabs[this._state.common.show_page].subscribers[i]);
            }
            //делаем соотв. this._state.common.show_page виджет видимым
            this.data.tabs[this._state.common.show_page].canvas.setVisible(true);
        }
        else{//Если такой нет среди загруженных:
            this._initializeTabLoading();
        }
        this.current_tab = s.common.show_page;
    }
}
Pager.prototype.onRetryDownloadTabBnClicked = function(){
    this.data.tabs[this._state.common.show_page].canvas.setVisible(false);
    this._initializeTabLoading();
}
Pager.prototype._initializeTabLoading = function(){
    this._state.common.tab_loading = true;
    this._registerStateChanges();
    this.taskStack = [];
    this.loadResults = [];

    var self = this;
    var htmlNames = this.data.common.html_names[this._state.common.show_page];
    if (htmlNames.length){
        for (var i = htmlNames.length - 1 ; i >= 0 ; i--){
            this.taskStack.push('/static/tab_apps/'+this._state.common.show_page+'/html/'+htmlNames[i]+'/'+htmlNames[i]);
        }
    }
    this.taskStack.push('/static/tab_apps/'+this._state.common.show_page+'/init_state.js');
    this.taskStack.push('/static/tab_apps/'+this._state.common.show_page+'/1.js');
    this.taskStack.push('/static/tab_apps/'+this._state.common.show_page+'/2.js');
    this.iterateTaskStack('', true);
}
