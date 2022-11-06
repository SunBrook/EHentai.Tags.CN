function enable_jump_mode(a) {
    document.getElementById(a + "jumpbox").innerHTML = '<input type="text" name="jump" id="' + a + 'jump" size="10" maxlength="10" placeholder="date or offset" title="Enter a year or date in YYYY, (YY)YY-MM or (YY)YY-MM-DD format to seek to, or the number of days to jump backwards or forwards, or a number followed by w, m and y to jump weeks, months or years respectively." onchange="update_jump_mode(\'' + a + "')\" onkeyup=\"update_jump_mode('" + a + "')\" />";
    document.getElementById(a + "jump").focus()
}
const matchyear = /^\d{4}$/;
const matchseek = /^\d{2,4}-\d{1,2}/;
const matchjump = /^\d+($|d$|w$|m$|y$|-$)/;

function update_jump_mode(e) {
    console.log("updating jump");
    var d = document.getElementById(e + "jump").value;
    var c = document.getElementById(e + "prev");
    var b = document.getElementById(e + "next");
    var a = false;
    if (d != undefined && d != "") {
        if (matchseek.test(d) || (matchyear.test(d) && parseInt(d) > 2006 && parseInt(d) < 2100)) {
            c.innerHTML = "&lt; Seek";
            b.innerHTML = "Seek &gt;";
            c.href = prevurl + "&seek=" + d;
            b.href = nexturl + "&seek=" + d;
            a = true
        } else {
            if (matchjump.test(d)) {
                c.innerHTML = "&lt; Jump";
                b.innerHTML = "Jump &gt;";
                c.href = prevurl + "&jump=" + d;
                b.href = nexturl + "&jump=" + d;
                a = true
            }
        }
    }
    if (!a) {
        c.innerHTML = "&lt; Prev";
        b.innerHTML = "Next &gt;";
        c.href = prevurl;
        b.href = nexturl
    }
}

function toggle_advsearch_pane(b) {
    b.innerHTML == "Hide Advanced Options" ? hide_advsearch_pane(b) : show_advsearch_pane(b)
}

function show_advsearch_pane(b) {
    var c = document.getElementById("advdiv");
    b.innerHTML = "Hide Advanced Options";
    c.style.display = "";
    c.innerHTML = '<input type="hidden" id="advsearch" name="advsearch" value="1" /><div class="searchadv">	<div>		<div><label class="lc"><input type="checkbox" name="f_sh" /><span></span> Browse Expunged Galleries</label></div>		<div><label class="lc"><input type="checkbox" name="f_sdt" /><span></span> Search Low-Power Tags</label></div>		<div><label class="lc"><input type="checkbox" name="f_sto" /><span></span> Require Gallery Torrent</label></div>	</div>	<div>		<div>Between <input type="text" id="f_spf" name="f_spf" size="4" maxlength="4" style="width:30px" /> and <input type="text" id="f_spt" name="f_spt" size="4" maxlength="4" style="width:30px" /> pages</div>		<div>Minimum Rating: <select id="f_srdd" name="f_srdd"><option value="0">Any Rating</option><option value="2">2 Stars</option><option value="3">3 Stars</option><option value="4">4 Stars</option><option value="5">5 Stars</option></select></div>	</div>	<div>		<div>Disable default filters for:</div>		<div><label class="lc"><input type="checkbox" name="f_sfl" /><span></span> Language</label></div>		<div><label class="lc"><input type="checkbox" name="f_sfu" /><span></span> Uploader</label></div>		<div><label class="lc"><input type="checkbox" name="f_sft" /><span></span> Tags</label></div>	</div></div>'
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
    c.innerHTML = '<form action="' + ulhost + 'image_lookup.php" method="post" enctype="multipart/form-data">	<div>Select a file to upload, then hit File Search. All public galleries containing this exact file will be displayed.</div>	<div><input type="file" name="sfile" size="40" /> <input type="submit" name="f_sfile" value="File Search" /></div>	<div>For color images, the system can also perform a similarity lookup to find resampled images.</div>	<div class="searchadv">		<div>			<div><label class="lc"><input type="checkbox" name="fs_similar" checked="checked" /><span></span> Use Similarity Scan</label></div>			<div><label class="lc"><input type="checkbox" name="fs_covers" /><span></span> Only Search Covers</label></div>		</div>	</div></form>'
}

function hide_filesearch_pane(b) {
    var c = document.getElementById("fsdiv");
    b.innerHTML = "Show File Search";
    c.style.display = "none";
    c.innerHTML = ""
}

function load_pane_image(c) {
    if (c != undefined) {
        var a = c.childNodes[0].childNodes[0];
        var b = a.getAttribute("data-src");
        if (b != undefined) {
            a.src = b;
            a.removeAttribute("data-src")
        }
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
    if (visible_pane > 0) {
        hide_image_pane(visible_pane)
    }
    var b = document.getElementById("it" + a);
    load_pane_image(b);
    b.style.visibility = "visible";
    document.getElementById("ic" + a).style.visibility = "visible";
    visible_pane = a
}

function hide_image_pane(a) {
    document.getElementById("it" + a).style.visibility = "hidden";
    document.getElementById("ic" + a).style.visibility = "hidden";
    visible_pane = 0
}

function update_favsel(b) {
    if ((b.value).match(/^fav([0-9])$/)) {
        var a = parseInt(b.value.replace("fav", ""));
        b.style.paddingLeft = "20px";
        b.style.backgroundPosition = "4px " + -(-2 + a * 19) + "px"
    } else {
        b.style.paddingLeft = "2px";
        b.style.backgroundPosition = "4px 20px"
    }
}

function toggle_category(b) {
    var a = document.getElementById("f_cats");
    var c = document.getElementById("cat_" + b);
    if (a.getAttribute("disabled")) {
        a.removeAttribute("disabled")
    }
    if (c.getAttribute("data-disabled")) {
        c.removeAttribute("data-disabled");
        a.value = parseInt(a.value) & (1023 ^ b)
    } else {
        c.setAttribute("data-disabled", 1);
        a.value = parseInt(a.value) | b
    }
}

function search_presubmit() {
    var c = document.getElementById("f_search");
    if (!c.value) {
        c.setAttribute("disabled", 1)
    }
    if (document.getElementById("advsearch") != undefined) {
        var b = document.getElementById("f_spf");
        var d = document.getElementById("f_spt");
        var a = document.getElementById("f_srdd");
        if (!b.value || b.value == "0") {
            b.setAttribute("disabled", 1)
        }
        if (!d.value || d.value == "0") {
            d.setAttribute("disabled", 1)
        }
        if (!a.value || a.value == "0") {
            a.setAttribute("disabled", 1)
        }
    }
}

function cancel_event(a) {
    a = a ? a : window.event;
    if (a.stopPropagation) {
        a.stopPropagation()
    }
    if (a.preventDefault) {
        a.preventDefault()
    }
    a.cancelBubble = true;
    a.cancel = true;
    a.returnValue = false;
    return false
};