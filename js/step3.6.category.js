//#region step3.6.category.js 本地列表模块

// 折叠方法
function extendDiv(extendSpans, extendArray) {
    if (extendArray.length > 0) {
        for (const i in extendSpans) {
            if (Object.hasOwnProperty.call(extendSpans, i)) {
                const span = extendSpans[i];
                var parent_en = span.dataset.category;
                var itemDiv = document.getElementById("items_div_" + parent_en);
                if (extendArray.indexOf(parent_en) != -1) {
                    span.innerText = "+";
                    itemDiv.style.display = "none";
                } else {
                    span.innerText = "-";
                    itemDiv.style.display = "block";
                }
            }
        }
    } else {
        for (const i in extendSpans) {
            if (Object.hasOwnProperty.call(extendSpans, i)) {
                const span = extendSpans[i];
                var parent_en = span.dataset.category;
                var itemDiv = document.getElementById("items_div_" + parent_en);
                span.innerText = "-";
                itemDiv.style.display = "block";
            }
        }
    }

}

// 单个折叠、展开
function parentItemsExtend(extendSpans) {
    for (const i in extendSpans) {
        if (Object.hasOwnProperty.call(extendSpans, i)) {
            const item = extendSpans[i];
            item.addEventListener("click", function () {
                // 获取存储折叠信息
                read(table_Settings, table_Settings_key_CategoryList_Extend, result => {
                    var extendData = [];
                    if (result) {
                        extendData = result.value;
                    }

                    var cateDivName = item.dataset.category;
                    if (item.innerHTML == "+") {
                        // 需要展开
                        item.innerHTML = "-";
                        document.getElementById("items_div_" + cateDivName).style.display = "block";
                        if (extendData.indexOf(cateDivName) != -1) {
                            extendData.remove(cateDivName);
                        }
                    }
                    else {
                        // 需要折叠
                        item.innerHTML = "+";
                        document.getElementById("items_div_" + cateDivName).style.display = "none";
                        if (extendData.indexOf(cateDivName) == -1) {
                            extendData.push(cateDivName);
                        }
                    }

                    // 保存存储信息
                    var setting_categoryExtend = {
                        item: table_Settings_key_CategoryList_Extend,
                        value: extendData
                    }
                    update(table_Settings, setting_categoryExtend, () => {
                        // 通知折叠
                        setDbSyncMessage(sync_categoryList_Extend);
                    }, () => { });

                }, () => { });
            });
        }
    }
}

// 添加小项到搜索框
function addItemToInput(parent_en, parent_zh, sub_en, sub_zh, sub_desc) {
    if (searchItemDict[`${parent_en}:${sub_en}`] == undefined) {
        if (checkDictNull(searchItemDict)) {
            inputClearBtn.style.display = "block";
            searchBtn.innerText = "搜索";
        }

        var newSearchInputItem = document.createElement("span");
        newSearchInputItem.classList.add("input_item");
        newSearchInputItem.id = `input_item_${parent_en}_${sub_en}`;
        newSearchInputItem.title = sub_en;

        const key = `${parent_en}:${sub_en}`;
        newSearchInputItem.dataset.item = key;
        searchItemDict[key] = { parent_en, parent_zh, sub_en, sub_zh, sub_desc };

        var searchItemText = document.createTextNode(`${parent_zh} : ${sub_zh} X`);
        newSearchInputItem.appendChild(searchItemText);
        newSearchInputItem.addEventListener("click", removeSearchItem);
        readonlyDiv.appendChild(newSearchInputItem);

        addFavoritesBtn.style.display = "block";
        addFavoritesDisabledBtn.style.display = "none";

        // 滚动条滚动到底部
        searchInput.scrollTop = searchInput.scrollHeight;
    }
}


// 点击小项加入到搜索框
function cItemJsonSearchInput(cItems) {
    for (const i in cItems) {
        if (Object.hasOwnProperty.call(cItems, i)) {
            const searchItem = cItems[i];
            searchItem.addEventListener("click", function () {
                var parentEn = searchItem.dataset.parent_en;
                var parentZh = searchItem.dataset.parent_zh;
                var subDesc = searchItem.dataset.sub_desc;
                var enItem = searchItem.dataset.item;
                var zhItem = searchItem.innerHTML;
                addItemToInput(parentEn, parentZh, enItem, zhItem, subDesc);
            });
        }
    }
}

// 初始化本地列表页面，已存在数据
function categoryInit() {
    var complete1 = false;
    var complete2 = false;
    var complete3 = false;
    var complete4 = false;

    // 恋物列表模块
    read(table_Settings, table_Settings_key_FetishList_Html, result => {
        // 生成 html 代码
        // categoryList_fetishDiv.innerHTML = result.value;
        addInVirtualNode(categoryList_fetishDiv, result.value, () => {
            // 读取折叠并设置
            var extendSpans = document.getElementsByClassName("category_extend_fetish");
            read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
                if (extendResult) {
                    extendDiv(extendSpans, extendResult.value);
                }
                complete2 = true;
            }, () => { complete2 = true; });
            // 单个展开折叠
            parentItemsExtend(extendSpans);
            // 具体小项点击加入搜索框
            var cItems = document.getElementsByClassName("c_item_fetish");
            cItemJsonSearchInput(cItems);
            complete1 = true;
        });
    }, () => {
        complete1 = true;
        complete2 = true;
    });

    // EhTag列表模块
    read(table_Settings, table_Settings_key_EhTag_Html, result => {
        // 生成 html 代码
        // categoryList_ehTagDiv.innerHTML = result.value;
        addInVirtualNode(categoryList_ehTagDiv, result.value, () => {
            // 读取折叠并设置
            var extendSpans = document.getElementsByClassName("category_extend_ehTag");
            read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
                if (extendResult) {
                    extendDiv(extendSpans, extendResult.value);
                }
                complete4 = true;
            }, () => { complete4 = true; });
            // 单个展开折叠
            parentItemsExtend(extendSpans);
            // 具体小项点击加入搜索框
            var cItems = document.getElementsByClassName("c_item_ehTag");
            cItemJsonSearchInput(cItems);
            complete3 = true;
        });
    }, () => {
        complete3 = true;
        complete4 = true;
    });

    var t = setInterval(() => {
        if (complete1 && complete2 && complete3 && complete4) {
            t && clearInterval(t);
            // 隐藏等待div
            categoryLoadingDiv.style.display = "none";
            // 展示列表
            categoryEditor.style.display = "block";
            categoryListDiv.style.display = "block";
        }
    }, 10);
}

