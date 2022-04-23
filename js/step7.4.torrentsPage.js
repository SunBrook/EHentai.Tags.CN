//#region step7.4.torrentsPage.js 种子
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


    //TODO 标题翻译需要实现
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

//#endregion