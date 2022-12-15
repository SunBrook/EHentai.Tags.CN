//#region step3.8.favorite.js 收藏功能

// 读取转换本地收藏数据
read(table_Settings, table_Settings_key_FavoriteList, result => {
    if (result && result.value) {
        // 首次使用，需要转换收藏数据，更新本地收藏表，更新收藏Html
        reBuildFavoriteByOldData(result.value);
    } else {
        // 读取收藏HTML，如果存在，则直接生成页面，否则从收藏表读取数据手动生成
        read(table_Settings, table_Settings_key_FavoriteList_Html, result => {
            if (result && result.value) {
                // 存在收藏 html
                // 页面附加Html
                favoriteListDiv.innerHTML = result.value;
                // 小项添加点击事件
                favoriteItemsClick();
                // 折叠菜单添加点击事件
                favoriteExtendClick();
                // 设置收藏折叠
                setFavoriteExpend();
                // 更新按钮状态
                updateFavoriteListBtnStatus();
            } else {
                // 不存在收藏 html
                // 根据收藏表生成html
                generalFavoriteListDiv(() => {
                    // 设置收藏折叠
                    setFavoriteExpend();
                    // 更新按钮状态
                    updateFavoriteListBtnStatus();
                });
            }
        }, () => { });
    }
}, () => { });

// 根据旧收藏数据重新生成收藏列表
function reBuildFavoriteByOldData(favoriteDict) {

    var favoriteSubItems = {};
    // var example = { ps_en: "male:bo", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

    function setFavoriteDict(result) {
        var parent_en = result.parent_en;
        var parent_zh = result.parent_zh;
        var sub_en = result.sub_en;
        var sub_zh = result.sub_zh;
        var sub_desc = result.sub_desc;
        var ps_en = `${parent_en}:${sub_en}`;
        favoriteSubItems[ps_en] = { ps_en, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
    }

    function setFavoriteDictCustom(subEn, subZh) {
        var parent_en = "userCustom";
        var parent_zh = "自定义";
        var sub_en = subEn;
        var sub_zh = subZh;
        var sub_desc = "";
        var ps_en = `${parent_en}:${sub_en}`;
        favoriteSubItems[ps_en] = { ps_en, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
    }

    var foundTotalCount = 0; // 总数
    var foundIndex = 0; // 执行完个数

    for (const parentEn in favoriteDict) {
        if (Object.hasOwnProperty.call(favoriteDict, parentEn)) {
            const subData = favoriteDict[parentEn];
            var subItems = subData[1];
            if (parentEn == "localFavorites") {
                // 恋物数据
                for (const subEn in subItems) {
                    if (Object.hasOwnProperty.call(subItems, subEn)) {
                        const subZh = subItems[subEn];
                        foundTotalCount++;
                        readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, subEn, fetishResult => {
                            setFavoriteDict(fetishResult);
                            foundIndex++;
                        }, () => {
                            setFavoriteDictCustom(subEn, subZh);
                            foundIndex++;
                        });
                    }
                }

            } else {
                // Ehtag 数据
                for (const subEn in subItems) {
                    if (Object.hasOwnProperty.call(subItems, subEn)) {
                        const subZh = subItems[subEn];
                        foundTotalCount++;
                        var ps_en = `${parentEn}:${subEn}`;
                        read(table_EhTagSubItems, ps_en, ehTagResult => {
                            if (ehTagResult) {
                                setFavoriteDict(ehTagResult);
                                foundIndex++;
                            } else {
                                setFavoriteDictCustom(subEn, subZh);
                                foundIndex++;
                            }
                        }, () => {
                            setFavoriteDictCustom(subEn, subZh);
                            foundIndex++;
                        });
                    }
                }
            }
        }
    }

    var t = setInterval(() => {
        if (foundTotalCount == foundIndex) {
            t && clearInterval(t);
            // 首次更新本地收藏列表
            firstUpdateFavoriteSubItems(favoriteSubItems, foundTotalCount);
        }
    }, 50);
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

// 首次更新本地收藏列表
function firstUpdateFavoriteSubItems(favoriteSubItems, foundTotalCount) {
    // 更新本地收藏表
    batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, favoriteSubItems, foundTotalCount, () => {
        console.log('批量添加本地收藏表完成');
        // 稳妥起见，更新完之后再删除本地的原始收藏列表
        remove(table_Settings, table_Settings_key_FavoriteList, () => { }, () => { });

        // 更新我的标签收藏
        updateMyTagFavoriteTagHtml(() => {
            setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
        }, () => { });
    });

    // 生成 html 和 同步
    if (!checkDictNull(favoriteSubItems)) {
        // 新版收藏，只可能增加，原有的不变
        var favoritesListHtml = getFavoriteListHtml(favoriteSubItems);

        // 页面附加Html
        favoriteListDiv.innerHTML = favoritesListHtml;

        // 存储收藏Html
        saveFavoriteListHtml(favoritesListHtml, () => {
            // 通知页面更新
            setDbSyncMessage(sync_favoriteList);
        });

        // 小项添加点击事件
        favoriteItemsClick();

        // 折叠菜单添加点击事件
        favoriteExtendClick();

        // 折叠的菜单显示隐藏
        setFavoriteExpend();
    }

    // 更新按钮状态
    updateFavoriteListBtnStatus();
}

// 设置收藏折叠
function setFavoriteExpend() {
    read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
        var expendBtns = document.getElementsByClassName("favorite_extend");
        if (result && result.value) {
            var expendArray = result.value;
            for (const i in expendBtns) {
                if (Object.hasOwnProperty.call(expendBtns, i)) {
                    const btn = expendBtns[i];
                    var category = btn.dataset.category;
                    var itemDiv = document.getElementById("favorite_div_" + category);
                    if (expendArray.indexOf(category) != -1) {
                        btn.innerText = "+";
                        itemDiv.style.display = "none";
                    } else {
                        btn.innerText = "-";
                        itemDiv.style.display = "block";
                    }
                }
            }
        } else {
            for (const i in expendBtns) {
                if (Object.hasOwnProperty.call(expendBtns, i)) {
                    const btn = expendBtns[i];
                    btn.innerText = "-";
                    var category = btn.dataset.category;
                    var itemDiv = document.getElementById("favorite_div_" + category);
                    itemDiv.style.display = "block";
                }
            }
        }
    }, () => { });
}

