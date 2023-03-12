//#region step8.2.hathperksPage.js Hath权限页面

function hathperksPage() {
    // // 跨域
    // crossDomain();

    //头部翻译
    hathperksPageTop();

    //表格翻译
    hathperksTable();
}

function hathperksPageTop() {
    let title = document.querySelectorAll("h1");
    title[0].innerHTML = myMainPageSubPageDict[title[0].innerHTML];
    let section = document.querySelectorAll("h1")[0].nextElementSibling.children;
    section[0].innerHTML = '通过运行Hentai@Home（變態之家）客户端，随着时间的推移，您将获得被称为Hath的特殊奖励积分。这些积分是奖励给那些捐赠带宽和计算机资源来帮助维持网站的免费使用、快速响应和可访问的人，可以在这里兑换Hath 权限，能帮助你更好地浏览画廊和游玩 變態之道（HentaiVerse）。';

    let hathExchangeLink = section[1].querySelectorAll("a")[0];
    hathExchangeLink.innerHTML = myMainPageSubPageDict[hathExchangeLink.innerHTML];
    section[1].innerHTML = '如果不方便运行H@H客户端，可以在' + hathExchangeLink.outerHTML + '使用Credit点来兑换Hath。';

    let donateLink = section[2].querySelectorAll("a")[0];
    donateLink.innerHTML = '捐赠';
    //While the Hath Perks for the HentaiVerse cannot be obtained in any other way, most of the ones that are specific for Galleries will also get unlocked by making a donation on the Donation Screen. These will be refunded if you buy them for Hath, and later make a qualifying donation. There is also an option to "adopt" H@H clients that will grant you Hath over time as if you were running it yourself.
    // 这个adopt，暂时翻译为领养，但是好像没找到过领养相关的内容说明
    section[2].innerHTML = '虽然 變態之道（HentaiVerse） 的Hath权限不能通过其他方式获得，但大多数专门针对画廊的权限也可以通过' + donateLink.outerHTML + '来解锁。如果您用Hath点数购买了这些画廊福利，之后进行了捐赠，消费的Hath点数将会返还。还有一个选项是 “领养” H@H客户端，随着时间的推移，您可以获得Hath点数，就像自己运行一样。';

    section[3].childNodes[0].data = '你现在拥有 ';
}


function hathperksTable() {
    let tableRow = document.querySelectorAll("tr");
    //翻译列名
    tableRow[0].children[0].innerHTML = 'Hath 权限';
    tableRow[0].children[1].innerHTML = '描述';


    let index = 1;
    for (; index < tableRow.length; index++) {
        if (hathPerksPageDict[tableRow[index].children[0].innerHTML] != undefined) {

            let trans = hathPerksPageDict[tableRow[index].children[0].innerHTML];
            //翻译特权名
            tableRow[index].children[0].innerHTML = trans[0];
            //翻译描述
            tableRow[index].children[1].childNodes[0].data = trans[1];
        }
        //捐赠xx之后自动解锁
        if (tableRow[index].children[1].childNodes.length > 1 && tableRow[index].children[1].querySelectorAll("span")[0] != undefined) {
            let money = / .?\d+.? /.exec(tableRow[index].children[1].querySelectorAll("span")[0].innerHTML);
            tableRow[index].children[1].querySelectorAll("span")[0].innerHTML = '捐赠' + money + '后免费解锁';
        }
        //翻译购买按钮
        let inputButtomColl = tableRow[index].children[2].getElementsByTagName('input');
        if (inputButtomColl.length != 0) {//未购买
            inputButtomColl['purchase'].value = '购买';
        } else {
            tableRow[index].children[2].getElementsByTagName('p')[0].innerHTML = '已获得'
        }
    }
}
//#endregion
