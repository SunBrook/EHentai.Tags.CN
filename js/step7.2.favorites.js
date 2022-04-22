//#region step7.2.favorite.js 收藏列表

function favoritePage() {

    // 跨域
    crossDomain();

    // 标题添加类 t_favorite_ido，方便添加样式
    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        ido[0].classList.add("t_favorite_ido");
    }

    // 标题直接删除
    var h1 = document.getElementsByTagName("h1");
    if (h1.length > 0) {
        var pageTitle = h1[0];
        pageTitle.parentNode.removeChild(pageTitle);
    }

    // 显示全部按钮改名
    var favoriteBtns = document.getElementsByClassName("fp");
    if (favoriteBtns.length > 0) {
        var showAllFavorites = favoriteBtns[favoriteBtns.length - 1];
        showAllFavorites.innerText = "点我显示：全部收藏";

        // 没有收藏的列表字体颜色稍微暗一点
        for (let i = 0; i < favoriteBtns.length - 1; i++) {
            const favoriteBtn = favoriteBtns[i];
            var favoriteCount = favoriteBtn.children[0].innerText;
            if (favoriteCount == "0") {
                favoriteBtn.classList.add("favorite_null");
            }
        }

    }

    // 搜索按钮清空按钮翻译，筛选文本框排成一行
    var searchDiv = ido[0].children[1];
    searchDiv.classList.add("searchDiv");
    var form = searchDiv.children[0];
    var searchInputDiv = form.children[1];
    searchInputDiv.classList.add("searchInputDiv");
    var searchFilterDiv = form.children[2];
    searchFilterDiv.classList.add("searchFilterDiv");

    // 输入候选
    var inputRecommendDiv = document.createElement("div");
    inputRecommendDiv.id = "category_user_input_recommend";
    var searchForm = document.getElementsByTagName("form")[0];
    searchForm.insertBefore(inputRecommendDiv, searchForm.lastChild);

    // 搜索框、搜索按钮、搜索选项翻译
    var searchInput = searchInputDiv.children[0];
    searchInput.setAttribute("placeholder", "搜索关键字");
    searchInput.oninput = function () {
        var inputValue = searchInput.value.toLowerCase();
        favoriteUserInputOnInputEvent(inputValue, inputRecommendDiv, searchInput);
    }

    var searchBtn = searchInputDiv.children[1];
    searchBtn.value = "收藏中搜索";

    var clearBtn = searchInputDiv.children[2];
    clearBtn.value = "清空";

    var filterTds = searchFilterDiv.querySelectorAll("td");
    var filterHead = filterTds[0];
    filterHead.innerText = "搜索包含：";

    var filterName = filterTds[1];
    filterName.children[0].lastChild.textContent = "作品名称";

    var filterTag = filterTds[2];
    filterTag.children[0].lastChild.textContent = "标签";

    var filterNote = filterTds[3];
    filterNote.children[0].lastChild.textContent = "备注";

    // 展示总数量
    var ip = document.getElementsByClassName("ip");
    if (ip.length > 0) {
        var ipElement = ip[0];
        var totalCount = ipElement.innerText.replace("Showing ", "").replace(" results", "");
        ipElement.innerText = `共 ${totalCount} 条记录`;
    }

    // 预览下拉框
    var dms = document.getElementById("dms");
    if (!dms) {

        // 隐藏排序和底部操作框
        var orderDiv = ido[0].children[2].children[0];
        orderDiv.style.display = "none";
        var nullBottomDiv = ido[0].children[3].children[1];
        nullBottomDiv.style.display = "none";

        // 没有搜索到记录
        var nullInfo = ido[0].children[3].children[0];
        if (nullInfo) {
            getGoogleTranslate(nullInfo.innerText, function (data) {
                var sentences = data.sentences;
                var longtext = '';
                for (const i in sentences) {
                    if (Object.hasOwnProperty.call(sentences, i)) {
                        const sentence = sentences[i];
                        longtext += sentence.trans;
                    }
                }
                nullInfo.innerText = longtext;
            });
        }

        return;
    }

    // 翻译下拉菜单
    dropDownlistTranslate();

    // 底部删除选中、移动作品下拉框，确认按钮
    var ddact = document.getElementById("ddact");
    if (ddact) {
        var options = ddact.querySelectorAll("option");
        if (options.length > 0) {
            if (options[0].innerText == "Delete Selected") {
                options[0].innerText = "删除选中的作品";
            }
        }

        var optgroup = ddact.children[1];
        if (optgroup.getAttribute("label") == "Change Category") {
            optgroup.setAttribute("label", "作品迁移到以下收藏夹");
        }
    }

    var bottomConfirmBtn = ido[0].children[3].children[5].children[0].children[0].children[1].children[0];
    if (bottomConfirmBtn.value == "Confirm") {
        bottomConfirmBtn.value = "确 认";
        bottomConfirmBtn.style.width = "60px";
    }

    // 排序翻译、搜索行数翻译（包含没有搜索结果）
    var orderDiv = ido[0].children[2].children[0];
    orderDiv.firstChild.textContent = "作品排序：";
    switch (orderDiv.children[0].innerText) {
        case "Favorited":
            orderDiv.children[0].innerText = "收藏时间";
            break;
        case "Posted":
            orderDiv.children[0].innerText = "发布时间";
            break;
    }

    switch (orderDiv.children[1].innerText) {
        case "Use Favorited":
            orderDiv.children[1].innerText = " 按收藏时间排序 ";
            break;
        case "Use Posted":
            orderDiv.children[1].innerText = " 按发布时间排序 ";
            break;
    }

    // 作品类型翻译
    bookTypeTranslate();

    // 表头翻译
    tableHeadTranslate();

    // 表格页数翻译
    favoritePageTableBookPages();

    // 头部添加词库升级提示
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    ido[0].insertBefore(dataUpdateDiv, ido[0].lastChild);


    // 谷歌机翻标题
    // 表格头部左侧添加勾选 谷歌机翻
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
    var dms = document.getElementById("dms");
    dms.insertBefore(translateDiv, dms.lastChild);


    indexDbInit(() => {
        // 读取是否选中
        read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateMainPageTitleDisplay();
            }
        }, () => { });

        // 表格标签翻译
        otherPageTryUseOldDataAndTranslateTag();
    });

}

function favoritePageTableBookPages() {
    var select = dms.querySelectorAll("select");
    var rightSelect = select[0];
    if (rightSelect.value == "e") {
        // 标题 + 图片 + 标签
        var gl3eDivs = document.getElementsByClassName("gl3e");
        for (const i in gl3eDivs) {
            if (Object.hasOwnProperty.call(gl3eDivs, i)) {
                const gl3e = gl3eDivs[i];
                var childLength = gl3e.children.length;
                var pageDiv = gl3e.children[childLength - 3];
                innerTextPageToYe(pageDiv);
            }
        }
    }
}

function favoriteUserInputOnInputEvent(inputValue, inputRecommendDiv, searchInput) {
    // 清空候选项
    inputRecommendDiv.innerHTML = "";
    inputRecommendDiv.style.display = "block";
    var tempDiv = document.createElement("div");
    inputRecommendDiv.appendChild(tempDiv);

    if (!inputValue) {
        inputRecommendDiv.style.display = "none";
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
                    var addNewItem = `"${item.parent_en}:${item.sub_en}" `;
                    searchInput.value = `${searchInput.value}${addNewItem}`;
                    searchInput.focus();
                    inputRecommendDiv.innerHTML = "";
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
                    var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en}`;
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
                    var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en}`;
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

//#endregion