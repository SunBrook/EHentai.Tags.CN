//#region step7.10.mytagsPage.js 我的标签

var myTagUploadingGetReady = false;
var myTagUploadingPause = false;
var myTagCurrentIsWatchChecked = false;
var myTagCurrentIsHiddenChecked = false;
var myTagCurrentColor = "";
var myTagCurrentWeight = mytagDefaultWeight;
var myTagCurrentTag = "";

function mytagsPage() {
    // 添加类方便修改样式
    var outer = document.getElementById("outer");
    outer.classList.add("t_mytagsPage_outer");

    // 设置中间标签的高度
    var usertagsMassDiv = document.getElementById("usertags_mass");
    var usertagsOuterDiv = document.getElementById("usertags_outer");
    var foldHeight = 191;
    if (usertagsMassDiv) {
        foldHeight += 42;
    }
    usertagsOuterDiv.style.height = `calc(100vh - ${foldHeight}px)`;

    // 根据是否存在滚动条，来调整新增标签的位置
    mytagsAlignAll();

    // 浏览器窗口大小改变也需要调整大小
    window.onresize = function(){
        mytagsAlignAll();
    }

    // 新建插件布局
    mytagsCategoryWindow();

    // 查询是否存在上传的标签，如果存在就弹窗提示
    var uploadingDiv = document.getElementById("upload_tag_ing");
    var uploadingRemainder = document.getElementById("upload_tag_remainder");
    var uploadingRemainderCount = document.getElementById("upload_remainder_count");
    var uploadingTagSuccess = document.getElementById("upload_tag_success");
    var uploadingTagError = document.getElementById("upload_tag_error");
    var uploadingStopBtn = document.getElementById("upload_ing_stop_btn");
    var uploadingCloseWindowBtn = document.getElementById("upload_ing_window_close_btn");
    var uploadingBtn = document.getElementById("t_mytags_submitCategories_btn");

    var remainderCount = getMyTagsUploadingRemainderCount();
    if (remainderCount > 0) {
        uploadingRemainderCount.innerText = remainderCount;
        uploadingDiv.style.display = "block";
        uploadingBtn.innerText = "同步中...";
    }

    if (uploadingDiv.style.borderColor == "yellow") {
        myTagUploadingPause = true;
    }

    uploadingDiv.onmouseenter = function () {
        myTagUploadingPause = true;
    }

    uploadingDiv.onmouseleave = function () {
        myTagUploadingPause = false;
        if (uploadingCloseWindowBtn.style.display != "block" && myTagUploadingGetReady) {
            // 勾选 -> 账户 继续
            myTagUploadTagsIng(myTagCurrentIsWatchChecked, myTagCurrentIsHiddenChecked, myTagCurrentColor, myTagCurrentWeight, myTagCurrentTag);
        }
    }

    uploadingStopBtn.onclick = function () {
        remove(table_Settings, table_Settings_key_MyTagsUploadTags, () => {
            removeMyTagsUploadingRemainderCount();
            uploadingTagSuccess.style.display = "block";
            uploadingRemainder.style.display = "none";
            uploadingStopBtn.style.display = "none";
            uploadingCloseWindowBtn.style.display = "block";
            uploadingTagError.innerText = "";
            uploadingTagError.style.display = "none";
        }, () => {
            uploadingTagError.innerText = "操作失败，请重试";
            uploadingTagError.style.display = "block";
        });
    }

    uploadingCloseWindowBtn.onclick = function () {
        uploadingDiv.style.display = "none";
        uploadingTagSuccess.style.display = "none";
        uploadingRemainder.style.display = "block";
        uploadingTagError.style.display = "none";
        uploadingBtn.innerText = "标签：勾选 -> 账号";
    }


    indexDbInit(() => {
        read(table_Settings, table_Settings_key_MyTagsUploadTags, result => {
            if (result && result.value) {
                if (result.value.newTagsArray.length > 0) {
                    uploadingBtn.innerText = "同步中...";
                    var userTagsDict = myTagGetUserTagsDict();
                    var newTagsArray = result.value.newTagsArray;
                    var shiftOneTag = newTagsArray.shift();
                    while (newTagsArray.length > 0 && userTagsDict[shiftOneTag]) {
                        shiftOneTag = newTagsArray.shift();
                    }
                    if (!userTagsDict[shiftOneTag]) {
                        // 当前取出的值不匹配
                        var remainderCount = newTagsArray.length + 1;
                        uploadingRemainderCount.innerText = remainderCount;
                        uploadingDiv.style.display = "block";


                        // 更新存储
                        var settings_myTagsUploadTags = {
                            item: table_Settings_key_MyTagsUploadTags,
                            value: {
                                isWatchChecked: result.value.isWatchChecked,
                                isHiddenChecked: result.value.isHiddenChecked,
                                tagColor: result.value.tagColor,
                                tagWeight: result.value.tagWeight,
                                newTagsArray
                            }
                        };

                        myTagCurrentIsWatchChecked = result.value.isWatchChecked;
                        myTagCurrentIsHiddenChecked = result.value.isHiddenChecked;
                        myTagCurrentColor = result.value.tagColor;
                        myTagCurrentWeight = result.value.tagWeight;
                        myTagCurrentTag = shiftOneTag;

                        update(table_Settings, settings_myTagsUploadTags, () => {
                            setMyTagsUploadingRemainderCount(remainderCount - 1);
                            // 执行添加操作
                            myTagUploadingGetReady = true;
                            if (!myTagUploadingPause) {
                                myTagUploadTagsIng(myTagCurrentIsWatchChecked, myTagCurrentIsHiddenChecked, myTagCurrentColor, myTagCurrentWeight, myTagCurrentTag);
                            }
                            mytagPartTwo();
                        }, () => {
                            setMyTagsUploadingRemainderCount(remainderCount - 1);
                            myTagUploadingGetReady = true;
                            if (!myTagUploadingPause) {
                                myTagUploadTagsIng(myTagCurrentIsWatchChecked, myTagCurrentIsHiddenChecked, myTagCurrentColor, myTagCurrentWeight, myTagCurrentTag);
                            }
                            mytagPartTwo();
                        });
                    } else {
                        // 值已经取完，操作完成
                        remove(table_Settings, table_Settings_key_MyTagsUploadTags, () => {
                            removeMyTagsUploadingRemainderCount();
                            uploadingTagSuccess.style.display = "block";
                            uploadingRemainder.style.display = "none";
                            uploadingStopBtn.style.display = "none";
                            uploadingCloseWindowBtn.style.display = "block";
                            uploadingTagError.innerText = "";
                            uploadingTagError.style.display = "none";
                            uploadingBtn.innerText = "同步中...";
                            mytagPartTwo();
                        }, () => {
                            removeMyTagsUploadingRemainderCount();
                            mytagPartTwo();
                        });
                    }
                } else {
                    // 刚好同步完成
                    remove(table_Settings, table_Settings_key_MyTagsUploadTags, () => {
                        removeMyTagsUploadingRemainderCount();
                        uploadingDiv.style.display = "block";
                        uploadingTagSuccess.style.display = "block";
                        uploadingRemainder.style.display = "none";
                        uploadingStopBtn.style.display = "none";
                        uploadingCloseWindowBtn.style.display = "block";
                        uploadingTagError.innerText = "";
                        uploadingTagError.style.display = "none";
                        uploadingBtn.innerText = "同步中...";
                        mytagPartTwo();
                    }, () => {
                        removeMyTagsUploadingRemainderCount();
                        mytagPartTwo();
                    });
                }
            } else {
                mytagPartTwo();
            }
        }, () => {
            mytagPartTwo();
        });
    });
}

