//#region step7.10.mytagsPage.js 我的标签

var searchKeyDict = {};

function mytagsPage() {
    // 添加类方便修改样式
    var outer = document.getElementById("outer");
    outer.classList.add("t_mytagsPage_outer");

    // 查询是否存在上传的标签，如果存在这弹窗




    // 新建插件布局
    mytagsCategoryWindow();

    // 插件逻辑实现
    mytagsCategoryWindowEvents();

    // 底部页面翻译



    // var valueArray = ["other:3d", "group:imomuya honpo"];
    // localStorage.setItem("mytags", JSON.stringify(valueArray));

    // 加个遮罩，提示进度，鼠标移入暂停操作
    // var items = localStorage.getItem("mytags");
    // if (items) {
    //     var itemArray = JSON.parse(items);
    //     if (itemArray.length > 0) {
    //         var item0 = itemArray.shift();
    //         localStorage.setItem("mytags", JSON.stringify(itemArray));

    //         var tagname_new = document.getElementById("tagname_new");
    //         var tagsave_0 = document.getElementById("tagsave_0");
    //         tagname_new.value = item0;
    //         tagsave_0.removeAttribute("disabled");
    //         tagsave_0.click();
    //     }
    // }

    // var valueArray = ["other:3d", "group:imomuya honpo"];
    // var tagname_new = document.getElementById("tagname_new");
    // var tagsave_0 = document.getElementById("tagsave_0");

    // for (let i = 0; i < valueArray.length; i++) {
    //     tagname_new.value = valueArray[i];
    //     tagsave_0.removeAttribute("disabled");
    //     tagsave_0.click();
    // }
}

// 我的标签插件布局
function mytagsCategoryWindow() {
    var mainHtml = `<div id="t_mytags_div">
    <div id="t_mytags_top">
        <div id="t_mytags_extend_btn">展开 / 折叠</div>
        <input type="text" id="t_mytags_search" placeholder="请输入关键字进行搜索" />
        <div id="clear_search_btn">清空</div>
        <div id="t_mytags_clodToFavorite_btn" title="账号的标签，同步到本地收藏列表">账号 -> 收藏</div>
        <div id="t_mytags_submitCategories_btn" title="下方勾选的标签，同步添加到账号标签中">勾选 -> 账号</div>
    </div>
    <div id="t_mytags_bottom">
        <div id="t_allCategories">
            <div id="t_allCategories_window">
                <div id="t_mytags_allcategory_loading_div">💕 请等待一小会儿，马上就好 💕</div>
                <h4>语言
                    <span data-category="Language" class="category_extend category_extend_fetish">-</span>
                </h4>
                <div id="items_div_Language">
                    <span class="mytags_item_wrapper">
                        <input type="checkbox" value="language:chinese" id="allCate_language:chinese">
                        <label for="allCate_language:chinese">中文</label>
                    </span>
                    <span class="mytags_item_wrapper">
                        <input type="checkbox" value="language:english" id="allCate_language:english">
                        <label for="allCate_language:english">英文</label>
                    </span>
                </div>
            </div>
            <div id="t_allCategories_tool">
                <div id="mytags_left_all_collapse">折叠</div>
                <div id="mytags_left_all_expand">展开</div>
                <div class="mytags_allCheck_div">
                    <input type="checkbox" id="allCategories_allCheck" />
                    <label for="allCategories_allCheck">全选</label>
                </div>
                <p>全部类别，仅展示可操作标签</p>
            </div>
        </div>
        <div id="t_split_line"></div>
        <div id="t_favoriteCategories">
            <div id="t_favoriteCategories_window">
                <div id="t_mytags_favoritecategory_loading_div">💕 请等待一小会儿，马上就好 💕</div>
                <h4>语言
                    <span data-category="Language" class="category_extend category_extend_fetish">-</span>
                </h4>
                <div id="items_div_Language">
                    <span class="mytags_item_wrapper">
                        <input type="checkbox" value="language:chinese" id="favoriteCate_language:chinese">
                        <label for="favoriteCate_language:chinese">中文</label>
                    </span>
                    <span class="mytags_item_wrapper">
                        <input type="checkbox" value="language:english" id="favoriteCate_language:english">
                        <label for="favoriteCate_language:english">英文</label>
                    </span>
                </div>
            </div>
            <div id="t_favoriteCategories_tool">
                <div id="mytags_right_all_collapse">折叠</div>
                <div id="mytags_right_all_expand">展开</div>

                <div class="mytags_allCheck_div">
                    <input type="checkbox" id="favoriteCategories_allCheck" />
                    <label for="favoriteCategories_allCheck">全选</label>
                </div>
                <p>本地收藏，仅展示可操作标签</p>
            </div>
        </div>
    </div>
</div>
<div id="t_mytags_data_update_tip"></div>`;
    var outer = document.getElementById("outer");
    var div = document.createElement("div");
    div.innerHTML = mainHtml;
    outer.insertBefore(div, outer.children[0]);
}

