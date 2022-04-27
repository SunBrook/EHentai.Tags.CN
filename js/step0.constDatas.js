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
const table_Settings_Key_Bg_Opacity = "f_bgOpacity";
const table_Settings_Key_Bg_Mask = "f_bgMask";
const table_Settings_key_FrontPageFontParentColor = "f_frontPageFontParentColor";
const table_Settings_key_FrontPageFontSubColor = "f_frontPageFontSubColor";
const table_Settings_Key_FrontPageFontSubHoverColor = "f_frontPageFontSubHoverColor";
const table_Settings_key_NewsPageTopImageVisible = "f_newsPageTopImageVisible";
const table_Settings_key_NewsPageTranslate = "f_newsPageTranslate";

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
	"Auto-Detect": "自动检测",
	"-": "-",
	"Afghanistan": "Afghanistan（阿富汗）",
	"Aland Islands": "Aland Islands（阿兰群岛）",
	"Albania": "Albania（阿尔巴尼亚）",
	"Algeria": "Algeria（阿尔及利亚）",
	"American Samoa": "American Samoa（美属萨摩亚）",
	"Andorra": "Andorra（安道尔）",
	"Angola": "Angola（安哥拉）",
	"Anguilla": "Anguilla（安圭拉）",
	"Antarctica": "Antarctica（南极洲）",
	"Antigua and Barbuda": "Antigua and Barbuda（安提瓜和巴布达）",
	"Argentina": "Argentina（阿根廷）",
	"Armenia": "Armenia（亚美尼亚）",
	"Aruba": "Aruba（阿鲁巴）",
	"Asia/Pacific Region": "Asia/Pacific Region（亚太地区）",
	"Australia": "Australia（澳大利亚）",
	"Austria": "Austria（奥地利）",
	"Azerbaijan": "",
	"Bahamas": "",
	"Bahrain": "",
	"Bangladesh": "",
	"Barbados": "",
	"Belarus": "",
	"Belgium": "",
	"Belize": "",
	"Benin": "",
	"Bermuda": "",
	"Bhutan": "",
	"Bolivia": "",
	"Bonaire Saint Eustatius and Saba": "",
	"Bosnia and Herzegovina": "",
	"Botswana": "",
	"Bouvet Island": "",
	"Brazil": "",
	"British Indian Ocean Territory": "",
	"Brunei Darussalam": "",
	"Bulgaria": "",
	"Burkina Faso": "",
	"Burundi": "",
	"Cambodia": "",
	"Cameroon": "",
	"Canada": "",
	"Cape Verde": "",
	"Cayman Islands": "",
	"Central African Republic": "",
	"Chad": "",
	"Chile": "",
	"China": "",
	"Christmas Island": "",
	"Cocos Islands": "",
	"Colombia": "",
	"Comoros": "",
	"Congo": "",
	"Congo The Democratic Republic of the": "",
	"Cook Islands": "",
	"Costa Rica": "",
	"Cote D'Ivoire": "",
	"Croatia": "",
	"Cuba": "",
	"Curacao": "",
	"Cyprus": "",
	"Czech Republic": "",
	"Denmark": "",
	"Djibouti": "",
	"Dominica": "",
	"Dominican Republic": "",
	"Ecuador": "",
	"Egypt": "",
	"El Salvador": "",
	"Equatorial Guinea": "",
	"Eritrea": "",
	"Estonia": "",
	"Ethiopia": "",
	"Europe": "",
	"Falkland Islands": "",
	"Faroe Islands": "",
	"Fiji": "",
	"Finland": "",
	"France": "",
	"French Guiana": "",
	"French Polynesia": "",
	"French Southern Territories": "",
	"Gabon": "",
	"Gambia": "",
	"Georgia": "",
	"Germany": "",
	"Ghana": "",
	"Gibraltar": "",
	"Greece": "",
	"Greenland": "",
	"Grenada": "",
	"Guadeloupe": "",
	"Guam": "",
	"Guatemala": "",
	"Guernsey": "",
	"Guinea": "",
	"Guinea-Bissau": "",
	"Guyana": "",
	"Haiti": "",
	"Heard Island and McDonald Islands": "",
	"Holy See (Vatican City State)": "",
	"Honduras": "",
	"Hong Kong": "",
	"Hungary": "",
	"Iceland": "",
	"India": "",
	"Indonesia": "",
	"Iran": "",
	"Iraq": "",
	"Ireland": "",
	"Isle of Man": "",
	"Israel": "",
	"Italy": "",
	"Jamaica": "",
	"Japan": "",
	"Jersey": "",
	"Jordan": "",
	"Kazakhstan": "",
	"Kenya": "",
	"Kiribati": "",
	"Kuwait": "",
	"Kyrgyzstan": "",
	"Lao People's Democratic Republic": "",
	"Latvia": "",
	"Lebanon": "",
	"Lesotho": "",
	"Liberia": "",
	"Libya": "",
	"Liechtenstein": "",
	"Lithuania": "",
	"Luxembourg": "",
	"Macau": "",
	"Macedonia": "",
	"Madagascar": "",
	"Malawi": "",
	"Malaysia": "",
	"Maldives": "",
	"Mali": "",
	"Malta": "",
	"Marshall Islands": "",
	"Martinique": "",
	"Mauritania": "",
	"Mauritius": "",
	"Mayotte": "",
	"Mexico": "",
	"Micronesia": "",
	"Moldova": "",
	"Monaco": "",
	"Mongolia": "",
	"Montenegro": "",
	"Montserrat": "",
	"Morocco": "",
	"Mozambique": "",
	"Myanmar": "",
	"Namibia": "",
	"Nauru": "",
	"Nepal": "",
	"Netherlands": "",
	"New Caledonia": "",
	"New Zealand": "",
	"Nicaragua": "",
	"Niger": "",
	"Nigeria": "",
	"Niue": "",
	"Norfolk Island": "",
	"North Korea": "",
	"Northern Mariana Islands": "",
	"Norway": "",
	"Oman": "",
	"Pakistan": "",
	"Palau": "",
	"Palestinian Territory": "",
	"Panama": "",
	"Papua New Guinea": "",
	"Paraguay": "",
	"Peru": "",
	"Philippines": "",
	"Pitcairn Islands": "",
	"Poland": "",
	"Portugal": "",
	"Puerto Rico": "",
	"Qatar": "",
	"Reunion": "",
	"Romania": "",
	"Russian Federation": "",
	"Rwanda": "",
	"Saint Barthelemy": "",
	"Saint Helena": "",
	"Saint Kitts and Nevis": "",
	"Saint Lucia": "",
	"Saint Martin": "",
	"Saint Pierre and Miquelon": "",
	"Saint Vincent and the Grenadines": "",
	"Samoa": "",
	"San Marino": "",
	"Sao Tome and Principe": "",
	"Saudi Arabia": "",
	"Senegal": "",
	"Serbia": "",
	"Seychelles": "",
	"Sierra Leone": "",
	"Singapore": "",
	"Sint Maarten": "",
	"Slovakia": "",
	"Slovenia": "",
	"Solomon Islands": "",
	"Somalia": "",
	"South Africa": "",
	"South Georgia and the South Sandwich Islands": "",
	"South Korea": "",
	"South Sudan": "",
	"Spain": "",
	"Sri Lanka": "",
	"Sudan": "",
	"Suriname": "",
	"Svalbard and Jan Mayen": "",
	"Swaziland": "",
	"Sweden": "",
	"Switzerland": "",
	"Syrian Arab Republic": "",
	"Taiwan": "",
	"Tajikistan": "",
	"Tanzania": "",
	"Thailand": "",
	"Timor-Leste": "",
	"Togo": "",
	"Tokelau": "",
	"Tonga": "",
	"Trinidad and Tobago": "",
	"Tunisia": "",
	"Turkey": "",
	"Turkmenistan": "",
	"Turks and Caicos Islands": "",
	"Tuvalu": "",
	"Uganda": "",
	"Ukraine": "",
	"United Arab Emirates": "",
	"United Kingdom": "",
	"United States": "",
	"United States Minor Outlying Islands": "",
	"Uruguay": "",
	"Uzbekistan": "",
	"Vanuatu": "",
	"Venezuela": "",
	"Vietnam": "Vietnam（越南）",
	"Virgin Islands British": "Virgin Islands British（英属维尔京群岛）",
	"Virgin Islands U.S.": "Virgin Islands U.S.A（美国维尔京群岛）",
	"Wallis and Futuna": "Wallis and Futuna（沃利斯和富图纳）",
	"Western Sahara": "Western Sahara（西撒哈拉）",
	"Yemen": "Yemen（也门）",
	"Zambia": "Zambia（赞比亚）",
	"Zimbabwe": "Zimbabwe（津巴布韦）"
}


//#endregion

//#endregion