function api_call(b, a, c) {
	b.open("POST", api_url);
	b.setRequestHeader("Content-Type", "application/json");
	b.withCredentials = true;
	b.onreadystatechange = c;
	b.send(JSON.stringify(a))
}

function api_response(b) {
	if (b == undefined) {
		return false
	}
	if (b.readyState == 4) {
		if (b.status == 200) {
			var a = JSON.parse(b.responseText);
			if (a.login != undefined) {
				top.location.href = login_url
			} else {
				return a
			}
		} else {
			alert("Server communication failed: " + b.status + " (" + b.responseText + ")")
		}
	}
	return false
}
var usertag_xhr = undefined;

function usertag_save(a) {
	if (usertag_xhr != undefined) {
		return
	}
	usertag_xhr = new XMLHttpRequest();
	var b = {
		method: "setusertag",
		apiuid: apiuid,
		apikey: apikey,
		tagid: a,
		tagwatch: document.getElementById("tagwatch_" + a)
			.checked ? 1 : 0,
		taghide: document.getElementById("taghide_" + a)
			.checked ? 1 : 0,
		tagcolor: document.getElementById("tagcolor_" + a)
			.value,
		tagweight: document.getElementById("tagweight_" + a)
			.value
	};
	api_call(usertag_xhr, b, usertag_callback)
}

function usertag_callback() {
	var a = api_response(usertag_xhr);
	if (a != false) {
		if (a.error != undefined) {
			alert("Could not save tag: " + a.error)
		} else {
			document.getElementById("selector_" + a.tagid)
				.innerHTML = '<label class="lc"><input type="checkbox" name="modify_usertags[]" value="' + a.tagid + '" /><span></span></label>'
		}
		usertag_xhr = undefined
	}
}

function update_tagpreview(c) {
	var m = document.getElementById("tagcolor_" + c)
		.value.replace("#", "");
	if (m === "") {
		if (tagset_color !== "") {
			m = tagset_color
		} else {
			var g = parseInt(document.getElementById("tagweight_" + c)
				.value);
			var h = document.getElementById("taghide_" + c)
				.checked;
			m = !h && g >= 0 ? "3377FF" : "FF6666"
		}
	}
	var n = parseInt(m.substring(0, 2), 16);
	var d = parseInt(m.substring(2, 4), 16);
	var j = parseInt(m.substring(4, 6), 16);
	if (0.299 * n + 0.587 * d + 0.114 * j > 151) {
		var p = "090909";
		var l = true
	} else {
		var p = "f1f1f1";
		var l = false
	}
	var o = Math.min(255, Math.max(0, n - 32));
	var f = Math.min(255, Math.max(0, d - 32));
	var k = Math.min(255, Math.max(0, j - 32));
	var a = o.toString(16)
		.padStart(2, "0") + f.toString(16)
		.padStart(2, "0") + k.toString(16)
		.padStart(2, "0");
	var e = l ? m : a;
	var b = l ? a : m;
	document.getElementById("tagpreview_" + c)
		.style = "color:#" + p + ";border-color:#" + e + ";background:radial-gradient(#" + e + ",#" + b + ") !important"
}