// 展开折叠或者屏幕大小改变时，对齐标签列表
function mytagsAlignAll() {
    var tagsetOuterFirstDiv = document.getElementById("tagset_outer").children[0];
    var usertagsOuterDiv = document.getElementById("usertags_outer");
    if (divHasScrollBar(usertagsOuterDiv)) {
        tagsetOuterFirstDiv.style.width = "180px";
    } else {
        tagsetOuterFirstDiv.style.width = "184px";
    }
}

// 同步完成后的阶段操作
function mytagPartTwo() {
    // 插件逻辑实现
    mytagsCategoryWindowEvents();
    // 底部页面翻译
    mytagsBottomTranslate();
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
                <input id="tag_weight" type="range" max="99" min="-99" id="range" step="1" value="${mytagDefaultWeight}">
                <div id="tag_weight_val">${mytagDefaultWeight}</div>
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

    // 标签：勾选 -> 账号 ING 弹框
    var uploadIngHtml = `<div id="upload_tag_ing_top">标签：勾选 -> 账号</div>
    <p id="upload_tag_ing_tips_1">鼠标移入方框，<span id="tip_pause">暂停</span></p>
    <p id="upload_tag_ing_tips_2">鼠标移出方框，<span id="tip_continue">继续</span></p>
    <p id="upload_tag_remainder">剩余 <strong id="upload_remainder_count"></strong> 个</p>
    <p id="upload_tag_success">操作完成</p>
    <p id="upload_tag_error"></p>
    <div id="upload_ing_stop_btn">中止操作 X</div><div id="upload_ing_window_close_btn">关闭窗口 X</div>`;

    var uploadIngDiv = document.createElement("div");
    uploadIngDiv.innerHTML = uploadIngHtml;
    uploadIngDiv.id = "upload_tag_ing";
    outer.insertBefore(uploadIngDiv, outer.children[0]);

    // 拖拽事件
    var x1 = 0, y1 = 0;
    var left1 = 0, top1 = 0;
    var isMouseDown1 = false;
    var uploadTagIngTop = document.getElementById("upload_tag_ing_top");
    uploadTagIngTop.onmousedown = function (e) {
        // 获取坐标xy
        x1 = e.clientX;
        y1 = e.clientY;

        // 获取左和头的偏移量
        left1 = uploadIngDiv.offsetLeft;
        top1 = uploadIngDiv.offsetTop;

        // 鼠标按下
        isMouseDown1 = true;
    }

    uploadTagIngTop.onmouseup = function () {
        isMouseDown1 = false;
    }

    window.onmousemove = function (e) {
        if (isMouseDown) {
            var nLeft = e.clientX - (x - left);
            var nTop = e.clientY - (y - top);
            uploadFormDiv.style.left = `${nLeft}px`;
            uploadFormDiv.style.top = `${nTop}px`;
        }

        if (isMouseDown1) {
            var nLeft = e.clientX - (x1 - left1);
            var nTop = e.clientY - (y1 - top1);
            uploadIngDiv.style.left = `${nLeft}px`;
            uploadIngDiv.style.top = `${nTop}px`;
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
    var uploadTagFormWeightLabel = document.getElementById("tag_weight_val");
    var uploadTagFormWeightBtn = document.getElementById("weight_reset_btn");
    var uploadTagFormTagsDiv = document.getElementById("uploadForm_tags_div");
    var uploadTagFormTagsResetBtn = document.getElementById("checkTags_reset_btn");
    var uploadTagFormSubmitBtn = document.getElementById("upload_save_btn");
    var uploadTagFormCancelBtn = document.getElementById("upload_cancel_btn");


    //#region 主插件

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

    // 勾选->账号
    submitCategoriesBtn.onclick = function () {
        if (submitCategoriesBtn.innerText == "同步中...") return;
        uploadTagFormDivShow(bottomDiv, submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn);
    };
    submitCategoriesBtn.onmouseenter = function () {
        if (submitCategoriesBtn.innerText == "同步中...") {
            submitCategoriesBtn.style.cursor = "not-allowed";
        } else {
            submitCategoriesBtn.style.cursor = "pointer";
        }
    }

    //#endregion

    //#region 标签：勾选->账号

    // 偏好点击事件、隐藏点击事件、行为重置点击
    uploadTagFormCheckBoxTagWatched.onclick = function () {
        mytagCheckBoxTagWatchedClick(uploadTagFormCheckBoxTagHidden);
    }
    uploadTagFormCheckBoxTagHidden.onclick = function () {
        mytagCheckBoxTagHiddenClick(uploadTagFormCheckBoxTagWatched);
    }
    uploadTagFormBehaviorResetBtn.onclick = function () {
        mytagBehaviorReset(uploadTagFormCheckBoxTagWatched, uploadTagFormCheckBoxTagHidden);
    }

    // 标签颜色选择事件、重置点击
    uploadTagFormColorInput.onchange = function () {
        mytagColorChange(uploadTagFormColorInput, uploadTagFormColorLabel);
    }
    uploadTagFormColorResetBtn.onclick = function () {
        mytagColorReset(uploadTagFormColorInput, uploadTagFormColorLabel);
    }

    // 权重选择事件
    uploadTagFormWeightInput.oninput = function () {
        mytagWeightChange(uploadTagFormWeightInput, uploadTagFormWeightLabel);
    }

    // 权重重置点击
    uploadTagFormWeightBtn.onclick = function () {
        mytagWeightReset(uploadTagFormWeightInput, uploadTagFormWeightLabel);
    }

    // 恢复全部标签点击
    uploadTagFormTagsResetBtn.onclick = function () {
        mytagUploadTagFormTagsReset(uploadTagFormTagsResetBtn, uploadTagFormTagsDiv);
    }

    // 提交按钮点击
    uploadTagFormSubmitBtn.onclick = function () {
        mytagUploadSubmit(uploadTagFormTagsDiv, uploadTagFormDiv, submitCategoriesBtn,
            uploadTagFormCheckBoxTagWatched, uploadTagFormCheckBoxTagHidden, uploadTagFormColorInput, uploadTagFormWeightInput);
    }

    // 取消按钮点击、关闭按钮点击
    uploadTagFormCloseBtn.onclick = function () {
        uploadTagFormDivHidden(submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn);
    }
    uploadTagFormCancelBtn.onclick = function () {
        uploadTagFormDivHidden(submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn);
    }

    //#endregion

    //#region 标签：账号->收藏
    clodToFavoriteBtn.onclick = function () {
        if (clodToFavoriteBtn.innerText == "同步中...") return;
        mytagClodToFavorite(clodToFavoriteBtn, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
    }
    clodToFavoriteBtn.onmousemove = function () {
        if (clodToFavoriteBtn.innerText == "同步中...") {
            clodToFavoriteBtn.style.cursor = "not-allowed";
        } else {
            clodToFavoriteBtn.style.cursor = "pointer";
        }
    }
    //#endregion

    //#region 消息通知
    window.onstorage = function (e) {
        try {
            console.log(e);
            switch (e.newValue) {
                case sync_mytagsAllTagUpdate:
                    syncMytagsAllTagUpdate();
                    break;
                case sync_mytagsFavoriteTagUpdate:
                    syncMytagsFavoriteTagUpdate();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    // 全部标签同步更新
    function syncMytagsAllTagUpdate() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_MyTagsAllCategory_Html, result => {
                if (result && result.value) {
                    allCategoriesWindow.innerHTML = result.value;
                    mytagAllSpanExtend(allCategoriesWindow);
                    mytagItemsCheckbox(allCategoriesWindow, allCategoriesAllCheckBox);
                } else {
                    allCategoriesWindow.innerHTML = "";
                }
                allCategoriesAllCheckBox.checked = false;
                allCategoriesAllCheckBox.indeterminate = false;
            }, () => { });
        });
    }

    // 收藏标签同步更新
    function syncMytagsFavoriteTagUpdate() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_MyTagsFavoriteCategory_Html, result => {
                if (result && result.value) {
                    favoriteCategoriesWindow.innerHTML = result.value;
                    mytagFavoriteSpanExtend(favoriteCategoriesWindow);
                    mytagItemsCheckbox(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
                } else {
                    favoriteCategoriesWindow.innerHTML = "";
                }
                favoriteCategoriesAllCheckBox.checked = false;
                favoriteCategoriesAllCheckBox.indeterminate = false;
            }, () => { });
        });
    }
    //#endregion

}

