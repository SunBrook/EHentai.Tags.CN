//#region step7.8.uconfigPage.js 设置页面

function uconfigPage() {
    // 跨域
    crossDomain();

    // 添加样式方便调整页面样式
    var outer = document.getElementById("outer");
    outer.classList.add("t_uconfigPage_outer");


    // 样式：字体大小、标题大小、每块间隔调整

    // 如果匹配不成功，则谷歌机翻

    // 头部是否添加滚动定位条，用于联动

    // 头部和定位固定在头部

    // 头部翻译
    uconfigPageTopDiv();

    var contentForm = outer.querySelectorAll("form")[1];

    // Image Load Settings
    uconfigImageLoadSettings(contentForm);

    // Image Size Settings
    // Gallery Name Display
    // Archiver Settings
    // Front Page Settings
    // Favorites
    // Ratings
    // Tag Namespaces
    // Tag Filtering Threshold
    // Tag Watching Threshold
    // Excluded Languages
    // Excluded Uploaders
    // Search Result Count
    // Thumbnail Settings
    // Thumbnail Scaling
    // Viewport Override
    // Gallery Comments
    // Gallery Tags
    // Gallery Page Numbering


}

// 头部翻译
function uconfigPageTopDiv() {
    var profileOuter = document.getElementById("profile_outer");
    var profileForm = document.getElementById("profile_form");
    var profileAction = document.getElementById("profile_action");
    var profileName = document.getElementById("profile_name");
    var select = profileForm.querySelectorAll("select")[0];

    var profileSelect = document.getElementById("profile_select");
    var selectProfile = profileSelect.children[0];
    var profileActionDiv = profileOuter.querySelector("div#profile_action");
    if (profileActionDiv.children.length > 0) {
        // 删除配置
        var deletebtn = profileActionDiv.children[0];
        deletebtn.value = "删除配置";
        deletebtn.onclick = function () {
            var selectedIndex = select.selectedIndex;
            var selectText = select.options[selectedIndex].text;
            if (confirm(`是否删除配置："${selectText}" ?`)) {
                profileAction.value = "delete";
                profileForm.submit();
            }
        }

        // 设置为默认
        var defaultBtn = profileActionDiv.children[1];
        defaultBtn.value = "设为默认";
        defaultBtn.onclick = function () {
            var selectedIndex = select.selectedIndex;
            var selectText = select.options[selectedIndex].text;
            if (confirm(`将配置："${selectText}" 设为默认?`)) {
                profileAction.value = "default";
                profileForm.submit();
            }
        }

        selectProfile.innerText = "配置名称：";
    } else {
        selectProfile.innerText = "配置名称 [ 使用中 ] ：";
    }

    var topbtnDiv = profileSelect.children[2];
    var renameBtn = topbtnDiv.children[0];
    renameBtn.value = "重命名";

    var promptTips = "\r\n\r\n -- 建议 -- \r\n1. 请输入英文、数字，不支持中文等其他语种。\r\n2. 输入字符长度不能超过20。\r\n3. 尽量不要使用默认名称 \"Default Profile\"，如果使用该默认名称，在存在多个配置页情况下，设置默认配置页时，配置名称会互换。";

    renameBtn.onclick = function () {
        var promptText = `重命名：请输入配置名称 ${promptTips}`;
        var selectedIndex = select.selectedIndex;
        var selectText = select.options[selectedIndex].text.replace(" (Default)", "");
        var name = prompt(promptText, selectText);
        if (name != null) {
            profileAction.value = "rename";
            profileName.value = name;
            profileForm.submit();
        }
    }

    if (topbtnDiv.children.length > 1) {
        var createNewBtn = topbtnDiv.children[1];
        createNewBtn.value = "新建配置";
        createNewBtn.onclick = function () {
            var promptText = `新建配置：请输入配置名称 ${promptTips}`;
            var name = prompt(promptText, "New Profile");
            if (name != null) {
                profileAction.value = "create";
                profileName.value = name;
                profileForm.submit();
            }
        }
    }

    // 错误提示
    var msgDiv = document.getElementById("msg");
    if (msgDiv) {
        var msgText = msgDiv.innerText;
        switch (msgText) {
            case "Name must be less than 20 characters.":
                msgDiv.innerText = "操作失败：字符长度不能超过20。";
                break;
            case "Name contains invalid characters.":
                msgDiv.innerText = "操作失败：输入中存在非法字符。"
                break;
            default:
                msgDiv.innerText = `操作失败：${msgDiv.innerText}`;
                translatePageElementEN(msgDiv);
                break;
        }
    }
}

// 图片加载设置
function uconfigImageLoadSettings(contentForm) {
    var titleH2 = contentForm.querySelector("h2");
    titleH2.innerText = "-- 图片加载设置 --";

    var loadSelectDiv = titleH2.nextElementSibling;
    var p = loadSelectDiv.querySelector("p");
    p.innerText = "1. 你是否希望通过 Hentai@Home 网络加载图片，如果可用的话？";
    var inputItems = p.nextElementSibling.children;
    inputItems[0].children[0].childNodes[2].data = " 所有客户端（推荐）";
    inputItems[1].children[0].childNodes[2].data = " 仅使用默认端口的客户端（可能会更慢，请在防火墙或代理阻止非标准接口的流量时选择此项。）";
    inputItems[2].children[0].childNodes[2].data = " 否 [ 现代 / HTTPS ]（仅限捐赠者，你将无法浏览尽可能多的页面，请在出现严重的问题时选择此项。）";
    inputItems[3].children[0].childNodes[2].data = " 否 [ 传统 / HTTP ]（仅限捐赠者，默认情况下无法在新版浏览器中使用，建议在使用过时的浏览器时选择此项。）";

    var countryDiv = loadSelectDiv.nextElementSibling;
    var countryP = countryDiv.children[0];
    var countryPStrong = countryP.querySelector("strong");
    countryP.innerHTML = `2. 您似乎是从 <strong>${countryPStrong.innerText}</strong> 浏览该网站或在该国家/地区使用 VPN 或代理，这意味着该网站将尝试从该一般地理区域的 H@H 客户端加载图像。如果这是不正确的，或者如果您出于任何原因想要使用不同的区域（例如，如果您使用的是拆分隧道 VPN），您可以在下面选择不同的国家/地区。`;

    var countrySelectDiv = countryDiv.children[1];
    countrySelectDiv.childNodes[0].data = "国家或地区：";



}

//#endregion