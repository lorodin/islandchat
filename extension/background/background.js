chrome.browserAction.setIcon({path: '../popup/icon.png'});
chrome.browserAction.setBadgeText({text:"2"});

chrome.tabs.onRemoved.addListener((id) => {
    console.log(`Tab closed, id: ` + id);
})

chrome.tabs.onUpdated.addListener((id, info, tab) => {
    console.log('Tab updated, id: ' + id);
    console.log('Tab info: ');
    console.log(info);
    console.log('Tab: ');
    console.log(tab);
});

chrome.tabs.onActivated.addListener((tab) => {
    console.log('Tab activated: ');
    console.log(tab);
})