// 更新收藏列表Html存储
function saveFavoriteListHtml(favoritesListHtml, func_compelete) {
    var settings_favoriteList_html = {
        item: table_Settings_key_FavoriteList_Html,
        value: favoritesListHtml
    };

    update(table_Settings, settings_favoriteList_html, () => { func_compelete(); }, () => { });
}

// 为每个收藏子项添加点击事件
function favoriteItemsClick() {
    var favoriteItems = document.getElementsByClassName("c_item_favorite");
    for (const i in favoriteItems) {
        if (Object.hasOwnProperty.call(favoriteItems, i)) {
            const item = favoriteItems[i];
            item.addEventListener("click", function () {
                var parentEn = item.dataset.parent_en;
                var parentZh = item.dataset.parent_zh;
                var subDesc = item.dataset.sub_desc;
                var enItem = item.dataset.item;
                var zhItem = item.innerHTML;

                addItemToInput(parentEn, parentZh, enItem, zhItem, subDesc);
            });
        }
    }
}

// 为每个折叠按钮添加点击事件
function favoriteExtendClick() {
    var favoriteExtends = document.getElementsByClassName("favorite_extend");
    for (const i in favoriteExtends) {
        if (Object.hasOwnProperty.call(favoriteExtends, i)) {
            const item = favoriteExtends[i];
            item.addEventListener("click", function () {
                // 获取存储折叠信息
                read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
                    var expendData = [];
                    if (result && result.value) {
                        expendData = result.value;
                    }

                    var favoriteName = item.dataset.category;
                    if (item.innerHTML == "+") {
                        // 需要展开
                        item.innerHTML = "-";
                        document.getElementById("favorite_div_" + favoriteName).style.display = "block";
                        if (expendData.indexOf(favoriteName) != -1) {
                            expendData.remove(favoriteName);
                        }
                    } else {
                        // 需要折叠
                        item.innerHTML = "+";
                        document.getElementById("favorite_div_" + favoriteName).style.display = "none";
                        if (expendData.indexOf(favoriteName) == -1) {
                            expendData.push(favoriteName);
                        }
                    }

                    // 更新存储折叠信息
                    var settings_favoriteList_extend = {
                        item: table_Settings_Key_FavoriteList_Extend,
                        value: expendData
                    };

                    update(table_Settings, settings_favoriteList_extend, () => {
                        // 通知折叠
                        setDbSyncMessage(sync_favoriteList_Extend);
                    }, () => { });

                }, () => { });
            });

        }
    }
}

