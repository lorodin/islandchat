

var ChromeApp = function(datasource){
    let _this = this;
    this.tag = 'ChromApp';
    this.domains = [];
    this.datasource = datasource;
    this.pageContainer = new PageContainer();

    let default_chat_status = localStorage.getItem('default_chat_status');

    if(!default_chat_status) localStorage.setItem('default_chat_status', false);

    this.pageContainer.onRemovePageListener((page) => {
        logD(_this.tag, 'Page "' + page.url + '" deleted!');
        
        let domain_url = getDomain(page.url);
        
        let find = _this.domains.find((v, i, a) => v.url == domain_url);
        
        if(find){
            find.removePage(page);
            if(find.isEmpty()){
                let index = _this.domains.indexOf(find);
                _this.domains.splice(index, 1);
            }
        }
    });
 
    this.pageContainer.onCreateNewPage((page)=>{
        let domain_url = getDomain(page.url);
        let find = _this.domains.find((v, i, a) => v.url == domain_url);
        if(find){
            find.setPage(page);   
        }else{
            let domain = new DomainModel(domain_url);
            domain.setPage(page);
            _this.domains.push(domain);
            logD(_this.tag, 'Create new domain: ' + domain.url);
        }
    });
}

ChromeApp.prototype.removePage = function(url){
    
}

ChromeApp.prototype.testAction = function(msg){
    if(this.pageContainer.getActiveTab() == null) return;
    if(this.pageContainer.getActiveTab().port == null) return;
    console.log('send message to extension');
    this.pageContainer.getActiveTab().port.postMessage({'msg':msg});
}

ChromeApp.prototype.start = function(){
    let _this = this;
    chrome.tabs.onRemoved.addListener((id) => {
        _this.pageContainer.removeTabFromPage(id);
    })
    
    chrome.tabs.onUpdated.addListener((id, info, tab) => {
        // logD(this.tag, 'Tab updated, id: ' + id);
        // logD(this.tag, 'Tab info: ');
        // logD(this.tag, info);
        // logD(this.tag, 'Tab: ');
        // logD(this.tag, tab);
        if(info.status && info.status == 'complete'){
            let page = _this.pageContainer.createOrUpdatePage(id, tab.url);
            
            if(page == null) return;

            page.on = getChatStatusOnPage(page.url);

            
        }
    });
    
    chrome.tabs.onActivated.addListener((tab) => {
        // logD(this.tag, 'Tab activated: ');
        // logD(this.tag, tab);
        _this.pageContainer.setActiveTab(tab.tabId);
    });

    let user_name = localStorage.getItem('name');
    
    if(!user_name) {
        user_name = 'Guest';
        localStorage.setItem('name', user_name);
    }

    this._user = {
        name: user_name
    }

    chrome.runtime.onConnect.addListener(
        function(port){
            let active_tab = _this.pageContainer.getActiveTab();
            
            if(active_tab == null) return;

            active_tab.port = port;

            port.onMessage.addListener(function(msg){
                console.log('Msg from extension: ');
                console.log(msg);
            })
        }
    )
}
