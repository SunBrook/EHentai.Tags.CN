//#region step6.1.backgroundImage.js 设置背景图片

var t_imgBase64 = ''; // 背景图片（无损）
var t_jpgBase64 = ''; // 背景图片（有损）
var t_jpgOverSize = false; // 有损图片容量是否超标
var t_opacity = defaultSetting_Opacity; // 透明度
var t_mask = defaultSetting_Mask; // 遮罩浓度


// 头部按钮点击事件
var bgDiv = document.getElementById("div_background_btn");
bgDiv.onclick = function () {
    backgroundFormDiv.style.display = "block";
    bgDiv.style.display = "none";
}

// 读取存储设置值，读取完成前，隐藏头部按钮，读取完成在显示出来
function initBackground(func_compelete) {
    bgDiv.style.display = "none";
    var completeGetImg = false;
    var completeGetOpacity = false;
    var completeGetMask = false;

    read(table_Settings, table_Settings_Key_Bg_ImgBase64, result => {
        if (result && result.value) {
            t_imgBase64 = result.value;
        } else {
            t_imgBase64 = '';
        }
        // 设置页面背景
        setListBackgroundImage(t_imgBase64);
        completeGetImg = true;
    }, () => { completeGetImg = true; });
    read(table_Settings, table_Settings_Key_Bg_Opacity, result => {
        if (result && result.value) {
            t_opacity = result.value;
        } else {
            t_opacity = defaultSetting_Opacity;
        }
        // 设置背景不透明度
        setListOpacity(t_opacity);
        // 设置弹窗不透明度数值
        setDialogOpacityValue(t_opacity);
        completeGetOpacity = true;
    }, () => { completeGetOpacity = true; });
    read(table_Settings, table_Settings_Key_Bg_Mask, result => {
        if (result && result.value) {
            t_mask = result.value;
        } else {
            t_mask = defaultSetting_Mask;
        }
        // 设置背景遮罩浓度
        setListMask(t_mask);
        // 设置弹窗遮罩浓度数值
        setDialogMaskValue(t_mask);
        completeGetMask = true;
    }, () => { completeGetMask = true; });

    var tInit = setInterval(() => {
        if (completeGetImg && completeGetOpacity && completeGetMask) {
            tInit && clearInterval(tInit);
            bgDiv.style.display = "block";
            func_compelete();
        }
    }, 50);
}

initBackground(() => { });

// 点击上传图片
bgUploadBtn.onclick = function () {
    bgUploadFile.click();
}
bgUploadFile.onchange = function () {
    var resultFile = bgUploadFile.files[0];
    if (resultFile) {
        var reader = new FileReader();
        reader.readAsDataURL(resultFile);
        reader.onload = function (e) {
            var fileContent = e.target.result;
            console.log(fileContent);
            t_imgBase64 = fileContent;
            setListBackgroundImage(t_imgBase64);

            // 上传置空
            bgUploadFile.value = "";

            var img = new Image();
            img.src = fileContent;
            img.onload = function () {
                var cvs = document.createElement("canvas");
                var ctx = cvs.getContext('2d');
                cvs.width = img.width;
                cvs.height = img.height;
                ctx.drawImage(img, 0, 0, cvs.width, cvs.height);

                cvs.toBlob(function (blob) {
                    if (blob.size <= lowImgSizeLimit) {
                        t_jpgOverSize = false;
                        // 只尝试存储压缩后500kb容量的图片到 localstroage
                        var reader2 = new FileReader();
                        reader2.readAsDataURL(blob);
                        reader2.onload = function (e2) {
                            t_jpgBase64 = e2.target.result;
                        };
                    } else {
                        t_jpgBase64 = '';
                        t_jpgOverSize = true;
                    }

                }, 'image/jpeg', 0.1);
            }
        }
    }
}

// 设置列表背景图片
function setListBackgroundImage(imageBase64) {
    var bg = `url(${imageBase64}) 0 / cover`;
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2_bg::before{background:${bg}}`;
    document.head.appendChild(style);
}


// 不透明度
opacityRange.oninput = function () {
    t_opacity = opacityRange.value;
    opacityVal.innerText = t_opacity;
    setListOpacity(t_opacity);
}
// 设置不透明度效果
function setListOpacity(opacityValue) {
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2_bg::before{opacity:${opacityValue}}`;
    document.head.appendChild(style);
}
// 设置弹窗不透明度数值
function setDialogOpacityValue(opacityValue) {
    opacityRange.value = opacityValue;
    opacityVal.innerText = opacityValue;
}


