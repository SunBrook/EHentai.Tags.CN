//#region step7.8.uconfigPage.js 设置页面

function uconfigPage() {
    // 跨域
    crossDomain();

    // 添加样式方便调整页面样式
    var outer = document.getElementById("outer");
    outer.classList.add("t_uconfigPage_outer");

    // eh 二级菜单翻译
    func_eh_ex(() => {
        var menu2 = document.getElementById("lb").children[2];
        menu2.innerText = " 我的设置 ";
    }, () => { });


    // 头部翻译
    uconfigPageTopDiv();

    var contentForm = outer.querySelectorAll("form")[1];
    var settingH2s = contentForm.querySelectorAll("h2");

    // Image Load Settings
    uconfigPageImageLoadSettings(settingH2s[0]);

    // Image Size Settings
    uconfigImageSizeSettings(settingH2s[1]);

    // Gallery Name Display
    uconfigPageGalleryNameDisplay(settingH2s[2]);

    // Archiver Settings
    uconfigPageArchiverSettings(settingH2s[3]);

    // Front Page Settings
    uconfigPageFrontPageSettings(settingH2s[4]);

    // Favorites
    uconfigPageFavorites(settingH2s[5]);

    // Ratings
    uconfigPageRatings(settingH2s[6]);

    // Tag Namespaces
    uconfigPageTagNamespaces(settingH2s[7]);

    // Tag Filtering Threshold
    uconfigPageTagFilteringThreshold(settingH2s[8]);

    // Tag Watching Threshold
    uconfigTagWatchingThreshold(settingH2s[9]);

    // Excluded Languages
    uconfigTagExcludedLanguages(settingH2s[10]);

    // Excluded Uploaders
    uconfigPageExcludedUploaders(settingH2s[11]);

    // Search Result Count
    uconfigPageSearchResultCount(settingH2s[12]);

    // Thumbnail Settings
    uconfigPageThumbnailSettings(settingH2s[13]);

    // Thumbnail Scaling
    uconfigPageThumbnailScaling(settingH2s[14]);

    // Viewport Override
    uconfigPageViewportOverride(settingH2s[15]);

    // Gallery Comments
    uconfigPageGalleryComments(settingH2s[16]);

    // Gallery Tags
    uconfigPageGalleryTags(settingH2s[17]);

    // Gallery Page Numbering
    uconfigPageGalleryPageNumbering(settingH2s[18]);

    // 单独包裹一层，将除保存按钮外的全部元素包裹，然后添加保存按钮
    uconfigPageReWrapperForm(contentForm);

    // 保存更改
    contentForm.lastElementChild.children[0].value = "保存修改";
}

