//#region step4.1.detailTranslate.js 详情页翻译

// 头部添加词库更新提示
function detailDataUpdate() {
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    var gd2Div = document.getElementById("gd2");
    if (gd2Div) {
        gd2Div.appendChild(dataUpdateDiv);
    }
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
    // 需要添加一个隐藏的 Posted，用于 E-Hentai Downloader 的逻辑判断，否则会产生误判
    var td_posted = document.createElement("td");
    td_posted.classList.add("gdt1");
    td_posted.style.display = "none";
    td_posted.innerText = "Posted:";
    trList[0].firstChild.parentNode.insertBefore(td_posted, trList[0].children[1]);
    
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

    // 网页已经没有行数和尺寸功能
    // // 展示行数
    // var gdo2 = document.getElementById("gdo2").querySelectorAll("div");
    // for (const i in gdo2) {
    //     if (Object.hasOwnProperty.call(gdo2, i)) {
    //         const div = gdo2[i];
    //         div.innerText = div.innerText.replace("rows", "行");
    //     }
    // }

    // // 图片尺寸
    // var gdo4 = document.getElementById("gdo4").querySelectorAll("div");
    // gdo4[0].innerText = "小图";
    // gdo4[1].innerText = "大图";


    // 评论翻译
    var cdiv = document.getElementById("cdiv");
    var c1s = cdiv.querySelectorAll("div.c1");

    // 添加样式类，方便修改样式
    cdiv.classList.add("t_detail_comment");

    for (const i in c1s) {
        if (Object.hasOwnProperty.call(c1s, i)) {
            const c1 = c1s[i];

            var c2 = c1.children[0];

            // Posted on 04 May 2022, 11:21 by:   
            var c3 = c2.querySelector("div.c3");
            var postTime = trimEnd(c3.childNodes[0].data.replace("Posted on ", "").replace("by:", ""));
            var postTimeArray = postTime.split(",");
            c3.childNodes[0].data = `评论时间：${transDate(postTimeArray[0])}${postTimeArray[1]} ， 评论者：`;

            // EH 私信
            if (webHost == "e-hentai.org") {
                var pmImg = c3.children[1].children[0];
                pmImg.title = "发私信";
            }

            // 根据 c6 添加翻译功能
            var translateSpan = document.createElement("span");
            translateSpan.classList.add("comment_span");
            translateSpan.id = "googleTranslateSpan_" + i;
            var translateCheckbox = document.createElement("input");
            translateCheckbox.setAttribute("type", "checkbox");
            translateCheckbox.id = "googleTranslateCheckbox_" + i;
            translateCheckbox.dataset.translate_id = c1.querySelector("div.c6").id;
            var translateLabel = document.createElement("label");
            translateLabel.setAttribute("for", translateCheckbox.id);
            translateLabel.id = "translateLabel" + i;
            translateLabel.innerText = "翻译";

            translateSpan.appendChild(translateCheckbox);
            translateSpan.appendChild(translateLabel);
            c3.parentNode.insertBefore(translateSpan, c3);

            translateCheckbox.onclick = function (e) {
                var c6 = document.getElementById(e.target.dataset.translate_id);
                if (e.target.checked) {
                    // 选中事件
                    if (c6.dataset.trans_en) {
                        // 翻译过，直接替换
                        c6.innerText = c6.dataset.trans_en;
                    } else {
                        // 谷歌翻译
                        c6.title = c6.innerText;
                        c6.dataset.origin_html = c6.innerHTML;
                        var c6ChildNodes = c6.childNodes;
                        for (const i in c6ChildNodes) {
                            if (Object.hasOwnProperty.call(c6ChildNodes, i)) {
                                const item = c6ChildNodes[i];
                                if (item.nodeName == "#text" && item.data) {
                                    var span = document.createElement("span");
                                    span.innerText = item.data;
                                    item.parentNode.insertBefore(span, item);
                                    item.parentNode.removeChild(item);
                                    translatePageElement(span);
                                } else if (item.innerText) {
                                    translatePageElement(item);
                                }
                            }
                        }
                    }
                } else {
                    // 取消选中事件
                    if (c6.dataset.origin_html) {
                        c6.innerHTML = c6.dataset.origin_html;
                    }
                }
            }

            // [Vote+] [Vote-]
            var c4 = c2.querySelector("div.c4");
            if (c4) {
                if (c4.childNodes.length == 2 && c4.childNodes[1].data == "Uploader Comment") {
                    c4.childNodes[1].data = "上传者的评论";
                } else {

                    if (c4.childNodes.length == 3) {
                        // 编辑
                        c4.children[0].innerText = " 编辑 ";
                        var c6Id = c1.querySelector("div.c6").id.replace("comment_", "");
                        c4.children[0].onclick = function () {
                            edit_comment_copy(c6Id);
                            return false;
                        }
                    } else {
                        // 点赞
                        var leftBracket = c4.childNodes[0];
                        leftBracket.data = "\xa0";
                        var middleBracket = c4.childNodes[2];
                        middleBracket.data = "\xa0\xa0";
                        var rightBracket = c4.childNodes[4];
                        rightBracket.data = "\xa0";

                        var like = c4.children[0];
                        like.innerText = "[ 👍 ]";
                        like.title = "点赞";
                        var dislike = c4.children[1];
                        dislike.innerText = "[ 👎 ]";
                        dislike.title = "点踩";
                    }
                }
            }

            // Score +10
            var c5 = c2.querySelector("div.c5");
            if (c5) {
                c5.childNodes[0].data = "得分 \xa0";
            }

            // Last edited on 04 May 2022, 16:41.
            var c8 = c1.querySelector("div.c8");
            if (c8) {
                c8.childNodes[0].data = "最后编辑时间：";
                var strong = c8.children[0];
                var modifyTimeArray = strong.innerText.split(",");
                strong.innerText = `${transDate(modifyTimeArray[0])}${modifyTimeArray[1]}`;
            }

            // You did not enter a valid comment.
            var c6 = c1.querySelector("div.c6");
            if (c6) {
                var pbr = c6.querySelector("p.br");
                if (pbr) {
                    switch (pbr.innerText) {
                        case "You did not enter a valid comment.":
                            pbr.innerText = "您没有输入有效的评论";
                            break;
                        case "Your comment is too short.":
                            pbr.innerText = "评论写的太短了";
                            break;
                        default:
                            translatePageElement(pbr);
                            break;
                    }
                }

                var gce = c6.querySelector("div.gce");
                if (gce) {
                    var submitBtn = gce.querySelector("input:last-child");
                    submitBtn.value = "发布评论";
                }
            }
        }
    }

    var chd = document.getElementById("chd");
    if (chd.children.length == 2) {
        // 底部展开全部翻译
        var p1 = chd.children[0];
        p1.childNodes[0].data = p1.childNodes[0].data
            .replace("There are", "还有")
            .replace("There is", "还有")
            .replace("more comments below the viewing threshold", "评论未显示")
            .replace("more comment below the viewing threshold", "评论未显示");
        // 点击显示全部
        p1.children[0].innerText = "点击显示全部";
    }

    // 翻译评论功能
    var postnewcomment = document.getElementById("postnewcomment");
    postnewcomment.children[0].innerText = " 评 论 ";
    var formDiv = document.getElementById("formdiv");
    var mycommentInput = formDiv.querySelector("textarea");
    if (mycommentInput) {
        mycommentInput.setAttribute("placeholder", "在此处输入您的评论，然后点击发表评论。如果最后发布的评论是您的，则此评论将附加到该帖子中。");
    }
    var mycommentSubmit = formDiv.querySelector("input");
    if (mycommentSubmit) {
        mycommentSubmit.value = "发表评论";
    }
}

