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

// 搜索模式
const dbFrontPageSearchMode = "dbfrontPageSearchMode";

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
const table_Settings_key_FrontPageSearchMode = "f_frontPageSearchMode";

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

//#endregion