// 加入收藏
addFavoritesBtn.onclick = function () {
    // 输入框标签，判断非空
    if (checkDictNull(searchItemDict)) {
        alert("收藏前请选择至少一个标签");
        return;
    }

    addFavoritesBtn.innerText = "收藏中...";

    var favoriteDicts = {}; // 原始收藏
    var newFavoriteDicts = {}; // 新增收藏

    // 读取存储收藏全部
    readAll(table_favoriteSubItems, (k, v) => {
        favoriteDicts[k] = v;
    }, () => {
        // 全部读取完毕，过滤出新增数据
        var newFavoritesCount = filterNewFavorites();

        // 如果有新数据就更新存储和页面
        updateDbAndPage(newFavoritesCount);
    });

    function filterNewFavorites() {
        var newFavoritesCount = 0;
        for (const ps_en in searchItemDict) {
            if (Object.hasOwnProperty.call(searchItemDict, ps_en)) {
                const item = searchItemDict[ps_en];
                if (!favoriteDicts[ps_en]) {
                    newFavoriteDicts[ps_en] = item;
                    newFavoritesCount++;
                }
            }
        }
        return newFavoritesCount;
    }

    function updateDbAndPage(newFavoritesCount) {
        if (newFavoritesCount > 0) {
            // 更新收藏表
            batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, newFavoriteDicts, newFavoritesCount, () => {
                // 更新页面html 和 事件
                for (const ps_en in newFavoriteDicts) {
                    if (Object.hasOwnProperty.call(newFavoriteDicts, ps_en)) {
                        const item = newFavoriteDicts[ps_en];

                        var favoriteH4Id = "favorite_h4_" + item.parent_en;
                        var favoriteH4 = document.getElementById(favoriteH4Id);
                        if (!favoriteH4) {
                            var h4 = document.createElement("h4");
                            h4.id = favoriteH4Id;
                            var h4text = document.createTextNode(item.parent_zh);
                            h4.appendChild(h4text);
                            var spanExtend = document.createElement("span");
                            spanExtend.dataset.category = item.parent_en;
                            spanExtend.classList.add("favorite_extend");
                            var spanExtendText = document.createTextNode("-");
                            spanExtend.appendChild(spanExtendText);

                            spanExtend.addEventListener("click", function () {
                                favoriteExend(item.parent_en);
                            });

                            h4.appendChild(spanExtend);
                            favoriteListDiv.appendChild(h4);
                        }

                        var favoriteDivId = "favorite_div_" + item.parent_en;
                        var favoriteDiv = document.getElementById(favoriteDivId);
                        if (!favoriteDiv) {
                            var div = document.createElement("div");
                            div.id = favoriteDivId;
                            div.classList.add("favorite_items_div");
                            favoriteListDiv.appendChild(div);
                            favoriteDiv = document.getElementById(favoriteDivId);
                        }

                        var newFavoriteItem = document.createElement("span");
                        newFavoriteItem.classList.add("c_item");
                        newFavoriteItem.classList.add("c_item_favorite");
                        newFavoriteItem.dataset.item = item.sub_en;
                        newFavoriteItem.dataset.parent_en = item.parent_en;
                        newFavoriteItem.dataset.parent_zh = item.parent_zh;
                        newFavoriteItem.dataset.sub_desc = item.sub_desc;
                        newFavoriteItem.title = `${item.sub_zh} [${item.sub_en}]\n\n${item.sub_desc}`;

                        var itemText = document.createTextNode(item.sub_zh);
                        newFavoriteItem.appendChild(itemText);

                        newFavoriteItem.addEventListener("click", function () {
                            addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh, item.sub_desc);
                        });

                        favoriteDiv.appendChild(newFavoriteItem);

                    }
                }

                // 更新我的标签收藏
                updateMyTagFavoriteTagHtml(() => {
                    setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                }, () => { });

                // 获取html并更新收藏html
                saveFavoriteListHtml(favoriteListDiv.innerHTML, () => {
                    // 通知更新收藏列表
                    setDbSyncMessage(sync_favoriteList);

                    // 设置折叠
                    setFavoriteExpend();

                    // 完成
                    finishFavorite();
                });
            })
        } else {
            // 无更新
            finishFavorite();
        }
    }

    // 指定折叠
    function favoriteExend(parentEn) {
        var h4 = document.getElementById("favorite_h4_" + parentEn);
        var span = h4.querySelector("span");
        read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
            var expendData = [];
            if (result && result.value) {
                expendData = result.value;
            }

            if (span.innerHTML == "+") {
                // 需要展开
                span.innerHTML = "-";
                document.getElementById("favorite_div_" + parentEn).style.display = "block";
                if (expendData.indexOf(parentEn) != -1) {
                    expendData.remove(parentEn);
                }
            } else {
                // 需要折叠
                span.innerHTML = "+";
                document.getElementById("favorite_div_" + parentEn).style.display = "none";
                if (expendData.indexOf(parentEn) == -1) {
                    expendData.push(parentEn);
                }
            }

            // 更新存储折叠信息
            var settings_favoriteList_extend = {
                item: table_Settings_Key_FavoriteList_Extend,
                value: expendData
            };

            update(table_Settings, settings_favoriteList_extend, () => { }, () => { });

        }, () => { });
    }

    // 收尾工作
    function finishFavorite() {
        // 更新按钮状态
        updateFavoriteListBtnStatus();

        setTimeout(function () {
            addFavoritesBtn.innerText = "完成 √";
        }, 250);
        setTimeout(function () {
            addFavoritesBtn.innerText = "加入收藏";
        }, 500);
    }
}