function edit_comment_copy(b) {
    if (comment_xhr != undefined) {
        return
    }
    comment_xhr = new XMLHttpRequest();
    var a = {
        method: "geteditcomment",
        apiuid: apiuid,
        apikey: apikey,
        gid: gid,
        token: token,
        comment_id: b
    };
    api_call(comment_xhr, a, make_comment_editable_copy);
}
function make_comment_editable_copy() {
    var a = api_response(comment_xhr);
    var formHtml = `${a.editable_comment}`;
    formHtml = formHtml.replace('<input type="submit" value="Edit Comment" />', '<input type="submit" value="发布评论" />');

    if (a != false) {
        if (a.error != undefined) {
            alert("Could not get editable comment: " + a.error)
        }
        if (a.comment_id != undefined) {
            document.getElementById("comment_" + a.comment_id).innerHTML = formHtml
        }
        comment_xhr = undefined
    }
}

// 作品查看页面
function detailReadPage() {
    var i6 = document.getElementById("i6");
    var links = i6.querySelectorAll("a");
    for (const i in links) {
        if (Object.hasOwnProperty.call(links, i)) {
            const link = links[i];
            if (detailReadPage_bottomLinkDict[link.innerText]) {
                link.innerText = detailReadPage_bottomLinkDict[link.innerText];
            }
        }
    }

    // 获取回到详情页面的地址，生成一个链接，插入最前面
    var backLink = document.createElement("a");
    backLink.innerText = "返回到详情页";
    backLink.href = document.getElementById("i5").querySelector("a").href;
    backLink.style.marginRight = "10px";

    var backImg = document.createElement("img");
    func_eh_ex(() => {
        backImg.src = "https://ehgt.org/g/mr.gif";
    }, () => {
        backImg.src = "https://exhentai.org/img/mr.gif";
    });

    backImg.classList.add("mr");
    backImg.style.marginRight = "4px";

    i6.children[0].parentNode.insertBefore(backLink, i6.children[0]);
    i6.children[0].parentNode.insertBefore(backImg, i6.children[0]);

    // 下载原始图片
    var i7 = document.getElementById("i7");
    var downloadLink = i7.querySelector("a");
    if (downloadLink) {
        downloadLink.innerText = downloadLink.innerText.replace("Download original", "下载原图").replace("source", "");
    }

    // 重新修改点击事件
    var sns = document.getElementsByClassName("sn");
    for (const i in sns) {
        if (Object.hasOwnProperty.call(sns, i)) {
            const sn = sns[i];
            var links = sn.querySelectorAll("a");
            var firstParams = links[0].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[0].onclick = function () {
                return _load_image_copy(firstParams[0], firstParams[1].replace(/\'/g, ""), false);
            }

            var prevParams = links[1].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[1].onclick = function () {
                return _load_image_copy(prevParams[0], prevParams[1].replace(/\'/g, ""), false);
            }

            var nextParams = links[2].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[2].onclick = function () {
                return _load_image_copy(nextParams[0], nextParams[1].replace(/\'/g, ""), false);
            }

            var lastParams = links[3].getAttribute("onclick").replace("return load_image(", "").replace(")", "").split(", ");
            links[3].onclick = function () {
                return _load_image_copy(lastParams[0], lastParams[1].replace(/\'/g, ""), false);
            }
        }
    }
}

function _load_image_copy(e, f, d) {
    if (holdingOverrideKey) {
        return true
    }
    var c = "s/" + f + "/" + gid + "-" + e;
    var a = base_url + c;
    if (!d) {
        if (load_cooldown) {
            return false
        } ++pcnt
    } else {
        --pcnt
    }
    if (history.pushState && (pcnt <= prl)) {
        if (dispatch_xhr != undefined) {
            return false
        }
        if (!d) {
            load_cooldown = true;
            setTimeout(function () {
                load_cooldown = false
            },
                1000)
        }
        dispatch_xhr = new XMLHttpRequest();
        var b = {
            method: "showpage",
            gid: gid,
            page: e,
            imgkey: f,
            showkey: showkey
        };
        api_call(dispatch_xhr, b,
            function () {
                load_image_dispatch_copy()
            });
        if (!d) {
            history.pushState({
                page: e,
                imgkey: f
            },
                document.title, a)
        }
    } else {
        pcnt = 0;
        document.location = a
    }
    return false
}

function load_image_dispatch_copy() {
    var a = api_response(dispatch_xhr);
    if (a != false) {
        if (a.error != undefined) {
            document.location = document.location + ""
        } else {
            history.replaceState({
                page: a.p,
                imgkey: a.k,
                json: a,
                expire: get_unixtime() + 300
            },
                document.title, base_url + a.s);

            a.n = a.n.replace(/load_image/g, "load_image_copy");

            a.i6 = a.i6
                .replace("Show all galleries with this file", "显示包含此图片的所有作品")
                .replace("Click here if the image fails loading", "重新加载图片")
                .replace("Generate a static forum image link", "生成用于论坛的图片链接");
            func_eh_ex(() => {
                a.i6 = ` &nbsp; <img src=\"https://ehgt.org/g/mr.gif\" class=\"mr\" /> <a href="https://exhentai.org/g/2211477/40853439b7/">返回到详情页</a>${a.i6}`;
            }, () => {
                a.i6 = ` &nbsp; <img src=\"https://exhentai.org/img/mr.gif\" class=\"mr\" /> <a href="https://exhentai.org/g/2211477/40853439b7/">返回到详情页</a>${a.i6}`;
            });


            a.i7 = a.i7.replace("Download original", "下载原图").replace("source", "");
            apply_json_state_copy(a)
        }
        dispatch_xhr = undefined
    }
}

function apply_json_state_copy(a) {
    window.scrollTo(0, 0);
    document.getElementById("i1").style.width = a.x + "px";
    document.getElementById("i2").innerHTML = a.n + a.i;
    document.getElementById("i3").innerHTML = a.i3;
    document.getElementById("i4").innerHTML = a.i + a.n;
    document.getElementById("i5").innerHTML = a.i5;
    document.getElementById("i6").innerHTML = a.i6;
    document.getElementById("i7").innerHTML = a.i7;
    si = parseInt(a.si);
    xres = parseInt(a.x);
    yres = parseInt(a.y);
    update_window_extents()
}

// 作品详情页面，可能会弹出不适合所有人查看的作品警告，如果出现则翻译谷歌翻译文本，且跳过页面后续的执行操作
function checkBooksWarning() {
    var gm = document.querySelector("div.gm");
    if (!gm) {
        var nb = document.getElementById("nb");
        var warnDiv = nb.nextElementSibling;
        if (warnDiv) {
            // 跨域
            crossDomain();

            // 翻译警告信息
            recursionDetailPageWarnTranslate(warnDiv);
        }

        return true; // 警告页面
    }

    return false; // 无警告
}

function recursionDetailPageWarnTranslate(element) {
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
            recursionDetailPageWarnTranslate(child);
        } else if (child.innerText) {
            child.title = child.innerText;
            if (detailPage_warnContentDict[child.innerText]) {
                child.innerText = detailPage_warnContentDict[child.innerText];
            } else {
                // 谷歌机翻
                translatePageElement(child);
            }
        }
    }
}

//#endregion