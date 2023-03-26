//#region step3.7.search.js 搜索框功能

// 进入页面，根据地址栏信息生成搜索栏标签
function readSearchParentAndInput(parentEn, subEn) {
    read(table_detailParentItems, parentEn, result => {
        if (result) {
            addItemToInput(result.row, result.name, subEn, subEn, '');
        } else {
            addItemToInput(parentEn, parentEn, subEn, subEn, '');
        }
    }, () => {
        addItemToInput(parentEn, parentEn, subEn, subEn, '');
    });
}

var searchParam = GetQueryString("f_search");
if (searchParam) {
    // 如果最后一位是加号，则把加号去掉
    if (searchParam.charAt(searchParam.length - 1) == "+") {
        searchParam = searchParam.slice(0, searchParam.length - 1);
    }
}
if (searchParam) {
    if (searchParam.indexOf("%20") != -1) {
        // 需要转义
        searchParam = urlDecode(searchParam);
    } else {
        searchParam = searchParam.replace(/\%3A/g, ':');
        searchParam = searchParam.replace(/\"\+\"/g, '"$"');
        searchParam = searchParam.replace(/\+/g, " ");
        searchParam = searchParam.replace(/\"\$\"/g, '"+"');
    }

    var f_searchs = searchParam;
    if (f_searchs && f_searchs != "null") {
        var searchArray = f_searchs.split("+");
        for (const i in searchArray) {
            if (Object.hasOwnProperty.call(searchArray, i)) {

                var items = searchArray[i].replace(/\+/g, " ").replace(/\"/g, "");
                var itemArray = items.split(":");
                searchItem(itemArray);

                function searchItem(itemArray) {
                    if (itemArray.length == 2) {
                        var parentEn = itemArray[0];
                        var subEn = itemArray[1];

                        // 判断是否是上传者
                        if (parentEn == "uploader") {
                            addItemToInput("uploader", "上传者", subEn, subEn, '');
                        } else {
                            // 从EhTag中查询，看是否存在
                            read(table_EhTagSubItems, items, ehTagData => {
                                if (ehTagData) {
                                    addItemToInput(ehTagData.parent_en, ehTagData.parent_zh, ehTagData.sub_en, ehTagData.sub_zh, ehTagData.sub_desc);
                                } else {
                                    // 尝试翻译父级
                                    readSearchParentAndInput(parentEn, subEn);
                                }
                            }, () => {
                                // 尝试翻译父级
                                readSearchParentAndInput(parentEn, subEn);
                            });
                        }
                    }
                    else {
                        console.log(itemArray);
                        // 从恋物列表中查询，看是否存在
                        readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, itemArray[0], fetishData => {
                            if (fetishData) {
                                addItemToInput(fetishData.parent_en, fetishData.parent_zh, fetishData.sub_en, fetishData.sub_zh, fetishData.sub_desc);
                            } else {
                                // 用户自定义搜索关键字
                                addItemToInput("userCustom", "自定义", itemArray[0], itemArray[0], '');
                            }
                        }, () => {
                            // 用户自定义搜索关键字
                            addItemToInput("userCustom", "自定义", itemArray[0], itemArray[0], '');
                        });
                    }
                }
            }
        }
    }
}


// 删除搜索框子项
function removeSearchItem(e) {
    var id = e.srcElement.id;
    var item = document.getElementById(id);
    var cateItem = item.dataset.item;
    delete searchItemDict[cateItem];
    console.log(cateItem);
    console.log(searchItemDict);

    if (checkDictNull(searchItemDict)) {
        inputClearBtn.style.display = "none";
        searchBtn.innerText = "全部";
        addFavoritesBtn.style.display = "none";
        addFavoritesDisabledBtn.style.display = "block";
    }

    item.parentNode.removeChild(item);
}

// 清空选择
inputClearBtn.onclick = function () {
    searchItemDict = {};
    readonlyDiv.innerHTML = "";
    inputClearBtn.style.display = "none";
    searchBtn.innerText = "全部";
    addFavoritesBtn.style.display = "none";
    addFavoritesDisabledBtn.style.display = "block";
}

// 搜索包含父级
function SearchWithParentEn(fetishParentArray) {
    var enItemArray = [];
    for (const i in searchItemDict) {
        if (Object.hasOwnProperty.call(searchItemDict, i)) {
            var item = searchItemDict[i];
            if (fetishParentArray.indexOf(item.parent_en) != -1) {
                enItemArray.push(`"${item.sub_en}"`);
            }
            else if (item.parent_en == "userCustom") {
                enItemArray.push(`"${item.sub_en}"`);
            } else {
                enItemArray.push(`"${item.parent_en}:${item.sub_en}"`);
            }
        }
    }
    searchBtn.innerText = "···";
    // 构建请求链接
    var searchLink = `${window.location.origin}${window.location.pathname}?f_search=${enItemArray.join("+")}`;
    window.location.href = searchLink;
}

// 搜索只有子级
function SearchWithoutParentEn() {
    var enItemArray = [];
    for (const i in searchItemDict) {
        if (Object.hasOwnProperty.call(searchItemDict, i)) {
            var item = searchItemDict[i];
            if (item.parent_en == "userCustom") {
                enItemArray.push(`"${item.sub_en}"`);
            } else if (enItemArray.indexOf(item.sub_en) == -1) {
                enItemArray.push(`"${item.sub_en}"`);
            }
        }
    }
    searchBtn.innerText = "···";
    // 构建请求链接
    var searchLink = `${window.location.origin}${window.location.pathname}?f_search=${enItemArray.join("+")}`;
    window.location.href = searchLink;
}

// 搜索按钮 or 全部按钮
searchBtn.onclick = function () {
    if (searchBtn.innerText == "全部") {
        searchBtn.innerText = "···";
        window.location.href = `${window.location.origin}${window.location.pathname}`;
    }
    else if (searchBtn.innerText == "搜索") {
        read(table_Settings, table_Settings_key_FetishList_ParentEnArray, fetishParentResult => {
            if (fetishParentResult) {
                SearchWithParentEn(fetishParentResult.value);
            } else {
                SearchWithoutParentEn();
            }
        }, () => {
            SearchWithoutParentEn();
        });
    }
}

// 搜索按钮，点击后如果鼠标悬浮指针改为转圈
searchBtn.onmouseover = function () {
    if (searchBtn.innerText == "···") {
        searchBtn.style.cursor = "wait";
    }
}

// 鼠标悬浮显示输入框
searchInput.onmouseover = function () {
    if (userInput.value == "") {
        userInput.classList.add("user_input_null_backcolor");
    } else {
        userInput.classList.add("user_input_value_backColor");
    }

}

// 鼠标移出移除输入框
searchInput.onmouseout = function () {
    if (userInput.value == "") {
        userInput.classList.remove("user_input_null_backcolor");
        userInput.classList.remove("user_input_value_backColor");
    }
}

// 输入框输入时候选
userInput.oninput = function () {
    var inputValue = trimStartEnd(userInput.value.toLowerCase());
    userInputOnInputEvent(inputValue);
}

function userInputOnInputEvent(inputValue) {
    // 清空候选项
    userInputRecommendDiv.innerHTML = "";
    userInputRecommendDiv.style.display = "block";
    var tempDiv = document.createElement("div");
    userInputRecommendDiv.appendChild(tempDiv);

    if (inputValue == "") {
        userInputRecommendDiv.style.display = "none";
        return;
    }



    // 添加搜索候选
    function addInputSearchItems(foundArrays) {
        for (const i in foundArrays) {
            if (Object.hasOwnProperty.call(foundArrays, i)) {
                const item = foundArrays[i];
                var commendDiv = document.createElement("div");
                commendDiv.classList.add("category_user_input_recommend_items");
                commendDiv.title = item.sub_desc;

                var chTextDiv = document.createElement("div");
                chTextDiv.style.float = "left";
                var chTextNode = document.createTextNode(`${item.parent_zh} : ${item.sub_zh}`);
                chTextDiv.appendChild(chTextNode);

                var enTextDiv = document.createElement("div");
                enTextDiv.style.float = "right";
                var enTextNode = document.createTextNode(`${item.parent_en} : ${item.sub_en}`);
                enTextDiv.appendChild(enTextNode);

                commendDiv.appendChild(chTextDiv);
                commendDiv.appendChild(enTextDiv);

                commendDiv.addEventListener("click", function () {
                    addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh, item.sub_desc);
                    userInputRecommendDiv.innerHTML = "";
                    userInput.value = "";
                    userInput.focus();
                });
                tempDiv.appendChild(commendDiv);
            }
        }
    }

    // 从恋物表中模糊搜索，绑定数据
    readByCursorIndexFuzzy(table_fetishListSubItems, table_fetishListSubItems_index_searchKey, inputValue, foundArrays => {
        addInputSearchItems(foundArrays);
    });

    // 从EhTag中模糊搜索，绑定数据
    readByCursorIndexFuzzy(table_EhTagSubItems, table_EhTagSubItems_index_searchKey, inputValue, foundArrays => {
        addInputSearchItems(foundArrays);
    });

    // 从收藏中的用户自定义中模糊搜索，绑定数据
    readByCursorIndex(table_favoriteSubItems, table_favoriteSubItems_index_parentEn, "userCustom", customArray => {
        if (customArray.length > 0) {
            var foundArrays = [];
            for (const i in customArray) {
                if (Object.hasOwnProperty.call(customArray, i)) {
                    const item = customArray[i];
                    var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en.toLowerCase()}`;
                    if (searchKey.indexOf(inputValue) != -1) {
                        foundArrays.push(item);
                    }
                }
            }

            if (foundArrays.length > 0) {
                addInputSearchItems(foundArrays);
            }
        }
    });

    // 从收藏中的上传者自定义中模糊搜索，绑定数据
    readByCursorIndex(table_favoriteSubItems, table_favoriteSubItems_index_parentEn, "uploader", uploaderArray => {
        if (uploaderArray.length > 0) {
            var foundArrays = [];
            for (const i in uploaderArray) {
                if (Object.hasOwnProperty.call(uploaderArray, i)) {
                    const item = uploaderArray[i];
                    var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en.toLowerCase()}`;
                    if (searchKey.indexOf(inputValue) != -1) {
                        foundArrays.push(item);
                    }
                }
            }

            if (foundArrays.length > 0) {
                addInputSearchItems(foundArrays);
            }
        }
    });

}