// 头部翻译
function uconfigPageTopDiv() {
    var profileOuter = document.getElementById("profile_outer");
    var profileForm = document.getElementById("profile_form");
    var profileAction = document.getElementById("profile_action");
    var profileName = document.getElementById("profile_name");
    var select = profileForm.querySelectorAll("select")[0];

    var profileSelect = document.getElementById("profile_select");
    var selectProfile = profileSelect.children[0];
    var profileActionDiv = profileOuter.querySelector("div#profile_action");
    if (profileActionDiv.children.length > 0) {
        // 删除配置
        var deletebtn = profileActionDiv.children[0];
        deletebtn.value = "删除配置";
        deletebtn.onclick = function () {
            var selectedIndex = select.selectedIndex;
            var selectText = select.options[selectedIndex].text;
            if (confirm(`是否删除配置："${selectText}" ?`)) {
                profileAction.value = "delete";
                profileForm.submit();
            }
        }

        // 设置为默认
        var defaultBtn = profileActionDiv.children[1];
        defaultBtn.value = "设为默认";
        defaultBtn.onclick = function () {
            var selectedIndex = select.selectedIndex;
            var selectText = select.options[selectedIndex].text;
            if (confirm(`将配置："${selectText}" 设为默认?`)) {
                profileAction.value = "default";
                profileForm.submit();
            }
        }

        selectProfile.innerText = "配置名称：";
    } else {
        selectProfile.innerText = "配置名称 [ 使用中 ] ：";
    }

    var topbtnDiv = profileSelect.children[2];
    var renameBtn = topbtnDiv.children[0];
    renameBtn.value = "重命名";

    var promptTips = "\r\n\r\n -- 建议 -- \r\n1. 请输入英文、数字，不支持中文等其他语种。\r\n2. 输入字符长度不能超过20。\r\n3. 尽量不要使用默认名称 \"Default Profile\"，如果使用该默认名称，在存在多个配置页情况下，设置默认配置页时，配置名称会互换。";

    renameBtn.onclick = function () {
        var promptText = `重命名：请输入配置名称 ${promptTips}`;
        var selectedIndex = select.selectedIndex;
        var selectText = select.options[selectedIndex].text.replace(" (Default)", "");
        var name = prompt(promptText, selectText);
        if (name != null) {
            profileAction.value = "rename";
            profileName.value = name;
            profileForm.submit();
        }
    }

    if (topbtnDiv.children.length > 1) {
        var createNewBtn = topbtnDiv.children[1];
        createNewBtn.value = "新建配置";
        createNewBtn.onclick = function () {
            var promptText = `新建配置：请输入配置名称 ${promptTips}`;
            var name = prompt(promptText, "New Profile");
            if (name != null) {
                profileAction.value = "create";
                profileName.value = name;
                profileForm.submit();
            }
        }
    }

    // 错误提示
    var msgDiv = document.getElementById("msg");
    if (msgDiv) {
        var msgText = msgDiv.innerText;
        switch (msgText) {
            case "Name must be less than 20 characters.":
                msgDiv.innerText = "操作失败：字符长度不能超过20。";
                func_eh_ex(() => {
                    msgDiv.style.color = "red";
                }, () => {
                    msgDiv.style.color = "yellow";
                });
                break;
            case "Name contains invalid characters.":
                msgDiv.innerText = "操作失败：输入中存在非法字符。"
                func_eh_ex(() => {
                    msgDiv.style.color = "red";
                }, () => {
                    msgDiv.style.color = "yellow";
                });
                break;
            case "Settings were updated":
                msgDiv.innerText = "操作成功：设置已更新。"
                msgDiv.style.color = "lightgreen";
                func_eh_ex(() => {
                    msgDiv.style.color = "black";
                }, () => {
                    msgDiv.style.color = "lightgreen";
                });
                break;
            default:
                msgDiv.innerText = `${msgDiv.innerText}`;
                translatePageElementEN(msgDiv);
                break;
        }
    }
}

// 图片加载设置
function uconfigPageImageLoadSettings(titleH2) {
    titleH2.innerText = "-- 图片加载设置 --";

    var loadSelectDiv = titleH2.nextElementSibling;
    var p = loadSelectDiv.querySelector("p");
    p.innerText = "1. 你是否希望通过 Hentai@Home 网络加载图片，如果可用的话？";
    var inputItems = p.nextElementSibling.children;
    inputItems[0].children[0].childNodes[2].data = " 所有客户端（推荐）";
    inputItems[1].children[0].childNodes[2].data = " 仅使用默认端口的客户端（可能会更慢，请在防火墙或代理阻止非标准接口的流量时选择此项。）";
    inputItems[2].children[0].childNodes[2].data = " 否 [ 现代 / HTTPS ]（仅限捐赠者，你将无法浏览尽可能多的页面，请在出现严重的问题时选择此项。）";
    inputItems[3].children[0].childNodes[2].data = " 否 [ 传统 / HTTP ]（仅限捐赠者，默认情况下无法在新版浏览器中使用，建议在使用过时的浏览器时选择此项。）";

    if (inputItems[2].children[0].childNodes[0].getAttribute("disabled") == "disabled") {
        inputItems[2].children[0].children[1].style.cursor = "not-allowed";
        inputItems[2].children[0].style.cursor = "not-allowed";
    }

    if (inputItems[3].children[0].childNodes[0].getAttribute("disabled") == "disabled") {
        inputItems[3].children[0].children[1].style.cursor = "not-allowed";
        inputItems[3].children[0].style.cursor = "not-allowed";
    }

    var countryDiv = loadSelectDiv.nextElementSibling;
    var countryP = countryDiv.children[0];
    var countryPStrong = countryP.querySelector("strong");
    countryP.innerHTML = `2. 您似乎是从 <strong id="country_span">${countryPStrong.innerText}</strong> 浏览该网站或在该国家/地区使用 VPN 或代理，这意味着该网站将尝试从该一般地理区域的 H@H 客户端加载图像。如果这是不正确的，或者如果您出于任何原因想要使用不同的区域（例如，如果您使用的是拆分隧道 VPN），您可以在下面选择不同的国家/地区。`;

    var countrySelectDiv = countryDiv.children[1];
    countrySelectDiv.childNodes[0].data = "国家或地区：";

    var countrySelect = countrySelectDiv.children[0];
    var countryOptions = countrySelect.options;
    for (const i in countryOptions) {
        if (Object.hasOwnProperty.call(countryOptions, i)) {
            const option = countryOptions[i];
            switch (option.value) {
                case "":
                    option.innerText = "自动检测";
                    break;
                case "-":
                    option.innerText = "-";
                    break;
                default:
                    if (settingsPage_countryDict[option.value]) {
                        var countryZH = settingsPage_countryDict[option.value];
                        if (countryPStrong.innerText == option.innerText) {
                            document.getElementById("country_span").innerText = countryZH;
                        }
                        option.innerText = `${countryZH} ${option.innerText}`;
                    }
                    break;
            }
        }
    }


}

