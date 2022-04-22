//#region step4.1.detailTranslate.js 详情页翻译

// 头部添加词库更新提示
function detailDataUpdate() {
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    var gd2Div = document.getElementById("gd2");
    gd2Div.appendChild(dataUpdateDiv);
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

}

//#endregion