function valid_colorcode(a) {
	return a.match(/^#?[0-9A-F]{6}$/)
}

function keyevent_addtag(b, a) {
	allow_tagsave(a);
	if (b.keyCode == 13) {
		if (tagcomplete_focus == -1) {
			do_usertags_post("add")
		}
		tagcomplete_focus = -1
	}
}

function update_tagcolor(d, b, f) {
	var c = d > -1 ? "_" + d : "";
	var a = (b + "")
		.replace("#", "")
		.toUpperCase();
	if (a.length > 6) {
		a = a.substring(0, 6)
	}
	if (valid_colorcode(a)) {
		document.getElementById("tagcolor" + c)
			.value = "#" + a;
		if (f !== false) {
			document.getElementById("colorsetter" + c)
				.jscolor.fromString(a)
		}
		if (f === false || f !== a) {
			allow_tagsave(d);
			if (d > 0) {
				update_tagpreview(d)
			}
		}
	} else {
		if (a == "") {
			document.getElementById("colorsetter" + c)
				.jscolor.fromString(default_color);
			if (f !== a) {
				allow_tagsave(d)
			}
			if (d > 0) {
				update_tagpreview(d)
			}
		}
	}
	if (a !== "" && !valid_colorcode(a)) {
		var e = document.getElementById("tagsave" + c);
		if (e != undefined) {
			e.disabled = "disabled";
			e.title = "The specified color code is not valid";
			document.getElementById("tagcolor" + c)
				.style.borderColor = "#FF0000"
		}
	}
}

function update_tagweight(c, b, a) {
	b = parseInt(b);
	if (a != b) {
		allow_tagsave(c)
	}
	if (c > 0) {
		update_tagpreview(c)
	}
}

function allow_tagsave(c) {
	var b = c > -1 ? "_" + c : "";
	if (c == 0) {
		if (document.getElementById("tagname_new")
			.value == "") {
			document.getElementById("tagsave" + b)
				.disabled = "disabled";
			return
		}
	} else {
		if (c > 0) {
			if (document.getElementById("tagsave" + b) == undefined) {
				document.getElementById("selector" + b)
					.innerHTML = '<input type="button" id="tagsave' + b + '" onclick="usertag_save(' + c + ')" value="Save" disabled="disabled" />'
			}
		}
	}
	var a = document.getElementById("tagcolor" + b)
		.value;
	if (a === "" || valid_colorcode(a)) {
		var d = document.getElementById("tagsave" + b);
		if (d != undefined) {
			d.removeAttribute("disabled");
			d.removeAttribute("title");
			document.getElementById("tagcolor" + b)
				.style.borderColor = ""
		}
	}
}

function change_tagset(a) {
	document.location = baseurl + (a > 1 ? "?tagset=" + a : "")
}

function do_tagset_post(a) {
	document.getElementById("tagset_action")
		.value = a;
	document.getElementById("tagset_form")
		.submit()
}

function do_tagset_update() {
	do_tagset_post("update")
}

function do_tagset_rename() {
	var a = prompt("Enter a new name for this tagset.", tagset_name);
	if (a != null) {
		document.getElementById("tagset_name")
			.value = a;
		do_tagset_post("rename")
	}
}

function do_tagset_create() {
	var a = prompt("Enter a name for the new tagset.", "New Tagset");
	if (a != null) {
		document.getElementById("tagset_name")
			.value = a;
		do_tagset_post("create")
	}
}

function do_tagset_delete() {
	if (confirm('Are you sure you wish to delete the tagset "' + tagset_name + '"?')) {
		do_tagset_post("delete")
	}
}

function usertags_checkall(a) {
	var b = document.getElementById("usertag_form");
	for (i = 0; i < b.elements.length; i++) {
		if (b.elements[i].name == "modify_usertags[]") {
			b.elements[i].checked = a ? "checked" : false
		}
	}
}

function do_usertags_post(a) {
	document.getElementById("usertag_action")
		.value = a;
	document.getElementById("usertag_form")
		.submit()
}

function count_selected_usertags() {
	var a = document.getElementById("usertag_form");
	var b = 0;
	for (i = 0; i < a.elements.length; i++) {
		if (a.elements[i].name == "modify_usertags[]") {
			if (a.elements[i].checked) {
				++b
			}
		}
	}
	return b
}

function do_usertags_mass() {
	var a = count_selected_usertags();
	if (a < 1) {
		alert("No tags have been selected")
	} else {
		var b = parseInt(document.getElementById("usertag_target")
			.value);
		if (b == 0) {
			if (!confirm("Are you sure you wish to delete " + a + ' tags from "' + tagset_name + '"?')) {
				return
			}
		}
		do_usertags_post("mass")
	}
}

function update_usertags_button(a) {
	document.getElementById("usertags_button")
		.value = a > 0 ? "Confirm Move" : "Confirm Delete"
}
var tagcomplete_focus = -1;

function tagcompleter(j) {
	var l = undefined;
	var g = undefined,
		f = undefined;
	var e = undefined;

	function d(m) {
		if (e === m) {
			return
		}
		e = m;
		if (g != undefined) {
			if (f != undefined) {
				return
			} else {
				clearTimeout(g);
				g = undefined
			}
		}
		setTimeout(function() {
			f = new XMLHttpRequest();
			var n = {
				method: "tagsuggest",
				text: m
			};
			api_call(f, n, h)
		}, 200)
	}

	function h() {
		var m = api_response(f);
		if (m != false) {
			if (m.error != undefined) {
				alert(m.error)
			} else {
				if (tagcomplete_focus < 0) {
					a();
					l = m.tags
				}
			}
			f = undefined;
			k()
		}
	}

	function k() {
		a();
		var n = j.value.replace(/["\']/g, "");
		if (n.match(/^(x|mix).*:/)) {
			n = n.replace(/^(x|mix).*:/, "mixed:")
		} else {
			if (n.match(/^(mis).*:/)) {
				n = n.replace(/^(mis).*:/, "temp:")
			} else {
				if (n.match(/^(co).*:/)) {
					n = n.replace(/^(co).*:/, "cosplayer:")
				} else {
					n = n.replace(/^t.*:/, "temp:")
						.replace(/^f.*:/, "female:")
						.replace(/^m.*:/, "male:")
						.replace(/^r.*:/, "reclass:")
						.replace(/^l.*:/, "language:")
						.replace(/^p.*:/, "parody:")
						.replace(/^c.*:/, "character:")
						.replace(/^g.*:/, "group:")
						.replace(/^a.*:/, "artist:")
						.replace(/^o.*:/, "other:")
				}
			}
		}
		if (n.replace(/^.*:/, "")
			.length < 2) {
			return false
		} else {
			d(n)
		}
		if (l == undefined) {
			return false
		}
		tagcomplete_focus = -1;
		var t = document.createElement("DIV");
		t.setAttribute("id", j.id + "tagcomplete-list");
		t.setAttribute("class", "tagcomplete-items");
		j.parentNode.appendChild(t);
		var o = 0;
		var p = new RegExp("(^| |:)" + n, "ig");
		for (tagid in l) {
			var q = l[tagid].ns + ":" + l[tagid].tn;
			if (q.match(p)) {
				var u = l[tagid].mid != undefined ? l[tagid].mns + ":" + l[tagid].mtn : undefined;
				var r = u == undefined ? q : q + " <strong>=&gt;</strong> " + u;
				var m = u == undefined ? q : u;
				var s = document.createElement("DIV");
				s.innerHTML = r.replace(p, "<strong>$&</strong>");
				s.setAttribute("data-value", m);
				s.addEventListener("click", function(v) {
					j.value = this.getAttribute("data-value");
					a()
				});
				t.appendChild(s);
				++o
			}
		}
		if (o > 0) {
			j.style.borderRadius = "3px 3px 0 0"
		}
	}
	j.addEventListener("input", function(m) {
		k()
	});
	j.addEventListener("keydown", function(n) {
		if (l == undefined) {
			return
		}
		var m = document.getElementById(this.id + "tagcomplete-list");
		if (m) {
			m = m.getElementsByTagName("div")
		}
		if (n.keyCode == 40) {
			++tagcomplete_focus;
			b(m)
		} else {
			if (n.keyCode == 38) {
				--tagcomplete_focus;
				b(m)
			} else {
				if (n.keyCode == 13) {
					n.preventDefault();
					if (m && tagcomplete_focus > -1) {
						m[tagcomplete_focus].click()
					}
				}
			}
		}
	});

	function b(m) {
		if (!m) {
			return false
		}
		c(m);
		if (tagcomplete_focus >= m.length) {
			tagcomplete_focus = 0
		}
		if (tagcomplete_focus < 0) {
			tagcomplete_focus = (m.length - 1)
		}
		m[tagcomplete_focus].classList.add("tagcomplete-active")
	}

	function c(m) {
		for (var n = 0; n < m.length; n++) {
			m[n].classList.remove("tagcomplete-active")
		}
	}

	function a(o) {
		j.style.borderRadius = "";
		var m = document.getElementsByClassName("tagcomplete-items");
		for (var n = 0; n < m.length; n++) {
			if (o != m[n] && o != j) {
				m[n].parentNode.removeChild(m[n])
			}
		}
	}
	document.addEventListener("click", function(m) {
		a(m.target)
	})
};