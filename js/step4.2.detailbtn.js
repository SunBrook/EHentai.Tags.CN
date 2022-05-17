//#region step4.2.detailbtn.js 详情页主要按钮功能

// 详情页选中的标签信息
var detailCheckedDict = {};

// 谷歌机翻
function translateDetailPageTitle() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateDetailPageTitles = {
        item: table_Settings_key_TranslateDetailPageTitles,
        value: isChecked
    };
    update(table_Settings, settings_translateDetailPageTitles, () => {
        setDbSyncMessage(sync_googleTranslate_detailPage_title);
        translateDetailPageTitleDisplay();
    }, () => { });
}

function translateDetailPageTitleDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    var h1 = document.getElementById("h1Origin_copy");
    if (!h1.innerText) {
        h1 = document.getElementById("h1Title_copy");;
    }

    var signDictArray = [];
    var txtArray = [];
    var translateDict = {};
    var specialChars = [
        '(', ')', '（', '）',
        '[', ']', '【', '】',
        '{', '}', '｛', '｝',
        '<', '>', '《', '》',
        '|', '&', '!', '@', '#', '$', '￥', '%', '^', '*', '`', '~', ' '
    ];

    if (isChecked) {
        // 翻译标题
        if (h1.dataset.translate) {
            // 已经翻译过
            h1.innerText = h1.dataset.translate;
        } else {
            // 需要翻译
            h1.title = h1.innerText;

            var cstr = '';
            for (let i = 0; i < h1.title.length; i++) {
                const c = h1.title[i];

                if (specialChars.indexOf(c) != -1) {
                    signDictArray.push({ i, c });
                    if (cstr != '') {
                        txtArray.push(cstr);
                        cstr = '';
                    }
                } else {
                    cstr += c;
                }
            }

            if (cstr != '') {
                txtArray.push(cstr);
            }

            console.log(txtArray);
            console.log(signDictArray);

            var totalCount = txtArray.length;
            var indexCount = 0;
            for (const i in txtArray) {
                if (Object.hasOwnProperty.call(txtArray, i)) {
                    const text = txtArray[i];
                    getTranslate(text, i);
                }
            }

            function getTranslate(text, i) {
                getGoogleTranslate(text, function (data) {
                    var sentences = data.sentences;
                    var longtext = '';
                    for (const i in sentences) {
                        if (Object.hasOwnProperty.call(sentences, i)) {
                            const sentence = sentences[i];
                            longtext += sentence.trans;
                        }
                    }
                    translateDict[i] = longtext;
                    indexCount++;
                });
            }

            var t = setInterval(() => {
                if (totalCount == indexCount) {
                    t && clearInterval(t);
                    translateCompelete();
                }
            }, 50);

            function translateCompelete() {
                console.log(translateDict);
                if (signDictArray.length == 0 && txtArray.length > 0) {
                    // 纯文字
                    var str = '';
                    for (const i in translateDict) {
                        if (Object.hasOwnProperty.call(translateDict, i)) {
                            str += translateDict[i];
                        }
                    }
                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;

                } else if (signDictArray.length > 0 && txtArray.length == 0) {
                    // 纯符号
                    var str = '';
                    for (const i in signDictArray) {
                        if (Object.hasOwnProperty.call(signDictArray, i)) {
                            const item = signDictArray[i];
                            str += item.c;
                        }
                    }
                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;

                } else if (signDictArray.length > 0 || txtArray.length > 0) {
                    // 文字 + 符号
                    var signIndex = 0;
                    var translateIndex = 0;
                    var str = '';
                    var lastSignIndex = -2;
                    if (signDictArray[0].i == 0) {
                        // 符号在前
                        while (signIndex < signDictArray.length ||
                            translateIndex < txtArray.length) {
                            // 符号索引间隔是否为1
                            if (signIndex < signDictArray.length) {
                                str += signDictArray[signIndex].c;
                                lastSignIndex = signDictArray[signIndex].i;
                                signIndex++;
                            }

                            if (signDictArray[signIndex] && signDictArray[signIndex].i == lastSignIndex + 1) {
                                // 符号连续
                                continue;
                            }

                            if (translateIndex < txtArray.length) {
                                str += translateDict[translateIndex];
                                translateIndex++;
                            }
                        }
                    } else {
                        // 文字在前 
                        while (signIndex < signDictArray.length ||
                            translateIndex < txtArray.length) {
                            // 符号索引间隔是否为1
                            if (signDictArray[signIndex] && signDictArray[signIndex].i == lastSignIndex + 1) {
                                // 符号连续
                                if (signIndex < signDictArray.length) {
                                    str += signDictArray[signIndex].c;
                                    lastSignIndex = signDictArray[signIndex].i;
                                    signIndex++;
                                }
                                continue;
                            }

                            if (translateIndex < txtArray.length) {
                                str += translateDict[translateIndex];
                                translateIndex++;
                            }

                            if (signIndex < signDictArray.length) {
                                str += signDictArray[signIndex].c;
                                lastSignIndex = signDictArray[signIndex].i;
                                signIndex++;
                            }
                        }
                    }

                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;
                }
            }
        }

    } else {
        // 显示原文
        if (h1.title) {
            h1.innerText = h1.title;
        }
    }
}