// 图片大小设置
function uconfigImageSizeSettings(titleH2) {
    titleH2.innerText = "-- 图片大小设置 --";
    var imgResolutionDiv = titleH2.nextElementSibling;
    var p = imgResolutionDiv.querySelector("p");
    p.innerText = "1. 通常情况下，图片会被重新采样到 1280 像素的水平分辨率以供在线查看，您也可以选择以下重新采样分辨率。但是为了避免负载过高，高于 1280 像素将只供给于赞助者、特殊贡献者，以及 UID 小于 3,000,000 的用户。"
    var resolutionRadios = p.nextElementSibling.children;
    resolutionRadios[0].children[0].childNodes[2].data = "自动";
    for (var i = 1; i < resolutionRadios.length; i++) {
        const radioDiv = resolutionRadios[i];
        var innerText = radioDiv.children[0].childNodes[2].data;
        radioDiv.children[0].childNodes[2].data = innerText.replace("x", " 像素");
        if (radioDiv.children[0].children[0].getAttribute("disabled") == "disabled") {
            radioDiv.children[0].children[1].style.cursor = "not-allowed";
            radioDiv.children[0].style.cursor = "not-allowed";
        }
    }

    var imgZoomDiv = imgResolutionDiv.nextElementSibling;
    var imgZoomP = imgZoomDiv.children[0];
    imgZoomP.innerText = "2. 虽然该网站会自动缩小图像以适应您的屏幕宽度，但您也可以手动限制图像的最大显示尺寸。就像自动缩放一样，这不会重新采样图像，因为调整大小是在浏览器端完成的。（0 = 无限制）";
    var imgZoomTds = imgZoomP.nextElementSibling.querySelectorAll("td");
    imgZoomTds[0].innerText = "水平缩放：";
    imgZoomTds[1].childNodes[1].data = " 像素";
    imgZoomTds[2].innerText = "垂直缩放：";
    imgZoomTds[3].childNodes[1].data = " 像素";
}

// 作品标题显示
function uconfigPageGalleryNameDisplay(titleH2) {
    titleH2.innerText = "-- 作品标题显示 --";
    var galleryTitleDiv = titleH2.nextElementSibling;
    var p = galleryTitleDiv.querySelector("p");
    p.innerText = "1. 很多作品都同时拥有 英文 / 日语罗马音标题 和 日文标题，你想默认显示哪一个？";
    var galleryTitleRadios = p.nextElementSibling.children;
    galleryTitleRadios[0].children[0].childNodes[2].data = " 默认标题";
    galleryTitleRadios[1].children[0].childNodes[2].data = " 日语标题（如果有日语标题的情况下）";
}