// 输入框检测回车事件
userInput.onkeydown = function (e) {
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        userInputEnter();
    }
}

userInputEnterBtn.onclick = userInputEnter;

function userInputEnter() {
    var inputValue = userInput.value.replace(/(^\s*)|(\s*$)/g, '');
    if (!inputValue) return;


    var recommendItems = document.getElementsByClassName("category_user_input_recommend_items");
    if (recommendItems.length > 0) {
        // 从候选下拉列表中匹配，如果有相同的，使用匹配内容，否则直接新增自定义文本
        var isFound = false;
        for (const i in recommendItems) {
            if (Object.hasOwnProperty.call(recommendItems, i)) {
                const recommendItem = recommendItems[i];
                var zhDiv = recommendItem.firstChild;
                var enDiv = recommendItem.lastChild;
                var zhArray = zhDiv.innerText.split(" : ");
                var enArray = enDiv.innerText.split(" : ");
                var sub_zh = zhArray[1];
                var sub_en = enArray[1];
                var sub_desc = recommendItem.title;
                if (sub_zh == inputValue || sub_en == inputValue) {
                    // 符合条件
                    var parent_zh = zhArray[0];
                    var parent_en = enArray[0];
                    addItemToInput(parent_en, parent_zh, sub_en, sub_zh, sub_desc);
                    isFound = true;
                    break;
                }
            }
        }

        if (!isFound) {
            // 没有找到符合条件的
            addItemToInput("userCustom", "自定义", inputValue, inputValue, '');
        }

    } else {
        // 如果没有下拉列表，直接新增自定义文本
        addItemToInput("userCustom", "自定义", inputValue, inputValue, '');
    }

    // 清空文本框
    userInput.value = "";
    userInputRecommendDiv.style.display = "none";
}

//#endregion