function detailPageTitleCopy() {
    var gd2 = document.getElementById("gd2");

    var h1Title = document.getElementById("gn");
    h1Title.style.display = "none";

    var h1Title_copy = document.createElement("h1");
    h1Title_copy.id = "h1Title_copy";
    h1Title_copy.innerText = h1Title.innerText;
    gd2.appendChild(h1Title_copy);

    var h1Origin = document.getElementById("gj");
    h1Origin.style.display = "none";

    var h1Origin_copy = document.createElement("h1");
    h1Origin_copy.id = "h1Origin_copy";
    h1Origin_copy.innerText = h1Origin.innerText;
    gd2.appendChild(h1Origin_copy);


}

// 右侧按钮
function detailPageRightButtons() {
    // 右侧操作列
    var rightDiv = document.getElementById("gd5");

    // 标签谷歌机翻按钮
    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    translateDiv.appendChild(translateCheckbox);
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻 : 标题";

    translateDiv.appendChild(translateLabel);
    rightDiv.appendChild(translateDiv);
    translateCheckbox.addEventListener("click", translateDetailPageTitle);

    // 读取是否选中
    indexDbInit(() => {
        read(table_Settings, table_Settings_key_TranslateDetailPageTitles, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateDetailPageTitleDisplay();
            }
        }, () => { });
    });

    // 清空选择按钮
    var clearBtn = document.createElement("div");
    clearBtn.id = "div_ee8413b2_detail_clearBtn";
    var clearTxt = document.createTextNode("清空选择");
    clearBtn.appendChild(clearTxt);
    clearBtn.addEventListener("click", categoryCheckClear);
    rightDiv.appendChild(clearBtn);

    // 加入收藏按钮
    var addFavoriteBtn = document.createElement("div");
    addFavoriteBtn.id = "div_ee8413b2_detail_addFavoriteBtn";
    var addFavoriteTxt = document.createTextNode("加入收藏");
    addFavoriteBtn.appendChild(addFavoriteTxt);
    addFavoriteBtn.addEventListener("click", categoryAddFavorite);
    rightDiv.appendChild(addFavoriteBtn);

    // 查询按钮
    var searchBtn = document.createElement("div");
    searchBtn.id = "div_ee8413b2_detail_searchBtn";
    var searchBtnTxt = document.createTextNode("搜索");
    searchBtn.appendChild(searchBtnTxt);
    searchBtn.addEventListener("click", categorySearch);
    rightDiv.appendChild(searchBtn);

    // 详情页右侧标签样式修改
    var rightP = rightDiv.querySelectorAll("p");
    for (const i in rightP) {
        if (Object.hasOwnProperty.call(rightP, i)) {
            const p = rightP[i];
            p.classList.remove("gsp");
        }
    }

    // 清空选择
    function categoryCheckClear() {
        for (const ps_en in detailCheckedDict) {
            if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
                var parentDiv = document.getElementById(`td_${ps_en.replace(new RegExp(/( )/g), "_")}`);
                parentDiv.classList.remove("div_ee8413b2_category_checked");
            }
        }

        detailCheckedDict = {};
        hideDetailBtn();
    }

    // 隐藏按钮
    function hideDetailBtn() {
        clearBtn.style.display = "none";
        addFavoriteBtn.style.display = "none";
        searchBtn.style.display = "none";
    }

    // 加入收藏
    function categoryAddFavorite() {
        addFavoriteBtn.innerText = "收藏中...";

        var favoriteDict = {};
        var favoriteCount = 0;
        var checkDictCount = 0;
        var indexCount = 0;
        // 先从 收藏表中查询，是否存在，如果存在则不添加
        // 再从 EhTag表中查询，看是否存在，如果不存则更新父级 + 子级同名
        // 最后批量插入收藏表中，然后通知其他页面进行同步
        for (const ps_en in detailCheckedDict) {
            if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
                const item = detailCheckedDict[ps_en];
                read(table_favoriteSubItems, ps_en, favoriteResult => {
                    if (!favoriteResult) {
                        // 收藏表不存在
                        read(table_EhTagSubItems, ps_en, ehTagResult => {
                            if (ehTagResult) {
                                // Ehtag表存在
                                favoriteDict[ps_en] = {
                                    parent_en: ehTagResult.parent_en,
                                    parent_zh: ehTagResult.parent_zh,
                                    sub_en: ehTagResult.sub_en,
                                    sub_zh: ehTagResult.sub_zh,
                                    sub_desc: ehTagResult.sub_desc
                                };
                                favoriteCount++;
                                indexCount++;
                            } else {
                                // EhTag表不存在
                                read(table_detailParentItems, item.parent_en, parentResult => {
                                    if (parentResult) {
                                        // 父级存在
                                        favoriteDict[ps_en] = {
                                            parent_en: parentResult.row,
                                            parent_zh: parentResult.name,
                                            sub_en: item.sub_en,
                                            sub_zh: item.sub_en,
                                            sub_desc: ''
                                        };
                                        favoriteCount++;
                                        indexCount++;
                                    } else {
                                        // 父级不存在
                                        var custom_parent_en = 'userCustom';
                                        var custom_sub_en = item.parent_en;
                                        var custom_ps_en = `${custom_parent_en}:${custom_sub_en}`;
                                        // 再查收藏表是否存在
                                        read(table_favoriteSubItems, custom_ps_en, customFavoriteResult => {
                                            if (!customFavoriteResult) {
                                                // 不存在
                                                favoriteDict[custom_ps_en] = {
                                                    parent_en: custom_parent_en,
                                                    parent_zh: '自定义',
                                                    sub_en: item.sub_en,
                                                    sub_zh: item.sub_en,
                                                    sub_desc: ''
                                                };
                                                favoriteCount++;
                                            }
                                            indexCount++;
                                        }, () => { indexCount++; });
                                    }
                                }, () => { indexCount++; });
                            }
                        }, () => { indexCount++; });
                    } else {
                        indexCount++;
                    }
                }, () => { indexCount++; });
                checkDictCount++;
            }
        }

        var t = setInterval(() => {
            if (indexCount == checkDictCount) {
                t && clearInterval(t);
                // 批量插入新增收藏，完成后通知同步
                batchAddFavoriteAndMessage();
            }
        }, 50);


        function batchAddFavoriteAndMessage() {
            batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, favoriteDict, favoriteCount, () => {
                // 更新我的标签收藏
                updateMyTagFavoriteTagHtml(() => {
                    setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                }, () => { });

                // 读取收藏表，更新收藏列表html
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

                    // 存储收藏 Html
                    var settings_favoriteList_html = {
                        item: table_Settings_key_FavoriteList_Html,
                        value: favoritesListHtml
                    };
                    update(table_Settings, settings_favoriteList_html, () => {
                        // localstroage 消息通知
                        setDbSyncMessage(sync_favoriteList);
                        // 显示完成
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "完成 √";
                        }, 250);
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "加入收藏";
                        }, 500);
                    }, () => {
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "完成 ×";
                        }, 250);
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "加入收藏";
                        }, 500);
                    });
                });
            });
        }


    }

    // 搜索
    function categorySearch() {
        var searchArray = [];
        for (const ps_en in detailCheckedDict) {
            if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
                searchArray.push(`"${ps_en}"`);
            }
        }

        // 构建请求链接
        var searchLink = `${window.location.origin}/?f_search=${searchArray.join("+")}`;
        window.location.href = searchLink;
    }
}

