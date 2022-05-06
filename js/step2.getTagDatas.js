//#region step2.getTagDatas.js 获取标签数据

//#region 恋物数据和ehTag数据
function getFetishListGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/SunBrook/ehWiki.fetishListing.translate.zh_CN/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getEhTagGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/EhTagTranslation/DatabaseReleases/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getFetishListTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/SunBrook/ehWiki.fetishListing.translate.zh_CN@${version}/fetish.oneLevel.withoutLang.searchKey.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

function getEhTagTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/EhTagTranslation/DatabaseReleases@${version}/db.text.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}
//#endregion


//#region indexdb 模块

var request = window.indexedDB.open("EXH_DYZYFTS", 1);
var db;

function indexDbInit(func_start_use) {
    if (request.readyState == "done") {
        db = request.result;
        func_start_use();
    } else {
        request.onsuccess = function () {
            db = request.result;
            console.log("数据库打开成功", db);
            func_start_use();
        }
    }
}

request.onerror = function (event) {
    console.log("数据库打开报错", event);
}

request.onupgradeneeded = function (event) {
    db = event.target.result;
    console.log("升级数据库", db);

    // 对象仓库 Settings
    // 
    // EhTag子菜单

    // 设置表
    // 包含：FetishList版本号、父子数据、父标签、页面Html
    // 包含：EhTag版本号、总数据、父标签、页面Html
    if (!db.objectStoreNames.contains(table_Settings)) {
        var objectStore = db.createObjectStore(table_Settings, { keyPath: 'item' });
    }

    // FetishList 父子标签表
    if (!db.objectStoreNames.contains(table_fetishListSubItems)) {
        var objectStore = db.createObjectStore(table_fetishListSubItems, { keyPath: table_fetishListSubItems_key });
        objectStore.createIndex(table_fetishListSubItems_index_subEn, table_fetishListSubItems_index_subEn, { unique: false });
        objectStore.createIndex(table_fetishListSubItems_index_searchKey, table_fetishListSubItems_index_searchKey, { unique: true });
    }

    // EhTag 父子标签表
    if (!db.objectStoreNames.contains(table_EhTagSubItems)) {
        var objectStore = db.createObjectStore(table_EhTagSubItems, { keyPath: table_EhTagSubItems_key });
        objectStore.createIndex(table_EhTagSubItems_index_subEn, table_EhTagSubItems_index_subEn, { unique: false });
        objectStore.createIndex(table_EhTagSubItems_index_searchKey, table_EhTagSubItems_index_searchKey, { unique: true });
    }

    // FavoriteList 本地收藏表
    if (!db.objectStoreNames.contains(table_favoriteSubItems)) {
        var objectStore = db.createObjectStore(table_favoriteSubItems, { keyPath: table_favoriteSubItems_key });
        objectStore.createIndex(table_favoriteSubItems_index_parentEn, table_favoriteSubItems_index_parentEn, { unique: false });
    }

    // DetailParentItems 详情页父级表
    if (!db.objectStoreNames.contains(table_detailParentItems)) {
        var objectStore = db.createObjectStore(table_detailParentItems, { keyPath: table_detailParentItems_key });
    }
}

function read(tableName, key, func_success, func_error) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(key);

    request.onerror = function (event) {
        console.log('读取事务失败', event);
        func_error();
    }

    request.onsuccess = function (event) {
        func_success(request.result);
    }
}

function readAll(tableName, func_success, func_end) {
    var objectStore = db.transaction(tableName).objectStore(tableName);
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            func_success(cursor.key, cursor.value);
            cursor.continue();
        } else {
            console.log('没有更多数据了');
            func_end();
        }
    }
}

function readByIndex(tableName, indexName, indexValue, func_success, func_none) {
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var request = index.get(indexValue);
    request.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
            func_success(result);
        } else {
            console.log('没找到');
            func_none();
        }
    }
}

