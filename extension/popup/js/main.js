function openOptionsPage(){
    chrome.tabs.create({'url': 'options/index.html'});
}

document.getElementById('btn-options').addEventListener('click', openOptionsPage);

var port = chrome.runtime.connect();

port.postMessage({'msg':'msg from extension'});

port.onMessage.addListener(function(msg){
    console.log(msg);
})