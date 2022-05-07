//#region step7.7.newsPage.js

var newsPageTranslateIsReady = false; // 翻译前是否准备完毕

function newsPage() {
    // 跨域
    crossDomain();

    // 添加样式方便调整页面样式
    var newsouter = document.getElementById("newsouter");
    newsouter.classList.add("t_newspage_souter");

    var nb = document.getElementById("nb");

    // 头部图片隐藏折叠按钮
    var baredge = document.getElementsByClassName("baredge")[0];
    var bartop = document.getElementsByClassName("bartop")[0];
    var botm = document.getElementById("botm");
    var botmHeight = botm.clientHeight;

    var imgHiddenBtn = document.createElement("div");
    imgHiddenBtn.style.display = "none";
    imgHiddenBtn.id = "imgHiddenBtn";
    imgHiddenBtn.innerText = "头部图片隐藏";
    nb.parentNode.insertBefore(imgHiddenBtn, nb.nextElementSibling);
    imgHiddenBtn.onclick = function () {
        var visible = imgHiddenBtn.innerText == "头部图片显示";
        // 显示和隐藏
        newsPageTopImageDisplay(visible);
        // 更改设置并更新
        setNewsPageTopImageVisisble(visible);
    };

    function newsPageTopImageDisplay(visible) {
        // 改为动画效果
        var imgHiddenBtn = document.getElementById("imgHiddenBtn");
        if (visible) {
            if (imgHiddenBtn.innerText == "头部图片显示") {
                // 需要显示
                slideDown(botm, botmHeight, 10, function () {
                    baredge.classList.remove("hiddenTopImgBorder");
                    bartop.classList.remove("hiddenTopImgBorder");
                    imgHiddenBtn.innerText = "头部图片隐藏";
                });
            }
        } else {
            if (imgHiddenBtn.innerText == "头部图片隐藏") {
                // 需要隐藏
                slideUp(botm, 10, function () {
                    baredge.classList.add("hiddenTopImgBorder");
                    bartop.classList.add("hiddenTopImgBorder");
                    imgHiddenBtn.innerText = "头部图片显示";
                });
            }
        }
    }

    function setNewsPageTopImageVisisble(visible) {
        indexDbInit(() => {
            // 保存存储信息
            var setting_newsPageTopImageVisible = {
                item: table_Settings_key_NewsPageTopImageVisible,
                value: visible
            }
            update(table_Settings, setting_newsPageTopImageVisible, () => {
                // 通知头部图片隐藏显示
                setDbSyncMessage(sync_newsPage_topImage_visible);
            }, () => { });
        });
    }


    // 谷歌机翻
    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    translateDiv.style.display = "none";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻 : 新闻";

    translateDiv.appendChild(translateLabel);
    translateDiv.appendChild(translateCheckbox);

    translateCheckbox.addEventListener("click", newsPageNewsTranslate);
    nb.parentNode.insertBefore(translateDiv, nb);

    indexDbInit(() => {
        // 读取并设置头部图片是否隐藏
        read(table_Settings, table_Settings_key_NewsPageTopImageVisible, result => {
            // 按钮显示出来
            imgHiddenBtn.style.display = "block";
            newsPageTopImageDisplay(result && result.value);
        }, () => {
            imgHiddenBtn.style.display = "block";
        });

        // 读取新闻页面翻译
        read(table_Settings, table_Settings_key_NewsPageTranslate, result => {
            translateDiv.style.display = "block";
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                newsPageNewsTranslateDisplay();
            }
        }, () => {
            translateDiv.style.display = "block";
        });
    });

    // 新闻分栏，隐藏折叠按钮
    var nd = document.getElementsByClassName("nd");
    var h2s = nd[0].querySelectorAll("h2");
    var newstitles = document.getElementsByClassName("newstitle");

    for (const i in h2s) {
        if (Object.hasOwnProperty.call(h2s, i)) {
            const h2 = h2s[i];
            var div = document.createElement("div");
            div.classList.add("title_extend");
            div.innerText = "-";
            h2.appendChild(div);
        }
    }

    for (const i in newstitles) {
        if (Object.hasOwnProperty.call(newstitles, i)) {
            const newstitle = newstitles[i];
            var div = document.createElement("div");
            div.classList.add("title_extend");
            div.innerText = "-";
            newstitle.appendChild(div);
        }
    }

    // 为每个折叠按钮添加事件
    var titleExpends = document.getElementsByClassName("title_extend");
    for (const i in titleExpends) {
        if (Object.hasOwnProperty.call(titleExpends, i)) {
            const titleExpend = titleExpends[i];
            titleExpend.onclick = function () {
                var parentChildNodes = titleExpend.parentNode.parentNode.children;
                if (titleExpend.innerText == "-") {
                    // 折叠
                    for (const k in parentChildNodes) {
                        if (Object.hasOwnProperty.call(parentChildNodes, k)) {
                            const childNode = parentChildNodes[k];
                            if (childNode.nodeName == "H2") continue;
                            if (childNode.classList.contains("newstitle")) continue;
                            childNode.style.display = "none";
                        }
                    }
                    titleExpend.innerText = "+";
                } else {
                    // 展开
                    for (const k in parentChildNodes) {
                        if (Object.hasOwnProperty.call(parentChildNodes, k)) {
                            const childNode = parentChildNodes[k];
                            if (childNode.nodeName == "H2") continue;
                            if (childNode.classList.contains("newstitle")) continue;
                            childNode.style.display = "block";
                        }
                    }
                    titleExpend.innerText = "-";
                }
            }
        }
    }

    // 数据同步
    window.onstorage = function (e) {
        try {
            console.log(e);
            switch (e.newValue) {
                case sync_newsPage_topImage_visible:
                    newsPageSyncTopImageVisible();
                    break;
                case sync_googleTranslate_newsPage_news:
                    newsPageSyncTranslate();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    function newsPageSyncTopImageVisible() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_NewsPageTopImageVisible, result => {
                newsPageTopImageDisplay(result && result.value);
            }, () => { });
        });
    }

    function newsPageSyncTranslate() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_NewsPageTranslate, result => {
                translateCheckbox.checked = result && result.value;
                newsPageNewsTranslateDisplay();
            }, () => { });
        });
    }
}



