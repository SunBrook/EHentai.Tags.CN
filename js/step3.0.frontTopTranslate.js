//#region step3.0.frontTopTranslate.js 首页头部翻译

function frontTopOldSearchTranslate() {
    var nopms = document.getElementsByClassName("nopm");

    // 搜索框 和 按钮翻译
    var searchDiv = nopms[0];
    var fSerach = document.getElementById("f_search");
    fSerach.setAttribute("placeholder", "搜索关键字");
    var searchSubmitBtn = searchDiv.children[1];
    searchSubmitBtn.value = "搜索";
    var searchClearBtn = searchDiv.children[2];
    searchClearBtn.value = "清空";

    // 显示高级选项
    if (nopms.length > 1) {
        var advancedDiv = nopms[1];
        if (advancedDiv.children.length > 0) {
            var advanceLink = advancedDiv.children[0];
            advanceLink.innerText = "显示高级选项";
            advanceLink.onclick = function () {
                this.innerText == "隐藏高级选项" ? copyModify_hide_advsearch_pane(this) : copyModify_show_advsearch_pane(this)
            }

            // 如果高级选项存在，则直接翻译
            checkAdvSearchDiv(advanceLink);
        }

        // 文件搜索
        if (advancedDiv.children.length > 1) {
            // 将 fsdiv 挪到 searchbox 最后一位
            var fsdiv = document.getElementById("fsdiv");
            fsdiv.parentNode.removeChild(fsdiv);

            var searchbox = document.getElementById("searchbox");
            searchbox.appendChild(fsdiv);


            var fileSearchLink = advancedDiv.children[1];
            fileSearchLink.innerText = "显示文件搜索";
            fileSearchLink.onclick = function () {
                this.innerText == "隐藏文件搜索" ? copyModify_hide_filesearch_pane(this) : copyModify_show_filesearch_pane(this);
            }

            // 如果文件搜索存在，则直接翻译
            checkFsDiv(fileSearchLink);
        }
    } else {
        // 搜索图片结果
        var fileSearchResultDiv = nopms[0].nextElementSibling;
        frontPageTranslateFileSearchResult(fileSearchResultDiv);
    }


}


function copyModify_show_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "隐藏高级选项";
    c.style.display = "";
    c.innerHTML = `<input type="hidden" id="advsearch" name="advsearch" value="1" />
    <table class="itss">
        <tr>
            <td class="ic4">
                <input id="adv11" type="checkbox" name="f_sname" checked="checked" />
                <label for="adv11">搜索作品名称</label>
            </td>
            <td class="ic4"><input id="adv12" type="checkbox" name="f_stags" checked="checked" />
                <label for="adv12">搜索标签</label>
            </td>
            <td class="ic2"><input id="adv13" type="checkbox" name="f_sdesc" colspan="2" />
                <label for="adv13">搜索描述</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2"><input id="adv31" type="checkbox" name="f_sh" />
                <label for="adv31">搜索已经删除的作品</label>
            </td>
            <td class="ic2" colspan="2"><input id="adv16" type="checkbox" name="f_sto" />
                <label for="adv16">只显示有种子的作品</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2">
                <input id="adv21" type="checkbox" name="f_sdt1" />
                <label for="adv21">搜索低权重的标签</label>
            </td>
            <td class="ic2" colspan="2">
                <input id="adv22" type="checkbox" name="f_sdt2" />
                <label for="adv22">搜索被否决的标签</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2">搜索
                <input type="text" id="f_spf" name="f_spf" value="" size="4" maxlength="4" style="width:30px" /> 至
                <input type="text" id="f_spt" name="f_spt" value="" size="4" maxlength="4" style="width:30px" />
                页
            </td>
            <td class="ic2" colspan="2"><input id="adv32" type="checkbox" name="f_sr" />
                <label for="adv32">评分不低于：</label> <select id="adv42" class="imr" name="f_srdd">
                    <option value="2">2 星</option>
                    <option value="3">3 星</option>
                    <option value="4">4 星</option>
                    <option value="5">5 星</option>
                </select>
            </td>
        </tr>
        <tr>
            <td class="ic1" colspan="4">默认禁用筛选：
                <input id="adv51" type="checkbox" name="f_sfl" />
                <label for="adv51">语言</label>
                <input id="adv52" type="checkbox" name="f_sfu" />
                <label for="adv52">上传者</label>
                <input id="adv53" type="checkbox" name="f_sft" />
                <label for="adv53">标签</label>
            </td>
        </tr>
    </table>`;
}

function copyModify_hide_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "显示高级选项";
    c.style.display = "none";
    c.innerHTML = "";
}

