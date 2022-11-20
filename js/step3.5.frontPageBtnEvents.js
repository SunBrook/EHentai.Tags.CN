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

    // 展开动画
    if (isDisplay) {
        slideDown(displayDiv, 537, 15, function () { });

        searchCloseBtn.style.display = "block";
        slideRight(searchCloseBtn, 20, 10, function () { });
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

    // 展开动画
    if (isDisplay) {
        slideDown(displayDiv, 537, 15, function () { });

        searchCloseBtn.style.display = "block";
        slideRight(searchCloseBtn, 20, 10, function () {
        });
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

    // 折叠动画
    slideUp(displayDiv, 15, function () {
        categoryDisplayDiv.style.display = "none";
        favoritesDisplayDiv.style.display = "none";
    });
}


//#endregion