function newsPageNewsTranslate() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_newsPageTranslate = {
        item: table_Settings_key_NewsPageTranslate,
        value: isChecked
    };
    update(table_Settings, settings_newsPageTranslate, () => {
        // 通知，翻译新闻内容
        setDbSyncMessage(sync_googleTranslate_newsPage_news);
        newsPageNewsTranslateDisplay();
    }, () => { });
}

function newsPageNewsTranslateDisplay() {
    // 准备
    if (!newsPageTranslateIsReady) {
        newsPageTranslatePrepare();
    }

    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    newsPageTranslateNewsTitle(isChecked);
    newsPageTranslateSiteStatus(isChecked);
    newsPageSiteUpdateLog(isChecked);
    newsPagesTranslateRightNews(isChecked);
}

// 翻译之前的准备工作
function newsPageTranslatePrepare() {

    // 翻译前整理：网站更新日志
    var nwo = document.getElementsByClassName("nwo")[1];
    var nwi = nwo.querySelectorAll("div.nwi")[0];
    var nwiChildNodes = nwi.childNodes;
    for (const i in nwiChildNodes) {
        if (Object.hasOwnProperty.call(nwiChildNodes, i)) {
            const childNode = nwiChildNodes[i];
            if (childNode.nodeName == "#text") {
                var span = document.createElement("span");
                span.innerText = childNode.data;
                span.classList.add("googleTranslate_02");
                nwi.insertBefore(span, childNode.nextElementSibling);
                childNode.parentNode.removeChild(childNode);
            } else if (childNode.innerText) {
                childNode.classList.add("googleTranslate_02");
            }
        }
    }

    var nwu = nwo.querySelectorAll("div.nwu")[0];
    var nwuFirstChild = nwu.firstChild;
    var nwuFirstSpan = document.createElement("span");
    nwuFirstSpan.innerText = nwuFirstChild.textContent;
    nwuFirstSpan.id = "googleTranslate_02_span";
    nwu.insertBefore(nwuFirstSpan, nwuFirstChild);
    nwuFirstChild.parentNode.removeChild(nwuFirstChild);

    // 翻译前整理：右侧新闻
    var newstables = document.getElementsByClassName("newstable");
    for (const i in newstables) {
        if (Object.hasOwnProperty.call(newstables, i)) {
            const newstable = newstables[i];

            var newsdate = newstable.children[1];
            if (newsdate.innerText) {
                newsdate.classList.add("googleTranslate_03");
            }

            var newstext = newstable.children[2];
            var newstextChildNodes = newstext.childNodes;
            for (const i in newstextChildNodes) {
                if (Object.hasOwnProperty.call(newstextChildNodes, i)) {
                    const childNode = newstextChildNodes[i];
                    if (childNode.nodeName == "#text") {
                        var span = document.createElement("span");
                        span.innerText = childNode.data;
                        span.classList.add("googleTranslate_03");
                        newstext.insertBefore(span, childNode.nextElementSibling);
                        childNode.parentNode.removeChild(childNode);
                    } else if (childNode.innerText) {
                        childNode.classList.add("googleTranslate_03");
                    }
                }
            }

            var newslink = newstable.children[3];
            if (newslink.children.length > 0) {
                var newslinkA = newslink.children[0];
                if (newslinkA.innerText) {
                    newslinkA.classList.add("googleTranslate_03");
                }
            }
        }
    }

    var rightLastDiv = document.getElementsByClassName("nwo")[2].lastChild;
    if (rightLastDiv.children.length > 0) {
        var a = rightLastDiv.children[0];
        if (a.innerText) {
            a.classList.add("googleTranslate_03");
        }
    }

    newsPageTranslateIsReady = true;
}