// 如果存在可用的词库的话，先尝试使用旧词库，然后比对版本号，看是否需要更新
function tryUseOldDataFirst(func_compelete) {
    indexDbInit(() => {

        // 验证数据完整性
        checkDataIntact(() => {
            // 判断是否存在旧数据
            var fetishHasValue = false;
            var ehTagHasValue = false;
            var complete1 = false;
            var complete2 = false;
            checkFieldEmpty(table_Settings, table_Settings_key_FetishList_Html, () => {
                complete1 = true;
            }, () => {
                fetishHasValue = true;
                complete1 = true;
            });
            checkFieldEmpty(table_Settings, table_Settings_key_EhTag_Html, () => {
                complete2 = true;
            }, () => {
                ehTagHasValue = true;
                complete2 = true;
            });

            var t = setInterval(() => {
                if ((complete1 && fetishHasValue) || (complete2 && ehTagHasValue)) {
                    t && clearInterval(t);
                    // 存在数据
                    categoryInit();
                    // 检查更新
                    checkUpdateData(() => {
                        // 存在更新
                        categoryInit();
                        // 表格标签翻译
                        tableTagTranslate();
                        func_compelete();
                    }, () => {
                        func_compelete();
                    });
                } else if (complete1 && complete2) {
                    t && clearInterval(t);
                    // 不存在数据
                    checkUpdateData(() => {
                        // 存在更新
                        categoryInit();
                        // 表格标签翻译
                        tableTagTranslate();
                        func_compelete();
                    }, () => {
                        func_compelete();
                    });
                }
            }, 10);
        });
    });
}


// 全部折叠
allCollapse.onclick = function () {
    var extendBtns = document.getElementsByClassName("category_extend");
    for (const i in extendBtns) {
        if (Object.hasOwnProperty.call(extendBtns, i)) {
            const btn = extendBtns[i];
            if (btn.innerHTML != "+") {
                btn.innerHTML = "+";
            }
        }
    }

    var categoryItemsDiv = document.getElementsByClassName("category_items_div");
    for (const i in categoryItemsDiv) {
        if (Object.hasOwnProperty.call(categoryItemsDiv, i)) {
            const div = categoryItemsDiv[i];
            if (div.style.display != "none") {
                div.style.display = "none";
            }
        }
    }

    // 存储全部父级
    var allParentDataArray = [];

    // 并更新存储全部的父级名称
    read(table_Settings, table_Settings_key_FetishList_ParentEnArray, fetishParentData => {
        allParentDataArray = fetishParentData.value;
        read(table_Settings, table_Settings_key_EhTag_ParentEnArray, ehTagParentData => {
            allParentDataArray = allParentDataArray.concat(ehTagParentData.value);
            // 存储全部
            var setting_categoryExtend = {
                item: table_Settings_key_CategoryList_Extend,
                value: allParentDataArray
            }
            update(table_Settings, setting_categoryExtend, () => {
                // 通知折叠
                setDbSyncMessage(sync_categoryList_Extend);
            }, () => { });
        }, () => { });
    }, () => { });
}

// 全部展开
allExtend.onclick = function () {
    var extendBtns = document.getElementsByClassName("category_extend");
    for (const i in extendBtns) {
        if (Object.hasOwnProperty.call(extendBtns, i)) {
            const btn = extendBtns[i];
            if (btn.innerHTML != "-") {
                btn.innerHTML = "-";
            }
        }
    }

    var categoryItemsDiv = document.getElementsByClassName("category_items_div");
    for (const i in categoryItemsDiv) {
        if (Object.hasOwnProperty.call(categoryItemsDiv, i)) {
            const div = categoryItemsDiv[i];
            if (div.style.display != "block") {
                div.style.display = "block";
            }
        }
    }

    // 清空折叠记录
    remove(table_Settings, table_Settings_key_CategoryList_Extend, () => {
        // 通知折叠
        setDbSyncMessage(sync_categoryList_Extend);
    }, () => { });
}

// 删除搜索框子项
function removeSearchItem(e) {
    var id = e.path[0].id;
    var item = document.getElementById(id);
    var cateItem = item.dataset.item;
    delete searchItemDict[cateItem];
    console.log(cateItem);
    console.log(searchItemDict);

    if (checkDictNull(searchItemDict)) {
        inputClearBtn.style.display = "none";
        searchBtn.innerText = "首页";
        addFavoritesBtn.style.display = "none";
        addFavoritesDisabledBtn.style.display = "block";
    }

    item.parentNode.removeChild(item);
}

//#endregion