// 按照索引的值查询：等于
function readByCursorIndex(tableName, indexName, indexValue, func_success) {
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var c = index.openCursor(IDBKeyRange.only(indexValue));
    var data = [];
    c.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        }
        else {
            func_success(data);
        }
    }
}

// 按照索引的值查询：模糊搜索
function readByCursorIndexFuzzy(tableName, indexName, indexValue, func_success) {
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var c = index.openCursor();
    var data = [];
    c.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value[indexName].indexOf(indexValue) != -1) {
                data.push(cursor.value);
            }
            cursor.continue();
        }
        else {
            func_success(data);
        }
    }
}



function add(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(data);

    request.onsuccess = function (event) {
        console.log('数据写入成功', event);
        func_success(event);
    }

    request.onerror = function (event) {
        console.log('数据写入失败', event);
        func_error(event);
    }
}

function batchAdd(tableName, keyName, dataList, count, func_compelete) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName);

    var index = 0;
    for (const key in dataList) {
        if (Object.hasOwnProperty.call(dataList, key)) {
            const item = dataList[key];
            item[keyName] = key;
            request.add(item);
            index++;
        }
    }

    var t = setInterval(() => {
        if (count == index) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 10);
}

function update(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .put(data);

    request.onsuccess = function (event) {
        console.log("数据更新成功", event);
        func_success();
    }

    request.onerror = function (event) {
        console.log("数据更新失败");
        func_error(event);
    }
}

function remove(tableName, key, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .delete(key);
    request.onsuccess = function (event) {
        console.log("数据删除成功", event);
        func_success();
    }
    request.onerror = function (event) {
        console.log('数据删除失败', event);
        func_error(event);
    }
}

function checkTableEmpty(tableName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.count();

    request.onsuccess = function (event) {
        if (request.result == 0) {
            // 数量为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function checkFieldEmpty(tableName, filedName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(filedName);

    request.onsuccess = function (event) {
        if (!request.result) {
            // 数据为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function clearTable(tableName, func_clear) {
    var transaction = db.transaction([tableName], 'readwrite');
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.clear();
    request.onsuccess = function (event) {
        func_clear();
    }
}
//#endregion

function fetishListDataInit(update_func, local_func) {
    // fetishList 获取本地版本号
    read(table_Settings, table_Settings_key_FetishListVersion, localVersion => {
        getFetishListGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getFetishListTranslate(version, json => {
                    update_func(json, version);
                });
            } else {
                local_func();
            }
        });
    }, error => {
        console.log('error', error);
    })
}

function ehTagDataInit(update_func, local_func) {
    // Ehtag 获取本地版本号
    read(table_Settings, table_Settings_key_EhTagVersion, localVersion => {
        getEhTagGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getEhTagTranslate(version, json => {
                    update_func(json.data, version);
                });
            } else {
                local_func();
            }
        });

    }, error => {
        console.log('error', error);
    });
}

// 验证数据完整性
function checkDataIntact(func_compelete) {
    // 如果数据表数据为空，则清空存储数据

    var complete1 = false;
    var complete2 = false;
    var complete3 = false;
    var complete4 = false;
    var complete5 = false;

    checkTableEmpty(table_fetishListSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete1 = true; }, () => { complete1 = true; });
    }, () => {
        // 存在数据
        complete1 = true;
    });
    checkTableEmpty(table_EhTagSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete2 = true; }, () => { complete2 = true; });
    }, () => {
        // 存在数据
        complete2 = true;
    });

    checkFieldEmpty(table_Settings, table_Settings_key_FetishList_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete3 = true; }, () => { complete3 = true; });
    }, () => {
        // 存在数据
        complete3 = true;
    });
    checkFieldEmpty(table_Settings, table_Settings_key_EhTag_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete4 = true; }, () => { complete4 = true; });
    }, () => {
        // 存在数据
        complete4 = true;
    });

    checkTableEmpty(table_detailParentItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete5 = true; }, () => { complete5 = true; });
    }, () => {
        // 存在数据
        complete5 = true;
    });

    var t = setInterval(() => {
        if (complete1 && complete2 && complete3 && complete4 && complete5) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 60);
}

