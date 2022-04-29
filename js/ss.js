function toggle_advsearch_pane(b) {
    b.innerHTML == "Hide Advanced Options" ? hide_advsearch_pane(b) : show_advsearch_pane(b)
}

function show_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "Hide Advanced Options";
    c.style.display = "";
    c.innerHTML = '<input type="hidden" id="advsearch" name="advsearch" value="1" /><table class="itss">	<tr>		<td class="ic4"><input id="adv11" type="checkbox" name="f_sname" checked="checked" /> <label for="adv11">Search Gallery Name</label></td>		<td class="ic4"><input id="adv12" type="checkbox" name="f_stags" checked="checked" /> <label for="adv12">Search Gallery Tags</label></td>		<td class="ic2"><input id="adv13" type="checkbox" name="f_sdesc" colspan="2" /> <label for="adv13">Search Gallery Description</label></td>	</tr>	<tr>		<td class="ic2" colspan="2"><input id="adv31" type="checkbox" name="f_sh" /> <label for="adv31">Search Expunged Galleries</label></td>		<td class="ic2" colspan="2"><input id="adv16" type="checkbox" name="f_sto" /> <label for="adv16">Only Show Galleries With Torrents</label></td>	</tr>	<tr>		<td class="ic2" colspan="2"><input id="adv21" type="checkbox" name="f_sdt1" /> <label for="adv21">Search Low-Power Tags</label></td>		<td class="ic2" colspan="2"><input id="adv22" type="checkbox" name="f_sdt2" /> <label for="adv22">Search Downvoted Tags</label></td>	</tr>	<tr>		<td class="ic2" colspan="2">Between <input type="text" id="f_spf" name="f_spf" value="" size="4" maxlength="4" style="width:30px" /> and <input type="text" id="f_spt" name="f_spt" value="" size="4" maxlength="4" style="width:30px" /> pages</td>		<td class="ic2" colspan="2"><input id="adv32" type="checkbox" name="f_sr" /> <label for="adv32">Minimum Rating:</label> <select id="adv42" class="imr" name="f_srdd"><option value="2">2 stars</option><option value="3">3 stars</option><option value="4">4 stars</option><option value="5">5 stars</option></select></td>	</tr>	<tr>		<td class="ic1" colspan="4">Disable default filters for: <input id="adv51" type="checkbox" name="f_sfl" /> <label for="adv51">Language</label> <input id="adv52" type="checkbox" name="f_sfu" /> <label for="adv52">Uploader</label> <input id="adv53" type="checkbox" name="f_sft" /> <label for="adv53">Tags</label></td>	</tr></table>'
}

function hide_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "Show Advanced Options";
    c.style.display = "none";
    c.innerHTML = ""
}



function toggle_filesearch_pane(b) {
    b.innerHTML == "Hide File Search" ? hide_filesearch_pane(b) : show_filesearch_pane(b)
}

function show_filesearch_pane(b) {
    var c = document.getElementById("fsdiv");
    b.innerHTML = "Hide File Search";
    c.style.display = "";
    c.innerHTML = '<form action="' + ulhost + 'image_lookup.php" method="post" enctype="multipart/form-data"><div><p style="font-weight:bold">If you want to combine a file search with a category/keyword search, upload the file first.</p><p>Select a file to upload, then hit File Search. All public galleries containing this exact file will be displayed.</p><div><input type="file" name="sfile" size="40" /> <input type="submit" name="f_sfile" value="File Search" /></div><p>For color images, the system can also perform a similarity lookup to find resampled images.</p><table class="itsf">	<tr>		<td class="ic3"><input id="fs_similar" type="checkbox" name="fs_similar" checked="checked" /> <label for="fs_similar">Use Similarity Scan</label></td>		<td class="ic3"><input id="fs_covers" type="checkbox" name="fs_covers" /> <label for="fs_covers">Only Search Covers</label></td>		<td class="ic3"><input id="fs_exp" type="checkbox" name="fs_exp" /> <label for="fs_exp">Show Expunged</label></td>	</tr></table></div></form>'
}

function hide_filesearch_pane(b) {
    var c = document.getElementById("fsdiv");
    b.innerHTML = "Show File Search";
    c.style.display = "none"; c.innerHTML = ""
}

function load_pane_image(c) {
    if (c != undefined) {
        var a = c.childNodes[0].childNodes[0];
        var b = a.getAttribute("data-src");
        if (b != undefined) { a.src = b; a.removeAttribute("data-src") }
    }
}

function preload_pane_image(b, a) {
    setTimeout(function () {
        if (b > 0) {
            load_pane_image(document.getElementById("it" + b))
        }

        if (a > 0) {
            load_pane_image(document.getElementById("it" + a))
        }
    }, 100)
}

var visible_pane = 0;

function show_image_pane(a) {
    if (visible_pane > 0) { hide_image_pane(visible_pane) } var b = document.getElementById("it" + a); load_pane_image(b); b.style.visibility = "visible"; document.getElementById("ic" + a).style.visibility = "visible"; visible_pane = a
}

function hide_image_pane(a) {
    document.getElementById("it" + a).style.visibility = "hidden"; document.getElementById("ic" + a).style.visibility = "hidden"; visible_pane = 0
}

function update_favsel(b) {
    if ((b.value).match(/^fav([0-9])$/)) { var a = parseInt(b.value.replace("fav", "")); b.style.paddingLeft = "20px"; b.style.backgroundPosition = "4px " + -(-2 + a * 19) + "px" } else { b.style.paddingLeft = "2px"; b.style.backgroundPosition = "4px 20px" }
}

function toggle_category(b) {
    var a = document.getElementById("f_cats"); var c = document.getElementById("cat_" + b); if (a.getAttribute("disabled")) { a.removeAttribute("disabled") } if (c.getAttribute("data-disabled")) { c.removeAttribute("data-disabled"); a.value = parseInt(a.value) & (1023 ^ b) } else { c.setAttribute("data-disabled", 1); a.value = parseInt(a.value) | b }
}

function search_presubmit() {
    var b = document.getElementById("f_search"); if (!b.value) { b.setAttribute("disabled", 1) } if (!document.getElementById("adv32").checked) { document.getElementById("adv42").setAttribute("disabled", 1) } var a = document.getElementById("f_spf"); var c = document.getElementById("f_spt"); if (!a.value || a.value == "0") { a.setAttribute("disabled", 1) } if (!c.value || c.value == "0") { c.setAttribute("disabled", 1) }
}

function cancel_event(a) {
    a = a ? a : window.event; if (a.stopPropagation) { a.stopPropagation() } if (a.preventDefault) { a.preventDefault() } a.cancelBubble = true; a.cancel = true; a.returnValue = false; return false
};