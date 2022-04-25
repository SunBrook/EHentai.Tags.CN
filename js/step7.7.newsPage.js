//#region step7.7.newsPage.js

function newsPage() {
    // 跨域
    crossDomain();

    // 添加样式方便调整页面样式
    var newsouter = document.getElementById("newsouter");
    newsouter.classList.add("t_newspage_souter");

    var newsinner = document.getElementById("newsinner");

    // 头部图片隐藏折叠按钮
    var baredge = document.getElementsByClassName("baredge")[0];
    var bartop = document.getElementsByClassName("bartop")[0];
    var botm = document.getElementById("botm");
    var botmHeight = botm.clientHeight;

    var imgHiddenBtn = document.createElement("div");
    imgHiddenBtn.id = "imgHiddenBtn";
    imgHiddenBtn.innerText = "头部图片隐藏";
    newsinner.insertBefore(imgHiddenBtn, newsinner.firstChild);
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
        })


    }

    // 读取并设置头部图片是否隐藏
    indexDbInit(() => {
        read(table_Settings, table_Settings_key_NewsPageTopImageVisible, result => {
            var visible = result && result.value;
            document.documentElement.scrollTop = 0;
            setTimeout(function () {
                newsPageTopImageDisplay(visible);
                // 滚动条设置在头部
            }, 1000);
        }, () => { });
    });


    // 谷歌机翻
    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻 : 新闻";

    translateDiv.appendChild(translateLabel);
    translateDiv.appendChild(translateCheckbox);

    translateCheckbox.addEventListener("click", newPageNewsTranslate);
    newsinner.insertBefore(translateDiv, imgHiddenBtn.nextElementSibling);

    // 新闻分栏，标题重命名
    var nd = document.getElementsByClassName("nd");
    var h2s = nd[0].querySelectorAll("h2");
    for (const i in h2s) {
        if (Object.hasOwnProperty.call(h2s, i)) {
            const h2 = h2s[i];
            var a = h2.children[0];
            if (newPagesTitles[a.innerText]) {
                a.innerText = newPagesTitles[a.innerText];
            } else {
                translatePageElementEN(a);
            }
        }
    }

    var newstitles = document.getElementsByClassName("newstitle");
    for (const i in newstitles) {
        if (Object.hasOwnProperty.call(newstitles, i)) {
            const newstitle = newstitles[i];
            var a = newstitle.children[0];
            if (newPagesTitles[a.innerText]) {
                a.innerText = newPagesTitles[a.innerText];
            } else {
                translatePageElementEN(a);
            }
        }
    }

    // 新闻分栏，隐藏折叠按钮


    // 文本字体大小调整

    // 翻译标题



}

function newPageNewsTranslate() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_newsPageTranslate = {
        item: table_Settings_key_NewsPageTranslate,
        value: isChecked
    };
    update(table_Settings, settings_newsPageTranslate, () => {
        // 通知通知，翻译标题
        setDbSyncMessage(sync_googleTranslate_newsPage_news);
        newPageNewsTranslateDisplay();
    }, () => { });
}

function newPageNewsTranslateDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    newPageTranslateSiteStatus(isChecked);
    newPageSiteUpdateLog(isChecked);
}

// 最新网站状态
function newPageTranslateSiteStatus(isChecked) {
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

// 网站更新日志
function newPageSiteUpdateLog(isChecked) {
    var nwo = document.getElementsByClassName("nwo")[1];
    var nwi = nwo.querySelectorAll("div.nwi")[0];
    var nwu = nwo.querySelectorAll("div.nwu")[0];
    if (isChecked) {
        var nwiChildNodes = nwi.childNodes;
        for (const i in nwiChildNodes) {
            if (Object.hasOwnProperty.call(nwiChildNodes, i)) {
                const childNode = nwiChildNodes[i];
                if (childNode.nodeName == "#text") {
                    var p = document.createElement("p");
                    p.innerText = childNode.data;
                    p.classList.add("googleTranslate_02");
                    nwi.insertBefore(p,childNode.nextElementSibling);
                    childNode.parentNode.removeChild(childNode);
                }
            }
        }
    }
}

//#endregion