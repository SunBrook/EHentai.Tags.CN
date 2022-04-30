//#region step3.2.frontPageTopStyle 首页头部搜索显示隐藏

// 添加样式和逻辑，从 localstroage 中读取显示隐藏
function frontPageTopStyleStep01() {
    // 调整头部样式
    var searchBoxDiv = document.getElementById("searchbox");
    searchBoxDiv.style.width = "auto";
    searchBoxDiv.style.border = "0";

    // 头部添加词库更新提示
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    searchBoxDiv.appendChild(dataUpdateDiv);

    // 纯搜索模式、标签模式（默认）按钮
    var searchModeDiv = document.createElement("div");
    searchModeDiv.id = "div_searchMode_btn";
    searchModeDiv.addEventListener("click", searchModeChange);
    searchBoxDiv.appendChild(searchModeDiv);

    function searchModeChange() {
        var tagDiv = document.getElementById("div_ee8413b2");
        if (searchModeDiv.innerText == "纯搜索模式") {
            normalModeWrapperDiv.style.display = "none";
            tagDiv.style.display = "none";
            searchBoxDiv.children[0].style.display = "block";
            fsdivShow();
            searchModeDiv.innerText = "标签模式";
            setSearchMode(1);

        } else {
            normalModeWrapperDiv.style.display = "block";
            tagDiv.style.display = "block";
            searchModeDiv.innerText = "纯搜索模式";
            setSearchMode(0);

            // 判断头部是否需要显示
            var oldSearchDivVisible = getOldSearchDivVisible();
            if (oldSearchDivVisible == 0) {
                topVisibleDiv.innerText = "头部显示";
                searchBoxDiv.children[0].style.display = "none";
                fsdivHide();
            } else {
                topVisibleDiv.innerText = "头部隐藏";
            }
        }
    }

    // 头部按钮包裹层，包裹标准模式下的按钮
    var normalModeWrapperDiv = document.createElement("div");
    normalModeWrapperDiv.id = "div_normalMode_wrapper";
    searchBoxDiv.appendChild(normalModeWrapperDiv);

    // 头部添加字体颜色按钮
    var fontColorDiv = document.createElement("div");
    fontColorDiv.id = "div_fontColor_btn";
    var fontColorText = document.createTextNode("字体颜色");
    fontColorDiv.appendChild(fontColorText);
    normalModeWrapperDiv.appendChild(fontColorDiv);

    // 头部添加背景图片按钮
    var bgDiv = document.createElement("div");
    bgDiv.id = "div_background_btn";
    var bgText = document.createTextNode("背景图片");
    bgDiv.appendChild(bgText);
    normalModeWrapperDiv.appendChild(bgDiv);

    // 头部显示隐藏按钮
    var topVisibleDiv = document.createElement("div");
    topVisibleDiv.id = "div_top_visible_btn";
    topVisibleDiv.addEventListener("click", topVisibleChange);
    normalModeWrapperDiv.appendChild(topVisibleDiv);

    function topVisibleChange() {
        if (topVisibleDiv.innerText == "头部显示") {
            // 头部显示
            searchBoxDiv.children[0].style.display = "block";
            fsdivShow();
            topVisibleDiv.innerText = "头部隐藏";
            setOldSearchDivVisible(1);

        } else {
            // 头部隐藏
            searchBoxDiv.children[0].style.display = "none";
            fsdivHide();
            topVisibleDiv.innerText = "头部显示";
            setOldSearchDivVisible(0);
        }
    }

    // 读取头部是否隐藏，并应用到页面中
    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == 0) {
        topVisibleDiv.innerText = "头部显示";
        searchBoxDiv.children[0].style.display = "none";
        fsdivHide();
    } else {
        topVisibleDiv.innerText = "头部隐藏";
    }

    // 优先级高于头部隐藏
    // 读取模式数据，应用到页面中
    var oldSearchMode = getSearchMode();
    if (oldSearchMode == 1) {
        normalModeWrapperDiv.style.display = "none";
        searchBoxDiv.children[0].style.display = "block";
        fsdivShow();
        searchModeDiv.innerText = "标签模式";
    } else {
        searchModeDiv.innerText = "纯搜索模式";
    }
}

// 从indexedDB 中读取隐藏折叠
function frontPageTopStyleStep02() {
    var searchBoxDiv = document.getElementById("searchbox");
    var topVisibleDiv = document.getElementById("div_top_visible_btn");
    var normalModeWrapperDiv = document.getElementById("div_normalMode_wrapper");
    var searchModeDiv = document.getElementById("div_searchMode_btn");
    var tagDiv = document.getElementById("div_ee8413b2");

    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == null) {
        // 尝试从 indexedDB 中读取配置，如果存在则说明 localstroage 配置丢失，需要补充，页面对应隐藏折叠
        read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
            if (result) {
                if (!result.value) {
                    topVisibleDiv.innerText = "头部显示";
                    searchBoxDiv.children[0].style.display = "none";
                    fsdivHide();
                } else {
                    topVisibleDiv.innerText = "头部隐藏";
                }
                setOldSearchDivVisible(result.value ? 1 : 0);
            }
        }, () => { });

    }

    // 添加按钮点击事件，用于将配置存储到 indexDB 中
    topVisibleDiv.addEventListener("click", () => {
        var settings_oldSearchDivVisible = {
            item: table_Settings_key_OldSearchDiv_Visible,
            value: topVisibleDiv.innerText == "头部隐藏"
        };
        update(table_Settings, settings_oldSearchDivVisible, () => {
            setDbSyncMessage(sync_oldSearchTopVisible);
        }, () => { });
    });


    var oldSearchMode = getSearchMode();
    if (oldSearchMode == null) {
        read(table_Settings, table_Settings_key_FrontPageSearchMode, result => {
            if (result) {
                if (result.value == 1) {
                    normalModeWrapperDiv.style.display = "none";
                    searchBoxDiv.children[0].style.display = "block";
                    fsdivShow();
                    tagDiv.style.display = "none";
                    searchModeDiv.innerText = "标签模式";
                } else {
                    searchModeDiv.innerText = "纯搜索模式";
                }
                setSearchMode(result.value);
            }
        }, () => { });
    }

    searchModeDiv.addEventListener("click", () => {
        var settings_keyfrontPageSearchMode = {
            item: table_Settings_key_FrontPageSearchMode,
            value: searchModeDiv.innerText == "标签模式" ? 1 : 0
        };
        update(table_Settings, settings_keyfrontPageSearchMode, () => {
            setDbSyncMessage(sync_frontPageSearchMode);
        }, () => { });
    });
}


function fsdivHide() {
    var fsdiv = document.getElementById("fsdiv");
    if (fsdiv) {
        fsdiv.style.display = "none";
    }
    var iw = document.getElementById("iw");
    if (iw) {
        iw.style.display = "none";
    }
}

function fsdivShow() {
    var labels = document.getElementsByClassName("nopm")[1].children;
    if (labels.length > 1) {
        var fsdiv = document.getElementById("fsdiv");
        if (fsdiv) {
            var txt = labels[1].innerText;
            if (txt == "隐藏文件搜索") {
                fsdiv.style.display = "block";
            }
        }
    }

    var iw = document.getElementById("iw");
    if (iw) {
        iw.style.display = "block";
    }
}

//#endregion