function logD(tag, message){
    log(tag, message, 'debug');
}

function logE(tag, message){
    log(tag, message, 'error');
}

function logI(tag, message){
    log(tag, message, 'info');
}

function log(tag, message, type){
    console.log('[' + type + '] ' + tag + ': ');
    console.log(message);
}

function clearUrl(url){
    if(!url) return;
    let split = url.split('?');
    return split[0];
}

function validUrl(url){
    if(url == undefined) return false;
    return url.startsWith('http://') || url.startsWith('https://');
}