// 全部展开
favoriteAllExtend.onclick = function () {
    var extendBtns = document.getElementsByClassName("favorite_extend");
    for (const i in extendBtns) {
        if (Object.hasOwnProperty.call(extendBtns, i)) {
            const btn = extendBtns[i];
            if (btn.innerHTML != "-") {
                btn.innerHTML = "-";
            }
        }
    }

    var favoriteItemsDiv = document.getElementsByClassName("favorite_items_div");
    for (const i in favoriteItemsDiv) {
        if (Object.hasOwnProperty.call(favoriteItemsDiv, i)) {
            const div = favoriteItemsDiv[i];
            if (div.style.display != "block") {
                div.style.display = "block";
            }
        }
    }

    // 清空折叠记录
    remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => {
        // 通知折叠
        setDbSyncMessage(sync_favoriteList_Extend);
    }, () => { });
}

// 全部折叠
favoriteAllCollapse.onclick = function () {
    favoriteAllCollapse_Func();

    // 并更新存储全部的父级名称
    var settings_favoriteList_extend = {
        item: table_Settings_Key_FavoriteList_Extend,
        value: favoriteParentData
    };

    update(table_Settings, settings_favoriteList_extend, () => {
        // 通知折叠
        setDbSyncMessage(sync_favoriteList_Extend);
    }, () => { });
}

// 全部折叠 - 不含存储
function favoriteAllCollapse_Func() {
    var extendBtns = document.getElementsByClassName("favorite_extend");
    for (const i in extendBtns) {
        if (Object.hasOwnProperty.call(extendBtns, i)) {
            const btn = extendBtns[i];
            if (btn.innerHTML != "+") {
                btn.innerHTML = "+";
            }
        }
    }

    var favoriteParentData = [];
    var favoriteItemsDiv = document.getElementsByClassName("favorite_items_div");
    for (const i in favoriteItemsDiv) {
        if (Object.hasOwnProperty.call(favoriteItemsDiv, i)) {
            const div = favoriteItemsDiv[i];
            if (div.style.display != "none") {
                div.style.display = "none";
            }
            favoriteParentData.push(div.id.replace("favorite_div_", ""));
        }
    }
}


