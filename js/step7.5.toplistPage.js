//#region step7.5.toplistPage.js 排行榜

function toplistPage() {

    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        var parentDiv = ido[0];

        // 添加样式防止覆盖
        parentDiv.classList.add("t_toplist_ido");

        // 头部面包屑导航翻译
        var headLinks = parentDiv.firstElementChild.querySelectorAll("a");
        for (const i in headLinks) {
            if (Object.hasOwnProperty.call(headLinks, i)) {
                const link = headLinks[i];
                link.innerText = toplie_subtitle_dict[link.innerText];
            }
        }

        // 排行页 或 作品/上传者排名页
        var dcDiv = document.getElementsByClassName("dc");
        if (dcDiv.length > 0) {
            var dc = dcDiv[0];

            // 各项父级翻译
            var h2list = parentDiv.querySelectorAll("h2");
            for (const i in h2list) {
                if (Object.hasOwnProperty.call(h2list, i)) {
                    const h2 = h2list[i];
                    h2.innerText = toplist_parent_dict[h2.innerText];
                }
            }

            // 各项排行翻译
            var plist = parentDiv.querySelectorAll("p");
            for (const i in plist) {
                if (Object.hasOwnProperty.call(plist, i)) {
                    const p = plist[i];
                    if (p.innerText.indexOf("All-Time") != -1) {
                        p.lastChild.innerText = "总排行";
                    } else if (p.innerText.indexOf("Past Year") != -1) {
                        p.lastChild.innerText = "年排行";
                    } else if (p.innerText.indexOf("Past Month") != -1) {
                        p.lastChild.innerText = "月排行";
                    } else if (p.innerText.indexOf("Yesterday") != -1) {
                        p.lastChild.innerText = "日排行";
                    }
                }
            }

            // 删除全部分割线
            var hrlist = parentDiv.querySelectorAll("hr");
            for (const i in hrlist) {
                if (Object.hasOwnProperty.call(hrlist, i)) {
                    const hr = hrlist[i];
                    hr.parentNode.removeChild(hr);
                }
            }

            // 跨域
            crossDomain();

            // 作品标题翻译
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
            translateCheckbox.addEventListener("click", translateToplistPageTitle);
            var h2 = dc.firstElementChild;
            h2.appendChild(translateDiv);

            indexDbInit(() => {
                read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
                    if (result && result.value) {
                        translateCheckbox.setAttribute("checked", true);
                        translateToplistTitleDisplay();
                    }
                }, () => { });
            });

        } else {

            // 点击页面链接跳转
            // 1. 跳转到页面详情不管，detail.js 实现功能
            // 2. 跳转到上传页面不管，upload.js 实现功能
            // 3. 跳转到上传者排行页面，需要翻译
            // 4. 跳转到作品排行页面，需要翻译

            var search = window.location.search;
            if (search.indexOf("?tl=") != -1) {
                var pageNo = search.replace("?tl=", "");
                var bookRateArrayNo = ["11", "12", "13", "15"];
                if (bookRateArrayNo.indexOf(pageNo) != -1) {
                    // 作品排行页面
                    toplistBookRank();
                } else {
                    // 上传者排行页面
                    toplistUploaderRank();
                }
            }
        }
    }





}

// 翻译排行榜作品名称
function translateToplistPageTitle() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateFrontPageTitles = {
        item: table_Settings_key_TranslateFrontPageTitles,
        value: isChecked
    };

    indexDbInit(() => {
        update(table_Settings, settings_translateFrontPageTitles, () => {
            // 通知通知，翻译标题
            setDbSyncMessage(sync_googleTranslate_frontPage_title);
            translateToplistTitleDisplay();
        }, () => { });
    })
}


function translateToplistTitleDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    var titleDivs = document.getElementsByClassName("dc")[0].querySelectorAll("div.tun");
    if (isChecked) {
        // 翻译标题
        for (const i in titleDivs) {
            if (Object.hasOwnProperty.call(titleDivs, i)) {
                const a = titleDivs[i].firstElementChild;
                if (a.dataset.translate) {
                    // 已经翻译过
                    a.innerText = a.dataset.translate;

                } else {
                    // 需要翻译
                    a.title = a.innerText;

                    // 单条翻译
                    translatePageElementFunc(a, true, () => {
                        a.dataset.translate = a.innerText;
                    });
                }
            }
        }

    } else {
        // 显示原文
        for (const i in titleDivs) {
            if (Object.hasOwnProperty.call(titleDivs, i)) {
                const a = titleDivs[i].firstElementChild;
                if (a.title) {
                    a.innerText = a.title;
                }
            }
        }
    }
}