// 存档下载设置
function uconfigPageArchiverSettings(titleH2) {
    titleH2.innerText = "-- 存档下载设置 --";
    var archiverDiv = titleH2.nextElementSibling;
    var p = archiverDiv.querySelector("p");
    p.innerText = "1. 存档下载的默认行为是手动选择存档（原始画质或压缩画质），然后复制下载链接或直接点击下载，您可以在此处更改设置。";
    var archiverRadios = p.nextElementSibling.children;
    archiverRadios[0].children[0].childNodes[2].data = "手动选择 - 画质，手动下载（默认）";
    archiverRadios[1].children[0].childNodes[2].data = "手动选择 - 画质，自动下载";
    archiverRadios[2].children[0].childNodes[2].data = "自动选择 - 原始画质，手动下载";
    archiverRadios[3].children[0].childNodes[2].data = "自动选择 - 原始画质，自动下载";
    archiverRadios[4].children[0].childNodes[2].data = "自动选择 - 压缩画质，手动下载";
    archiverRadios[5].children[0].childNodes[2].data = "自动选择 - 压缩画质，自动下载";
}

// 首页设置
function uconfigPageFrontPageSettings(titleH2) {
    titleH2.innerText = "-- 首页设置 --";
    var displayWayDiv = titleH2.nextElementSibling;
    var p = displayWayDiv.querySelector("p");
    p.innerText = "1. 你想以哪种方式浏览首页?";
    var displayWayRadios = p.nextElementSibling.children;
    displayWayRadios[0].children[0].childNodes[2].data = "标题 + 悬浮图";
    displayWayRadios[1].children[0].childNodes[2].data = "标题 + 悬浮图 + 账号收藏标签";
    displayWayRadios[2].children[0].childNodes[2].data = "标题 + 悬浮图 + 标签";
    displayWayRadios[3].children[0].childNodes[2].data = "标题 + 图片 + 标签";
    displayWayRadios[4].children[0].childNodes[2].data = "标题 + 缩略图";

    var bookTypeFilterDiv = displayWayDiv.nextElementSibling;
    var bookTypeFilterP = bookTypeFilterDiv.children[0];
    bookTypeFilterP.innerText = "2. 你希望首页包含或排除哪些作品类型?";
    var bookTypeFilterBtns = bookTypeFilterP.nextElementSibling.querySelectorAll("div.cs");
    for (const i in bookTypeFilterBtns) {
        if (Object.hasOwnProperty.call(bookTypeFilterBtns, i)) {
            const bookType = bookTypeFilterBtns[i];
            if (bookTypeData[bookType.innerText]) {
                bookType.innerText = bookTypeData[bookType.innerText];
            }
        }
    }
}

// 收藏设置
function uconfigPageFavorites(titleH2) {
    titleH2.innerText = "-- 收藏设置 --";
    var favoriteRenameDiv = titleH2.nextElementSibling;
    var p = favoriteRenameDiv.querySelector("p");
    p.innerText = "1. 重命名你的收藏夹名称";
    var orderDiv = favoriteRenameDiv.nextElementSibling;
    var orderP = orderDiv.children[0];
    orderP.innerText = "2. 设置作品在收藏夹中的默认排序，需注意，2016年3月网站改版前没有记录收藏时间，会按作品的上传日期计算";
    var orderRadios = orderP.nextElementSibling.children;
    orderRadios[0].children[0].childNodes[2].data = "按作品更新时间排序";
    orderRadios[1].children[0].childNodes[2].data = "按用户收藏时间排序";
}

// 评分设置
function uconfigPageRatings(titleH2) {
    titleH2.innerText = "-- 评分设置 --";
    var rateingDiv = titleH2.nextElementSibling;
    var p = rateingDiv.querySelector("p");
    p.innerText = "1. 每个英文字母代表每颗星的颜色，请使用 R / G / B / Y（红 / 绿 / 蓝 / 黄）组合你的评分颜色。";
    var rateinglabel = rateingDiv.querySelectorAll("td")[1];
    rateinglabel.innerText = "默认设置下，作品的评分设置是 RRGGB，对应分数和颜色显示：2 星及以下显示红星，2.5 ~ 4 星显示为绿星，4.5 ~ 5 星显示为蓝星。你可以设置为其他颜色组合。";
}

