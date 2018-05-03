function validUrl(url){
    if(url == undefined) return false;
    return url.startsWith('http://') || url.startsWith('https://');
}