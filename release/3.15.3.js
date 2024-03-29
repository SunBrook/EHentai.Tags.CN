// ==UserScript==
// @name         ExHentai 中文标签助手
// @namespace    ExHentai 中文标签助手_DYZYFTS
// @license		 MIT
// @compatible  firefox >= 60
// @compatible  edge >= 16
// @compatible  chrome >= 61
// @compatible  safari >= 11
// @compatible  opera >= 48
// @version      3.15.3
// @icon         http://exhentai.org/favicon.ico
// @description  E-hentai + ExHentai 丰富的本地中文标签库 + 自定义管理收藏库，搜索时支持点击选择标签或者手动输入，页面翻译英文标签时支持本地标签库匹配和谷歌机翻。
// @author       地狱天使
// @match        *://e-hentai.org/*
// @match        *://www.e-hentai.org/*
// @match        *://exhentai.org/*
// @match        *://www.exhentai.org/*
// @grant        none
// @run-at       document-end
// @homepageURL  https://sleazyfork.org/zh-CN/scripts/441232
// ==/UserScript==

'use strict';

//#region step0.commonFunc.js 通用方法

// 检查字典是否为空
function checkDictNull(dict) {
    for (const n in dict) {
        return false;
    }
    return true;
}

// 获取地址参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substring(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

// 数组删除元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 数组差集
function getDiffSet(array1, array2) {
    return array1.filter(item => !new Set(array2).has(item));
}

// 导出json文件
function saveJSON(data, filename) {
    if (!data) return;
    if (!filename) filename = "json.json";
    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
    }
    // 要创建一个 blob 数据
    let blob = new Blob([data], { type: "text/json" }),
        a = document.createElement("a");
    a.download = filename;

    // 将blob转换为地址
    // 创建 URL 的 Blob 对象
    a.href = window.URL.createObjectURL(blob);

    // 标签 data- 嵌入自定义属性  屏蔽后也可正常下载
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");

    // 添加鼠标事件
    let event = new MouseEvent("click", {});

    // 向一个指定的事件目标派发一个事件
    a.dispatchEvent(event);
}

// 获取当前时间
function getCurrentDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //年份
    var month = now.getMonth();//月份
    var date = now.getDate();//日期
    var day = now.getDay();//周几
    var hour = now.getHours();//小时
    var minu = now.getMinutes();//分钟
    var sec = now.getSeconds();//秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
        time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
        time = year + "/" + month + "/" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
}

// 调用谷歌翻译接口
function getGoogleTranslate(text, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dj=1&dt=t&q=${text}`;
    httpRequest.open("GET", url, true);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

// 借助谷歌翻译设置翻译后的值
function translatePageElement(element) {
    getGoogleTranslate(element.innerText, function (data) {
        var sentences = data.sentences;
        var longtext = '';
        for (const i in sentences) {
            if (Object.hasOwnProperty.call(sentences, i)) {
                const sentence = sentences[i];
                longtext += sentence.trans;
            }
        }
        element.innerText = longtext;
    });
}

function translatePageElementFunc(element, isNeedUrlEncode, func_compelete) {
    var innerText = isNeedUrlEncode ? urlEncode(element.innerText) : element.innerText;
    getGoogleTranslate(innerText, function (data) {
        var sentences = data.sentences;
        var longtext = '';
        for (const i in sentences) {
            if (Object.hasOwnProperty.call(sentences, i)) {
                const sentence = sentences[i];
                longtext += sentence.trans;
            }
        }
        element.innerText = longtext;
        func_compelete();
    });
}

function getGoogleTranslateEN(text, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dj=1&dt=t&q=${text}`;
    httpRequest.open("GET", url, true);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

function translatePageElementEN(element) {
    getGoogleTranslateEN(urlEncode(element.innerText), function (data) {
        var sentences = data.sentences;
        var longtext = '';
        for (const i in sentences) {
            if (Object.hasOwnProperty.call(sentences, i)) {
                const sentence = sentences[i];
                longtext += sentence.trans;
            }
        }
        element.innerText = longtext;
    });
}

// 展开折叠动画 (下上)
var slideTimer = null;
function slideDown(element, realHeight, speed, func) {
    clearInterval(slideTimer);
    var h = 0;
    slideTimer = setInterval(function () {
        // 当目标高度与实际高度小于10px时，以1px的速度步进
        var step = (realHeight - h) / 10;
        step = Math.ceil(step);
        h += step;
        if (Math.abs(realHeight - h) <= Math.abs(step)) {
            h = realHeight;
            element.style.height = `${realHeight}px`;
            func();
            clearInterval(slideTimer);
        } else {
            element.style.height = `${h}px`;
        }
    }, speed);
}
function slideUp(element, speed, func) {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () {
        var step = (0 - element.clientHeight) / 10;
        step = Math.floor(step);
        element.style.height = `${element.clientHeight + step}px`;
        if (Math.abs(0 - element.clientHeight) <= Math.abs(step)) {
            element.style.height = "0px";
            func();
            clearInterval(slideTimer);
        }
    }, speed);
}

// 展开折叠动画 (右左)
var slideTimer2 = null;
function slideRight(element, realWidth, speed, func) {
    clearInterval(slideTimer2);
    var w = 0;
    slideTimer2 = setInterval(function () {
        // 当目标宽度与实际宽度小于10px, 以 1px 的速度步进
        var step = (realWidth - w) / 10;
        step = Math.ceil(step);
        w += step;
        if (Math.abs(realWidth - w) <= Math.abs(step)) {
            w = realWidth;
            element.style.width = `${realWidth}px`;
            func();
            clearInterval(slideTimer2);
        } else {
            element.style.width = `${w}px`;
        }
    }, speed);
}
function slideLeft(element, speed, func) {
    clearInterval(slideTimer2);
    slideTimer2 = setInterval(function () {
        var step = (0 - element.clientWidth) / 10;
        step = Math.floor(step);
        element.style.width = `${element.clientWidth + step}px`;
        if (Math.abs(0 - element.clientWidth) <= Math.abs(step)) {
            element.style.width = "0px";
            func();
            clearInterval(slideTimer2);
        }
    }, speed);
}


// 页面样式注入
function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
        if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
        } else {
            head.appendChild(style);
        }
    } else {
        head.appendChild(style);
    }

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
}

// UrlEncode
function urlEncode(str) {
    str = (str + '').toString();

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

// UrlDecode
function urlDecode(str) {
    return decodeURIComponent(str);
}

// 跨域
function crossDomain() {
    var meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "upgrade-insecure-requests";
    document.getElementsByTagName("head")[0].appendChild(meta);
}

// 英语日期转纯数字日期
function transDate(dateEn) {
    var monthDict = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    };
    var dateSplit = dateEn.split(' ');
    return `${dateSplit[2]}/${monthDict[dateSplit[1]]}/${Number(dateSplit[0])}`;
}

// 过滤字符串开头和结尾的空格
function trimStartEnd(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 过滤字符串结尾空格
function trimEnd(str) {
    return str.replace(/(\s*$)/g, "");
}

// 判断某div是否存在滚动条
function divHasScrollBar(div) {
    return (div.scrollHeight > div.clientHeight) || (div.offsetHeight > div.clientHeight);
}

// 将新增dom树添加到虚拟节点中
function addInVirtualNode(parentNode, innHtml, complete_func) {
    var completed = false;
    function add() {
        var fragment = document.createDocumentFragment();

        var div = document.createElement('div');
        div.innerHTML = innHtml;

        fragment.appendChild(div);
        parentNode.appendChild(fragment);
    }
    window.requestAnimationFrame(add);
    completed = true;

    var t = setInterval(() => {
        if (completed) {
            t && clearInterval(t);
            complete_func();
        }
    }, 10);


}

//#endregion

//#region step0.constDatas.js 数据字典

const webOrigin = window.location.origin;

//#region 头部菜单

const fontMenusData = {
    "Front": "首页",
    "Front Page": "首页",
    "Watched": "偏好",
    "Popular": "热门",
    "Torrents": "种子",
    "Favorites": "收藏",
    "Favs": "收藏",
    "Settings": "设置",
    "My Uploads": "我的上传",
    "My Tags": "我的标签",
    "My Home": "我的主页",
    "Toplists": "排行榜",
    "Bounties": "悬赏",
    "News": "新闻",
    "Forums": "论坛",
    "Wiki": "维基百科",
    "HentaiVerse": "變態之道(游戏)",
    "HV": "變態之道(游戏)"
};

//#endregion

//#region 底部菜单

const bottomMenusData = {
    "Front Page": "首页",
    "Onion": "洋葱网站",
    "Terms of Service": "服务条款",
    "Advertise": "申请广告位"
};

const bottom2MenusDataForEH = {
    "Visit the E-Hentai Forums": "前往 E-Hentai 论坛",
    "E-Hentai @ Twitter": "Twitter主页",
    "Play the HentaiVerse Minigame": "玩 變態之道 (游戏)",
    "Lo-Fi Version": "低保真网站 (适合移动设备浏览)"
};

//#endregion

//#region 作品分类

// 作品分类 01
const bookTypeData = {
    "Doujinshi": "同人志",
    "Manga": "漫画",
    "Artist CG": "艺术家 CG",
    "Game CG": "游戏 CG",
    "Western": "西方风格",
    "Non-H": "无 H 内容",
    "Image Set": "图像集",
    "Cosplay": "角色扮演",
    "Asian Porn": "亚洲色情",
    "Misc": "杂项"
}
// 作品分类02
const bookClassTypeData = {
    "ct2": "同人志",
    "ct3": "漫画",
    "ct4": "艺术家 CG",
    "ct5": "游戏 CG",
    "cta": "西方风格",
    "ct9": "无 H 内容",
    "ct6": "图像集",
    "ct7": "角色扮演",
    "ct8": "亚洲色情",
    "ct1": "杂项"
}

//#endregion

//#region 预览下拉框

const dropData = {
    "Minimal": "标题 + 悬浮图",
    "Minimal+": "标题 + 悬浮图 + 账号收藏标签",
    "Compact": "标题 + 悬浮图 + 标签",
    "Extended": "标题 + 图片 + 标签",
    "Thumbnail": "标题 + 缩略图",
}

//#endregion

//#region 表头翻译字典

const thData = {
    "": "作品类型",
    "Published": "上传日期",
    "Title": "作品名称",
    "Uploader": "上传人员",
    "Name": "作品名称",
    "Favorited": "收藏日期",
    "Added": "添加时间",
    "Torrent Name": "种子名称",
    "Gallery": "作品 ID",
    "Size": "文件大小",
    "Seeds": "做种",
    "Peers": "下载",
    "DLs": "完成",
    "Uploader": "上传者"
};

//#endregion

//#region 详情页右侧链接翻译

const gd5aDict = {
    "Report Gallery": "举报",
    "Archive Download": "档案下载",
    "Petition to Expunge": "申请删除",
    "Petition to Rename": "申请改名",
    "Show Gallery Stats": "画廊统计",
};

//#endregion

//#region localstroage 键名

// 版本号
const dbVersionKey = "categoryVersion";

// 全部列表Html
const dbCategoryListHtmlKey = "categoryListHtml";

// 全部列表折叠
const dbCategoryListExpendKey = "categoryListExpendArray";

// 本地收藏折叠
const dbFavoriteListExpendKey = "favoriteListExpendArray";

// 本地收藏列表
const dbFavoriteKey = "favoriteDict";

// 头部搜索菜单显示隐藏
const dbOldSearchDivVisibleKey = "oldSearchDivVisibleKey";

// 标签谷歌机翻_首页开关
const dbGoogleTranslateCategoryFontPage = "googleTranslateCategoryFontPage";

// 标签谷歌机翻_详情页开关
const dbGoogleTranslateCategoryDetail = "googleTranslateCategoryDetail";

// 消息通知页面同步
const dbSyncMessageKey = "dbSyncMessage";

// 搜索模式
const dbFrontPageSearchMode = "dbfrontPageSearchMode";

// 存储有损压缩图片
const dbBgLowImageBase64 = "dbBgLowImageBase64";

// 我的标签，标签：勾选->账号
const dbMyTagsUploadingRemainderCount = "dbMyTagsUploadingRemainderCount";

//#endregion

//#region indexedDB 数据表、索引、键

// 设置表
const table_Settings = "t_settings";
const table_Settings_key_FetishListVersion = "f_fetishListVersion";
const table_Settings_key_EhTagVersion = "f_ehTagVersion";
const table_Settings_key_FetishList_ParentEnArray = "f_fetish_parentEnArray";
const table_Settings_key_EhTag_ParentEnArray = "f_ehTag_parentEnArray";
const table_Settings_key_FetishList_Html = "f_fetishListHtml";
const table_Settings_key_EhTag_Html = "f_ehTagHtml";
const table_Settings_key_CategoryList_Extend = "f_categoryListExtend";
const table_Settings_key_OldSearchDiv_Visible = "f_oldSearchDivVisible";
const table_settings_key_TranslateFrontPageTags = "f_translateFrontPageTags";
const table_Settings_key_TranslateDetailPageTags = "f_translateDetailPageTags";
const table_Settings_key_TranslateFrontPageTitles = "f_translateFrontPageTitles";
const table_Settings_key_TranslateDetailPageTitles = "f_translateDetailPageTitles";
const table_Settings_key_TranslateTorrentDetailInfoCommand = "f_translateTorrentDetailInfoCommand";
const table_Settings_key_FavoriteList = "f_favoriteList";
const table_Settings_key_FavoriteList_Html = "f_favoriteListHtml";
const table_Settings_Key_FavoriteList_Extend = "f_favoriteListExtend";
const table_Settings_Key_Bg_ImgBase64 = "f_bgImageBase64";
const table_Settings_Key_Bg_Low_ImgBase64 = "f_bgLowImageBase64";
const table_Settings_Key_Bg_Low_ImgOverSize = "f_bgLowImageOverSize";
const table_Settings_Key_Bg_Opacity = "f_bgOpacity";
const table_Settings_Key_Bg_Mask = "f_bgMask";
const table_Settings_key_FrontPageFontParentColor = "f_frontPageFontParentColor";
const table_Settings_key_FrontPageFontSubColor = "f_frontPageFontSubColor";
const table_Settings_Key_FrontPageFontSubHoverColor = "f_frontPageFontSubHoverColor";
const table_Settings_key_NewsPageTopImageVisible = "f_newsPageTopImageVisible";
const table_Settings_key_NewsPageTranslate = "f_newsPageTranslate";
const table_Settings_key_FrontPageSearchMode = "f_frontPageSearchMode";
const table_Settings_key_TosPageTranslate = "f_tosPageTranslate";
const table_Settings_key_MyTagsAllCategory_Html = "f_myTagsAllCategoryHtml";
const table_Settings_key_MyTagsFavoriteCategory_Html = "f_myTagsFavoriteCategoryHtml";
const table_Settings_key_MyTagsUploadTags = "f_myTagsUploadTags";

// fetishList 全部类别 - 父子信息表
const table_fetishListSubItems = "t_fetishListSubItems";
const table_fetishListSubItems_key = "ps_en";
const table_fetishListSubItems_index_subEn = "sub_en";
const table_fetishListSubItems_index_searchKey = "search_key";

// EhTag 全部类别 - 父子信息表
const table_EhTagSubItems = "t_ehTagSubItems";
const table_EhTagSubItems_key = "ps_en";
const table_EhTagSubItems_index_subEn = "sub_en";
const table_EhTagSubItems_index_searchKey = "search_key";

// FavoriteList 本地收藏表
const table_favoriteSubItems = "t_favoriteSubItems";
const table_favoriteSubItems_key = "ps_en";
const table_favoriteSubItems_index_parentEn = "parent_en";

// DetailParentItems 详情页父级表
const table_detailParentItems = "t_detailParentItems";
const table_detailParentItems_key = "row";

//#endregion

//#region 消息通知 dbSyncMessageKey 值

const sync_oldSearchTopVisible = 'syncOldSearchTopVisible';
const sync_categoryList = 'syncCategoryList';
const sync_favoriteList = 'syncFavoriteList';
const sync_categoryList_Extend = 'syncCategoryListExtend';
const sync_favoriteList_Extend = 'syncFavoriteListExtend';
const sync_googleTranslate_frontPage_title = 'syncGoogleTranslateFrontPageTitle';
const sync_googleTranslate_detailPage_title = 'syncGoogleTranslateDetailPageTitle';
const sync_setting_backgroundImage = 'syncSettingBackgroundImage';
const sync_setting_frontPageFontColor = 'syncSettingFrontPageFontColor';
const sync_googleTranslate_torrentDetailInfo_command = "syncGoogleTranslateTorrentDetailInfoCommand";
const sync_newsPage_topImage_visible = "syncNewsPageTopImageVisible";
const sync_googleTranslate_newsPage_news = "syncGoogleTranslateNewsPageNews";
const sync_frontPageSearchMode = "syncFrontPageSearchMode";
const sync_googleTranslate_tosPage = "syncGoogleTranslateTosPage";
const sync_mytagsAllTagUpdate = "syncMyTagsAllTagUpdate";
const sync_mytagsFavoriteTagUpdate = "syncMyTagsFavoriteTagUpdate";

//#endregion

//#region 背景图片、字体颜色默认值

// 默认不透明度
const defaultSetting_Opacity = 0.5;
// 默认遮罩浓度
const defaultSetting_Mask = 0;

// 默认父级字体颜色 - ex
const defaultFontParentColor_EX = "#fadfc0";
// 默认子级字体颜色 - ex
const defaultFontSubColor_EX = "#f5cc9c";
// 默认子级悬浮颜色 - ex
const defaultFontSubHoverColor_EX = "#ffd700";
// 默认父级字体颜色 - eh
const defaultFontParentColor_EH = "#5c0d11";
// 默认子级字体颜色 - eh
const defaultFontSubColor_EH = "#5c0d11";
// 默认子级悬浮颜色 - eh
const defaultFontSubHoverColor_EH = "#ff4500";


//#endregion

//#region 排行榜翻译

const toplist_parent_dict = {
    "Gallery Toplists": "作品排行",
    "Uploader Toplists": "上传者排行",
    "Tagging Toplists": "标签排行",
    "Hentai@Home Toplists": "用户主页排行",
    "EHTracker Toplists": "做种排行",
    "Cleanup Toplists": "清理排行",
    "Rating & Reviewing Toplists": "评分 & 评论排行"
};

const toplie_subtitle_dict = {
    "EHG Toplists": "EHentai 画廊排行榜",
    "Galleries All-Time": "作品总排行",
    "Galleries Past Year": "作品年排行",
    "Galleries Past Month": "作品月排行",
    "Galleries Yesterday": "作品日排行",
    "Uploader All-Time": "上传者总排行",
    "Uploader Past Year": "上传者年排行",
    "Uploader Past Month": "上传者月排行",
    "Uploader Yesterday": "上传者日排行",
    "Tagging All-Time": "标签总排行",
    "Tagging All-Time": "标签年排行",
    "Tagging All-Time": "标签月排行",
    "Tagging Yesterday": "标签日排行",
    "Hentai@Home All-Time": "用户主页总排行",
    "Hentai@Home Past Year": "用户主页年排行",
    "Hentai@Home Past Month": "用户主页月排行",
    "Hentai@Home Yesterday": "用户主页日排行",
    "EHTracker All-Time": "做种总排行",
    "EHTracker Past Year": "做种年排行",
    "EHTracker Past Month": "做种月排行",
    "EHTracker Yesterday": "做种日排行",
    "Cleanup All-Time": "清理总排行",
    "Cleanup Past Year": "清理年排行",
    "Cleanup Past Month": "清理月排行",
    "Cleanup Yesterday": "清理日排行",
    "Rating & Reviewing All-Time": "评分 & 评论总排行",
    "Rating & Reviewing Past Year": "评分 & 评论年排行",
    "Rating & Reviewing Past Month": "评分 & 评论月排行",
    "Rating & Reviewing Yesterday": "评分 & 评论日排行"
}

//#endregion

//#region 我的主页第二菜单栏

const myHomeMenu2 = {
    "Overview": "总览",
    "My Stats": "我的统计",
    "My Settings": "我的设置",
    "My Tags": "我的标签",
    "Hentai@Home": "Hentai@Home",
    "Donations": "捐赠",
    "Hath Perks": "权限解锁",
    "Hath Exchange": "权限积分交易",
    "GP Exchange": "GP交易",
    "Credit Log": "Credit 记录",
    "Karma Log": "Karma 记录"
};

//#endregion

//#region 新闻页面分栏标题

const newPagesTitles = {
    "Latest Site Status Updates": "最新网站状态",
    "Site Update Log": "网站更新日志",
    "The Fourteenth Annual E-Hentai Galleries Award Show for Outstanding Achievements in the Field of Excellence": "第十四届年度 E-Hentai Galleries 卓越领域杰出成就奖颁奖典礼",
    "The Fourteenth Annual E-Hentai Yuletide Lottery": "第十四届年度电子无尽圣诞彩票",
    "Tag namespacing changes": "标记命名空间更改",
    "New Upload Servers": "新的上传服务器",
    "New Feature: H@H Monitoring/Alerts": "新功能：H@H 监控/警报",
    "New Feature: Country selector for choosing which H@H network country/region to use for image loads": "新功能：国家选择器，用于选择用于图像加载的 H@H 网络国家/地区",
    "Core server/database migration": "核心服务器/数据库迁移",
    "The Thirteenth Annual E-Hentai Award Show for Outstanding Achievements in the Field of Excellence": "第十三届 E-Hentai 年度卓越成就奖颁奖典礼"
}

//#endregion

//#region 设置页面

const settingsPage_countryDict = {
    "AF": "阿富汗",
    "AX": "阿兰群岛",
    "AL": "阿尔巴尼亚",
    "DZ": "阿尔及利亚",
    "AS": "美属萨摩亚",
    "AD": "安道尔",
    "AO": "安哥拉",
    "AI": "安圭拉",
    "AQ": "南极洲",
    "AG": "安提瓜和巴布达",
    "AR": "阿根廷",
    "AM": "亚美尼亚",
    "AW": "阿鲁巴",
    "AP": "亚太地区",
    "AU": "澳大利亚",
    "AT": "奥地利",
    "AZ": "阿塞拜疆",
    "BS": "巴哈马群岛",
    "BH": "巴林",
    "BD": "孟加拉国",
    "BB": "巴巴多斯",
    "BY": "白俄罗斯",
    "BE": "比利时",
    "BZ": "伯利兹",
    "BJ": "贝宁",
    "BM": "百慕大群岛",
    "BT": "不丹",
    "BO": "玻利维亚",
    "BQ": "博内尔·圣尤斯特修斯和萨巴",
    "BA": "波斯尼亚和黑塞哥维那",
    "BW": "博茨瓦纳",
    "BV": "布韦特岛",
    "BR": "巴西",
    "IO": "英属印度洋领土",
    "BN": "文莱达鲁萨兰国",
    "BG": "保加利亚",
    "BF": "布基纳法索",
    "BI": "布隆迪",
    "KH": "柬埔寨",
    "CM": "喀麦隆",
    "CA": "加拿大",
    "CV": "佛得角",
    "KY": "开曼群岛",
    "CF": "中非共和国",
    "TD": "乍得",
    "CL": "智利",
    "CN": "中国",
    "CX": "圣诞岛",
    "CC": "科科斯群岛",
    "CO": "哥伦比亚",
    "KM": "科摩罗",
    "CG": "刚果",
    "CD": "刚果民主共和国",
    "CK": "库克群岛",
    "CR": "哥斯达黎加",
    "CI": "科特迪瓦",
    "HR": "克罗地亚",
    "CU": "古巴",
    "CW": "库拉索",
    "CY": "塞浦路斯",
    "CZ": "捷克共和国",
    "DK": "丹麦",
    "DJ": "吉布提",
    "DM": "多米尼加",
    "DO": "多米尼加共和国",
    "EC": "厄瓜多尔",
    "EG": "埃及",
    "SV": "萨尔瓦多",
    "GQ": "赤道几内亚",
    "ER": "厄立特里亚",
    "EE": "爱沙尼亚",
    "ET": "埃塞俄比亚",
    "EU": "欧洲",
    "FK": "福克兰群岛",
    "FO": "法罗群岛",
    "FJ": "斐济",
    "FI": "芬兰",
    "FR": "法国",
    "GF": "法属圭亚那",
    "PF": "法属波利尼西亚",
    "TF": "法属南部领地",
    "GA": "加蓬",
    "GM": "冈比亚",
    "GE": "佐治亚州",
    "DE": "德国",
    "GH": "加纳",
    "GI": "直布罗陀",
    "GR": "希腊",
    "GL": "格陵兰岛",
    "GD": "格林纳达",
    "GP": "瓜德罗普岛",
    "GU": "关岛",
    "GT": "危地马拉",
    "GG": "根西岛",
    "GN": "几尼",
    "GW": "几内亚比绍",
    "GY": "圭亚那",
    "HT": "海地",
    "HM": "赫德岛和麦克唐纳岛",
    "VA": "罗马教廷（梵蒂冈城邦）",
    "HN": "洪都拉斯",
    "HK": "香港",
    "HU": "匈牙利",
    "IS": "冰岛",
    "IN": "印度",
    "ID": "印度尼西亚",
    "IR": "伊朗",
    "IQ": "伊拉克",
    "IE": "爱尔兰",
    "IM": "马恩岛",
    "IL": "以色列",
    "IT": "意大利",
    "JM": "牙买加",
    "JP": "日本",
    "JE": "泽西",
    "JO": "约旦",
    "KZ": "哈萨克斯坦",
    "KE": "肯尼亚",
    "KI": "基里巴斯",
    "KW": "科威特",
    "KG": "吉尔吉斯斯坦",
    "LA": "老挝人民民主共和国",
    "LV": "拉脱维亚",
    "LB": "黎巴嫩",
    "LS": "莱索托",
    "LR": "利比里亚",
    "LY": "利比亚",
    "LI": "利克滕斯坦",
    "LT": "立陶宛",
    "LU": "卢森堡",
    "MO": "澳门",
    "MK": "马其顿",
    "MG": "马达加斯加",
    "MW": "马拉维",
    "MY": "马来西亚",
    "MV": "马尔代夫",
    "ML": "马里",
    "MT": "马耳他",
    "MH": "马绍尔群岛",
    "MQ": "马提尼克岛",
    "MR": "毛里塔尼亚",
    "MU": "毛里求斯",
    "YT": "马约特",
    "MX": "墨西哥",
    "FM": "密克罗尼西亚",
    "MD": "摩尔多瓦",
    "MC": "摩纳哥",
    "MN": "蒙古",
    "ME": "门的内哥罗",
    "MS": "蒙特塞拉特",
    "MA": "摩洛哥",
    "MZ": "莫桑比克",
    "MM": "缅甸",
    "NA": "纳米比亚",
    "NR": "瑙鲁",
    "NP": "尼泊尔",
    "NL": "荷兰",
    "NC": "新喀里多尼亚",
    "NZ": "新西兰",
    "NI": "尼加拉瓜",
    "NE": "尼日尔",
    "NG": "尼日利亚",
    "NU": "纽埃",
    "NF": "诺福克岛",
    "KP": "朝鲜",
    "MP": "北马里亚纳群岛",
    "NO": "挪威",
    "OM": "阿曼",
    "PK": "巴基斯坦",
    "PW": "帕劳",
    "PS": "巴勒斯坦领土",
    "PA": "巴拿马",
    "PG": "巴布亚新几内亚",
    "PY": "巴拉圭",
    "PE": "秘鲁",
    "PH": "菲律宾",
    "PN": "皮特凯恩群岛",
    "PL": "波兰",
    "PT": "葡萄牙",
    "PR": "波多黎各",
    "QA": "卡塔尔",
    "RE": "留尼汪",
    "RO": "罗马尼亚",
    "RU": "俄罗斯联邦",
    "RW": "卢旺达",
    "BL": "加勒比海圣巴特岛",
    "SH": "圣赫勒拿",
    "KN": "圣基茨和尼维斯",
    "LC": "圣卢西亚",
    "MF": "圣马丁岛",
    "PM": "圣皮埃尔和密克隆",
    "VC": "圣文森特和格林纳丁斯",
    "WS": "萨摩亚",
    "SM": "圣马力诺",
    "ST": "圣多美和普林西比",
    "SA": "沙特阿拉伯",
    "SN": "塞内加尔",
    "RS": "塞尔维亚",
    "SC": "塞舌尔",
    "SL": "塞拉利昂",
    "SG": "新加坡",
    "SX": "荷属圣马丁",
    "SK": "斯洛伐克",
    "SI": "斯洛文尼亚",
    "SB": "所罗门群岛",
    "SO": "索马里",
    "ZA": "南非",
    "GS": "南乔治亚和南桑威奇群岛",
    "KR": "韩国",
    "SS": "南苏丹",
    "ES": "西班牙",
    "LK": "斯里兰卡",
    "SD": "苏丹",
    "SR": "苏里南",
    "SJ": "斯瓦尔巴和扬马延",
    "SZ": "斯威士兰",
    "SE": "瑞典",
    "CH": "瑞士",
    "SY": "阿拉伯叙利亚共和国",
    "TW": "台湾",
    "TJ": "塔吉克斯坦",
    "TZ": "坦桑尼亚",
    "TH": "泰国",
    "TL": "东帝汶",
    "TG": "多哥",
    "TK": "托克劳",
    "TO": "汤加",
    "TT": "特立尼达和多巴哥",
    "TN": "突尼斯",
    "TR": "土耳其",
    "TM": "土库曼斯坦",
    "TC": "特克斯和凯科斯群岛",
    "TV": "图瓦卢",
    "UG": "乌干达",
    "UA": "乌克兰",
    "AE": "阿拉伯联合酋长国",
    "GB": "大不列颠联合王国",
    "US": "美国",
    "UM": "美国小离岛",
    "UY": "乌拉圭",
    "UZ": "乌兹别克斯坦",
    "VU": "瓦努阿图",
    "VE": "委内瑞拉",
    "VN": "越南",
    "VG": "英属维尔京群岛",
    "VI": "美国维尔京群岛",
    "WF": "沃利斯和富图纳",
    "EH": "西撒哈拉",
    "YE": "也门",
    "ZM": "赞比亚",
    "ZW": "津巴布韦"
}


//#endregion

//#region 作品阅读页面底部链接

const detailReadPage_bottomLinkDict = {
    "Show all galleries with this file": "显示包含此图片的所有作品",
    "Click here if the image fails loading": "重新加载图片",
    "Generate a static forum image link": "生成用于论坛的图片链接"
}

//#endregion

//#region HentaiVerse 弹框出现的常用句子
const hentaivaseDialogSentenceDict = {
    "You have encountered a monster!": "你遇到了一个怪物！",
    "Click here to fight in the HentaiVerse.": "点击这里进行战斗。",
    "It is the dawn of a new day!": "多么美好的一天！",
    "Reflecting on your journey so far, you find that you are a little wiser.": "回顾你迄今为止的旅程，你会发现自己更聪明了一点。",
}
//#endregion

//#region 有损图片大小限制

const lowImgSizeLimit = 512000; // 500kb

//#endregion

//#region 详情页面警告提示信息

const detailPage_warnContentDict = {
    "Content Warning": "内容警告",
    "View Gallery": "查看图库",
    "Get Me Outta Here": "让我离开这里",
    "Never Warn Me Again": "永远不要再警告我"
}

//#endregion

//#region 我的标签

const mytagDefaultWeight = 10;
const mytagDefaultColor = "#000000";
const mytagMsgRenameDict = {
    "Name contains invalid characters.": "名称包含无效字符。",
    "Invalid tagset name": "名称无效",
    "Name must be less than 20 characters.": "名称必须少于 20 个字符。"
}

//#endregion

//#region 头部二级菜单

//我的主页 - 小分支页面名称
const myMainPageSubPageDict = {
    "Overview": "总览",
    "My Stats": "我的统计",
    "My Settings": "我的设置",
    "My Tags": "我的标签",
    "Hentai@Home": "變態之家",
    "Donations": "捐赠",
    "Hath Perks": "Hath 权限",
    "Hath Exchange": "Hath 交易",
    "GP Exchange": "GP 交易",
    "Credit Log": "消费记录",
    "Karma Log": "Karma 记录",
}
//#endregion

//#endregion

//#region step0.localstorage.js localstorage 数据方法，迁入 indexdb，如无特殊需要，删除之前存储的数据

// 版本号数据 读取、删除
function getVersion() {
    return localStorage.getItem(dbVersionKey);
}
function removeVersion() {
    localStorage.removeItem(dbVersionKey);
}

// 全部列表数据 读取、删除
function getCategoryListHtml() {
    return localStorage.getItem(dbCategoryListHtmlKey);
}
function removeCategoryListHtml() {
    localStorage.removeItem(dbCategoryListHtmlKey);
}

// 折叠按钮位置 读取、删除
function getCategoryListExpend() {
    return JSON.parse(localStorage.getItem(dbCategoryListExpendKey));
}
function removeCategoryListExpend() {
    localStorage.removeItem(dbCategoryListExpendKey);
}

// 收藏列表数据 读取、删除
function getFavoriteDicts() {
    return JSON.parse(localStorage.getItem(dbFavoriteKey))
}
function removeFavoriteDicts() {
    localStorage.removeItem(dbFavoriteKey);
}

// 收藏列表折叠 读取、删除
function getFavoriteListExpend() {
    return JSON.parse(localStorage.getItem(dbFavoriteListExpendKey));
}
function removeFavoriteListExpend() {
    localStorage.removeItem(dbFavoriteListExpendKey);
}

// 头部搜索菜单显示隐藏开关
function getOldSearchDivVisible() {
    return localStorage.getItem(dbOldSearchDivVisibleKey);
}
function setOldSearchDivVisible(visible) {
    localStorage.setItem(dbOldSearchDivVisibleKey, visible);
}
function removeOldSearchDivVisible() {
    localStorage.removeItem(dbOldSearchDivVisibleKey);
}

// 标签谷歌机翻_首页开关
function getGoogleTranslateCategoryFontPage() {
    return localStorage.getItem(dbGoogleTranslateCategoryFontPage);
}
function removeGoogleTranslateCategoryFontPage() {
    localStorage.removeItem(dbGoogleTranslateCategoryFontPage);
}

// 标签谷歌机翻_详情页开关
function getGoogleTranslateCategoryDetail() {
    return localStorage.getItem(dbGoogleTranslateCategoryDetail);
}
function removeGoogleTranslateCategoryDetail() {
    localStorage.removeItem(dbGoogleTranslateCategoryDetail);
}

// 消息通知页面同步
function getDbSyncMessage() {
    return localStorage.getItem(dbSyncMessageKey);
}
function setDbSyncMessage(msg) {
    removeDbSyncMessage();
    localStorage.setItem(dbSyncMessageKey, msg);
}
function removeDbSyncMessage() {
    localStorage.removeItem(dbSyncMessageKey);
}

// 搜索模式
function getSearchMode() {
    return localStorage.getItem(dbFrontPageSearchMode);
}
function setSearchMode(mode) {
    return localStorage.setItem(dbFrontPageSearchMode, mode);
}

// 存储有损压缩图片
function getBgLowImage() {
    return localStorage.getItem(dbBgLowImageBase64);
}
function setBgLowImage(base64) {
    return localStorage.setItem(dbBgLowImageBase64, base64);
}
function removeBgLowImage() {
    localStorage.removeItem(dbBgLowImageBase64);
}

// 我的标签上传到账号剩余数量
function getMyTagsUploadingRemainderCount() {
    return localStorage.getItem(dbMyTagsUploadingRemainderCount);
}
function setMyTagsUploadingRemainderCount(uploadingRemainderCount) {
    return localStorage.setItem(dbMyTagsUploadingRemainderCount, uploadingRemainderCount);
}
function removeMyTagsUploadingRemainderCount() {
    localStorage.removeItem(dbMyTagsUploadingRemainderCount);
}
//#endregion

//#region step0.switch.js 判断域名选择 exhentai 还是 e-henatai
const webHost = window.location.host;
function func_eh_ex(ehFunc, exFunc) {
    if (webHost == "e-hentai.org") {
        ehFunc();
    }
    else if (webHost == "exhentai.org") {
        exFunc();
    }
}

//#endregion

//#region step1.1.styleInject.js 样式注入
func_eh_ex(() => {
    // e-hentai 样式 eh.css
    const category_style = `#searchbox #data_update_tip,
	#gd2 #data_update_tip,
	.t_popular_toppane #data_update_tip,
	.t_favorite_ido #data_update_tip {
		position: absolute;
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		border: 1px solid #5c0d12;
		margin-top: -1px;
		margin-left: -1px;
		background-color: #edebdf;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	#searchbox #data_update_tip {
		top: 0;
		left: 0;
	}
	
	#gd2 #data_update_tip,
	.t_favorite_ido #data_update_tip {
		top: 2px;
		right: 15px;
	}
	
	.t_popular_toppane {
		padding: 10px 0;
	}
	
	.t_popular_dms div select {
		margin-top: -6px;
	}
	
	.t_popular_toppane #data_update_tip {
		top: 16px;
		left: 180px;
	}
	
	
	#searchbox #div_fontColor_btn,
	#searchbox #div_background_btn,
	#searchbox #div_top_visible_btn,
	#searchbox #div_searchMode_btn {
		position: absolute;
		top: 0;
		width: 70px;
		height: 20px;
		line-height: 20px;
		background-color: #e3e0d1;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
		border: 1px solid #5c0d12;
		margin-top: -1px;
		margin-right: -1px;
	}
	
	#searchbox #div_fontColor_btn {
		right: 210px;
	}
	
	#searchbox #div_background_btn {
		right: 140px;
	}
	
	#searchbox #div_top_visible_btn {
		right: 70px;
	}
	
	#searchbox #div_searchMode_btn {
		right: 0;
	}
	
	#searchbox #div_fontColor_btn:hover,
	#searchbox #div_background_btn:hover,
	#searchbox #div_top_visible_btn:hover,
	#searchbox #div_searchMode_btn:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
		background-color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_loading_div {
		height: 527px;
		width: 100%;
		line-height: 527px;
		text-align: center;
		font-size: 20px;
	}
	
	#div_ee8413b2_bg::before {
		background-size: 100%;
		opacity: 0.5;
	}
	
	#div_ee8413b2_bg {
		z-index: -9999;
		overflow: hidden;
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	#div_ee8413b2_bg::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		filter: blur(2px);
	
	}
	
	#div_ee8413b2 #background_form,
	#div_ee8413b2 #frontPage_listFontColor {
		border: 1px solid #5c0d12;
		width: 340px;
		height: 270px;
		background-color: #e3e0d1;
		position: absolute;
		color: #5c0d12;
		padding-top: 30px;
		display: none;
	}
	
	#div_ee8413b2 #background_form {
		left: calc(50% - 170px);
		top: 100px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor {
		left: calc(50% - 255px);
		top: 190px;
	}
	
	#div_ee8413b2 #background_form #background_form_top,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_top {
		height: 30px;
		width: 310px;
		position: absolute;
		top: 0;
		cursor: move;
	}
	
	#div_ee8413b2 #background_form #bg_upload_file {
		display: none;
	}
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 1px solid black;
		border-bottom: 1px solid black;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
		color: #5c0d12;
	}
	
	#div_ee8413b2 #background_form .background_form_item,
	#div_ee8413b2 #frontPage_listFontColor .frontPage_listFontColor_item {
		padding: 15px 0 15px 40px;
		min-height: 30px;
	}
	
	#div_ee8413b2 #background_form label,
	#div_ee8413b2 #frontPage_listFontColor label {
		float: left;
		height: 30px;
		line-height: 30px;
		min-width: 90px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		border: 1px solid black;
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		background-color: #3a3939;
		cursor: pointer;
		float: left;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn {
		background-color: darkred;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn:hover {
		background-color: red;
	}
	
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn {
		background-color: darkgreen;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn:hover {
		background-color: green;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		background-color: darkslateblue;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #bgImg_cancel_btn:hover {
		background-color: slateblue;
	}
	
	#div_ee8413b2 #background_form #bgUploadBtn {
		width: 100px;
		margin-left: 5px;
		background-color: #5c0d12;
	}
	
	#div_ee8413b2 #background_form #background_form_close:hover,
	#div_ee8413b2 #background_form #bgUploadBtn:hover,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range,
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		float: left;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range {
		height: 27px;
		margin-right: 10px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		height: 30px;
		width: 80px;
		margin: 0 12px;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val,
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		float: left;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val {
		width: 50px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		width: 80px;
	}
	
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		border: 1px solid #5c0d12;
		margin: 0 auto;
		padding: 10px;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		border: 1px solid #5c0d12;
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 0;
		height: 48px;
		line-height: 42px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
		overflow: hidden;
	}
	
	
	/* 头部按钮 */
	
	#div_ee8413b2 #search_wrapper #search_top {
		width: 100%;
		height: 50px;
	}
	
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d12;
		text-align: center;
		vertical-align: middle;
		float: left;
		cursor: pointer;
		font-size: 18px;
	}
	
	#div_ee8413b2 #search_top #category_favorites_button {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d12;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: pointer;
		font-size: 18px;
		display: none;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button_disabled {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d1245;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: not-allowed;
		font-size: 18px;
		color: #5c0d1245;
	}
	
	#div_ee8413b2 #search_top #category_search_input {
		width: calc(100% - 392px);
		height: 48px;
		border: 1px solid #5c0d12;
		float: left;
		margin: 0 10px 0 40px;
	}
	
	#div_ee8413b2 #category_search_input #input_info {
		width: calc(100% - 104px);
		height: 48px;
		float: left;
		padding: 0 4px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 15px;
		margin-top: 2px;
		background-color: transparent;
		caret-color: black;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input_enter {
		margin-left: -15px;
		cursor: pointer;
		display: inline-block;
		color: #e3e0d1;
	}
	
	.user_input_null_backcolor {
		background-color: #f5cc9c80 !important;
	}
	
	.user_input_value_backColor {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input:focus,
	#div_ee8413b2 #category_search_input #input_info #user_input:hover {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		display: inline-block;
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 4px;
		margin-top: 4px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
		padding: 4px 6px;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item:hover {
		border: 1px solid red;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #category_search_input #input_clear {
		width: 47px;
		height: 48px;
		line-height: 48px;
		float: right;
		cursor: pointer;
		font-size: 18px;
		text-align: center;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button {
		border-left: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_wrapper #display_div {
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_favorites_div,
	#div_ee8413b2 #search_wrapper #category_all_div {
		width: calc(100% - 2px);
		border: 1px solid #5c0d12;
		margin-top: 10px;
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_all_div,
	#div_ee8413b2 #search_wrapper #category_favorites_div {
		display: none;
	}
	
	#div_ee8413b2 #favorites_list .favorite_items_div,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div h4,
	#div_ee8413b2 #favorites_list h4,
	#div_ee8413b2 #favorites_edit_list h4 {
		padding: 0;
		margin: 10px;
		color: #5c0d11;
	}
	
	#div_ee8413b2 #category_all_div .c_item,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item {
		margin: 3px 3px 3px 10px;
		font-size: 15px;
		cursor: pointer;
		display: inline-block;
		color: #5c0d11;
	}
	
	#div_ee8413b2 #category_all_div .c_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover {
		color: #ff4500;
	}
	
	#div_ee8413b2 #category_all_div .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear {
		margin: 3px 0 3px 10px;
		border: 1px solid #5c0d11;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #5c0d11;
	}
	
	.chooseTab {
		background-color: #5c0d12;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_all_div #category_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_favorites_div #favorites_editor {
		width: 100%;
		height: 25px;
	}
	
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		border-bottom: 1px solid #5c0d12;
		border-right: 1px solid #5c0d12;
		width: 49.5px;
		float: left;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover {
		border-bottom: 1px solid #5c0d12;
		border-left: 1px solid #5c0d12;
		width: 49.5px;
		float: right;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorite_upload_files {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend {
		width: calc(100% - 48px);
		margin-left: -1px;
		border: 1px solid #5c0d12;
		border-top: 0;
		background-color: #e3e0d1;
		max-height: 500px;
		overflow-y: auto;
		position: relative;
	}
	
	.t_favorite_ido #category_user_input_recommend {
		border: 1px solid #5c0d12;
		border-top: 0;
		background-color: #e3e0d1;
		max-height: 500px;
		position: relative;
		top: -10px;
		z-index: 100;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		font-weight: bold;
		cursor: pointer;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:not(:first-child),
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:hover,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #c5c3b8;
	}
	
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		display: none;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		min-height: 90px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_list .category_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div #category_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list h4 {
		font-size: 16px;
	}
	
	#div_ee8413b2 #category_all_div #category_list,
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		height: 500px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar,
	.torrents_detail_info #etd p::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-track,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-track,
	.torrents_detail_info #etd p::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-thumb,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-thumb,
	.torrents_detail_info #etd p::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_loading_div,
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button,
	#div_ee8413b2 #category_search_input #input_clear,
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #search_top #category_addFavorites_button,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel,
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover,
	#div_ee8413b2 #category_list .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear,
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #favorites_edit_list .f_edit_item {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper #search_close:hover,
	#div_ee8413b2 #search_top #category_all_button:hover,
	#div_ee8413b2 #search_top #category_favorites_button:hover,
	#div_ee8413b2 #category_search_input #input_clear:hover,
	#div_ee8413b2 #category_search_input #category_enter_button:hover,
	#div_ee8413b2 #search_top #category_addFavorites_button:hover,
	#div_ee8413b2 #category_editor #all_collapse:hover,
	#div_ee8413b2 #category_editor #all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_edit:hover,
	#div_ee8413b2 #favorites_editor #favorites_clear:hover,
	#div_ee8413b2 #favorites_editor #favorites_save:hover,
	#div_ee8413b2 #favorites_editor #favorites_cancel:hover,
	#div_ee8413b2 #favorites_editor #favorites_export:hover,
	#div_ee8413b2 #favorites_editor #favorites_recover:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_list .category_extend:hover,
	#div_ee8413b2 #favorites_list .favorite_extend:hover,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear:hover,
	#div_ee8413b2 #category_list .c_item:hover,
	#div_ee8413b2 #favorites_list .c_item:hover {
		transform: scale(2);
	}
	
	.searchtext #googleTranslateDiv #googleTranslateCheckbox,
	.ip #googleTranslateDiv #googleTranslateCheckbox {
		margin-left: -3px;
	}
	
	.t_popular_toppane #googleTranslateDiv #googleTranslateCheckbox,
	.t_favorite_ido #googleTranslateDiv #googleTranslateCheckbox {
		margin-left: 5px;
	}
	
	.t_torrentsPage_ido #googleTranslateDiv #googleTranslateCheckbox {
		margin-left: 11px;
	}
	
	.searchtext #googleTranslateDiv,
	.ip #googleTranslateDiv,
	.t_popular_toppane #googleTranslateDiv,
	.t_toplist_ido #googleTranslateDiv,
	.t_torrentsPage_ido #googleTranslateDiv,
	.t_tosPage_stuffbox #googleTranslateDiv,
	.t_favorite_ido #googleTranslateDiv {
		float: left;
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		position: absolute;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
		font-weight: bold;
	}
	
	#dms #googleTranslateDiv {
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		width: 120px;
		position: absolute;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
		font-weight: bold;
		left: 6px;
		font-size: 13px;
	}
	
	#dms #googleTranslateDiv input {
		margin-left: -4px;
	}
	
	.t_favorite_ido #googleTranslateDiv {
		margin-top: -76px;
		position: absolute;
		right: 16px;
	}
	
	.searchtext #googleTranslateDiv,
	.ip #googleTranslateDiv {
		top: 25px;
	}
	
	.t_favorite_ido #dms #googleTranslateDiv {
		margin-top: -42px;
		right: 16px;
	}
	
	.t_popular_toppane #googleTranslateDiv {
		margin-top: -30px;
	}
	
	.t_toplist_ido #googleTranslateDiv {
		top: 40px;
		right: 10px;
	}
	
	.t_toplist_bookrage #googleTranslateDiv {
		top: 11px;
		left: 5px;
	}
	
	.t_torrentsPage_ido #googleTranslateDiv {
		top: 105px;
	}
	
	.t_tosPage_stuffbox #googleTranslateDiv {
		width: 78px;
		float: right;
		position: relative;
	}
	
	.searchtext #translateLabel,
	.t_popular_toppane #translateLabel,
	.t_toplist_ido #translateLabel,
	.t_favorite_ido #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel,
	.t_popular_toppane #googleTranslateDiv,
	.t_popular_toppane #translateLabel,
	.t_toplist_ido #googleTranslateDiv,
	.t_toplist_ido #translateLabel,
	.t_torrentsPage_ido #googleTranslateDiv,
	.t_torrentsPage_ido #translateLabel,
	.t_tosPage_stuffbox #googleTranslateDiv,
	.t_tosPage_stuffbox #translateLabel,
	.t_favorite_ido #googleTranslateDiv,
	.t_favorite_ido #translateLabel {
		cursor: pointer;
	}
	
	.div_ee8413b2_category_checked {
		background-color: darkred !important;
	}
	
	.div_ee8413b2_category_checked a {
		color: white;
	}
	
	#gd5 #googleTranslateDiv,
	.t_toplist_ido #googleTranslateDiv {
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
		margin-bottom: 15px;
	}
	
	#gd5 #googleTranslateDiv #translateLabel,
	.t_toplist_ido #googleTranslateDiv #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#gd5 #googleTranslateDiv,
	#gd5 #googleTranslateDiv #googleTranslateCheckbox,
	#gd5 #googleTranslateDiv #translateLabel,
	.t_toplist_ido #googleTranslateDiv,
	.t_tosPage_stuffbox #googleTranslateDiv {
		cursor: pointer;
	}
	
	#div_ee8413b2_detail_clearBtn,
	#div_ee8413b2_detail_addFavoriteBtn,
	#div_ee8413b2_detail_searchBtn {
		width: 130px;
		height: 25px;
		line-height: 25px;
		font-weight: bold;
		font-size: 13px;
		border: 1px solid #8d8d8d;
		background-color: #edebdf;
		border-radius: 3px;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		margin: 0 auto;
		margin-bottom: 15px;
		display: none;
	}
	
	#dms #googleTranslateDiv:hover,
	.searchtext #googleTranslateDiv:hover,
	.ip #googleTranslateDiv:hover,
	#gd5 #googleTranslateDiv:hover,
	#div_ee8413b2_detail_clearBtn:hover,
	#div_ee8413b2_detail_addFavoriteBtn:hover,
	#div_ee8413b2_detail_searchBtn:hover,
	.t_popular_toppane #googleTranslateDiv:hover,
	.t_toplist_ido #googleTranslateDiv:hover,
	.t_torrentsPage_ido #googleTranslateDiv:hover,
	.t_tosPage_stuffbox #googleTranslateDiv:hover,
	.t_torrentsPage_ido #googleTranslateDiv:hover,
	.t_favorite_ido #googleTranslateDiv:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#nb {
		font-size: 17px;
		padding-top: 8px;
	}
	
	#nb>div {
		background-image: none;
	}
	
	#nb div a:hover {
		color: red;
	}
	
	#dms>div>select {
		left: -87px;
		width: 206px;
	}
	
	table.itg>tbody>tr>th {
		text-align: center;
		font-size: 13px;
	}
	
	table td.tc {
		min-width: 30px;
	}
	
	table.itg tr:not(:first-child):hover {
		background-color: #e0ded3;
	}
	
	table.itg tr:first-child:hover,
	div.itg .gl1t:hover {
		background-color: #e0ded3;
	}
	
	div#gdf a {
		text-decoration: underline;
	}
	
	.glname table td.tc,
	#taglist table td.tc {
		min-width: 50px;
	}
	
	#taglist::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#taglist::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#taglist::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#gmid #gd5 .g3,
	#gmid #gd5 .g2 {
		padding-bottom: 10px;
	}
	
	table .gt,
	table .gtl,
	table .gtw {
		height: 18px;
		line-height: 18px;
	}
	
	.headMenu_check {
		border-top: 2px solid #070101;
		padding-top: 6px !important;
		margin-top: -8px;
	}
	
	.t_toplist_ido h2 {
		padding: 20px 0 10px 0;
		border-bottom: 1px dashed #5c0d12;
		font-size: 1.5em;
	}
	
	.t_favorite_ido .nosel {
		border-radius: 10px;
		margin-top: 20px !important;
		padding-top: 20px;
		padding-left: 30px;
		height: 65px;
		border: 1px solid #C2C1C1;
		background-color: #e3e0d1;
	}
	
	.t_favorite_ido .nosel .fp:last-child {
		background-color: #e3e0d1;
		top: -87px;
	}
	
	.t_favorite_ido .nosel .fp:last-child:hover,
	.t_favorite_ido .nosel .fps {
		background-color: #edebdf !important;
	}
	
	.t_favorite_ido .favorite_null {
		color: #c3bfbf;
	}
	
	.t_favorite_ido .searchDiv {
		width: 855px !important;
		height: 30px;
		margin: 0 auto !important;
		padding: 10px 0 30px 0;
	}
	
	.t_favorite_ido .searchDiv .searchInputDiv {
		float: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv {
		float: right;
		width: 310px !important;
		padding-right: 0 !important;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td {
		width: auto !important;
		height: 30px;
		display: inline-block;
		line-height: 30px;
		text-align: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td label {
		height: 30px;
		line-height: 30px;
	}
	
	.gm #h1Origin_copy {
		font-size: 10pt;
		padding: 0 0 2px;
		margin: 3px 15px;
		color: #b8b8b8;
		border-bottom: 1px solid #000000;
	}
	
	.gm #h1Origin_copy {
		font-size: 10pt;
		padding: 0 0 2px;
		margin: 3px 15px;
		color: #9F8687;
		border-bottom: 1px solid #5C0D12;
	}
	
	.gm #h1Title_copy {
		font-size: 12pt;
		padding: 0 0 2px;
		margin: 3px 15px;
	}
	
	.torrents_detail_info,
	.torrents_detail_index {
		min-height: 535px;
		height: auto !important;
	}
	
	.t_torrentsPage_ido #torrentform {
		width: 660px;
		margin: 20px auto;
		height: 50px;
	}
	
	.t_torrentsPage_ido #focusme {
		float: left;
	}
	
	.t_torrentsPage_ido #torrentform p {
		float: left;
		margin-top: 5px;
	}
	
	.torrents_detail_info table:nth-child(3) {
		margin-left: 15% !important;
	}
	
	.torrents_detail_info a {
		text-decoration: underline !important;
	}
	
	.torrents_detail_info #etd p {
		height: 214px;
		padding: 0 1px;
		overflow-y: auto;
	}
	
	.torrents_detail_info #etd #googleTranslateDiv {
		background-color: #dbd3a8;
		display: inline-block;
		margin-left: -1px;
		padding: 0 10px 3px 10px;
		margin-top: 2px;
		cursor: pointer;
	}
	
	.torrents_detail_index form table tr td:nth-child(4),
	.torrents_detail_index form table tr td:nth-child(5) {
		text-align: center;
	}
	
	.t_newspage_souter #nb {
		min-height: 29px;
		max-height: 29px;
	}
	
	.t_newspage_souter #nb a {
		font-size: 17px;
	}
	
	.t_newspage_souter #imgHiddenBtn {
		width: 100px;
		float: right;
		margin-top: -34px;
		margin-right: -11px;
		margin-bottom: -30px;
		height: 25px;
		line-height: 26px;
		border: 1px solid #5c0d12;
		text-align: center;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	/* 新闻头部图片边框 */
	.t_newspage_souter .hiddenTopImgBorder {
		height: 0;
	}
	
	.t_newspage_souter #googleTranslateDiv {
		width: 120px;
		margin-top: -8px;
		margin-bottom: -30px;
		margin-left: -11px;
		height: 25px;
		line-height: 26px;
		text-align: center;
		cursor: pointer;
		border: 1px solid #5c0d12;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_newspage_souter #googleTranslateDiv #translateLabel {
		cursor: pointer;
	}
	
	.t_newspage_souter #botm {
		overflow: hidden;
	}
	
	.t_newspage_souter .title_extend {
		position: relative;
		top: -3px;
		right: -10px;
		border: 1px solid #5c0d11;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #5c0d11;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_newspage_souter .title_extend:hover {
		transform: scale(1.5);
	}
	
	.t_newspage_souter .nwo h2 {
		margin-top: 7px;
	}
	
	.t_newspage_souter .nwo h2 div {
		margin-bottom: 6px;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_select {
		display: inline-block;
	}
	
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(1),
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(3) {
		width: auto;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_action {
		float: right;
		padding-top: 3px;
	}
	
	.t_uconfigPage_outer .span_pixel {
		position: relative;
		top: 2px;
	}
	
	.t_uconfigPage_outer form h2 {
		font-size: 18px;
		margin-top: 30px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper {
		height: calc(100vh - 168px);
		overflow: auto;
		margin: 5px 0;
		padding: 0 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm {
		margin-top: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm input[type="button"],
	.t_frontpage_ido #searchbox .nopm input[type="submit"] {
		width: 70px;
	}
	
	.t_frontpage_ido #advdiv {
		width: 598px;
		margin: auto;
		margin-top: 11px;
	}
	
	.t_frontpage_ido #advdiv,
	.t_frontpage_ido #fsdiv {
		padding: 10px 0;
		border: 1px ridge #5c0d12;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend {
		border: 1px solid #5c0d12;
		border-top: 0;
		background-color: #e3e0d1;
		max-height: 500px;
		position: relative;
		z-index: 99;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		font-weight: bold;
		cursor: pointer;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #5c0d12;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #c5c3b8;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	.t_detail_comment .comment_span {
		margin-right: 10px;
		float: left;
	}
	
	.t_detail_comment .comment_span,
	.t_detail_comment .comment_span input,
	.t_detail_comment .comment_span label {
		cursor: pointer;
	}
	
	#eventpane #eventpane_close_btn {
		width: 30px;
		height: 30px;
		border: 1px solid #5c0d11;
		line-height: 30px;
		float: right;
		margin-top: -4px;
		margin-right: -4px;
		font-size: 18px;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_tosPage_stuffbox {
		padding: 10px !important;
	}
	
	#t_mytags_div {
		width: calc(100% - 2px);
		border: 1px solid #5c0d11;
		margin-bottom: 10px;
	}
	
	#t_mytags_data_update_tip {
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		position: absolute;
		margin-top: 5px;
		display: none;
		background-color: #34353b;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#t_mytags_div #t_mytags_top {
		height: 49px;
		width: 100%;
	}
	
	#t_mytags_div #t_mytags_bottom {
		height: 0;
		overflow-y: hidden;
	}
	
	#t_mytags_div #t_mytags_bottom #t_favoriteCategories {
		width: 100%;
		height: 100%;
		float: left;
	}
	
	#t_mytags_top #clear_search_btn,
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn {
		border: 1px solid #5c0d11;
		height: 35px;
		line-height: 35px;
		margin: 5.5px 10px 0 0;
		cursor: pointer;
		text-align: center;
		color: #5c0d11;
	}
	
	#t_mytags_top #t_mytags_extend_btn {
		float: left;
		margin-left: 10px;
	}
	
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn {
		width: 130px;
	}
	
	#t_mytags_top #clear_search_btn {
		width: 50px;
		float: left;
		margin-left: -11px;
		text-align: center;
		color: #5c0d11;
	}
	
	#t_mytags_top #t_mytags_clodToFavorite_btn,
	#t_mytags_top #t_mytags_submitCategories_btn {
		float: right;
	}
	
	#t_mytags_top #t_mytags_search {
		border: 1px solid #5c0d11;
		height: 31px;
		line-height: 31px;
		margin: 5.5px 10px 0 0;
		background-color: transparent;
		color: #5c0d11;
		padding-left: 5px;
		float: left;
		margin-left: 26px;
		width: calc(100% - 560px);
		min-width: 100px;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_tool {
		height: 25px;
	}
	
	#t_mytags_bottom p {
		height: 24px;
		line-height: 24px;
		margin: 0;
		padding: 0;
		font-weight: bold;
		border-top: 1px solid #5c0d11;
		text-align: center;
		color: #5c0d11;
	}
	
	#t_mytags_bottom #favoriteCategories_allCheck:indeterminate::after {
		display: block;
		content: "";
		width: 7px;
		height: 3px;
		background-color: #0075FF;
		border-radius: 2px;
		margin-left: 3px;
		margin-top: 5px;
	}
	
	#t_mytags_bottom #mytags_right_all_collapse,
	#t_mytags_bottom #mytags_right_all_expand {
		border-left: 1px solid #5c0d11;
		border-top: 1px solid #5c0d11;
		height: 24px;
		line-height: 24px;
		width: 50.5px;
		float: right;
		cursor: pointer;
		text-align: center;
		color: #5c0d11;
		cursor: pointer;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window {
		height: 325px;
		overflow-y: auto;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	#t_mytags_bottom #t_favoriteCategories_window h4 {
		color: #5c0d11;
		font-weight: bold;
		margin: 0;
		margin-top: 10px;
		padding-left: 10px;
	}
	
	#t_mytags_bottom #t_favoriteCategories_window h4 span {
		border: 1px solid #5c0d11;
		width: 12px;
		display: inline-block;
		text-align: center;
		height: 12px;
		line-height: 12px;
		font-weight: 500;
		cursor: pointer;
	}
	
	#t_mytags_bottom #t_favoriteCategories_window h4 span:hover {
		transform: scale(1.2);
	}
	
	#t_mytags_bottom .mytags_item_wrapper {
		border: 1px solid #5c0d11;
		border-radius: 5px;
		margin: 10px 0 0 10px;
		display: inline-block;
		padding: 2px 5px;
		color: #5c0d11;
	}
	
	#t_mytags_bottom .mytags_item_wrapper,
	#t_mytags_bottom .mytags_item_wrapper input[type="checkbox"],
	#t_mytags_bottom .mytags_item_wrapper label {
		cursor: pointer;
	}
	
	#t_mytags_bottom .mytags_item_wrapper label {
		line-height: 20px;
	}
	
	#t_mytags_bottom #t_mytags_favoritecategory_loading_div {
		height: 325px;
		width: 100%;
		line-height: 325px;
		text-align: center;
		font-size: 20px;
	}
	
	
	#t_mytags_top #clear_search_btn,
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn,
	#t_mytags_bottom #mytags_right_all_collapse,
	#t_mytags_bottom #mytags_right_all_expand,
	#t_mytags_bottom p,
	#t_mytags_bottom .mytags_item_wrapper,
	#t_mytags_bottom #t_favoriteCategories_window h4 span {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#t_mytags_top #clear_search_btn:hover,
	#t_mytags_top #t_mytags_extend_btn:hover,
	#t_mytags_top #t_mytags_submitCategories_btn:hover,
	#t_mytags_top #t_mytags_clodToFavorite_btn:hover,
	#t_mytags_bottom #mytags_right_all_collapse:hover,
	#t_mytags_bottom #mytags_right_all_expand:hover,
	#t_mytags_bottom .mytags_item_wrapper:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(1) {
		width: 180px;
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(3) {
		width: 86px;
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(6) {
		padding-left: 50px;
	}
	
	.hide {
		display: none !important;
	}
	
	.t_mytagsPage_outer #upload_tag_form {
		border: 2px solid #5c0d11;
		background-color: #e3e0d1;
		color: #5c0d11;
		width: 800px;
		height: 400px;
		position: absolute;
		top: calc(50vh - 200px);
		left: calc(50vw - 400px);
		z-index: 99;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_top {
		height: 30px;
		width: 100%;
		position: absolute;
		top: 0;
		cursor: move;
		text-align: center;
		line-height: 30px;
		font-weight: bold;
		font-size: 16px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 2px solid #5c0d11;
		border-bottom: 2px solid #5c0d11;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle {
		height: 320px;
		width: 100%;
		margin-top: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_left,
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_right {
		height: 280px;
		padding: 20px 10px 0 20px;
		width: calc(50% - 30.5px);
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_split {
		width: 0;
		margin-top: 20px;
		height: 280px;
		border-left: 1px solid #5c0d11;
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom {
		height: 30px;
		width: 100%;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item {
		font-size: 10px;
		height: 40px;
		margin-bottom: 40px;
		margin-top: 25px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item:first-child {
		height: 60px;
	}
	
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label {
		height: 30px;
		line-height: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label {
		width: 88px;
		height: 60px;
		line-height: 60px;
		float: left;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.color_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.weight_label {
		width: 88px;
		height: 40px;
		line-height: 40px;
		float: left;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label {
		height: 60px;
		line-height: 60px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.color_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.weight_label {
		height: 40px;
		line-height: 40px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item input[type="color"],
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item input[type="range"] {
		float: left;
		width: 100px;
		height: 30px;
		margin-top: 5px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #tag_color_val,
	.t_mytagsPage_outer #upload_tag_form #tag_weight_val {
		float: left;
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 80px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #checkboxDiv {
		width: 170px;
		height: 80px;
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #checkboxDiv input {
		position: relative;
		top: 2px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn,
	.t_mytagsPage_outer #upload_tag_form #tag_color_reset_btn,
	.t_mytagsPage_outer #upload_tag_form #weight_reset_btn {
		border: 1px solid #5c0d11;
		padding: 2px 10px;
		width: 50px;
		text-align: center;
		height: 30px;
		line-height: 30px;
		float: right;
		margin-right: 15px;
		cursor: pointer;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_close:hover,
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn:hover,
	.t_mytagsPage_outer #upload_tag_form #tag_color_reset_btn:hover,
	.t_mytagsPage_outer #upload_tag_form #weight_reset_btn:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn {
		margin-top: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom {
		width: 100%;
		height: 30px;
		text-align: center;
		color: white;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn,
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn {
		width: 100px;
		border: 1px solid black;
		height: 28px;
		line-height: 28px;
		text-align: center;
		float: left;
		font-size: 10px;
		cursor: pointer;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn {
		margin-left: 275px;
		background-color: darkgreen;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn:hover {
		background-color: green;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn {
		margin-left: 50px;
		background-color: darkslateblue;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn:hover {
		background-color: slateblue;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div {
		height: 260px;
		overflow-y: auto;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 {
		margin: 0;
		margin-top: 10px;
		color: #5c0d11;
		font-weight: bold;
		margin-bottom: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 span {
		border: 1px solid #5c0d11;
		cursor: pointer;
		width: 12px;
		display: inline-block;
		text-align: center;
		height: 12px;
		line-height: 12px;
		font-weight: 500;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 span:hover {
		transform: scale(1.2);
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right .checkTags_item {
		display: inline-block;
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
		margin: 0 10px 10px 0;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right .checkTags_item:hover {
		border: 1px solid red;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #checkTags_reset_btn {
		color: #5c0d11;
		border: 1px solid #5c0d11;
		text-align: center;
		height: 50px;
		line-height: 50px;
		width: 150px;
		margin: 105px auto;
		cursor: pointer;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #checkTags_reset_btn:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	.t_mytagsPage_outer #upload_tag_ing {
		border: 2px solid #5c0d11;
		background-color: #e3e0d1;
		color: #5c0d11;
		padding: 0 20px;
		width: 300px;
		height: 300px;
		position: absolute;
		top: calc(50vh - 150px);
		left: calc(50vw - 150px);
		z-index: 99;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing:hover {
		border-color: yellow;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_top {
		height: 60px;
		line-height: 60px;
		width: calc(100% - 40px);
		position: absolute;
		top: 0;
		cursor: move;
		text-align: center;
		font-weight: bold;
		font-size: 18px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_1 {
		margin-top: 80px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_1,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_2,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_error {
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_error {
		margin-bottom: -20px;
		display: none;
		color: red;
		font-size: 17px;
		font-weight: bold;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #tip_pause {
		color: darkorange;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #tip_continue {
		color: darkgreen;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_remainder,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_success {
		margin-top: 20px;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_success {
		font-size: 20px;
		font-weight: bold;
		color: darkgreen;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_remainder #upload_remainder_count {
		font-size: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn,
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn {
		color: white;
		border: 1px solid black;
		width: 100px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		cursor: pointer;
		margin: 30px auto;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn {
		background-color: darkred;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn:hover {
		background-color: red;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn {
		background-color: darkslateblue;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn:hover {
		background-color: slateblue;
	}
	
	.t_mytagsPage_outer #usertags_outer>div:hover {
		background-color: #e3e0d1b3;
	}
	
	.t_mytagsPage_outer #usertags_outer>div>div:nth-child(6)>input {
		margin-left: 6px
	}
	
	.t_mytagsPage_outer .tagcolor,
	#tagcolor {
		width: 99px;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer {
		width: 850px;
		overflow-y: auto;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}`;
    styleInject(category_style);
}, () => {
    // exhentai 样式 ex.css
    const category_style = `#searchbox #data_update_tip,
	#gd2 #data_update_tip,
	.t_popular_toppane #data_update_tip,
	.t_favorite_ido #data_update_tip {
		position: absolute;
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		background-color: #34353b;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	#searchbox #data_update_tip {
		top: 0;
		left: 0;
	}
	
	#gd2 #data_update_tip,
	.t_favorite_ido #data_update_tip {
		top: 2px;
		right: 15px;
	}
	
	.t_popular_toppane {
		padding: 10px 0;
	}
	
	.t_popular_dms div select {
		margin-top: -6px;
	}
	
	.t_popular_toppane #data_update_tip {
		top: 16px;
		left: 180px;
	}
	
	#searchbox #div_fontColor_btn,
	#searchbox #div_background_btn,
	#searchbox #div_top_visible_btn,
	#searchbox #div_searchMode_btn {
		position: absolute;
		top: 0;
		width: 70px;
		height: 20px;
		line-height: 20px;
		background-color: #34353b;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
	}
	
	#searchbox #div_fontColor_btn {
		right: 210px;
	}
	
	#searchbox #div_background_btn {
		right: 140px;
	}
	
	#searchbox #div_top_visible_btn {
		right: 70px;
	}
	
	#searchbox #div_searchMode_btn {
		right: 0;
	}
	
	#searchbox #div_fontColor_btn:hover,
	#searchbox #div_background_btn:hover,
	#searchbox #div_top_visible_btn:hover,
	#searchbox #div_searchMode_btn:hover {
		background-color: #43464e;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
		background-color: #4f535b;
	}
	
	#div_ee8413b2 #category_loading_div {
		height: 527px;
		width: 100%;
		line-height: 527px;
		text-align: center;
		font-size: 20px;
	}
	
	#div_ee8413b2_bg::before {
		background-size: 100%;
		opacity: 0.5;
	}
	
	#div_ee8413b2_bg {
		z-index: -9999;
		overflow: hidden;
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	#div_ee8413b2_bg::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		filter: blur(2px);
	
	}
	
	
	#div_ee8413b2 #background_form,
	#div_ee8413b2 #frontPage_listFontColor {
		border: 1px solid white;
		width: 340px;
		height: 270px;
		background-color: #40454b;
		position: absolute;
		color: white;
		padding-top: 30px;
		display: none;
	}
	
	#div_ee8413b2 #background_form {
		left: calc(50% - 170px);
		top: 100px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor {
		left: calc(50% - 255px);
		top: 190px;
	}
	
	#div_ee8413b2 #background_form #background_form_top,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_top {
		height: 30px;
		width: 310px;
		position: absolute;
		top: 0;
		cursor: move;
	}
	
	#div_ee8413b2 #background_form #bg_upload_file {
		display: none;
	}
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 1px solid white;
		border-bottom: 1px solid white;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
	}
	
	#div_ee8413b2 #background_form .background_form_item,
	#div_ee8413b2 #frontPage_listFontColor .frontPage_listFontColor_item {
		padding: 15px 0 15px 40px;
		min-height: 30px;
	}
	
	#div_ee8413b2 #background_form label,
	#div_ee8413b2 #frontPage_listFontColor label {
		float: left;
		height: 30px;
		line-height: 30px;
		min-width: 90px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		border: 1px solid black;
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		background-color: #3a3939;
		cursor: pointer;
		float: left;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn {
		background-color: darkred;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn:hover {
		background-color: red;
	}
	
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn {
		background-color: darkgreen;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn:hover {
		background-color: green;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		background-color: darkslateblue;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #bgImg_cancel_btn:hover {
		background-color: slateblue;
	}
	
	#div_ee8413b2 #background_form #bgUploadBtn {
		width: 100px;
		margin-left: 5px;
	}
	
	#div_ee8413b2 #background_form #background_form_close:hover,
	#div_ee8413b2 #background_form #bgUploadBtn:hover,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close:hover {
		background-color: #4e4e4e;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range,
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		float: left;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range {
		height: 27px;
		margin-right: 10px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		height: 30px;
		width: 80px;
		margin: 0 12px;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val,
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		float: left;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val {
		width: 50px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		width: 80px;
	}
	
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		border: 1px solid #484b53;
		margin: 0 auto;
		padding: 10px;
		color: #F1F1F1;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		border: 1px solid #34353b;
		background-color: rgb(52 53 59 / 25%);
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 0;
		height: 48px;
		line-height: 42px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
		overflow: hidden;
	}
	
	
	/* 头部按钮 */
	
	#div_ee8413b2 #search_wrapper #search_top {
		width: 100%;
		height: 50px;
	}
	
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #34353b;
		background-color: rgb(52 53 59 / 25%);
		text-align: center;
		vertical-align: middle;
		float: left;
		cursor: pointer;
		font-size: 18px;
	}
	
	.btn_checked_class1 {
		background-color: transparent !important;
	}
	
	#div_ee8413b2 #search_top #category_favorites_button {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #34353b;
		background-color: #34353b78;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: pointer;
		font-size: 18px;
		display: none;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button_disabled {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #34353b45;
		background-color: rgb(52 53 59 / 25%);
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: not-allowed;
		font-size: 18px;
		color: #f1f1f145;
	}
	
	#div_ee8413b2 #search_top #category_search_input {
		width: calc(100% - 392px);
		height: 48px;
		border: 1px solid #34353b;
		background-color: rgb(52 53 59 / 25%);
		float: left;
		margin: 0 10px 0 40px;
	}
	
	#div_ee8413b2 #category_search_input #input_info {
		width: calc(100% - 104px);
		height: 48px;
		float: left;
		padding: 0 4px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 15px;
		margin-top: 2px;
		background-color: transparent;
		caret-color: black;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input_enter {
		margin-left: -15px;
		cursor: pointer;
		display: inline-block;
		color: #40454b;
	}
	
	.user_input_null_backcolor {
		background-color: #f5cc9c80 !important;
	}
	
	.user_input_value_backColor {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input:focus,
	#div_ee8413b2 #category_search_input #input_info #user_input:hover {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		display: inline-block;
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 4px;
		margin-top: 4px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
		padding: 4px 6px;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item:hover {
		border: 1px solid red;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #category_search_input #input_clear {
		width: 47px;
		height: 48px;
		line-height: 48px;
		float: right;
		cursor: pointer;
		font-size: 18px;
		text-align: center;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_wrapper #display_div {
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_favorites_div,
	#div_ee8413b2 #search_wrapper #category_all_div {
		width: calc(100% - 2px);
		border: 1px solid #34353bb5;
		margin-top: 10px;
		overflow: hidden;
		background-color: rgb(52 53 59 / 25%);
	}
	
	#div_ee8413b2 #search_wrapper #category_all_div,
	#div_ee8413b2 #search_wrapper #category_favorites_div {
		display: none;
	}
	
	#div_ee8413b2 #favorites_list .favorite_items_div,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div h4,
	#div_ee8413b2 #favorites_list h4,
	#div_ee8413b2 #favorites_edit_list h4 {
		padding: 0;
		margin: 10px;
		color: #fadfc0;
	}
	
	#div_ee8413b2 #category_all_div .c_item,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item {
		margin: 3px 3px 3px 10px;
		font-size: 15px;
		cursor: pointer;
		display: inline-block;
		color: #F5CC9C;
	}
	
	#div_ee8413b2 #category_all_div .c_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover {
		color: gold;
	}
	
	#div_ee8413b2 #category_all_div .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear {
		margin: 3px 0 3px 10px;
		border: 1px solid #fadfc0;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #fadfc0;
	}
	
	.chooseTab {
		background-color: #7b7e85c2;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_all_div #category_list {
		display: none;
	}
	
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_favorites_div #favorites_editor {
		width: 100%;
		height: 25px;
	}
	
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		border-bottom: 1px solid #42454c;
		border-right: 1px solid #42454c;
		width: 49.5px;
		float: left;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover {
		border-bottom: 1px solid #42454c;
		border-left: 1px solid #42454c;
		width: 49.5px;
		float: right;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorite_upload_files {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend {
		width: 100%;
		margin-left: -1px;
		border: 1px solid #34353b;
		border-top: 0;
		background-color: #484b53;
		max-height: 500px;
		overflow-y: auto;
		position: relative;
	}
	
	.t_favorite_ido #category_user_input_recommend {
		border: 1px solid #34353b;
		border-top: 0;
		background-color: #484b53;
		max-height: 500px;
		position: relative;
		top: -10px;
		z-index: 100;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		cursor: pointer;
		color: #ffde74;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #C2C1C1;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:not(:first-child),
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:hover,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #7b7e85c2;
	}
	
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		display: none;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		min-height: 90px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_list .category_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div #category_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list h4 {
		font-size: 16px;
	}
	
	#div_ee8413b2 #category_all_div #category_list,
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		height: 500px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar,
	.torrents_detail_info #etd p::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-track,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-track,
	.torrents_detail_info #etd p::-webkit-scrollbar-track {
		background-color: rgb(52 53 59 / 25%);
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-thumb,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-thumb,
	.torrents_detail_info #etd p::-webkit-scrollbar-thumb {
		background-color: rgb(52 53 59 / 50%);
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_loading_div,
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button,
	#div_ee8413b2 #category_search_input #input_clear,
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #search_top #category_addFavorites_button,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel,
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover,
	#div_ee8413b2 #category_list .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear,
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #favorites_edit_list .f_edit_item {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper #search_close:hover,
	#div_ee8413b2 #search_top #category_all_button:hover,
	#div_ee8413b2 #search_top #category_favorites_button:hover,
	#div_ee8413b2 #category_search_input #input_clear:hover,
	#div_ee8413b2 #category_search_input #category_enter_button:hover,
	#div_ee8413b2 #search_top #category_addFavorites_button:hover,
	#div_ee8413b2 #category_editor #all_collapse:hover,
	#div_ee8413b2 #category_editor #all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_edit:hover,
	#div_ee8413b2 #favorites_editor #favorites_clear:hover,
	#div_ee8413b2 #favorites_editor #favorites_save:hover,
	#div_ee8413b2 #favorites_editor #favorites_cancel:hover,
	#div_ee8413b2 #favorites_editor #favorites_export:hover,
	#div_ee8413b2 #favorites_editor #favorites_recover:hover {
		background-color: rgba(255, 246, 246, 0.1);
	}
	
	#div_ee8413b2 #category_list .category_extend:hover,
	#div_ee8413b2 #favorites_list .favorite_extend:hover,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear:hover,
	#div_ee8413b2 #category_list .c_item:hover,
	#div_ee8413b2 #favorites_list .c_item:hover {
		transform: scale(2);
	}
	
	.searchtext #googleTranslateDiv #googleTranslateCheckbox,
	.ip #googleTranslateDiv #googleTranslateCheckbox {
		margin-left: -3px;
	}
	
	.t_popular_toppane #googleTranslateDiv #googleTranslateCheckbox,
	.t_torrentsPage_ido #googleTranslateDiv #googleTranslateCheckbox,
	.t_favorite_ido #googleTranslateDiv #googleTranslateCheckbox {
		margin-left: 11px;
	}
	
	
	.searchtext #googleTranslateDiv,
	.ip #googleTranslateDiv,
	.t_popular_toppane #googleTranslateDiv,
	.t_torrentsPage_ido #googleTranslateDiv,
	.t_favorite_ido #googleTranslateDiv {
		float: left;
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 135px;
		height: 23px;
		line-height: 28px;
		position: absolute;
		border-radius: 3px;
		font-weight: bold;
	}
	
	#dms #googleTranslateDiv {
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		width: 135px;
		height: 23px;
		line-height: 28px;
		border-radius: 3px;
		font-weight: bold;
		position: absolute;
		left: 6px;
		font-size: 13px;
	}
	
	#dms #googleTranslateDiv input {
		margin-left: -4px;
	}
	
	.t_favorite_ido #googleTranslateDiv {
		margin-top: -76px;
		position: absolute;
		right: 16px;
	}
	
	.searchtext #googleTranslateDiv,
	.ip #googleTranslateDiv {
		top: 25px;
		left: -4px;
	}
	
	.t_favorite_ido #dms #googleTranslateDiv {
		margin-top: -42px;
		right: 16px;
	}
	
	.t_popular_toppane #googleTranslateDiv {
		margin-top: -30px;
	}
	
	.t_torrentsPage_ido #googleTranslateDiv {
		top: 105px;
	}
	
	.searchtext #translateLabel,
	.t_popular_toppane #translateLabel,
	.t_torrentsPage_ido #translateLabel,
	.t_favorite_ido #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel,
	.searchtext #translateLabel,
	.ip #translateLabel,
	.t_popular_toppane #googleTranslateDiv,
	.t_popular_toppane #translateLabel,
	.t_torrentsPage_ido #googleTranslateDiv,
	.t_torrentsPage_ido #translateLabel,
	.t_favorite_ido #googleTranslateDiv,
	.t_favorite_ido #translateLabel {
		cursor: pointer;
	}
	
	.div_ee8413b2_category_checked {
		background-color: darkred !important;
	}
	
	#gd5 #googleTranslateDiv {
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		border-radius: 3px;
		margin-bottom: 15px;
	}
	
	#gd5 #googleTranslateDiv #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#gd5 #googleTranslateDiv,
	#gd5 #googleTranslateDiv #googleTranslateCheckbox,
	#gd5 #googleTranslateDiv #translateLabel {
		cursor: pointer;
	}
	
	#div_ee8413b2_detail_clearBtn,
	#div_ee8413b2_detail_addFavoriteBtn,
	#div_ee8413b2_detail_searchBtn {
		width: 130px;
		height: 25px;
		line-height: 25px;
		font-weight: bold;
		font-size: 13px;
		background-color: #34353b;
		border-radius: 3px;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		margin: 0 auto;
		margin-bottom: 15px;
		display: none;
	}
	
	#dms #googleTranslateDiv:hover,
	.searchtext #googleTranslateDiv:hover,
	.ip #googleTranslateDiv:hover,
	#gd5 #googleTranslateDiv:hover,
	#div_ee8413b2_detail_clearBtn:hover,
	#div_ee8413b2_detail_addFavoriteBtn:hover,
	#div_ee8413b2_detail_searchBtn:hover,
	.t_popular_toppane #googleTranslateDiv:hover,
	.t_torrentsPage_ido #googleTranslateDiv:hover,
	.t_favorite_ido #googleTranslateDiv:hover {
		background-color: rgba(255, 246, 246, 0.1);
	}
	
	#nb {
		font-size: 17px;
		padding-top: 8px;
	}
	
	#nb>div {
		background-image: none;
	}
	
	#nb div a:hover {
		color: gold;
	}
	
	#dms>div>select {
		left: -87px;
		width: 206px;
	}
	
	table.itg>tbody>tr>th {
		text-align: center;
		font-size: 13px;
	}
	
	table td.tc {
		min-width: 30px;
	}
	
	table.itg tr:not(:first-child):hover {
		background-color: #4f535b;
	}
	
	table.itg tr:first-child:hover,
	div.itg .gl1t:hover {
		background-color: #4f535b;
	}
	
	div#gdf a {
		text-decoration: underline;
	}
	
	.glname table td.tc,
	#taglist table td.tc {
		min-width: 50px;
	}
	
	#taglist::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#taglist::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#taglist::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#gmid #gd5 .g2 {
		padding-bottom: 15px;
	}
	
	table .gt,
	table .gtl,
	table .gtw {
		height: 18px;
		line-height: 18px;
	}
	
	.headMenu_check {
		border-top: 2px solid #f1f1f1;
		padding-top: 6px !important;
		margin-top: -8px;
	}
	
	.t_favorite_ido .nosel {
		border-radius: 10px;
		margin-top: 20px !important;
		padding-top: 20px;
		padding-left: 30px;
		height: 65px;
		border: 1px solid #C2C1C1;
		background-color: #34353b;
	}
	
	.t_favorite_ido .nosel .fp:last-child {
		background-color: #34353b;
		top: -87px;
	}
	
	.t_favorite_ido .nosel .fp:last-child:hover,
	.t_favorite_ido .nosel .fps {
		background-color: #43464e !important;
	}
	
	.t_favorite_ido .favorite_null {
		color: #c3bfbf;
	}
	
	.t_favorite_ido .searchDiv {
		width: 855px !important;
		height: 30px;
		margin: 0 auto !important;
		padding: 10px 0 30px 0;
	}
	
	.t_favorite_ido .searchDiv .searchInputDiv {
		float: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv {
		float: right;
		width: 310px !important;
		padding-right: 0 !important;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td {
		width: auto !important;
		height: 30px;
		display: inline-block;
		line-height: 30px;
		text-align: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td label {
		height: 30px;
		line-height: 30px;
	}
	
	.gm #h1Origin_copy {
		font-size: 10pt;
		padding: 0 0 2px;
		margin: 3px 15px;
		color: #b8b8b8;
		border-bottom: 1px solid #000000;
	}
	
	.gm #h1Title_copy {
		font-size: 12pt;
		padding: 0 0 2px;
		margin: 3px 15px;
	}
	
	.torrents_detail_info,
	.torrents_detail_index {
		min-height: 535px;
		height: auto !important;
	}
	
	.t_torrentsPage_ido #torrentform {
		width: 660px;
		margin: 20px auto;
		height: 50px;
	}
	
	.t_torrentsPage_ido #focusme {
		float: left;
	}
	
	.t_torrentsPage_ido #torrentform p {
		float: left;
		margin-top: 5px;
	}
	
	.torrents_detail_info table:nth-child(3) {
		margin-left: 15% !important;
	}
	
	.torrents_detail_info a {
		text-decoration: underline !important;
	}
	
	.torrents_detail_info #etd p {
		height: 214px;
		padding: 0 1px;
		overflow-y: auto;
	}
	
	.torrents_detail_info #etd #googleTranslateDiv {
		background-color: #4f535b;
		display: inline-block;
		margin-left: -1px;
		padding: 0 10px 3px 10px;
		margin-top: 2px;
		cursor: pointer;
	}
	
	.torrents_detail_index form table tr td:nth-child(4),
	.torrents_detail_index form table tr td:nth-child(5) {
		text-align: center;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_select {
		display: inline-block;
	}
	
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(1),
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(3) {
		width: auto;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_action {
		float: right;
		padding-top: 3px;
	}
	
	.t_uconfigPage_outer .span_pixel {
		position: relative;
		top: 2px;
	}
	
	.t_uconfigPage_outer form h2 {
		font-size: 18px;
		margin-top: 30px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper {
		height: calc(100vh - 145px);
		overflow: auto;
		margin: 5px 0;
		padding: 0 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm {
		margin-top: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm input[type="button"],
	.t_frontpage_ido #searchbox .nopm input[type="submit"] {
		width: 70px;
	}
	
	.t_frontpage_ido #advdiv {
		width: 598px;
		margin: auto;
		border: 2px ridge #3c3c3c;
		margin-top: 11px;
	}
	
	.t_frontpage_ido #advdiv,
	.t_frontpage_ido #fsdiv {
		padding: 10px 0;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend {
		border: 1px solid #C2C1C1;
		border-top: 0;
		background-color: #40454B;
		max-height: 500px;
		position: relative;
		z-index: 99;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		cursor: pointer;
		color: #ffde74;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #C2C1C1;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #7b7e85c2;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	.t_detail_comment .comment_span {
		margin-right: 10px;
		float: left;
	}
	
	.t_detail_comment .comment_span,
	.t_detail_comment .comment_span input,
	.t_detail_comment .comment_span label {
		cursor: pointer;
	}
	
	#t_mytags_div {
		width: calc(100% - 2px);
		border: 1px solid white;
		margin-bottom: 10px;
	}
	
	#t_mytags_data_update_tip {
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		position: absolute;
		margin-top: 5px;
		display: none;
		background-color: #34353b;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#t_mytags_div #t_mytags_top {
		height: 49px;
		width: 100%;
	}
	
	#t_mytags_div #t_mytags_bottom {
		height: 0;
		overflow-y: hidden;
	}
	
	#t_mytags_div #t_mytags_bottom #t_favoriteCategories {
		width: 100%;
		height: 100%;
		float: left;
	}
	
	#t_mytags_top #clear_search_btn,
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn {
		border: 1px solid white;
		height: 35px;
		line-height: 35px;
		margin: 5.5px 10px 0 0;
		cursor: pointer;
		text-align: center;
		color: white;
	}
	
	#t_mytags_top #t_mytags_extend_btn {
		float: left;
		margin-left: 10px;
	}
	
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn {
		width: 130px;
	}
	
	#t_mytags_top #clear_search_btn {
		width: 50px;
		float: left;
		margin-left: -11px;
		text-align: center;
		color: white;
	}
	
	#t_mytags_top #t_mytags_clodToFavorite_btn,
	#t_mytags_top #t_mytags_submitCategories_btn {
		float: right;
	}
	
	#t_mytags_top #t_mytags_search {
		border: 1px solid white;
		height: 31px;
		line-height: 31px;
		margin: 5.5px 10px 0 0;
		background-color: transparent;
		color: white;
		padding-left: 5px;
		float: left;
		margin-left: 26px;
		width: calc(100% - 560px);
		min-width: 100px;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_tool {
		height: 25px;
		background-color: #41454c;
	}
	
	#t_mytags_bottom p {
		height: 24px;
		line-height: 24px;
		margin: 0;
		padding: 0;
		font-weight: bold;
		border-top: 1px solid white;
		text-align: center;
		color: white;
	}
	
	#t_mytags_bottom #favoriteCategories_allCheck:indeterminate::after {
		display: block;
		content: "";
		width: 7px;
		height: 3px;
		background-color: #0075FF;
		border-radius: 2px;
		margin-left: 3px;
		margin-top: 5px;
	}
	
	#t_mytags_bottom #mytags_right_all_collapse,
	#t_mytags_bottom #mytags_right_all_expand {
		border-left: 1px solid white;
		border-top: 1px solid white;
		height: 24px;
		line-height: 24px;
		width: 50.5px;
		float: right;
		cursor: pointer;
		text-align: center;
		color: white;
		cursor: pointer;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window {
		height: 325px;
		overflow-y: auto;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#t_mytags_bottom #t_favoriteCategories_window h4 {
		color: #fadfc0;
		font-weight: bold;
		margin: 0;
		margin-top: 10px;
		padding-left: 10px;
	}
	
	#t_mytags_bottom #t_favoriteCategories_window h4 span {
		border: 1px solid #fadfc0;
		width: 12px;
		display: inline-block;
		text-align: center;
		height: 12px;
		line-height: 12px;
		font-weight: 500;
		cursor: pointer;
	}
	
	#t_mytags_bottom #t_favoriteCategories_window h4 span:hover {
		transform: scale(1.2);
	}
	
	#t_mytags_bottom .mytags_item_wrapper {
		border: 1px solid #fadfc0;
		border-radius: 5px;
		margin: 10px 0 0 10px;
		display: inline-block;
		padding: 2px 5px;
		color: #fadfc0;
	}
	
	#t_mytags_bottom .mytags_item_wrapper,
	#t_mytags_bottom .mytags_item_wrapper input[type="checkbox"],
	#t_mytags_bottom .mytags_item_wrapper label {
		cursor: pointer;
	}
	
	#t_mytags_bottom .mytags_item_wrapper label {
		line-height: 20px;
	}
	
	#t_mytags_bottom #t_mytags_favoritecategory_loading_div {
		height: 325px;
		width: 100%;
		line-height: 325px;
		text-align: center;
		font-size: 20px;
	}
	
	
	#t_mytags_top #clear_search_btn,
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn,
	#t_mytags_bottom #mytags_right_all_collapse,
	#t_mytags_bottom #mytags_right_all_expand,
	#t_mytags_bottom p,
	#t_mytags_bottom .mytags_item_wrapper,
	#t_mytags_bottom #t_favoriteCategories_window h4 span {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#t_mytags_top #clear_search_btn:hover,
	#t_mytags_top #t_mytags_extend_btn:hover,
	#t_mytags_top #t_mytags_submitCategories_btn:hover,
	#t_mytags_top #t_mytags_clodToFavorite_btn:hover,
	#t_mytags_bottom #mytags_right_all_collapse:hover,
	#t_mytags_bottom #mytags_right_all_expand:hover,
	#t_mytags_bottom .mytags_item_wrapper:hover {
		background-color: rgba(255, 246, 246, 0.1);
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(1) {
		width: 180px;
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(3) {
		width: 86px;
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(6) {
		padding-left: 50px;
	}
	
	.hide {
		display: none !important;
	}
	
	.t_mytagsPage_outer #upload_tag_form {
		border: 2px solid white;
		background-color: #40454b;
		color: white;
		width: 800px;
		height: 400px;
		position: absolute;
		top: calc(50vh - 200px);
		left: calc(50vw - 400px);
		z-index: 99;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_top {
		height: 30px;
		width: 100%;
		position: absolute;
		top: 0;
		cursor: move;
		text-align: center;
		line-height: 30px;
		font-weight: bold;
		font-size: 16px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 2px solid white;
		border-bottom: 2px solid white;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle {
		height: 320px;
		width: 100%;
		margin-top: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_left,
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_right {
		height: 280px;
		padding: 20px 10px 0 20px;
		width: calc(50% - 30.5px);
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_split {
		width: 0;
		margin-top: 20px;
		height: 280px;
		border-left: 1px solid white;
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom {
		height: 30px;
		width: 100%;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item {
		font-size: 10px;
		height: 40px;
		margin-bottom: 40px;
		margin-top: 25px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item:first-child {
		height: 60px;
	}
	
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label {
		height: 30px;
		line-height: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label {
		width: 88px;
		height: 60px;
		line-height: 60px;
		float: left;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.color_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.weight_label {
		width: 88px;
		height: 40px;
		line-height: 40px;
		float: left;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label {
		height: 60px;
		line-height: 60px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.color_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.weight_label {
		height: 40px;
		line-height: 40px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item input[type="color"],
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item input[type="range"] {
		float: left;
		width: 100px;
		height: 30px;
		margin-top: 5px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #tag_color_val,
	.t_mytagsPage_outer #upload_tag_form #tag_weight_val {
		float: left;
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 80px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #checkboxDiv {
		width: 170px;
		height: 80px;
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #checkboxDiv input {
		position: relative;
		top: 2px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn,
	.t_mytagsPage_outer #upload_tag_form #tag_color_reset_btn,
	.t_mytagsPage_outer #upload_tag_form #weight_reset_btn {
		border: 1px solid white;
		padding: 2px 10px;
		width: 50px;
		text-align: center;
		height: 30px;
		line-height: 30px;
		float: right;
		margin-right: 15px;
		cursor: pointer;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_close:hover,
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn:hover,
	.t_mytagsPage_outer #upload_tag_form #tag_color_reset_btn:hover,
	.t_mytagsPage_outer #upload_tag_form #weight_reset_btn:hover {
		background-color: rgba(255, 246, 246, 0.1);
	}
	
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn {
		margin-top: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom {
		width: 100%;
		height: 30px;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn,
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn {
		width: 100px;
		border: 1px solid black;
		height: 28px;
		line-height: 28px;
		text-align: center;
		float: left;
		font-size: 10px;
		cursor: pointer;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn {
		margin-left: 275px;
		background-color: darkgreen;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn:hover {
		background-color: green;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn {
		margin-left: 50px;
		background-color: darkslateblue;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn:hover {
		background-color: slateblue;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div {
		height: 260px;
		overflow-y: auto;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 {
		margin: 0;
		margin-top: 10px;
		color: #fadfc0;
		font-weight: bold;
		margin-bottom: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 span {
		border: 1px solid #fadfc0;
		cursor: pointer;
		width: 12px;
		display: inline-block;
		text-align: center;
		height: 12px;
		line-height: 12px;
		font-weight: 500;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 span:hover {
		transform: scale(1.2);
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right .checkTags_item {
		display: inline-block;
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
		margin: 0 10px 10px 0;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right .checkTags_item:hover {
		border: 1px solid red;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #checkTags_reset_btn {
		color: #fadfc0;
		border: 1px solid #f5cc9c;
		text-align: center;
		height: 50px;
		line-height: 50px;
		width: 150px;
		margin: 105px auto;
		cursor: pointer;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #checkTags_reset_btn:hover {
		background-color: rgba(255, 246, 246, 0.1);
	}
	
	.t_mytagsPage_outer #upload_tag_ing {
		border: 2px solid white;
		background-color: #40454b;
		color: white;
		padding: 0 20px;
		width: 300px;
		height: 300px;
		position: absolute;
		top: calc(50vh - 150px);
		left: calc(50vw - 150px);
		z-index: 99;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing:hover {
		border-color: yellow;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_top {
		height: 60px;
		line-height: 60px;
		width: calc(100% - 40px);
		position: absolute;
		top: 0;
		cursor: move;
		text-align: center;
		font-weight: bold;
		font-size: 18px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_1 {
		margin-top: 80px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_1,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_2,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_error {
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_error {
		margin-bottom: -20px;
		display: none;
		color: red;
		font-size: 17px;
		font-weight: bold;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #tip_pause {
		color: yellow;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #tip_continue {
		color: lightgreen;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_remainder,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_success {
		margin-top: 20px;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_success {
		font-size: 20px;
		font-weight: bold;
		color: lightgreen;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_remainder #upload_remainder_count {
		font-size: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn,
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn {
		border: 1px solid black;
		width: 100px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		cursor: pointer;
		margin: 30px auto;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn {
		background-color: darkred;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn:hover {
		background-color: red;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn {
		background-color: darkslateblue;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn:hover {
		background-color: slateblue;
	}
	
	.t_mytagsPage_outer #usertags_outer>div:hover {
		background-color: rgba(255, 246, 246, 0.1);
	}
	
	.t_mytagsPage_outer #usertags_outer>div>div:nth-child(6)>input {
		margin-left: 6px
	}
	
	.t_mytagsPage_outer .tagcolor,
	#tagcolor {
		width: 99px;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer {
		width: 850px;
		overflow-y: auto;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #usertag_form #usertags_outer::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}`;
    styleInject(category_style);
});

//#endregion

//#region step1.2.translateTopBottomMenu.js 头部菜单、底部菜单翻译

function topMenuTranslateZh() {
    var nb = document.getElementById("nb");
    if (nb) {
        var menus = nb.querySelectorAll("a");
        var pathname = window.location.pathname;
        var isFoundCheck = false;
        for (const i in menus) {
            if (Object.hasOwnProperty.call(menus, i)) {
                const a = menus[i];
                if ((!isFoundCheck) &&
                    (
                        (pathname == '/' && a.innerText == 'Front Page') ||
                        (pathname == '/watched' && a.innerText == 'Watched') ||
                        (pathname == '/popular' && a.innerText == 'Popular') ||
                        (pathname == '/torrents.php' && a.innerText == 'Torrents') ||
                        (pathname == '/favorites.php' && a.innerText == 'Favorites') ||
                        (pathname == '/home.php' && a.innerText == 'My Home') ||
                        (pathname == '/toplist.php' && a.innerText == 'Toplists') ||
                        (pathname == '/bounty.php' && a.innerText == 'Bounties') ||
                        (pathname == '/news.php' && a.innerText == 'News') ||
                        (pathname == '/uconfig.php' && a.innerText == 'Settings') ||
                        (pathname == '/upld/manage' && a.innerText == 'My Uploads') ||
                        (pathname == '/mytags' && a.innerText == 'My Tags')
                    )) {
                    a.parentNode.classList.add('headMenu_check');
                    isFoundCheck = true;
                }

                a.innerText = fontMenusData[a.innerText] ?? a.innerText;
            }
        }
    }
}

// 头部二级菜单翻译
function topSubMenuTranslateZh() {
    var lb = document.getElementById("lb");
    if (lb) {
        var alinks = lb.querySelectorAll("a");
        for (const i in alinks) {
            if (Object.hasOwnProperty.call(alinks, i)) {
                const link = alinks[i];
                if (myMainPageSubPageDict[link.innerText]) {
                    link.innerText = myMainPageSubPageDict[link.innerText];
                }
            }
        }
    }
}

function bottomMenuTranslateZh() {
    var dp = document.getElementsByClassName("dp");
    if (dp.length > 0) {
        var alinks = dp[0].children;
        for (const i in alinks) {
            if (Object.hasOwnProperty.call(alinks, i)) {
                const alink = alinks[i];
                if (bottomMenusData[alink.innerText]) {
                    alink.innerText = bottomMenusData[alink.innerText];
                }
            }
        }
    }
}

//#endregion

//#region step1.3.newPaging 新版本分页功能翻译

function TranslateNewPagingLinks() {
    var ufirst = document.getElementById("ufirst");
    if (ufirst) {
        ufirst.innerText = "最新";
    }
    var dfirst = document.getElementById("dfirst");
    if (dfirst) {
        dfirst.innerText = "最新";
    }

    var uprev = document.getElementById("uprev");
    if (uprev) {
        uprev.innerText = "← 新页";
    }
    var dprev = document.getElementById("dprev");
    if (dprev) {
        dprev.innerText = "← 新页";
    }

    var unext = document.getElementById("unext");
    if (unext) {
        unext.innerText = "旧页 →"
    }
    var dnext = document.getElementById("dnext");
    if (dnext) {
        dnext.innerText = "旧页 →"
    }

    var ulast = document.getElementById("ulast");
    if (ulast) {
        ulast.innerText = "最旧";
    }
    var dlast = document.getElementById("dlast");
    if (dlast) {
        dlast.innerText = "最旧";
    }


    var ujump = document.getElementById("ujump");
    if (ujump) {
        ujump.innerText = "跳转/搜索";
    }
    var djump = document.getElementById("djump");
    if (djump) {
        djump.innerText = "跳转/搜索";
    }


    // ujump.addEventListener("click",function(){
    //     copy_enable_jump_mode('u');
    // });

    // function copy_enable_jump_mode(a) {
    //     document.getElementById(a + "jumpbox").innerHTML = '<input type="text" name="jump" id="' + a + 'jump" size="10" maxlength="10" placeholder="日期或范围" title="输入年份例如后面括号内容可以省略 2022，或者年月(20)22-11，或者年月日(20)22-11-11， 来查询。\n另外一种方式是向前/后跳转指定的周数，月数，年数,1周填写1w，2个月填写2m，3年填写3y，然后点击旁边的连接进行查询" onchange="copy_update_jump_mode(\'' + a + "')\" onkeyup=\"copy_update_jump_mode('" + a + "')\" />";
    //     document.getElementById(a + "jump").focus()
    // }

}

function copy_update_jump_mode(e) {
    var d = document.getElementById(e + "jump").value;
    var c = document.getElementById(e + "prev");
    var b = document.getElementById(e + "next");
    var a = false;
    if (d != undefined && d != "") {
        if (matchseek.test(d) || (matchyear.test(d) && parseInt(d) > 2006 && parseInt(d) < 2100)) {
            c.innerHTML = "← 搜索";
            b.innerHTML = "搜索 →";
            c.href = prevurl + "&seek=" + d;
            b.href = nexturl + "&seek=" + d;
            a = true
        } else {
            if (matchjump.test(d)) {
                c.innerHTML = "← 跳转";
                b.innerHTML = "跳转 →";
                c.href = prevurl + "&jump=" + d;
                b.href = nexturl + "&jump=" + d;
                a = true
            }
        }
    }
    if (!a) {
        c.innerHTML = "← 新页";
        b.innerHTML = "旧页 →";
        c.href = prevurl;
        b.href = nexturl
    }
}



//#endregion

//#region step2.getTagDatas.js 获取标签数据

//#region 恋物数据和ehTag数据
function getFetishListGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/SunBrook/ehWiki.fetishListing.translate.zh_CN/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getEhTagGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/EhTagTranslation/DatabaseReleases/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getFetishListTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/SunBrook/ehWiki.fetishListing.translate.zh_CN@${version}/fetish.oneLevel.withoutLang.searchKey.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

function getEhTagTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/EhTagTranslation/DatabaseReleases@${version}/db.text.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}
//#endregion


//#region indexdb 模块

var request = window.indexedDB.open("EXH_DYZYFTS", 1);
var db;

function indexDbInit(func_start_use) {
    if (request.readyState == "done") {
        db = request.result;
        func_start_use();
    } else {
        request.onsuccess = function () {
            db = request.result;
            func_start_use();
        }
    }
}

request.onerror = function (event) {
}

request.onupgradeneeded = function (event) {
    db = event.target.result;

    // 对象仓库 Settings
    //
    // EhTag子菜单

    // 设置表
    // 包含：FetishList版本号、父子数据、父标签、页面Html
    // 包含：EhTag版本号、总数据、父标签、页面Html
    if (!db.objectStoreNames.contains(table_Settings)) {
        var objectStore = db.createObjectStore(table_Settings, { keyPath: 'item' });
    }

    // FetishList 父子标签表
    if (!db.objectStoreNames.contains(table_fetishListSubItems)) {
        var objectStore = db.createObjectStore(table_fetishListSubItems, { keyPath: table_fetishListSubItems_key });
        objectStore.createIndex(table_fetishListSubItems_index_subEn, table_fetishListSubItems_index_subEn, { unique: false });
        objectStore.createIndex(table_fetishListSubItems_index_searchKey, table_fetishListSubItems_index_searchKey, { unique: true });
    }

    // EhTag 父子标签表
    if (!db.objectStoreNames.contains(table_EhTagSubItems)) {
        var objectStore = db.createObjectStore(table_EhTagSubItems, { keyPath: table_EhTagSubItems_key });
        objectStore.createIndex(table_EhTagSubItems_index_subEn, table_EhTagSubItems_index_subEn, { unique: false });
        objectStore.createIndex(table_EhTagSubItems_index_searchKey, table_EhTagSubItems_index_searchKey, { unique: true });
    }

    // FavoriteList 本地收藏表
    if (!db.objectStoreNames.contains(table_favoriteSubItems)) {
        var objectStore = db.createObjectStore(table_favoriteSubItems, { keyPath: table_favoriteSubItems_key });
        objectStore.createIndex(table_favoriteSubItems_index_parentEn, table_favoriteSubItems_index_parentEn, { unique: false });
    }

    // DetailParentItems 详情页父级表
    if (!db.objectStoreNames.contains(table_detailParentItems)) {
        var objectStore = db.createObjectStore(table_detailParentItems, { keyPath: table_detailParentItems_key });
    }
}

function read(tableName, key, func_success, func_error) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(key);

    request.onerror = function (event) {
        func_error();
    }

    request.onsuccess = function (event) {
        func_success(request.result);
    }
}

function readAll(tableName, func_success, func_end) {
    var objectStore = db.transaction(tableName).objectStore(tableName);
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            func_success(cursor.key, cursor.value);
            cursor.continue();
        } else {
            func_end();
        }
    }
}

function readByIndex(tableName, indexName, indexValue, func_success, func_none) {
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var request = index.get(indexValue);
    request.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
            func_success(result);
        } else {
            func_none();
        }
    }
}

// 按照索引的值查询：等于
function readByCursorIndex(tableName, indexName, indexValue, func_success) {
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var c = index.openCursor(IDBKeyRange.only(indexValue));
    var data = [];
    c.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        }
        else {
            func_success(data);
        }
    }
}

// 按照索引的值查询：模糊搜索
function readByCursorIndexFuzzy(tableName, indexName, indexValue, func_success) {
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var c = index.openCursor();
    var data = [];
    c.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value[indexName].indexOf(indexValue) != -1) {
                data.push(cursor.value);
            }
            cursor.continue();
        }
        else {
            func_success(data);
        }
    }
}



function add(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(data);

    request.onsuccess = function (event) {
        func_success(event);
    }

    request.onerror = function (event) {
        func_error(event);
    }
}

function batchAdd(tableName, keyName, dataList, count, func_compelete) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName);

    var index = 0;
    for (const key in dataList) {
        if (Object.hasOwnProperty.call(dataList, key)) {
            const item = dataList[key];
            item[keyName] = key;
            request.add(item);
            index++;
        }
    }

    var t = setInterval(() => {
        if (count == index) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 10);
}

function update(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .put(data);

    request.onsuccess = function (event) {
        func_success();
    }

    request.onerror = function (event) {
        func_error(event);
    }
}

function remove(tableName, key, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .delete(key);
    request.onsuccess = function (event) {
        func_success();
    }
    request.onerror = function (event) {
        func_error(event);
    }
}

function checkTableEmpty(tableName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.count();

    request.onsuccess = function (event) {
        if (request.result == 0) {
            // 数量为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function checkFieldEmpty(tableName, filedName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(filedName);

    request.onsuccess = function (event) {
        if (!request.result) {
            // 数据为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function clearTable(tableName, func_clear) {
    var transaction = db.transaction([tableName], 'readwrite');
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.clear();
    request.onsuccess = function (event) {
        func_clear();
    }
}
//#endregion

function fetishListDataInit(update_func, local_func) {
    // fetishList 获取本地版本号
    read(table_Settings, table_Settings_key_FetishListVersion, localVersion => {
        getFetishListGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getFetishListTranslate(version, json => {
                    update_func(json, version);
                });
            } else {
                local_func();
            }
        });
    }, error => {
    })
}

function ehTagDataInit(update_func, local_func) {
    // Ehtag 获取本地版本号
    read(table_Settings, table_Settings_key_EhTagVersion, localVersion => {
        getEhTagGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getEhTagTranslate(version, json => {
                    update_func(json.data, version);
                });
            } else {
                local_func();
            }
        });

    }, error => {
    });
}

// 验证数据完整性
function checkDataIntact(func_compelete) {
    // 如果数据表数据为空，则清空存储数据

    var complete1 = false;
    var complete2 = false;
    var complete3 = false;
    var complete4 = false;
    var complete5 = false;

    checkTableEmpty(table_fetishListSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete1 = true; }, () => { complete1 = true; });
    }, () => {
        // 存在数据
        complete1 = true;
    });
    checkTableEmpty(table_EhTagSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete2 = true; }, () => { complete2 = true; });
    }, () => {
        // 存在数据
        complete2 = true;
    });

    checkFieldEmpty(table_Settings, table_Settings_key_FetishList_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete3 = true; }, () => { complete3 = true; });
    }, () => {
        // 存在数据
        complete3 = true;
    });
    checkFieldEmpty(table_Settings, table_Settings_key_EhTag_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete4 = true; }, () => { complete4 = true; });
    }, () => {
        // 存在数据
        complete4 = true;
    });

    checkTableEmpty(table_detailParentItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete5 = true; }, () => { complete5 = true; });
    }, () => {
        // 存在数据
        complete5 = true;
    });

    var t = setInterval(() => {
        if (complete1 && complete2 && complete3 && complete4 && complete5) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 60);
}

// 比较更新词库数据
function checkUpdateData(func_needUpdate, func_none) {
    indexDbInit(() => {
        var complete1 = false;
        var complete2 = false;
        var complete3 = false;
        var complete4 = false;
        var complete5 = false;
        var complete6 = false;
        var complete7 = false;
        var complete8 = false;
        var complete9 = false;
        var complete10 = false;
        var complete11 = false;

        var isFetishUpdate = false;
        var isEhTagUpdate = false;

        var updateDataTip = document.getElementById("data_update_tip");

        // 获取并更新恋物的父子项、父级信息，详情页父级信息
        fetishListDataInit((newData, newVersion) => {

            // 显示更新提示
            updateDataTip.style.display = "block";

            // 存在更新
            isFetishUpdate = true;

            // 直接清空存储库，然后批量添加，这样速度最快
            clearTable(table_fetishListSubItems, () => {
                complete1 = true;
                batchAdd(table_fetishListSubItems, table_fetishListSubItems_key, newData.data, newData.count, () => {
                    complete2 = true;
                });
            });

            // 更新父级信息
            var settings_fetishList_parentEnArray = {
                item: table_Settings_key_FetishList_ParentEnArray,
                value: newData.parent_en_array
            };
            update(table_Settings, settings_fetishList_parentEnArray, () => { complete3 = true; }, () => { complete3 = true; });

            // 生成页面 html，并保存
            var categoryFetishListHtml = ``;
            var lastParentEn = '';
            for (const i in newData.data) {
                if (Object.hasOwnProperty.call(newData.data, i)) {
                    const item = newData.data[i];
                    if (item.parent_en != lastParentEn) {
                        if (lastParentEn != '') {
                            categoryFetishListHtml += `</div>`;
                        }
                        lastParentEn = item.parent_en;
                        // 新建父级
                        categoryFetishListHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend category_extend_fetish">-</span></h4>`;
                        categoryFetishListHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                    }

                    // 添加子级
                    categoryFetishListHtml += `<span class="c_item c_item_fetish" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}">${item.sub_zh}</span>`;
                }
            }
            if (categoryFetishListHtml != ``) {
                categoryFetishListHtml += `</div>`;
            }

            // 存储恋物列表Html
            var settings_fetish_html = {
                item: table_Settings_key_FetishList_Html,
                value: categoryFetishListHtml
            };
            update(table_Settings, settings_fetish_html, () => { complete4 = true; }, () => { complete4 = true; });

            // 更新版本号
            var settings_fetishList_version = {
                item: table_Settings_key_FetishListVersion,
                value: newVersion
            };
            update(table_Settings, settings_fetishList_version, () => { complete5 = true; }, () => { complete5 = true; });

        }, () => {
            complete1 = true;
            complete2 = true;
            complete3 = true;
            complete4 = true;
            complete5 = true;
        });

        // 如果 EhTag 版本更新，这尝试更新用户收藏（可能没有翻译过的标签进行翻译）
        // 获取并更新EhTag的父子项、父级信息
        ehTagDataInit((newData, newVersion) => {
            // 更新本地数据库 indexDB
            // 存储完成之后，更新版本号

            // 显示更新提示
            updateDataTip.style.display = "block";

            // 存在更新
            isEhTagUpdate = true;

            var psDict = {}; // 过滤适合的全部数据
            var psDictCount = 0;
            var parentEnArray = [];

            var detailDict = {};
            var detailDictCount = 0;

            for (const index in newData) {
                if (Object.hasOwnProperty.call(newData, index)) {
                    // var example = { ps_en: "male:bo", search_key: "male,男性,bo,波", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

                    const element = newData[index];
                    var parent_en = element.namespace;
                    if (parent_en == "rows") {
                        // 详情页父级信息
                        var parentItems = element.data;
                        for (const key in parentItems) {
                            if (Object.hasOwnProperty.call(parentItems, key)) {
                                const parentItem = parentItems[key];
                                detailDict[key] = { row: key, name: parentItem.name, desc: parentItem.intro };
                                detailDictCount++;
                            }
                        }
                        continue;
                    }

                    // 过滤重新分类
                    if (parent_en == "reclass") continue;

                    // 普通 EhTag 数据
                    parentEnArray.push(parent_en);
                    var parent_zh = element.frontMatters.name;

                    var subItems = element.data;
                    for (const sub_en in subItems) {
                        if (Object.hasOwnProperty.call(subItems, sub_en)) {
                            const subItem = subItems[sub_en];
                            var sub_zh = subItem.name;
                            var sub_desc = subItem.intro;
                            var search_key = `${parent_en},${parent_zh},${sub_en},${sub_zh}`;
                            var ps_en = `${parent_en}:${sub_en}`;
                            psDict[ps_en] = { search_key, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                            psDictCount++;
                        }
                    }
                }
            }

            // 直接清空存储库，然后批量添加，这样速度最快
            clearTable(table_EhTagSubItems, () => {
                complete6 = true;
                batchAdd(table_EhTagSubItems, table_EhTagSubItems_key, psDict, psDictCount, () => {
                    complete7 = true;
                    updateMyTagAllTagHtml(() => {
                        setDbSyncMessage(sync_mytagsAllTagUpdate);
                    }, () => { });
                });
            });

            // 批量添加详情页父级信息
            batchAdd(table_detailParentItems, table_detailParentItems_key, detailDict, detailDictCount, () => {
                complete8 = true;
            });

            var settings_ehTag_parentEnArray = {
                item: table_Settings_key_EhTag_ParentEnArray,
                value: parentEnArray
            };

            // 更新父级信息
            update(table_Settings, settings_ehTag_parentEnArray, () => { complete9 = true; }, () => { complete9 = true; });

            // 生成页面 html
            var categoryEhTagHtml = ``;
            var lastParentEn = '';
            for (const i in psDict) {
                if (Object.hasOwnProperty.call(psDict, i)) {
                    const item = psDict[i];
                    if (item.parent_en != lastParentEn) {
                        if (lastParentEn != '') {
                            categoryEhTagHtml += `</div>`;
                        }
                        lastParentEn = item.parent_en;
                        // 新建父级
                        categoryEhTagHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend category_extend_ehTag">-</span></h4>`;
                        categoryEhTagHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                    }

                    // 添加子级
                    categoryEhTagHtml += `<span class="c_item c_item_ehTag" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}">${item.sub_zh}</span>`;
                }
            }
            if (categoryEhTagHtml != ``) {
                categoryEhTagHtml += `</div>`;
            }

            // 存储页面 html
            var settings_ehTag_html = {
                item: table_Settings_key_EhTag_Html,
                value: categoryEhTagHtml
            };
            update(table_Settings, settings_ehTag_html, () => { complete10 = true; }, () => { complete10 = true; });

            // 更新版本号
            var settings_ehTag_version = {
                item: table_Settings_key_EhTagVersion,
                value: newVersion
            };
            update(table_Settings, settings_ehTag_version, () => { complete11 = true; }, () => { complete11 = true; });

        }, () => {
            complete6 = true;
            complete7 = true;
            complete8 = true;
            complete9 = true;
            complete10 = true;
            complete11 = true;
        });

        // 用户收藏更新
        function updateFavoriteList(func_end) {
            var favoriteUpdateDict = {};
            var favoriteUpdateCount = 0;
            var indexCount = 0;

            var isNewUpdate = false; // 是否存在更新的收藏数据
            readAll(table_favoriteSubItems, (k, v) => {
                if (v.sub_en == v.sub_zh) {
                    favoriteUpdateDict[k] = v;
                    favoriteUpdateCount++;
                }
            }, () => {
                if (favoriteUpdateCount > 0) {
                    for (const ps_en in favoriteUpdateDict) {
                        if (Object.hasOwnProperty.call(favoriteUpdateDict, ps_en)) {
                            const item = favoriteUpdateDict[ps_en];
                            read(table_EhTagSubItems, ps_en, result => {
                                if (result) {
                                    if (result.sub_zh != item.sub_zh) {
                                        // 需要更新
                                        isNewUpdate = true;
                                        var updateFavorite = {
                                            parent_en: result.parent_en,
                                            parent_zh: result.parent_zh,
                                            ps_en: result.ps_en,
                                            sub_en: result.sub_en,
                                            sub_zh: result.sub_zh,
                                            sub_desc: result.sub_desc
                                        };
                                        update(table_favoriteSubItems, updateFavorite, () => { indexCount++; }, () => { indexCount++; });
                                    } else {
                                        indexCount++;
                                    }
                                } else {
                                    indexCount++;
                                }
                            }, () => { indexCount++; });
                        }
                    }

                    function getFavoriteListHtml(favoriteSubItems) {
                        var favoritesListHtml = ``;
                        var lastParentEn = ``;
                        for (const ps_en in favoriteSubItems) {
                            if (Object.hasOwnProperty.call(favoriteSubItems, ps_en)) {
                                var item = favoriteSubItems[ps_en];
                                if (item.parent_en != lastParentEn) {
                                    if (lastParentEn != '') {
                                        favoritesListHtml += `</div>`;
                                    }
                                    lastParentEn = item.parent_en;
                                    // 新建父级
                                    favoritesListHtml += `<h4 id="favorite_h4_${item.parent_en}">${item.parent_zh}<span data-category="${item.parent_en}"
                                            class="favorite_extend">-</span></h4>`;
                                    favoritesListHtml += `<div id="favorite_div_${item.parent_en}" class="favorite_items_div">`;
                                }

                                // 添加子级
                                favoritesListHtml += `<span class="c_item c_item_favorite" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}" data-item="${item.sub_en}"
                                                data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}">${item.sub_zh}</span>`;
                            }
                        }

                        if (favoritesListHtml != ``) {
                            favoritesListHtml += `</div>`;
                        }

                        return favoritesListHtml;
                    }

                    function saveFavoriteListHtml(favoritesListHtml, func_compelete) {
                        var settings_favoriteList_html = {
                            item: table_Settings_key_FavoriteList_Html,
                            value: favoritesListHtml
                        };

                        update(table_Settings, settings_favoriteList_html, () => { func_compelete(); }, () => { });
                    }

                    var t1 = setInterval(() => {
                        if (favoriteUpdateCount == indexCount) {
                            t1 && clearInterval(t1);
                            if (isNewUpdate) {
                                // 收藏存在更新，需要更新收藏html，并通知其他页面更新
                                var favoriteDict = {};
                                readAll(table_favoriteSubItems, (k, v) => {
                                    favoriteDict[k] = v;
                                }, () => {
                                    var favoritesListHtml = getFavoriteListHtml(favoriteDict);
                                    saveFavoriteListHtml(favoritesListHtml, () => {
                                        // 通知页面更新
                                        setDbSyncMessage(sync_favoriteList);
                                        func_end();
                                    });
                                });
                            } else {
                                func_end();
                            }
                        }
                    }, 50);
                } else {
                    func_end();
                }
            });
        }

        var t = setInterval(() => {
            if (isFetishUpdate || isEhTagUpdate) {
                var step = 0;
                if (complete1) step += 10;
                if (complete2) step += 10;
                if (complete3) step += 10;
                if (complete4) step += 10;
                if (complete5) step += 5;
                if (complete6) step += 10;
                if (complete7) step += 10;
                if (complete8) step += 10;
                if (complete9) step += 10;
                if (complete10) step += 10;
                if (complete11) step += 5;
                updateDataTip.innerText = `词库升级中 ${step}%`;
            }

            if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6 && complete7 && complete8 && complete9 && complete10 && complete11) {
                t && clearInterval(t);
                if (isFetishUpdate || isEhTagUpdate) {
                    // 通知本地列表更新
                    setDbSyncMessage(sync_categoryList);

                    // 隐藏更新提示
                    updateDataTip.innerText = `词库升级完成`;
                    setTimeout(() => {
                        updateDataTip.style.display = "none";
                        updateDataTip.innerText = "词库升级中...";
                    }, 500);

                    // 看看是否需要更新用户收藏表数据
                    if (isEhTagUpdate) {
                        updateFavoriteList(() => { func_needUpdate(); });
                    } else {
                        func_needUpdate();
                    }

                } else {
                    func_none();
                }
            }
        }, 50);
    })

}

// 比较更新词库 - 仅 ehtag
function checkUdpateEhtagData(func_needUpdate, func_none) {
    var complete6 = false;
    var complete7 = false;
    var complete8 = false;
    var complete9 = false;
    var complete10 = false;
    var complete11 = false;

    var isEhTagUpdate = false;

    var updateDataTip = document.getElementById("t_mytags_data_update_tip");
    ehTagDataInit((newData, newVersion) => {
        // 更新本地数据库 indexDB
        // 存储完成之后，更新版本号

        // 显示更新提示
        updateDataTip.style.display = "block";

        // 存在更新
        isEhTagUpdate = true;

        var psDict = {}; // 过滤适合的全部数据
        var psDictCount = 0;
        var parentEnArray = [];

        var detailDict = {};
        var detailDictCount = 0;

        for (const index in newData) {
            if (Object.hasOwnProperty.call(newData, index)) {
                // var example = { ps_en: "male:bo", search_key: "male,男性,bo,波", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

                const element = newData[index];
                var parent_en = element.namespace;
                if (parent_en == "rows") {
                    // 详情页父级信息
                    var parentItems = element.data;
                    for (const key in parentItems) {
                        if (Object.hasOwnProperty.call(parentItems, key)) {
                            const parentItem = parentItems[key];
                            detailDict[key] = { row: key, name: parentItem.name, desc: parentItem.intro };
                            detailDictCount++;
                        }
                    }
                    continue;
                }

                // 过滤重新分类
                if (parent_en == "reclass") continue;

                // 普通 EhTag 数据
                parentEnArray.push(parent_en);
                var parent_zh = element.frontMatters.name;

                var subItems = element.data;
                for (const sub_en in subItems) {
                    if (Object.hasOwnProperty.call(subItems, sub_en)) {
                        const subItem = subItems[sub_en];
                        var sub_zh = subItem.name;
                        var sub_desc = subItem.intro;
                        var search_key = `${parent_en},${parent_zh},${sub_en},${sub_zh}`;
                        var ps_en = `${parent_en}:${sub_en}`;
                        psDict[ps_en] = { search_key, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                        psDictCount++;
                    }
                }
            }
        }

        // 直接清空存储库，然后批量添加，这样速度最快
        clearTable(table_EhTagSubItems, () => {
            complete6 = true;
            batchAdd(table_EhTagSubItems, table_EhTagSubItems_key, psDict, psDictCount, () => {
                complete7 = true;
            });
        });

        // 批量添加详情页父级信息
        batchAdd(table_detailParentItems, table_detailParentItems_key, detailDict, detailDictCount, () => {
            complete8 = true;
        });

        var settings_ehTag_parentEnArray = {
            item: table_Settings_key_EhTag_ParentEnArray,
            value: parentEnArray
        };

        // 更新父级信息
        update(table_Settings, settings_ehTag_parentEnArray, () => { complete9 = true; }, () => { complete9 = true; });

        // 生成页面 html
        var categoryEhTagHtml = ``;
        var lastParentEn = '';
        for (const i in psDict) {
            if (Object.hasOwnProperty.call(psDict, i)) {
                const item = psDict[i];
                if (item.parent_en != lastParentEn) {
                    if (lastParentEn != '') {
                        categoryEhTagHtml += `</div>`;
                    }
                    lastParentEn = item.parent_en;
                    // 新建父级
                    categoryEhTagHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend category_extend_ehTag">-</span></h4>`;
                    categoryEhTagHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                }

                // 添加子级
                categoryEhTagHtml += `<span class="c_item c_item_ehTag" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}">${item.sub_zh}</span>`;
            }
        }
        if (categoryEhTagHtml != ``) {
            categoryEhTagHtml += `</div>`;
        }

        // 存储页面 html
        var settings_ehTag_html = {
            item: table_Settings_key_EhTag_Html,
            value: categoryEhTagHtml
        };
        update(table_Settings, settings_ehTag_html, () => { complete10 = true; }, () => { complete10 = true; });

        // 更新版本号
        var settings_ehTag_version = {
            item: table_Settings_key_EhTagVersion,
            value: newVersion
        };
        update(table_Settings, settings_ehTag_version, () => { complete11 = true; }, () => { complete11 = true; });

    }, () => {
        complete6 = true;
        complete7 = true;
        complete8 = true;
        complete9 = true;
        complete10 = true;
        complete11 = true;
    });

    // 用户收藏更新
    function updateFavoriteList(func_end) {
        var favoriteUpdateDict = {};
        var favoriteUpdateCount = 0;
        var indexCount = 0;

        var isNewUpdate = false; // 是否存在更新的收藏数据
        readAll(table_favoriteSubItems, (k, v) => {
            if (v.sub_en == v.sub_zh) {
                favoriteUpdateDict[k] = v;
                favoriteUpdateCount++;
            }
        }, () => {
            if (favoriteUpdateCount > 0) {
                for (const ps_en in favoriteUpdateDict) {
                    if (Object.hasOwnProperty.call(favoriteUpdateDict, ps_en)) {
                        const item = favoriteUpdateDict[ps_en];
                        read(table_EhTagSubItems, ps_en, result => {
                            if (result) {
                                if (result.sub_zh != item.sub_zh) {
                                    // 需要更新
                                    isNewUpdate = true;
                                    var updateFavorite = {
                                        parent_en: result.parent_en,
                                        parent_zh: result.parent_zh,
                                        ps_en: result.ps_en,
                                        sub_en: result.sub_en,
                                        sub_zh: result.sub_zh,
                                        sub_desc: result.sub_desc
                                    };
                                    update(table_favoriteSubItems, updateFavorite, () => { indexCount++; }, () => { indexCount++; });
                                } else {
                                    indexCount++;
                                }
                            } else {
                                indexCount++;
                            }
                        }, () => { indexCount++; });
                    }
                }

                function getFavoriteListHtml(favoriteSubItems) {
                    var favoritesListHtml = ``;
                    var lastParentEn = ``;
                    for (const ps_en in favoriteSubItems) {
                        if (Object.hasOwnProperty.call(favoriteSubItems, ps_en)) {
                            var item = favoriteSubItems[ps_en];
                            if (item.parent_en != lastParentEn) {
                                if (lastParentEn != '') {
                                    favoritesListHtml += `</div>`;
                                }
                                lastParentEn = item.parent_en;
                                // 新建父级
                                favoritesListHtml += `<h4 id="favorite_h4_${item.parent_en}">${item.parent_zh}<span data-category="${item.parent_en}"
                                        class="favorite_extend">-</span></h4>`;
                                favoritesListHtml += `<div id="favorite_div_${item.parent_en}" class="favorite_items_div">`;
                            }

                            // 添加子级
                            favoritesListHtml += `<span class="c_item c_item_favorite" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}" data-item="${item.sub_en}"
                                            data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}">${item.sub_zh}</span>`;
                        }
                    }

                    if (favoritesListHtml != ``) {
                        favoritesListHtml += `</div>`;
                    }

                    return favoritesListHtml;
                }

                function saveFavoriteListHtml(favoritesListHtml, func_compelete) {
                    var settings_favoriteList_html = {
                        item: table_Settings_key_FavoriteList_Html,
                        value: favoritesListHtml
                    };

                    update(table_Settings, settings_favoriteList_html, () => { func_compelete(); }, () => { });
                }

                var t1 = setInterval(() => {
                    if (favoriteUpdateCount == indexCount) {
                        t1 && clearInterval(t1);
                        if (isNewUpdate) {
                            // 收藏存在更新，需要更新收藏html，并通知其他页面更新
                            var favoriteDict = {};
                            readAll(table_favoriteSubItems, (k, v) => {
                                favoriteDict[k] = v;
                            }, () => {
                                var favoritesListHtml = getFavoriteListHtml(favoriteDict);
                                saveFavoriteListHtml(favoritesListHtml, () => {
                                    // 通知页面更新
                                    setDbSyncMessage(sync_favoriteList);
                                    func_end();
                                });
                            });
                        } else {
                            func_end();
                        }
                    }
                }, 50);
            } else {
                func_end();
            }
        });
    }

    var t = setInterval(() => {
        if (isEhTagUpdate) {
            var step = 0;
            if (complete6) step += 20;
            if (complete7) step += 20;
            if (complete8) step += 20;
            if (complete9) step += 20;
            if (complete10) step += 10;
            if (complete11) step += 10;
            updateDataTip.innerText = `词库升级中 ${step}%`;
        }

        if (complete6 && complete7 && complete8 && complete9 && complete10 && complete11) {
            t && clearInterval(t);
            if (isEhTagUpdate) {
                // 通知本地列表更新
                setDbSyncMessage(sync_categoryList);

                // 隐藏更新提示
                updateDataTip.innerText = `词库升级完成`;
                setTimeout(() => {
                    updateDataTip.style.display = "none";
                    updateDataTip.innerText = "词库升级中...";
                }, 500);

                // 看看是否需要更新用户收藏表数据
                if (isEhTagUpdate) {
                    updateFavoriteList(() => { func_needUpdate(); });
                } else {
                    func_needUpdate();
                }

            } else {
                func_none();
            }
        }
    }, 50);
}

// 准备用户存储的关键信息，此为过渡功能，将localstroage 上的存储的配置数据存储到 indexedDB 中，然后清空 localstroage
function initUserSettings(func_compelete) {
    // 删除恋物版本号、类别html、收藏折叠数据
    removeVersion();
    removeCategoryListHtml();
    removeFavoriteListExpend();

    indexDbInit(() => {
        var complete1 = false;
        var complete2 = false;
        var complete3 = false;
        var complete4 = false;
        var complete5 = false;
        var complete6 = false;
        var complete7 = false;
        var complete8 = false;

        // 本地折叠按钮
        var categoryListExpendArray = getCategoryListExpend();
        if (categoryListExpendArray != null) {
            var settings_categoryListExpendArray = {
                item: table_Settings_key_CategoryList_Extend,
                value: categoryListExpendArray
            };
            update(table_Settings, settings_categoryListExpendArray, () => {
                removeCategoryListExpend();
                complete1 = true;
            }, () => { complete1 = true; });
        } else {
            complete1 = true;
        }


        // 头部搜索菜单显示隐藏开关，这个不需要删除
        var oldSearchDivVisible = getOldSearchDivVisible();
        if (oldSearchDivVisible != null) {
            read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
                var visibleBoolean = oldSearchDivVisible == 1;
                if (result && result.value == visibleBoolean) {
                    complete2 = true;
                } else {
                    // 更新
                    var settings_oldSearchDivVisible = {
                        item: table_Settings_key_OldSearchDiv_Visible,
                        value: visibleBoolean
                    };
                    update(table_Settings, settings_oldSearchDivVisible, () => {
                        complete2 = true;
                    }, () => { complete2 = true; });
                }
            }, () => { complete2 = true; });
        } else {
            complete2 = true;
        }

        // 标签谷歌机翻_首页开关
        var translateCategoryFrontPage = getGoogleTranslateCategoryFontPage();
        if (translateCategoryFrontPage != null) {
            var settings_translateCategoryFontPage = {
                item: table_settings_key_TranslateFrontPageTags,
                value: translateCategoryFrontPage == 1
            };
            update(table_Settings, settings_translateCategoryFontPage, () => {
                removeGoogleTranslateCategoryFontPage();
                complete3 = true;
            }, () => { complete3 = true; });
        } else {
            complete3 = true;
        }


        // 标签谷歌机翻_详情页开关
        var translateCategoryDetailPage = getGoogleTranslateCategoryDetail();
        if (translateCategoryDetailPage != null) {
            var settings_translateCategoryDetailPage = {
                item: table_Settings_key_TranslateDetailPageTags,
                value: translateCategoryDetailPage == 1
            };
            update(table_Settings, settings_translateCategoryDetailPage, () => {
                removeGoogleTranslateCategoryDetail();
                complete4 = true;
            }, () => { complete4 = true; });
        } else {
            complete4 = true;
        }

        // 用户收藏标签
        var favoriteList = getFavoriteDicts();
        if (favoriteList != null) {
            var settings_favoriteListDict = {
                item: table_Settings_key_FavoriteList,
                value: favoriteList
            };
            update(table_Settings, settings_favoriteListDict, () => {
                removeFavoriteDicts();
                complete5 = true;
            }, () => { complete5 = true; });
        } else {
            complete5 = true;
        }

        // 有损压缩图片数据同步
        var bgLowImgBase64 = getBgLowImage();
        if (!bgLowImgBase64) {
            // 从 indexeddb 有损压缩中读取，如果不存在这重新生成
            read(table_Settings, table_Settings_Key_Bg_Low_ImgBase64, result => {
                if (result && result.value) {
                    try {
                        setBgLowImage(result.value);
                    } finally {
                        complete6 = true;
                        complete7 = true;
                        complete8 = true;
                    }
                } else {
                    // 没有数据，属于旧版本没有获取数据的情况，需要根据源有数据重新生成
                    read(table_Settings, table_Settings_Key_Bg_ImgBase64, result => {
                        if (result && result.value) {
                            var t_imgBase64 = result.value;
                            read(table_Settings, table_Settings_Key_Bg_Low_ImgOverSize, result => {
                                if (!(result && result.value)) {
                                    // 需要尝试更新有损图片数据
                                    var img = new Image();
                                    img.src = t_imgBase64;
                                    img.onload = function () {
                                        var cvs = document.createElement("canvas");
                                        var ctx = cvs.getContext('2d');
                                        cvs.width = img.width;
                                        cvs.height = img.height;
                                        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);

                                        cvs.toBlob(function (blob) {
                                            var settings_Key_Bg_Low_ImgOverSize = {
                                                item: table_Settings_Key_Bg_Low_ImgOverSize,
                                                value: blob.size > lowImgSizeLimit
                                            };
                                            update(table_Settings, settings_Key_Bg_Low_ImgOverSize, () => { complete6 = true }, () => { complete6 = true });

                                            if (blob.size <= lowImgSizeLimit) {
                                                // 只尝试存储压缩后500kb容量的图片到 localstroage
                                                var reader2 = new FileReader();
                                                reader2.readAsDataURL(blob);
                                                reader2.onload = function (e2) {
                                                    var t_jpgBase64 = e2.target.result;
                                                    var settings_Key_Bg_Low_ImgBase64 = {
                                                        item: table_Settings_Key_Bg_Low_ImgBase64,
                                                        value: t_jpgBase64
                                                    };
                                                    update(table_Settings, settings_Key_Bg_Low_ImgBase64, () => { complete7 = true }, () => { complete7 = true });
                                                    try {
                                                        setBgLowImage(t_jpgBase64);
                                                    } finally {
                                                        complete8 = true;
                                                    }
                                                };
                                            } else {
                                                // 容量超出
                                                complete7 = true;
                                                complete8 = true;
                                            }

                                        }, 'image/jpeg', 0.1);
                                    }
                                } else {
                                    complete6 = true;
                                    complete7 = true;
                                    complete8 = true;
                                }
                            }, () => {
                                complete6 = true;
                                complete7 = true;
                                complete8 = true;
                            });
                        } else {
                            // 没有存储图片
                            complete6 = true;
                            complete7 = true;
                            complete8 = true;
                        }
                    }, () => {
                        complete6 = true;
                        complete7 = true;
                        complete8 = true;
                    });
                }
            })
        } else {
            // 存在图片
            complete6 = true;
            complete7 = true;
            complete8 = true;
        }

        var t = setInterval(() => {
            if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6 && complete7 && complete8) {
                t && clearInterval(t);
                func_compelete();
            }
        }, 50);
    })
}

// 读取和更新我的标签，收藏标签
function updateMyTagFavoriteTagHtml(func_complete, func_error) {
    indexDbInit(() => {
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

                    // 存储收藏 html
                    var settings_myTagsFavoriteCategory_html = {
                        item: table_Settings_key_MyTagsFavoriteCategory_Html,
                        value: favoritesTagListHtml
                    };
                    update(table_Settings, settings_myTagsFavoriteCategory_html, () => { func_complete(); }, () => { func_error(); });
                } else {
                    // 可用的收藏标签为空
                    remove(table_Settings, table_Settings_key_MyTagsFavoriteCategory_Html, () => { func_complete(); }, () => { func_error(); });
                }
            });
        });
    })
}

// 读取和更新我的标签，全部标签
function updateMyTagAllTagHtml(func_complete, func_error) {
    indexDbInit(() => {
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

                // 保存全部html数据
                var settings_myTagsAllCategory_html = {
                    item: table_Settings_key_MyTagsAllCategory_Html,
                    value: ehtagListHtml
                };
                update(table_Settings, settings_myTagsAllCategory_html, () => { func_complete(); }, () => { func_error(); });
            } else {
                // 不存在数据，删除 ehtag 版本号信息，等待删除完毕
                remove(table_Settings, table_Settings_key_EhTagVersion, () => {
                    func_complete();
                }, () => {
                    func_error();
                });
            }
        });
    })
}

//#endregion

//#region step3.0.frontTopTranslate.js 首页头部翻译

function frontTopOldSearchTranslate() {


    // 搜索框 和 按钮翻译
    // var searchDiv = nopms[0];
    var fSerach = document.getElementById("f_search");

    fSerach.parentNode.className = "nopm";
    fSerach.parentNode.nextSibling.className = "nopm";


    var nopms = document.getElementsByClassName("nopm");

    fSerach.setAttribute("placeholder", "搜索关键字");
    if (fSerach.value) {
        var searchValue = fSerach.value;
        if (searchValue.charAt(searchValue.length - 1) != " ") {
            fSerach.value += " ";
        }
    }
    var searchSubmitBtn = fSerach.nextSibling;
    searchSubmitBtn.value = "搜索";
    var searchClearBtn = searchSubmitBtn.nextSibling;
    searchClearBtn.value = "清空";

    // 显示高级选项
    if (nopms.length > 1) {
        var advancedDiv = nopms[1];
        if (advancedDiv.children.length > 0) {
            var advanceLink = advancedDiv.children[0];
            advanceLink.innerText = "显示高级选项";
            advanceLink.onclick = function () {
                this.innerText == "隐藏高级选项" ? copyModify_hide_advsearch_pane(this) : copyModify_show_advsearch_pane(this)
            }
        }

        // 文件搜索
        if (advancedDiv.children.length > 1) {
            // 将 fsdiv 挪到 searchbox 最后一位
            var fsdiv = document.getElementById("fsdiv");
            fsdiv.parentNode.removeChild(fsdiv);

            var searchbox = document.getElementById("searchbox");
            searchbox.appendChild(fsdiv);


            var fileSearchLink = advancedDiv.children[1];
            fileSearchLink.innerText = "显示文件搜索";
            fileSearchLink.onclick = function () {
                this.innerText == "隐藏文件搜索" ? copyModify_hide_filesearch_pane(this) : copyModify_show_filesearch_pane(this);
            }

            // 如果文件搜索存在，则直接翻译
            checkFsDiv(fileSearchLink);
        }
    }
}


function copyModify_show_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "隐藏高级选项";
    c.style.display = "";
    c.innerHTML = `<input type="hidden" id="advsearch" name="advsearch" value="1" />
    <table class="itss" style="margin: 0 auto; width: 90%;">
        <tr>
            <td class="ic4" style="text-align: left;">
                <input id="adv11" type="checkbox" name="f_sname" checked="checked" />
                <label for="adv11">搜索作品名称</label>
            </td>
            <td class="ic4" style="position: relative; left: 11%;text-align: center;"><input id="adv12" type="checkbox" name="f_stags" checked="checked" />
                <label for="adv12">搜索标签</label>
            </td>
            <td class="ic2" style="text-align: right;"><input id="adv13" type="checkbox" name="f_sdesc" colspan="2" />
                <label for="adv13">搜索描述</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2" style="text-align: left;"><input id="adv31" type="checkbox" name="f_sh" />
                <label for="adv31">搜索已经删除的作品</label>
            </td>
            <td class="ic2" colspan="2" style="text-align: right;"><input id="adv16" type="checkbox" name="f_sto" />
                <label for="adv16">只显示有种子的作品</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2" style="text-align: left;">
                <input id="adv21" type="checkbox" name="f_sdt1" />
                <label for="adv21">搜索低权重的标签</label>
            </td>
            <td class="ic2" colspan="2" style="text-align: right;">
                <input id="adv22" type="checkbox" name="f_sdt2" />
                <label for="adv22">搜索被否决的标签</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2" style="text-align: left;">搜索
                <input type="text" id="f_spf" name="f_spf" value="" size="4" maxlength="4" style="width:30px" /> 至
                <input type="text" id="f_spt" name="f_spt" value="" size="4" maxlength="4" style="width:30px" />
                页
            </td>
            <td class="ic2" colspan="2" style="text-align: right;"><input id="adv32" type="checkbox" name="f_sr" />
                <label for="adv32">评分不低于：</label> <select id="adv42" class="imr" name="f_srdd">
                    <option value="2">2 星</option>
                    <option value="3">3 星</option>
                    <option value="4">4 星</option>
                    <option value="5">5 星</option>
                </select>
            </td>
        </tr>
        <tr>
            <td class="ic1" colspan="4" style="text-align: center;">默认禁用筛选：
                <input id="adv51" type="checkbox" name="f_sfl" />
                <label for="adv51">语言</label>
                <input id="adv52" type="checkbox" name="f_sfu" />
                <label for="adv52">上传者</label>
                <input id="adv53" type="checkbox" name="f_sft" />
                <label for="adv53">标签</label>
            </td>
        </tr>
    </table>`;
}

function copyModify_hide_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "显示高级选项";
    c.style.display = "none";
    c.innerHTML = "";
}

function copyModify_show_filesearch_pane(b) {
    var c = document.getElementById("fsdiv");
    b.innerHTML = "隐藏文件搜索";
    c.style.display = "";
    c.innerHTML = `<form action="${ulhost}image_lookup.php" method="post" enctype="multipart/form-data">
    <div>
        <p style="font-weight:bold">如果要将 文件 和 类别或关键词 结合起来搜索，请先上传文件。</p>
        <p>选择要搜索的图片文件，然后点击文件搜索按钮。搜索结果将显示包含此文件的所有公开作品。</p>
        <div><input type="file" name="sfile" size="40" />
            <input type="submit" name="f_sfile" value="文件搜索" />
        </div>
        <p>对于彩色图片，系统还可以执行相似性查找以查找重新采样的图片。</p>
        <table class="itsf">
            <tr>
                <td class="ic3">
                    <input id="fs_similar" type="checkbox" name="fs_similar" checked="checked" />
                    <label for="fs_similar">使用相似度搜索</label>
                </td>
                <td class="ic3"><input id="fs_covers" type="checkbox" name="fs_covers" />
                    <label for="fs_covers">仅搜索封面</label>
                </td>
                <td class="ic3">
                    <input id="fs_exp" type="checkbox" name="fs_exp" />
                    <label for="fs_exp">显示已删除的作品</label>
                </td>
            </tr>
        </table>
    </div>
</form>`
}

function copyModify_hide_filesearch_pane(b) {
    var c = document.getElementById("fsdiv");
    b.innerHTML = "显示文件搜索";
    c.style.display = "none"; c.innerHTML = ""
}

function checkFsDiv(fileSearchLink) {
    var fsDiv = document.getElementById("fsdiv");
    if (fsDiv.innerHTML) {
        var ps = fsDiv.querySelectorAll("p");
        ps[0].innerText = "如果要将 文件 和 类别或关键词 结合起来搜索，请先上传文件。";
        ps[1].innerText = "选择要搜索的图片文件，然后点击文件搜索按钮。搜索结果将显示包含此文件的所有公开作品。";
        ps[2].innerText = "对于彩色图片，系统还可以执行相似性查找以查找重新采样的图片。";
        fsDiv.querySelectorAll("input")[1].value = "文件搜索";
        var tds = fsDiv.querySelectorAll("td");
        tds[0].children[1].innerText = "使用相似度搜索";
        tds[1].children[1].innerText = "仅搜索封面";
        tds[2].children[1].innerText = "显示已删除的作品";

        fileSearchLink.innerText = "隐藏文件搜索";
    }
}

//#endregion

//#region step3.1.frontTranslate.js 首页谷歌翻译

let dms;

var searchnav = document.getElementsByClassName("searchnav");
if (searchnav.length > 0) {
    dms = searchnav[0];
    dms.id = "dms";
}


// 首页谷歌翻译：标签
function translateMainPageTitle() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateFrontPageTitles = {
        item: table_Settings_key_TranslateFrontPageTitles,
        value: isChecked
    };
    update(table_Settings, settings_translateFrontPageTitles, () => {
        // 通知通知，翻译标题
        setDbSyncMessage(sync_googleTranslate_frontPage_title);
        translateMainPageTitleDisplay();
    }, () => { });
}

function translateMainPageTitleDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    var titleDivs = document.getElementsByClassName("glink");
    if (isChecked) {
        // 翻译标题
        for (const i in titleDivs) {
            if (Object.hasOwnProperty.call(titleDivs, i)) {
                const div = titleDivs[i];
                if (div.dataset.translate) {
                    // 已经翻译过
                    div.innerText = div.dataset.translate;

                } else {
                    // 需要翻译
                    div.title = div.innerText;

                    // 单条翻译
                    translatePageElementFunc(div, true, () => {
                        div.dataset.translate = div.innerText;
                    });
                }
            }
        }

    } else {
        // 显示原文
        for (const i in titleDivs) {
            if (Object.hasOwnProperty.call(titleDivs, i)) {
                const div = titleDivs[i];
                if (div.title) {
                    div.innerText = div.title;
                }
            }
        }
    }
}

// 下拉列表翻译
function dropDownlistTranslate() {
    var select = dms.querySelectorAll("select");
    if (select.length > 0) {
        var selectElement = select[0];
        var options = selectElement.options;
        for (const i in options) {
            if (Object.hasOwnProperty.call(options, i)) {
                const option = options[i];
                option.innerText = dropData[option.innerText] ?? option.innerText;
            }
        }
    }
}

// 表头翻译
function tableHeadTranslate() {
    var table = document.getElementsByClassName("itg");
    if (table.length > 0) {
        var theads = table[0].querySelectorAll("th");
        for (const i in theads) {
            if (Object.hasOwnProperty.call(theads, i)) {
                const th = theads[i];
                th.innerText = thData[th.innerText] ?? th.innerText;
                if ((i == 2 || i == 4) && th.innerText == "作品类型") {
                    th.innerText = "";
                }
            }
        }
    }
}

// 作品类型翻译
function bookTypeTranslate() {
    var cs = document.getElementsByClassName("cs");
    for (const i in cs) {
        if (Object.hasOwnProperty.call(cs, i)) {
            const item = cs[i];
            if (!item.innerText) {
                var classList = item.classList;
                for (const i in classList) {
                    if (Object.hasOwnProperty.call(classList, i)) {
                        const className = classList[i];
                        if (bookClassTypeData[className]) {
                            item.innerText = bookClassTypeData[className];
                        }
                    }
                }
            } else {
                item.innerText = bookTypeData[item.innerText] ?? item.innerText;
            }
        }
    }
    var cn = document.getElementsByClassName("cn");
    for (const i in cn) {
        if (Object.hasOwnProperty.call(cn, i)) {
            const item = cn[i];
            if (!item.innerText) {
                var classList = item.classList;
                for (const i in classList) {
                    if (Object.hasOwnProperty.call(classList, i)) {
                        const className = classList[i];
                        if (bookClassTypeData[className]) {
                            item.innerText = bookClassTypeData[className];
                        }
                    }
                }
            } else {
                item.innerText = bookTypeData[item.innerText] ?? item.innerText;
            }
        }
    }
}

// 表格标签翻译
function tableTagTranslate() {
    // 父项
    var tc = document.getElementsByClassName("tc");
    for (const i in tc) {
        if (Object.hasOwnProperty.call(tc, i)) {
            const item = tc[i];
            var cateEn = item.innerText.replace(":", "");
            read(table_detailParentItems, cateEn, result => {
                if (result) {
                    item.innerText = `${result.name}: `;
                }
            }, () => { });
        }
    }

    // 父项:子项，偶尔出现单个子项


    // var dms = document.getElementById("dms");
    if (dms) {
        var select = dms.querySelectorAll("select");
        var rightSelect = select[0];
        var gt = document.getElementsByClassName("gt");
        function translate(gt, i) {
            const item = gt[i];
            if (!item.dataset.title) {
                item.dataset.title = item.title;
            }
            var ps_en = item.dataset.title;
            read(table_EhTagSubItems, ps_en, result => {
                if (result) {
                    if (rightSelect.value == "e") {
                        // 标题 + 图片 + 标签，单个子项
                        item.innerText = result.sub_zh;
                    } else {
                        // 父子项
                        item.innerText = `${result.parent_zh}:${result.sub_zh}`;
                    }
                    if (result.sub_desc) {
                        item.title = `${item.title}\r\n${result.sub_desc}`;
                    }
                } else {
                    // 没有找到，翻译父项，子项保留
                    if (rightSelect.value != "e") {
                        var array = ps_en.split(":");
                        if (array.length == 2) {
                            var parent_en = array[0];
                            var sub_en = array[1];
                            read(table_detailParentItems, parent_en, result => {
                                if (result) {
                                    item.innerText = `${result.name}:${sub_en}`;
                                    if (result.sub_desc) {
                                        item.title = `${item.title}\r\n${result.sub_desc}`;
                                    }
                                }
                            }, () => { });
                        }
                    }
                }
            }, () => { });
        }
        for (const i in gt) {
            if (Object.hasOwnProperty.call(gt, i)) {
                translate(gt, i);
            }
        }
    }




    // 子项
    var gtl = document.getElementsByClassName("gtl");
    for (const i in gtl) {
        if (Object.hasOwnProperty.call(gtl, i)) {
            const item = gtl[i];
            if (!item.dataset.title) {
                item.dataset.title = item.title;
            }
            var ps_en = item.dataset.title;
            read(table_EhTagSubItems, ps_en, result => {
                if (result) {
                    item.innerText = result.sub_zh;
                    if (result.sub_desc) {
                        item.title = `${item.title}\r\n${result.sub_desc}`;
                    }
                }
            }, () => { });

        }
    }
}

// 作品篇幅
function tableBookPages() {
    var select = dms.querySelectorAll("select");
    var rightSelect = select[0];
    if (rightSelect.value == "l") {
        // 标题 + 悬浮图 + 标签
        var tdPages = document.getElementsByClassName("glhide");
        for (const i in tdPages) {
            if (Object.hasOwnProperty.call(tdPages, i)) {
                const td = tdPages[i];
                innerTextPageToYe(td.lastChild);
            }
        }
    } else if (rightSelect.value == "e") {
        // 标题 + 图片 + 标签
        var gl3eDivs = document.getElementsByClassName("gl3e");
        for (const i in gl3eDivs) {
            if (Object.hasOwnProperty.call(gl3eDivs, i)) {
                const gl3e = gl3eDivs[i];
                var childLength = gl3e.children.length;
                var pageDiv = gl3e.children[childLength - 2];
                innerTextPageToYe(pageDiv);
            }
        }
    }
}

// page -> 页
function innerTextPageToYe(element) {
    if (!element.innerText) return;
    if (element.innerText.indexOf(" pages") != -1) {
        element.innerText = element.innerText.replace(" pages", " 页");
    } else if (element.innerText.indexOf(" page") != -1) {
        element.innerText = element.innerText.replace(" page", " 页");
    }
}

function mainPageTranslate() {

    // 如果是EH，翻译底部倒数第二排的链接
    func_eh_ex(() => {
        var ips = document.getElementsByClassName("ip");
        if (ips.length > 0) {
            var lastIp = ips[ips.length - 1];
            var alinks = lastIp.querySelectorAll("a");
            for (const i in alinks) {
                if (Object.hasOwnProperty.call(alinks, i)) {
                    const alink = alinks[i];
                    if (bottom2MenusDataForEH[alink.innerText]) {
                        alink.innerText = bottom2MenusDataForEH[alink.innerText];
                    }
                }
            }
        }
    }, () => { });

    // 输入候选
    var searchDiv = document.getElementsByClassName("nopm")[0];
    var inputRecommendDiv = document.createElement("div");
    inputRecommendDiv.id = "category_user_input_recommend";
    searchDiv.appendChild(inputRecommendDiv);
    var searchInput = searchDiv.children[0];
    searchInput.oninput = function () {
        var inputValue = searchInput.value.toLowerCase();
        favoriteUserInputOnInputEvent(inputValue, inputRecommendDiv, searchInput);
    }

    // 作品类型翻译
    bookTypeTranslate();

    // 展示总数量
    var ip = document.getElementsByClassName("ip");
    if (window.location.pathname == "/") {
        // 首页
        if (document.getElementsByClassName("searchtext").length > 0) {
            document.getElementsByClassName("searchtext")[0].lastChild.innerText =
                document.getElementsByClassName("searchtext")[0].lastChild.innerText
                    .replace("Found", "共找到")
                    .replace("results", "条记录")
                    .replace("result", "条记录");
        }
    }
    else {
        // 其他页面
        if (ip.length > 0) {
            let ipTagElement = ip[0];
            // func_eh_ex(() => {
            // 	// e-hentai
            // 	ipTagElement = ip[0];
            // }, () => {
            // 	// exhentai
            // 	ipTagElement = ip[ip.length - 1];

            // });
            var strongText = ipTagElement.children[0];
            strongText.innerText = strongText.innerText.replace("Showing results for", "展示").replace("watched tags", "个偏好标签的结果");
            ipTagElement.children[1].innerText = "我的标签";
            if (document.getElementsByClassName("searchtext").length > 0 && document.getElementsByClassName("searchtext")[0].lastChild.innerText == "Found many results.") {
                document.getElementsByClassName("searchtext")[0].lastChild.innerText = "找到许多结果.";
            }
        }
    }

    // 预览下拉框
    var dms = document.getElementById("dms");
    if (!dms) {
        // 没有搜索到记录
        var iw = document.getElementById("iw");
        if (iw) {
            translatePageElementFunc(iw, false, () => {
                func_eh_ex(() => { }, () => {
                    var myTag = document.createElement("a");
                    myTag.href = "https://exhentai.org/mytags";
                    myTag.style.marginLeft = "10px";
                    myTag.innerText = "我的标签";
                    iw.appendChild(myTag);
                });
            });

            var otherP = iw.nextElementSibling.children[0];
            translatePageElement(otherP);
        }

        var ido = document.getElementsByClassName("ido");
        if (ido.length > 0) {
            func_eh_ex(() => {
                var ips = document.getElementsByClassName("ip");
                if (ips.length == 1) {
                    var toppane = document.getElementById("toppane");
                    var nullInfo = toppane.nextElementSibling.children[0];
                    translatePageElement(nullInfo);
                }

            }, () => {
                var nullInfo = ido[0].lastChild.lastChild;
                if (nullInfo) {
                    translatePageElement(nullInfo);
                }
            });
        }

        return;
    }

    // 翻译下拉菜单
    dropDownlistTranslate();

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
    // var beforeDiv = dms.firstChild;
    // var beforeDiv = dms.parentNode.firstChild;
    dms.insertBefore(translateDiv, dms.childNodes[2]);

    // 读取是否选中
    read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
        if (result && result.value) {
            translateCheckbox.setAttribute("checked", true);
            translateMainPageTitleDisplay();
        }
    }, () => { });

    // 表头翻译
    tableHeadTranslate();

    // 表格标签翻译
    tableTagTranslate();

    // 表格页数翻译
    tableBookPages();
}

// 标题翻译
function frontPageTitleTranslate() {
    var pathname = window.location.pathname;
    var h1 = document.getElementById("toppane").querySelector("h1");
    if (pathname == "/") {
        // 首页
        func_eh_ex(() => {
            // EH
            h1.innerText = "E-Hentai.org：一个免费的绅士同人志、漫画和图片集的网站";
        }, () => {
            // EX
            h1.children[0].innerText = "洋葱站点";
            h1.children[1].innerText = "[ 使用 Tor 访问 ]";
        });
    } else if (pathname == "/watched") {
        // 偏好
        h1.innerText = "作品列表 - 偏好标签";
    }
}

//#endregion

//#region step3.2.frontPageTopStyle 首页头部搜索显示隐藏

// 添加样式和逻辑，从 localstroage 中读取显示隐藏
function frontPageTopStyleStep01() {
    // 调整头部样式
    var searchBoxDiv = document.getElementById("searchbox");
    searchBoxDiv.style.width = "auto";
    searchBoxDiv.style.border = "0";

    // 头部添加词库更新提示
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    searchBoxDiv.appendChild(dataUpdateDiv);

    // 纯搜索模式、标签模式（默认）按钮
    var searchModeDiv = document.createElement("div");
    searchModeDiv.id = "div_searchMode_btn";
    searchModeDiv.addEventListener("click", searchModeChange);
    searchBoxDiv.appendChild(searchModeDiv);

    function searchModeChange() {
        var tagDiv = document.getElementById("div_ee8413b2");
        if (searchModeDiv.innerText == "纯搜索模式") {
            normalModeWrapperDiv.style.display = "none";
            tagDiv.style.display = "none";
            searchBoxDiv.children[0].style.display = "block";
            fsdivShow();
            searchModeDiv.innerText = "标签模式";
            setSearchMode(1);

        } else {
            normalModeWrapperDiv.style.display = "block";
            tagDiv.style.display = "block";
            searchModeDiv.innerText = "纯搜索模式";
            setSearchMode(0);

            // 判断头部是否需要显示
            var oldSearchDivVisible = getOldSearchDivVisible();
            if (oldSearchDivVisible == 0) {
                topVisibleDiv.innerText = "头部显示";
                searchBoxDiv.children[0].style.display = "none";
                fsdivHide();
            } else {
                topVisibleDiv.innerText = "头部隐藏";
            }
        }
    }

    // 头部按钮包裹层，包裹标准模式下的按钮
    var normalModeWrapperDiv = document.createElement("div");
    normalModeWrapperDiv.id = "div_normalMode_wrapper";
    searchBoxDiv.appendChild(normalModeWrapperDiv);

    // 头部添加字体颜色按钮
    var fontColorDiv = document.createElement("div");
    fontColorDiv.id = "div_fontColor_btn";
    var fontColorText = document.createTextNode("字体颜色");
    fontColorDiv.appendChild(fontColorText);
    normalModeWrapperDiv.appendChild(fontColorDiv);

    // 头部添加背景图片按钮
    var bgDiv = document.createElement("div");
    bgDiv.id = "div_background_btn";
    var bgText = document.createTextNode("背景图片");
    bgDiv.appendChild(bgText);
    normalModeWrapperDiv.appendChild(bgDiv);

    // 头部显示隐藏按钮
    var topVisibleDiv = document.createElement("div");
    topVisibleDiv.id = "div_top_visible_btn";
    topVisibleDiv.addEventListener("click", topVisibleChange);
    normalModeWrapperDiv.appendChild(topVisibleDiv);

    function topVisibleChange() {
        if (topVisibleDiv.innerText == "头部显示") {
            // 头部显示
            searchBoxDiv.children[0].style.display = "block";
            fsdivShow();
            topVisibleDiv.innerText = "头部隐藏";
            setOldSearchDivVisible(1);

        } else {
            // 头部隐藏
            searchBoxDiv.children[0].style.display = "none";
            fsdivHide();
            topVisibleDiv.innerText = "头部显示";
            setOldSearchDivVisible(0);
        }
    }

    // 读取头部是否隐藏，并应用到页面中
    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == 0) {
        topVisibleDiv.innerText = "头部显示";
        searchBoxDiv.children[0].style.display = "none";
        fsdivHide();
    } else {
        topVisibleDiv.innerText = "头部隐藏";
    }

    // 优先级高于头部隐藏
    // 读取模式数据，应用到页面中
    var oldSearchMode = getSearchMode();
    if (oldSearchMode == 1) {
        normalModeWrapperDiv.style.display = "none";
        searchBoxDiv.children[0].style.display = "block";
        fsdivShow();
        searchModeDiv.innerText = "标签模式";
    } else {
        searchModeDiv.innerText = "纯搜索模式";
    }
}

// 从indexedDB 中读取隐藏折叠
function frontPageTopStyleStep02() {
    var searchBoxDiv = document.getElementById("searchbox");
    var topVisibleDiv = document.getElementById("div_top_visible_btn");
    var normalModeWrapperDiv = document.getElementById("div_normalMode_wrapper");
    var searchModeDiv = document.getElementById("div_searchMode_btn");
    var tagDiv = document.getElementById("div_ee8413b2");

    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == null) {
        // 尝试从 indexedDB 中读取配置，如果存在则说明 localstroage 配置丢失，需要补充，页面对应隐藏折叠
        read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
            if (result) {
                if (!result.value) {
                    topVisibleDiv.innerText = "头部显示";
                    searchBoxDiv.children[0].style.display = "none";
                    fsdivHide();
                } else {
                    topVisibleDiv.innerText = "头部隐藏";
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


    var oldSearchMode = getSearchMode();
    if (oldSearchMode == null) {
        read(table_Settings, table_Settings_key_FrontPageSearchMode, result => {
            if (result) {
                if (result.value == 1) {
                    normalModeWrapperDiv.style.display = "none";
                    searchBoxDiv.children[0].style.display = "block";
                    fsdivShow();
                    tagDiv.style.display = "none";
                    searchModeDiv.innerText = "标签模式";
                } else {
                    searchModeDiv.innerText = "纯搜索模式";
                }
                setSearchMode(result.value);
            }
        }, () => { });
    }

    searchModeDiv.addEventListener("click", () => {
        var settings_keyfrontPageSearchMode = {
            item: table_Settings_key_FrontPageSearchMode,
            value: searchModeDiv.innerText == "标签模式" ? 1 : 0
        };
        update(table_Settings, settings_keyfrontPageSearchMode, () => {
            setDbSyncMessage(sync_frontPageSearchMode);
        }, () => { });
    });
}


function fsdivHide() {
    var fsdiv = document.getElementById("fsdiv");
    if (fsdiv) {
        fsdiv.style.display = "none";
    }
    var iw = document.getElementById("iw");
    if (iw) {
        iw.style.display = "none";
    }
}

function fsdivShow() {
    var nopms = document.getElementsByClassName("nopm");
    if (nopms.legnth > 1) {
        var labels = nopms[1].children;
        if (labels.length > 1) {
            var fsdiv = document.getElementById("fsdiv");
            if (fsdiv) {
                var txt = labels[1].innerText;
                if (txt == "隐藏文件搜索") {
                    fsdiv.style.display = "block";
                }
            }
        }
    }


    var iw = document.getElementById("iw");
    if (iw) {
        iw.style.display = "block";
    }
}

//#endregion

//#region step3.3.frontPageHtml.js 首页HTML

// 首页代码
const category_html = `
<div id="div_ee8413b2_bg"></div>
<div id="search_wrapper">
	<div id="search_top">
		<div id="category_all_button">全部类别</div>
		<div id="category_favorites_button">本地收藏</div>
		<div id="search_close">↑</div>
		<div id="category_search_input">
			<div id="input_info">
				<span id="readonly_div"></span>
				<input type="text" id="user_input">
				<span id="user_input_enter" title="按回车键添加">↵</span>
			</div>
			<div id="category_enter_button">全部</div>
			<div id="input_clear">X</div>
			<div id="category_user_input_recommend"></div>
		</div>
		<div id="category_addFavorites_button">加入收藏</div>
		<div id="category_addFavorites_button_disabled">加入收藏</div>
	</div>
	<div id="display_div">
		<div id="category_all_div">
			<div id="category_editor">
				<div id="all_collapse">折叠</div>
				<div id="all_expand">展开</div>
			</div>
			<div id="category_list">
                <div id="category_list_fetishList"></div>
                <div id="category_list_ehTag"></div>
            </div>
			<div id="category_loading_div">💕 请等待一小会儿，马上就好 💕</div>
		</div>
		<div id="category_favorites_div">
			<div id="favorites_editor">
				<div id="favorites_all_collapse">折叠</div>
				<div id="favorites_all_expand">展开</div>
				<div id="favorites_edit">编辑</div>
				<div id="favorites_clear">清空</div>
				<div id="favorites_save">保存</div>
				<div id="favorites_cancel">取消</div>
				<input type="file" id="favorite_upload_files" accept=".json">
				<div id="favorites_recover" title="从备份文件恢复收藏数据">恢复</div>
				<div id="favorites_export" title="备份收藏数据">备份</div>
			</div>
			<div id="favorites_list"></div>
			<div id="favorites_edit_list"></div>
		</div>
	</div>
</div>
<div id="background_form">
	<div id="background_form_top"></div>
	<div id="background_form_close" title="关闭">X</div>
	<div class="background_form_item">
		<label>背景图片：</label>
		<input type="file" id="bg_upload_file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" />
		<div id="bgUploadBtn"> + 上传图片</div>
	</div>
	<div class="background_form_item">
		<label>不透明度：</label>
		<input id="opacity_range" type="range" max="1" min="0.1" id="range" step="0.1" value="0.5">
		<div id="opacity_val">0.5</div>
	</div>
	<div class="background_form_item">
		<label>模糊程度：</label>
		<input id="mask_range" type="range" max="100" min="0" id="range" step="0.1" value="0">
		<div id="mask_val">0</div>
	</div>
	<div class="background_form_item">
		<div id="bgImg_clear_btn">重置 !</div>
		<div id="bgImg_save_btn">保存 √</div>
		<div id="bgImg_cancel_btn">取消 X</div>
	</div>
</div>
<div id="frontPage_listFontColor">
	<div id="frontPage_listFontColor_top"></div>
	<div id="frontPage_listFontColor_close" title="关闭">X</div>
	<div class="frontPage_listFontColor_item">
		<label>父级字体颜色：</label>
		<input type="color" id="parent_color" />
		<div id="parent_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<label>子级字体颜色：</label>
		<input type="color" id="sub_color" />
		<div id="sub_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<label>子级悬浮颜色：</label>
		<input type="color" id="sub_hover_color" />
		<div id="sub_hover_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<div id="listFontColor_clear_btn">重置 !</div>
		<div id="listFontColor_save_btn">保存 √</div>
		<div id="listFontColor_cancel_btn">取消 X</div>
	</div>
</div>
`;

function frontPageHtml() {
    // 基本框架代码插入，先创建包裹层div，然后构造包裹层内容
    var webdiv = document.createElement("div");
    webdiv.id = "div_ee8413b2";
    var searchBoxDiv = document.getElementById("searchbox");
    searchBoxDiv.appendChild(webdiv);
    //searchBoxDiv.insertBefore(webdiv, searchBoxDiv.children[0]);

    // 判断是否需要隐藏
    var oldSearchMode = getSearchMode();
    if (oldSearchMode == 1) {
        webdiv.style.display = "none";
    }
    webdiv.innerHTML = category_html;
}

//#endregion

//#region step4.1.detailTranslate.js 详情页翻译

// 头部添加词库更新提示
function detailDataUpdate() {
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    var gd2Div = document.getElementById("gd2");
    if (gd2Div) {
        gd2Div.appendChild(dataUpdateDiv);
    }
}

// 详情页翻译
function detailPageTranslate() {

    // 跨域
    crossDomain();

    //#region 左侧作品详情

    // 类型
    var bookType = document.getElementsByClassName("cs");
    if (bookType.length > 0) {
        bookType[0].innerText = bookTypeData[bookType[0].innerText] ?? bookType[0].innerText;
    }

    // 上传人员
    var uploder = document.getElementById("gdn");
    if (uploder) {
        var up = uploder.innerHTML;
        var newInnerHtml = `由 ${up} 上传`;
        uploder.innerHTML = newInnerHtml;
    }


    var gddDiv = document.getElementById("gdd");
    var trList = gddDiv.querySelectorAll("tr");

    // 添加隐藏的 文件大小 和 篇幅长度，有其他作者的下载图片脚本需要获取
    var spanElement = document.createElement("span");
    spanElement.style.display = "none";
    var spanTxt = document.createTextNode(`File Size: ${trList[4].lastChild.innerText} Length: ${trList[5].lastChild.innerText}`);
    spanElement.appendChild(spanTxt);
    gddDiv.appendChild(spanElement);

    // 上传时间
    trList[0].firstChild.innerText = "上传:";

    // 父级
    trList[1].firstChild.innerText = "父级:";
    if (trList[1].lastChild.innerText == "None") {
        trList[1].lastChild.innerText = "无";
    }

    // 是否可见
    trList[2].firstChild.innerText = "可见:";
    trList[2].lastChild.innerText = trList[2].lastChild.innerText == "Yes" ? "是" : "否";

    // 语言
    trList[3].firstChild.innerText = "语言:";

    // 文件大小
    trList[4].firstChild.innerText = "大小:";

    // 篇幅
    trList[5].firstChild.innerText = "篇幅:";
    trList[5].lastChild.innerText = trList[5].lastChild.innerText.replace("pages", "页");

    // 收藏
    trList[6].firstChild.innerText = "收藏:";
    var favoriteText = trList[6].lastChild.innerText;
    if (favoriteText == "None") {
        trList[6].lastChild.innerText = "0 次";
    }
    else if (favoriteText == "Once") {
        trList[6].lastChild.innerText = "1 次";
    }
    else {
        trList[6].lastChild.innerText = favoriteText.replace("times", "次");
    }

    // 评分
    var trRateList = document.getElementById("gdr").querySelectorAll("tr");
    trRateList[0].firstChild.innerText = "评分:";
    trRateList[1].firstChild.innerText = trRateList[1].firstChild.innerText.replace("Average", "平均分");

    // 添加到收藏(Ex 账号)
    document.getElementById("favoritelink").innerText = "收藏此作品";

    //#endregion

    // 文本框提示
    document.getElementById("newtagfield").placeholder = "添加新标签，用逗号分隔";
    document.getElementById("newtagbutton").value = "添加";

    // 右侧五个菜单
    var gd5a = document.getElementById("gd5").querySelectorAll("a");
    for (const i in gd5a) {
        if (Object.hasOwnProperty.call(gd5a, i)) {
            const a = gd5a[i];
            if (a.innerText.indexOf("Torrent Download") != -1) {
                a.innerText = a.innerText.replace("Torrent Download", "种子下载");
            } else {
                a.innerText = gd5aDict[a.innerText] ?? a.innerText;
            }
        }
    }

    // 展示数量
    var gpc = document.getElementsByClassName("gpc")[0];
    gpc.innerText = gpc.innerText.replace("Showing", "展示").replace("of", "共").replace("images", "张");

    // 展示行数
    var gdo2 = document.getElementById("gdo2").querySelectorAll("div");
    for (const i in gdo2) {
        if (Object.hasOwnProperty.call(gdo2, i)) {
            const div = gdo2[i];
            div.innerText = div.innerText.replace("rows", "行");
        }
    }

    // 图片尺寸
    var gdo4 = document.getElementById("gdo4").querySelectorAll("div");
    gdo4[0].innerText = "小图";
    gdo4[1].innerText = "大图";


    // 评论翻译
    var cdiv = document.getElementById("cdiv");
    var c1s = cdiv.querySelectorAll("div.c1");

    // 添加样式类，方便修改样式
    cdiv.classList.add("t_detail_comment");

    for (const i in c1s) {
        if (Object.hasOwnProperty.call(c1s, i)) {
            const c1 = c1s[i];

            var c2 = c1.children[0];

            // Posted on 04 May 2022, 11:21 by:
            var c3 = c2.querySelector("div.c3");
            var postTime = trimEnd(c3.childNodes[0].data.replace("Posted on ", "").replace("by:", ""));
            var postTimeArray = postTime.split(",");
            c3.childNodes[0].data = `评论时间：${transDate(postTimeArray[0])}${postTimeArray[1]} ， 评论者：`;

            // EH 私信
            if (webHost == "e-hentai.org") {
                var pmImg = c3.children[1].children[0];
                pmImg.title = "发私信";
            }

            // 根据 c6 添加翻译功能
            var translateSpan = document.createElement("span");
            translateSpan.classList.add("comment_span");
            translateSpan.id = "googleTranslateSpan_" + i;
            var translateCheckbox = document.createElement("input");
            translateCheckbox.setAttribute("type", "checkbox");
            translateCheckbox.id = "googleTranslateCheckbox_" + i;
            translateCheckbox.dataset.translate_id = c1.querySelector("div.c6").id;
            var translateLabel = document.createElement("label");
            translateLabel.setAttribute("for", translateCheckbox.id);
            translateLabel.id = "translateLabel" + i;
            translateLabel.innerText = "翻译";

            translateSpan.appendChild(translateCheckbox);
            translateSpan.appendChild(translateLabel);
            c3.parentNode.insertBefore(translateSpan, c3);

            translateCheckbox.onclick = function (e) {
                var c6 = document.getElementById(e.target.dataset.translate_id);
                if (e.target.checked) {
                    // 选中事件
                    if (c6.dataset.trans_en) {
                        // 翻译过，直接替换
                        c6.innerText = c6.dataset.trans_en;
                    } else {
                        // 谷歌翻译
                        c6.title = c6.innerText;
                        c6.dataset.origin_html = c6.innerHTML;
                        var c6ChildNodes = c6.childNodes;
                        for (const i in c6ChildNodes) {
                            if (Object.hasOwnProperty.call(c6ChildNodes, i)) {
                                const item = c6ChildNodes[i];
                                if (item.nodeName == "#text" && item.data) {
                                    var span = document.createElement("span");
                                    span.innerText = item.data;
                                    item.parentNode.insertBefore(span, item);
                                    item.parentNode.removeChild(item);
                                    translatePageElement(span);
                                } else if (item.innerText) {
                                    translatePageElement(item);
                                }
                            }
                        }
                    }
                } else {
                    // 取消选中事件
                    if (c6.dataset.origin_html) {
                        c6.innerHTML = c6.dataset.origin_html;
                    }
                }
            }

            // [Vote+] [Vote-]
            var c4 = c2.querySelector("div.c4");
            if (c4) {
                if (c4.childNodes.length == 2 && c4.childNodes[1].data == "Uploader Comment") {
                    c4.childNodes[1].data = "上传者的评论";
                } else {

                    if (c4.childNodes.length == 3) {
                        // 编辑
                        c4.children[0].innerText = " 编辑 ";
                        var c6Id = c1.querySelector("div.c6").id.replace("comment_", "");
                        c4.children[0].onclick = function () {
                            edit_comment_copy(c6Id);
                            return false;
                        }
                    } else {
                        // 点赞
                        var leftBracket = c4.childNodes[0];
                        leftBracket.data = "\xa0";
                        var middleBracket = c4.childNodes[2];
                        middleBracket.data = "\xa0\xa0";
                        var rightBracket = c4.childNodes[4];
                        rightBracket.data = "\xa0";

                        var like = c4.children[0];
                        like.innerText = "[ 👍 ]";
                        like.title = "点赞";
                        var dislike = c4.children[1];
                        dislike.innerText = "[ 👎 ]";
                        dislike.title = "点踩";
                    }
                }
            }

            // Score +10
            var c5 = c2.querySelector("div.c5");
            if (c5) {
                c5.childNodes[0].data = "得分 \xa0";
            }

            // Last edited on 04 May 2022, 16:41.
            var c8 = c1.querySelector("div.c8");
            if (c8) {
                c8.childNodes[0].data = "最后编辑时间：";
                var strong = c8.children[0];
                var modifyTimeArray = strong.innerText.split(",");
                strong.innerText = `${transDate(modifyTimeArray[0])}${modifyTimeArray[1]}`;
            }

            // You did not enter a valid comment.
            var c6 = c1.querySelector("div.c6");
            if (c6) {
                var pbr = c6.querySelector("p.br");
                if (pbr) {
                    switch (pbr.innerText) {
                        case "You did not enter a valid comment.":
                            pbr.innerText = "您没有输入有效的评论";
                            break;
                        case "Your comment is too short.":
                            pbr.innerText = "评论写的太短了";
                            break;
                        default:
                            translatePageElement(pbr);
                            break;
                    }
                }

                var gce = c6.querySelector("div.gce");
                if (gce) {
                    var submitBtn = gce.querySelector("input:last-child");
                    submitBtn.value = "发布评论";
                }
            }
        }
    }

    var chd = document.getElementById("chd");
    if (chd.children.length == 2) {
        // 底部展开全部翻译
        var p1 = chd.children[0];
        p1.childNodes[0].data = p1.childNodes[0].data
            .replace("There are", "还有")
            .replace("There is", "还有")
            .replace("more comments below the viewing threshold", "评论未显示")
            .replace("more comment below the viewing threshold", "评论未显示");
        // 点击显示全部
        p1.children[0].innerText = "点击显示全部";
    }

    // 翻译评论功能
    var postnewcomment = document.getElementById("postnewcomment");
    postnewcomment.children[0].innerText = " 评 论 ";
    var formDiv = document.getElementById("formdiv");
    var mycommentInput = formDiv.querySelector("textarea");
    mycommentInput.setAttribute("placeholder", "在此处输入您的评论，然后点击发表评论。如果最后发布的评论是您的，则此评论将附加到该帖子中。");
    var mycommentSubmit = formDiv.querySelector("input");
    mycommentSubmit.value = "发表评论";
}

function edit_comment_copy(b) {
    if (comment_xhr != undefined) {
        return
    }
    comment_xhr = new XMLHttpRequest();
    var a = {
        method: "geteditcomment",
        apiuid: apiuid,
        apikey: apikey,
        gid: gid,
        token: token,
        comment_id: b
    };
    api_call(comment_xhr, a, make_comment_editable_copy);
}
function make_comment_editable_copy() {
    var a = api_response(comment_xhr);
    var formHtml = `${a.editable_comment}`;
    formHtml = formHtml.replace('<input type="submit" value="Edit Comment" />', '<input type="submit" value="发布评论" />');

    if (a != false) {
        if (a.error != undefined) {
            alert("Could not get editable comment: " + a.error)
        }
        if (a.comment_id != undefined) {
            document.getElementById("comment_" + a.comment_id).innerHTML = formHtml
        }
        comment_xhr = undefined
    }
}

// 作品查看页面
function detailReadPage() {
    var i6 = document.getElementById("i6");
    var links = i6.querySelectorAll("a");
    for (const i in links) {
        if (Object.hasOwnProperty.call(links, i)) {
            const link = links[i];
            if (detailReadPage_bottomLinkDict[link.innerText]) {
                link.innerText = detailReadPage_bottomLinkDict[link.innerText];
            }
        }
    }

    // 获取回到详情页面的地址，生成一个链接，插入最前面
    var backLink = document.createElement("a");
    backLink.innerText = "返回到详情页";
    backLink.href = document.getElementById("i5").querySelector("a").href;
    backLink.style.marginRight = "10px";

    var backImg = document.createElement("img");
    func_eh_ex(() => {
        backImg.src = "https://ehgt.org/g/mr.gif";
    }, () => {
        backImg.src = "https://exhentai.org/img/mr.gif";
    });

    backImg.classList.add("mr");
    backImg.style.marginRight = "4px";

    i6.children[0].parentNode.insertBefore(backLink, i6.children[0]);
    i6.children[0].parentNode.insertBefore(backImg, i6.children[0]);

    // 下载原始图片
    var i7 = document.getElementById("i7");
    var downloadLink = i7.querySelector("a");
    if (downloadLink) {
        downloadLink.innerText = downloadLink.innerText.replace("Download original", "下载原图").replace("source", "");
    }

    // 重新修改点击事件
    var sns = document.getElementsByClassName("sn");
    for (const i in sns) {
        if (Object.hasOwnProperty.call(sns, i)) {
            const sn = sns[i];
            var links = sn.querySelectorAll("a");
            var firstParams = links[0].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[0].onclick = function () {
                return _load_image_copy(firstParams[0], firstParams[1].replace(/\'/g, ""), false);
            }

            var prevParams = links[1].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[1].onclick = function () {
                return _load_image_copy(prevParams[0], prevParams[1].replace(/\'/g, ""), false);
            }

            var nextParams = links[2].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[2].onclick = function () {
                return _load_image_copy(nextParams[0], nextParams[1].replace(/\'/g, ""), false);
            }

            var lastParams = links[3].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[3].onclick = function () {
                return _load_image_copy(lastParams[0], lastParams[1].replace(/\'/g, ""), false);
            }
        }
    }
}

function _load_image_copy(e, f, d) {
    if (holdingOverrideKey) {
        return true
    }
    var c = "s/" + f + "/" + gid + "-" + e;
    var a = base_url + c;
    if (!d) {
        if (load_cooldown) {
            return false
        } ++pcnt
    } else {
        --pcnt
    }
    if (history.pushState && (pcnt <= prl)) {
        if (dispatch_xhr != undefined) {
            return false
        }
        if (!d) {
            load_cooldown = true;
            setTimeout(function () {
                load_cooldown = false
            },
                1000)
        }
        dispatch_xhr = new XMLHttpRequest();
        var b = {
            method: "showpage",
            gid: gid,
            page: e,
            imgkey: f,
            showkey: showkey
        };
        api_call(dispatch_xhr, b,
            function () {
                load_image_dispatch_copy()
            });
        if (!d) {
            history.pushState({
                page: e,
                imgkey: f
            },
                document.title, a)
        }
    } else {
        pcnt = 0;
        document.location = a
    }
    return false
}

function load_image_dispatch_copy() {
    var a = api_response(dispatch_xhr);
    if (a != false) {
        if (a.error != undefined) {
            document.location = document.location + ""
        } else {
            history.replaceState({
                page: a.p,
                imgkey: a.k,
                json: a,
                expire: get_unixtime() + 300
            },
                document.title, base_url + a.s);

            a.n = a.n.replace(/load_image/g, "load_image_copy");

            a.i6 = a.i6
                .replace("Show all galleries with this file", "显示包含此图片的所有作品")
                .replace("Click here if the image fails loading", "重新加载图片")
                .replace("Generate a static forum image link", "生成用于论坛的图片链接");
            func_eh_ex(() => {
                a.i6 = ` &nbsp; <img src=\"https://ehgt.org/g/mr.gif\" class=\"mr\" /> <a href="https://exhentai.org/g/2211477/40853439b7/">返回到详情页</a>${a.i6}`;
            }, () => {
                a.i6 = ` &nbsp; <img src=\"https://exhentai.org/img/mr.gif\" class=\"mr\" /> <a href="https://exhentai.org/g/2211477/40853439b7/">返回到详情页</a>${a.i6}`;
            });


            a.i7 = a.i7.replace("Download original", "下载原图").replace("source", "");
            apply_json_state_copy(a)
        }
        dispatch_xhr = undefined
    }
}

function apply_json_state_copy(a) {
    window.scrollTo(0, 0);
    document.getElementById("i1").style.width = a.x + "px";
    document.getElementById("i2").innerHTML = a.n + a.i;
    document.getElementById("i3").innerHTML = a.i3;
    document.getElementById("i4").innerHTML = a.i + a.n;
    document.getElementById("i5").innerHTML = a.i5;
    document.getElementById("i6").innerHTML = a.i6;
    document.getElementById("i7").innerHTML = a.i7;
    si = parseInt(a.si);
    xres = parseInt(a.x);
    yres = parseInt(a.y);
    update_window_extents()
}

// 作品详情页面，可能会弹出不适合所有人查看的作品警告，如果出现则翻译谷歌翻译文本，且跳过页面后续的执行操作
function checkBooksWarning() {
    var gm = document.querySelector("div.gm");
    if (!gm) {
        var nb = document.getElementById("nb");
        var warnDiv = nb.nextElementSibling;
        if (warnDiv) {
            // 跨域
            crossDomain();

            // 翻译警告信息
            recursionDetailPageWarnTranslate(warnDiv);
        }

        return true; // 警告页面
    }

    return false; // 无警告
}

function recursionDetailPageWarnTranslate(element) {
    var elementChildNodes = element.childNodes;
    for (const i in elementChildNodes) {
        if (Object.hasOwnProperty.call(elementChildNodes, i)) {
            const child = elementChildNodes[i];
            if (child.nodeName == "#text" && child.data) {
                var trimData = trimEnd(child.data);
                if (trimData.replace(/[\r\n]/g, "") != "") {
                    var span = document.createElement("span");
                    span.innerText = trimData;
                    child.parentNode.insertBefore(span, child);
                }
                child.parentNode.removeChild(child);
            }
        }
    }

    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        if (child.children.length > 0) {
            recursionDetailPageWarnTranslate(child);
        } else if (child.innerText) {
            child.title = child.innerText;
            if (detailPage_warnContentDict[child.innerText]) {
                child.innerText = detailPage_warnContentDict[child.innerText];
            } else {
                // 谷歌机翻
                translatePageElement(child);
            }
        }
    }
}

//#endregion

//#region step4.2.detailbtn.js 详情页主要按钮功能

// 详情页选中的标签信息
var detailCheckedDict = {};

// 谷歌机翻
function translateDetailPageTitle() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateDetailPageTitles = {
        item: table_Settings_key_TranslateDetailPageTitles,
        value: isChecked
    };
    update(table_Settings, settings_translateDetailPageTitles, () => {
        setDbSyncMessage(sync_googleTranslate_detailPage_title);
        translateDetailPageTitleDisplay();
    }, () => { });
}

function translateDetailPageTitleDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    var h1 = document.getElementById("h1Origin_copy");
    if (!h1.innerText) {
        h1 = document.getElementById("h1Title_copy");;
    }

    var signDictArray = [];
    var txtArray = [];
    var translateDict = {};
    var specialChars = [
        '(', ')', '（', '）',
        '[', ']', '【', '】',
        '{', '}', '｛', '｝',
        '<', '>', '《', '》',
        '|', '&', '!', '@', '#', '$', '￥', '%', '^', '*', '`', '~', ' '
    ];

    if (isChecked) {
        // 翻译标题
        if (h1.dataset.translate) {
            // 已经翻译过
            h1.innerText = h1.dataset.translate;
        } else {
            // 需要翻译
            h1.title = h1.innerText;

            var cstr = '';
            for (let i = 0; i < h1.title.length; i++) {
                const c = h1.title[i];

                if (specialChars.indexOf(c) != -1) {
                    signDictArray.push({ i, c });
                    if (cstr != '') {
                        txtArray.push(cstr);
                        cstr = '';
                    }
                } else {
                    cstr += c;
                }
            }

            if (cstr != '') {
                txtArray.push(cstr);
            }


            var totalCount = txtArray.length;
            var indexCount = 0;
            for (const i in txtArray) {
                if (Object.hasOwnProperty.call(txtArray, i)) {
                    const text = txtArray[i];
                    getTranslate(text, i);
                }
            }

            function getTranslate(text, i) {
                getGoogleTranslate(text, function (data) {
                    var sentences = data.sentences;
                    var longtext = '';
                    for (const i in sentences) {
                        if (Object.hasOwnProperty.call(sentences, i)) {
                            const sentence = sentences[i];
                            longtext += sentence.trans;
                        }
                    }
                    translateDict[i] = longtext;
                    indexCount++;
                });
            }

            var t = setInterval(() => {
                if (totalCount == indexCount) {
                    t && clearInterval(t);
                    translateCompelete();
                }
            }, 50);

            function translateCompelete() {
                if (signDictArray.length == 0 && txtArray.length > 0) {
                    // 纯文字
                    var str = '';
                    for (const i in translateDict) {
                        if (Object.hasOwnProperty.call(translateDict, i)) {
                            str += translateDict[i];
                        }
                    }
                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;

                } else if (signDictArray.length > 0 && txtArray.length == 0) {
                    // 纯符号
                    var str = '';
                    for (const i in signDictArray) {
                        if (Object.hasOwnProperty.call(signDictArray, i)) {
                            const item = signDictArray[i];
                            str += item.c;
                        }
                    }
                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;

                } else if (signDictArray.length > 0 || txtArray.length > 0) {
                    // 文字 + 符号
                    var signIndex = 0;
                    var translateIndex = 0;
                    var str = '';
                    var lastSignIndex = -2;
                    if (signDictArray[0].i == 0) {
                        // 符号在前
                        while (signIndex < signDictArray.length ||
                            translateIndex < txtArray.length) {
                            // 符号索引间隔是否为1
                            if (signIndex < signDictArray.length) {
                                str += signDictArray[signIndex].c;
                                lastSignIndex = signDictArray[signIndex].i;
                                signIndex++;
                            }

                            if (signDictArray[signIndex] && signDictArray[signIndex].i == lastSignIndex + 1) {
                                // 符号连续
                                continue;
                            }

                            if (translateIndex < txtArray.length) {
                                str += translateDict[translateIndex];
                                translateIndex++;
                            }
                        }
                    } else {
                        // 文字在前
                        while (signIndex < signDictArray.length ||
                            translateIndex < txtArray.length) {
                            // 符号索引间隔是否为1
                            if (signDictArray[signIndex] && signDictArray[signIndex].i == lastSignIndex + 1) {
                                // 符号连续
                                if (signIndex < signDictArray.length) {
                                    str += signDictArray[signIndex].c;
                                    lastSignIndex = signDictArray[signIndex].i;
                                    signIndex++;
                                }
                                continue;
                            }

                            if (translateIndex < txtArray.length) {
                                str += translateDict[translateIndex];
                                translateIndex++;
                            }

                            if (signIndex < signDictArray.length) {
                                str += signDictArray[signIndex].c;
                                lastSignIndex = signDictArray[signIndex].i;
                                signIndex++;
                            }
                        }
                    }

                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;
                }
            }
        }

    } else {
        // 显示原文
        if (h1.title) {
            h1.innerText = h1.title;
        }
    }
}

function detailPageTitleCopy() {
    var gd2 = document.getElementById("gd2");

    var h1Title = document.getElementById("gn");
    h1Title.style.display = "none";

    var h1Title_copy = document.createElement("h1");
    h1Title_copy.id = "h1Title_copy";
    h1Title_copy.innerText = h1Title.innerText;
    gd2.appendChild(h1Title_copy);

    var h1Origin = document.getElementById("gj");
    h1Origin.style.display = "none";

    var h1Origin_copy = document.createElement("h1");
    h1Origin_copy.id = "h1Origin_copy";
    h1Origin_copy.innerText = h1Origin.innerText;
    gd2.appendChild(h1Origin_copy);


}

// 右侧按钮
function detailPageRightButtons() {
    // 右侧操作列
    var rightDiv = document.getElementById("gd5");

    // 标签谷歌机翻按钮
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
    rightDiv.appendChild(translateDiv);
    translateCheckbox.addEventListener("click", translateDetailPageTitle);

    // 读取是否选中
    indexDbInit(() => {
        read(table_Settings, table_Settings_key_TranslateDetailPageTitles, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateDetailPageTitleDisplay();
            }
        }, () => { });
    });

    // 清空选择按钮
    var clearBtn = document.createElement("div");
    clearBtn.id = "div_ee8413b2_detail_clearBtn";
    var clearTxt = document.createTextNode("清空选择");
    clearBtn.appendChild(clearTxt);
    clearBtn.addEventListener("click", categoryCheckClear);
    rightDiv.appendChild(clearBtn);

    // 加入收藏按钮
    var addFavoriteBtn = document.createElement("div");
    addFavoriteBtn.id = "div_ee8413b2_detail_addFavoriteBtn";
    var addFavoriteTxt = document.createTextNode("加入收藏");
    addFavoriteBtn.appendChild(addFavoriteTxt);
    addFavoriteBtn.addEventListener("click", categoryAddFavorite);
    rightDiv.appendChild(addFavoriteBtn);

    // 查询按钮
    var searchBtn = document.createElement("div");
    searchBtn.id = "div_ee8413b2_detail_searchBtn";
    var searchBtnTxt = document.createTextNode("搜索");
    searchBtn.appendChild(searchBtnTxt);
    searchBtn.addEventListener("click", categorySearch);
    rightDiv.appendChild(searchBtn);

    // 详情页右侧标签样式修改
    var rightP = rightDiv.querySelectorAll("p");
    for (const i in rightP) {
        if (Object.hasOwnProperty.call(rightP, i)) {
            const p = rightP[i];
            p.classList.remove("gsp");
        }
    }

    // 清空选择
    function categoryCheckClear() {
        for (const ps_en in detailCheckedDict) {
            if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
                var parentDiv = document.getElementById(`td_${ps_en.replace(new RegExp(/( )/g), "_")}`);
                parentDiv.classList.remove("div_ee8413b2_category_checked");
            }
        }

        detailCheckedDict = {};
        hideDetailBtn();
    }

    // 隐藏按钮
    function hideDetailBtn() {
        clearBtn.style.display = "none";
        addFavoriteBtn.style.display = "none";
        searchBtn.style.display = "none";
    }

    // 加入收藏
    function categoryAddFavorite() {
        addFavoriteBtn.innerText = "收藏中...";

        var favoriteDict = {};
        var favoriteCount = 0;
        var checkDictCount = 0;
        var indexCount = 0;
        // 先从 收藏表中查询，是否存在，如果存在则不添加
        // 再从 EhTag表中查询，看是否存在，如果不存则更新父级 + 子级同名
        // 最后批量插入收藏表中，然后通知其他页面进行同步
        for (const ps_en in detailCheckedDict) {
            if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
                const item = detailCheckedDict[ps_en];
                read(table_favoriteSubItems, ps_en, favoriteResult => {
                    if (!favoriteResult) {
                        // 收藏表不存在
                        read(table_EhTagSubItems, ps_en, ehTagResult => {
                            if (ehTagResult) {
                                // Ehtag表存在
                                favoriteDict[ps_en] = {
                                    parent_en: ehTagResult.parent_en,
                                    parent_zh: ehTagResult.parent_zh,
                                    sub_en: ehTagResult.sub_en,
                                    sub_zh: ehTagResult.sub_zh,
                                    sub_desc: ehTagResult.sub_desc
                                };
                                favoriteCount++;
                                indexCount++;
                            } else {
                                // EhTag表不存在
                                read(table_detailParentItems, item.parent_en, parentResult => {
                                    if (parentResult) {
                                        // 父级存在
                                        favoriteDict[ps_en] = {
                                            parent_en: parentResult.row,
                                            parent_zh: parentResult.name,
                                            sub_en: item.sub_en,
                                            sub_zh: item.sub_en,
                                            sub_desc: ''
                                        };
                                        favoriteCount++;
                                        indexCount++;
                                    } else {
                                        // 父级不存在
                                        var custom_parent_en = 'userCustom';
                                        var custom_sub_en = item.parent_en;
                                        var custom_ps_en = `${custom_parent_en}:${custom_sub_en}`;
                                        // 再查收藏表是否存在
                                        read(table_favoriteSubItems, custom_ps_en, customFavoriteResult => {
                                            if (!customFavoriteResult) {
                                                // 不存在
                                                favoriteDict[custom_ps_en] = {
                                                    parent_en: custom_parent_en,
                                                    parent_zh: '自定义',
                                                    sub_en: item.sub_en,
                                                    sub_zh: item.sub_en,
                                                    sub_desc: ''
                                                };
                                                favoriteCount++;
                                            }
                                            indexCount++;
                                        }, () => { indexCount++; });
                                    }
                                }, () => { indexCount++; });
                            }
                        }, () => { indexCount++; });
                    } else {
                        indexCount++;
                    }
                }, () => { indexCount++; });
                checkDictCount++;
            }
        }

        var t = setInterval(() => {
            if (indexCount == checkDictCount) {
                t && clearInterval(t);
                // 批量插入新增收藏，完成后通知同步
                batchAddFavoriteAndMessage();
            }
        }, 50);


        function batchAddFavoriteAndMessage() {
            batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, favoriteDict, favoriteCount, () => {
                // 更新我的标签收藏
                updateMyTagFavoriteTagHtml(() => {
                    setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                }, () => { });

                // 读取收藏表，更新收藏列表html
                var favoritesListHtml = ``;
                var lastParentEn = ``;
                readAll(table_favoriteSubItems, (k, v) => {
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
                    // 读完后操作
                    if (favoritesListHtml != ``) {
                        favoritesListHtml += `</div>`;
                    }

                    // 存储收藏 Html
                    var settings_favoriteList_html = {
                        item: table_Settings_key_FavoriteList_Html,
                        value: favoritesListHtml
                    };
                    update(table_Settings, settings_favoriteList_html, () => {
                        // localstroage 消息通知
                        setDbSyncMessage(sync_favoriteList);
                        // 显示完成
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "完成 √";
                        }, 250);
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "加入收藏";
                        }, 500);
                    }, () => {
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "完成 ×";
                        }, 250);
                        setTimeout(function () {
                            addFavoriteBtn.innerText = "加入收藏";
                        }, 500);
                    });
                });
            });
        }


    }

    // 搜索
    function categorySearch() {
        var searchArray = [];
        for (const ps_en in detailCheckedDict) {
            if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
                searchArray.push(`"${ps_en}"`);
            }
        }

        // 构建请求链接
        var searchLink = `${window.location.origin}/?f_search=${searchArray.join("+")}`;
        window.location.href = searchLink;
    }
}

// 标签翻译
function detailPageTagTranslate() {

    // 左侧作品语种
    var trList = document.getElementById("gdd").querySelectorAll("tr");
    var language = trList[3].lastChild.innerText.toLowerCase().replace(/(\s*$)/g, "");
    readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, language, result => {
        trList[3].lastChild.innerText = result.sub_zh;
    }, () => { });

    // 翻译标签父级
    var tcList = document.getElementsByClassName("tc");
    for (const i in tcList) {
        if (Object.hasOwnProperty.call(tcList, i)) {
            const tc = tcList[i];
            if (!tc.dataset.parent_en) {
                tc.dataset.parent_en = tc.innerText.replace(":", "");
            }
            var parentEn = tc.dataset.parent_en;
            read(table_detailParentItems, parentEn, result => {
                if (result) {
                    tc.innerText = `${result.name}:`;
                }
            }, () => { });
        }
    }

    // 翻译标签子项
    var aList = document.getElementById("taglist").querySelectorAll("a");
    for (const i in aList) {
        if (Object.hasOwnProperty.call(aList, i)) {
            const a = aList[i];

            // 查询父级和子级
            var splitStr = a.id.split("ta_")[1].split(":");
            var parent_en = splitStr[0];
            var sub_en;
            var parentId;

            if (splitStr.length == 2) {
                sub_en = splitStr[1].replace(new RegExp(/(_)/g), " ");
                parentId = `td_${parent_en}:${sub_en}`;
            } else {
                sub_en = parent_en;
                parent_en = "temp";
                parentId = `td_${sub_en}`;
            }

            a.dataset.ps_en = `${parent_en}:${sub_en}`;
            a.dataset.parent_en = parent_en;
            a.dataset.sub_en = sub_en;
            a.dataset.parent_id = parentId;

            // 点击添加事件，附带颜色
            a.addEventListener("click", detailCategoryClick);
            // 翻译标签
            read(table_EhTagSubItems, a.dataset.ps_en, result => {
                if (result) {
                    a.innerText = result.sub_zh;
                    a.title = `${result.sub_en}\r\n${result.sub_desc}`;
                }
            }, () => { });
        }
    }

}

// 标签选中事件
function detailCategoryClick(e) {
    var dataset = e.target.dataset;
    var parentId = dataset.parent_id;
    var ps_en = dataset.ps_en;
    var parent_en = dataset.parent_en;
    var sub_en = dataset.sub_en;

    var parentDiv = document.getElementById(`${parentId.replace(new RegExp(/( )/g), "_")}`);
    // 标签颜色改为黄色
    var alink = parentDiv.querySelectorAll("a")[0];
    if (alink.style.color == "blue") {
        func_eh_ex(() => {
            alink.style.color = "darkorange";
        }, () => {
            alink.style.color = "yellow";
        })
    }
    else {
        alink.style.color = "";
    }

    if (!detailCheckedDict[ps_en]) {
        // 添加选中
        detailCheckedDict[ps_en] = { parent_en, sub_en };
        parentDiv.classList.add("div_ee8413b2_category_checked");
    } else {
        // 移除选中
        delete detailCheckedDict[ps_en];
        parentDiv.classList.remove("div_ee8413b2_category_checked");
    }

    var clearBtn = document.getElementById("div_ee8413b2_detail_clearBtn");
    var addFavoriteBtn = document.getElementById("div_ee8413b2_detail_addFavoriteBtn");
    var searchBtn = document.getElementById("div_ee8413b2_detail_searchBtn");

    // 检查如果没有一个选中的，隐藏操作按钮
    if (checkDictNull(detailCheckedDict)) {
        clearBtn.style.display = "none";
        addFavoriteBtn.style.display = "none";
        searchBtn.style.display = "none";
    }
    else {
        clearBtn.style.display = "block";
        addFavoriteBtn.style.display = "block";
        searchBtn.style.display = "block";
    }
}

// 尝试使用旧版的词库，然后检查更新
function detailTryUseOldData() {
    indexDbInit(() => {
        // 验证数据完整性
        checkDataIntact(() => {
            // 判断是否存在旧数据
            var fetishHasValue = false;
            var ehTagHasValue = false;
            var complete1 = false;
            var complete2 = false;

            checkTableEmpty(table_fetishListSubItems, () => {
                // 数据为空
                complete1 = true;
            }, () => {
                // 存在数据
                fetishHasValue = true;
                complete1 = true;
            });

            checkTableEmpty(table_EhTagSubItems, () => {
                // 数据为空
                complete2 = true;
            }, () => {
                // 存在数据
                ehTagHasValue = true;
                complete2 = true;
            });

            var t = setInterval(() => {
                if ((complete1 && fetishHasValue) || (complete2 && ehTagHasValue)) {
                    t && clearInterval(t);
                    // 存在数据
                    detailPageTagTranslate();
                    // 检查更新
                    checkUpdateData(() => {
                        // 存在更新
                        detailPageTagTranslate();
                    }, () => { });
                } else if (complete1 && complete2) {
                    t && clearInterval(t);
                    // 不存在数据
                    checkUpdateData(() => {
                        // 存在更新
                        detailPageTagTranslate();
                    }, () => {
                        detailPageTagTranslate();
                    });
                }
            }, 10);
        });
    })
}

//#endregion

//#region 7.4.2.torrentsDetailPages.js 种子详情页

function torrentsDetailPages() {

    // 判断是哪个页面
    var forms = document.getElementsByTagName("form");
    var inputs = forms[forms.length - 1].querySelectorAll("input");
    var submitBtn = inputs[inputs.length - 1];
    if (submitBtn.value == "Back to Index") {
        // 详情页
        submitBtn.value = "返回";
        torrentsDetailInfo();

    } else if (submitBtn.value == "Upload Torrent") {
        // 首页
        submitBtn.value = "上传种子";
        torrentsDetailIndex();
    }
}

function torrentsDetailInfo() {
    // 跨域
    crossDomain();

    // 添加类 torrents_detail_info，方便添加样式
    var torrentinfo = document.getElementById("torrentinfo");
    torrentinfo.classList.add("torrents_detail_info");

    // 表格统计数据翻译
    var ett = document.getElementById("ett");
    var trs = ett.querySelectorAll("tr");
    trs[0].children[0].innerText = "发布时间";
    trs[0].children[2].innerText = "做种";
    trs[1].children[0].innerText = "上传者";
    trs[1].children[2].innerText = "下载";
    trs[2].children[0].innerText = "文件大小";
    trs[2].children[2].innerText = "完成";

    // 种子下载翻译
    var torrentTable = document.getElementsByTagName("table")[1];
    var tr2s = torrentTable.querySelectorAll("tr");
    var alinkPersonal = tr2s[0].children[0].children[0];
    alinkPersonal.innerText = "种子下载 - 私人";
    tr2s[0].children[1].innerText = "（ 只属于你 - 确保记录你的下载统计信息11111 ）";
    var alinkOpen = tr2s[1].children[0].children[0];
    alinkOpen.innerText = "种子下载 - 可二次分发";
    tr2s[1].children[1].innerText = "（ 如果您想再发布或提供给其他人使用 ）";

    // 上传者留言，谷歌机翻
    var etd = document.getElementById("etd");
    var commandP = document.createElement("p");
    commandP.id = "commandP";
    commandP.innerText = etd.innerText;
    etd.innerText = "";
    etd.appendChild(commandP);

    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    translateCheckbox.addEventListener("click", torrentsDetailInfoCommand);
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻";
    translateDiv.appendChild(translateLabel);
    translateDiv.appendChild(translateCheckbox);

    etd.appendChild(translateDiv);

    // 获取设置
    indexDbInit(() => {
        // 读取是否选中
        read(table_Settings, table_Settings_key_TranslateTorrentDetailInfoCommand, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateTorrentDetailInfoCommandDisplay();
            }
        }, () => { });
    });

    // 同步谷歌机翻留言
    DataSyncTranslateTorrentDetailInfoCommand();

    // 投票删除
    var expungeform = document.getElementById("expungeform");
    var deleteLink = expungeform.children[0].children[2];
    deleteLink.innerText = "投票删除";
    deleteLink.onclick = function () {
        var deleteText = "你确定要投票删除这个种子吗？此操作无法撤消。";
        if (confirm(deleteText)) {
            expungeform.submit();
        }
    }

    // 关闭窗口
    closeWindow();

    document.getElementsByClassName("stuffbox")[0].lastChild.style.marginTop = "0 !important";
}

function torrentsDetailInfoCommand() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateTorrentDetailInfoCommand = {
        item: table_Settings_key_TranslateTorrentDetailInfoCommand,
        value: isChecked
    };
    update(table_Settings, settings_translateTorrentDetailInfoCommand, () => {
        // 通知通知，翻译标题
        setDbSyncMessage(sync_googleTranslate_torrentDetailInfo_command);
        translateTorrentDetailInfoCommandDisplay();
    }, () => { });
}

function translateTorrentDetailInfoCommandDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    var commandP = document.getElementById("commandP");
    if (isChecked) {
        // 翻译留言
        if (commandP.dataset.translate) {
            // 已经翻译过
            commandP.innerText = commandP.dataset.translate;
        } else {
            // 需要翻译
            commandP.title = commandP.innerText;
            var encodeText = urlEncode(commandP.innerText);
            getGoogleTranslate(encodeText, function (data) {
                var sentences = data.sentences;
                var longtext = '';
                for (const i in sentences) {
                    if (Object.hasOwnProperty.call(sentences, i)) {
                        const sentence = sentences[i];
                        longtext += sentence.trans;
                    }
                }

                commandP.innerText = longtext;
                commandP.dataset.translate = longtext;
            });
        }
    } else {
        // 显示原文
        commandP.innerText = commandP.title;
    }
}

function DataSyncTranslateTorrentDetailInfoCommand() {
    // 谷歌机翻：标题
    window.onstorage = function (e) {
        try {
            switch (e.newValue) {
                case sync_googleTranslate_torrentDetailInfo_command:
                    updateGoogleTorrentDetailInfoCommand();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    // 谷歌翻译留言
    function updateGoogleTorrentDetailInfoCommand() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_TranslateTorrentDetailInfoCommand, result => {
                var translateCheckbox = document.getElementById("googleTranslateCheckbox");
                translateCheckbox.checked = result && result.value;
                translateTorrentDetailInfoCommandDisplay();
                removeDbSyncMessage();

            }, () => { removeDbSyncMessage(); });
        })
    }
}


function torrentsDetailIndex() {
    // 添加类 torrents_detail_index，方便添加样式
    var torrentinfo = document.getElementById("torrentinfo");
    torrentinfo.classList.add("torrents_detail_index");

    // 翻译找到种子数量
    var torrentinfo = document.getElementById("torrentinfo");
    var torrentCount = torrentinfo.children[0].children[1];
    var count = torrentCount.innerText.replace("torrent was found for this gallery.", "").replace("torrents were found for this gallery.", "");
    torrentCount.innerText = `本作品共有 ${count} 个种子。`

    // 逐个翻译种子模块说明
    var torrentForms = torrentinfo.children[0].querySelectorAll("form");
    for (const i in torrentForms) {
        if (Object.hasOwnProperty.call(torrentForms, i)) {
            const forms = torrentForms[i];
            var table = forms.children[0].children[1];
            var trs = table.querySelectorAll("tr");
            trs[0].children[0].children[0].innerText = "上传于：";
            trs[0].children[1].children[0].innerText = "文件大小：";
            trs[0].children[3].children[0].innerText = "做种：";
            trs[0].children[4].children[0].innerText = "下载：";
            trs[0].children[5].children[0].innerText = "完成：";
            trs[1].children[0].children[0].innerText = "上传者：";
            trs[1].children[1].children[0].value = "详细信息";
        }
    }

    // 翻译底部
    var bottomDiv = torrentinfo.children[1].children[0];
    bottomDiv.children[0].innerText = "新种子：";
    bottomDiv.children[0].nextSibling.textContent = "你可以在这里为本作品上传种子，种子文件最大大小为 10 MB";
    bottomDiv.children[1].nextSibling.textContent = "如果你自己创建种子，请将其设置为 AnnounceTracker：";
    bottomDiv.children[3].nextSibling.textContent = "请注意，你必须在上传后从该站点下载私有种子，以便记录统计信息。";

    // 关闭窗口
    closeWindow();
}

function closeWindow() {
    var closeWindowLink = document.getElementsByClassName("stuffbox")[0].children[1].children[0];
    closeWindowLink.innerText = "关闭窗口";
}

//#endregion

//#region step5.3.datasync.common.translateTitle.js 热门页数据同步

function DataSyncCommonTranslateTitle() {
    // 谷歌机翻：标题
    window.onstorage = function (e) {
        try {
            switch (e.newValue) {
                case sync_googleTranslate_frontPage_title:
                    updateGoogleTranslateFrontPageTitle();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    // 热门谷歌翻译标题
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
}

//#endregion

//#region 7.1.popularPage.js 热门

function popularPage() {

    // 跨域
    crossDomain();

    // 新版分页
    TranslateNewPagingLinks();

    // 头部标题改成中文
    var ihTitle = document.getElementsByClassName("ih");
    if (ihTitle.length > 0) {
        ihTitle[0].innerText = "近期热门作品";
    }

    var toppane = document.getElementById("toppane");
    toppane.classList.add("t_popular_toppane"); // 添加样式避免干扰其他页面

    // 标题机翻
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
    translateDiv.style.zIndex = 9999;

    translateDiv.appendChild(translateLabel);
    translateCheckbox.addEventListener("click", translateMainPageTitle);
    toppane.insertBefore(translateDiv, toppane.lastChild);

    // 按钮位置调整
    translateDiv.style.marginTop = "0";

    // 头部添加词库升级提示
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    toppane.insertBefore(dataUpdateDiv, toppane.lastChild);


    // 翻译下拉折叠菜单
    var dms = document.getElementById("dms");
    dms.classList.add("t_popular_dms"); // 添加样式避免干扰其他页面
    dropDownlistTranslate();

    // 表头翻译
    tableHeadTranslate();

    // 作品类型翻译
    bookTypeTranslate();

    // 作品篇幅
    tableBookPages();

    indexDbInit(() => {
        // 谷歌机翻标题
        read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateMainPageTitleDisplay();
            }
        }, () => { });

        // 检查是否存在旧数据，如果存在优先使用旧数据，然后检查更新
        // 表格标签翻译
        otherPageTryUseOldDataAndTranslateTag();
    });

    // 同步谷歌机翻标题
    DataSyncCommonTranslateTitle();



}

function otherPageTryUseOldDataAndTranslateTag() {
    // 验证数据完整性
    checkDataIntact(() => {
        // 判断是否存在旧数据
        var fetishHasValue = false;
        var ehTagHasValue = false;
        var complete1 = false;
        var complete2 = false;

        checkTableEmpty(table_fetishListSubItems, () => {
            // 数据为空
            complete1 = true;
        }, () => {
            // 存在数据
            fetishHasValue = true;
            complete1 = true;
        });

        checkTableEmpty(table_EhTagSubItems, () => {
            // 数据为空
            complete2 = true;
        }, () => {
            // 存在数据
            ehTagHasValue = true;
            complete2 = true;
        });

        var t = setInterval(() => {
            if ((complete1 && fetishHasValue) || (complete2 && ehTagHasValue)) {
                t && clearInterval(t);
                // 存在数据
                tableTagTranslate();
                // 检查更新
                checkUpdateData(() => {
                    // 存在更新
                    tableTagTranslate();
                }, () => { });
            } else if (complete1 && complete2) {
                t && clearInterval(t);
                // 不存在数据
                checkUpdateData(() => {
                    // 存在更新
                    tableTagTranslate();
                }, () => {
                    tableTagTranslate();
                });
            }
        }, 10);
    });
}


//#endregion

//#region step7.2.favoritePage.js 收藏列表

function favoritePage() {

    // 跨域
    crossDomain();

    // 新版分页
    TranslateNewPagingLinks();

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


    // 输入候选
    var inputRecommendDiv = document.createElement("div");
    inputRecommendDiv.id = "category_user_input_recommend";
    var searchForm = document.getElementsByTagName("form")[0];
    searchForm.insertBefore(inputRecommendDiv, searchForm.lastChild);

    // 搜索框、搜索按钮、搜索选项翻译
    var searchInput = searchInputDiv.children[0];
    searchInput.setAttribute("placeholder", "搜索关键字");
    searchInput.oninput = function () {
        var inputValue = trimStartEnd(searchInput.value.toLowerCase());
        favoriteUserInputOnInputEvent(inputValue, inputRecommendDiv, searchInput);
    }

    var searchBtn = searchInputDiv.children[1];
    searchBtn.value = " 搜索收藏 ";

    var clearBtn = searchInputDiv.children[2];
    clearBtn.value = " 清空 ";

    // 展示总数量
    var ip = document.getElementsByClassName("ip");
    if (ip.length > 0) {
        var ipElement = ip[0];
        var totalCount = ipElement.innerText.replace("Showing ", "").replace(" results", "");
        ipElement.innerText = `共 ${totalCount} 条记录`;
    }

    // 头部添加词库升级提示
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    ido[0].insertBefore(dataUpdateDiv, ido[0].lastChild);

    // 预览下拉框
    var dms = document.getElementById("dms");
    if (!dms) {

        // 隐藏排序和底部操作框
        var orderDiv = ido[0].children[2].children[0];
        if (!orderDiv) return;
        orderDiv.style.display = "none";
        var nullBottomDiv = ido[0].children[3].children[1];
        nullBottomDiv.style.display = "none";

        // 没有搜索到记录
        var nullInfo = ido[0].children[3].children[0];
        if (nullInfo) {
            translatePageElement(nullInfo);
        }

        indexDbInit(() => {
            // 没搜索到也要保留搜索候选功能
            otherPageTryUseOldDataAndTranslateTag();
        });

        return;
    }

    // 翻译下拉菜单
    dropDownlistTranslate();

    // 底部删除选中、移动作品下拉框，确认按钮
    var favsel = document.getElementById("favsel");
    var options = favsel.querySelectorAll("option");
    if (options.length > 0) {
        if (options[0].innerText == "Delete Selected") {
            options[0].innerText = "删除选中的作品";
        }
    }

    var optgroup = favsel.children[1];
    if (optgroup.getAttribute("label") == "Change Category") {
        optgroup.setAttribute("label", "作品迁移到以下收藏夹");
    }


    var bottomConfirmBtn = ido[0].children[6].children[6].children[0].children[1].children[0];
    if (bottomConfirmBtn.value == "Confirm") {
        bottomConfirmBtn.value = "确 认";
        bottomConfirmBtn.style.width = "60px";
    }

    // 排序名称
    var favorite_orderDiv = dms.children[0];
    favorite_orderDiv.childNodes[0].nodeValue = "作品排序：";

    var selects = dms.querySelectorAll("select");

    // 排序方式
    var order_select = selects[0];
    if (order_select.length > 0) {
        var selectElement = order_select;
        var options = selectElement.options;
        for (const i in options) {
            if (Object.hasOwnProperty.call(options, i)) {
                const option = options[i];
                switch (option.innerText) {
                    case "Favorited Time":
                        option.innerText = "收藏时间";
                        break;
                    case "Published Time":
                        option.innerText = "发布时间";
                        break;
                }
            }
        }
    }

    // 页面视图
    var pageShow_select = selects[1];
    if (pageShow_select.length > 0) {
        var selectElement = pageShow_select;
        var options = selectElement.options;
        for (const i in options) {
            if (Object.hasOwnProperty.call(options, i)) {
                const option = options[i];
                option.innerText = dropData[option.innerText] ?? option.innerText;
            }
        }
    }


    // 作品类型翻译
    bookTypeTranslate();

    // 表头翻译
    tableHeadTranslate();

    // 表格页数翻译
    favoritePageTableBookPages();




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

    var favForm = document.getElementsByTagName("form")[1];
    favForm.insertBefore(translateDiv, favForm.firstChild);

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

    // 同步谷歌机翻标题
    DataSyncCommonTranslateTitle();
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
    inputRecommendDiv.style.display = "none";
    var tempDiv = document.createElement("div");
    inputRecommendDiv.appendChild(tempDiv);

    if (inputValue == "") {
        return;
    }

    // 根据空格分隔，取最后一个
    var inputArray = inputValue.split(" ");
    var oldInputArray = inputArray.slice(0, inputArray.length - 1);
    var oldInputValue = oldInputArray.join(" ");
    if (oldInputValue != "") {
        oldInputValue += " ";
    }
    var searchValue = inputArray[inputArray.length - 1];

    if (searchValue == "") {
        inputRecommendDiv.style.display = "none";
        return;
    }

    // 添加搜索候选
    function addInputSearchItems(foundArrays) {
        if (foundArrays.length > 0) {
            inputRecommendDiv.style.display = "block";
        }
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
                    var addNewItem = item.parent_en == "userCustom" ? `"${item.sub_en}"` : `"${item.parent_en}:${item.sub_en}" `;
                    searchInput.value = `${oldInputValue}${addNewItem}`;
                    searchInput.focus();
                    inputRecommendDiv.innerHTML = "";
                    inputRecommendDiv.style.display = "none";
                });
                tempDiv.appendChild(commendDiv);
            }
        }

        if (tempDiv.innerHTML == "") {
            inputRecommendDiv.style.display = "none";
        }
    }

    // 从EhTag中模糊搜索，绑定数据
    readByCursorIndexFuzzy(table_EhTagSubItems, table_EhTagSubItems_index_searchKey, searchValue, foundArrays => {
        addInputSearchItems(foundArrays);
    });

    // 从收藏中的用户自定义中模糊搜索，绑定数据
    readByCursorIndex(table_favoriteSubItems, table_favoriteSubItems_index_parentEn, "userCustom", customArray => {
        if (customArray.length > 0) {
            var foundArrays = [];
            for (const i in customArray) {
                if (Object.hasOwnProperty.call(customArray, i)) {
                    const item = customArray[i];
                    var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en.toLowerCase()}`;
                    if (searchKey.indexOf(searchValue) != -1) {
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
                    var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en.toLowerCase()}`;
                    if (searchKey.indexOf(searchValue) != -1) {
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

//#region 7.3.watchedPage.js 偏好

// 与首页功能一同实现

//#endregion

//#region step7.4.1.torrentsPage.js 种子
function torrentsPage() {

    // 跨域
    crossDomain();

    // 标题添加类 t_torrentsPage_ido，方便添加样式
    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        ido[0].classList.add("t_torrentsPage_ido");
    }

    // 标题直接删除
    var h1 = document.getElementsByTagName("h1");
    if (h1.length > 0) {
        var pageTitle = h1[0];
        pageTitle.parentNode.removeChild(pageTitle);
    }

    // 删除 br 换行
    var brs = ido[0].querySelectorAll("br");
    if (brs.length > 0) {
        brs[0].parentNode.removeChild(brs[0]);
    }

    // 搜索框翻译，搜索按钮翻译，筛选过滤翻译
    var searchInput = document.getElementById("focusme");
    searchInput.setAttribute("placeholder", "搜索关键字");

    var searchForm = document.getElementById("torrentform");
    var searchBtn = searchForm.children[4];
    searchBtn.value = " 搜索种子 ";
    var clearBtn = searchForm.children[5];
    clearBtn.value = " 清空 ";

    var formP = searchForm.querySelectorAll("p")[0];
    formP.firstChild.textContent = "状态：";
    formP.children[0].textContent = "全部";
    formP.children[1].textContent = "有种";
    formP.children[2].textContent = "无种";
    formP.children[2].nextSibling.textContent = "\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 显示：";
    formP.children[3].textContent = "全部种子";
    formP.children[4].textContent = "仅显示我的种子";


    var idoP = ido[0].querySelectorAll("p");

    // 翻译底部说明
    var lastP = idoP[idoP.length - 1];
    translatePageElement(lastP);

    // 翻译显示数量（包括没有数量）
    var countP = idoP[idoP.length - 2];
    if (!countP.classList.contains("ip")) {
        // 没有数量
        translatePageElement(countP);
        return;
    }

    countP.innerText = `${countP.innerText.replace("Showing", "展示").replace("-", " - ").replace("of", "共计")} 条记录`;

    // 表头翻译
    torrentsTableHeadTranslate();

    // 为表格中标题添加 glink，用于翻译
    torrentsTableTitleGlink();

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
    ido[0].insertBefore(translateDiv, ido[0].lastChild);

    indexDbInit(() => {
        // 读取是否选中
        read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateMainPageTitleDisplay();
            }
        }, () => { });
    });

    // 同步谷歌机翻标题
    DataSyncCommonTranslateTitle();

}

function torrentsTableHeadTranslate() {
    var table = document.getElementsByClassName("itg");
    if (table.length > 0) {
        var theads = table[0].querySelectorAll("th");
        var addTime = theads[0].children[0];
        addTime.innerText = thData[addTime.innerText] ?? addTime.innerText;
        for (let i = 1; i < theads.length; i++) {
            const th = theads[i];
            th.innerText = thData[th.innerText] ?? th.innerText;
        }
    }
}

function torrentsTableTitleGlink() {
    var table = document.getElementsByClassName("itg");
    if (table.length > 0) {
        var trs = table[0].querySelectorAll("tr");
        for (let i = 1; i < trs.length; i++) {
            const tr = trs[i];
            tr.children[1].children[0].children[0].classList.add("glink");
        }
    }
}

//#endregion

//#region 7.4.2.torrentsDetailPages.js 种子详情页

function torrentsDetailPages() {

    // 判断是哪个页面
    var forms = document.getElementsByTagName("form");
    var inputs = forms[forms.length - 1].querySelectorAll("input");
    var submitBtn = inputs[inputs.length - 1];
    if (submitBtn.value == "Back to Index") {
        // 详情页
        submitBtn.value = "返回";
        torrentsDetailInfo();

    } else if (submitBtn.value == "Upload Torrent") {
        // 首页
        submitBtn.value = "上传种子";
        torrentsDetailIndex();
    }
}

function torrentsDetailInfo() {
    // 跨域
    crossDomain();

    // 添加类 torrents_detail_info，方便添加样式
    var torrentinfo = document.getElementById("torrentinfo");
    torrentinfo.classList.add("torrents_detail_info");

    // 表格统计数据翻译
    var ett = document.getElementById("ett");
    var trs = ett.querySelectorAll("tr");
    trs[0].children[0].innerText = "发布时间";
    trs[0].children[2].innerText = "做种";
    trs[1].children[0].innerText = "上传者";
    trs[1].children[2].innerText = "下载";
    trs[2].children[0].innerText = "文件大小";
    trs[2].children[2].innerText = "完成";

    // 种子下载翻译
    var torrentTable = document.getElementsByTagName("table")[1];
    var tr2s = torrentTable.querySelectorAll("tr");
    var alinkPersonal = tr2s[0].children[0].children[0];
    alinkPersonal.innerText = "种子下载 - 私人";
    tr2s[0].children[1].innerText = "（ 只属于你 - 确保记录你的下载统计信息 ）";
    var alinkOpen = tr2s[1].children[0].children[0];
    alinkOpen.innerText = "种子下载 - 可二次分发";
    tr2s[1].children[1].innerText = "（ 如果您想再发布或提供给其他人使用 ）";

    // 上传者留言，谷歌机翻
    var etd = document.getElementById("etd");
    var commandP = document.createElement("p");
    commandP.id = "commandP";
    commandP.innerText = etd.innerText;
    etd.innerText = "";
    etd.appendChild(commandP);

    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    translateCheckbox.addEventListener("click", torrentsDetailInfoCommand);
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻";
    translateDiv.appendChild(translateLabel);
    translateDiv.appendChild(translateCheckbox);

    etd.appendChild(translateDiv);

    // 获取设置
    indexDbInit(() => {
        // 读取是否选中
        read(table_Settings, table_Settings_key_TranslateTorrentDetailInfoCommand, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateTorrentDetailInfoCommandDisplay();
            }
        }, () => { });
    });

    // 同步谷歌机翻留言
    DataSyncTranslateTorrentDetailInfoCommand();

    // 投票删除
    var expungeform = document.getElementById("expungeform");
    var deleteLink = expungeform.children[0].children[2];
    deleteLink.innerText = "投票删除";
    deleteLink.onclick = function () {
        var deleteText = "你确定要投票删除这个种子吗？此操作无法撤消。";
        if (confirm(deleteText)) {
            expungeform.submit();
        }
    }

    // 关闭窗口
    closeWindow();

    document.getElementsByClassName("stuffbox")[0].lastChild.style.marginTop = "0";
}

function torrentsDetailInfoCommand() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateTorrentDetailInfoCommand = {
        item: table_Settings_key_TranslateTorrentDetailInfoCommand,
        value: isChecked
    };
    update(table_Settings, settings_translateTorrentDetailInfoCommand, () => {
        // 通知通知，翻译标题
        setDbSyncMessage(sync_googleTranslate_torrentDetailInfo_command);
        translateTorrentDetailInfoCommandDisplay();
    }, () => { });
}

function translateTorrentDetailInfoCommandDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    var commandP = document.getElementById("commandP");
    if (isChecked) {
        // 翻译留言
        if (commandP.dataset.translate) {
            // 已经翻译过
            commandP.innerText = commandP.dataset.translate;
        } else {
            // 需要翻译
            commandP.title = commandP.innerText;
            translatePageElementFunc(commandP, true, () => {
                commandP.dataset.translate = commandP.innerText;
            });
        }
    } else {
        // 显示原文
        commandP.innerText = commandP.title;
    }
}

function DataSyncTranslateTorrentDetailInfoCommand() {
    // 谷歌机翻：标题
    window.onstorage = function (e) {
        try {
            switch (e.newValue) {
                case sync_googleTranslate_torrentDetailInfo_command:
                    updateGoogleTorrentDetailInfoCommand();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    // 谷歌翻译留言
    function updateGoogleTorrentDetailInfoCommand() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_TranslateTorrentDetailInfoCommand, result => {
                var translateCheckbox = document.getElementById("googleTranslateCheckbox");
                translateCheckbox.checked = result && result.value;
                translateTorrentDetailInfoCommandDisplay();
                removeDbSyncMessage();

            }, () => { removeDbSyncMessage(); });
        })
    }
}


function torrentsDetailIndex() {
    // 添加类 torrents_detail_index，方便添加样式
    var torrentinfo = document.getElementById("torrentinfo");
    torrentinfo.classList.add("torrents_detail_index");

    // 翻译找到种子数量
    var torrentinfo = document.getElementById("torrentinfo");
    var torrentCount = torrentinfo.children[0].children[1];
    var count = torrentCount.innerText.replace("torrent was found for this gallery.", "").replace("torrents were found for this gallery.", "");
    torrentCount.innerText = `本作品共有 ${count} 个种子。`

    // 逐个翻译种子模块说明
    var torrentForms = torrentinfo.children[0].querySelectorAll("form");
    for (const i in torrentForms) {
        if (Object.hasOwnProperty.call(torrentForms, i)) {
            const forms = torrentForms[i];
            var table = forms.children[0].children[1];
            var trs = table.querySelectorAll("tr");
            trs[0].children[0].children[0].innerText = "上传于：";
            trs[0].children[1].children[0].innerText = "文件大小：";
            trs[0].children[3].children[0].innerText = "做种：";
            trs[0].children[4].children[0].innerText = "下载：";
            trs[0].children[5].children[0].innerText = "完成：";
            trs[1].children[0].children[0].innerText = "上传者：";
            trs[1].children[1].children[0].value = "详细信息";
        }
    }

    // 翻译底部
    var bottomDiv = torrentinfo.children[1].children[0];
    bottomDiv.children[0].innerText = "新种子：";
    bottomDiv.children[0].nextSibling.textContent = "你可以在这里为本作品上传种子，种子文件最大大小为 10 MB";
    bottomDiv.children[1].nextSibling.textContent = "如果你自己创建种子，请将其设置为 AnnounceTracker：";
    bottomDiv.children[3].nextSibling.textContent = "请注意，你必须在上传后从该站点下载私有种子，以便记录统计信息。";

    // 关闭窗口
    closeWindow();
}

function closeWindow() {
    var closeWindowLink = document.getElementsByClassName("stuffbox")[0].children[1].children[0];
    closeWindowLink.innerText = "关闭窗口";
}

//#endregion

//#region step7.5.toplistPage.js 排行榜

function toplistPage() {

    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        var parentDiv = ido[0];

        // 添加样式防止覆盖
        parentDiv.classList.add("t_toplist_ido");

        // 头部面包屑导航翻译
        var headLinks = parentDiv.firstElementChild.querySelectorAll("a");
        for (const i in headLinks) {
            if (Object.hasOwnProperty.call(headLinks, i)) {
                const link = headLinks[i];
                link.innerText = toplie_subtitle_dict[link.innerText];
            }
        }

        // 排行页 或 作品/上传者排名页
        var dcDiv = document.getElementsByClassName("dc");
        if (dcDiv.length > 0) {
            var dc = dcDiv[0];

            // 各项父级翻译
            var h2list = parentDiv.querySelectorAll("h2");
            for (const i in h2list) {
                if (Object.hasOwnProperty.call(h2list, i)) {
                    const h2 = h2list[i];
                    h2.innerText = toplist_parent_dict[h2.innerText];
                }
            }

            // 各项排行翻译
            var plist = parentDiv.querySelectorAll("p");
            for (const i in plist) {
                if (Object.hasOwnProperty.call(plist, i)) {
                    const p = plist[i];
                    if (p.innerText.indexOf("All-Time") != -1) {
                        p.lastChild.innerText = "总排行";
                    } else if (p.innerText.indexOf("Past Year") != -1) {
                        p.lastChild.innerText = "年排行";
                    } else if (p.innerText.indexOf("Past Month") != -1) {
                        p.lastChild.innerText = "月排行";
                    } else if (p.innerText.indexOf("Yesterday") != -1) {
                        p.lastChild.innerText = "日排行";
                    }
                }
            }

            // 删除全部分割线
            var hrlist = parentDiv.querySelectorAll("hr");
            for (const i in hrlist) {
                if (Object.hasOwnProperty.call(hrlist, i)) {
                    const hr = hrlist[i];
                    hr.parentNode.removeChild(hr);
                }
            }

            // 跨域
            crossDomain();

            // 作品标题翻译
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
            translateCheckbox.addEventListener("click", translateToplistPageTitle);
            var h2 = dc.firstElementChild;
            h2.appendChild(translateDiv);

            indexDbInit(() => {
                read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
                    if (result && result.value) {
                        translateCheckbox.setAttribute("checked", true);
                        translateToplistTitleDisplay();
                    }
                }, () => { });
            });

        } else {

            // 点击页面链接跳转
            // 1. 跳转到页面详情不管，detail.js 实现功能
            // 2. 跳转到上传页面不管，upload.js 实现功能
            // 3. 跳转到上传者排行页面，需要翻译
            // 4. 跳转到作品排行页面，需要翻译

            var search = window.location.search;
            if (search.indexOf("?tl=") != -1) {
                var pageNo = search.replace("?tl=", "");
                var bookRateArrayNo = ["11", "12", "13", "15"];
                if (bookRateArrayNo.indexOf(pageNo) != -1) {
                    // 作品排行页面
                    toplistBookRank();
                } else {
                    // 上传者排行页面
                    toplistUploaderRank();
                }
            }
        }
    }





}

// 翻译排行榜作品名称
function translateToplistPageTitle() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateFrontPageTitles = {
        item: table_Settings_key_TranslateFrontPageTitles,
        value: isChecked
    };

    indexDbInit(() => {
        update(table_Settings, settings_translateFrontPageTitles, () => {
            // 通知通知，翻译标题
            setDbSyncMessage(sync_googleTranslate_frontPage_title);
            translateToplistTitleDisplay();
        }, () => { });
    })
}


function translateToplistTitleDisplay() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    var titleDivs = document.getElementsByClassName("dc")[0].querySelectorAll("div.tun");
    if (isChecked) {
        // 翻译标题
        for (const i in titleDivs) {
            if (Object.hasOwnProperty.call(titleDivs, i)) {
                const a = titleDivs[i].firstElementChild;
                if (a.dataset.translate) {
                    // 已经翻译过
                    a.innerText = a.dataset.translate;

                } else {
                    // 需要翻译
                    a.title = a.innerText;

                    // 单条翻译
                    translatePageElementFunc(a, true, () => {
                        a.dataset.translate = a.innerText;
                    });
                }
            }
        }

    } else {
        // 显示原文
        for (const i in titleDivs) {
            if (Object.hasOwnProperty.call(titleDivs, i)) {
                const a = titleDivs[i].firstElementChild;
                if (a.title) {
                    a.innerText = a.title;
                }
            }
        }
    }
}



// 上传者排行页面
function toplistUploaderRank() {
    var itg = document.getElementsByClassName("itg");
    if (itg.length > 0) {
        var rankTable = itg[0];
        var tableThs = rankTable.querySelectorAll("th");
        for (const i in tableThs) {
            if (Object.hasOwnProperty.call(tableThs, i)) {
                const th = tableThs[i];
                if (th.classList.contains("hr")) {
                    th.innerText = "排名";
                } else if (th.classList.contains("hs")) {
                    th.innerText = "分数";
                } else if (th.classList.contains("hn")) {
                    th.innerText = "上传者";
                }
            }
        }
    }
}

// 作品排行页面
function toplistBookRank() {
    // 跨域
    crossDomain();

    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        var toppane = ido[0];
        toppane.classList.add("t_toplist_bookrage");

        // 标题机翻
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
        toppane.insertBefore(translateDiv, toppane.lastChild);

        // 头部添加词库升级提示
        var dataUpdateDiv = document.createElement("div");
        dataUpdateDiv.id = "data_update_tip";
        var dataUpdateText = document.createTextNode("词库升级中...");
        dataUpdateDiv.appendChild(dataUpdateText);
        toppane.insertBefore(dataUpdateDiv, toppane.lastChild);

        // 表头翻译
        toplistBookRateTableHeadTranslate();

        // 作品类型翻译
        bookTypeTranslate();

        // 作品篇幅
        toplistBookpages();

        indexDbInit(() => {
            // 谷歌机翻标题
            read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
                if (result && result.value) {
                    translateCheckbox.setAttribute("checked", true);
                    translateMainPageTitleDisplay();
                }
            }, () => { });

            // 检查是否存在旧数据，如果存在优先使用旧数据，然后检查更新
            // 表格标签翻译
            toplistBookRateTryUseOldData();
        });

        // 同步谷歌机翻标题
        DataSyncCommonTranslateTitle();
    }



}

// 作品排行页面，翻译表头
function toplistBookRateTableHeadTranslate() {
    var table = document.getElementsByClassName("itg");
    if (table.length > 0) {
        var theads = table[0].querySelectorAll("th");

        for (const i in theads) {
            if (Object.hasOwnProperty.call(theads, i)) {
                const th = theads[i];
                th.innerText = thData[th.innerText] ?? th.innerText;
            }
        }

        // 删除第一个表头的跨列属性，然后追加表头
        var firstTh = theads[0];
        firstTh.removeAttribute("colspan");
        firstTh.innerText = "排名";

        var bookTypeTh = document.createElement("th");
        bookTypeTh.innerText = "作品类型";
        firstTh.parentNode.insertBefore(bookTypeTh, firstTh.nextElementSibling);
    }
}

//  作品排行页面，获取词库数据
function toplistBookRateTryUseOldData() {
    // 验证数据完整性
    checkDataIntact(() => {
        // 判断是否存在旧数据
        var fetishHasValue = false;
        var ehTagHasValue = false;
        var complete1 = false;
        var complete2 = false;

        checkTableEmpty(table_fetishListSubItems, () => {
            // 数据为空
            complete1 = true;
        }, () => {
            // 存在数据
            fetishHasValue = true;
            complete1 = true;
        });

        checkTableEmpty(table_EhTagSubItems, () => {
            // 数据为空
            complete2 = true;
        }, () => {
            // 存在数据
            ehTagHasValue = true;
            complete2 = true;
        });

        var t = setInterval(() => {
            if ((complete1 && fetishHasValue) || (complete2 && ehTagHasValue)) {
                t && clearInterval(t);
                // 存在数据
                toplistTableTagTranslate();
                // 检查更新
                checkUpdateData(() => {
                    // 存在更新
                    toplistTableTagTranslate();
                }, () => { });
            } else if (complete1 && complete2) {
                t && clearInterval(t);
                // 不存在数据
                checkUpdateData(() => {
                    // 存在更新
                    toplistTableTagTranslate();
                }, () => {
                    toplistTableTagTranslate();
                });
            }
        }, 10);
    });
}

// 表格标签翻译
function toplistTableTagTranslate() {
    // 父项:子项，偶尔出现单个子项
    var gt = document.getElementsByClassName("gt");
    function translate(gt, i) {
        const item = gt[i];
        if (!item.dataset.title) {
            item.dataset.title = item.title;
        }
        var ps_en = item.dataset.title;
        read(table_EhTagSubItems, ps_en, result => {
            if (result) {
                // 父子项
                item.innerText = `${result.parent_zh}:${result.sub_zh}`;
                if (result.sub_desc) {
                    item.title = `${item.title}\r\n${result.sub_desc}`;
                }
            } else {
                // 没有找到，翻译父项，子项保留
                var array = ps_en.split(":");
                if (array.length == 2) {
                    var parent_en = array[0];
                    var sub_en = array[1];
                    read(table_detailParentItems, parent_en, result => {
                        if (result) {
                            item.innerText = `${result.name}:${sub_en}`;
                            if (result.sub_desc) {
                                item.title = `${item.title}\r\n${result.sub_desc}`;
                            }
                        }
                    }, () => { });
                }
            }
        }, () => { });
    }
    for (const i in gt) {
        if (Object.hasOwnProperty.call(gt, i)) {
            translate(gt, i);
        }
    }
}

// 作品篇幅
function toplistBookpages() {
    // 标题 + 悬浮图 + 标签
    var tdPages = document.getElementsByClassName("glhide");
    for (const i in tdPages) {
        if (Object.hasOwnProperty.call(tdPages, i)) {
            const td = tdPages[i];
            innerTextPageToYe(td.lastChild);
        }
    }
}

//#endregion

//#region step7.6.myHomePage.js 我的主页 - 总览

function myHomePage() {
    // 跨域
    crossDomain();

    // 添加样式防止覆盖


    // 图片限制

    // 种子服务器

    // 获取GP

    // 排行榜

    // 原力

}

//#endregion

//#region step7.7.newsPage.js

var newsPageTranslateIsReady = false; // 翻译前是否准备完毕

function newsPage() {
    // 跨域
    crossDomain();

    // 添加样式方便调整页面样式
    var newsouter = document.getElementById("newsouter");
    newsouter.classList.add("t_newspage_souter");

    var nb = document.getElementById("nb");

    // 头部图片隐藏折叠按钮
    var baredge = document.getElementsByClassName("baredge")[0];
    var bartop = document.getElementsByClassName("bartop")[0];
    var botm = document.getElementById("botm");
    var botmHeight = botm.clientHeight;

    var imgHiddenBtn = document.createElement("div");
    imgHiddenBtn.style.display = "none";
    imgHiddenBtn.id = "imgHiddenBtn";
    imgHiddenBtn.innerText = "头部图片隐藏";
    nb.parentNode.insertBefore(imgHiddenBtn, nb.nextElementSibling);
    imgHiddenBtn.onclick = function () {
        var visible = imgHiddenBtn.innerText == "头部图片显示";
        // 显示和隐藏
        newsPageTopImageDisplay(visible);
        // 更改设置并更新
        setNewsPageTopImageVisisble(visible);
    };

    function newsPageTopImageDisplay(visible) {
        // 改为动画效果
        var imgHiddenBtn = document.getElementById("imgHiddenBtn");
        if (visible) {
            if (imgHiddenBtn.innerText == "头部图片显示") {
                // 需要显示
                slideDown(botm, botmHeight, 10, function () {
                    baredge.classList.remove("hiddenTopImgBorder");
                    bartop.classList.remove("hiddenTopImgBorder");
                    imgHiddenBtn.innerText = "头部图片隐藏";
                });
            }
        } else {
            if (imgHiddenBtn.innerText == "头部图片隐藏") {
                // 需要隐藏
                slideUp(botm, 10, function () {
                    baredge.classList.add("hiddenTopImgBorder");
                    bartop.classList.add("hiddenTopImgBorder");
                    imgHiddenBtn.innerText = "头部图片显示";
                });
            }
        }
    }

    function setNewsPageTopImageVisisble(visible) {
        indexDbInit(() => {
            // 保存存储信息
            var setting_newsPageTopImageVisible = {
                item: table_Settings_key_NewsPageTopImageVisible,
                value: visible
            }
            update(table_Settings, setting_newsPageTopImageVisible, () => {
                // 通知头部图片隐藏显示
                setDbSyncMessage(sync_newsPage_topImage_visible);
            }, () => { });
        });
    }


    // 谷歌机翻
    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    translateDiv.style.display = "none";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻 : 新闻";

    translateDiv.appendChild(translateLabel);
    translateDiv.appendChild(translateCheckbox);

    translateCheckbox.addEventListener("click", newsPageNewsTranslate);
    nb.parentNode.insertBefore(translateDiv, nb);

    indexDbInit(() => {
        // 读取并设置头部图片是否隐藏
        read(table_Settings, table_Settings_key_NewsPageTopImageVisible, result => {
            // 按钮显示出来
            imgHiddenBtn.style.display = "block";
            newsPageTopImageDisplay(result && result.value);
        }, () => {
            imgHiddenBtn.style.display = "block";
        });

        // 读取新闻页面翻译
        read(table_Settings, table_Settings_key_NewsPageTranslate, result => {
            translateDiv.style.display = "block";
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                newsPageNewsTranslateDisplay();
            }
        }, () => {
            translateDiv.style.display = "block";
        });
    });

    // 新闻分栏，隐藏折叠按钮
    var nd = document.getElementsByClassName("nd");
    var h2s = nd[0].querySelectorAll("h2");
    var newstitles = document.getElementsByClassName("newstitle");

    for (const i in h2s) {
        if (Object.hasOwnProperty.call(h2s, i)) {
            const h2 = h2s[i];
            var div = document.createElement("div");
            div.classList.add("title_extend");
            div.innerText = "-";
            h2.appendChild(div);
        }
    }

    for (const i in newstitles) {
        if (Object.hasOwnProperty.call(newstitles, i)) {
            const newstitle = newstitles[i];
            var div = document.createElement("div");
            div.classList.add("title_extend");
            div.innerText = "-";
            newstitle.appendChild(div);
        }
    }

    // 为每个折叠按钮添加事件
    var titleExpends = document.getElementsByClassName("title_extend");
    for (const i in titleExpends) {
        if (Object.hasOwnProperty.call(titleExpends, i)) {
            const titleExpend = titleExpends[i];
            titleExpend.onclick = function () {
                var parentChildNodes = titleExpend.parentNode.parentNode.children;
                if (titleExpend.innerText == "-") {
                    // 折叠
                    for (const k in parentChildNodes) {
                        if (Object.hasOwnProperty.call(parentChildNodes, k)) {
                            const childNode = parentChildNodes[k];
                            if (childNode.nodeName == "H2") continue;
                            if (childNode.classList.contains("newstitle")) continue;
                            childNode.style.display = "none";
                        }
                    }
                    titleExpend.innerText = "+";
                } else {
                    // 展开
                    for (const k in parentChildNodes) {
                        if (Object.hasOwnProperty.call(parentChildNodes, k)) {
                            const childNode = parentChildNodes[k];
                            if (childNode.nodeName == "H2") continue;
                            if (childNode.classList.contains("newstitle")) continue;
                            childNode.style.display = "block";
                        }
                    }
                    titleExpend.innerText = "-";
                }
            }
        }
    }

    // 数据同步
    window.onstorage = function (e) {
        try {
            switch (e.newValue) {
                case sync_newsPage_topImage_visible:
                    newsPageSyncTopImageVisible();
                    break;
                case sync_googleTranslate_newsPage_news:
                    newsPageSyncTranslate();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    function newsPageSyncTopImageVisible() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_NewsPageTopImageVisible, result => {
                newsPageTopImageDisplay(result && result.value);
            }, () => { });
        });
    }

    function newsPageSyncTranslate() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_NewsPageTranslate, result => {
                translateCheckbox.checked = result && result.value;
                newsPageNewsTranslateDisplay();
            }, () => { });
        });
    }
}



function newsPageNewsTranslate() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_newsPageTranslate = {
        item: table_Settings_key_NewsPageTranslate,
        value: isChecked
    };
    update(table_Settings, settings_newsPageTranslate, () => {
        // 通知，翻译新闻内容
        setDbSyncMessage(sync_googleTranslate_newsPage_news);
        newsPageNewsTranslateDisplay();
    }, () => { });
}

function newsPageNewsTranslateDisplay() {
    // 准备
    if (!newsPageTranslateIsReady) {
        newsPageTranslatePrepare();
    }

    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    newsPageTranslateNewsTitle(isChecked);
    newsPageTranslateSiteStatus(isChecked);
    newsPageSiteUpdateLog(isChecked);
    newsPagesTranslateRightNews(isChecked);
}

// 翻译之前的准备工作
function newsPageTranslatePrepare() {

    // 翻译前整理：网站更新日志
    var nwo = document.getElementsByClassName("nwo")[1];
    var nwi = nwo.querySelectorAll("div.nwi")[0];
    var nwiChildNodes = nwi.childNodes;
    for (const i in nwiChildNodes) {
        if (Object.hasOwnProperty.call(nwiChildNodes, i)) {
            const childNode = nwiChildNodes[i];
            if (childNode.nodeName == "#text") {
                var span = document.createElement("span");
                span.innerText = childNode.data;
                span.classList.add("googleTranslate_02");
                nwi.insertBefore(span, childNode.nextElementSibling);
                childNode.parentNode.removeChild(childNode);
            } else if (childNode.innerText) {
                childNode.classList.add("googleTranslate_02");
            }
        }
    }

    var nwu = nwo.querySelectorAll("div.nwu")[0];
    var nwuFirstChild = nwu.firstChild;
    var nwuFirstSpan = document.createElement("span");
    nwuFirstSpan.innerText = nwuFirstChild.textContent;
    nwuFirstSpan.id = "googleTranslate_02_span";
    nwu.insertBefore(nwuFirstSpan, nwuFirstChild);
    nwuFirstChild.parentNode.removeChild(nwuFirstChild);

    // 翻译前整理：右侧新闻
    var newstables = document.getElementsByClassName("newstable");
    for (const i in newstables) {
        if (Object.hasOwnProperty.call(newstables, i)) {
            const newstable = newstables[i];

            var newsdate = newstable.children[1];
            if (newsdate.innerText) {
                newsdate.classList.add("googleTranslate_03");
            }

            var newstext = newstable.children[2];
            var newstextChildNodes = newstext.childNodes;
            for (const i in newstextChildNodes) {
                if (Object.hasOwnProperty.call(newstextChildNodes, i)) {
                    const childNode = newstextChildNodes[i];
                    if (childNode.nodeName == "#text") {
                        var span = document.createElement("span");
                        span.innerText = childNode.data;
                        span.classList.add("googleTranslate_03");
                        newstext.insertBefore(span, childNode.nextElementSibling);
                        childNode.parentNode.removeChild(childNode);
                    } else if (childNode.innerText) {
                        childNode.classList.add("googleTranslate_03");
                    }
                }
            }

            var newslink = newstable.children[3];
            if (newslink.children.length > 0) {
                var newslinkA = newslink.children[0];
                if (newslinkA.innerText) {
                    newslinkA.classList.add("googleTranslate_03");
                }
            }
        }
    }

    var rightLastDiv = document.getElementsByClassName("nwo")[2].lastChild;
    if (rightLastDiv.children.length > 0) {
        var a = rightLastDiv.children[0];
        if (a.innerText) {
            a.classList.add("googleTranslate_03");
        }
    }

    newsPageTranslateIsReady = true;
}

// 翻译：新闻标题
function newsPageTranslateNewsTitle(isChecked) {
    var nd = document.getElementsByClassName("nd");
    var h2s = nd[0].querySelectorAll("h2");
    var newstitles = document.getElementsByClassName("newstitle");
    if (isChecked) {
        for (const i in h2s) {
            if (Object.hasOwnProperty.call(h2s, i)) {
                const h2 = h2s[i];
                var a = h2.children[0];
                if (a.dataset.translate) {
                    a.innerText = a.dataset.translate;
                } else {
                    a.classList.add("googleTranslate_00");
                    a.title = a.innerText;
                    if (newPagesTitles[a.innerText]) {
                        a.innerText = newPagesTitles[a.innerText];
                    } else {
                        translatePageElementEN(a);
                    }
                }
            }
        }

        for (const i in newstitles) {
            if (Object.hasOwnProperty.call(newstitles, i)) {
                const newstitle = newstitles[i];
                var a = newstitle.children[0];
                if (a.dataset.translate) {
                    a.innerText = a.dataset.translate;
                } else {
                    a.classList.add("googleTranslate_00");
                    a.title = a.innerText;
                    if (newPagesTitles[a.innerText]) {
                        a.innerText = newPagesTitles[a.innerText];
                    } else {
                        translatePageElementEN(a);
                    }
                }
            }
        }
    } else {
        var googleTranslates = document.getElementsByClassName("googleTranslate_00");
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (!trans.dataset.translate) {
                    trans.dataset.translate = trans.innerText;
                }
                trans.innerText = trans.title;
            }
        }
    }

}

// 翻译：最新网站状态
function newsPageTranslateSiteStatus(isChecked) {
    var nwo = document.getElementsByClassName("nwo")[0];
    var nwis = nwo.querySelectorAll("div.nwi");
    var nwf = document.getElementsByClassName("nwf")[0];
    if (isChecked) {
        for (const i in nwis) {
            if (Object.hasOwnProperty.call(nwis, i)) {
                const nwi = nwis[i];
                var tds = nwi.querySelectorAll("td");
                for (const t in tds) {
                    if (Object.hasOwnProperty.call(tds, t)) {
                        const td = tds[t];
                        if (td.innerText) {
                            if (td.dataset.translate) {
                                td.innerText = td.dataset.translate;
                            } else {
                                td.classList.add("googleTranslate_01");
                                td.title = td.innerText;
                                translatePageElementEN(td);
                            }
                        }
                    }
                }
            }
        }
        var zh_html = `你可以在 <a href="https://twitter.com/ehentai">推特上关注我们</a> 以便在网站不可用时获取网站状态信息。 `;
        nwf.innerHTML = zh_html;
    } else {
        var googleTranslates = document.getElementsByClassName("googleTranslate_01");
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (!trans.dataset.translate) {
                    trans.dataset.translate = trans.innerText;
                }
                trans.innerText = trans.title;
            }
        }
        var en_html = `You can follow <a href="https://twitter.com/ehentai">follow us on Twitter</a> to receive these site status updates if the site is ever unavailable. `;
        nwf.innerHTML = en_html;
    }
}

// 翻译：网站更新日志
function newsPageSiteUpdateLog(isChecked) {
    newsPagesTranslateCommon("googleTranslate_02", isChecked);
    var nwuFirstSpan = document.getElementById("googleTranslate_02_span");
    if (isChecked) {
        if (nwuFirstSpan.innerText) {
            if (nwuFirstSpan.innerText.indexOf("Previous Years:") != -1) {
                nwuFirstSpan.title = nwuFirstSpan.innerText;
                nwuFirstSpan.innerText = "往年记录：";
            } else if (nwuFirstSpan.dataset.translate) {
                nwuFirstSpan.innerText = nwuFirstSpan.dataset.translate;
            } else {
                nwuFirstSpan.title = nwuFirstSpan.innerText;
                translatePageElementEN(nwuFirstSpan);
            }
        }
    } else {
        if (!nwuFirstSpan.dataset.translate) {
            nwuFirstSpan.dataset.translate = nwuFirstSpan.innerText;
        }
        nwuFirstSpan.innerText = nwuFirstSpan.title;
    }
}

// 翻译：右边新闻
function newsPagesTranslateRightNews(isChecked) {
    newsPagesTranslateCommon("googleTranslate_03", isChecked);
}


function newsPagesTranslateCommon(className, isChecked) {
    var googleTranslates = document.getElementsByClassName(className);
    if (isChecked) {
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (trans.innerText) {
                    if (trans.dataset.translate) {
                        trans.innerText = trans.dataset.translate;
                    } else {
                        trans.classList.add(className);
                        trans.title = trans.innerText;
                        translatePageElementEN(trans);
                    }
                }
            }
        }
    } else {
        for (const i in googleTranslates) {
            if (Object.hasOwnProperty.call(googleTranslates, i)) {
                const trans = googleTranslates[i];
                if (!trans.dataset.translate) {
                    trans.dataset.translate = trans.innerText;
                }
                trans.innerText = trans.title;
            }
        }
    }
}



//#endregion

//#region step7.8.uconfigPage.js 设置页面

function uconfigPage() {
    // 跨域
    crossDomain();

    // 添加样式方便调整页面样式
    var outer = document.getElementById("outer");
    outer.classList.add("t_uconfigPage_outer");

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

    // Show Filtered Removal Count  exhentai
    uconfigPageShowFilteredRemovalCount(settingH2s[10]);

    // Excluded Languages
    uconfigTagExcludedLanguages(settingH2s[11]);

    // Excluded Uploaders
    uconfigPageExcludedUploaders(settingH2s[12]);

    // Search Result Count
    uconfigPageSearchResultCount(settingH2s[13]);

    // Thumbnail Settings
    uconfigPageThumbnailSettings(settingH2s[14]);

    // Thumbnail Scaling
    uconfigPageThumbnailScaling(settingH2s[15]);

    // Viewport Override
    uconfigPageViewportOverride(settingH2s[16]);

    // Gallery Comments
    uconfigPageGalleryComments(settingH2s[17]);

    // Gallery Tags
    uconfigPageGalleryTags(settingH2s[18]);

    // Gallery Page Numbering
    uconfigPageGalleryPageNumbering(settingH2s[19]);

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

// 显示过滤删除数量
function uconfigPageShowFilteredRemovalCount(titleH2) {
    titleH2.innerText = "-- 显示过滤删除数量 --";
    var displayWayDiv = titleH2.nextElementSibling;
    var p = displayWayDiv.querySelector("p");
    p.innerText = "1. 是否显示 “ 您的默认过滤器从此页面中删除了 XX 个画廊 ” 数量?";
    var displayWayRadios = p.nextElementSibling.children;
    displayWayRadios[0].children[0].childNodes[2].data = "是";
    displayWayRadios[1].children[0].childNodes[2].data = "否";
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

//#region step7.9.tosPage.js 帮助页面

function tosPage() {
    // 跨域
    crossDomain();

    // 添加样式方便调整页面样式
    var stuffbox = document.querySelector("div.stuffbox");
    stuffbox.classList.add("t_tosPage_stuffbox");

    // 添加谷歌翻译按钮，翻译全文
    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    translateDiv.style.display = "none";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻";

    translateDiv.appendChild(translateCheckbox);
    translateDiv.appendChild(translateLabel);

    translateCheckbox.addEventListener("click", tosPageTranslate);
    stuffbox.insertBefore(translateDiv, stuffbox.children[0]);


    indexDbInit(() => {
        // 读取新闻页面翻译
        read(table_Settings, table_Settings_key_TosPageTranslate, result => {
            translateDiv.style.display = "block";
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                tosPageTranslateDisplay();
            }
            translateDiv.style.display = "block";
        }, () => {
            translateDiv.style.display = "block";
        });
    });

    // 数据同步
    window.onstorage = function (e) {
        try {
            switch (e.newValue) {
                case sync_googleTranslate_tosPage:
                    tosPageTranslateSync();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }
}

function tosPageTranslateSync() {
    indexDbInit(() => {
        read(table_Settings, table_Settings_key_TosPageTranslate, result => {
            var translateCheckbox = document.getElementById("googleTranslateCheckbox");
            translateCheckbox.checked = result && result.value;
            tosPageTranslateDisplay();
        }, () => { });
    });
}

function tosPageTranslate() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_tosPageTranslate = {
        item: table_Settings_key_TosPageTranslate,
        value: isChecked
    };
    update(table_Settings, settings_tosPageTranslate, () => {
        // 通知，翻译全文
        setDbSyncMessage(sync_googleTranslate_tosPage);
        tosPageTranslateDisplay();
    }, () => { });
}

function tosPageTranslateDisplay() {
    var stuffbox = document.querySelector("div.stuffbox");
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;
    if (isChecked) {
        recursionTosPageTranslate(stuffbox);
    } else {
        recursionTosPageOriginEn(stuffbox);
    }

}

function recursionTosPageTranslate(element) {
    if (element.id == "googleTranslateDiv") return;
    var elementChildNodes = element.childNodes;
    for (const i in elementChildNodes) {
        if (Object.hasOwnProperty.call(elementChildNodes, i)) {
            const child = elementChildNodes[i];
            if (child.nodeName == "#text" && child.data) {
                var trimData = trimEnd(child.data);
                if (trimData.replace(/[\r\n]/g, "") != "") {
                    var span = document.createElement("span");
                    span.innerText = trimData;
                    child.parentNode.insertBefore(span, child);
                }
                child.parentNode.removeChild(child);
            }
        }
    }

    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        if (child.children.length > 0) {
            recursionTosPageTranslate(child);
        } else if (child.dataset.translate_zh) {
            child.innerText = child.dataset.translate_zh;
        } else if (child.innerText) {
            child.title = child.innerText;
            // 谷歌机翻
            translatePageElementFunc(child, true, () => {
                child.dataset.translate_zh = child.innerText;
            });
        }
    }
}

function recursionTosPageOriginEn(element) {
    if (element.id == "googleTranslateDiv") return;
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        if (child.children.length > 0) {
            recursionTosPageOriginEn(child);
        } else if (child.title) {
            child.innerText = child.title;
        }
    }
}


//#endregion

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
    var foldHeight = 193;
    if (usertagsMassDiv) {
        foldHeight += 42;
    }
    usertagsOuterDiv.style.height = `calc(100vh - ${foldHeight}px)`;

    // 根据是否存在滚动条，来调整新增标签的位置
    mytagsAlignAll();

    // 浏览器窗口大小改变也需要调整大小
    window.onresize = function () {
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
        uploadingBtn.innerText = "↑ 上传到账号 ↑";
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
                                myTagUploadTagsIng(myTagCurrentIsWatchChecked, myTagCurrentIsHiddenChecked, myTagCurrentColor, myTagCurrentWeight, myTagCurrentTag, settings_myTagsUploadTags);
                            }
                            mytagPartTwo();
                        }, () => {
                            setMyTagsUploadingRemainderCount(remainderCount - 1);
                            myTagUploadingGetReady = true;
                            if (!myTagUploadingPause) {
                                myTagUploadTagsIng(myTagCurrentIsWatchChecked, myTagCurrentIsHiddenChecked, myTagCurrentColor, myTagCurrentWeight, myTagCurrentTag, settings_myTagsUploadTags);
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
        <div id="t_mytags_clodToFavorite_btn" title="账号的标签，同步到本地收藏列表">↓ 下载到收藏 ↓</div>
        <div id="t_mytags_submitCategories_btn" title="下方勾选的标签，同步添加到账号标签中">↑ 上传到账号 ↑</div>
    </div>
    <div id="t_mytags_bottom">       
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
            </div>
        </div>
    </div>
</div>
<div id="t_mytags_data_update_tip"></div>`;

    var outer = document.getElementById("outer");
    var div = document.createElement("div");
    div.innerHTML = mainHtml;
    outer.insertBefore(div, outer.children[0]);

    // ↑ 上传到账号 ↑ 弹框
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

    // ↑ 上传到账号 ↑ ING 弹框
    var uploadIngHtml = `<div id="upload_tag_ing_top">↑ 上传到账号 ↑</div>
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
    mytagsInitWindowsData(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);

    // 展开折叠功能
    extendBtn.onclick = function () {
        windowSlideUpDown(bottomDiv);
    }

    // 输入框
    searchInput.oninput = function () {
        searchOnInput(searchInput, bottomDiv, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
    }

    // 清空按钮
    clearBtn.onclick = function () {
        searchInput.value = "";
        searchOnInput(searchInput, bottomDiv, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox);
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
            switch (e.newValue) {
                case sync_mytagsFavoriteTagUpdate:
                    syncMytagsFavoriteTagUpdate();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
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

        var foldHeight = 193;
        if (usertagsMassDiv) {
            foldHeight += 42;
        }

        slideUp(bottomDiv, 10, () => {
            usertagsOuterDiv.style.height = `calc(100vh - ${foldHeight}px)`;
            mytagsAlignAll();
        });
    } else {
        bottomDiv.dataset.visible = 1;

        var expendHeight = 543;
        if (usertagsMassDiv) {
            expendHeight += 42;
        }

        usertagsOuterDiv.style.height = `calc(100vh - ${expendHeight}px)`;
        slideDown(bottomDiv, 350, 10, () => {
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
function mytagsInitWindowsData(favoriteCategoriesWindow, favoriteCategoriesAllCheckBox) {

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

    });

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

// 单个勾选框勾选 （收藏）
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

// 全反选 (收藏)
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

// 更新全反选状态 (收藏)
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
function searchOnInput(searchInput, bottomDiv, favoriteCategoriesWindow, favoriteCategoriesAllCheckBox) {
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

            favoriteSearch(psenDict, psDict);
        }
    });


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

//#region mytag ↑ 上传到账号 ↑

// 显示弹框
function uploadTagFormDivShow(bottomDiv, submitCategoriesBtn, uploadTagFormDiv, uploadTagFormTagsDiv, uploadTagFormTagsResetBtn) {
    var checkedboxs = bottomDiv.querySelectorAll('input[type="checkbox"][data-visible="1"]:checked');
    if (checkedboxs.length == 0) {
        alert("请从 本地收藏 中 勾选标签");
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
            submitCategoriesBtn.innerText = "↑ 上传到账号 ↑";
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

            myTagUploadTagsIng(isWatchChecked, isHiddenChecked, tagColor, tagWeight, tag, settings_myTagsUploadTags);
        }, () => {
            alert("操作失败，请重试");
        });
    })

}

// 单个同步勾选标签到账号中
function myTagUploadTagsIng(isWatchChecked, isHiddenChecked, tagColor, tagWeight, tag, tagsValue) {
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
        // 账号标签名额用完，回滚无效的消耗标签
        if (tagsValue) {
            tagsValue.value.newTagsArray.push(tag);
            update(table_Settings, tagsValue, () => { }, () => { });
            setMyTagsUploadingRemainderCount(tagsValue.value.newTagsArray.length);
        }
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

//#region mytag ↓ 下载到收藏 ↓
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
        clodToFavoriteBtn.innerText = "↓ 下载到收藏 ↓";
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
                    translatePageElement(option);
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

//#region step8.1.eventpane.js hentaivase 弹框

function hentaiVaseDialog() {
    // 检测页面上是否存在弹框，检测域名为EH，且页面上存在 eventpane 元素
    if (webHost == "e-hentai.org") {
        var eventpane = document.getElementById("eventpane");
        if (eventpane && eventpane.children.length > 0) {
            // 跨域
            crossDomain();

            // 匹配和翻译弹框文本
            recursionTranslate(eventpane);

            // 添加手动关闭按钮
            var closeBtn = document.createElement("div");
            closeBtn.id = "eventpane_close_btn";
            closeBtn.innerText = "X";
            closeBtn.title = "关闭";

            closeBtn.addEventListener("click", function () {
                eventpane.style.display = "none";
            });

            eventpane.insertBefore(closeBtn, eventpane.children[0]);
        }
    }
}

function recursionTranslate(element) {
    var elementChildNodes = element.childNodes;
    for (const i in elementChildNodes) {
        if (Object.hasOwnProperty.call(elementChildNodes, i)) {
            const child = elementChildNodes[i];
            if (child.nodeName == "#text" && child.data) {
                var span = document.createElement("span");
                span.innerText = child.data;
                child.parentNode.insertBefore(span, child);
                child.parentNode.removeChild(child);
            }
        }
    }

    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        if (child.children.length > 0) {
            recursionTranslate(child);
        } else if (child.innerText) {
            child.title = child.innerText;
            // 先匹配常用文本
            if (hentaivaseDialogSentenceDict[child.innerText]) {
                child.innerText = hentaivaseDialogSentenceDict[child.innerText];
            } else {
                // 谷歌机翻
                translatePageElement(child);
            }
        }
    }
}

//#endregion

//#region main.js 主方法

// 头部菜单汉化
topMenuTranslateZh();
// 头部二级菜单汉化
topSubMenuTranslateZh();
// 底部菜单汉化
bottomMenuTranslateZh();

// EH 游戏弹窗翻译
hentaiVaseDialog();

// 根据地址链接判断当前是首页还是详情页
if (window.location.pathname.indexOf("/g/") == 0) {
    // 详情页
    detailPage();
}
else if (window.location.pathname.indexOf("/s/") == 0) {
    // 作品查看页
    detailReadPage();
}
else {
    if (window.location.pathname.indexOf("/uploader/") == 0) {
        // 用户上传
        mainPageCategory();
    } else {
        switch (window.location.pathname) {
            case '/':						// 首页
            case '/watched':				// 偏好
                mainPageCategory();
                break;
            case '/popular':				// 热门
                popularPage();
                break;
            case '/torrents.php':			// 种子
                torrentsPage();
                break;
            case '/gallerytorrents.php':	// 种子详情页
                torrentsDetailPages();
                break;
            case '/favorites.php':			// 收藏
                favoritePage();
                break;
            case '/toplist.php': 			// 排行榜
                toplistPage();
                break;
            case '/home.php':				// 我的主页 - 总览
                //myHomePage();
                break;
            case '/stats.php':				// 我的统计
                break;
            case '/hentaiathome.php':		// Hentai@Home
                break;
            case '/bitcoin.php':			// 捐赠
                break;
            case '/hathperks.php':			// 权限解锁
                break;
            case '/exchange.php':			// 交易
                //?t=hath		权限积分交易
                //?t=gp			GP交易
                break;
            case '/logs.php':				// 记录
                //?t=credits	信用卡记录
                //?t=karma		karma记录
                break;
            case '/uconfig.php':			// 设置
                uconfigPage();
                break;
            case '/bounty.php':				// 悬赏 Bountry List
                //?act=tops		Most Wanted Standard Bounties
                //?act=topt		Most Wanted Translation Bounties
                //?act=tope		Most Wanted Editing Bounties
                break;
            case '/bounty_post.php':		// Post New Bounty
                break;
            case '/news.php':				// 新闻
                newsPage();
                break;
            case '/manage':					// 我的上传 EH - 图库列表
            case '/upld/manage':			// 我的上传 EX - 图库列表
                break;
            case '/managefolders':			// 我的上传 EH - 管理文件夹
            case '/upld/managefolders':		// 我的上传 EX - 管理文件夹
                break;
            case '/managegallery':
            case '/upld/managegallery':
                //?act=new		创建图库
                break;
            case '/mytags':					// 我的标签
                mytagsPage();
                break;
            case '/lofi/':					// 低保真版
                break;
            case '/tos.php':				// 服务条款页面
                tosPage();
                break;
        }
    }
}

function mainPageCategory() {
    // 跨域
    crossDomain();

    // 新版分页
    TranslateNewPagingLinks();

    // 最外层添加样式方便调整
    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        ido[0].classList.add("t_frontpage_ido");
    }

    // 头部标题翻译
    frontPageTitleTranslate();

    // 头部原始搜索翻译
    frontTopOldSearchTranslate();

    // 从localstroge 读取，头部隐藏折叠
    frontPageTopStyleStep01();

    // 首页框架搭建
    frontPageHtml();

    // 直接从 localStroage 中取出有损图片先行展示，然后用无损图片替换
    var bglowbase64 = getBgLowImage();
    if (bglowbase64) {
        var bg = `url(${bglowbase64}) 0 / cover`;
        var style = document.createElement('style');
        style.innerHTML = `#div_ee8413b2_bg::before{background:${bg}}`;
        document.head.appendChild(style);
    }

    // 消息通知提前，只要数据改变就应该马上通知，方便快速其他页面快速反应
    // 初始化用户配置信息
    initUserSettings(() => {

        // 首页头部样式调整，补充事件
        frontPageTopStyleStep02();

        // 列举可用元素
        //#region step3.4.frontPageAllElements.js 列出首页全部可操作元素
        // 全部类别按钮、收藏按钮
        var allCategoryBtn = document.getElementById("category_all_button");
        var categoryFavoritesBtn = document.getElementById("category_favorites_button");

        // 搜索框标签收集栏、输入框、回车按钮、候选div、可用按钮、清空按钮、搜索按钮
        var searchInput = document.getElementById("input_info");
        var readonlyDiv = document.getElementById("readonly_div");
        var userInput = document.getElementById("user_input");
        var userInputEnterBtn = document.getElementById("user_input_enter");
        var userInputRecommendDiv = document.getElementById("category_user_input_recommend");
        var inputClearBtn = document.getElementById("input_clear");
        var searchBtn = document.getElementById("category_enter_button");

        // 加入收藏按钮、不可用的加入收藏按钮、收起按钮
        var addFavoritesBtn = document.getElementById("category_addFavorites_button");
        var addFavoritesDisabledBtn = document.getElementById("category_addFavorites_button_disabled");
        var searchCloseBtn = document.getElementById("search_close");

        // 展示区包裹层div、全部类别Div、收藏Div、类别列表div、类别_恋物列表div、类别_ehtag列表div、收藏列表div、加载词库等待div
        var displayDiv = document.getElementById("display_div");
        var categoryDisplayDiv = document.getElementById("category_all_div");
        var favoritesDisplayDiv = document.getElementById("category_favorites_div");
        var categoryEditor = document.getElementById("category_editor");
        var categoryListDiv = document.getElementById("category_list");
        var categoryList_fetishDiv = document.getElementById("category_list_fetishList");
        var categoryList_ehTagDiv = document.getElementById("category_list_ehTag");
        var favoriteListDiv = document.getElementById("favorites_list");
        var categoryLoadingDiv = document.getElementById("category_loading_div");

        // [标签 + 收藏] 全部展开按钮、标签全部折叠按钮、标签展开折叠按钮、标签
        var allExtend = document.getElementById("all_expand");
        var allCollapse = document.getElementById("all_collapse");
        var categoryExtends = document.getElementsByClassName("category_extend");
        var favoriteAllExtend = document.getElementById("favorites_all_expand");
        var favoriteAllCollapse = document.getElementById("favorites_all_collapse");
        var favoriteExtends = document.getElementsByClassName("favorite_extend");
        var cItems = document.getElementsByClassName("c_item");

        // 收藏编辑div、收藏编辑按钮、收藏保存按钮、收藏取消按钮、收藏清空按钮
        var favoriteEditDiv = document.getElementById("favorites_edit_list");
        var favoriteEdit = document.getElementById("favorites_edit");
        var favoriteSave = document.getElementById("favorites_save");
        var favoriteCancel = document.getElementById("favorites_cancel");
        var favoriteClear = document.getElementById("favorites_clear");

        // 备份收藏按钮、恢复收藏按钮、上传按钮
        var favoriteExport = document.getElementById("favorites_export");
        var favoriteRecover = document.getElementById("favorites_recover");
        var favoriteUploadFiles = document.getElementById("favorite_upload_files");

        // 背景图片包裹层div、头部div、上传图片按钮、不透明度、不透明度值、模糊程度、模糊程度值、重置按钮、保存按钮、取消按钮、关闭按钮
        var backgroundFormDiv = document.getElementById("background_form");
        var backgroundFormTop = document.getElementById("background_form_top");
        var bgUploadBtn = document.getElementById("bgUploadBtn");
        var bgUploadFile = document.getElementById("bg_upload_file");
        var opacityRange = document.getElementById("opacity_range");
        var opacityVal = document.getElementById("opacity_val");
        var maskRange = document.getElementById("mask_range");
        var maskVal = document.getElementById("mask_val");
        var bgImgClearBtn = document.getElementById("bgImg_clear_btn");
        var bgImgSaveBtn = document.getElementById("bgImg_save_btn");
        var bgImgCancelBtn = document.getElementById("bgImg_cancel_btn");
        var bgImgCloseBtn = document.getElementById("background_form_close");

        // 列表字体颜色包裹层div、头部div、父级字体调色板、父级字体颜色、子级字体调色板、子级字体颜色、子级悬浮调色板、子级悬浮颜色、重置按钮、保存按钮、取消按钮、关闭按钮
        var listFontColorDiv = document.getElementById("frontPage_listFontColor");
        var listFontColorTop = document.getElementById("frontPage_listFontColor_top");
        var listFontColorParentColor = document.getElementById("parent_color");
        var listFontColorParentColorVal = document.getElementById("parent_color_val");
        var listFontColorSubColor = document.getElementById("sub_color");
        var listFontColorSubColorVal = document.getElementById("sub_color_val");
        var listFontColorSubHoverColor = document.getElementById("sub_hover_color");
        var listFontColorSubHoverColorVal = document.getElementById("sub_hover_color_val");
        var listFontColorClearBtn = document.getElementById("listFontColor_clear_btn");
        var listFontColorSaveBtn = document.getElementById("listFontColor_save_btn");
        var listFontColorCancelBtn = document.getElementById("listFontColor_cancel_btn");
        var listFontColorCloseBtn = document.getElementById("frontPage_listFontColor_close");
        //#endregion

        //#region step6.1.backgroundImage.js 设置背景图片

        var t_imgBase64 = ''; // 背景图片（无损）
        var t_jpgBase64 = ''; // 背景图片（有损）
        var t_jpgOverSize = false; // 有损图片容量是否超标
        var t_opacity = defaultSetting_Opacity; // 透明度
        var t_mask = defaultSetting_Mask; // 遮罩浓度


        // 头部按钮点击事件
        var bgDiv = document.getElementById("div_background_btn");
        bgDiv.onclick = function () {
            backgroundFormDiv.style.display = "block";
            bgDiv.style.display = "none";
        }

        // 读取存储设置值，读取完成前，隐藏头部按钮，读取完成在显示出来
        function initBackground(func_compelete) {
            bgDiv.style.display = "none";
            var completeGetImg = false;
            var completeGetOpacity = false;
            var completeGetMask = false;

            read(table_Settings, table_Settings_Key_Bg_ImgBase64, result => {
                if (result && result.value) {
                    t_imgBase64 = result.value;
                } else {
                    t_imgBase64 = '';
                }
                // 设置页面背景
                setListBackgroundImage(t_imgBase64);
                completeGetImg = true;
            }, () => { completeGetImg = true; });
            read(table_Settings, table_Settings_Key_Bg_Opacity, result => {
                if (result && result.value) {
                    t_opacity = result.value;
                } else {
                    t_opacity = defaultSetting_Opacity;
                }
                // 设置背景不透明度
                setListOpacity(t_opacity);
                // 设置弹窗不透明度数值
                setDialogOpacityValue(t_opacity);
                completeGetOpacity = true;
            }, () => { completeGetOpacity = true; });
            read(table_Settings, table_Settings_Key_Bg_Mask, result => {
                if (result && result.value) {
                    t_mask = result.value;
                } else {
                    t_mask = defaultSetting_Mask;
                }
                // 设置背景遮罩浓度
                setListMask(t_mask);
                // 设置弹窗遮罩浓度数值
                setDialogMaskValue(t_mask);
                completeGetMask = true;
            }, () => { completeGetMask = true; });

            var tInit = setInterval(() => {
                if (completeGetImg && completeGetOpacity && completeGetMask) {
                    tInit && clearInterval(tInit);
                    bgDiv.style.display = "block";
                    func_compelete();
                }
            }, 50);
        }

        initBackground(() => { });

        // 点击上传图片
        bgUploadBtn.onclick = function () {
            bgUploadFile.click();
        }
        bgUploadFile.onchange = function () {
            var resultFile = bgUploadFile.files[0];
            if (resultFile) {
                var reader = new FileReader();
                reader.readAsDataURL(resultFile);
                reader.onload = function (e) {
                    var fileContent = e.target.result;
                    t_imgBase64 = fileContent;
                    setListBackgroundImage(t_imgBase64);

                    // 上传置空
                    bgUploadFile.value = "";

                    var img = new Image();
                    img.src = fileContent;
                    img.onload = function () {
                        var cvs = document.createElement("canvas");
                        var ctx = cvs.getContext('2d');
                        cvs.width = img.width;
                        cvs.height = img.height;
                        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);

                        cvs.toBlob(function (blob) {
                            if (blob.size <= lowImgSizeLimit) {
                                t_jpgOverSize = false;
                                // 只尝试存储压缩后500kb容量的图片到 localstroage
                                var reader2 = new FileReader();
                                reader2.readAsDataURL(blob);
                                reader2.onload = function (e2) {
                                    t_jpgBase64 = e2.target.result;
                                };
                            } else {
                                t_jpgBase64 = '';
                                t_jpgOverSize = true;
                            }

                        }, 'image/jpeg', 0.1);
                    }
                }
            }
        }

        // 设置列表背景图片
        function setListBackgroundImage(imageBase64) {
            var bg = `url(${imageBase64}) 0 / cover`;
            var style = document.createElement('style');
            style.innerHTML = `#div_ee8413b2_bg::before{background:${bg}}`;
            document.head.appendChild(style);
        }


        // 不透明度
        opacityRange.oninput = function () {
            t_opacity = opacityRange.value;
            opacityVal.innerText = t_opacity;
            setListOpacity(t_opacity);
        }
        // 设置不透明度效果
        function setListOpacity(opacityValue) {
            var style = document.createElement('style');
            style.innerHTML = `#div_ee8413b2_bg::before{opacity:${opacityValue}}`;
            document.head.appendChild(style);
        }
        // 设置弹窗不透明度数值
        function setDialogOpacityValue(opacityValue) {
            opacityRange.value = opacityValue;
            opacityVal.innerText = opacityValue;
        }


        // 遮罩浓度
        maskRange.oninput = function () {
            t_mask = maskRange.value;
            maskVal.innerText = t_mask;
            setListMask(t_mask);
        }
        // 设置遮罩浓度效果
        function setListMask(maskValue) {
            var style = document.createElement('style');
            style.innerHTML = `#div_ee8413b2_bg::before{filter:blur(${maskValue}px)}`;
            document.head.appendChild(style);
        }
        // 设置弹窗遮罩浓度数值
        function setDialogMaskValue(maskValue) {
            maskRange.value = maskValue;
            maskVal.innerText = maskValue;
        }

        // 点击关闭 + 取消关闭
        function closeBgSetDialog() {
            // 初始化设置
            initBackground(() => {
                backgroundFormDiv.style.display = "none";
                bgDiv.style.display = "block";
            });
        }
        bgImgCancelBtn.onclick = closeBgSetDialog;
        bgImgCloseBtn.onclick = closeBgSetDialog;

        // 重置
        bgImgClearBtn.onclick = function () {
            var confirmResult = confirm("是否删除背景图片，重置相关参数?");
            if (confirmResult) {
                bgImgClearBtn.innerText = "重置中...";
                var clearcomplete1 = false;
                var clearcomplete2 = false;
                var clearcomplete3 = false;
                var clearcomplete4 = false;
                var clearcomplete5 = false;
                var clearcomplete6 = false;
                remove(table_Settings, table_Settings_Key_Bg_ImgBase64, () => {
                    t_imgBase64 = '';
                    setListBackgroundImage(t_imgBase64);
                    clearcomplete1 = true;
                }, () => { clearcomplete1 = true; });
                remove(table_Settings, table_Settings_Key_Bg_Low_ImgOverSize, () => {
                    t_jpgOverSize = false;
                    clearcomplete2 = true;
                }, () => { clearcomplete2 = true; });
                remove(table_Settings, table_Settings_Key_Bg_Low_ImgBase64, () => {
                    t_jpgBase64 = '';
                    clearcomplete3 = true;
                }, () => { clearcomplete3 = true; });
                try {
                    removeBgLowImage();
                } finally {
                    clearcomplete4 = true;
                }
                remove(table_Settings, table_Settings_Key_Bg_Opacity, () => {
                    t_opacity = defaultSetting_Opacity;
                    setListOpacity(t_opacity);
                    setDialogOpacityValue(t_opacity);
                    clearcomplete5 = true;
                }, () => { clearcomplete5 = true; });
                remove(table_Settings, table_Settings_Key_Bg_Mask, () => {
                    t_mask = defaultSetting_Mask;
                    setListMask(t_mask);
                    setDialogMaskValue(t_mask);
                    clearcomplete6 = true;
                }, () => { clearcomplete6 = true; });

                var tClear = setInterval(() => {
                    if (clearcomplete1 && clearcomplete2 && clearcomplete3 && clearcomplete4 && clearcomplete5 && clearcomplete6) {
                        tClear && clearInterval(tClear);
                        setDbSyncMessage(sync_setting_backgroundImage);
                        setTimeout(function () {
                            bgImgClearBtn.innerText = "重置成功";
                        }, 250);
                        setTimeout(function () {
                            bgImgClearBtn.innerText = "重置 !";
                        }, 500);
                    }
                }, 50);
            }
        }

        // 保存
        bgImgSaveBtn.onclick = function () {
            bgImgSaveBtn.innerText = "保存中...";

            // 存储
            var complete1 = false;
            var complete2 = false;
            var complete3 = false;
            var complete4 = false;
            var complete5 = false;
            var complete6 = false;

            // 背景图片 (无损)
            var settings_Key_Bg_ImgBase64 = {
                item: table_Settings_Key_Bg_ImgBase64,
                value: t_imgBase64
            };
            update(table_Settings, settings_Key_Bg_ImgBase64, () => { complete1 = true }, () => { complete1 = true });

            // 背景图片（有损）
            var settings_Key_Bg_Low_ImgOverSize = {
                item: table_Settings_Key_Bg_Low_ImgOverSize,
                value: t_jpgOverSize
            };
            update(table_Settings, settings_Key_Bg_Low_ImgOverSize, () => { complete2 = true }, () => { complete2 = true });

            if (t_jpgOverSize) {
                // 超出限制，删除原有存储的有损图片
                remove(table_Settings, table_Settings_Key_Bg_Low_ImgBase64, () => { complete3 = true }, () => { complete3 = true });
                try {
                    removeBgLowImage();
                } finally {
                    complete4 = true;
                }
            } else {
                // 更新有损图片储存
                var settings_Key_Bg_Low_ImgBase64 = {
                    item: table_Settings_Key_Bg_Low_ImgBase64,
                    value: t_jpgBase64
                };
                update(table_Settings, settings_Key_Bg_Low_ImgBase64, () => { complete3 = true }, () => { complete3 = true });
                try {
                    setBgLowImage(t_jpgBase64);
                } finally {
                    complete4 = true;
                }
            }

            // 不透明度
            var settings_Key_Bg_Opacity = {
                item: table_Settings_Key_Bg_Opacity,
                value: t_opacity
            };
            update(table_Settings, settings_Key_Bg_Opacity, () => { complete5 = true }, () => { complete5 = true });

            // 遮罩浓度
            var settings_Key_Bg_Mask = {
                item: table_Settings_Key_Bg_Mask,
                value: t_mask
            };
            update(table_Settings, settings_Key_Bg_Mask, () => { complete6 = true }, () => { complete6 = true });

            var t = setInterval(() => {
                if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6) {
                    t && clearInterval(t);
                    setDbSyncMessage(sync_setting_backgroundImage);
                    setTimeout(function () {
                        bgImgSaveBtn.innerText = "保存成功";
                    }, 250);
                    setTimeout(function () {
                        bgImgSaveBtn.innerText = "保存 √";
                    }, 500);
                }
            }, 50);
        }

        //#endregion

        //#region step6.2.listFontColor.js 列表字体颜色设置

        var defaultFrontParentColor;
        var defaultFrontSubColor;
        var defaultFrontSubHoverColor;

        func_eh_ex(() => {
            defaultFrontParentColor = defaultFontParentColor_EH;
            defaultFrontSubColor = defaultFontSubColor_EH;
            defaultFrontSubHoverColor = defaultFontSubHoverColor_EH;
        }, () => {
            defaultFrontParentColor = defaultFontParentColor_EX;
            defaultFrontSubColor = defaultFontSubColor_EX;
            defaultFrontSubHoverColor = defaultFontSubHoverColor_EX;
        });

        var t_parentColor = defaultFrontParentColor;
        var t_subColor = defaultFrontSubColor;
        var t_subHoverColor = defaultFrontSubHoverColor;

        // 头部按钮点击事件
        var frontDiv = document.getElementById("div_fontColor_btn");
        frontDiv.onclick = function () {
            listFontColorDiv.style.display = "block";
            frontDiv.style.display = "none";
        }

        // 读取存储的值，读取完成前，隐藏头部按钮，读取完成在显示出来
        function initFontColor(func_compelete) {
            frontDiv.style.display = "none";
            var completeParentColor = false;
            var completeSubColor = false;
            var completeSubHoverColor = false;
            read(table_Settings, table_Settings_key_FrontPageFontParentColor, result => {
                if (result && result.value) {
                    t_parentColor = result.value;
                } else {
                    t_parentColor = defaultFrontParentColor;
                }
                // 设置父级颜色
                setFontPrentColor(t_parentColor);
                setDialogFontParentColor(t_parentColor);
                completeParentColor = true;
            }, () => { completeParentColor = true; });
            read(table_Settings, table_Settings_key_FrontPageFontSubColor, result => {
                if (result && result.value) {
                    t_subColor = result.value;
                } else {
                    t_subColor = defaultFrontSubColor;
                }
                // 设置子级颜色
                setFontSubColor(t_subColor);
                setDialogFontSubColor(t_subColor);
                completeSubColor = true;
            }, () => { completeSubColor = true; });
            read(table_Settings, table_Settings_Key_FrontPageFontSubHoverColor, result => {
                if (result && result.value) {
                    t_subHoverColor = result.value;
                } else {
                    t_subHoverColor = defaultFrontSubHoverColor;
                }
                // 设置子级悬浮颜色
                setFontSubHoverColor(t_subHoverColor);
                setDialogFontSubHoverColor(t_subHoverColor);
                completeSubHoverColor = true;
            }, () => { completeSubHoverColor = true; });

            var tInit = setInterval(() => {
                if (completeParentColor && completeSubColor && completeSubHoverColor) {
                    tInit && clearInterval(tInit);
                    frontDiv.style.display = "block";
                    func_compelete();
                }
            }, 50);
        }

        initFontColor(() => { });

        // 父级颜色
        listFontColorParentColor.onchange = function () {
            t_parentColor = listFontColorParentColor.value;
            listFontColorParentColorVal.innerText = t_parentColor;
            setFontPrentColor(t_parentColor);
        }
        // 设置父级颜色效果
        function setFontPrentColor(parentColor) {
            var style = document.createElement('style');
            style.innerHTML = `#div_ee8413b2 #category_all_div h4,
    #div_ee8413b2 #favorites_list h4,
    #div_ee8413b2 #favorites_edit_list h4
    {color:${parentColor}}

    #div_ee8413b2 #category_all_div .category_extend,
    #div_ee8413b2 #favorites_list .favorite_extend,
    #div_ee8413b2 #favorites_edit_list .favorite_edit_clear
    {border: 1px solid ${parentColor}; color:${parentColor};}`;
            document.head.appendChild(style);
        }

        // 设置弹窗页父级颜色数值
        function setDialogFontParentColor(parentColor) {
            listFontColorParentColor.value = parentColor;
            listFontColorParentColorVal.innerText = parentColor;
        }

        // 子级颜色
        listFontColorSubColor.onchange = function () {
            t_subColor = listFontColorSubColor.value;
            listFontColorSubColorVal.innerText = t_subColor;
            setFontSubColor(t_subColor);
        }
        // 设置子级颜色效果
        function setFontSubColor(subColor) {
            var style = document.createElement('style');
            style.innerHTML = `#div_ee8413b2 #category_all_div .c_item,
    #div_ee8413b2 #category_favorites_div #favorites_list .c_item
    {color:${subColor}}`;
            document.head.appendChild(style);
        }
        // 设置弹窗页子级颜色数值
        function setDialogFontSubColor(subColor) {
            listFontColorSubColor.value = subColor;
            listFontColorSubColorVal.innerText = subColor;
        }

        // 子级悬浮颜色
        listFontColorSubHoverColor.onchange = function () {
            t_subHoverColor = listFontColorSubHoverColor.value;
            listFontColorSubHoverColorVal.innerText = t_subHoverColor;
            setFontSubHoverColor(t_subHoverColor);
        }
        // 设置子级悬浮颜色效果
        function setFontSubHoverColor(subHoverColor) {
            var style = document.createElement('style');
            style.innerHTML = `#div_ee8413b2 #category_all_div .c_item:hover,
    #div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover
    {color:${subHoverColor}}`;
            document.head.appendChild(style);
        }

        // 设置弹窗页子级悬浮颜色数值
        function setDialogFontSubHoverColor(subHoverColor) {
            listFontColorSubHoverColor.value = subHoverColor;
            listFontColorSubHoverColorVal.innerText = subHoverColor;
        }

        // 点击关闭 + 取消关闭
        function closeFontColorDialog() {
            // 初始化设置
            initFontColor(() => {
                listFontColorDiv.style.display = "none";
                frontDiv.style.display = "block";
            });
        }
        listFontColorCancelBtn.onclick = closeFontColorDialog;
        listFontColorCloseBtn.onclick = closeFontColorDialog;


        // 重置
        listFontColorClearBtn.onclick = function () {
            var confirmResult = confirm("是否重置字体颜色相关参数?");
            if (confirmResult) {
                listFontColorClearBtn.innerText = "重置中...";
                var clearcomplete1 = false;
                var clearcomplete2 = false;
                var clearcomplete3 = false;
                remove(table_Settings, table_Settings_key_FrontPageFontParentColor, () => {
                    t_parentColor = defaultFrontParentColor;
                    setFontPrentColor(t_parentColor);
                    setDialogFontParentColor(t_parentColor);
                    clearcomplete1 = true;
                }, () => { clearcomplete1 = true; });
                remove(table_Settings, table_Settings_key_FrontPageFontSubColor, () => {
                    t_subColor = defaultFrontSubColor;
                    setFontSubColor(t_subColor);
                    setDialogFontSubColor(t_subColor);
                    clearcomplete2 = true;
                }, () => { clearcomplete2 = true; });
                remove(table_Settings, table_Settings_Key_FrontPageFontSubHoverColor, () => {
                    t_subHoverColor = defaultFrontSubHoverColor;
                    setFontSubHoverColor(t_subHoverColor);
                    setDialogFontSubHoverColor(t_subHoverColor);
                    clearcomplete3 = true;
                }, () => { clearcomplete3 = true; });

                var tClear = setInterval(() => {
                    if (clearcomplete1 && clearcomplete2 && clearcomplete3) {
                        tClear && clearInterval(tClear);
                        setDbSyncMessage(sync_setting_frontPageFontColor);
                        setTimeout(function () {
                            listFontColorClearBtn.innerText = "重置成功";
                        }, 250);
                        setTimeout(function () {
                            listFontColorClearBtn.innerText = "重置 !";
                        }, 500);
                    }
                }, 50);
            }
        }

        // 保存
        listFontColorSaveBtn.onclick = function () {
            listFontColorSaveBtn.innerText = "保存中...";

            // 存储
            var complete1 = false;
            var complete2 = false;
            var complete3 = false;

            // 父级颜色
            var settings_Key_FrontPageFontParentColor = {
                item: table_Settings_key_FrontPageFontParentColor,
                value: t_parentColor
            };
            update(table_Settings, settings_Key_FrontPageFontParentColor, () => { complete1 = true; }, () => { complete1 = true; });

            // 子级颜色
            var settings_Key_FrontPageFontSubColor = {
                item: table_Settings_key_FrontPageFontSubColor,
                value: t_subColor
            };
            update(table_Settings, settings_Key_FrontPageFontSubColor, () => { complete2 = true; }, () => { complete2 = true; });

            // 子级悬浮颜色
            var settings_Key_FrontPageFontSubHoverColor = {
                item: table_Settings_Key_FrontPageFontSubHoverColor,
                value: t_subHoverColor
            };
            update(table_Settings, settings_Key_FrontPageFontSubHoverColor, () => { complete3 = true; }, () => { complete3 = true; });

            var t = setInterval(() => {
                if (complete1 && complete2 && complete3) {
                    t && clearInterval(t);
                    setDbSyncMessage(sync_setting_frontPageFontColor);
                    setTimeout(function () {
                        listFontColorSaveBtn.innerText = "保存成功";
                    }, 250);
                    setTimeout(function () {
                        listFontColorSaveBtn.innerText = "保存 √";
                    }, 500);
                }
            }, 50);
        }

        //#endregion

        //#region step6.3.drugDialog.js 鼠标拖拽设置对话框

        var x = 0, y = 0;
        var left = 0, top = 0;
        var isMouseDown = false;

        var x1 = 0, y1 = 0;
        var left1 = 0, top1 = 0;
        var isMouseDown1 = false;

        // 背景对话框 鼠标按下事件
        backgroundFormTop.onmousedown = function (e) {
            // 获取坐标xy
            x = e.clientX;
            y = e.clientY;

            // 获取左和头的偏移量
            left = backgroundFormDiv.offsetLeft;
            top = backgroundFormDiv.offsetTop;

            // 鼠标按下
            isMouseDown = true;
        }

        // 字体对话框 鼠标按下事件
        listFontColorTop.onmousedown = function (e) {
            //获取坐标x1,y1
            x1 = e.clientX;
            y1 = e.clientY;

            // 获取左和头的偏移量
            left1 = listFontColorDiv.offsetLeft;
            top1 = listFontColorDiv.offsetTop;

            // 鼠标按下
            isMouseDown1 = true;
        }

        // 鼠标移动
        window.onmousemove = function (e) {
            if (isMouseDown) {
                var nLeft = e.clientX - (x - left);
                var nTop = e.clientY - (y - top);
                backgroundFormDiv.style.left = `${nLeft}px`;
                backgroundFormDiv.style.top = `${nTop}px`;
            }

            if (isMouseDown1) {
                var nLeft1 = e.clientX - (x1 - left1);
                var nTop1 = e.clientY - (y1 - top1);
                listFontColorDiv.style.left = `${nLeft1}px`;
                listFontColorDiv.style.top = `${nTop1}px`;
            }
        }

        // 鼠标抬起
        backgroundFormTop.onmouseup = function () {
            isMouseDown = false;
        }

        listFontColorDiv.onmouseup = function () {
            isMouseDown1 = false;
        }

        //#endregion

        var searchItemDict = {}; // 搜索框字典

        // 本地列表、本地收藏、收起按钮点击事件
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

        //#region step3.6.category.js 本地列表模块

        // 折叠方法
        function extendDiv(extendSpans, extendArray) {
            if (extendArray.length > 0) {
                for (const i in extendSpans) {
                    if (Object.hasOwnProperty.call(extendSpans, i)) {
                        const span = extendSpans[i];
                        var parent_en = span.dataset.category;
                        var itemDiv = document.getElementById("items_div_" + parent_en);
                        if (extendArray.indexOf(parent_en) != -1) {
                            span.innerText = "+";
                            itemDiv.style.display = "none";
                        } else {
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

        // 单个折叠、展开
        function parentItemsExtend(extendSpans) {
            for (const i in extendSpans) {
                if (Object.hasOwnProperty.call(extendSpans, i)) {
                    const item = extendSpans[i];
                    item.addEventListener("click", function () {
                        // 获取存储折叠信息
                        read(table_Settings, table_Settings_key_CategoryList_Extend, result => {
                            var extendData = [];
                            if (result) {
                                extendData = result.value;
                            }

                            var cateDivName = item.dataset.category;
                            if (item.innerHTML == "+") {
                                // 需要展开
                                item.innerHTML = "-";
                                document.getElementById("items_div_" + cateDivName).style.display = "block";
                                if (extendData.indexOf(cateDivName) != -1) {
                                    extendData.remove(cateDivName);
                                }
                            }
                            else {
                                // 需要折叠
                                item.innerHTML = "+";
                                document.getElementById("items_div_" + cateDivName).style.display = "none";
                                if (extendData.indexOf(cateDivName) == -1) {
                                    extendData.push(cateDivName);
                                }
                            }

                            // 保存存储信息
                            var setting_categoryExtend = {
                                item: table_Settings_key_CategoryList_Extend,
                                value: extendData
                            }
                            update(table_Settings, setting_categoryExtend, () => {
                                // 通知折叠
                                setDbSyncMessage(sync_categoryList_Extend);
                            }, () => { });

                        }, () => { });
                    });
                }
            }
        }

        // 添加小项到搜索框
        function addItemToInput(parent_en, parent_zh, sub_en, sub_zh, sub_desc) {
            if (searchItemDict[`${parent_en}:${sub_en}`] == undefined) {
                if (checkDictNull(searchItemDict)) {
                    inputClearBtn.style.display = "block";
                    searchBtn.innerText = "搜索";
                }

                var newSearchInputItem = document.createElement("span");
                newSearchInputItem.classList.add("input_item");
                newSearchInputItem.id = `input_item_${parent_en}_${sub_en}`;
                newSearchInputItem.title = sub_en;

                const key = `${parent_en}:${sub_en}`;
                newSearchInputItem.dataset.item = key;
                searchItemDict[key] = { parent_en, parent_zh, sub_en, sub_zh, sub_desc };

                var searchItemText = document.createTextNode(`${parent_zh} : ${sub_zh} X`);
                newSearchInputItem.appendChild(searchItemText);
                newSearchInputItem.addEventListener("click", removeSearchItem);
                readonlyDiv.appendChild(newSearchInputItem);

                addFavoritesBtn.style.display = "block";
                addFavoritesDisabledBtn.style.display = "none";

                // 滚动条滚动到底部
                searchInput.scrollTop = searchInput.scrollHeight;
            }
        }


        // 点击小项加入到搜索框
        function cItemJsonSearchInput(cItems) {
            for (const i in cItems) {
                if (Object.hasOwnProperty.call(cItems, i)) {
                    const searchItem = cItems[i];
                    searchItem.addEventListener("click", function () {
                        var parentEn = searchItem.dataset.parent_en;
                        var parentZh = searchItem.dataset.parent_zh;
                        var subDesc = searchItem.dataset.sub_desc;
                        var enItem = searchItem.dataset.item;
                        var zhItem = searchItem.innerHTML;
                        addItemToInput(parentEn, parentZh, enItem, zhItem, subDesc);
                    });
                }
            }
        }

        // 初始化本地列表页面，已存在数据
        function categoryInit() {
            var complete1 = false;
            var complete2 = false;
            var complete3 = false;
            var complete4 = false;

            // 恋物列表模块
            read(table_Settings, table_Settings_key_FetishList_Html, result => {
                // 先清空html代码，然后生成 html 代码
                categoryList_fetishDiv.innerHTML = '';
                addInVirtualNode(categoryList_fetishDiv, result.value, () => {
                    // 单个展开折叠
                    var extendSpans = document.getElementsByClassName("category_extend_fetish");
                    parentItemsExtend(extendSpans);
                    // 具体小项点击加入搜索框
                    var cItems = document.getElementsByClassName("c_item_fetish");
                    cItemJsonSearchInput(cItems);
                    complete1 = true;
                    complete2 = true;
                });
            }, () => {
                complete1 = true;
                complete2 = true;
            });

            // EhTag列表模块
            read(table_Settings, table_Settings_key_EhTag_Html, result => {
                // 先清空html代码，然后生成 html 代码
                categoryList_ehTagDiv.innerHTML = '';
                addInVirtualNode(categoryList_ehTagDiv, result.value, () => {
                    // 单个展开折叠
                    var extendSpans = document.getElementsByClassName("category_extend_ehTag");
                    parentItemsExtend(extendSpans);
                    // 具体小项点击加入搜索框
                    var cItems = document.getElementsByClassName("c_item_ehTag");
                    cItemJsonSearchInput(cItems);
                    complete3 = true;
                    complete4 = true;
                });
            }, () => {
                complete3 = true;
                complete4 = true;
            });

            var t = setInterval(() => {
                if (complete1 && complete2 && complete3 && complete4) {
                    t && clearInterval(t);
                    // 当前页面打开没有，如果没有打开就全部折叠，否则就不折叠
                    if (document.getElementById("category_all_div").style.display != "block" || categoryDisplayDiv.style.display == "none") {
                        // 全部折叠起来
                        allCollapse_Func();
                    }
                    else {
                        allCollapse_Func();
                        allCategoryTempUnFold();
                    }
                    // 隐藏等待div
                    categoryLoadingDiv.style.display = "none";
                    // 展示列表
                    categoryEditor.style.display = "block";
                    categoryListDiv.style.display = "block";
                }
            }, 10);
        }

        // 如果存在可用的词库的话，先尝试使用旧词库，然后比对版本号，看是否需要更新
        function tryUseOldDataFirst(func_compelete) {
            indexDbInit(() => {

                // 验证数据完整性
                checkDataIntact(() => {
                    // 判断是否存在旧数据
                    var fetishHasValue = false;
                    var ehTagHasValue = false;
                    var complete1 = false;
                    var complete2 = false;
                    checkFieldEmpty(table_Settings, table_Settings_key_FetishList_Html, () => {
                        complete1 = true;
                    }, () => {
                        fetishHasValue = true;
                        complete1 = true;
                    });
                    checkFieldEmpty(table_Settings, table_Settings_key_EhTag_Html, () => {
                        complete2 = true;
                    }, () => {
                        ehTagHasValue = true;
                        complete2 = true;
                    });

                    var t = setInterval(() => {
                        if ((complete1 && fetishHasValue) || (complete2 && ehTagHasValue)) {
                            t && clearInterval(t);
                            // 存在数据
                            categoryInit();
                            // 检查更新
                            checkUpdateData(() => {
                                // 存在更新
                                categoryInit();
                                // 表格标签翻译
                                tableTagTranslate();
                                func_compelete();
                            }, () => {
                                func_compelete();
                            });
                        } else if (complete1 && complete2) {
                            t && clearInterval(t);
                            // 不存在数据
                            checkUpdateData(() => {
                                // 存在更新
                                categoryInit();
                                // 表格标签翻译
                                tableTagTranslate();
                                func_compelete();
                            }, () => {
                                func_compelete();
                            });
                        }
                    }, 10);
                });
            });
        }


        // 全部折叠
        allCollapse.onclick = function () {
            allCollapse_Func();

            // 存储全部父级
            var allParentDataArray = [];

            // 并更新存储全部的父级名称
            read(table_Settings, table_Settings_key_FetishList_ParentEnArray, fetishParentData => {
                allParentDataArray = fetishParentData.value;
                read(table_Settings, table_Settings_key_EhTag_ParentEnArray, ehTagParentData => {
                    allParentDataArray = allParentDataArray.concat(ehTagParentData.value);
                    // 存储全部
                    var setting_categoryExtend = {
                        item: table_Settings_key_CategoryList_Extend,
                        value: allParentDataArray
                    }
                    update(table_Settings, setting_categoryExtend, () => {
                        // 通知折叠
                        setDbSyncMessage(sync_categoryList_Extend);
                    }, () => { });
                }, () => { });
            }, () => { });
        }

        // 全部展开
        allExtend.onclick = function () {
            var extendBtns = document.getElementsByClassName("category_extend");
            for (const i in extendBtns) {
                if (Object.hasOwnProperty.call(extendBtns, i)) {
                    const btn = extendBtns[i];
                    if (btn.innerHTML != "-") {
                        btn.innerHTML = "-";
                    }
                }
            }

            var categoryItemsDiv = document.getElementsByClassName("category_items_div");
            for (const i in categoryItemsDiv) {
                if (Object.hasOwnProperty.call(categoryItemsDiv, i)) {
                    const div = categoryItemsDiv[i];
                    if (div.style.display != "block") {
                        div.style.display = "block";
                    }
                }
            }

            // 清空折叠记录
            remove(table_Settings, table_Settings_key_CategoryList_Extend, () => {
                // 通知折叠
                setDbSyncMessage(sync_categoryList_Extend);
            }, () => { });
        }

        // 删除搜索框子项
        function removeSearchItem(e) {
            var id = e.path[0].id;
            var item = document.getElementById(id);
            var cateItem = item.dataset.item;
            delete searchItemDict[cateItem];

            if (checkDictNull(searchItemDict)) {
                inputClearBtn.style.display = "none";
                searchBtn.innerText = "首页";
                addFavoritesBtn.style.display = "none";
                addFavoritesDisabledBtn.style.display = "block";
            }

            item.parentNode.removeChild(item);
        }

        // 全部折叠 - 不含存储
        function allCollapse_Func() {
            var extendBtns = document.getElementsByClassName("category_extend");
            for (const i in extendBtns) {
                if (Object.hasOwnProperty.call(extendBtns, i)) {
                    const btn = extendBtns[i];
                    if (btn.innerHTML != "+") {
                        btn.innerHTML = "+";
                    }
                }
            }

            var categoryItemsDiv = document.getElementsByClassName("category_items_div");
            for (const i in categoryItemsDiv) {
                if (Object.hasOwnProperty.call(categoryItemsDiv, i)) {
                    const div = categoryItemsDiv[i];
                    if (div.style.display != "none") {
                        div.style.display = "none";
                    }
                }
            }
        }

        //#endregion

        // 首页谷歌翻译：标签
        indexDbInit(() => {
            mainPageTranslate();
        });

        // 词库数据
        tryUseOldDataFirst(() => {

            //#region step3.7.search.js 搜索框功能

            // 进入页面，根据地址栏信息生成搜索栏标签
            function readSearchParentAndInput(parentEn, subEn) {
                read(table_detailParentItems, parentEn, result => {
                    if (result) {
                        addItemToInput(result.row, result.name, subEn, subEn, '');
                    } else {
                        addItemToInput(parentEn, parentEn, subEn, subEn, '');
                    }
                }, () => {
                    addItemToInput(parentEn, parentEn, subEn, subEn, '');
                });
            }

            var searchParam = GetQueryString("f_search");
            if (searchParam) {
                // 如果最后一位是加号，则把加号去掉
                if (searchParam.charAt(searchParam.length - 1) == "+") {
                    searchParam = searchParam.slice(0, searchParam.length - 1);
                }
            }
            if (searchParam) {
                if (searchParam.indexOf("%20") != -1) {
                    // 需要转义
                    searchParam = urlDecode(searchParam);
                } else {
                    searchParam = searchParam.replace(/\%3A/g, ':');
                    searchParam = searchParam.replace(/\"\+\"/g, '"$"');
                    searchParam = searchParam.replace(/\+/g, " ");
                    searchParam = searchParam.replace(/\"\$\"/g, '"+"');
                }

                var f_searchs = searchParam;
                if (f_searchs && f_searchs != "null") {
                    var searchArray = f_searchs.split("+");
                    for (const i in searchArray) {
                        if (Object.hasOwnProperty.call(searchArray, i)) {

                            var items = searchArray[i].replace(/\+/g, " ").replace(/\"/g, "");
                            var itemArray = items.split(":");
                            searchItem(itemArray);

                            function searchItem(itemArray) {
                                if (itemArray.length == 2) {
                                    var parentEn = itemArray[0];
                                    var subEn = itemArray[1];

                                    // 判断是否是上传者
                                    if (parentEn == "uploader") {
                                        addItemToInput("uploader", "上传者", subEn, subEn, '');
                                    } else {
                                        // 从EhTag中查询，看是否存在
                                        read(table_EhTagSubItems, items, ehTagData => {
                                            if (ehTagData) {
                                                addItemToInput(ehTagData.parent_en, ehTagData.parent_zh, ehTagData.sub_en, ehTagData.sub_zh, ehTagData.sub_desc);
                                            } else {
                                                // 尝试翻译父级
                                                readSearchParentAndInput(parentEn, subEn);
                                            }
                                        }, () => {
                                            // 尝试翻译父级
                                            readSearchParentAndInput(parentEn, subEn);
                                        });
                                    }
                                }
                                else {
                                    // 从恋物列表中查询，看是否存在
                                    readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, itemArray[0], fetishData => {
                                        if (fetishData) {
                                            addItemToInput(fetishData.parent_en, fetishData.parent_zh, fetishData.sub_en, fetishData.sub_zh, fetishData.sub_desc);
                                        } else {
                                            // 用户自定义搜索关键字
                                            addItemToInput("userCustom", "自定义", itemArray[0], itemArray[0], '');
                                        }
                                    }, () => {
                                        // 用户自定义搜索关键字
                                        addItemToInput("userCustom", "自定义", itemArray[0], itemArray[0], '');
                                    });
                                }
                            }
                        }
                    }
                }
            }


            // 删除搜索框子项
            function removeSearchItem(e) {
                var id = e.path[0].id;
                var item = document.getElementById(id);
                var cateItem = item.dataset.item;
                delete searchItemDict[cateItem];

                if (checkDictNull(searchItemDict)) {
                    inputClearBtn.style.display = "none";
                    searchBtn.innerText = "全部";
                    addFavoritesBtn.style.display = "none";
                    addFavoritesDisabledBtn.style.display = "block";
                }

                item.parentNode.removeChild(item);
            }

            // 清空选择
            inputClearBtn.onclick = function () {
                searchItemDict = {};
                readonlyDiv.innerHTML = "";
                inputClearBtn.style.display = "none";
                searchBtn.innerText = "全部";
                addFavoritesBtn.style.display = "none";
                addFavoritesDisabledBtn.style.display = "block";
            }

            // 搜索包含父级
            function SearchWithParentEn(fetishParentArray) {
                var enItemArray = [];
                for (const i in searchItemDict) {
                    if (Object.hasOwnProperty.call(searchItemDict, i)) {
                        var item = searchItemDict[i];
                        if (fetishParentArray.indexOf(item.parent_en) != -1) {
                            enItemArray.push(`"${item.sub_en}"`);
                        }
                        else if (item.parent_en == "userCustom") {
                            enItemArray.push(`"${item.sub_en}"`);
                        } else {
                            enItemArray.push(`"${item.parent_en}:${item.sub_en}"`);
                        }
                    }
                }
                searchBtn.innerText = "···";
                // 构建请求链接
                var searchLink = `${window.location.origin}${window.location.pathname}?f_search=${enItemArray.join("+")}`;
                window.location.href = searchLink;
            }

            // 搜索只有子级
            function SearchWithoutParentEn() {
                var enItemArray = [];
                for (const i in searchItemDict) {
                    if (Object.hasOwnProperty.call(searchItemDict, i)) {
                        var item = searchItemDict[i];
                        if (item.parent_en == "userCustom") {
                            enItemArray.push(`"${item.sub_en}"`);
                        } else if (enItemArray.indexOf(item.sub_en) == -1) {
                            enItemArray.push(`"${item.sub_en}"`);
                        }
                    }
                }
                searchBtn.innerText = "···";
                // 构建请求链接
                var searchLink = `${window.location.origin}${window.location.pathname}?f_search=${enItemArray.join("+")}`;
                window.location.href = searchLink;
            }

            // 搜索按钮 or 全部按钮
            searchBtn.onclick = function () {
                if (searchBtn.innerText == "全部") {
                    searchBtn.innerText = "···";
                    window.location.href = `${window.location.origin}${window.location.pathname}`;
                }
                else if (searchBtn.innerText == "搜索") {
                    read(table_Settings, table_Settings_key_FetishList_ParentEnArray, fetishParentResult => {
                        if (fetishParentResult) {
                            SearchWithParentEn(fetishParentResult.value);
                        } else {
                            SearchWithoutParentEn();
                        }
                    }, () => {
                        SearchWithoutParentEn();
                    });
                }
            }

            // 搜索按钮，点击后如果鼠标悬浮指针改为转圈
            searchBtn.onmouseover = function () {
                if (searchBtn.innerText == "···") {
                    searchBtn.style.cursor = "wait";
                }
            }

            // 鼠标悬浮显示输入框
            searchInput.onmouseover = function () {
                if (userInput.value == "") {
                    userInput.classList.add("user_input_null_backcolor");
                } else {
                    userInput.classList.add("user_input_value_backColor");
                }

            }

            // 鼠标移出移除输入框
            searchInput.onmouseout = function () {
                if (userInput.value == "") {
                    userInput.classList.remove("user_input_null_backcolor");
                    userInput.classList.remove("user_input_value_backColor");
                }
            }

            // 输入框输入时候选
            userInput.oninput = function () {
                var inputValue = trimStartEnd(userInput.value.toLowerCase());
                userInputOnInputEvent(inputValue);
            }

            function userInputOnInputEvent(inputValue) {
                // 清空候选项
                userInputRecommendDiv.innerHTML = "";
                userInputRecommendDiv.style.display = "block";
                var tempDiv = document.createElement("div");
                userInputRecommendDiv.appendChild(tempDiv);

                if (inputValue == "") {
                    userInputRecommendDiv.style.display = "none";
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
                                addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh, item.sub_desc);
                                userInputRecommendDiv.innerHTML = "";
                                userInput.value = "";
                                userInput.focus();
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
                                var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en.toLowerCase()}`;
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
                                var searchKey = `${item.parent_en},${item.parent_zh},${item.sub_en.toLowerCase()}`;
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

            // 输入框检测回车事件
            userInput.onkeydown = function (e) {
                var theEvent = window.event || e;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {
                    userInputEnter();
                }
            }

            userInputEnterBtn.onclick = userInputEnter;

            function userInputEnter() {
                var inputValue = userInput.value.replace(/(^\s*)|(\s*$)/g, '');
                if (!inputValue) return;


                var recommendItems = document.getElementsByClassName("category_user_input_recommend_items");
                if (recommendItems.length > 0) {
                    // 从候选下拉列表中匹配，如果有相同的，使用匹配内容，否则直接新增自定义文本
                    var isFound = false;
                    for (const i in recommendItems) {
                        if (Object.hasOwnProperty.call(recommendItems, i)) {
                            const recommendItem = recommendItems[i];
                            var zhDiv = recommendItem.firstChild;
                            var enDiv = recommendItem.lastChild;
                            var zhArray = zhDiv.innerText.split(" : ");
                            var enArray = enDiv.innerText.split(" : ");
                            var sub_zh = zhArray[1];
                            var sub_en = enArray[1];
                            var sub_desc = recommendItem.title;
                            if (sub_zh == inputValue || sub_en == inputValue) {
                                // 符合条件
                                var parent_zh = zhArray[0];
                                var parent_en = enArray[0];
                                addItemToInput(parent_en, parent_zh, sub_en, sub_zh, sub_desc);
                                isFound = true;
                                break;
                            }
                        }
                    }

                    if (!isFound) {
                        // 没有找到符合条件的
                        addItemToInput("userCustom", "自定义", inputValue, inputValue, '');
                    }

                } else {
                    // 如果没有下拉列表，直接新增自定义文本
                    addItemToInput("userCustom", "自定义", inputValue, inputValue, '');
                }

                // 清空文本框
                userInput.value = "";
                userInputRecommendDiv.style.display = "none";
            }

            //#endregion

            //#region step3.8.favorite.js 收藏功能

            // 读取转换本地收藏数据
            read(table_Settings, table_Settings_key_FavoriteList, result => {
                if (result && result.value) {
                    // 首次使用，需要转换收藏数据，更新本地收藏表，更新收藏Html
                    reBuildFavoriteByOldData(result.value);
                } else {
                    // 读取收藏HTML，如果存在，则直接生成页面，否则从收藏表读取数据手动生成
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
                            // 根据收藏表生成html
                            generalFavoriteListDiv(() => {
                                // 设置收藏折叠
                                setFavoriteExpend();
                                // 更新按钮状态
                                updateFavoriteListBtnStatus();
                            });
                        }
                    }, () => { });
                }
            }, () => { });

            // 根据旧收藏数据重新生成收藏列表
            function reBuildFavoriteByOldData(favoriteDict) {

                var favoriteSubItems = {};
                // var example = { ps_en: "male:bo", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

                function setFavoriteDict(result) {
                    var parent_en = result.parent_en;
                    var parent_zh = result.parent_zh;
                    var sub_en = result.sub_en;
                    var sub_zh = result.sub_zh;
                    var sub_desc = result.sub_desc;
                    var ps_en = `${parent_en}:${sub_en}`;
                    favoriteSubItems[ps_en] = { ps_en, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                }

                function setFavoriteDictCustom(subEn, subZh) {
                    var parent_en = "userCustom";
                    var parent_zh = "自定义";
                    var sub_en = subEn;
                    var sub_zh = subZh;
                    var sub_desc = "";
                    var ps_en = `${parent_en}:${sub_en}`;
                    favoriteSubItems[ps_en] = { ps_en, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                }

                var foundTotalCount = 0; // 总数
                var foundIndex = 0; // 执行完个数

                for (const parentEn in favoriteDict) {
                    if (Object.hasOwnProperty.call(favoriteDict, parentEn)) {
                        const subData = favoriteDict[parentEn];
                        var subItems = subData[1];
                        if (parentEn == "localFavorites") {
                            // 恋物数据
                            for (const subEn in subItems) {
                                if (Object.hasOwnProperty.call(subItems, subEn)) {
                                    const subZh = subItems[subEn];
                                    foundTotalCount++;
                                    readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, subEn, fetishResult => {
                                        setFavoriteDict(fetishResult);
                                        foundIndex++;
                                    }, () => {
                                        setFavoriteDictCustom(subEn, subZh);
                                        foundIndex++;
                                    });
                                }
                            }

                        } else {
                            // Ehtag 数据
                            for (const subEn in subItems) {
                                if (Object.hasOwnProperty.call(subItems, subEn)) {
                                    const subZh = subItems[subEn];
                                    foundTotalCount++;
                                    var ps_en = `${parentEn}:${subEn}`;
                                    read(table_EhTagSubItems, ps_en, ehTagResult => {
                                        if (ehTagResult) {
                                            setFavoriteDict(ehTagResult);
                                            foundIndex++;
                                        } else {
                                            setFavoriteDictCustom(subEn, subZh);
                                            foundIndex++;
                                        }
                                    }, () => {
                                        setFavoriteDictCustom(subEn, subZh);
                                        foundIndex++;
                                    });
                                }
                            }
                        }
                    }
                }

                var t = setInterval(() => {
                    if (foundTotalCount == foundIndex) {
                        t && clearInterval(t);
                        // 首次更新本地收藏列表
                        firstUpdateFavoriteSubItems(favoriteSubItems, foundTotalCount);
                    }
                }, 50);
            }

            function getFavoriteListHtml(favoriteSubItems) {
                var favoritesListHtml = ``;
                var lastParentEn = ``;
                for (const ps_en in favoriteSubItems) {
                    if (Object.hasOwnProperty.call(favoriteSubItems, ps_en)) {
                        var item = favoriteSubItems[ps_en];
                        if (item.parent_en != lastParentEn) {
                            if (lastParentEn != '') {
                                favoritesListHtml += `</div>`;
                            }
                            lastParentEn = item.parent_en;
                            // 新建父级
                            favoritesListHtml += `<h4 id="favorite_h4_${item.parent_en}">${item.parent_zh}<span data-category="${item.parent_en}"
                    class="favorite_extend">-</span></h4>`;
                            favoritesListHtml += `<div id="favorite_div_${item.parent_en}" class="favorite_items_div">`;
                        }

                        // 添加子级
                        favoritesListHtml += `<span class="c_item c_item_favorite" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}" data-item="${item.sub_en}" 
                        data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}">${item.sub_zh}</span>`;
                    }
                }

                if (favoritesListHtml != ``) {
                    favoritesListHtml += `</div>`;
                }

                return favoritesListHtml;
            }

            // 首次更新本地收藏列表
            function firstUpdateFavoriteSubItems(favoriteSubItems, foundTotalCount) {
                // 更新本地收藏表
                batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, favoriteSubItems, foundTotalCount, () => {
                    // 稳妥起见，更新完之后再删除本地的原始收藏列表
                    remove(table_Settings, table_Settings_key_FavoriteList, () => { }, () => { });

                    // 更新我的标签收藏
                    updateMyTagFavoriteTagHtml(() => {
                        setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                    }, () => { });
                });

                // 生成 html 和 同步
                if (!checkDictNull(favoriteSubItems)) {
                    // 新版收藏，只可能增加，原有的不变
                    var favoritesListHtml = getFavoriteListHtml(favoriteSubItems);

                    // 页面附加Html
                    favoriteListDiv.innerHTML = favoritesListHtml;

                    // 存储收藏Html
                    saveFavoriteListHtml(favoritesListHtml, () => {
                        // 通知页面更新
                        setDbSyncMessage(sync_favoriteList);
                    });

                    // 小项添加点击事件
                    favoriteItemsClick();

                    // 折叠菜单添加点击事件
                    favoriteExtendClick();

                    // 折叠的菜单显示隐藏
                    setFavoriteExpend();
                }

                // 更新按钮状态
                updateFavoriteListBtnStatus();
            }

            // 设置收藏折叠
            function setFavoriteExpend() {
                read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
                    var expendBtns = document.getElementsByClassName("favorite_extend");
                    if (result && result.value) {
                        var expendArray = result.value;
                        for (const i in expendBtns) {
                            if (Object.hasOwnProperty.call(expendBtns, i)) {
                                const btn = expendBtns[i];
                                var category = btn.dataset.category;
                                var itemDiv = document.getElementById("favorite_div_" + category);
                                if (expendArray.indexOf(category) != -1) {
                                    btn.innerText = "+";
                                    itemDiv.style.display = "none";
                                } else {
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

            // 更新收藏列表Html存储
            function saveFavoriteListHtml(favoritesListHtml, func_compelete) {
                var settings_favoriteList_html = {
                    item: table_Settings_key_FavoriteList_Html,
                    value: favoritesListHtml
                };

                update(table_Settings, settings_favoriteList_html, () => { func_compelete(); }, () => { });
            }

            // 为每个收藏子项添加点击事件
            function favoriteItemsClick() {
                var favoriteItems = document.getElementsByClassName("c_item_favorite");
                for (const i in favoriteItems) {
                    if (Object.hasOwnProperty.call(favoriteItems, i)) {
                        const item = favoriteItems[i];
                        item.addEventListener("click", function () {
                            var parentEn = item.dataset.parent_en;
                            var parentZh = item.dataset.parent_zh;
                            var subDesc = item.dataset.sub_desc;
                            var enItem = item.dataset.item;
                            var zhItem = item.innerHTML;

                            addItemToInput(parentEn, parentZh, enItem, zhItem, subDesc);
                        });
                    }
                }
            }

            // 为每个折叠按钮添加点击事件
            function favoriteExtendClick() {
                var favoriteExtends = document.getElementsByClassName("favorite_extend");
                for (const i in favoriteExtends) {
                    if (Object.hasOwnProperty.call(favoriteExtends, i)) {
                        const item = favoriteExtends[i];
                        item.addEventListener("click", function () {
                            // 获取存储折叠信息
                            read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
                                var expendData = [];
                                if (result && result.value) {
                                    expendData = result.value;
                                }

                                var favoriteName = item.dataset.category;
                                if (item.innerHTML == "+") {
                                    // 需要展开
                                    item.innerHTML = "-";
                                    document.getElementById("favorite_div_" + favoriteName).style.display = "block";
                                    if (expendData.indexOf(favoriteName) != -1) {
                                        expendData.remove(favoriteName);
                                    }
                                } else {
                                    // 需要折叠
                                    item.innerHTML = "+";
                                    document.getElementById("favorite_div_" + favoriteName).style.display = "none";
                                    if (expendData.indexOf(favoriteName) == -1) {
                                        expendData.push(favoriteName);
                                    }
                                }

                                // 更新存储折叠信息
                                var settings_favoriteList_extend = {
                                    item: table_Settings_Key_FavoriteList_Extend,
                                    value: expendData
                                };

                                update(table_Settings, settings_favoriteList_extend, () => {
                                    // 通知折叠
                                    setDbSyncMessage(sync_favoriteList_Extend);
                                }, () => { });

                            }, () => { });
                        });

                    }
                }
            }

            // 加入收藏
            addFavoritesBtn.onclick = function () {
                // 输入框标签，判断非空
                if (checkDictNull(searchItemDict)) {
                    alert("收藏前请选择至少一个标签");
                    return;
                }

                addFavoritesBtn.innerText = "收藏中...";

                var favoriteDicts = {}; // 原始收藏
                var newFavoriteDicts = {}; // 新增收藏

                // 读取存储收藏全部
                readAll(table_favoriteSubItems, (k, v) => {
                    favoriteDicts[k] = v;
                }, () => {
                    // 全部读取完毕，过滤出新增数据
                    var newFavoritesCount = filterNewFavorites();

                    // 如果有新数据就更新存储和页面
                    updateDbAndPage(newFavoritesCount);
                });

                function filterNewFavorites() {
                    var newFavoritesCount = 0;
                    for (const ps_en in searchItemDict) {
                        if (Object.hasOwnProperty.call(searchItemDict, ps_en)) {
                            const item = searchItemDict[ps_en];
                            if (!favoriteDicts[ps_en]) {
                                newFavoriteDicts[ps_en] = item;
                                newFavoritesCount++;
                            }
                        }
                    }
                    return newFavoritesCount;
                }

                function updateDbAndPage(newFavoritesCount) {
                    if (newFavoritesCount > 0) {
                        // 更新收藏表
                        batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, newFavoriteDicts, newFavoritesCount, () => {
                            // 更新页面html 和 事件
                            for (const ps_en in newFavoriteDicts) {
                                if (Object.hasOwnProperty.call(newFavoriteDicts, ps_en)) {
                                    const item = newFavoriteDicts[ps_en];

                                    var favoriteH4Id = "favorite_h4_" + item.parent_en;
                                    var favoriteH4 = document.getElementById(favoriteH4Id);
                                    if (!favoriteH4) {
                                        var h4 = document.createElement("h4");
                                        h4.id = favoriteH4Id;
                                        var h4text = document.createTextNode(item.parent_zh);
                                        h4.appendChild(h4text);
                                        var spanExtend = document.createElement("span");
                                        spanExtend.dataset.category = item.parent_en;
                                        spanExtend.classList.add("favorite_extend");
                                        var spanExtendText = document.createTextNode("-");
                                        spanExtend.appendChild(spanExtendText);

                                        spanExtend.addEventListener("click", function () {
                                            favoriteExend(item.parent_en);
                                        });

                                        h4.appendChild(spanExtend);
                                        favoriteListDiv.appendChild(h4);
                                    }

                                    var favoriteDivId = "favorite_div_" + item.parent_en;
                                    var favoriteDiv = document.getElementById(favoriteDivId);
                                    if (!favoriteDiv) {
                                        var div = document.createElement("div");
                                        div.id = favoriteDivId;
                                        div.classList.add("favorite_items_div");
                                        favoriteListDiv.appendChild(div);
                                        favoriteDiv = document.getElementById(favoriteDivId);
                                    }

                                    var newFavoriteItem = document.createElement("span");
                                    newFavoriteItem.classList.add("c_item");
                                    newFavoriteItem.classList.add("c_item_favorite");
                                    newFavoriteItem.dataset.item = item.sub_en;
                                    newFavoriteItem.dataset.parent_en = item.parent_en;
                                    newFavoriteItem.dataset.parent_zh = item.parent_zh;
                                    newFavoriteItem.dataset.sub_desc = item.sub_desc;
                                    newFavoriteItem.title = `${item.sub_zh} [${item.sub_en}]\n\n${item.sub_desc}`;

                                    var itemText = document.createTextNode(item.sub_zh);
                                    newFavoriteItem.appendChild(itemText);

                                    newFavoriteItem.addEventListener("click", function () {
                                        addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh, item.sub_desc);
                                    });

                                    favoriteDiv.appendChild(newFavoriteItem);

                                }
                            }

                            // 更新我的标签收藏
                            updateMyTagFavoriteTagHtml(() => {
                                setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                            }, () => { });

                            // 获取html并更新收藏html
                            saveFavoriteListHtml(favoriteListDiv.innerHTML, () => {
                                // 通知更新收藏列表
                                setDbSyncMessage(sync_favoriteList);

                                // 设置折叠
                                setFavoriteExpend();

                                // 完成
                                finishFavorite();
                            });
                        })
                    } else {
                        // 无更新
                        finishFavorite();
                    }
                }

                // 指定折叠
                function favoriteExend(parentEn) {
                    var h4 = document.getElementById("favorite_h4_" + parentEn);
                    var span = h4.querySelector("span");
                    read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
                        var expendData = [];
                        if (result && result.value) {
                            expendData = result.value;
                        }

                        if (span.innerHTML == "+") {
                            // 需要展开
                            span.innerHTML = "-";
                            document.getElementById("favorite_div_" + parentEn).style.display = "block";
                            if (expendData.indexOf(parentEn) != -1) {
                                expendData.remove(parentEn);
                            }
                        } else {
                            // 需要折叠
                            span.innerHTML = "+";
                            document.getElementById("favorite_div_" + parentEn).style.display = "none";
                            if (expendData.indexOf(parentEn) == -1) {
                                expendData.push(parentEn);
                            }
                        }

                        // 更新存储折叠信息
                        var settings_favoriteList_extend = {
                            item: table_Settings_Key_FavoriteList_Extend,
                            value: expendData
                        };

                        update(table_Settings, settings_favoriteList_extend, () => { }, () => { });

                    }, () => { });
                }

                // 收尾工作
                function finishFavorite() {
                    // 更新按钮状态
                    updateFavoriteListBtnStatus();

                    setTimeout(function () {
                        addFavoritesBtn.innerText = "完成 √";
                    }, 250);
                    setTimeout(function () {
                        addFavoritesBtn.innerText = "加入收藏";
                    }, 500);
                }
            }

            // 全部展开
            favoriteAllExtend.onclick = function () {
                var extendBtns = document.getElementsByClassName("favorite_extend");
                for (const i in extendBtns) {
                    if (Object.hasOwnProperty.call(extendBtns, i)) {
                        const btn = extendBtns[i];
                        if (btn.innerHTML != "-") {
                            btn.innerHTML = "-";
                        }
                    }
                }

                var favoriteItemsDiv = document.getElementsByClassName("favorite_items_div");
                for (const i in favoriteItemsDiv) {
                    if (Object.hasOwnProperty.call(favoriteItemsDiv, i)) {
                        const div = favoriteItemsDiv[i];
                        if (div.style.display != "block") {
                            div.style.display = "block";
                        }
                    }
                }

                // 清空折叠记录
                remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => {
                    // 通知折叠
                    setDbSyncMessage(sync_favoriteList_Extend);
                }, () => { });
            }

            // 全部折叠
            favoriteAllCollapse.onclick = function () {
                favoriteAllCollapse_Func();

                // 并更新存储全部的父级名称
                var settings_favoriteList_extend = {
                    item: table_Settings_Key_FavoriteList_Extend,
                    value: favoriteParentData
                };

                update(table_Settings, settings_favoriteList_extend, () => {
                    // 通知折叠
                    setDbSyncMessage(sync_favoriteList_Extend);
                }, () => { });
            }

            // 全部折叠 - 不含存储
            function favoriteAllCollapse_Func() {
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


            // 编辑
            var favoriteRemoveKeys = []; // 删除记录
            var favoriteDict = {}; // 当前存储记录
            favoriteEdit.onclick = function () {
                // 显示保存和取消按钮，隐藏编辑和清空按钮，以及展开折叠按钮和加入收藏按钮
                favoriteAllExtend.style.display = "none";
                favoriteAllCollapse.style.display = "none";
                favoriteSave.style.display = "block";
                favoriteCancel.style.display = "block";
                favoriteEdit.style.display = "none";
                favoriteClear.style.display = "none";
                addFavoritesBtn.style.display = "none";
                addFavoritesDisabledBtn.style.display = "block";

                // 隐藏备份和恢复按钮
                favoriteExport.style.display = "none";
                favoriteRecover.style.display = "none";

                // 隐藏收藏列表，方便用户取消时直接还原
                favoriteListDiv.style.display = "none";

                // 显示编辑列表, 读取本地收藏, 生成可删除的标签
                favoriteEditDiv.style.display = "block";

                var lastParentEn = '';
                var favoriteEditParentDiv;
                readAll(table_favoriteSubItems, (k, v) => {
                    favoriteDict[k] = v;
                    if (lastParentEn != v.parent_en) {
                        // 新建父级标签
                        lastParentEn = v.parent_en;
                        var h4 = document.createElement("h4");
                        h4.id = "favorite_edit_h4_" + v.parent_en;
                        var h4text = document.createTextNode(v.parent_zh);
                        h4.appendChild(h4text);
                        var spanClear = document.createElement("span");
                        spanClear.dataset.category = v.parent_en;
                        spanClear.classList.add("favorite_edit_clear");
                        var spanClearText = document.createTextNode("x");
                        spanClear.appendChild(spanClearText);
                        spanClear.addEventListener("click", function () {
                            // 清空父项和子项
                            removeEditorParent(v.parent_en);
                        });
                        h4.appendChild(spanClear);
                        favoriteEditDiv.appendChild(h4);

                        var div = document.createElement("div");
                        div.id = "favorite_edit_div_" + v.parent_en;
                        div.classList.add("favorite_edit_items_div");
                        favoriteEditDiv.appendChild(div);

                        favoriteEditParentDiv = document.getElementById(div.id);
                    }

                    var newEditorItem = document.createElement("span");
                    newEditorItem.classList.add("f_edit_item");
                    newEditorItem.id = "f_edit_item_" + v.sub_en;
                    newEditorItem.dataset.item = v.sub_en;
                    newEditorItem.dataset.parent_en = v.parent_en;
                    newEditorItem.dataset.parent_zh = v.parent_zh;
                    newEditorItem.title = v.sub_en;

                    var editorItemText = document.createTextNode(v.sub_zh + " X");
                    newEditorItem.appendChild(editorItemText);
                    favoriteEditDiv.appendChild(newEditorItem);

                    newEditorItem.addEventListener("click", function () {
                        removeEditorItem(v.parent_en, v.sub_en);
                    });

                    favoriteEditParentDiv.appendChild(newEditorItem);


                }, () => { });

                // 删除父子项
                function removeEditorParent(parentEn) {
                    var h4 = document.getElementById("favorite_edit_h4_" + parentEn);
                    h4.parentNode.removeChild(h4);
                    var div = document.getElementById("favorite_edit_div_" + parentEn);
                    div.parentNode.removeChild(div);

                    for (const key in favoriteDict) {
                        if (Object.hasOwnProperty.call(favoriteDict, key)) {
                            const item = favoriteDict[key];
                            if (item.parent_en == parentEn && favoriteRemoveKeys.indexOf(key) == -1) {
                                favoriteRemoveKeys.push(key);
                            }
                        }
                    }
                }

                // 删除子项
                function removeEditorItem(parentEn, subEn) {
                    // 如果没有子项了，就删除包裹的div，以及对应的标题h4
                    var item = document.getElementById("f_edit_item_" + subEn);
                    var editDiv = item.parentNode;
                    item.parentNode.removeChild(item);

                    if (editDiv.childNodes.length == 0) {
                        editDiv.parentNode.removeChild(editDiv);
                        var h4 = document.getElementById("favorite_edit_h4_" + parentEn);
                        h4.parentNode.removeChild(h4);
                    }

                    var key = `${parentEn}:${subEn}`;
                    if (favoriteRemoveKeys.indexOf(key) == -1) {
                        favoriteRemoveKeys.push(key);
                    }
                }

            }

            // 更新收藏模块按钮的显示隐藏
            function updateFavoriteListBtnStatus() {
                var favoriteItems = favoriteListDiv.querySelectorAll("span");
                if (favoriteItems.length == 0) {
                    favoriteAllExtend.style.display = "none";
                    favoriteAllCollapse.style.display = "none";
                    favoriteEdit.style.display = "none";
                    favoriteClear.style.display = "none";
                    favoriteSave.style.display = "none";
                    favoriteCancel.style.display = "none";
                    favoriteExport.style.display = "none";
                }
                else {
                    favoriteAllExtend.style.display = "block";
                    favoriteAllCollapse.style.display = "block";
                    favoriteEdit.style.display = "block";
                    favoriteClear.style.display = "block";
                    favoriteExport.style.display = "block";
                }
            }

            // 退出编辑模式，先改变按钮样式
            function editToFavoriteBtnStatus() {
                // 是否允许加入收藏
                if (checkDictNull(searchItemDict)) {
                    addFavoritesBtn.style.display = "none";
                    addFavoritesDisabledBtn.style.display = "block";
                }
                else {
                    addFavoritesBtn.style.display = "block";
                    addFavoritesDisabledBtn.style.display = "none";
                }

                // 更新收藏模块按钮的显示隐藏
                updateFavoriteListBtnStatus();

                // 隐藏保存和取消按钮
                favoriteSave.style.display = "none";
                favoriteCancel.style.display = "none";

                // 显示恢复按钮
                favoriteRecover.style.display = "block";
            }

            // 退出编辑模式
            function editToFavorite() {
                editToFavoriteBtnStatus();

                // 显示收藏列表
                favoriteListDiv.style.display = "block";

                // 隐藏并清空收藏编辑列表
                favoriteEditDiv.style.display = "none";
                favoriteEditDiv.innerHTML = "";
            }

            // 保存
            favoriteSave.onclick = function () {
                // 编辑删除
                var removeTotalCount = favoriteRemoveKeys.length;
                var removeIndex = 0;
                for (const i in favoriteRemoveKeys) {
                    if (Object.hasOwnProperty.call(favoriteRemoveKeys, i)) {
                        const removeKey = favoriteRemoveKeys[i];
                        remove(table_favoriteSubItems, removeKey, () => { removeIndex++; }, () => { removeIndex++; });
                    }
                }

                var t = setInterval(() => {
                    if (removeTotalCount == removeIndex) {
                        t && clearInterval(t);

                        // 更新我的标签收藏
                        updateMyTagFavoriteTagHtml(() => {
                            setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                        }, () => { });

                        // 更新收藏折叠
                        updateFavoriteExtend();
                    }
                }, 50);

                // 获取折叠菜单，然后依次从收藏表取一条数据，看能否找到，找不到一条就删掉折叠菜单
                function updateFavoriteExtend() {
                    read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
                        if (result && result.value) {
                            var delArray = [];
                            var extendArray = result.value;
                            var foundTotalCount = extendArray.length;
                            var foundIndex = 0;
                            for (const i in extendArray) {
                                if (Object.hasOwnProperty.call(extendArray, i)) {
                                    const parentEn = extendArray[i];
                                    readByIndex(table_favoriteSubItems, table_favoriteSubItems_index_parentEn, parentEn, result => {
                                        foundIndex++;
                                    }, () => {
                                        // 没找到
                                        delArray.push(parentEn);
                                        foundIndex++;
                                    });
                                }
                            }

                            var t = setInterval(() => {
                                if (foundTotalCount == foundIndex) {
                                    t && clearInterval(t);

                                    // 更新折叠数据
                                    var newExtendArray = getDiffSet(extendArray, delArray);
                                    var settings_favoriteList_extend = {
                                        item: table_Settings_Key_FavoriteList_Extend,
                                        value: newExtendArray
                                    };
                                    update(table_Settings, settings_favoriteList_extend, () => {
                                        // 重新生成收藏列表
                                        reBuildFavoriteList();
                                    }, () => {
                                    });
                                }
                            }, 50);
                        } else {
                            // 重新生成收藏列表
                            reBuildFavoriteList();
                        }
                    }, () => { });
                }


                function reBuildFavoriteList() {
                    // 清空收藏列表，根据编辑生成收藏列表
                    favoriteListDiv.innerHTML = "";

                    // 生成收藏列表
                    generalFavoriteListDiv(() => {
                        // 通知页面刷新
                        setDbSyncMessage(sync_favoriteList);

                        // 编辑列表清空
                        favoriteRemoveKeys = [];
                        favoriteDict = {};

                        // 设置收藏折叠
                        setFavoriteExpend();

                        // 退出编辑模式
                        editToFavorite();
                    });

                }
            }

            // 生成收藏列表、包含各种子项点击事件
            function generalFavoriteListDiv(func_compelete) {
                // 读取收藏表，生成 页面html
                var favoritesListHtml = ``;
                var lastParentEn = ``;
                readAll(table_favoriteSubItems, (k, v) => {
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
                    // 读完后操作
                    if (favoritesListHtml != ``) {
                        favoritesListHtml += `</div>`;
                    }

                    // 页面附加Html
                    favoriteListDiv.innerHTML = favoritesListHtml;

                    // 小项添加点击事件
                    favoriteItemsClick();

                    // 折叠菜单添加点击事件
                    favoriteExtendClick();

                    // 存储收藏Html
                    saveFavoriteListHtml(favoritesListHtml, () => {
                        func_compelete();
                    });
                })
            }

            // 取消
            favoriteCancel.onclick = editToFavorite;

            // 清空
            favoriteClear.onclick = function () {
                var confirmResult = confirm("是否清空本地收藏?");
                if (confirmResult) {
                    favoriteListDiv.innerHTML = "";

                    // 清空收藏Html
                    remove(table_Settings, table_Settings_key_FavoriteList_Html, () => {
                        // 通知收藏页面更新
                        setDbSyncMessage(sync_favoriteList);
                        // 更新收藏按钮
                        updateFavoriteListBtnStatus();
                    }, () => { });

                    // 清空收藏数据
                    clearTable(table_favoriteSubItems, () => { });

                    // 更新我的标签收藏
                    updateMyTagFavoriteTagHtml(() => {
                        setDbSyncMessage(sync_mytagsFavoriteTagUpdate);
                    }, () => { });

                    // 清空收藏折叠
                    remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => { }, () => { });
                }
            }

            // 备份
            favoriteExport.onclick = function () {
                var data = {};
                var count = 0;
                readAll(table_favoriteSubItems, (k, v) => {
                    data[k] = v;
                    count++;
                }, () => {
                    if (count == 0) {
                        alert("导出前，请先收藏标签");
                        return;
                    }

                    var result = {
                        count,
                        data
                    };

                    func_eh_ex(() => {
                        saveJSON(result, `EH收藏数据备份_${getCurrentDate(2)}.json`);
                    }, () => {
                        saveJSON(result, `EX收藏数据备份_${getCurrentDate(2)}.json`);
                    });
                });
            }

            // 恢复
            favoriteRecover.onclick = function () {
                favoriteUploadFiles.click();
            }

            // 上传
            favoriteUploadFiles.onchange = function () {
                var resultFile = favoriteUploadFiles.files[0];
                if (resultFile) {
                    var reader = new FileReader();
                    reader.readAsText(resultFile, 'UTF-8');

                    reader.onload = function (e) {
                        var fileContent = e.target.result;

                        // 判断是旧版本收藏列表，还是新版本收藏列表
                        var favoriteDb = JSON.parse(fileContent);
                        if (favoriteDb.data) {
                            // 检查数据完整性
                            if (favoriteDb.count == 0 || checkDictNull(favoriteDb.data)) {
                                alert('导入失败，备份数据为空');
                                return;
                            }

                            // 清空收藏列表数据
                            clearTable(table_favoriteSubItems, () => {
                                // 清空收藏列表
                                favoriteListDiv.innerHTML = "";
                                // 重新生成
                                firstUpdateFavoriteSubItems(favoriteDb.data, favoriteDb.count);
                            });

                        } else {
                            if (checkDictNull(favoriteDb)) {
                                alert('导入失败，备份数据为空');
                                return;
                            }


                            // 清空收藏列表数据
                            clearTable(table_favoriteSubItems, () => {
                                // 清空收藏列表
                                favoriteListDiv.innerHTML = "";
                                // 重新生成收藏列表
                                reBuildFavoriteByOldData(favoriteDb);
                            });
                        }

                        // 上传置空
                        favoriteUploadFiles.value = "";
                    }
                }
            }

            //#endregion

            //#region step5.1.dataSync.frontPage.js 首页数据同步

            window.onstorage = function (e) {
                try {
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
                            break;
                        case sync_setting_frontPageFontColor:
                            updateSettingFrontPageFontColor();
                            break;
                        case sync_frontPageSearchMode:
                            updateFrontPageSearchMode();
                            break;
                    }
                } catch (error) {
                    removeDbSyncMessage();
                }
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
                });
            }

            // 首页列表字体颜色
            function updateSettingFrontPageFontColor() {
                indexDbInit(() => {
                    initFontColor(() => {
                        if (listFontColorDiv.style.display == "block") {
                            var frontDiv = document.getElementById("div_fontColor_btn");
                            frontDiv.style.display = "none";
                        }
                    });
                });
            }

            // 首页搜索模式更新
            function updateFrontPageSearchMode() {
                indexDbInit(() => {
                    read(table_Settings, table_Settings_key_FrontPageSearchMode, result => {
                        var normalModeWrapperDiv = document.getElementById("div_normalMode_wrapper");
                        var searchModeDiv = document.getElementById("div_searchMode_btn");
                        var tagDiv = document.getElementById("div_ee8413b2");
                        var topVisibleDiv = document.getElementById("div_top_visible_btn");
                        var searchBoxDiv = document.getElementById("searchbox");

                        if (result && result.value == 1) {
                            // 纯搜索模式
                            normalModeWrapperDiv.style.display = "none";
                            searchBoxDiv.children[0].style.display = "block";
                            tagDiv.style.display = "none";
                            searchModeDiv.innerText = "标签模式";

                        } else {
                            // 标签模式
                            normalModeWrapperDiv.style.display = "block";
                            tagDiv.style.display = "block";
                            searchModeDiv.innerText = "纯搜索模式";

                            // 判断头部是否需要显示
                            var oldSearchDivVisible = getOldSearchDivVisible();
                            if (oldSearchDivVisible == 0) {
                                topVisibleDiv.innerText = "头部显示";
                                searchBoxDiv.children[0].style.display = "none";
                            } else {
                                topVisibleDiv.innerText = "头部隐藏";
                            }
                        }

                        removeDbSyncMessage();
                    }, () => {
                        removeDbSyncMessage();
                    });
                });
            }

            //#endregion

        });
    });
}

function detailPage() {
    // 检查页面是否存在警告
    if (checkBooksWarning()) return;

    // 头部数据更新
    detailDataUpdate();

    // 复制标题供其他脚本使用
    detailPageTitleCopy();

    // 页面其他元素
    detailPageTranslate();

    indexDbInit(() => {
        // 右侧按钮
        detailPageRightButtons();
        // 标签翻译
        detailTryUseOldData();
    });

    //#region step5.2.dataSync.detailPage.js 详情页数据同步

    window.onstorage = function (e) {
        try {
            switch (e.newValue) {
                case sync_googleTranslate_detailPage_title:
                    updateGoogleTranslateDetailPageTitle();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    // 详情页谷歌翻译标题
    function updateGoogleTranslateDetailPageTitle() {
        indexDbInit(() => {
            read(table_Settings, table_Settings_key_TranslateDetailPageTitles, result => {
                var translateCheckbox = document.getElementById("googleTranslateCheckbox");
                translateCheckbox.checked = result && result.value;
                translateDetailPageTitleDisplay();
                removeDbSyncMessage();
            }, () => { removeDbSyncMessage(); });
        })
    }

    //#endregion
}

//#endregion