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


    // 修改难看的滚动条

    // 翻译页面固定元素

    // 谷歌机翻：上传者留言，这个按钮设置从存储中读取，包括同步该事件

}

function torrentsDetailInfo() {
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
            console.log(e);
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
            read(table_Settings, sync_googleTranslate_torrentDetailInfo_command, result => {
                var translateCheckbox = document.getElementById("googleTranslateCheckbox");
                console.log(result);
                translateCheckbox.checked = result && result.value;
                translateTorrentDetailInfoCommandDisplay();
                removeDbSyncMessage();
                
            }, () => { removeDbSyncMessage(); });
        })
    }
}


function torrentsDetailIndex() {

}

//#endregion