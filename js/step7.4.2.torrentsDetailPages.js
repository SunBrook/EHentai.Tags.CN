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