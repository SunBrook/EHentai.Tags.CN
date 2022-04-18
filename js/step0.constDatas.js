//#region step0.constDatas.js 数据字典

//#region 头部菜单

const fontMenusData = {
	"Front Page": "首页",
	"Watched": "偏好",
	"Popular": "热门",
	"Torrents": "种子",
	"Favorites": "收藏",
	"Settings": "设置",
	"My Uploads": "我的上传",
	"My Tags": "我的标签",
	"My Home": "我的主页",
	"Toplists": "排行榜",
	"Bounties": "悬赏",
	"News": "新闻",
	"Forums": "论坛",
	"Wiki": "维基百科",
	"HentaiVerse": "變態之道(游戏)"
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
	"Title": "标题",
	"Uploader": "上传人员"
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
const table_Settings_key_FavoriteList = "f_favoriteList";
const table_Settings_key_FavoriteList_Html = "f_favoriteListHtml";
const table_Settings_Key_FavoriteList_Extend = "f_favoriteListExtend";
const table_Settings_Key_Bg_ImgBase64 = "f_bgImageBase64";
const table_Settings_Key_Bg_Opacity = "f_bgOpacity";
const table_Settings_Key_Bg_Mask = "f_bgMask";
const table_Settings_key_FrontPageFontParentColor = "f_frontPageFontParentColor";
const table_Settings_key_FrontPageFontSubColor = "f_frontPageFontSubColor";
const table_Settings_Key_FrontPageFontSubHoverColor = "f_frontPageFontSubHoverColor";

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

//#endregion