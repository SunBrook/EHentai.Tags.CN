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
            console.log(e);
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