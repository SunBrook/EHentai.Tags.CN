//#region 7.1.popularPage.js 热门

function popularPage() {

    // 跨域
    crossDomain();

    // 新版分页
	TranslateNewPagingLinks();

    // 头部标题改成中文
    var ihTitle = document.getElementsByClassName("ih");
    if (ihTitle.length > 0) {
        ihTitle[0].innerText = "近期热门作品";
    }

    var toppane = document.getElementById("toppane");
    toppane.classList.add("t_popular_toppane"); // 添加样式避免干扰其他页面

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

    // 按钮位置调整
    func_eh_ex(() => { }, () => {
        // exhentai 需要调整
        translateDiv.style.marginTop = "0";
    });

    // 头部添加词库升级提示
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    toppane.insertBefore(dataUpdateDiv, toppane.lastChild);


    // 翻译下拉折叠菜单
    var dms = document.getElementById("dms");
    dms.classList.add("t_popular_dms"); // 添加样式避免干扰其他页面
    dropDownlistTranslate();

    // 表头翻译
    tableHeadTranslate();

    // 作品类型翻译
    bookTypeTranslate();

    // 作品篇幅
    tableBookPages();

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
        otherPageTryUseOldDataAndTranslateTag();
    });

    // 同步谷歌机翻标题
    DataSyncCommonTranslateTitle();



}

function otherPageTryUseOldDataAndTranslateTag() {
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
                tableTagTranslate();
                // 检查更新
                checkUpdateData(() => {
                    // 存在更新
                    tableTagTranslate();
                }, () => { });
            } else if (complete1 && complete2) {
                t && clearInterval(t);
                // 不存在数据
                checkUpdateData(() => {
                    // 存在更新
                    tableTagTranslate();
                }, () => {
                    tableTagTranslate();
                });
            }
        }, 10);
    });
}


//#endregion