// 标签组设置
function uconfigPageTagNamespaces(titleH2) {
    titleH2.innerText = "-- 标签组设置 --";
    var searchTagFilterDiv = titleH2.nextElementSibling;
    var p = searchTagFilterDiv.querySelector("p");
    p.innerText = "1. 如果要从默认标签搜索中排除某些标签组，可以勾选以下标签组。请注意，这不会阻止在这些标签组中的标签的展示区出现，它只是在搜索标签时排除这些标签组。";
    var tagGroupRadios = p.nextElementSibling.children;
    tagGroupRadios[0].children[0].childNodes[2].data = "重新分类";
    tagGroupRadios[1].children[0].childNodes[2].data = "语言";
    tagGroupRadios[2].children[0].childNodes[2].data = "原作";
    tagGroupRadios[3].children[0].childNodes[2].data = "角色";
    tagGroupRadios[4].children[0].childNodes[2].data = "社团";
    tagGroupRadios[5].children[0].childNodes[2].data = "艺术家";
    tagGroupRadios[6].children[0].childNodes[2].data = "角色扮演";
    tagGroupRadios[7].children[0].childNodes[2].data = "男性";
    tagGroupRadios[8].children[0].childNodes[2].data = "女性";
    tagGroupRadios[9].children[0].childNodes[2].data = "混合";
    tagGroupRadios[10].children[0].childNodes[2].data = "其他";
}

// 标签过滤阀值设置
function uconfigPageTagFilteringThreshold(titleH2) {
    titleH2.innerText = "-- 标签过滤阀值设置 --";
    var tagFilterLabel = titleH2.nextElementSibling.querySelectorAll("td")[1];
    tagFilterLabel.innerHTML = `你可以通过将标签加入 <a href="https://exhentai.org/mytags">我的标签</a> 并设置一个 <strong>负权重</strong> 来软过滤它们。一旦某个作品所有的标签权重之和 <strong>低于</strong> 设定值，此作品将从视图中被过滤。这个值的设定范围为 [ -9999 ~ 0 ] 。`
}

// 标签订阅阀值设置
function uconfigTagWatchingThreshold(titleH2) {
    titleH2.innerText = "-- 标签订阅阀值设置 --";
    var tagWatchingLabel = titleH2.nextElementSibling.querySelectorAll("td")[1];
    tagWatchingLabel.innerHTML = `你可以通过将标签加入 <a href="https://exhentai.org/mytags">我的标签</a> 并设置一个 <strong>正权重</strong> 来关注它们。一旦某个作品所有的标签权重之和 <strong>高于</strong> 设定值，此作品将包含在菜单 [ 偏好 ] 的作品列表中。这个值的设定范围为 [ 0 ~ 9999 ] 。`
}

// 屏蔽语种
function uconfigTagExcludedLanguages(titleH2) {
    titleH2.innerText = "-- 屏蔽语种 --";
    var filterLabelDiv = titleH2.nextElementSibling;
    filterLabelDiv.children[0].innerText = "如果你希望从作品列表和搜索中隐藏某国语言的作品，请从下面的列表中选择它们。";
    filterLabelDiv.children[1].innerText = "请注意，无论您的搜索查询如何，屏蔽语言的作品都不会被搜索出来。";
    var languageTable = filterLabelDiv.children[2];
    var ths = languageTable.querySelectorAll("th");
    ths[1].innerText = "原始";
    ths[2].innerText = "翻译";
    ths[3].innerText = "重写";
    ths[4].innerText = "全部";
    var trs = languageTable.querySelectorAll("tr");
    trs[1].children[0].innerText = "日语";
    trs[2].children[0].innerText = "英语";
    trs[3].children[0].innerText = "汉语";
    trs[4].children[0].innerText = "荷兰语";
    trs[5].children[0].innerText = "法语";
    trs[6].children[0].innerText = "德语";
    trs[7].children[0].innerText = "匈牙利语";
    trs[8].children[0].innerText = "意大利语";
    trs[9].children[0].innerText = "韩语";
    trs[10].children[0].innerText = "波兰语";
    trs[11].children[0].innerText = "葡萄牙语";
    trs[12].children[0].innerText = "俄语";
    trs[13].children[0].innerText = "西班牙语";
    trs[14].children[0].innerText = "泰语";
    trs[15].children[0].innerText = "越南语";
    trs[16].children[0].innerText = "无语言";
    trs[17].children[0].innerText = "其他";
}