// 编辑
var favoriteRemoveKeys = []; // 删除记录
var favoriteDict = {}; // 当前存储记录
favoriteEdit.onclick = function () {
    // 显示保存和取消按钮，隐藏编辑和清空按钮，以及展开折叠按钮和加入收藏按钮
    favoriteAllExtend.style.display = "none";
    favoriteAllCollapse.style.display = "none";
    favoriteSave.style.display = "block";
    favoriteCancel.style.display = "block";
    favoriteEdit.style.display = "none";
    favoriteClear.style.display = "none";
    addFavoritesBtn.style.display = "none";
    addFavoritesDisabledBtn.style.display = "block";

    // 隐藏备份和恢复按钮
    favoriteExport.style.display = "none";
    favoriteRecover.style.display = "none";

    // 隐藏收藏列表，方便用户取消时直接还原
    favoriteListDiv.style.display = "none";

    // 显示编辑列表, 读取本地收藏, 生成可删除的标签
    favoriteEditDiv.style.display = "block";

    var lastParentEn = '';
    var favoriteEditParentDiv;
    readAll(table_favoriteSubItems, (k, v) => {
        favoriteDict[k] = v;
        if (lastParentEn != v.parent_en) {
            // 新建父级标签
            lastParentEn = v.parent_en;
            var h4 = document.createElement("h4");
            h4.id = "favorite_edit_h4_" + v.parent_en;
            var h4text = document.createTextNode(v.parent_zh);
            h4.appendChild(h4text);
            var spanClear = document.createElement("span");
            spanClear.dataset.category = v.parent_en;
            spanClear.classList.add("favorite_edit_clear");
            var spanClearText = document.createTextNode("x");
            spanClear.appendChild(spanClearText);
            spanClear.addEventListener("click", function () {
                // 清空父项和子项
                removeEditorParent(v.parent_en);
            });
            h4.appendChild(spanClear);
            favoriteEditDiv.appendChild(h4);

            var div = document.createElement("div");
            div.id = "favorite_edit_div_" + v.parent_en;
            div.classList.add("favorite_edit_items_div");
            favoriteEditDiv.appendChild(div);

            favoriteEditParentDiv = document.getElementById(div.id);
        }

        var newEditorItem = document.createElement("span");
        newEditorItem.classList.add("f_edit_item");
        newEditorItem.id = "f_edit_item_" + v.sub_en;
        newEditorItem.dataset.item = v.sub_en;
        newEditorItem.dataset.parent_en = v.parent_en;
        newEditorItem.dataset.parent_zh = v.parent_zh;
        newEditorItem.title = v.sub_en;

        var editorItemText = document.createTextNode(v.sub_zh + " X");
        newEditorItem.appendChild(editorItemText);
        favoriteEditDiv.appendChild(newEditorItem);

        newEditorItem.addEventListener("click", function () {
            removeEditorItem(v.parent_en, v.sub_en);
        });

        favoriteEditParentDiv.appendChild(newEditorItem);


    }, () => { });

    // 删除父子项
    function removeEditorParent(parentEn) {
        var h4 = document.getElementById("favorite_edit_h4_" + parentEn);
        h4.parentNode.removeChild(h4);
        var div = document.getElementById("favorite_edit_div_" + parentEn);
        div.parentNode.removeChild(div);

        for (const key in favoriteDict) {
            if (Object.hasOwnProperty.call(favoriteDict, key)) {
                const item = favoriteDict[key];
                if (item.parent_en == parentEn && favoriteRemoveKeys.indexOf(key) == -1) {
                    favoriteRemoveKeys.push(key);
                }
            }
        }
    }

    // 删除子项
    function removeEditorItem(parentEn, subEn) {
        // 如果没有子项了，就删除包裹的div，以及对应的标题h4
        var item = document.getElementById("f_edit_item_" + subEn);
        var editDiv = item.parentNode;
        item.parentNode.removeChild(item);

        if (editDiv.childNodes.length == 0) {
            editDiv.parentNode.removeChild(editDiv);
            var h4 = document.getElementById("favorite_edit_h4_" + parentEn);
            h4.parentNode.removeChild(h4);
        }

        var key = `${parentEn}:${subEn}`;
        if (favoriteRemoveKeys.indexOf(key) == -1) {
            favoriteRemoveKeys.push(key);
        }
    }

}

// 更新收藏模块按钮的显示隐藏
function updateFavoriteListBtnStatus() {
    var favoriteItems = favoriteListDiv.querySelectorAll("span");
    if (favoriteItems.length == 0) {
        favoriteAllExtend.style.display = "none";
        favoriteAllCollapse.style.display = "none";
        favoriteEdit.style.display = "none";
        favoriteClear.style.display = "none";
        favoriteSave.style.display = "none";
        favoriteCancel.style.display = "none";
        favoriteExport.style.display = "none";
    }
    else {
        favoriteAllExtend.style.display = "block";
        favoriteAllCollapse.style.display = "block";
        favoriteEdit.style.display = "block";
        favoriteClear.style.display = "block";
        favoriteExport.style.display = "block";
    }
}

