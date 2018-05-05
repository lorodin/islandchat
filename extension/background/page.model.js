var PageModel = function(url){
    this.url = url;
    this.tab_ids = [];
    this.messages = [];
}

/**
 * Срабатывает, если у текущей траницы нет вкладок
 * @param {Колбэк срабатывает при опустение страницы (нет вкладок с url страницы)} callback 
 */
PageModel.prototype.onEmptyListener = function(callback){
    this.onEmpty = callback;
}

/**
 * Добавляет вкладку с заданным id к url страницы
 * @param {ID TAB} id 
 */
PageModel.prototype.setTab = function(id){
    this.tab_ids.push(id);
}

/**
 * Удаляет вкладку с заданым id из списка вкладок по url страницы
 * @param {ID TAB} id 
 */
PageModel.prototype.removeTab = function(id){
    let index = this.tab_ids.indexOf(id);
    if(index == -1) return;
    this.tab_ids.splice(index, 1);
    if(this.tab_ids.length == 0)
        if(this.onEmpty != undefined) 
            this.onEmpty();
}

/**
 * Определяет принадлежность вкладки к url страницы
 * @param {ID TAB} id 
 */
PageModel.prototype.hasId = function(id){
    return this.tab_ids.indexOf(id) != -1;
}