// 比较更新词库数据
function checkUpdateData(func_needUpdate, func_none) {
    indexDbInit(() => {
        var complete1 = false;
        var complete2 = false;
        var complete3 = false;
        var complete4 = false;
        var complete5 = false;
        var complete6 = false;
        var complete7 = false;
        var complete8 = false;
        var complete9 = false;
        var complete10 = false;
        var complete11 = false;

        var isFetishUpdate = false;
        var isEhTagUpdate = false;

        var updateDataTip = document.getElementById("data_update_tip");

        // 获取并更新恋物的父子项、父级信息，详情页父级信息
        fetishListDataInit((newData, newVersion) => {

            // 显示更新提示
            updateDataTip.style.display = "block";

            // 存在更新
            isFetishUpdate = true;

            // 直接清空存储库，然后批量添加，这样速度最快
            clearTable(table_fetishListSubItems, () => {
                complete1 = true;
                batchAdd(table_fetishListSubItems, table_fetishListSubItems_key, newData.data, newData.count, () => {
                    complete2 = true;
                    console.log('批量添加完成');
                });
            });

            // 更新父级信息
            var settings_fetishList_parentEnArray = {
                item: table_Settings_key_FetishList_ParentEnArray,
                value: newData.parent_en_array
            };
            update(table_Settings, settings_fetishList_parentEnArray, () => { complete3 = true; }, () => { complete3 = true; });

            // 生成页面 html，并保存
            var categoryFetishListHtml = ``;
            var lastParentEn = '';
            for (const i in newData.data) {
                if (Object.hasOwnProperty.call(newData.data, i)) {
                    const item = newData.data[i];
                    if (item.parent_en != lastParentEn) {
                        if (lastParentEn != '') {
                            categoryFetishListHtml += `</div>`;
                        }
                        lastParentEn = item.parent_en;
                        // 新建父级
                        categoryFetishListHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend category_extend_fetish">-</span></h4>`;
                        categoryFetishListHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                    }

                    // 添加子级
                    categoryFetishListHtml += `<span class="c_item c_item_fetish" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}">${item.sub_zh}</span>`;
                }
            }
            if (categoryFetishListHtml != ``) {
                categoryFetishListHtml += `</div>`;
            }

            // 存储恋物列表Html
            var settings_fetish_html = {
                item: table_Settings_key_FetishList_Html,
                value: categoryFetishListHtml
            };
            update(table_Settings, settings_fetish_html, () => { complete4 = true; }, () => { complete4 = true; });

            // 更新版本号
            var settings_fetishList_version = {
                item: table_Settings_key_FetishListVersion,
                value: newVersion
            };
            update(table_Settings, settings_fetishList_version, () => { complete5 = true; }, () => { complete5 = true; });

        }, () => {
            complete1 = true;
            complete2 = true;
            complete3 = true;
            complete4 = true;
            complete5 = true;
            console.log('fet', "没有新数据");
        });

        // 如果 EhTag 版本更新，这尝试更新用户收藏（可能没有翻译过的标签进行翻译）
        // 获取并更新EhTag的父子项、父级信息
        ehTagDataInit((newData, newVersion) => {
            // 更新本地数据库 indexDB
            // 存储完成之后，更新版本号

            // 显示更新提示
            updateDataTip.style.display = "block";

            // 存在更新
            isEhTagUpdate = true;

            var psDict = {}; // 过滤适合的全部数据
            var psDictCount = 0;
            var parentEnArray = [];

            var detailDict = {};
            var detailDictCount = 0;

            for (const index in newData) {
                if (Object.hasOwnProperty.call(newData, index)) {
                    // var example = { ps_en: "male:bo", search_key: "male,男性,bo,波", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

                    const element = newData[index];
                    var parent_en = element.namespace;
                    if (parent_en == "rows") {
                        // 详情页父级信息
                        var parentItems = element.data;
                        for (const key in parentItems) {
                            if (Object.hasOwnProperty.call(parentItems, key)) {
                                const parentItem = parentItems[key];
                                detailDict[key] = { row: key, name: parentItem.name, desc: parentItem.intro };
                                detailDictCount++;
                            }
                        }
                        continue;
                    }

                    // 过滤重新分类
                    if (parent_en == "reclass") continue;

                    // 普通 EhTag 数据
                    parentEnArray.push(parent_en);
                    var parent_zh = element.frontMatters.name;

                    var subItems = element.data;
                    for (const sub_en in subItems) {
                        if (Object.hasOwnProperty.call(subItems, sub_en)) {
                            const subItem = subItems[sub_en];
                            var sub_zh = subItem.name;
                            var sub_desc = subItem.intro;
                            var search_key = `${parent_en},${parent_zh},${sub_en},${sub_zh}`;
                            var ps_en = `${parent_en}:${sub_en}`;
                            psDict[ps_en] = { search_key, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                            psDictCount++;
                        }
                    }
                }
            }

            // 直接清空存储库，然后批量添加，这样速度最快
            clearTable(table_EhTagSubItems, () => {
                complete6 = true;
                batchAdd(table_EhTagSubItems, table_EhTagSubItems_key, psDict, psDictCount, () => {
                    complete7 = true;
                    console.log("批量添加完成");
                });
            });

            // 批量添加详情页父级信息
            batchAdd(table_detailParentItems, table_detailParentItems_key, detailDict, detailDictCount, () => {
                complete8 = true;
                console.log("批量添加完成");
            });

            var settings_ehTag_parentEnArray = {
                item: table_Settings_key_EhTag_ParentEnArray,
                value: parentEnArray
            };

            // 更新父级信息
            update(table_Settings, settings_ehTag_parentEnArray, () => { complete9 = true; }, () => { complete9 = true; });

            // 生成页面 html
            var categoryEhTagHtml = ``;
            var lastParentEn = '';
            for (const i in psDict) {
                if (Object.hasOwnProperty.call(psDict, i)) {
                    const item = psDict[i];
                    if (item.parent_en != lastParentEn) {
                        if (lastParentEn != '') {
                            categoryEhTagHtml += `</div>`;
                        }
                        lastParentEn = item.parent_en;
                        // 新建父级
                        categoryEhTagHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend category_extend_ehTag">-</span></h4>`;
                        categoryEhTagHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                    }

                    // 添加子级
                    categoryEhTagHtml += `<span class="c_item c_item_ehTag" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}">${item.sub_zh}</span>`;
                }
            }
            if (categoryEhTagHtml != ``) {
                categoryEhTagHtml += `</div>`;
            }

            // 存储页面 html
            var settings_ehTag_html = {
                item: table_Settings_key_EhTag_Html,
                value: categoryEhTagHtml
            };
            update(table_Settings, settings_ehTag_html, () => { complete10 = true; }, () => { complete10 = true; });

            // 更新版本号
            var settings_ehTag_version = {
                item: table_Settings_key_EhTagVersion,
                value: newVersion
            };
            update(table_Settings, settings_ehTag_version, () => { complete11 = true; }, () => { complete11 = true; });

        }, () => {
            complete6 = true;
            complete7 = true;
            complete8 = true;
            complete9 = true;
            complete10 = true;
            complete11 = true;
            console.log('ehtag', "没有新数据");
        });

        // 用户收藏更新
        function updateFavoriteList(func_end) {
            var favoriteUpdateDict = {};
            var favoriteUpdateCount = 0;
            var indexCount = 0;

            var isNewUpdate = false; // 是否存在更新的收藏数据
            readAll(table_favoriteSubItems, (k, v) => {
                if (v.sub_en == v.sub_zh) {
                    favoriteUpdateDict[k] = v;
                    favoriteUpdateCount++;
                }
            }, () => {
                if (favoriteUpdateCount > 0) {
                    for (const ps_en in favoriteUpdateDict) {
                        if (Object.hasOwnProperty.call(favoriteUpdateDict, ps_en)) {
                            const item = favoriteUpdateDict[ps_en];
                            read(table_EhTagSubItems, ps_en, result => {
                                if (result) {
                                    if (result.sub_zh != item.sub_zh) {
                                        // 需要更新
                                        isNewUpdate = true;
                                        var updateFavorite = {
                                            parent_en: result.parent_en,
                                            parent_zh: result.parent_zh,
                                            ps_en: result.ps_en,
                                            sub_en: result.sub_en,
                                            sub_zh: result.sub_zh,
                                            sub_desc: result.sub_desc
                                        };
                                        update(table_favoriteSubItems, updateFavorite, () => { indexCount++; }, () => { indexCount++; });
                                    } else {
                                        indexCount++;
                                    }
                                } else {
                                    indexCount++;
                                }
                            }, () => { indexCount++; });
                        }
                    }

                    function getFavoriteListHtml(favoriteSubItems) {
                        var favoritesListHtml = ``;
                        var lastParentEn = ``;
                        for (const ps_en in favoriteSubItems) {
                            if (Object.hasOwnProperty.call(favoriteSubItems, ps_en)) {
                                var item = favoriteSubItems[ps_en];
                                if (item.parent_en != lastParentEn) {
                                    if (lastParentEn != '') {
                                        favoritesListHtml += `</div>`;
                                    }
                                    lastParentEn = item.parent_en;
                                    // 新建父级
                                    favoritesListHtml += `<h4 id="favorite_h4_${item.parent_en}">${item.parent_zh}<span data-category="${item.parent_en}"
                                            class="favorite_extend">-</span></h4>`;
                                    favoritesListHtml += `<div id="favorite_div_${item.parent_en}" class="favorite_items_div">`;
                                }

                                // 添加子级
                                favoritesListHtml += `<span class="c_item c_item_favorite" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}" data-item="${item.sub_en}" 
                                                data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}">${item.sub_zh}</span>`;
                            }
                        }

                        if (favoritesListHtml != ``) {
                            favoritesListHtml += `</div>`;
                        }

                        return favoritesListHtml;
                    }

                    function saveFavoriteListHtml(favoritesListHtml, func_compelete) {
                        var settings_favoriteList_html = {
                            item: table_Settings_key_FavoriteList_Html,
                            value: favoritesListHtml
                        };

                        update(table_Settings, settings_favoriteList_html, () => { func_compelete(); }, () => { });
                    }

                    var t1 = setInterval(() => {
                        if (favoriteUpdateCount == indexCount) {
                            t1 && clearInterval(t1);
                            if (isNewUpdate) {
                                // 收藏存在更新，需要更新收藏html，并通知其他页面更新
                                var favoriteDict = {};
                                readAll(table_favoriteSubItems, (k, v) => {
                                    favoriteDict[k] = v;
                                }, () => {
                                    var favoritesListHtml = getFavoriteListHtml(favoriteDict);
                                    saveFavoriteListHtml(favoritesListHtml, () => {
                                        // 通知页面更新
                                        setDbSyncMessage(sync_favoriteList);
                                        func_end();
                                    });
                                });
                            } else {
                                func_end();
                            }
                        }
                    }, 50);
                } else {
                    func_end();
                }
            });
        }

        var t = setInterval(() => {
            if (isFetishUpdate || isEhTagUpdate) {
                var step = 0;
                if (complete1) step += 10;
                if (complete2) step += 10;
                if (complete3) step += 10;
                if (complete4) step += 10;
                if (complete5) step += 5;
                if (complete6) step += 10;
                if (complete7) step += 10;
                if (complete8) step += 10;
                if (complete9) step += 10;
                if (complete10) step += 10;
                if (complete11) step += 5;
                updateDataTip.innerText = `词库升级中 ${step}%`;
            }

            if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6 && complete7 && complete8 && complete9 && complete10 && complete11) {
                t && clearInterval(t);
                if (isFetishUpdate || isEhTagUpdate) {
                    // 通知本地列表更新
                    setDbSyncMessage(sync_categoryList);

                    // 隐藏更新提示
                    updateDataTip.innerText = `词库升级完成`;
                    setTimeout(() => {
                        updateDataTip.style.display = "none";
                        updateDataTip.innerText = "词库升级中...";
                    }, 500);

                    // 看看是否需要更新用户收藏表数据
                    if (isEhTagUpdate) {
                        updateFavoriteList(() => { func_needUpdate(); });
                    } else {
                        func_needUpdate();
                    }

                } else {
                    func_none();
                }
            }
        }, 50);
    })

}