// 标签翻译
function detailPageTagTranslate() {

    // 左侧作品语种
    var trList = document.getElementById("gdd").querySelectorAll("tr");
    var language = trList[3].lastChild.innerText.toLowerCase().replace(/(\s*$)/g, "");
    readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, language, result => {
        trList[3].lastChild.innerText = result.sub_zh;
    }, () => { });

    // 翻译标签父级
    var tcList = document.getElementsByClassName("tc");
    for (const i in tcList) {
        if (Object.hasOwnProperty.call(tcList, i)) {
            const tc = tcList[i];
            if (!tc.dataset.parent_en) {
                tc.dataset.parent_en = tc.innerText.replace(":", "");
            }
            var parentEn = tc.dataset.parent_en;
            read(table_detailParentItems, parentEn, result => {
                if (result) {
                    tc.innerText = `${result.name}:`;
                }
            }, () => { });
        }
    }

    // 翻译标签子项
    var aList = document.getElementById("taglist").querySelectorAll("a");
    for (const i in aList) {
        if (Object.hasOwnProperty.call(aList, i)) {
            const a = aList[i];

            // 查询父级和子级
            var splitStr = a.id.split("ta_")[1].split(":");
            var parent_en = splitStr[0];
            var sub_en;
            var parentId;

            if (splitStr.length == 2) {
                sub_en = splitStr[1].replace(new RegExp(/(_)/g), " ");
                parentId = `td_${parent_en}:${sub_en}`;
            } else {
                sub_en = parent_en;
                parent_en = "temp";
                parentId = `td_${sub_en}`;
            }

            a.dataset.ps_en = `${parent_en}:${sub_en}`;
            a.dataset.parent_en = parent_en;
            a.dataset.sub_en = sub_en;
            a.dataset.parent_id = parentId;

            // 点击添加事件，附带颜色
            a.addEventListener("click", detailCategoryClick);
            // 翻译标签
            read(table_EhTagSubItems, a.dataset.ps_en, result => {
                if (result) {
                    a.innerText = result.sub_zh;
                    a.title = `${result.sub_en}\r\n${result.sub_desc}`;
                }
            }, () => { });
        }
    }

}

