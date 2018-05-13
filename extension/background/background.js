chrome.browserAction.setIcon({path: '../popup/icon.png'});
chrome.browserAction.setBadgeText({text:"2"});

var server = new Server('http', 'localhost', '8080');

const app = new ChromeApp(server);

app.start();