// 遮罩浓度
maskRange.oninput = function () {
    t_mask = maskRange.value;
    maskVal.innerText = t_mask;
    setListMask(t_mask);
}
// 设置遮罩浓度效果
function setListMask(maskValue) {
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2_bg::before{filter:blur(${maskValue}px)}`;
    document.head.appendChild(style);
}
// 设置弹窗遮罩浓度数值
function setDialogMaskValue(maskValue) {
    maskRange.value = maskValue;
    maskVal.innerText = maskValue;
}

// 点击关闭 + 取消关闭
function closeBgSetDialog() {
    // 初始化设置
    initBackground(() => {
        backgroundFormDiv.style.display = "none";
        bgDiv.style.display = "block";
    });
}
bgImgCancelBtn.onclick = closeBgSetDialog;
bgImgCloseBtn.onclick = closeBgSetDialog;

// 重置
bgImgClearBtn.onclick = function () {
    var confirmResult = confirm("是否删除背景图片，重置相关参数?");
    if (confirmResult) {
        bgImgClearBtn.innerText = "重置中...";
        var clearcomplete1 = false;
        var clearcomplete2 = false;
        var clearcomplete3 = false;
        var clearcomplete4 = false;
        var clearcomplete5 = false;
        var clearcomplete6 = false;
        remove(table_Settings, table_Settings_Key_Bg_ImgBase64, () => {
            t_imgBase64 = '';
            setListBackgroundImage(t_imgBase64);
            clearcomplete1 = true;
        }, () => { clearcomplete1 = true; });
        remove(table_Settings, table_Settings_Key_Bg_Low_ImgOverSize, () => {
            t_jpgOverSize = false;
            clearcomplete2 = true;
        }, () => { clearcomplete2 = true; });
        remove(table_Settings, table_Settings_Key_Bg_Low_ImgBase64, () => {
            t_jpgBase64 = '';
            clearcomplete3 = true;
        }, () => { clearcomplete3 = true; });
        try {
            removeBgLowImage();
        } finally {
            clearcomplete4 = true;
        }
        remove(table_Settings, table_Settings_Key_Bg_Opacity, () => {
            t_opacity = defaultSetting_Opacity;
            setListOpacity(t_opacity);
            setDialogOpacityValue(t_opacity);
            clearcomplete5 = true;
        }, () => { clearcomplete5 = true; });
        remove(table_Settings, table_Settings_Key_Bg_Mask, () => {
            t_mask = defaultSetting_Mask;
            setListMask(t_mask);
            setDialogMaskValue(t_mask);
            clearcomplete6 = true;
        }, () => { clearcomplete6 = true; });

        var tClear = setInterval(() => {
            if (clearcomplete1 && clearcomplete2 && clearcomplete3 && clearcomplete4 && clearcomplete5 && clearcomplete6) {
                tClear && clearInterval(tClear);
                setDbSyncMessage(sync_setting_backgroundImage);
                setTimeout(function () {
                    bgImgClearBtn.innerText = "重置成功";
                }, 250);
                setTimeout(function () {
                    bgImgClearBtn.innerText = "重置 !";
                }, 500);
            }
        }, 50);
    }
}

// 保存
bgImgSaveBtn.onclick = function () {
    bgImgSaveBtn.innerText = "保存中...";

    // 存储
    var complete1 = false;
    var complete2 = false;
    var complete3 = false;
    var complete4 = false;
    var complete5 = false;
    var complete6 = false;

    // 背景图片 (无损)
    var settings_Key_Bg_ImgBase64 = {
        item: table_Settings_Key_Bg_ImgBase64,
        value: t_imgBase64
    };
    update(table_Settings, settings_Key_Bg_ImgBase64, () => { complete1 = true }, () => { complete1 = true });

    // 背景图片（有损）
    var settings_Key_Bg_Low_ImgOverSize = {
        item: table_Settings_Key_Bg_Low_ImgOverSize,
        value: t_jpgOverSize
    };
    update(table_Settings, settings_Key_Bg_Low_ImgOverSize, () => { complete2 = true }, () => { complete2 = true });

    if (t_jpgOverSize) {
        // 超出限制，删除原有存储的有损图片
        remove(table_Settings, table_Settings_Key_Bg_Low_ImgBase64, () => { complete3 = true }, () => { complete3 = true });
        try {
            removeBgLowImage();
        } finally {
            complete4 = true;
        }
    } else {
        // 更新有损图片储存
        var settings_Key_Bg_Low_ImgBase64 = {
            item: table_Settings_Key_Bg_Low_ImgBase64,
            value: t_jpgBase64
        };
        update(table_Settings, settings_Key_Bg_Low_ImgBase64, () => { complete3 = true }, () => { complete3 = true });
        try {
            setBgLowImage(t_jpgBase64);
        } finally {
            complete4 = true;
        }
    }

    // 不透明度
    var settings_Key_Bg_Opacity = {
        item: table_Settings_Key_Bg_Opacity,
        value: t_opacity
    };
    update(table_Settings, settings_Key_Bg_Opacity, () => { complete5 = true }, () => { complete5 = true });

    // 遮罩浓度
    var settings_Key_Bg_Mask = {
        item: table_Settings_Key_Bg_Mask,
        value: t_mask
    };
    update(table_Settings, settings_Key_Bg_Mask, () => { complete6 = true }, () => { complete6 = true });

    var t = setInterval(() => {
        if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6) {
            t && clearInterval(t);
            setDbSyncMessage(sync_setting_backgroundImage);
            setTimeout(function () {
                bgImgSaveBtn.innerText = "保存成功";
            }, 250);
            setTimeout(function () {
                bgImgSaveBtn.innerText = "保存 √";
            }, 500);
        }
    }, 50);
}

//#endregion