// 上传者排行页面
function toplistUploaderRank() {
    var itg = document.getElementsByClassName("itg");
    if (itg.length > 0) {
        var rankTable = itg[0];
        var tableThs = rankTable.querySelectorAll("th");
        for (const i in tableThs) {
            if (Object.hasOwnProperty.call(tableThs, i)) {
                const th = tableThs[i];
                if (th.classList.contains("hr")) {
                    th.innerText = "排名";
                } else if (th.classList.contains("hs")) {
                    th.innerText = "分数";
                } else if (th.classList.contains("hn")) {
                    th.innerText = "上传者";
                }
            }
        }
    }
}

// 作品排行页面
function toplistBookRank() {
    // 跨域
    crossDomain();

    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        var toppane = ido[0];
        toppane.classList.add("t_toplist_bookrage");

        // 标题机翻
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
        translateCheckbox.addEventListener("click", translateMainPageTitle);
        toppane.insertBefore(translateDiv, toppane.lastChild);

        // 头部添加词库升级提示
        var dataUpdateDiv = document.createElement("div");
        dataUpdateDiv.id = "data_update_tip";
        var dataUpdateText = document.createTextNode("词库升级中...");
        dataUpdateDiv.appendChild(dataUpdateText);
        toppane.insertBefore(dataUpdateDiv, toppane.lastChild);

        // 表头翻译
        toplistBookRateTableHeadTranslate();

        // 作品类型翻译
        bookTypeTranslate();

        // 作品篇幅
        toplistBookpages();

        indexDbInit(() => {
            // 谷歌机翻标题
            read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
                if (result && result.value) {
                    translateCheckbox.setAttribute("checked", true);
                    translateMainPageTitleDisplay();
                }
            }, () => { });

            // 检查是否存在旧数据，如果存在优先使用旧数据，然后检查更新
            // 表格标签翻译
            toplistBookRateTryUseOldData();
        });

        // 同步谷歌机翻标题
        DataSyncCommonTranslateTitle();
    }



}

// 作品排行页面，翻译表头
function toplistBookRateTableHeadTranslate() {
    var table = document.getElementsByClassName("itg");
    if (table.length > 0) {
        var theads = table[0].querySelectorAll("th");

        for (const i in theads) {
            if (Object.hasOwnProperty.call(theads, i)) {
                const th = theads[i];
                th.innerText = thData[th.innerText] ?? th.innerText;
            }
        }

        // 删除第一个表头的跨列属性，然后追加表头
        var firstTh = theads[0];
        firstTh.removeAttribute("colspan");
        firstTh.innerText = "排名";

        var bookTypeTh = document.createElement("th");
        bookTypeTh.innerText = "作品类型";
        firstTh.parentNode.insertBefore(bookTypeTh, firstTh.nextElementSibling);
    }
}

//  作品排行页面，获取词库数据
function toplistBookRateTryUseOldData() {
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
                toplistTableTagTranslate();
                // 检查更新
                checkUpdateData(() => {
                    // 存在更新
                    toplistTableTagTranslate();
                }, () => { });
            } else if (complete1 && complete2) {
                t && clearInterval(t);
                // 不存在数据
                checkUpdateData(() => {
                    // 存在更新
                    toplistTableTagTranslate();
                }, () => {
                    toplistTableTagTranslate();
                });
            }
        }, 10);
    });
}

// 表格标签翻译
function toplistTableTagTranslate() {
    // 父项:子项，偶尔出现单个子项
    var gt = document.getElementsByClassName("gt");
    function translate(gt, i) {
        const item = gt[i];
        if (!item.dataset.title) {
            item.dataset.title = item.title;
        }
        var ps_en = item.dataset.title;
        read(table_EhTagSubItems, ps_en, result => {
            if (result) {
                // 父子项
                item.innerText = `${result.parent_zh}:${result.sub_zh}`;
                if (result.sub_desc) {
                    item.title = `${item.title}\r\n${result.sub_desc}`;
                }
            } else {
                // 没有找到，翻译父项，子项保留
                var array = ps_en.split(":");
                if (array.length == 2) {
                    var parent_en = array[0];
                    var sub_en = array[1];
                    read(table_detailParentItems, parent_en, result => {
                        if (result) {
                            item.innerText = `${result.name}:${sub_en}`;
                            if (result.sub_desc) {
                                item.title = `${item.title}\r\n${result.sub_desc}`;
                            }
                        }
                    }, () => { });
                }
            }
        }, () => { });
    }
    for (const i in gt) {
        if (Object.hasOwnProperty.call(gt, i)) {
            translate(gt, i);
        }
    }
}

// 作品篇幅
function toplistBookpages() {
    // 标题 + 悬浮图 + 标签
    var tdPages = document.getElementsByClassName("glhide");
    for (const i in tdPages) {
        if (Object.hasOwnProperty.call(tdPages, i)) {
            const td = tdPages[i];
            innerTextPageToYe(td.lastChild);
        }
    }
}

//#endregion