// 退出编辑模式，先改变按钮样式
function editToFavoriteBtnStatus() {
    // 是否允许加入收藏
    if (checkDictNull(searchItemDict)) {
        addFavoritesBtn.style.display = "none";
        addFavoritesDisabledBtn.style.display = "block";
    }
    else {
        addFavoritesBtn.style.display = "block";
        addFavoritesDisabledBtn.style.display = "none";
    }

    // 更新收藏模块按钮的显示隐藏
    updateFavoriteListBtnStatus();

    // 隐藏保存和取消按钮
    favoriteSave.style.display = "none";
    favoriteCancel.style.display = "none";

    // 显示恢复按钮
    favoriteRecover.style.display = "block";
}

// 退出编辑模式
function editToFavorite() {
    editToFavoriteBtnStatus();

    // 显示收藏列表
    favoriteListDiv.style.display = "block";

    // 隐藏并清空收藏编辑列表
    favoriteEditDiv.style.display = "none";
    favoriteEditDiv.innerHTML = "";
}

// 保存
favoriteSave.onclick = function () {
    // 编辑删除
    var removeTotalCount = favoriteRemoveKeys.length;
    var removeIndex = 0;
    for (const i in favoriteRemoveKeys) {
        if (Object.hasOwnProperty.call(favoriteRemoveKeys, i)) {
            const removeKey = favoriteRemoveKeys[i];
            remove(table_favoriteSubItems, removeKey, () => { removeIndex++; }, () => { removeIndex++; });
        }
    }

    var t = setInterval(() => {
        if (removeTotalCount == removeIndex) {
            t && clearInterval(t);

            // 更新我的标签收藏
            updateMyTagFavoriteTagHtml(() => {
                setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
            }, () => { });

            // 更新收藏折叠
            updateFavoriteExtend();
        }
    }, 50);

    // 获取折叠菜单，然后依次从收藏表取一条数据，看能否找到，找不到一条就删掉折叠菜单
    function updateFavoriteExtend() {
        read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
            if (result && result.value) {
                var delArray = [];
                var extendArray = result.value;
                var foundTotalCount = extendArray.length;
                var foundIndex = 0;
                for (const i in extendArray) {
                    if (Object.hasOwnProperty.call(extendArray, i)) {
                        const parentEn = extendArray[i];
                        readByIndex(table_favoriteSubItems, table_favoriteSubItems_index_parentEn, parentEn, result => {
                            foundIndex++;
                        }, () => {
                            // 没找到
                            delArray.push(parentEn);
                            foundIndex++;
                        });
                    }
                }

                var t = setInterval(() => {
                    if (foundTotalCount == foundIndex) {
                        t && clearInterval(t);

                        // 更新折叠数据
                        var newExtendArray = getDiffSet(extendArray, delArray);
                        var settings_favoriteList_extend = {
                            item: table_Settings_Key_FavoriteList_Extend,
                            value: newExtendArray
                        };
                        update(table_Settings, settings_favoriteList_extend, () => {
                            // 重新生成收藏列表
                            reBuildFavoriteList();
                        }, () => {
                        });
                    }
                }, 50);
            } else {
                // 重新生成收藏列表
                reBuildFavoriteList();
            }
        }, () => { });
    }


    function reBuildFavoriteList() {
        // 清空收藏列表，根据编辑生成收藏列表
        favoriteListDiv.innerHTML = "";

        // 生成收藏列表
        generalFavoriteListDiv(() => {
            // 通知页面刷新
            setDbSyncMessage(sync_favoriteList);

            // 编辑列表清空
            favoriteRemoveKeys = [];
            favoriteDict = {};

            // 设置收藏折叠
            setFavoriteExpend();

            // 退出编辑模式
            editToFavorite();
        });

    }
}

