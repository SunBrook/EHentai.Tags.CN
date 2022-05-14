//#region step7.10.mytagsPage.js 我的标签

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

    // 编辑主插件
    var mainHtml = `<div id="t_mytags_div">
    <div id="t_mytags_top">
        <div id="t_mytags_extend_btn">展开 / 折叠</div>
        <input type="text" id="t_mytags_search" placeholder="请输入关键字进行搜索，等待搜索完毕后勾选" />
        <div id="clear_search_btn">清空</div>
        <div id="t_mytags_clodToFavorite_btn" title="账号的标签，同步到本地收藏列表">标签：账号 -> 收藏</div>
        <div id="t_mytags_submitCategories_btn" title="下方勾选的标签，同步添加到账号标签中">标签：勾选 -> 账号</div>
    </div>
    <div id="t_mytags_bottom">
        <div id="t_allCategories">
            <div id="t_allCategories_window">
                <div id="t_mytags_allcategory_loading_div">💕 请等待一小会儿，马上就好 💕</div>
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

    // 标签：勾选 -> 账号 弹框
    var uploadFormHtml = `<div id="upload_tag_form_top">勾选的标签，添加到账号</div>
    <div id="upload_tag_form_close" title="关闭">X</div>
    <div id="upload_tag_form_middle">
        <div id="upload_tag_form_middle_left">
            <div class="upload_tag_form_item">
                <label class="checkbox_label">标签行为：</label>
                <div id="checkboxDiv">
                    <input type="checkbox" id="tag_watched">
                    <label for="tag_watched">偏好页面，包含标签的作品</label>
                    <input type="checkbox" id="tag_hidden">
                    <label for="tag_hidden">网站隐藏，含有标签的作品</label>
                </div>
                <div id="behavior_reset_btn">恢复默认</div>
            </div>
            <div class="upload_tag_form_item">
                <label class="color_label">标签颜色：</label>
                <input type="color" id="tag_color" />
                <div id="tag_color_val">默认颜色</div>
                <div id="tag_color_reset_btn">恢复默认</div>
            </div>
            <div class="upload_tag_form_item">
                <label class="weight_label">标签权重：</label>
                <input type="text" id="tag_weight">
                <div id="weight_reset_btn">恢复默认</div>
            </div>
        </div>
        <div id="upload_tag_form_middle_split"></div>
        <div id="upload_tag_form_middle_right">
            <div id="uploadForm_tags_div"></div>
            <div id="checkTags_reset_btn">恢复全部标签</div>
        </div>
    </div>
    <div id="upload_tag_form_bottom">
        <div id="upload_save_btn">保存 √</div>
        <div id="upload_cancel_btn">取消 X</div>
    </div>`;
    var uploadFormDiv = document.createElement("div");
    uploadFormDiv.innerHTML = uploadFormHtml;
    uploadFormDiv.id = "upload_tag_form";
    uploadFormDiv.style.display = "none";
    outer.insertBefore(uploadFormDiv, outer.children[0]);

    // 拖拽事件
    var x = 0, y = 0;
    var left = 0, top = 0;
    var isMouseDown = false;
    var uploadTagFromTop = document.getElementById("upload_tag_form_top");
    uploadTagFromTop.onmousedown = function (e) {
        // 获取坐标xy
        x = e.clientX;
        y = e.clientY;

        // 获取左和头的偏移量
        left = uploadFormDiv.offsetLeft;
        top = uploadFormDiv.offsetTop;

        // 鼠标按下
        isMouseDown = true;
    }

    uploadTagFromTop.onmouseup = function () {
        isMouseDown = false;
    }

    window.onmousemove = function (e) {
        if (isMouseDown) {
            var nLeft = e.clientX - (x - left);
            var nTop = e.clientY - (y - top);
            uploadFormDiv.style.left = `${nLeft}px`;
            uploadFormDiv.style.top = `${nTop}px`;
        }

    }


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

    // 标签 勾选->账号，弹框
    var uploadTagFormDiv = document.getElementById("upload_tag_form");
    var uploadTagFormCloseBtn = document.getElementById("upload_tag_form_close");
    var uploadTagFormCheckBoxTagWatched = document.getElementById("tag_watched");
    var uploadTagFormCheckBoxTagHidden = document.getElementById("tag_hidden");
    var uploadTagFormBehaviorResetBtn = document.getElementById("behavior_reset_btn");
    var uploadTagFormColorInput = document.getElementById("tag_color");
    var uploadTagFormColorLabel = document.getElementById("tag_color_val");
    var uploadTagFormColorResetBtn = document.getElementById("tag_color_reset_btn");
    var uploadTagFormWeightInput = document.getElementById("tag_weight");
    var uploadTagFormWeightBtn = document.getElementById("weight_reset_btn");
    var uploadTagFormTagsDiv = document.getElementById("uploadForm_tags_div");
    var uploadTagFormTagsResetBtn = document.getElementById("checkTags_reset_btn");
    var uploadTagFormSubmitBtn = document.getElementById("upload_save_btn");
    var uploadTagFormCancelBtn = document.getElementById("upload_cancel_btn");


    // 展示数据填充
    mytagsInitWindowsData(allCategoriesWindow, allCategoriesAllCheckBox, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);

    // 展开折叠功能
    extendBtn.onclick = function () {
        windowSlideUpDown(bottomDiv);
    }

    // 输入框
    searchInput.oninput = function () {
        searchOnInput(searchInput, bottomDiv, allCategoriesWindow, allCategoriesAllCheckBox, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
    }

    // 清空按钮
    clearBtn.onclick = function () {
        searchInput.value = "";
        searchOnInput(searchInput, bottomDiv, allCategoriesWindow, allCategoriesAllCheckBox, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
    }

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

    // 标签：勾选->账号
    submitCategoriesBtn.onclick = function () {
        uploadTagFormDivShow(bottomDiv, submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn);
    };

    // 偏好点击事件、隐藏点击事件、重置点击

    // 标签颜色选择事件、重置点击

    // 权重重置点击

    // 恢复全部标签点击

    // 提交按钮点击

    // 取消按钮点击、关闭按钮点击
    uploadTagFormCloseBtn.onclick = function () {
        uploadTagFormDivHidden(submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn);
    }
    uploadTagFormCancelBtn.onclick = function () {
        uploadTagFormDivHidden(submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn);
    }



    // 标签：账号->收藏


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
                var favoriteAllCheckboxs = favoriteCategoriesWindow.querySelectorAll('input[type="checkbox"]');
                for (const i in favoriteAllCheckboxs) {
                    if (Object.hasOwnProperty.call(favoriteAllCheckboxs, i)) {
                        const checkbox = favoriteAllCheckboxs[i];
                    }
                }
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
                                    <input type="checkbox" value="${v.ps_en}" id="favoriteCate_${v.ps_en}" data-visible="1" data-parent_zh="${v.parent_zh}" data-sub_zh="${v.sub_zh}" />
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
                    mytagAllSpanExtend(allCategoriesWindow);
                    mytagItemsCheckbox(allCategoriesWindow, allCategoriesAllCheckBox);
                    func_compelete();
                } else {
                    // 尝试读取ehtag表数据
                    var ehTagDict = {};
                    readAll(table_EhTagSubItems, (k, v) => {
                        ehTagDict[k] = v;
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
                                    ehtagListHtml += `<span class="mytags_item_wrapper" id="all_span_${v.ps_en}" title="${v.ps_en}">
                                        <input type="checkbox" value="${v.ps_en}" id="allCate_${v.ps_en}" data-visible="1" data-parent_zh="${v.parent_zh}" data-sub_zh="${v.sub_zh}" />
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

