//#region step1.2.translateTopBottomMenu.js 头部菜单、底部菜单翻译

function topMenuTranslateZh() {
	var nb = document.getElementById("nb");
	if (nb) {
		var menus = nb.querySelectorAll("a");
		var pathname = window.location.pathname;
		var isFoundCheck = false;
		for (const i in menus) {
			if (Object.hasOwnProperty.call(menus, i)) {
				const a = menus[i];
				if ((!isFoundCheck) &&
					(
						(pathname == '/' && a.innerText == 'Front Page') ||
						(pathname == '/watched' && a.innerText == 'Watched') ||
						(pathname == '/popular' && a.innerText == 'Popular') ||
						(pathname == '/torrents.php' && a.innerText == 'Torrents') ||
						(pathname == '/favorites.php' && a.innerText == 'Favorites') ||
						(pathname == '/home.php' && a.innerText == 'My Home') ||
						(pathname == '/toplist.php' && a.innerText == 'Toplists') ||
						(pathname == '/bounty.php' && a.innerText == 'Bounties') ||
						(pathname == '/news.php' && a.innerText == 'News') ||
						(pathname == '/uconfig.php' && a.innerText == 'Settings') ||
						(pathname == '/upld/manage' && a.innerText == 'My Uploads') ||
						(pathname == '/mytags' && a.innerText == 'My Tags')
					)) {
					a.parentNode.classList.add('headMenu_check');
					isFoundCheck = true;
				}

				a.innerText = fontMenusData[a.innerText] ?? a.innerText;
			}
		}
	}
}

function bottomMenuTranslateZh() {
	var dp = document.getElementsByClassName("dp");
	if (dp.length > 0) {
		var alinks = dp[0].children;
		for (const i in alinks) {
			if (Object.hasOwnProperty.call(alinks, i)) {
				const alink = alinks[i];
				if (bottomMenusData[alink.innerText]){
					alink.innerText = bottomMenusData[alink.innerText];
				}
			}
		}
	}
}

//#endregion