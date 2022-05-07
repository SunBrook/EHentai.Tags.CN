//#region step0.commonFunc.js 通用方法

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
    var url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dj=1&dt=t&q=${text}`;
    httpRequest.open("GET", url, true);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

// 借助谷歌翻译设置翻译后的值
function translatePageElement(element) {
    getGoogleTranslate(element.innerText, function (data) {
        var sentences = data.sentences;
        var longtext = '';
        for (const i in sentences) {
            if (Object.hasOwnProperty.call(sentences, i)) {
                const sentence = sentences[i];
                longtext += sentence.trans;
            }
        }
        element.innerText = longtext;
    });
}

function translatePageElementFunc(element, isNeedUrlEncode, func_compelete) {
    var innerText = isNeedUrlEncode ? urlEncode(element.innerText) : element.innerText;
    getGoogleTranslate(innerText, function (data) {
        var sentences = data.sentences;
        var longtext = '';
        for (const i in sentences) {
            if (Object.hasOwnProperty.call(sentences, i)) {
                const sentence = sentences[i];
                longtext += sentence.trans;
            }
        }
        element.innerText = longtext;
        func_compelete();
    });
}

function getGoogleTranslateEN(text, func) {
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

function translatePageElementEN(element) {
    getGoogleTranslateEN(urlEncode(element.innerText), function (data) {
        var sentences = data.sentences;
        var longtext = '';
        for (const i in sentences) {
            if (Object.hasOwnProperty.call(sentences, i)) {
                const sentence = sentences[i];
                longtext += sentence.trans;
            }
        }
        element.innerText = longtext;
    });
}

// 展开折叠动画 (下上)
var slideTimer = null;
function slideDown(element, realHeight, speed, func) {
    clearInterval(slideTimer);
    var h = 0;
    slideTimer = setInterval(function () {
        // 当目标高度与实际高度小于10px时，以1px的速度步进
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

// 展开折叠动画 (右左)
var slideTimer2 = null;
function slideRight(element, realWidth, speed, func) {
    clearInterval(slideTimer2);
    var w = 0;
    slideTimer2 = setInterval(function () {
        // 当目标宽度与实际宽度小于10px, 以 1px 的速度步进
        var step = (realWidth - w) / 10;
        step = Math.ceil(step);
        w += step;
        if (Math.abs(realWidth - w) <= Math.abs(step)) {
            w = realWidth;
            element.style.width = `${realWidth}px`;
            func();
            clearInterval(slideTimer2);
        } else {
            element.style.width = `${w}px`;
        }
    }, speed);
}
function slideLeft(element, speed, func) {
    clearInterval(slideTimer2);
    slideTimer2 = setInterval(function () {
        var step = (0 - element.clientWidth) / 10;
        step = Math.floor(step);
        element.style.width = `${element.clientWidth + step}px`;
        if (Math.abs(0 - element.clientWidth) <= Math.abs(step)) {
            element.style.width = "0px";
            func();
            clearInterval(slideTimer2);
        }
    })
}


// 页面样式注入
function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
        if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
        } else {
            head.appendChild(style);
        }
    } else {
        head.appendChild(style);
    }

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
}

// UrlEncode
function urlEncode(str) {
    str = (str + '').toString();

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

// UrlDecode
function urlDecode(str) {
    return decodeURIComponent(str);
}

// 跨域
function crossDomain() {
    var meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "upgrade-insecure-requests";
    document.getElementsByTagName("head")[0].appendChild(meta);
}

// 英语日期转纯数字日期
function transDate(dateEn) {
    var monthDict = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    };
    var dateSplit = dateEn.split(' ');
    return `${dateSplit[2]}/${monthDict[dateSplit[1]]}/${Number(dateSplit[0])}`;
}

// 过滤字符串开头和结尾的空格
function trimStartEnd(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 过滤字符串结尾空格
function trimEnd(str) {
    return str.replace(/(\s*$)/g, "");
}

//#endregion