// 屏蔽上传者
function uconfigPageExcludedUploaders(titleH2) {
    titleH2.innerText = "-- 屏蔽上传者 --";
    var fitlerUploaderDiv = titleH2.nextElementSibling;
    fitlerUploaderDiv.children[0].innerText = "如果你希望从作品列表和搜索中隐藏某些上传者的作品，请将上传者的用户名添加到下方。每行输入一个用户名。";
    fitlerUploaderDiv.children[1].innerText = "请注意，无论您的搜索查询如何，屏蔽上传者的作品都不会被搜索出来。";
    var totalCount = fitlerUploaderDiv.children[3];
    var usedCount = totalCount.children[0].innerText;
    var allCount = totalCount.children[1].innerText;
    totalCount.innerHTML = `可用容量：<strong>${usedCount}</strong> / <strong>${allCount}</strong>`;
}

// 搜索数量设置
function uconfigPageSearchResultCount(titleH2) {
    titleH2.innerText = "-- 搜索数量设置 --";
    var searchCountDiv = titleH2.nextElementSibling;
    var p = searchCountDiv.querySelector("p");
    var commonText = "1. 对于首页、搜索页面 和 种子搜索页面，您希望每页有多少条结果？";
    var otherText = p.innerText.replace("How many results would you like per page for the index/search page and torrent search pages? ", "");
    if (otherText.length == 0) {
        p.innerText = commonText;
    } else {
        if (otherText == "(Hath Perk: Paging Enlargement Required)") {
            p.innerText = `${commonText}（需要解锁权限： Hath Perk 分页扩大）`;
        } else {
            p.innerText = `${commonText}${otherText}`;
            translatePageElementEN(p);
        }
    }

    var searchCountRadios = p.nextElementSibling.children;
    for (const i in searchCountRadios) {
        if (Object.hasOwnProperty.call(searchCountRadios, i)) {
            const radio = searchCountRadios[i];
            var innerText = radio.children[0].childNodes[2].data;
            radio.children[0].childNodes[2].data = innerText.replace("results", "条");
            if (radio.children[0].children[0].getAttribute("disabled") == "disabled") {
                radio.children[0].children[1].style.cursor = "not-allowed";
                radio.children[0].style.cursor = "not-allowed";
            }
        }
    }

}

// 缩略图设置
function uconfigPageThumbnailSettings(titleH2) {
    titleH2.innerText = "-- 缩略图设置 --";
    var thumbnailLoadWayDiv = titleH2.nextElementSibling;
    var p = thumbnailLoadWayDiv.querySelector("p");
    p.innerText = "1. 你希望鼠标悬停时显示的缩略图何时加载？";
    var thumbnailLoadWayRadios = p.nextElementSibling.children;
    thumbnailLoadWayRadios[0].children[0].childNodes[2].data = "鼠标悬停时（页面加载快，缩略图加载有延迟）";
    thumbnailLoadWayRadios[1].children[0].childNodes[2].data = "页面加载时（页面加载需要更长的时间，但缩略图显示是无需等待的）";

    var thumbnailDisplayDiv = thumbnailLoadWayDiv.nextElementSibling;
    var thumbnailDisplayP = thumbnailDisplayDiv.children[0];
    thumbnailDisplayP.innerText = "2. 作品详情页面缩略图设置";
    var thumbnailDisplayTable = thumbnailDisplayP.nextElementSibling;
    var trs = thumbnailDisplayTable.querySelectorAll("tr");
    trs[0].children[0].innerText = "大小：";
    var tdSizeNormal = trs[0].children[1].children[0].children[0].children[0];
    if (tdSizeNormal.children[0].getAttribute("disabled") == "disabled") {
        tdSizeNormal.children[1].style.cursor = "not-allowed";
        tdSizeNormal.style.cursor = "not-allowed";
    }
    tdSizeNormal.childNodes[2].data = "普通";

    var tdSizeLarge = trs[0].children[1].children[0].children[1].children[0];
    if (tdSizeLarge.children[0].getAttribute("disabled") == "disabled") {
        tdSizeLarge.children[1].style.cursor = "not-allowed";
        tdSizeLarge.style.cursor = "not-allowed";
    }
    tdSizeLarge.childNodes[2].data = "大图";

    trs[1].children[0].innerText = "行数：";
    var rowsDivs = trs[1].children[1].children[0].children;
    for (var i = 1; i < rowsDivs.length; i++) {
        const rows = rowsDivs[i];
        if (rows.children[0].children[0].getAttribute("disabled") == "disabled") {
            rows.children[0].children[1].style.cursor = "not-allowed";
            rows.children[0].style.cursor = "not-allowed";
        }
    }
}

