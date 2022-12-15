//#region step3.5.frontPageBtnEvents.js 首页插件的按钮点击事件
// 全部类别按钮
allCategoryBtn.onclick = function () {
    var isDisplay = displayDiv.clientHeight != 537;
    func_eh_ex(() => {
        // e-henatai
        allCategoryBtn.classList.add("chooseTab");
        categoryFavoritesBtn.classList.remove("chooseTab");
    }, () => {
        // exhentai
        allCategoryBtn.classList.add("btn_checked_class1");
        categoryFavoritesBtn.classList.remove("btn_checked_class1");
    });
    categoryDisplayDiv.style.display = "block";
    favoritesDisplayDiv.style.display = "none";
    if (checkDictNull(searchItemDict)) {
        addFavoritesBtn.style.display = "none";
        addFavoritesDisabledBtn.style.display = "block";
    }
    else {
        addFavoritesBtn.style.display = "block";
        addFavoritesDisabledBtn.style.display = "none";
    }

    // 折叠 用户收藏 的全部父级
    categoryFavoriteTempFoldAll();

    // 展开动画
    if (isDisplay) {
        slideDown(displayDiv, 537, 15, function () {
            // 展开完后，展开 全部类别 临时折叠需要展开的父级
            allCategoryTempUnFold();
        });

        searchCloseBtn.style.display = "block";
        slideRight(searchCloseBtn, 20, 10, function () { });
    }
    else {
        allCategoryTempUnFold();
    }
};

// 本地收藏按钮
categoryFavoritesBtn.onclick = function () {
    var isDisplay = displayDiv.clientHeight != 537;
    func_eh_ex(() => {
        // e-hentai
        categoryFavoritesBtn.classList.add("chooseTab");
        allCategoryBtn.classList.remove("chooseTab");
    }, () => {
        // exhentai
        categoryFavoritesBtn.classList.add("btn_checked_class1");
        allCategoryBtn.classList.remove("btn_checked_class1");
    });
    favoritesDisplayDiv.style.display = "block";
    categoryDisplayDiv.style.display = "none";

    if (favoriteSave.style.display == "block" || checkDictNull(searchItemDict)) {
        addFavoritesBtn.style.display = "none";
        addFavoritesDisabledBtn.style.display = "block";
    }
    else {
        addFavoritesBtn.style.display = "block";
        addFavoritesDisabledBtn.style.display = "none";
    }

    // 折叠 全部类别 的全部父级
    allCategoryTempFoldAll();

    // 展开动画
    if (isDisplay) {
        slideDown(displayDiv, 537, 15, function () {
            // 展开完后，展开 临时折叠用户收藏 的父级
            categoryFavoriteTempUnFold();
        });

        searchCloseBtn.style.display = "block";
        slideRight(searchCloseBtn, 20, 10, function () {
        });
    }
    else {
        categoryFavoriteTempUnFold();
    }
}


// 收起按钮
searchCloseBtn.onclick = function () {
    func_eh_ex(() => {
        // e-hentai
        allCategoryBtn.classList.remove("chooseTab");
        categoryFavoritesBtn.classList.remove("chooseTab");
    }, () => {
        // exhentai
        allCategoryBtn.classList.remove("btn_checked_class1");
        categoryFavoritesBtn.classList.remove("btn_checked_class1");
    });
    slideLeft(searchCloseBtn, 10, function () {
        searchCloseBtn.style.display = "none";
    });

    // 折叠 全部类别 和 用户收藏
    allCategoryTempFoldAll();
    categoryFavoriteTempFoldAll();

    // 折叠动画
    slideUp(displayDiv, 15, function () {
        categoryDisplayDiv.style.display = "none";
        favoritesDisplayDiv.style.display = "none";
    });
}

// 全部类别 - 全部临时折叠父级，用于收起或者切换到本地收藏页面
function allCategoryTempFoldAll() {
    allCollapse_Func();
}

// 全部类别 - 展开需要展开的父级，用于展开或者切换回全部类别页面
function allCategoryTempUnFold() {
    var complete1 = false;
    var extendSpans01 = document.getElementsByClassName("category_extend_fetish");
    var extendSpans02 = document.getElementsByClassName("category_extend_ehTag");
    read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
        if (extendResult) {
            allCategoryUnFold_Func(extendSpans01, extendResult.value);
            allCategoryUnFold_Func(extendSpans02, extendResult.value);
        } else {
            allCategoryUnFold_Func(extendSpans01, []);
            allCategoryUnFold_Func(extendSpans02, []);
        }
        complete1 = true;
    }, () => { complete1 = true; });

    var t = setInterval(() => {
        if (complete1) {
            t && clearInterval(t);
        }
    }, 10);
}

function allCategoryUnFold_Func(extendSpans, extendArray) {
    if (extendArray.length > 0) {
        for (const i in extendSpans) {
            if (Object.hasOwnProperty.call(extendSpans, i)) {
                const span = extendSpans[i];
                var parent_en = span.dataset.category;
                var itemDiv = document.getElementById("items_div_" + parent_en);
                if (extendArray.indexOf(parent_en) == -1) {
                    span.innerText = "-";
                    itemDiv.style.display = "block";
                }
            }
        }
    } else {
        for (const i in extendSpans) {
            if (Object.hasOwnProperty.call(extendSpans, i)) {
                const span = extendSpans[i];
                var parent_en = span.dataset.category;
                var itemDiv = document.getElementById("items_div_" + parent_en);
                span.innerText = "-";
                itemDiv.style.display = "block";
            }
        }
    }
}

// 本地收藏 - 全部临时折叠父级，用于收起或者切换到全部类别页面
function categoryFavoriteTempFoldAll() {
    var extendBtns = document.getElementsByClassName("favorite_extend");
    for (const i in extendBtns) {
        if (Object.hasOwnProperty.call(extendBtns, i)) {
            const btn = extendBtns[i];
            if (btn.innerHTML != "+") {
                btn.innerHTML = "+";
            }
        }
    }

    var favoriteParentData = [];
    var favoriteItemsDiv = document.getElementsByClassName("favorite_items_div");
    for (const i in favoriteItemsDiv) {
        if (Object.hasOwnProperty.call(favoriteItemsDiv, i)) {
            const div = favoriteItemsDiv[i];
            if (div.style.display != "none") {
                div.style.display = "none";
            }
            favoriteParentData.push(div.id.replace("favorite_div_", ""));
        }
    }
}

// 本地收藏 - 展开需要展开的父级，用于展开或者切换回本地收藏页面
function categoryFavoriteTempUnFold() {
    read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
        var expendBtns = document.getElementsByClassName("favorite_extend");
        if (result && result.value) {
            var expendArray = result.value;
            for (const i in expendBtns) {
                if (Object.hasOwnProperty.call(expendBtns, i)) {
                    const btn = expendBtns[i];
                    var category = btn.dataset.category;
                    var itemDiv = document.getElementById("favorite_div_" + category);
                    if (expendArray.indexOf(category) == -1) {
                        btn.innerText = "-";
                        itemDiv.style.display = "block";
                    }
                }
            }
        } else {
            for (const i in expendBtns) {
                if (Object.hasOwnProperty.call(expendBtns, i)) {
                    const btn = expendBtns[i];
                    btn.innerText = "-";
                    var category = btn.dataset.category;
                    var itemDiv = document.getElementById("favorite_div_" + category);
                    itemDiv.style.display = "block";
                }
            }
        }
    }, () => { });
}


//#endregion