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