//#region step0.localstorage.js localstorage 数据方法，迁入 indexdb，如无特殊需要，删除之前存储的数据

// 版本号数据 读取、删除
function getVersion() {
    return localStorage.getItem(dbVersionKey);
}
function removeVersion() {
    localStorage.removeItem(dbVersionKey);
}

// 全部列表数据 读取、删除
function getCategoryListHtml() {
    return localStorage.getItem(dbCategoryListHtmlKey);
}
function removeCategoryListHtml() {
    localStorage.removeItem(dbCategoryListHtmlKey);
}

// 折叠按钮位置 读取、删除
function getCategoryListExpend() {
    return JSON.parse(localStorage.getItem(dbCategoryListExpendKey));
}
function removeCategoryListExpend() {
    localStorage.removeItem(dbCategoryListExpendKey);
}

// 收藏列表数据 读取、删除
function getFavoriteDicts() {
    return JSON.parse(localStorage.getItem(dbFavoriteKey))
}
function removeFavoriteDicts() {
    localStorage.removeItem(dbFavoriteKey);
}

// 收藏列表折叠 读取、删除
function getFavoriteListExpend() {
    return JSON.parse(localStorage.getItem(dbFavoriteListExpendKey));
}
function removeFavoriteListExpend() {
    localStorage.removeItem(dbFavoriteListExpendKey);
}

// 头部搜索菜单显示隐藏开关
function getOldSearchDivVisible() {
    return localStorage.getItem(dbOldSearchDivVisibleKey);
}
function setOldSearchDivVisible(visible) {
    localStorage.setItem(dbOldSearchDivVisibleKey, visible);
}
function removeOldSearchDivVisible() {
    localStorage.removeItem(dbOldSearchDivVisibleKey);
}

// 标签谷歌机翻_首页开关
function getGoogleTranslateCategoryFontPage() {
    return localStorage.getItem(dbGoogleTranslateCategoryFontPage);
}
function removeGoogleTranslateCategoryFontPage() {
    localStorage.removeItem(dbGoogleTranslateCategoryFontPage);
}

// 标签谷歌机翻_详情页开关
function getGoogleTranslateCategoryDetail() {
    return localStorage.getItem(dbGoogleTranslateCategoryDetail);
}
function removeGoogleTranslateCategoryDetail() {
    localStorage.removeItem(dbGoogleTranslateCategoryDetail);
}

// 消息通知页面同步
function getDbSyncMessage() {
    return localStorage.getItem(dbSyncMessageKey);
}
function setDbSyncMessage(msg) {
    removeDbSyncMessage();
    localStorage.setItem(dbSyncMessageKey, msg);
}
function removeDbSyncMessage() {
    localStorage.removeItem(dbSyncMessageKey);
}

// 搜索模式
function getSearchMode() {
    return localStorage.getItem(dbFrontPageSearchMode);
}
function setSearchMode(mode) {
    return localStorage.setItem(dbFrontPageSearchMode, mode);
}

//#endregion