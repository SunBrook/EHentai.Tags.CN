// 通用方法

// 检查字典是否为空
function checkDictNull(dict) {
    for (const n in dict) {
        return false;
    }
    return true;
}

// 获取地址参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substring(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

// 数组删除元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 数组差集
function getDiffSet(array1, array2) {
    return array1.filter(item => !new Set(array2).has(item));
}

// 导出json文件
function saveJSON(data, filename) {
    if (!data) return;
    if (!filename) filename = "json.json";
    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
    }
    // 要创建一个 blob 数据
    let blob = new Blob([data], { type: "text/json" }),
        a = document.createElement("a");
    a.download = filename;

    // 将blob转换为地址
    // 创建 URL 的 Blob 对象
    a.href = window.URL.createObjectURL(blob);

    // 标签 data- 嵌入自定义属性  屏蔽后也可正常下载
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");

    // 添加鼠标事件
    let event = new MouseEvent("click", {});

    // 向一个指定的事件目标派发一个事件
    a.dispatchEvent(event);
}

// 获取当前时间
function getCurrentDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //年份
    var month = now.getMonth();//月份
    var date = now.getDate();//日期
    var day = now.getDay();//周几
    var hour = now.getHours();//小时
    var minu = now.getMinutes();//分钟
    var sec = now.getSeconds();//秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
        time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
        time = year + "/" + month + "/" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
}

// 调用谷歌翻译接口
function getGoogleTranslate(text, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dj=1&dt=t&q=${text}`;
    httpRequest.open("GET", url, true);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

// 展开折叠动画
var slideTimer = null;
function slideDown(element, realHeight, speed, func) {
    clearInterval(slideTimer);
    var h = 0;
    slideTimer = setInterval(function () {
        // 但目标高度与实际高度小于10px时，以1px的速度步进
        var step = (realHeight - h) / 10;
        step = Math.ceil(step);
        h += step;
        if (Math.abs(realHeight - h) <= Math.abs(step)) {
            h = realHeight;
            element.style.height = `${realHeight}px`;
            func();
            clearInterval(slideTimer);
        } else {
            element.style.height = `${h}px`;
        }
    }, speed);
}
function slideUp(element, speed, func) {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () {
        var step = (0 - element.clientHeight) / 10;
        step = Math.floor(step);
        element.style.height = `${element.clientHeight + step}px`;
        if (Math.abs(0 - element.clientHeight) <= Math.abs(step)) {
            element.style.height = "0px";
            func();
            clearInterval(slideTimer);
        }
    }, speed);
}