// 单个全部类别折叠按钮，收藏
function mytagAllSearchSpanExtend(allCategoriesWindow) {
    var allh4Spans = allCategoriesWindow.querySelectorAll("span.category_extend");
    for (const i in allh4Spans) {
        if (Object.hasOwnProperty.call(allh4Spans, i)) {
            const span = allh4Spans[i];
            span.onclick = function () {
                var displayDiv = document.getElementById(`all_items_div_${span.dataset.category}`);
                if (span.innerText == "-") {
                    // 需要折叠
                    span.innerText = "+";
                    displayDiv.style.display = "none";
                } else {
                    // 需要展开
                    span.innerText = "-";
                    displayDiv.style.display = "block";
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
    var totalCheckboxs = categoryWindow.querySelectorAll('input[type="checkbox"][data-visible="1"]');
    for (const i in totalCheckboxs) {
        if (Object.hasOwnProperty.call(totalCheckboxs, i)) {
            const checkbox = totalCheckboxs[i];
            checkbox.onclick = function () {
                var checkedboxs = categoryWindow.querySelectorAll('input[type="checkbox"][data-visible="1"]:checked');
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
        var uncheckbox = categoriesWindow.querySelectorAll('input[type="checkbox"][data-visible="1"]:not(checked)');
        for (const i in uncheckbox) {
            if (Object.hasOwnProperty.call(uncheckbox, i)) {
                const checkbox = uncheckbox[i];
                checkbox.checked = true;
            }
        }
        categoriesAllCheckBox.checked = true;
    } else {
        // 需要空选
        var totalcheckbox = categoriesWindow.querySelectorAll('input[type="checkbox"][data-visible="1"]');
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

// 更新全反选状态 (全部类别或者收藏)
function mytagUpdateAllCheckboxStatus(categoriesWindow, categoriesAllCheckBox) {
    var allcheckboxs = categoriesWindow.querySelectorAll('input[type="checkbox"][data-visible="1"]');
    var checkedboxs = categoriesWindow.querySelectorAll('input[type="checkbox"][data-visible="1"]:checked');
    if (checkedboxs.length == 0) {
        categoriesAllCheckBox.checked = false;
        categoriesAllCheckBox.indeterminate = false;
    } else {
        if (allcheckboxs.length == checkedboxs.length) {
            categoriesAllCheckBox.checked = true;
            categoriesAllCheckBox.indeterminate = false;
        } else {
            categoriesAllCheckBox.checked = false;
            categoriesAllCheckBox.indeterminate = true;
        }
    }
}

// 输入时候选
function searchOnInput(searchInput, bottomDiv, allCategoriesWindow, allCategoriesAllCheckBox, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox) {
    var inputValue = trimStartEnd(searchInput.value.toLowerCase());

    // 从 EhTag 中模糊搜索，绑定数据
    readByCursorIndexFuzzy(table_EhTagSubItems, table_EhTagSubItems_index_searchKey, inputValue, foundArrays => {

        if (inputValue == "") {
            var hides = bottomDiv.querySelectorAll(".hide");
            for (const i in hides) {
                if (Object.hasOwnProperty.call(hides, i)) {
                    const hide = hides[i];
                    hide.classList.remove("hide");
                }
            }
            var hideCheckboxs = bottomDiv.querySelectorAll('input[type="checkbox"][data-visible="0"]');
            for (const i in hideCheckboxs) {
                if (Object.hasOwnProperty.call(hideCheckboxs, i)) {
                    const checkbox = hideCheckboxs[i];
                    checkbox.dataset.visible = 1;
                }
            }

            mytagUpdateAllCheckboxStatus(allCategoriesWindow, allCategoriesAllCheckBox);
            mytagUpdateAllCheckboxStatus(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);

        } else if (foundArrays.length > 0) {

            // 遍历全部，获取需要显示的ps_en字典 和 ps 字典，用于子项显示或隐藏 以及 父级整块的隐藏显示
            var psenDict = {};
            var psDict = {};
            for (const i in foundArrays) {
                if (Object.hasOwnProperty.call(foundArrays, i)) {
                    const v = foundArrays[i];
                    psenDict[v.ps_en] = 1;
                    if (!psDict[v.parent_en]) {
                        psDict[v.parent_en] = 1;
                    }
                }
            }

            ehtagSearch(psenDict, psDict);
            favoriteSearch(psenDict, psDict);
        }
    });

    function ehtagSearch(psenDict, psDict) {
        var parentDivs = allCategoriesWindow.querySelectorAll("div");
        for (const i in parentDivs) {
            if (Object.hasOwnProperty.call(parentDivs, i)) {
                const parentDiv = parentDivs[i];
                var h4 = parentDiv.previousElementSibling;
                var ps = parentDiv.id.replace("all_items_div_", "");
                if (psDict[ps]) {
                    // 当前父子级包含搜索项
                    parentDiv.classList.remove("hide");
                    h4.classList.remove("hide");
                    h4.children[0].innerText = "-";

                    // 判断每个子项是否是搜索结果
                    var spanItems = parentDiv.querySelectorAll("span");
                    for (const s in spanItems) {
                        if (Object.hasOwnProperty.call(spanItems, s)) {
                            const span = spanItems[s];
                            var psEn = span.id.replace("all_span_", "");
                            var checkbox = span.querySelector('input[type="checkbox"]');
                            if (psenDict[psEn]) {
                                // 是搜索项
                                span.classList.remove("hide");
                                checkbox.dataset.visible = 1;
                            } else {
                                // 不是搜索项
                                span.classList.add("hide");
                                checkbox.dataset.visible = 0;
                            }
                        }
                    }
                } else {
                    // 当前父子级不包含搜索项
                    parentDiv.classList.add("hide");
                    h4.classList.add("hide");
                    var checkboxs = parentDiv.querySelectorAll('input[type="checkbox"]');
                    for (const i in checkboxs) {
                        if (Object.hasOwnProperty.call(checkboxs, i)) {
                            const checkbox = checkboxs[i];
                            checkbox.dataset.visible = 0;
                        }
                    }
                }
            }
        }
        mytagUpdateAllCheckboxStatus(allCategoriesWindow, allCategoriesAllCheckBox);
    }

    function favoriteSearch(psenDict) {
        var favoritePsEnDict = {};
        var favortePsDict = {};

        // 读取全部用户收藏数据
        readAll(table_favoriteSubItems, (k, v) => {
            if (psenDict[v.ps_en]) {
                if (!favortePsDict[v.parent_en]) {
                    favortePsDict[v.parent_en] = 1;
                }
                favoritePsEnDict[v.ps_en] = 1;
            }

        }, () => {
            var parentDivs = favoriteCategoriesWindow.querySelectorAll("div");
            for (const i in parentDivs) {
                if (Object.hasOwnProperty.call(parentDivs, i)) {
                    const parentDiv = parentDivs[i];
                    var h4 = parentDiv.previousElementSibling;
                    var ps = parentDiv.id.replace("favorite_items_div_", "");
                    if (favortePsDict[ps]) {
                        // 当前父子级包含搜索项
                        parentDiv.classList.remove("hide");
                        h4.classList.remove("hide");
                        h4.children[0].innerText = "-";

                        // 判断每个子项是否是搜索结果
                        var spanItems = parentDiv.querySelectorAll("span");
                        for (const s in spanItems) {
                            if (Object.hasOwnProperty.call(spanItems, s)) {
                                const span = spanItems[s];
                                var psEn = span.id.replace("favorite_span_", "");
                                var checkbox = span.querySelector('input[type="checkbox"]');
                                if (favoritePsEnDict[psEn]) {
                                    // 是搜索项
                                    span.classList.remove("hide");
                                    checkbox.dataset.visible = 1;
                                } else {
                                    // 不是搜索项
                                    span.classList.add("hide");
                                    checkbox.dataset.visible = 0;
                                }
                            }
                        }
                    } else {
                        // 当前父子级不包含搜索项
                        parentDiv.classList.add("hide");
                        h4.classList.add("hide");
                        var checkboxs = parentDiv.querySelectorAll('input[type="checkbox"]');
                        for (const i in checkboxs) {
                            if (Object.hasOwnProperty.call(checkboxs, i)) {
                                const checkbox = checkboxs[i];
                                checkbox.dataset.visible = 0;
                            }
                        }
                    }
                }
            }
            mytagUpdateAllCheckboxStatus(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
        });
    }
}

// 标签：勾选 -> 账号 显示弹框
function uploadTagFormDivShow(bottomDiv, submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn) {
    var checkedboxs = bottomDiv.querySelectorAll('input[type="checkbox"][data-visible="1"]:checked');
    if (checkedboxs.length == 0) {
        alert("请从 全部类别 或 本地收藏 中 勾选标签");
        return;
    }

    submitCategoriesBtn.style.display = "none";
    uploadTagFormDiv.style.display = "block";

    var checkTagsDict = {};
    for (const i in checkedboxs) {
        if (Object.hasOwnProperty.call(checkedboxs, i)) {
            const tag = checkedboxs[i];
            if (!checkTagsDict[tag.value]) {
                var ps_enArray = tag.value.split(":");
                checkTagsDict[tag.value] = {
                    ps_en: tag.value,
                    parent_en: ps_enArray[0],
                    sub_en: ps_enArray[1],
                    parent_zh: tag.dataset.parent_zh,
                    sub_zh: tag.dataset.sub_zh
                };
            }
        }
    }

    // 存在可用的收藏标签
    var fromTagsListHtml = ``;
    var lastParentEn = ``;
    for (const k in checkTagsDict) {
        if (Object.hasOwnProperty.call(checkTagsDict, k)) {
            const v = checkTagsDict[k];
            if (v.parent_en != lastParentEn) {
                if (lastParentEn != '') {
                    fromTagsListHtml += `</div>`;
                }
                lastParentEn = v.parent_en;
                // 新建父级
                fromTagsListHtml += `<h4> ${v.parent_zh} <span data-category="${v.parent_en}">-</span></h4>`;
                fromTagsListHtml += `<div id="checkTags_items_div_${v.parent_en}">`;
            }
            // 添加子级
            fromTagsListHtml += `<span class="checkTags_item" id="checkTags_${v.ps_en}" title="${v.ps_en}" data-value="${v.ps_en}" data-parent_en="${v.parent_en}" data-visible="1">${v.sub_zh} X</span>`;
        }
    }
    // 读完后操作
    if (fromTagsListHtml != ``) {
        fromTagsListHtml += `</div>`;
    }

    // 页面附加 html
    uploadTagFormTagsDiv.innerHTML = fromTagsListHtml;

    // 添加展开折叠事件
    var h4spans = uploadTagFormTagsDiv.querySelectorAll("h4>span");
    for (const i in h4spans) {
        if (Object.hasOwnProperty.call(h4spans, i)) {
            const span = h4spans[i];
            span.onclick = function () {
                var expandDiv = document.getElementById(`checkTags_items_div_${span.dataset.category}`);
                if (span.innerText == "-") {
                    // 折叠
                    expandDiv.style.display = "none";
                    span.innerText = "+";
                } else {
                    // 展开
                    expandDiv.style.display = "block";
                    span.innerText = "-";
                }
            }
        }
    }

    // 添加选中标签后隐藏事件
    var checkTagsItems = uploadTagFormTagsDiv.querySelectorAll("span.checkTags_item");
    for (const i in checkTagsItems) {
        if (Object.hasOwnProperty.call(checkTagsItems, i)) {
            const tag = checkTagsItems[i];
            tag.onclick = function () {
                tag.dataset.visible = 0;
                tag.classList.add("hide");
                var parentDiv = document.getElementById(`checkTags_items_div_${tag.dataset.parent_en}`);
                // 尝试取一个没有隐藏的，如果没有取到说明全部隐藏了
                var avisibleSub = parentDiv.querySelector('span[data-visible="1"]');
                if (!avisibleSub) {
                    // 隐藏父级，并查询是否全部都隐藏了，如果都隐藏了就显示 恢复全部标签 按钮
                    parentDiv.classList.add("hide");
                    parentDiv.previousElementSibling.classList.add("hide");
                    var tagsGetAVisibleSub = uploadTagFormTagsDiv.querySelector('span[data-visible="1"]');
                    if (!tagsGetAVisibleSub) {
                        // 显示 恢复全部标签 按钮
                        uploadTagFormTagsDiv.style.display = "none";
                        uploadTagFormTagsResetBtn.style.display = "block";
                    }
                }
            }
        }
    }
}

// 标签：勾选 -> 账号 关闭弹框
function uploadTagFormDivHidden(submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn) {
    submitCategoriesBtn.style.display = "block";
    uploadTagFormDiv.style.display = "none";
    uploadTagFormTagsDiv.innerHTML = '';
    uploadTagFormTagsDiv.style.display = "block";
    uploadTagFormTagsResetBtn.style.display = "block";

}



//#endregion