// 生成收藏列表、包含各种子项点击事件
function generalFavoriteListDiv(func_compelete) {
    // 读取收藏表，生成 页面html
    var favoritesListHtml = ``;
    var lastParentEn = ``;
    readAll(table_favoriteSubItems, (k, v) => {
        if (v.parent_en != lastParentEn) {
            if (lastParentEn != '') {
                favoritesListHtml += `</div>`;
            }
            lastParentEn = v.parent_en;
            // 新建父级
            favoritesListHtml += `<h4 id="favorite_h4_${v.parent_en}">${v.parent_zh}<span data-category="${v.parent_en}"
                class="favorite_extend">-</span></h4>`;
            favoritesListHtml += `<div id="favorite_div_${v.parent_en}" class="favorite_items_div">`;
        }

        // 添加子级
        favoritesListHtml += `<span class="c_item c_item_favorite" title="[${v.sub_en}] ${v.sub_desc}" data-item="${v.sub_en}" 
                    data-parent_en="${v.parent_en}" data-parent_zh="${v.parent_zh}">${v.sub_zh}</span>`;
    }, () => {
        // 读完后操作
        if (favoritesListHtml != ``) {
            favoritesListHtml += `</div>`;
        }

        // 页面附加Html
        favoriteListDiv.innerHTML = favoritesListHtml;

        // 小项添加点击事件
        favoriteItemsClick();

        // 折叠菜单添加点击事件
        favoriteExtendClick();

        // 存储收藏Html
        saveFavoriteListHtml(favoritesListHtml, () => {
            func_compelete();
        });
    })
}

// 取消
favoriteCancel.onclick = editToFavorite;

// 清空
favoriteClear.onclick = function () {
    var confirmResult = confirm("是否清空本地收藏?");
    if (confirmResult) {
        favoriteListDiv.innerHTML = "";

        // 清空收藏Html
        remove(table_Settings, table_Settings_key_FavoriteList_Html, () => {
            // 通知收藏页面更新
            setDbSyncMessage(sync_favoriteList);
            // 更新收藏按钮
            updateFavoriteListBtnStatus();
        }, () => { });

        // 清空收藏数据
        clearTable(table_favoriteSubItems, () => { });

        // 更新我的标签收藏
        updateMyTagFavoriteTagHtml(() => {
            setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
        }, () => { });

        // 清空收藏折叠
        remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => { }, () => { });
    }
}

// 备份
favoriteExport.onclick = function () {
    var data = {};
    var count = 0;
    readAll(table_favoriteSubItems, (k, v) => {
        data[k] = v;
        count++;
    }, () => {
        if (count == 0) {
            alert("导出前，请先收藏标签");
            return;
        }

        var result = {
            count,
            data
        };

        func_eh_ex(() => {
            saveJSON(result, `EH收藏数据备份_${getCurrentDate(2)}.json`);
        }, () => {
            saveJSON(result, `EX收藏数据备份_${getCurrentDate(2)}.json`);
        });
    });
}

// 恢复
favoriteRecover.onclick = function () {
    favoriteUploadFiles.click();
}

// 上传
favoriteUploadFiles.onchange = function () {
    var resultFile = favoriteUploadFiles.files[0];
    if (resultFile) {
        var reader = new FileReader();
        reader.readAsText(resultFile, 'UTF-8');

        reader.onload = function (e) {
            var fileContent = e.target.result;

            // 判断是旧版本收藏列表，还是新版本收藏列表
            var favoriteDb = JSON.parse(fileContent);
            if (favoriteDb.data) {
                // 检查数据完整性
                if (favoriteDb.count == 0 || checkDictNull(favoriteDb.data)) {
                    alert('导入失败，备份数据为空');
                    return;
                }

                // 清空收藏列表数据
                clearTable(table_favoriteSubItems, () => {
                    // 清空收藏列表
                    favoriteListDiv.innerHTML = "";
                    // 重新生成
                    firstUpdateFavoriteSubItems(favoriteDb.data, favoriteDb.count);
                });

            } else {
                if (checkDictNull(favoriteDb)) {
                    alert('导入失败，备份数据为空');
                    return;
                }


                // 清空收藏列表数据
                clearTable(table_favoriteSubItems, () => {
                    // 清空收藏列表
                    favoriteListDiv.innerHTML = "";
                    // 重新生成收藏列表
                    reBuildFavoriteByOldData(favoriteDb);
                });
            }

            // 上传置空
            favoriteUploadFiles.value = "";
        }
    }
}

//#endregion