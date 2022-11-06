//#region step1.3.newPaging 新版本分页功能翻译

function TranslateNewPagingLinks() {
    var ufirst = document.getElementById("ufirst");
    if (ufirst) {
        ufirst.innerText = "最新";
    }
    var dfirst = document.getElementById("dfirst");
    if (dfirst) {
        dfirst.innerText = "最新";
    }

    var uprev = document.getElementById("uprev");
    if (uprev) {
        uprev.innerText = "← 新页";
    }
    var dprev = document.getElementById("dprev");
    if (dprev) {
        dprev.innerText = "← 新页";
    }

    var unext = document.getElementById("unext");
    if (unext) {
        unext.innerText = "旧页 →"
    }
    var dnext = document.getElementById("dnext");
    if (dnext) {
        dnext.innerText = "旧页 →"
    }

    var ulast = document.getElementById("ulast");
    if (ulast) {
        ulast.innerText = "最旧";
    }
    var dlast = document.getElementById("dlast");
    if (dlast) {
        dlast.innerText = "最旧";
    }


    var ujump = document.getElementById("ujump");
    if (ujump) {
        ujump.innerText = "跳转/搜索";
    }
    var djump = document.getElementById("djump");
    if (djump) {
        djump.innerText = "跳转/搜索";
    }

    
    // ujump.addEventListener("click",function(){
    //     copy_enable_jump_mode('u');
    // });
    
    // function copy_enable_jump_mode(a) {
    //     document.getElementById(a + "jumpbox").innerHTML = '<input type="text" name="jump" id="' + a + 'jump" size="10" maxlength="10" placeholder="日期或范围" title="输入年份例如后面括号内容可以省略 2022，或者年月(20)22-11，或者年月日(20)22-11-11， 来查询。\n另外一种方式是向前/后跳转指定的周数，月数，年数,1周填写1w，2个月填写2m，3年填写3y，然后点击旁边的连接进行查询" onchange="copy_update_jump_mode(\'' + a + "')\" onkeyup=\"copy_update_jump_mode('" + a + "')\" />";
    //     document.getElementById(a + "jump").focus()
    // }

}

function copy_update_jump_mode(e) {
    var d = document.getElementById(e + "jump").value;
    var c = document.getElementById(e + "prev");
    var b = document.getElementById(e + "next");
    var a = false;
    if (d != undefined && d != "") {
        if (matchseek.test(d) || (matchyear.test(d) && parseInt(d) > 2006 && parseInt(d) < 2100)) {
            c.innerHTML = "← 搜索";
            b.innerHTML = "搜索 →";
            c.href = prevurl + "&seek=" + d;
            b.href = nexturl + "&seek=" + d;
            a = true
        } else {
            if (matchjump.test(d)) {
                c.innerHTML = "← 跳转";
                b.innerHTML = "跳转 →";
                c.href = prevurl + "&jump=" + d;
                b.href = nexturl + "&jump=" + d;
                a = true
            }
        }
    }
    if (!a) {
        c.innerHTML = "← 新页";
        b.innerHTML = "旧页 →";
        c.href = prevurl;
        b.href = nexturl
    }
}



//#endregion