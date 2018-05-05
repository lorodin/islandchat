chrome.browserAction.setIcon({path: '../popup/icon.png'});
chrome.browserAction.setBadgeText({text:"2"});

const app = new ChromeApp({

});

app.start();