// 翻译：新闻标题
function newsPageTranslateNewsTitle(isChecked) {
    var nd = document.getElementsByClassName("nd");
    var h2s = nd[0].querySelectorAll("h2");
    var newstitles = document.getElementsByClassName("newstitle");
    if (isChecked) {
        for (const i in h2s) {
            if (Object.hasOwnProperty.call(h2s, i)) {
                const h2 = h2s[i];
                var a = h2.children[0];
                if (a.dataset.translate) {
                    a.innerText = a.dataset.translate;
                } else {
                    a.classList.add("googleTranslate_00");
                    a.title = a.innerText;
                    if (newPagesTitles[a.innerText]) {
                        a.innerText = newPagesTitles[a.innerText];
                    } else {
                        translatePageElementEN(a);
                    }
                }
            }
        }

        for (const i in newstitles) {
            if (Object.hasOwnProperty.call(newstitles, i)) {
                const newstitle = newstitles[i];
                var a = newstitle.children[0];
                if (a.dataset.translate) {
                    a.innerText = a.dataset.translate;
                } else {
                    a.classList.add("googleTranslate_00");
                    a.title = a.innerText;
                    if (newPagesTitles[a.innerText]) {
                        a.innerText = newPagesTitles[a.innerText];
                    } else {
                        translatePageElementEN(a);
                    }
                }
            }
        }
    } else {
        var googleTranslates = document.getElementsByClassName("googleTranslate_00");
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (!trans.dataset.translate) {
                    trans.dataset.translate = trans.innerText;
                }
                trans.innerText = trans.title;
            }
        }
    }

}

// 翻译：最新网站状态
function newsPageTranslateSiteStatus(isChecked) {
    var nwo = document.getElementsByClassName("nwo")[0];
    var nwis = nwo.querySelectorAll("div.nwi");
    var nwf = document.getElementsByClassName("nwf")[0];
    if (isChecked) {
        for (const i in nwis) {
            if (Object.hasOwnProperty.call(nwis, i)) {
                const nwi = nwis[i];
                var tds = nwi.querySelectorAll("td");
                for (const t in tds) {
                    if (Object.hasOwnProperty.call(tds, t)) {
                        const td = tds[t];
                        if (td.innerText) {
                            if (td.dataset.translate) {
                                td.innerText = td.dataset.translate;
                            } else {
                                td.classList.add("googleTranslate_01");
                                td.title = td.innerText;
                                translatePageElementEN(td);
                            }
                        }
                    }
                }
            }
        }
        var zh_html = `你可以在 <a href="https://twitter.com/ehentai">推特上关注我们</a> 以便在网站不可用时获取网站状态信息。 `;
        nwf.innerHTML = zh_html;
    } else {
        var googleTranslates = document.getElementsByClassName("googleTranslate_01");
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (!trans.dataset.translate) {
                    trans.dataset.translate = trans.innerText;
                }
                trans.innerText = trans.title;
            }
        }
        var en_html = `You can follow <a href="https://twitter.com/ehentai">follow us on Twitter</a> to receive these site status updates if the site is ever unavailable. `;
        nwf.innerHTML = en_html;
    }
}

// 翻译：网站更新日志
function newsPageSiteUpdateLog(isChecked) {
    newsPagesTranslateCommon("googleTranslate_02", isChecked);
    var nwuFirstSpan = document.getElementById("googleTranslate_02_span");
    if (isChecked) {
        if (nwuFirstSpan.innerText) {
            if (nwuFirstSpan.innerText.indexOf("Previous Years:") != -1) {
                nwuFirstSpan.title = nwuFirstSpan.innerText;
                nwuFirstSpan.innerText = "往年记录：";
            } else if (nwuFirstSpan.dataset.translate) {
                nwuFirstSpan.innerText = nwuFirstSpan.dataset.translate;
            } else {
                nwuFirstSpan.title = nwuFirstSpan.innerText;
                translatePageElementEN(nwuFirstSpan);
            }
        }
    } else {
        if (!nwuFirstSpan.dataset.translate) {
            nwuFirstSpan.dataset.translate = nwuFirstSpan.innerText;
        }
        nwuFirstSpan.innerText = nwuFirstSpan.title;
    }
}

// 翻译：右边新闻
function newsPagesTranslateRightNews(isChecked) {
    newsPagesTranslateCommon("googleTranslate_03", isChecked);
}


function newsPagesTranslateCommon(className, isChecked) {
    var googleTranslates = document.getElementsByClassName(className);
    if (isChecked) {
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (trans.innerText) {
                    if (trans.dataset.translate) {
                        trans.innerText = trans.dataset.translate;
                    } else {
                        trans.classList.add(className);
                        trans.title = trans.innerText;
                        translatePageElementEN(trans);
                    }
                }
            }
        }
    } else {
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (!trans.dataset.translate) {
                    trans.dataset.translate = trans.innerText;
                }
                trans.innerText = trans.title;
            }
        }
    }
}



//#endregion