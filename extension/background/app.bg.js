var ChromeApp = function(datasource){
    this.tag = 'ChromApp';
    this.datasource = datasource;
    this.pageContainer = new PageContainer();
    this.pageContainer.onRemovePageListener(this.removePage);
}

ChromeApp.prototype.removePage = function(url){
    logD(this.tag, 'Page "' + url + '" deleted!');
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
        if(info.status && info.status == 'complete')
            _this.pageContainer.createOrUpdatePage(id, tab.url);
    });
    
    chrome.tabs.onActivated.addListener((tab) => {
        // logD(this.tag, 'Tab activated: ');
        // logD(this.tag, tab);
        _this.pageContainer.setActiveTab(tab.tabId);
    });

    let user_name = localStorage.getItem('name');
    if(!user_name) user_name = 'Guest';
    this._user = {
        name: user_name
    }
}