//#region mytag 主插件方法

// 展开折叠插件窗口功能
function windowSlideUpDown(bottomDiv) {
    // 计算编辑好标签列表的高度
    // 展开后，剩余高度 100vh - 其他高度
    var usertagsMassDiv = document.getElementById("usertags_mass");
    var usertagsOuterDiv = document.getElementById("usertags_outer");


    if (bottomDiv.dataset.visible == 1) {
        bottomDiv.dataset.visible = 0;

        var foldHeight = 191;
        if (usertagsMassDiv) {
            foldHeight += 42;
        }
        slideUp(bottomDiv, 15, () => {
            usertagsOuterDiv.style.height = `calc(100vh - ${foldHeight}px)`;
            mytagsAlignAll();
        });
    } else {
        bottomDiv.dataset.visible = 1;

        var expendHeight = 541;
        if (usertagsMassDiv) {
            expendHeight += 42;
        }

        usertagsOuterDiv.style.height = `calc(100vh - ${expendHeight}px)`;
        slideDown(bottomDiv, 350, 15, () => {
            mytagsAlignAll();
        });
    }
}

// 生成收藏标签html
function mytagsBuildFavoriteTagHtml(favoriteDict) {
    var favoritesTagListHtml = ``;
    var lastParentEn = ``;
    for (const k in favoriteDict) {
        if (Object.hasOwnProperty.call(favoriteDict, k)) {
            const v = favoriteDict[k];
            if (v.parent_en != lastParentEn) {
                if (lastParentEn != '') {
                    favoritesTagListHtml += `</div>`;
                }
                lastParentEn = v.parent_en;
                // 新建父级
                favoritesTagListHtml += `<h4> ${v.parent_zh} <span data-category="${v.parent_en}" class="category_extend category_extend_mytags">-</span></h4>`;
                favoritesTagListHtml += `<div id="favorite_items_div_${v.parent_en}">`;
            }
            // 添加子级
            favoritesTagListHtml += `<span class="mytags_item_wrapper" id="favorite_span_${v.ps_en}" title="${v.ps_en}">
                                    <input type="checkbox" value="${v.ps_en}" id="favoriteCate_${v.ps_en}" data-visible="1" data-parent_zh="${v.parent_zh}" data-sub_zh="${v.sub_zh}" />
                                    <label for="favoriteCate_${v.ps_en}">${v.sub_zh}</label>
                                </span>`;
        }
    }
    // 读完后操作
    if (favoritesTagListHtml != ``) {
        favoritesTagListHtml += `</div>`;
    }
    return favoritesTagListHtml;
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
                            var favoritesTagListHtml = mytagsBuildFavoriteTagHtml(favoriteDict);
                            // 页面附加 html
                            favoriteCategoriesWindow.innerHTML = favoritesTagListHtml;
                            mytagFavoriteSpanExtend(favoriteCategoriesWindow);
                            mytagItemsCheckbox(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);

                            // 存储收藏 html
                            var settings_myTagsFavoriteCategory_html = {
                                item: table_Settings_key_MyTagsFavoriteCategory_Html,
                                value: favoritesTagListHtml
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
                    h4.nextElementSibling.style.display = "block";

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

//#endregion

//#region mytag 标签：勾选 -> 账号

// 显示弹框
function uploadTagFormDivShow(bottomDiv, submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn) {
    var checkedboxs = bottomDiv.querySelectorAll('input[type="checkbox"][data-visible="1"]:checked');
    if (checkedboxs.length == 0) {
        alert("请从 全部类别 或 本地收藏 中 勾选标签");
        return;
    }

    submitCategoriesBtn.style.display = "none";
    uploadTagFormDiv.style.display = "block";
    uploadTagFormTagsResetBtn.style.display = "none";

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

// 关闭弹框
function uploadTagFormDivHidden(submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn) {
    submitCategoriesBtn.style.display = "block";
    uploadTagFormDiv.style.display = "none";
    uploadTagFormTagsDiv.innerHTML = '';
    uploadTagFormTagsDiv.style.display = "block";
    uploadTagFormTagsResetBtn.style.display = "block";

}

// 恢复全部标签
function mytagUploadTagFormTagsReset(uploadTagFormTagsResetBtn, uploadTagFormTagsDiv) {
    uploadTagFormTagsDiv.style.display = "block";
    uploadTagFormTagsResetBtn.style.display = "none";

    var tagHides = uploadTagFormTagsDiv.querySelectorAll(".hide");
    for (const i in tagHides) {
        if (Object.hasOwnProperty.call(tagHides, i)) {
            const tagHide = tagHides[i];
            tagHide.classList.remove("hide");
        }
    }

    var spanVisibles = uploadTagFormTagsDiv.querySelectorAll('span[data-visible="0"]');
    for (const i in spanVisibles) {
        if (Object.hasOwnProperty.call(spanVisibles, i)) {
            const span = spanVisibles[i];
            span.dataset.visible = 1;
        }
    }
}

// 偏好点击事件
function mytagCheckBoxTagWatchedClick(uploadTagFormCheckBoxTagHidden) {
    if (uploadTagFormCheckBoxTagHidden.checked) {
        uploadTagFormCheckBoxTagHidden.checked = false;
    }
}

// 隐藏点击事件
function mytagCheckBoxTagHiddenClick(uploadTagFormCheckBoxTagWatched) {
    if (uploadTagFormCheckBoxTagWatched.checked) {
        uploadTagFormCheckBoxTagWatched.checked = false;
    }
}

// 行为重置点击
function mytagBehaviorReset(uploadTagFormCheckBoxTagWatched, uploadTagFormCheckBoxTagHidden) {
    uploadTagFormCheckBoxTagWatched.checked = false;
    uploadTagFormCheckBoxTagHidden.checked = false;
}

// 标签颜色改变
function mytagColorChange(uploadTagFormColorInput, uploadTagFormColorLabel) {
    uploadTagFormColorLabel.innerText = uploadTagFormColorInput.value;
}

// 标签颜色重置
function mytagColorReset(uploadTagFormColorInput, uploadTagFormColorLabel) {
    uploadTagFormColorInput.value = mytagDefaultColor;
    uploadTagFormColorLabel.innerText = "默认颜色";
}

// 标签权重选择
function mytagWeightChange(uploadTagFormWeightInput, uploadTagFormWeightLabel) {
    uploadTagFormWeightLabel.innerText = uploadTagFormWeightInput.value;
}

// 标签权重重置
function mytagWeightReset(uploadTagFormWeightInput, uploadTagFormWeightLabel) {
    uploadTagFormWeightInput.value = mytagDefaultWeight;
    uploadTagFormWeightLabel.innerText = mytagDefaultWeight;
}

// 标签上传
function mytagUploadSubmit(uploadTagFormTagsDiv, uploadTagFormDiv, submitCategoriesBtn,
    uploadTagFormCheckBoxTagWatched, uploadTagFormCheckBoxTagHidden, uploadTagFormColorInput, uploadTagFormWeightInput) {
    // 判断是否选中标签，没有选中标签提示选中
    var checkedTags = uploadTagFormTagsDiv.querySelectorAll('span.checkTags_item[data-visible="1"]');
    if (checkedTags.length == 0) {
        alert("请恢复全部标签");
        return;
    }

    // 读取用户账号标签，比对当前选中标签，过滤得到新增标签
    var userTagsDict = myTagGetUserTagsDict();

    var newTagsArray = [];
    for (const i in checkedTags) {
        if (Object.hasOwnProperty.call(checkedTags, i)) {
            const checkTag = checkedTags[i];
            var checkValue = checkTag.dataset.value;
            if (!userTagsDict[checkValue]) {
                newTagsArray.push(checkValue);
            }
        }
    }

    if (newTagsArray.length == 0) {
        // 没有需要新增的标签
        uploadTagFormDiv.style.display = "none";
        submitCategoriesBtn.style.display = "block";

        setTimeout(function () {
            submitCategoriesBtn.innerText = "同步完成";
        }, 250);
        setTimeout(function () {
            submitCategoriesBtn.innerText = "标签：勾选 -> 账号";
        }, 500);

        return;
    }

    // 读取标签行为、颜色、权重
    var isWatchChecked = uploadTagFormCheckBoxTagWatched.checked;
    var isHiddenChecked = uploadTagFormCheckBoxTagHidden.checked;
    var tagColor = uploadTagFormColorInput.value == mytagDefaultColor ? "" : uploadTagFormColorInput.value;
    var tagWeight = uploadTagFormWeightInput.value;



    // 保存到配置表中，每次打开页面读取并提交
    indexDbInit(() => {
        var settings_myTagsUploadTags = {
            item: table_Settings_key_MyTagsUploadTags,
            value: {
                isWatchChecked,
                isHiddenChecked,
                tagColor,
                tagWeight,
                newTagsArray
            }
        };

        update(table_Settings, settings_myTagsUploadTags, () => {
            uploadTagFormDiv.style.display = "none";
            submitCategoriesBtn.style.display = "block";
            submitCategoriesBtn.innerText = "同步中...";

            var uploadingRemainderCount = document.getElementById("upload_remainder_count");
            uploadingRemainderCount.innerText = newTagsArray.length;
            var uploadingDiv = document.getElementById("upload_tag_ing");
            uploadingDiv.style.display = "block";

            setMyTagsUploadingRemainderCount(newTagsArray.length);
            var tag = newTagsArray.shift();
            myTagUploadTagsIng(isWatchChecked, isHiddenChecked, tagColor, tagWeight, tag);
        }, () => {
            alert("操作失败，请重试");
        });
    })

}

// 单个同步勾选标签到账号中
function myTagUploadTagsIng(isWatchChecked, isHiddenChecked, tagColor, tagWeight, tag) {
    var tagnameNew = document.getElementById("tagname_new");
    if (tagnameNew) {
        tagnameNew.value = tag;
        var tagwatch = document.getElementById("tagwatch_0");
        tagwatch.checked = isWatchChecked;
        var taghide = document.getElementById("taghide_0");
        taghide.checked = isHiddenChecked;
        var tagcolor = document.getElementById("tagcolor_0");
        tagcolor.value = tagColor;
        var tagweight = document.getElementById("tagweight_0");
        tagweight.value = tagWeight;
        var submitBtn = document.getElementById("tagsave_0");
        submitBtn.removeAttribute("disabled");
        submitBtn.click();
    } else {
        // 账号标签名额用完
        var uploadTagError = document.getElementById("upload_tag_error");
        uploadTagError.innerText = "账号标签名额已用完，无法继续添加，请中止操作";
        uploadTagError.style.display = "block";
        var uploadingStopBtn = document.getElementById("upload_ing_stop_btn");
        uploadingStopBtn.style.display = "block";
        var uploadingCloseWindowBtn = document.getElementById("upload_ing_window_close_btn");
        uploadingCloseWindowBtn.style.display = "none";
    }
}

// 获取页面中账号标签
function myTagGetUserTagsDict() {
    var userTagsDict = {};
    var usertagsOuter = document.getElementById("usertags_outer");
    var userTagLinks = usertagsOuter.querySelectorAll("a");
    var replaceTxt = `${webOrigin}/tag/`;
    for (const i in userTagLinks) {
        if (Object.hasOwnProperty.call(userTagLinks, i)) {
            const a = userTagLinks[i];
            var psEn = a.href.replace(replaceTxt, "").replace(/\+/g, " ");
            userTagsDict[psEn] = 1;
        }
    }
    return userTagsDict;
}

//#endregion

//#region mytag 标签：账号 -> 收藏
function mytagClodToFavorite(clodToFavoriteBtn, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox) {
    clodToFavoriteBtn.innerText = "同步中..."
    var userTagsDict = myTagGetUserTagsDict();
    if (checkDictNull(userTagsDict)) {
        mytagClodToFavoriteFinish(clodToFavoriteBtn);
        return;
    }

    var oldTagFavoriteDict = {};
    var newTagFavoriteArray = [];

    readAll(table_favoriteSubItems, (k, v) => {
        oldTagFavoriteDict[v.ps_en] = 1;
    }, () => {
        for (const k in userTagsDict) {
            if (Object.hasOwnProperty.call(userTagsDict, k)) {
                if (!oldTagFavoriteDict[k]) {
                    newTagFavoriteArray.push(k);
                }
            }
        }

        if (newTagFavoriteArray.length == 0) {
            mytagClodToFavoriteFinish(clodToFavoriteBtn);
            return;
        }

        var newTagFavoriteDict = {};
        var index = 0;
        var newTagCount = 0;
        for (const i in newTagFavoriteArray) {
            if (Object.hasOwnProperty.call(newTagFavoriteArray, i)) {
                const newTag = newTagFavoriteArray[i];
                read(table_EhTagSubItems, newTag, result => {
                    if (result) {
                        newTagFavoriteDict[result.ps_en] = {
                            parent_en: result.parent_en,
                            parent_zh: result.parent_zh,
                            ps_en: result.ps_en,
                            sub_desc: result.sub_desc,
                            sub_en: result.sub_en,
                            sub_zh: result.sub_zh
                        };
                        newTagCount++;
                    }
                    index++;
                }, () => { index++; });
            }
        }

        var t = setInterval(() => {
            if (index == newTagFavoriteArray.length) {
                t && clearInterval(t);
                console.log(newTagFavoriteDict);

                // 更新收藏表，更新收藏 html 和页面，添加通知
                var complete1 = false;
                var complete2 = false;

                // 批量添加收藏数据
                batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, newTagFavoriteDict, newTagCount, () => {

                    // 读取收藏全部数据，生成更新收藏html，通知消息
                    var favoriteDict = {};
                    var favoritesListHtml = ``;
                    var lastParentEn = ``;
                    readAll(table_favoriteSubItems, (k, v) => {
                        favoriteDict[k] = v;
                        if (v.parent_en != lastParentEn) {
                            if (lastParentEn != '') {
                                favoritesListHtml += `</div>`;
                            }
                            lastParentEn = v.parent_en;
                            // 新建父级
                            favoritesListHtml += `<h4 id="favorite_h4_${v.parent_en}">${v.parent_zh}<span data-category="${v.parent_en}"
                                class="favorite_extend">-</span></h4>`;
                            favoritesListHtml += `<div id="favorite_div_${v.parent_en}" class="favorite_items_div">`;
                        }

                        // 添加子级
                        favoritesListHtml += `<span class="c_item c_item_favorite" title="[${v.sub_en}] ${v.sub_desc}" data-item="${v.sub_en}" 
                                    data-parent_en="${v.parent_en}" data-parent_zh="${v.parent_zh}">${v.sub_zh}</span>`;
                    }, () => {
                        if (favoritesListHtml != ``) {
                            favoritesListHtml += `</div>`;
                        }

                        var settings_favoriteList_html = {
                            item: table_Settings_key_FavoriteList_Html,
                            value: favoritesListHtml
                        };

                        update(table_Settings, settings_favoriteList_html, () => {
                            // 消息通知
                            setDbSyncMessage(sync_favoriteList);
                            complete1 = true;
                        }, () => { complete1 = true; });

                        // 读取可用标签的父级
                        var parentDict = {};
                        readAll(table_detailParentItems, (k, v) => {
                            parentDict[k] = v;
                        }, () => {
                            // 过滤得到可用的收藏
                            var newFavoriteTagDict = {};
                            for (const ps_en in favoriteDict) {
                                if (Object.hasOwnProperty.call(favoriteDict, ps_en)) {
                                    var value = favoriteDict[ps_en];
                                    if (parentDict[value.parent_en]) {
                                        newFavoriteTagDict[ps_en] = value;
                                    }
                                }
                            }

                            // 重新生成收藏 html
                            var favoritesTagListHtml = mytagsBuildFavoriteTagHtml(newFavoriteTagDict);
                            // 页面附加 html
                            favoriteCategoriesWindow.innerHTML = favoritesTagListHtml;
                            mytagFavoriteSpanExtend(favoriteCategoriesWindow);
                            mytagItemsCheckbox(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
                            // 收藏全选按钮重置
                            favoriteCategoriesAllCheckBox.checked = false;
                            favoriteCategoriesAllCheckBox.indeterminate = false;

                            // 存储收藏 html
                            var settings_myTagsFavoriteCategory_html = {
                                item: table_Settings_key_MyTagsFavoriteCategory_Html,
                                value: favoritesTagListHtml
                            };
                            update(table_Settings, settings_myTagsFavoriteCategory_html, () => {
                                complete2 = true;
                                // 通知消息
                                setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                            }, () => {
                                complete2 = true;
                            });
                        });
                    });
                });

                var t2 = setInterval(() => {
                    if (complete1 && complete2) {
                        t2 && clearInterval(t2);
                        mytagClodToFavoriteFinish(clodToFavoriteBtn);
                    }
                })
            }
        }, 50);
    });
}

function mytagClodToFavoriteFinish(clodToFavoriteBtn) {
    setTimeout(function () {
        clodToFavoriteBtn.innerText = "同步完成";
    }, 250);
    setTimeout(function () {
        clodToFavoriteBtn.innerText = "标签：账号 -> 收藏";
    }, 500);
}
//#endregion

//#region 底部页面翻译

function mytagsBottomTranslate() {
    // 跨越
    crossDomain();

    // 翻译头部
    var tagsetOuter = document.getElementById("tagset_outer");
    var renameBtn = tagsetOuter.children[0].children[0];
    renameBtn.value = "重命名";
    renameBtn.onclick = do_tagset_rename_copy;

    // 翻译错误提示，如果存在的话
    var msgDiv = document.getElementById("msg");
    if (msgDiv) {
        var msgPs = msgDiv.querySelectorAll("p");
        for (const i in msgPs) {
            if (Object.hasOwnProperty.call(msgPs, i)) {
                const p = msgPs[i];
                if (mytagMsgRenameDict[p.innerText]) {
                    p.innerText = mytagMsgRenameDict[p.innerText];
                } else {
                    translatePageElement(p);
                }
            }
        }
    }

    // 启用方案
    var enableLabel = tagsetOuter.children[2].children[0];
    enableLabel.title = "是否启用标签方案";
    enableLabel.childNodes[2].data = " 启用";

    // 方案标签的默认颜色
    var solutionColorInput = tagsetOuter.children[4].children[0];
    solutionColorInput.title = "标签方案的标签默认颜色，如果不填，则使用默认颜色";
    solutionColorInput.setAttribute("placeholder", "# 标签颜色");

    // 方案保存按钮
    var solutionSaveBtn = tagsetOuter.children[5].children[0];
    solutionSaveBtn.value = "保存";

    // 详细标签信息
    var mytagsDivs = document.getElementById("usertags_outer");
    if (mytagsDivs) {
        for (let i = 0; i < mytagsDivs.children.length; i++) {
            const tagDiv = mytagsDivs.children[i];
            var id = tagDiv.id.replace("usertag_", "");
            if (id == "0") {
                // 第一列，可以新增
                var aInput = tagDiv.children[0].children[0].children[0];
                aInput.setAttribute("placeholder", "请输入一个标签名称，用来设置偏好或者隐藏");
                // 翻译保存按钮
                var aSaveBtn = tagDiv.children[6].children[0];
                aSaveBtn.value = "保存";
            } else {
                // 添加好的标签，需要翻译
                var alink = tagDiv.children[0].children[0];
                var replaceTxt = `${webOrigin}/tag/`;
                var psEn = alink.href.replace(replaceTxt, "").replace(/\+/g, " ");

                function translatePsEn(psEn, alink) {
                    read(table_EhTagSubItems, psEn, result => {
                        if (result) {
                            alink.children[0].innerText = `${result.parent_zh} : ${result.sub_zh}`;
                        }
                    }, () => { });
                }

                translatePsEn(psEn, alink);
            }


            // 偏好
            var watchLabel = tagDiv.children[1].children[0];
            watchLabel.title = "偏好页面包含此标签";
            watchLabel.childNodes[2].data = " 偏好";
            watchLabel.children[0].dataset.id = id;
            watchLabel.children[0].addEventListener("change", function (e) {
                mytagSaveBtnTranslate(e.target.dataset.id);
            })


            // 隐藏
            var hiddenLabel = tagDiv.children[2].children[0];
            hiddenLabel.title = "网站隐藏该标签的作品";
            hiddenLabel.childNodes[2].data = " 隐藏";
            hiddenLabel.children[0].dataset.id = id;
            hiddenLabel.children[0].addEventListener("change", function (e) {
                mytagSaveBtnTranslate(e.target.dataset.id);
            });

            var tagColorInput = tagDiv.children[4].children[0];
            tagColorInput.title = "标签默认颜色，如果不填，则使用默认颜色";
            tagColorInput.setAttribute("placeholder", "# 标签颜色");


            // 权重
            var tagWeight = tagDiv.children[5].children[0];
            tagWeight.title = "（可选）此标签的权重。这用于标签进行排序（如果存在多个标记），以及计算此标签对软标签筛选器和监视阈值的门槛。";
            tagWeight.dataset.id = id;
            tagWeight.addEventListener("keyup", function (e) {
                mytagSaveBtnTranslate(e.target.dataset.id);
            });
        }

        var script = document.createElement('script');
        script.innerHTML = `function update_tagcolor(d, b, f) {
                var c = d > -1 ? "_" + d : "";
                var a = (b + "")
                    .replace("#", "")
                    .toUpperCase();
                if (a.length > 6) {
                    a = a.substring(0, 6)
                }
                if (valid_colorcode(a)) {
                    document.getElementById("tagcolor" + c)
                        .value = "#" + a;
                    if (f !== false) {
                        document.getElementById("colorsetter" + c)
                            .jscolor.fromString(a)
                    }
                    if (f === false || f !== a) {
                        allow_tagsave(d);
                        var saveBtn = document.getElementById("tagsave_" + d);
                        if (saveBtn) {
                            saveBtn.value = "保存";
                        }
                        if (d > 0) {
                            update_tagpreview(d)
                        }
                    }
                } else {
                    if (a == "") {
                        document.getElementById("colorsetter" + c)
                            .jscolor.fromString(default_color);
                        if (f !== a) {
                            allow_tagsave(d);
                            var saveBtn = document.getElementById("tagsave_" + d);
                            if (saveBtn) {
                                saveBtn.value = "保存";
                            }
                        }
                        if (d > 0) {
                            update_tagpreview(d)
                        }
                    }
                }
                if (a !== "" && !valid_colorcode(a)) {
                    var e = document.getElementById("tagsave" + c);
                    if (e != undefined) {
                        e.disabled = "disabled";
                        e.title = "The specified color code is not valid";
                        document.getElementById("tagcolor" + c)
                            .style.borderColor = "#FF0000"
                    }
                }
            }`;
        document.head.appendChild(script);
    }

    // 底部翻译
    var mytagsBottomDiv = document.getElementById("usertags_mass");
    if (mytagsBottomDiv) {
        var actionTxt = mytagsBottomDiv.children[3];
        actionTxt.innerHTML = "操作：";
        var actionOptions = mytagsBottomDiv.children[2].children[0].children;
        for (const i in actionOptions) {
            if (Object.hasOwnProperty.call(actionOptions, i)) {
                const option = actionOptions[i];
                if (option.innerText == "Delete Selected") {
                    option.innerText = "删除选中";
                } else {
                    // 预料之外的下拉项
                    translatePageElement(options);
                }
            }
        }
        var deleteBtn = mytagsBottomDiv.children[1].children[0];
        deleteBtn.value = "确认删除";
        deleteBtn.onclick = do_usertags_mass_copy;
    }

}

function mytagSaveBtnTranslate(id) {
    var saveBtn = document.getElementById(`tagsave_${id}`);
    if (saveBtn) {
        saveBtn.value = "保存";
    }
}

function do_tagset_rename_copy() {
    var a = prompt("为标签方案重命名（请输入英文，不支持中文名称）", tagset_name);
    if (a != null) {
        document.getElementById("tagset_name")
            .value = a;
        do_tagset_post("rename")
    }
}

function do_usertags_mass_copy() {
    var a = count_selected_usertags();
    if (a < 1) {
        alert("请先勾选标签")
    } else {
        var b = parseInt(document.getElementById("usertag_target")
            .value);
        if (b == 0) {
            if (!confirm(`确认从方案 "${tagset_name}" 中删除 ${a} 项标签?`)) {
                return
            }
        }
        do_usertags_post("mass")
    }
}


//#endregion

//#endregion