// 我的标签插件逻辑实现
function mytagsCategoryWindowEvents() {
    // 展开折叠按钮、输入框、清空按钮、勾选->账号、账号->收藏、底部div、全部标签项
    var extendBtn = document.getElementById("t_mytags_extend_btn");
    var searchInput = document.getElementById("t_mytags_search");
    var clearBtn = document.getElementById("clear_search_btn");
    var submitCategoriesBtn = document.getElementById("t_mytags_submitCategories_btn");
    var clodToFavoriteBtn = document.getElementById("t_mytags_clodToFavorite_btn");
    var bottomDiv = document.getElementById("t_mytags_bottom");


    // 全部类别：数据展示div、全选按钮、展开按钮、折叠按钮
    var allCategoriesWindow = document.getElementById("t_allCategories_window");
    var allCategoriesAllCheckBox = document.getElementById("allCategories_allCheck");
    var leftAllCollapseBtn = document.getElementById("mytags_left_all_collapse");
    var leftAllExpandBtn = document.getElementById("mytags_left_all_expand");

    // 本地收藏：数据展示div、全选按钮、展开按钮、折叠按钮
    var favoriteCategoriesWindow = document.getElementById("t_favoriteCategories_window");
    var favoriteCategoriesAllCheckBox = document.getElementById("favoriteCategories_allCheck");
    var rightAllCollapseBtn = document.getElementById("mytags_right_all_collapse");
    var rightAllExpandBtn = document.getElementById("mytags_right_all_expand");

    // 展示数据填充
    mytagsInitWindowsData(allCategoriesWindow, allCategoriesAllCheckBox, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);

    // 展开折叠功能
    extendBtn.onclick = function () {
        windowSlideUpDown(bottomDiv);
    }

    // 输入框
    searchInput.oninput = function () {
        searchOnInput(searchInput, bottomDiv);
    }

    // 清空按钮

    // 勾选->账号

    // 账号->收藏

    // 全部类别：全部折叠
    leftAllCollapseBtn.onclick = function () {
        mytagAllTotalExtend(allCategoriesWindow, "+", "none");
    }

    // 全部类别：全部取消
    leftAllExpandBtn.onclick = function () {
        mytagAllTotalExtend(allCategoriesWindow, "-", "block");
    }

    // 全部类别：全反选
    allCategoriesAllCheckBox.onclick = function () {
        mytagTotalCheckboxClick(allCategoriesWindow, allCategoriesAllCheckBox);
    }

    // 收藏：全部折叠
    rightAllCollapseBtn.onclick = function () {
        mytagFavoriteTotalExtend(favoriteCategoriesWindow, "+", "none");
    }

    // 收藏：全部展开
    rightAllExpandBtn.onclick = function () {
        mytagFavoriteTotalExtend(favoriteCategoriesWindow, "-", "block");
    }

    // 收藏：全反选
    favoriteCategoriesAllCheckBox.onclick = function () {
        mytagTotalCheckboxClick(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
    }

    // TODO 收藏时更新我的标签收藏 HTML，接收收藏的同步消息，用于更新标签收藏 html


}

// 展开折叠插件窗口功能
function windowSlideUpDown(bottomDiv) {
    if (bottomDiv.dataset.visible == 1) {
        bottomDiv.dataset.visible = 0;
        slideUp(bottomDiv, 15, () => { });
    } else {
        bottomDiv.dataset.visible = 1;
        slideDown(bottomDiv, 350, 15, () => { });
    }
}

// 展示数据填充
function mytagsInitWindowsData(allCategoriesWindow, allCategoriesAllCheckBox, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox) {

    indexDbInit(() => {

        // 本地收藏html
        // 先尝试取出收藏html，如果没有则根据收藏数据生成收藏html，如果没有收藏数据则不用生成
        read(table_Settings, table_Settings_key_MyTagsFavoriteCategory_Html, result => {
            if (result && result.value) {
                // 存在html，直接更新html
                favoriteCategoriesWindow.innerHTML = result.value;
                mytagFavoriteSpanExtend(favoriteCategoriesWindow);
                mytagItemsCheckbox(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
            } else {
                // 读取表数据
                var parentDict = {}; // 用于过滤可用收藏的父级
                var favoriteDict = {}; // 可用的收藏标签
                readAll(table_detailParentItems, (k, v) => {
                    parentDict[k] = v;
                }, () => {
                    readAll(table_favoriteSubItems, (k, v) => {
                        if (parentDict[v.parent_en]) {
                            favoriteDict[k] = v;
                        }
                    }, () => {
                        if (!checkDictNull(favoriteDict)) {
                            // 存在可用的收藏标签
                            var favoritesListHtml = ``;
                            var lastParentEn = ``;
                            for (const k in favoriteDict) {
                                if (Object.hasOwnProperty.call(favoriteDict, k)) {
                                    const v = favoriteDict[k];
                                    if (v.parent_en != lastParentEn) {
                                        if (lastParentEn != '') {
                                            favoritesListHtml += `</div>`;
                                        }
                                        lastParentEn = v.parent_en;
                                        // 新建父级
                                        favoritesListHtml += `<h4> ${v.parent_zh} <span data-category="${v.parent_en}" class="category_extend category_extend_mytags">-</span></h4>`;
                                        favoritesListHtml += `<div id="favorite_items_div_${v.parent_en}">`;
                                    }
                                    // 添加子级
                                    favoritesListHtml += `<span class="mytags_item_wrapper" id="favorite_span_${v.ps_en}" title="${v.ps_en}">
                                    <input type="checkbox" value="${v.ps_en}" id="favoriteCate_${v.ps_en}">
                                    <label for="favoriteCate_${v.ps_en}">${v.sub_zh}</label>
                                </span>`;
                                }
                            }
                            // 读完后操作
                            if (favoritesListHtml != ``) {
                                favoritesListHtml += `</div>`;
                            }

                            // 页面附加 html
                            favoriteCategoriesWindow.innerHTML = favoritesListHtml;
                            mytagFavoriteSpanExtend(favoriteCategoriesWindow);
                            mytagItemsCheckbox(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);

                            // 存储收藏 html
                            var settings_myTagsFavoriteCategory_html = {
                                item: table_Settings_key_MyTagsFavoriteCategory_Html,
                                value: favoritesListHtml
                            };
                            update(table_Settings, settings_myTagsFavoriteCategory_html, () => { }, () => { });
                        } else {
                            // 可用的收藏标签为空
                            favoriteCategoriesWindow.innerHTML = '';
                        }
                    });
                });
            }
        }, () => { });

        // 全部类别html
        // 先尝试获取备份的全部类别html，如果没有就根据entag 生成html，如果没有ehtag 就更新ehtag 并生成最新的html。最后检查新版本
        function mytagTryGetAllTagsCategory(func_compelete) {
            read(table_Settings, table_Settings_key_MyTagsAllCategory_Html, result => {
                if (result && result.value) {
                    // 存在html，直接更新html
                    allCategoriesWindow.innerHTML = result.value;
                    var categoryItems = document.getElementsByClassName("mytags_item_wrapper");
                    for (const i in categoryItems) {
                        if (Object.hasOwnProperty.call(categoryItems, i)) {
                            const wrapper = categoryItems[i];
                            searchKeyDict[wrapper.dataset.search_key] = wrapper.title;
                        }
                    }

                    mytagAllSpanExtend(allCategoriesWindow);
                    mytagItemsCheckbox(allCategoriesWindow, allCategoriesAllCheckBox);
                    func_compelete();
                } else {
                    // 尝试读取ehtag表数据
                    var ehTagDict = {};
                    readAll(table_EhTagSubItems, (k, v) => {
                        ehTagDict[k] = v;
                        searchKeyDict[v.search_key] = v.ps_en;
                    }, () => {
                        if (!checkDictNull(ehTagDict)) {
                            // 存在数据，生成全部类别html
                            var ehtagListHtml = ``;
                            var lastParentEn = ``;
                            for (const k in ehTagDict) {
                                if (Object.hasOwnProperty.call(ehTagDict, k)) {
                                    const v = ehTagDict[k];
                                    if (v.parent_en != lastParentEn) {
                                        if (lastParentEn != '') {
                                            ehtagListHtml += `</div>`;
                                        }
                                        lastParentEn = v.parent_en;
                                        // 新建父级
                                        ehtagListHtml += `<h4> ${v.parent_zh} <span data-category="${v.parent_en}" class="category_extend category_extend_mytags">-</span></h4>`;
                                        ehtagListHtml += `<div id="all_items_div_${v.parent_en}">`;
                                    }
                                    // 添加子级
                                    ehtagListHtml += `<span class="mytags_item_wrapper" id="all_span_${v.ps_en}" data-search_key="${v.search_key}" title="${v.ps_en}">
                                        <input type="checkbox" value="${v.ps_en}" id="allCate_${v.ps_en}">
                                        <label for="allCate_${v.ps_en}">${v.sub_zh}</label>
                                    </span>`;
                                }
                            }
                            // 读完后操作
                            if (ehtagListHtml != ``) {
                                ehtagListHtml += `</div>`;
                            }

                            // 页面附加html
                            allCategoriesWindow.innerHTML = ehtagListHtml;
                            mytagAllSpanExtend(allCategoriesWindow);
                            mytagItemsCheckbox(allCategoriesWindow, allCategoriesAllCheckBox);

                            // 保存全部html数据
                            var settings_myTagsAllCategory_html = {
                                item: table_Settings_key_MyTagsAllCategory_Html,
                                value: ehtagListHtml
                            };
                            update(table_Settings, settings_myTagsAllCategory_html, () => { }, () => { });
                            func_compelete();
                        } else {
                            // 不存在数据，删除 ehtag 版本号信息，等待删除完毕
                            remove(table_Settings, table_Settings_key_EhTagVersion, () => {
                                func_compelete();
                            }, () => {
                                func_compelete();
                            });
                        }
                    });
                }
            });
        }

        // 尝试生成数据，并检查更新全部类别
        mytagTryGetAllTagsCategory(() => {
            checkUdpateEhtagData(() => {
                searchKeyDict = {};
                mytagTryGetAllTagsCategory(() => { });
            }, () => { });
        });

    });

}

// 单个全部类别折叠按钮
function mytagAllSpanExtend(allCategoriesWindow) {
    var allh4Spans = allCategoriesWindow.querySelectorAll("span.category_extend");
    for (const i in allh4Spans) {
        if (Object.hasOwnProperty.call(allh4Spans, i)) {
            const span = allh4Spans[i];
            span.onclick = function () {
                var expandDiv = document.getElementById(`all_items_div_${span.dataset.category}`);
                if (span.innerText == "-") {
                    // 需要折叠
                    expandDiv.style.display = "none";
                    span.innerText = "+";
                } else {
                    // 需要展开
                    expandDiv.style.display = "block";
                    span.innerText = "-";
                }
            }
        }
    }
}

// 全部类别全部折叠或者展开
function mytagAllTotalExtend(allCategoriesWindow, innerText, display) {
    var h4spans = allCategoriesWindow.querySelectorAll("span.category_extend");
    var divWrappers = allCategoriesWindow.querySelectorAll("div");
    for (const i in h4spans) {
        if (Object.hasOwnProperty.call(h4spans, i)) {
            const span = h4spans[i];
            span.innerText = innerText;
        }
    }
    for (const i in divWrappers) {
        if (Object.hasOwnProperty.call(divWrappers, i)) {
            const div = divWrappers[i];
            div.style.display = display;
        }
    }
}

// 单个收藏折叠按钮
function mytagFavoriteSpanExtend(favoriteCategoriesWindow) {
    var favoriteh4Spans = favoriteCategoriesWindow.querySelectorAll("span.category_extend");
    for (const i in favoriteh4Spans) {
        if (Object.hasOwnProperty.call(favoriteh4Spans, i)) {
            const span = favoriteh4Spans[i];
            span.onclick = function () {
                var expandDiv = document.getElementById(`favorite_items_div_${span.dataset.category}`);
                if (span.innerText == "-") {
                    // 需要折叠
                    expandDiv.style.display = "none";
                    span.innerText = "+";
                } else {
                    // 需要展开
                    expandDiv.style.display = "block";
                    span.innerText = "-";
                }
            }
        }
    }
}

// 全部收藏全部展开或者展开
function mytagFavoriteTotalExtend(favoriteCategoriesWindow, innerText, display) {
    var h4spans = favoriteCategoriesWindow.querySelectorAll("span.category_extend");
    var divWrappers = favoriteCategoriesWindow.querySelectorAll("div");
    for (const i in h4spans) {
        if (Object.hasOwnProperty.call(h4spans, i)) {
            const span = h4spans[i];
            span.innerText = innerText;
        }
    }
    for (const i in divWrappers) {
        if (Object.hasOwnProperty.call(divWrappers, i)) {
            const div = divWrappers[i];
            div.style.display = display;
        }
    }
}

// 单个勾选框勾选 （全部类别或者收藏）
function mytagItemsCheckbox(categoryWindow, allCategoryCheckBox) {
    var totalCheckboxs = categoryWindow.querySelectorAll('input[type="checkbox"]');
    for (const i in totalCheckboxs) {
        if (Object.hasOwnProperty.call(totalCheckboxs, i)) {
            const checkbox = totalCheckboxs[i];
            checkbox.onclick = function () {
                var checkedboxs = categoryWindow.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedboxs.length == 0) {
                    // 为空
                    allCategoryCheckBox.indeterminate = false;
                    allCategoryCheckBox.checked = false;
                } else if (totalCheckboxs.length == checkedboxs.length) {
                    // 全选
                    allCategoryCheckBox.indeterminate = false;
                    allCategoryCheckBox.checked = true;
                } else {
                    // 半选
                    allCategoryCheckBox.indeterminate = true;
                    allCategoryCheckBox.checked = false;
                }
            }
        }
    }
}

// 全反选 (全部类别或者收藏)
function mytagTotalCheckboxClick(categoriesWindow, categoriesAllCheckBox) {
    if (categoriesAllCheckBox.checked) {
        // 需要全选
        var uncheckbox = categoriesWindow.querySelectorAll('input[type="checkbox"]:not(checked)');
        for (const i in uncheckbox) {
            if (Object.hasOwnProperty.call(uncheckbox, i)) {
                const checkbox = uncheckbox[i];
                checkbox.checked = true;
            }
        }
        categoriesAllCheckBox.checked = true;
    } else {
        // 需要空选
        var totalcheckbox = categoriesWindow.querySelectorAll('input[type="checkbox"]');
        for (const i in totalcheckbox) {
            if (Object.hasOwnProperty.call(totalcheckbox, i)) {
                const checkbox = totalcheckbox[i];
                checkbox.checked = false;
            }
        }
        categoriesAllCheckBox.checked = false;
    }
    categoriesAllCheckBox.indeterminate = false;
}

// 输入时候选
function searchOnInput(searchInput, bottomDiv) {

    var searchContent = trimStartEnd(searchInput.value);
    if (searchContent != "") {
        for (const searchKey in searchKeyDict) {
            if (Object.hasOwnProperty.call(searchKeyDict, searchKey)) {
                const ps_en = searchKeyDict[searchKey];
                var allSpanItem = document.getElementById('all_span_' + ps_en);
                var favoriteSpanItem = document.getElementById('favorite_span_' + ps_en);
                if (searchKey.indexOf(searchContent) != -1) {
                    // 匹配成功
                    if (allSpanItem) {
                        allSpanItem.classList.remove("hide");
                    }
                    if (favoriteSpanItem){
                        favoriteSpanItem.classList.remove("hide");
                    }
                } else {
                    // 匹配失败
                    if (allSpanItem) {
                        allSpanItem.classList.add("hide");
                    }
                    if (favoriteSpanItem){
                        favoriteSpanItem.classList.add("hide");
                    }
                }
            }
        }

        // // 显示匹配的标签，隐藏不匹配元素
        // for (const i in categoryItems) {
        //     if (Object.hasOwnProperty.call(categoryItems, i)) {
        //         const wrapper = categoryItems[i];
        //         if (wrapper.dataset.search_key.indexOf(searchContent) != -1) {
        //             // 匹配成功
        //             wrapper.classList.remove("hide");
        //         } else {
        //             // 匹配失败
        //             wrapper.classList.add("hide");
        //         }
        //     }
        // }
    } else {
        // 用户没有有效输入，隐藏元素全部显示
        var hideItems = bottomDiv.querySelectorAll("hide");
        for (const i in hideItems) {
            if (Object.hasOwnProperty.call(hideItems, i)) {
                const hideItem = hideItems[i];
                hideItem.classList.remove("hide");
            }
        }
    }
}




//#endregion