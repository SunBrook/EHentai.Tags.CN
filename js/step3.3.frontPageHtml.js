//#region step3.3.frontPageHtml.js 首页HTML 

// 首页代码
const category_html = `
<div id="div_ee8413b2_bg"></div>
<div id="search_wrapper">
	<div id="search_top">
		<div id="category_all_button">全部类别</div>
		<div id="category_favorites_button">本地收藏</div>
		<div id="search_close">↑</div>
		<div id="category_search_input">
			<div id="input_info">
				<span id="readonly_div"></span>
				<input type="text" id="user_input">
				<span id="user_input_enter" title="按回车键添加">↵</span>
			</div>
			<div id="category_enter_button">全部</div>
			<div id="input_clear">X</div>
			<div id="category_user_input_recommend"></div>
		</div>
		<div id="category_addFavorites_button">加入收藏</div>
		<div id="category_addFavorites_button_disabled">加入收藏</div>
	</div>
	<div id="display_div">
		<div id="category_all_div">
			<div id="category_editor">
				<div id="all_collapse">折叠</div>
				<div id="all_expand">展开</div>
			</div>
			<div id="category_list">
                <div id="category_list_fetishList"></div>
                <div id="category_list_ehTag"></div>
            </div>
			<div id="category_loading_div">💕 请等待一小会儿，马上就好 💕</div>
		</div>
		<div id="category_favorites_div">
			<div id="favorites_editor">
				<div id="favorites_all_collapse">折叠</div>
				<div id="favorites_all_expand">展开</div>
				<div id="favorites_edit">编辑</div>
				<div id="favorites_clear">清空</div>
				<div id="favorites_save">保存</div>
				<div id="favorites_cancel">取消</div>
				<input type="file" id="favorite_upload_files" accept=".json">
				<div id="favorites_recover" title="从备份文件恢复收藏数据">恢复</div>
				<div id="favorites_export" title="备份收藏数据">备份</div>
			</div>
			<div id="favorites_list"></div>
			<div id="favorites_edit_list"></div>
		</div>
	</div>
</div>
<div id="background_form">
	<div id="background_form_top"></div>
	<div id="background_form_close" title="关闭">X</div>
	<div class="background_form_item">
		<label>背景图片：</label>
		<input type="file" id="bg_upload_file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" />
		<div id="bgUploadBtn"> + 上传图片</div>
	</div>
	<div class="background_form_item">
		<label>不透明度：</label>
		<input id="opacity_range" type="range" max="1" min="0.1" id="range" step="0.1" value="0.5">
		<div id="opacity_val">0.5</div>
	</div>
	<div class="background_form_item">
		<label>模糊程度：</label>
		<input id="mask_range" type="range" max="100" min="0" id="range" step="0.1" value="0">
		<div id="mask_val">0</div>
	</div>
	<div class="background_form_item">
		<div id="bgImg_clear_btn">重置 !</div>
		<div id="bgImg_save_btn">保存 √</div>
		<div id="bgImg_cancel_btn">取消 X</div>
	</div>
</div>
<div id="frontPage_listFontColor">
	<div id="frontPage_listFontColor_top"></div>
	<div id="frontPage_listFontColor_close" title="关闭">X</div>
	<div class="frontPage_listFontColor_item">
		<label>父级字体颜色：</label>
		<input type="color" id="parent_color" />
		<div id="parent_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<label>子级字体颜色：</label>
		<input type="color" id="sub_color" />
		<div id="sub_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<label>子级悬浮颜色：</label>
		<input type="color" id="sub_hover_color" />
		<div id="sub_hover_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<div id="listFontColor_clear_btn">重置 !</div>
		<div id="listFontColor_save_btn">保存 √</div>
		<div id="listFontColor_cancel_btn">取消 X</div>
	</div>
</div>
`;

function frontPageHtml() {
    // 基本框架代码插入，先创建包裹层div，然后构造包裹层内容
    var webdiv = document.createElement("div");
    webdiv.id = "div_ee8413b2";
    var searchBoxDiv = document.getElementById("searchbox");
    searchBoxDiv.appendChild(webdiv);
    //searchBoxDiv.insertBefore(webdiv, searchBoxDiv.children[0]);
    webdiv.innerHTML = category_html;
}

//#endregion