function copyModify_show_filesearch_pane(b) {
    var c = document.getElementById("fsdiv");
    b.innerHTML = "隐藏文件搜索";
    c.style.display = "";
    c.innerHTML = `<form action="${ulhost}image_lookup.php" method="post" enctype="multipart/form-data">
    <div>
        <p style="font-weight:bold">如果要将 文件 和 类别或关键词 结合起来搜索，请先上传文件。</p>
        <p>选择要搜索的图片文件，然后点击文件搜索按钮。搜索结果将显示包含此文件的所有公开作品。</p>
        <div><input type="file" name="sfile" size="40" />
            <input type="submit" name="f_sfile" value="文件搜索" />
        </div>
        <p>对于彩色图片，系统还可以执行相似性查找以查找重新采样的图片。</p>
        <table class="itsf">
            <tr>
                <td class="ic3">
                    <input id="fs_similar" type="checkbox" name="fs_similar" checked="checked" />
                    <label for="fs_similar">使用相似度搜索</label>
                </td>
                <td class="ic3"><input id="fs_covers" type="checkbox" name="fs_covers" />
                    <label for="fs_covers">仅搜索封面</label>
                </td>
                <td class="ic3">
                    <input id="fs_exp" type="checkbox" name="fs_exp" />
                    <label for="fs_exp">显示已删除的作品</label>
                </td>
            </tr>
        </table>
    </div>
</form>`
}

function copyModify_hide_filesearch_pane(b) {
    var c = document.getElementById("fsdiv");
    b.innerHTML = "显示文件搜索";
    c.style.display = "none"; c.innerHTML = ""
}

function checkAdvSearchDiv(advanceLink) {
    var advdiv = document.getElementById("advdiv");
    if (advdiv.innerHTML) {
        var trs = advdiv.querySelectorAll("tr");
        trs[0].children[0].children[1].innerText = "搜索作品名称";
        trs[0].children[1].children[1].innerText = "搜索标签";
        trs[0].children[2].children[1].innerText = "搜索描述";
        trs[1].children[0].children[1].innerText = "搜索已经删除的作品";
        trs[1].children[1].children[1].innerText = "只显示有种子的作品";
        trs[2].children[0].children[1].innerText = "搜索低权重的标签";
        trs[2].children[1].children[1].innerText = "搜索被否决的标签";

        var tdPages = trs[3].children[0].childNodes;
        tdPages[0].data = "搜索 ";
        tdPages[2].data = " 至 ";
        tdPages[4].data = " 页";

        trs[3].children[1].children[1].innerText = "评分不低于：";
        var tdOptions = trs[3].children[1].children[2].querySelectorAll("option");
        for (const i in tdOptions) {
            if (Object.hasOwnProperty.call(tdOptions, i)) {
                const option = tdOptions[i];
                option.innerText = option.innerText.replace("stars", "星");
            }
        }

        trs[4].children[0].childNodes[0].data = "默认禁用筛选： ";
        trs[4].children[0].children[1].innerText = "语言";
        trs[4].children[0].children[3].innerText = "上传者";
        trs[4].children[0].children[5].innerText = "标签";

        advanceLink.innerText = "隐藏高级选项";
    }
}

function checkFsDiv(fileSearchLink) {
    var fsDiv = document.getElementById("fsdiv");
    if (fsDiv.innerHTML) {
        var ps = fsDiv.querySelectorAll("p");
        ps[0].innerText = "如果要将 文件 和 类别或关键词 结合起来搜索，请先上传文件。";
        ps[1].innerText = "选择要搜索的图片文件，然后点击文件搜索按钮。搜索结果将显示包含此文件的所有公开作品。";
        ps[2].innerText = "对于彩色图片，系统还可以执行相似性查找以查找重新采样的图片。";
        fsDiv.querySelectorAll("input")[1].value = "文件搜索";
        var tds = fsDiv.querySelectorAll("td");
        tds[0].children[1].innerText = "使用相似度搜索";
        tds[1].children[1].innerText = "仅搜索封面";
        tds[2].children[1].innerText = "显示已删除的作品";

        fileSearchLink.innerText = "隐藏文件搜索";
    }
}

function frontPageTranslateFileSearchResult(fileSearchResultDiv) {
    fileSearchResultDiv.children[3].innerText = "搜索的文件：";
    var tip = fileSearchResultDiv.children[5];
    var isEnableSimilarSearch = tip.children[0].innerText == "enabled";
    tip.innerHTML = `在本次搜索中，相似性查询 <strong>${isEnableSimilarSearch ? "已启用" : "已禁用"}</strong>。若要更改相似性查询的设置，你必须重新搜索。`;
    var options = fileSearchResultDiv.children[6].querySelectorAll("td");
    options[0].children[1].innerText = "仅搜索封面";
    options[1].children[1].innerText = "显示已删除的作品";
    fileSearchResultDiv.children[7].children[0].innerText = "搜索新文件";
}

//#endregion