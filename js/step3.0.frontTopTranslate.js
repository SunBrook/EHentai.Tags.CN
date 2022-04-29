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

    // 显示高级选项、图片搜索
    var advancedDiv = nopms[1];
    var advanceLink = advancedDiv.children[0];
    advanceLink.innerText = "显示高级选项";
    advanceLink.onclick = function () {
        this.innerText == "隐藏高级选项" ? copyModify_hide_advsearch_pane(this) : copyModify_show_advsearch_pane(this)
    }

    if (advancedDiv.children.length > 1) {
        var fileSearchLink = advancedDiv.children[1];
        fileSearchLink.innerText = "显示图片搜索";
        fileSearchLink.onclick = function () {
            this.innerText == "隐藏图片搜索" ? copyModify_hide_filesearch_pane(this) : copyModify_show_filesearch_pane(this);
        }
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
                <label for="adv32">评分不低于:</label> <select id="adv42" class="imr" name="f_srdd">
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
    b.innerHTML = "隐藏图片搜索";
    c.style.display = "";
    c.innerHTML = '<form action="' + ulhost + 'image_lookup.php" method="post" enctype="multipart/form-data"><div><p style="font-weight:bold">If you want to combine a file search with a category/keyword search, upload the file first.</p><p>Select a file to upload, then hit File Search. All public galleries containing this exact file will be displayed.</p><div><input type="file" name="sfile" size="40" /> <input type="submit" name="f_sfile" value="File Search" /></div><p>For color images, the system can also perform a similarity lookup to find resampled images.</p><table class="itsf">	<tr>		<td class="ic3"><input id="fs_similar" type="checkbox" name="fs_similar" checked="checked" /> <label for="fs_similar">Use Similarity Scan</label></td>		<td class="ic3"><input id="fs_covers" type="checkbox" name="fs_covers" /> <label for="fs_covers">Only Search Covers</label></td>		<td class="ic3"><input id="fs_exp" type="checkbox" name="fs_exp" /> <label for="fs_exp">Show Expunged</label></td>	</tr></table></div></form>'
}

function copyModify_hide_filesearch_pane(b) {
    hide_filesearch_pane(b);
    b.innerText = "显示图片搜索";
}

//#endregion