// 准备用户存储的关键信息，此为过渡功能，将localstroage 上的存储的配置数据存储到 indexedDB 中，然后清空 localstroage
function initUserSettings(func_compelete) {
    // 删除恋物版本号、类别html、收藏折叠数据
    removeVersion();
    removeCategoryListHtml();
    removeFavoriteListExpend();

    indexDbInit(() => {
        var complete1 = false;
        var complete2 = false;
        var complete3 = false;
        var complete4 = false;
        var complete5 = false;
        var complete6 = false;
        var complete7 = false;
        var complete8 = false;

        // 本地折叠按钮
        var categoryListExpendArray = getCategoryListExpend();
        if (categoryListExpendArray != null) {
            var settings_categoryListExpendArray = {
                item: table_Settings_key_CategoryList_Extend,
                value: categoryListExpendArray
            };
            update(table_Settings, settings_categoryListExpendArray, () => {
                removeCategoryListExpend();
                complete1 = true;
            }, () => { complete1 = true; });
        } else {
            complete1 = true;
        }


        // 头部搜索菜单显示隐藏开关，这个不需要删除
        var oldSearchDivVisible = getOldSearchDivVisible();
        if (oldSearchDivVisible != null) {
            read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
                var visibleBoolean = oldSearchDivVisible == 1;
                if (result && result.value == visibleBoolean) {
                    complete2 = true;
                } else {
                    // 更新
                    var settings_oldSearchDivVisible = {
                        item: table_Settings_key_OldSearchDiv_Visible,
                        value: visibleBoolean
                    };
                    update(table_Settings, settings_oldSearchDivVisible, () => {
                        complete2 = true;
                    }, () => { complete2 = true; });
                }
            }, () => { complete2 = true; });
        } else {
            complete2 = true;
        }

        // 标签谷歌机翻_首页开关
        var translateCategoryFrontPage = getGoogleTranslateCategoryFontPage();
        if (translateCategoryFrontPage != null) {
            var settings_translateCategoryFontPage = {
                item: table_settings_key_TranslateFrontPageTags,
                value: translateCategoryFrontPage == 1
            };
            update(table_Settings, settings_translateCategoryFontPage, () => {
                removeGoogleTranslateCategoryFontPage();
                complete3 = true;
            }, () => { complete3 = true; });
        } else {
            complete3 = true;
        }


        // 标签谷歌机翻_详情页开关
        var translateCategoryDetailPage = getGoogleTranslateCategoryDetail();
        if (translateCategoryDetailPage != null) {
            var settings_translateCategoryDetailPage = {
                item: table_Settings_key_TranslateDetailPageTags,
                value: translateCategoryDetailPage == 1
            };
            update(table_Settings, settings_translateCategoryDetailPage, () => {
                removeGoogleTranslateCategoryDetail();
                complete4 = true;
            }, () => { complete4 = true; });
        } else {
            complete4 = true;
        }

        // 用户收藏标签
        var favoriteList = getFavoriteDicts();
        if (favoriteList != null) {
            var settings_favoriteListDict = {
                item: table_Settings_key_FavoriteList,
                value: favoriteList
            };
            update(table_Settings, settings_favoriteListDict, () => {
                removeFavoriteDicts();
                complete5 = true;
            }, () => { complete5 = true; });
        } else {
            complete5 = true;
        }

        // 有损压缩图片数据同步
        var bgLowImgBase64 = getBgLowImage();
        if (!bgLowImgBase64) {
            // 从 indexeddb 有损压缩中读取，如果不存在这重新生成
            read(table_Settings, table_Settings_Key_Bg_Low_ImgBase64, result => {
                if (result && result.value) {
                    try {
                        setBgLowImage(result.value);
                    } finally {
                        complete6 = true;
                        complete7 = true;
                        complete8 = true;
                    }
                } else {
                    // 没有数据，属于旧版本没有获取数据的情况，需要根据源有数据重新生成
                    read(table_Settings, table_Settings_Key_Bg_ImgBase64, result => {
                        if (result && result.value) {
                            var t_imgBase64 = result.value;
                            read(table_Settings, table_Settings_Key_Bg_Low_ImgOverSize, result => {
                                if (!(result && result.value)) {
                                    // 需要尝试更新有损图片数据
                                    var img = new Image();
                                    img.src = t_imgBase64;
                                    img.onload = function () {
                                        var cvs = document.createElement("canvas");
                                        var ctx = cvs.getContext('2d');
                                        cvs.width = img.width;
                                        cvs.height = img.height;
                                        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);

                                        cvs.toBlob(function (blob) {
                                            var settings_Key_Bg_Low_ImgOverSize = {
                                                item: table_Settings_Key_Bg_Low_ImgOverSize,
                                                value: blob.size > 512000
                                            };
                                            update(table_Settings, settings_Key_Bg_Low_ImgOverSize, () => { complete6 = true }, () => { complete6 = true });

                                            if (blob.size <= 512000) {
                                                // 只尝试存储压缩后500kb容量的图片到 localstroage
                                                var reader2 = new FileReader();
                                                reader2.readAsDataURL(blob);
                                                reader2.onload = function (e2) {
                                                    var t_jpgBase64 = e2.target.result;
                                                    var settings_Key_Bg_Low_ImgBase64 = {
                                                        item: table_Settings_Key_Bg_Low_ImgBase64,
                                                        value: t_jpgBase64
                                                    };
                                                    update(table_Settings, settings_Key_Bg_Low_ImgBase64, () => { complete7 = true }, () => { complete7 = true });
                                                    try {
                                                        setBgLowImage(t_jpgBase64);
                                                    } finally {
                                                        complete8 = true;
                                                    }
                                                };
                                            } else {
                                                // 容量超出
                                                complete7 = true;
                                                complete8 = true;
                                            }

                                        }, 'image/jpeg', 0.1);
                                    }
                                } else {
                                    complete6 = true;
                                    complete7 = true;
                                    complete8 = true;
                                }
                            }, () => {
                                complete6 = true;
                                complete7 = true;
                                complete8 = true;
                            });
                        } else {
                            // 没有存储图片
                            complete6 = true;
                            complete7 = true;
                            complete8 = true;
                        }
                    }, () => {
                        complete6 = true;
                        complete7 = true;
                        complete8 = true;
                    });
                }
            })
        } else {
            // 存在图片
            complete6 = true;
            complete7 = true;
            complete8 = true;
        }

        var t = setInterval(() => {
            if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6 && complete7 && complete8) {
                t && clearInterval(t);
                func_compelete();
            }
        }, 50);
    })
}

//#endregion