// 缩略图缩放
function uconfigPageThumbnailScaling(titleH2) {
    titleH2.innerText = "-- 缩略图缩放 --";
    var thumbScaleLabel = titleH2.nextElementSibling.querySelectorAll("td")[1];
    thumbScaleLabel.innerText = "缩略图和扩展图库列表视图上的缩略图可以缩放到 75% 到 150% 之间的自定义值。";
}

// 移动端宽度设置
function uconfigPageViewportOverride(titleH2) {
    titleH2.innerText = "-- 移动端宽度设置 --";
    var tds = titleH2.nextElementSibling.querySelectorAll("td");
    tds[0].removeChild(tds[0].childNodes[1]);
    var span = document.createElement("span");
    span.classList.add("span_pixel");
    span.innerText = "像素";
    tds[0].appendChild(span);
    tds[1].innerText = "允许您覆盖移动设备站点的虚拟宽度。这通常由您的设备根据其 DPI 自动确定。100% 缩略图比例的合理值介于 640 和 1400 之间。";
}

// 作品评论设置
function uconfigPageGalleryComments(titleH2) {
    titleH2.innerText = "-- 作品评论设置 --";
    var commentOrderDiv = titleH2.nextElementSibling;
    var p = commentOrderDiv.querySelector("p");
    p.innerText = "1. 评论排序方式：";
    var commentOrderItems = p.nextElementSibling.children;
    commentOrderItems[0].children[0].childNodes[2].data = " 最古老的评论";
    commentOrderItems[1].children[0].childNodes[2].data = " 最新的评论";
    commentOrderItems[2].children[0].childNodes[2].data = " 按评论的分数";

    var commentNoteDiv = commentOrderDiv.nextElementSibling;
    var commentNoteP = commentNoteDiv.children[0];
    commentNoteP.innerText = "2. 显示评论的投票数：";
    var commentNotes = commentNoteDiv.children[1].children;
    commentNotes[0].children[0].childNodes[2].data = "鼠标悬停或点击时";
    commentNotes[1].children[0].childNodes[2].data = "总是显示";
}

// 我的标签设置
function uconfigPageGalleryTags(titleH2) {
    titleH2.innerText = "-- 我的标签设置 --";
    var tagOrderDiv = titleH2.nextElementSibling;
    var p = tagOrderDiv.querySelector("p");
    p.innerText = "1. 标签排序方式：";
    var tagOrderItems = p.nextElementSibling.children;
    tagOrderItems[0].children[0].childNodes[2].data = " 按字母排序";
    tagOrderItems[1].children[0].childNodes[2].data = " 按权重排序";
}

// 作品页面页码设置
function uconfigPageGalleryPageNumbering(titleH2) {
    titleH2.innerText = "-- 作品页面页码设置 --";
    var galleryNumberDiv = titleH2.nextElementSibling;
    var p = galleryNumberDiv.querySelector("p");
    p.innerText = "1. 是否显示作品页码？";
    var galleryNumberItems = p.nextElementSibling.children;
    galleryNumberItems[0].children[0].childNodes[2].data = " 否";
    galleryNumberItems[1].children[0].childNodes[2].data = " 是";
}

// 重新包裹页面元素
function uconfigPageReWrapperForm(contentForm) {
    // 删除提交按钮
    var submitBtn = contentForm.lastElementChild;
    contentForm.removeChild(submitBtn);
    // 包裹表单元素
    var contentFormInnerHTML = contentForm.innerHTML;
    var wrapperDiv = document.createElement("div");
    wrapperDiv.id = "contentForm_wrapper";
    wrapperDiv.innerHTML = contentFormInnerHTML;
    contentForm.innerHTML = "";
    contentForm.appendChild(wrapperDiv);
    // 添加提交按钮
    contentForm.appendChild(submitBtn);
}

//#endregion