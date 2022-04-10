//#region step5.1.dataSync.frontPage.js 首页数据同步

window.onstorage = function (e) {
    // try {
    console.log(e);
    switch (e.newValue) {
        case sync_oldSearchTopVisible:
            updatePageTopVisible();
            break;
        case sync_categoryList:
            updatePageCategoryList();
            break;
        case sync_favoriteList:
            updatePageFavoriteList();
            break;
        case sync_categoryList_Extend:
            updatePageCategoryListExtend();
            break;
        case sync_favoriteList_Extend:
            updatePageFavoriteListExtend();
            break;
        case sync_googleTranslate_frontPage_title:
            updateGoogleTranslateFrontPageTitle();
            break;
        case sync_setting_backgroundImage:
            updateSettingBackgroundImage();
    }
    // } catch (error) {
    //     removeDbSyncMessage();
    // }
}

// 头部搜索折叠隐藏
function updatePageTopVisible() {
    indexDbInit(() => {
        read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
            var searchBoxDiv = document.getElementById("searchbox");
            var topVisibleDiv = document.getElementById("div_top_visible_btn");
            if (result && result.value) {
                // 显示
                searchBoxDiv.children[0].style.display = "block";
                topVisibleDiv.innerText = "头部隐藏";
            } else {
                // 隐藏
                searchBoxDiv.children[0].style.display = "none";
                topVisibleDiv.innerText = "头部显示";
            }
            removeDbSyncMessage();
        }, () => {
            removeDbSyncMessage();
        });
    });
}

// 本地列表更新
function updatePageCategoryList() {
    indexDbInit(() => {
        categoryInit();
        removeDbSyncMessage();
    });
}

// 本地收藏更新
function updatePageFavoriteList() {
    // 读取收藏 html 应用到页面，如果为空，直接清空收藏页面即可
    // 读取收藏折叠并应用，每个收藏项的点击事件
    indexDbInit(() => {
        var favoriteListDiv = document.getElementById("favorites_list");
        // 退出编辑模式
        editToFavorite();

        read(table_Settings, table_Settings_key_FavoriteList_Html, result => {
            if (result && result.value) {
                // 存在收藏 html
                // 页面附加Html
                favoriteListDiv.innerHTML = result.value;
                // 小项添加点击事件
                favoriteItemsClick();
                // 折叠菜单添加点击事件
                favoriteExtendClick();
                // 设置收藏折叠
                setFavoriteExpend();
                // 更新按钮状态
                updateFavoriteListBtnStatus();
            } else {
                // 不存在收藏 html
                // 清理收藏页面
                favoriteListDiv.innerHTML = '';
                // 更新按钮状态
                updateFavoriteListBtnStatus();
            }
            // 清理通知
            removeDbSyncMessage();
        }, () => {
            // 清理通知
            removeDbSyncMessage();
        });
    });

}

// 本地列表折叠更新
function updatePageCategoryListExtend() {
    indexDbInit(() => {
        var ehTagExtendSpans = document.getElementsByClassName("category_extend_ehTag");
        read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
            if (extendResult) {
                extendDiv(ehTagExtendSpans, extendResult.value);
            } else {
                extendDiv(ehTagExtendSpans, []);
            };
        }, () => {
        });

        var fetishExtendSpans = document.getElementsByClassName("category_extend_fetish");
        read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
            if (extendResult) {
                extendDiv(fetishExtendSpans, extendResult.value);
            } else {
                extendDiv(fetishExtendSpans, []);
            }
        }, () => { });

        // 清理通知
        removeDbSyncMessage();
    });
}

// 本地收藏折叠更新
function updatePageFavoriteListExtend() {
    indexDbInit(() => {
        // 退出编辑模式
        editToFavorite();
        // 设置收藏折叠
        setFavoriteExpend();
        // 更新按钮状态
        updateFavoriteListBtnStatus();
        // 清理通知
        removeDbSyncMessage();
    });
}

// 首页谷歌翻译标题
function updateGoogleTranslateFrontPageTitle() {
    indexDbInit(() => {
        read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
            var translateCheckbox = document.getElementById("googleTranslateCheckbox");
            translateCheckbox.checked = result && result.value;
            translateMainPageTitleDisplay();
            removeDbSyncMessage();
        }, () => { removeDbSyncMessage(); });
    })
}

// 首页背景图片更新
function updateSettingBackgroundImage() {
    indexDbInit(() => {
        initBackground(() => {
            if (backgroundFormDiv.style.display == "block") {
                var bgDiv = document.getElementById("div_background_btn");
                bgDiv.style.display = "none";
            }
        });
    })
}

//#endregion