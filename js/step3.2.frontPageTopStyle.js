//#region step3.2.frontPageTopStyle 首页头部搜索显示隐藏

// 添加样式和逻辑，从 localstroage 中读取显示隐藏
function frontPageTopStyleStep01() {
    // 调整头部样式
    var searchBoxDiv = document.getElementById("searchbox");
    searchBoxDiv.style.width = "auto";
    searchBoxDiv.style.border = "0";

    // 头部添加背景图片按钮
    var bgDiv = document.createElement("div");
    bgDiv.id = "div_background_btn";
    var bgText = document.createTextNode("背景图片");
    bgDiv.appendChild(bgText);
    searchBoxDiv.appendChild(bgDiv);

    // 头部显示隐藏按钮
    var topVisibleDiv = document.createElement("div");
    topVisibleDiv.id = "div_top_visible_btn";
    topVisibleDiv.addEventListener("click", topVisibleChange);
    searchBoxDiv.appendChild(topVisibleDiv);

    function topVisibleChange() {
        if (topVisibleDiv.innerText == "头部显示") {
            // 头部显示
            searchBoxDiv.children[0].style.display = "block";
            topVisibleDiv.innerText = "头部隐藏";
            setOldSearchDivVisible(1);

        } else {
            // 头部隐藏
            searchBoxDiv.children[0].style.display = "none";
            topVisibleDiv.innerText = "头部显示";
            setOldSearchDivVisible(0);
        }
    }

    // 读取头部是否隐藏，并应用到页面中
    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == 0) {
        topVisibleDiv.innerText = "头部显示";
        searchBoxDiv.children[0].style.display = "none";
    } else {
        topVisibleDiv.innerText = "头部隐藏";
    }
}

// 从indexedDB 中读取隐藏折叠
function frontPageTopStyleStep02() {
    var searchBoxDiv = document.getElementById("searchbox");
    var topVisibleDiv = document.getElementById("div_top_visible_btn");

    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == null) {
        // 尝试从 indexedDB 中读取配置，如果存在则说明 localstroage 配置丢失，需要补充，页面对应隐藏折叠
        read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
            if (result) {
                if (!result.value) {
                    searchBoxDiv.children[0].style.display = "none";
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
}

//#endregion