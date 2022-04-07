//#region step3.1.frontTranslate.js 首页谷歌翻译

// 首页谷歌翻译：标签
function translateMainPageTitle() {
	var isChecked = document.getElementById("googleTranslateCheckbox").checked;

	// 更新存储
	var settings_translateFrontPageTitles = {
		item: table_Settings_key_TranslateFrontPageTitles,
		value: isChecked
	};
	update(table_Settings, settings_translateFrontPageTitles, () => { }, () => { });

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
					getGoogleTranslate(div.innerText, function (data) {
						var sentences = data.sentences;
						var longtext = '';
						for (const i in sentences) {
							if (Object.hasOwnProperty.call(sentences, i)) {
								const sentence = sentences[i];
								longtext += sentence.trans;
							}
						}
						div.innerText = longtext;
						div.dataset.translate = longtext;
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

function mainPageTranslate() {
	// 首页添加 Meta
	var meta = document.createElement("meta");
	meta.httpEquiv = "Content-Security-Policy";
	meta.content = "upgrade-insecure-requests";
	document.getElementsByTagName("head")[0].appendChild(meta);

	// 展示总数量
	var ip = document.getElementsByClassName("ip");
	if (ip.length > 0) {
		var ipElement = ip[0];
		var totalCount = ipElement.innerText.replace("Showing ", "").replace(" results", "");
		ipElement.innerText = `共 ${totalCount} 条记录`;
	}
	// 预览下拉框
	const dropData = {
		"Minimal": "标题 + 悬浮图",
		"Minimal+": "标题 + 悬浮图 + 账号收藏标签",
		"Compact": "标题 + 悬浮图 + 标签",
		"Extended": "标题 + 图片 + 标签",
		"Thumbnail": "标题 + 缩略图",
	}

	var dms = document.getElementById("dms");
	if (!dms) {
		// 没有搜索到记录
		var iw = document.getElementById("iw");
		if (iw) {
			getGoogleTranslate(iw.innerText, function (data) {

				var sentences = data.sentences;
				var longtext = '';
				for (const i in sentences) {
					if (Object.hasOwnProperty.call(sentences, i)) {
						const sentence = sentences[i];
						longtext += sentence.trans;
					}
				}

				iw.innerText = longtext;
			});
		}

		var ido = document.getElementsByClassName("ido");
		if (ido.length > 0) {
			var nullInfo = ido[0].lastChild.lastChild;
			if (nullInfo) {
				getGoogleTranslate(nullInfo.innerText, function (data) {

					var sentences = data.sentences;
					var longtext = '';
					for (const i in sentences) {
						if (Object.hasOwnProperty.call(sentences, i)) {
							const sentence = sentences[i];
							longtext += sentence.trans;
						}
					}
					nullInfo.innerText = longtext;
				});
			}
		}

		return;
	}
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
	dms.insertBefore(translateDiv, dms.lastChild);


	// 读取是否选中
	read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
		if (result && result.value) {
			translateCheckbox.setAttribute("checked", true);
			translateMainPageTitle();
		}
	}, () => { });

	// 表头
	const thData = {
		"": "作品类型",
		"Published": "上传日期",
		"Title": "标题",
		"Uploader": "上传人员"
	};
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

	// 作品类型
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
	var rightSelect = select[0];
	var gt = document.getElementsByClassName("gt");
	function translate(gt, i) {
		const item = gt[i];
		var ps_en = item.title;
		read(table_EhTagSubItems, ps_en, result => {
			if (result) {
				if (rightSelect.value == "e") {
					// 标题 + 图片 + 标签，单个子项
					item.innerText = result.sub_zh;
				} else {
					// 父子项
					item.innerText = `${result.parent_zh}:${result.sub_zh}`;
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

	// 子项
	var gtl = document.getElementsByClassName("gtl");
	for (const i in gtl) {
		if (Object.hasOwnProperty.call(gtl, i)) {
			const item = gtl[i];
			var ps_en = item.title;
			read(table_EhTagSubItems, ps_en, result => {
				if (result) {
					item.innerText = result.sub_zh;
				}
			}, () => { });

		}
	}
}

//#endregion