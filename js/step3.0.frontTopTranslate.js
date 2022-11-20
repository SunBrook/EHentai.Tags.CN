//#region step3.0.frontTopTranslate.js 首页头部翻译

function frontTopOldSearchTranslate() {


    // 搜索框 和 按钮翻译
    // var searchDiv = nopms[0];
    var fSerach = document.getElementById("f_search");

    fSerach.parentNode.className = "nopm";
    fSerach.parentNode.nextSibling.className = "nopm";
    

    var nopms = document.getElementsByClassName("nopm");

    fSerach.setAttribute("placeholder", "搜索关键字");
    if (fSerach.value) {
        var searchValue = fSerach.value;
        if (searchValue.charAt(searchValue.length - 1) != " ") {
            fSerach.value += " ";
        }
    }
    var searchSubmitBtn = fSerach.nextSibling;
    searchSubmitBtn.value = "搜索";
    var searchClearBtn = searchSubmitBtn.nextSibling;
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
    }
}


function copyModify_show_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "隐藏高级选项";
    c.style.display = "";
    c.innerHTML = `<input type="hidden" id="advsearch" name="advsearch" value="1" />
    <table class="itss" style="margin: 0 auto; width: 90%;">
        <tr>
            <td class="ic4" style="text-align: left;">
                <input id="adv11" type="checkbox" name="f_sname" checked="checked" />
                <label for="adv11">搜索作品名称</label>
            </td>
            <td class="ic4" style="position: relative; left: 11%;text-align: center;"><input id="adv12" type="checkbox" name="f_stags" checked="checked" />
                <label for="adv12">搜索标签</label>
            </td>
            <td class="ic2" style="text-align: right;"><input id="adv13" type="checkbox" name="f_sdesc" colspan="2" />
                <label for="adv13">搜索描述</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2" style="text-align: left;"><input id="adv31" type="checkbox" name="f_sh" />
                <label for="adv31">搜索已经删除的作品</label>
            </td>
            <td class="ic2" colspan="2" style="text-align: right;"><input id="adv16" type="checkbox" name="f_sto" />
                <label for="adv16">只显示有种子的作品</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2" style="text-align: left;">
                <input id="adv21" type="checkbox" name="f_sdt1" />
                <label for="adv21">搜索低权重的标签</label>
            </td>
            <td class="ic2" colspan="2" style="text-align: right;">
                <input id="adv22" type="checkbox" name="f_sdt2" />
                <label for="adv22">搜索被否决的标签</label>
            </td>
        </tr>
        <tr>
            <td class="ic2" colspan="2" style="text-align: left;">搜索
                <input type="text" id="f_spf" name="f_spf" value="" size="4" maxlength="4" style="width:30px" /> 至
                <input type="text" id="f_spt" name="f_spt" value="" size="4" maxlength="4" style="width:30px" />
                页
            </td>
            <td class="ic2" colspan="2" style="text-align: right;"><input id="adv32" type="checkbox" name="f_sr" />
                <label for="adv32">评分不低于：</label> <select id="adv42" class="imr" name="f_srdd">
                    <option value="2">2 星</option>
                    <option value="3">3 星</option>
                    <option value="4">4 星</option>
                    <option value="5">5 星</option>
                </select>
            </td>
        </tr>
        <tr>
            <td class="ic1" colspan="4" style="text-align: center;">默认禁用筛选：
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

//#endregion