// 标签选中事件
function detailCategoryClick(e) {
    var dataset = e.target.dataset;
    var parentId = dataset.parent_id;
    var ps_en = dataset.ps_en;
    var parent_en = dataset.parent_en;
    var sub_en = dataset.sub_en;

    var parentDiv = document.getElementById(`${parentId.replace(new RegExp(/( )/g), "_")}`);
    // 标签颜色改为黄色
    var alink = parentDiv.querySelectorAll("a")[0];
    if (alink.style.color == "blue") {
        func_eh_ex(() => {
            alink.style.color = "darkorange";
        }, () => {
            alink.style.color = "yellow";
        })
    }
    else {
        alink.style.color = "";
    }

    if (!detailCheckedDict[ps_en]) {
        // 添加选中
        detailCheckedDict[ps_en] = { parent_en, sub_en };
        parentDiv.classList.add("div_ee8413b2_category_checked");
    } else {
        // 移除选中
        delete detailCheckedDict[ps_en];
        parentDiv.classList.remove("div_ee8413b2_category_checked");
    }

    var clearBtn = document.getElementById("div_ee8413b2_detail_clearBtn");
    var addFavoriteBtn = document.getElementById("div_ee8413b2_detail_addFavoriteBtn");
    var searchBtn = document.getElementById("div_ee8413b2_detail_searchBtn");

    // 检查如果没有一个选中的，隐藏操作按钮
    if (checkDictNull(detailCheckedDict)) {
        clearBtn.style.display = "none";
        addFavoriteBtn.style.display = "none";
        searchBtn.style.display = "none";
    }
    else {
        clearBtn.style.display = "block";
        addFavoriteBtn.style.display = "block";
        searchBtn.style.display = "block";
    }
}

// 尝试使用旧版的词库，然后检查更新
function detailTryUseOldData() {
    indexDbInit(() => {
        // 验证数据完整性
        checkDataIntact(() => {
            // 判断是否存在旧数据
            var fetishHasValue = false;
            var ehTagHasValue = false;
            var complete1 = false;
            var complete2 = false;

            checkTableEmpty(table_fetishListSubItems, () => {
                // 数据为空
                complete1 = true;
            }, () => {
                // 存在数据
                fetishHasValue = true;
                complete1 = true;
            });

            checkTableEmpty(table_EhTagSubItems, () => {
                // 数据为空
                complete2 = true;
            }, () => {
                // 存在数据
                ehTagHasValue = true;
                complete2 = true;
            });

            var t = setInterval(() => {
                if ((complete1 && fetishHasValue) || (complete2 && ehTagHasValue)) {
                    t && clearInterval(t);
                    // 存在数据
                    detailPageTagTranslate();
                    // 检查更新
                    checkUpdateData(() => {
                        // 存在更新
                        detailPageTagTranslate();
                    }, () => { });
                } else if (complete1 && complete2) {
                    t && clearInterval(t);
                    // 不存在数据
                    checkUpdateData(() => {
                        // 存在更新
                        detailPageTagTranslate();
                    }, () => {
                        detailPageTagTranslate();
                    });
                }
            }, 10);
        });
    })
}

//#endregion