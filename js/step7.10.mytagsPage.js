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
    // 展开折叠按钮、输入框、清空按钮、勾选->账号、账号->收藏、底部div
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
    extendBtn.onclick = function () {
        if (bottomDiv.dataset.visible == 1) {
            bottomDiv.dataset.visible = 0;
            slideUp(bottomDiv, 15, () => { });
        } else {
            bottomDiv.dataset.visible = 1;
            slideDown(bottomDiv, 350, 15, () => { });
        }
    }

    // 展开折叠功能

    // 输入框

    // 清空按钮

    // 
}

// 展示数据填充
function mytagsInitWindowsData() {
    // 没有数据显示等待

    // TODO 收藏时更新我的标签收藏 HTML，接收收藏的同步消息，用于更新标签收藏 html

    // 根据收藏数据生成收藏html



    // 先尝试获取备份的全部类别html，如果没有就根据entag 生成html，如果没有ehtag 就更新ehtag 并生成最新的html。最后检查新版本

}


//#endregion