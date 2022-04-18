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


        var dcDiv = document.getElementsByClassName("dc");
        if (dcDiv.length > 0) {
            var dc = dcDiv[0];

            // 删除全部分割线
            var hrlist = parentDiv.querySelectorAll("hr");
            for (const i in hrlist) {
                if (Object.hasOwnProperty.call(hrlist, i)) {
                    const hr = hrlist[i];
                    hr.parentNode.removeChild(hr);
                }
            }

            // 跨域
            var meta = document.createElement("meta");
            meta.httpEquiv = "Content-Security-Policy";
            meta.content = "upgrade-insecure-requests";
            document.getElementsByTagName("head")[0].appendChild(meta);

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

            // 上传者排行榜页面翻译

            // 作品列表页面翻译
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

                    var encodeText = urlEncode(a.innerText);
                    // 单条翻译
                    getGoogleTranslate(encodeText, function (data) {
                        var sentences = data.sentences;
                        var longtext = '';
                        for (const i in sentences) {
                            if (Object.hasOwnProperty.call(sentences, i)) {
                                const sentence = sentences[i];
                                longtext += sentence.trans;
                            }
                        }

                        a.innerText = longtext;
                        a.dataset.translate = longtext;
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


//#endregion