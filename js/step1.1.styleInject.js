//#region step1.1.styleInject.js 样式注入
func_eh_ex(() => {
	// e-hentai 样式 eh.css
	const category_style = `#searchbox #data_update_tip,
	#gd2 #data_update_tip,
	.t_popular_toppane #data_update_tip,
	.t_favorite_ido #data_update_tip {
		position: absolute;
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		border: 1px solid #5c0d12;
		margin-top: -1px;
		margin-left: -1px;
		background-color: #edebdf;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	#searchbox #data_update_tip {
		top: 0;
		left: 0;
	}
	
	#gd2 #data_update_tip,
	.t_favorite_ido #data_update_tip {
		top: 2px;
		right: 15px;
	}
	
	.t_popular_toppane {
		padding: 10px 0;
	}
	
	.t_popular_dms div select {
		margin-top: -6px;
	}
	
	.t_popular_toppane #data_update_tip {
		top: 16px;
		left: 180px;
	}
	
	
	#searchbox #div_fontColor_btn,
	#searchbox #div_background_btn,
	#searchbox #div_top_visible_btn,
	#searchbox #div_searchMode_btn {
		position: absolute;
		top: 0;
		width: 70px;
		height: 20px;
		line-height: 20px;
		background-color: #e3e0d1;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
		border: 1px solid #5c0d12;
		margin-top: -1px;
		margin-right: -1px;
	}
	
	#searchbox #div_fontColor_btn {
		right: 210px;
	}
	
	#searchbox #div_background_btn {
		right: 140px;
	}
	
	#searchbox #div_top_visible_btn {
		right: 70px;
	}
	
	#searchbox #div_searchMode_btn {
		right: 0;
	}
	
	#searchbox #div_fontColor_btn:hover,
	#searchbox #div_background_btn:hover,
	#searchbox #div_top_visible_btn:hover,
	#searchbox #div_searchMode_btn:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
		background-color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_loading_div {
		height: 527px;
		width: 100%;
		line-height: 527px;
		text-align: center;
		font-size: 20px;
	}
	
	#div_ee8413b2_bg::before {
		background-size: 100%;
		opacity: 0.5;
	}
	
	#div_ee8413b2_bg {
		z-index: -9999;
		overflow: hidden;
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	#div_ee8413b2_bg::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		filter: blur(2px);
	
	}
	
	#div_ee8413b2 #background_form,
	#div_ee8413b2 #frontPage_listFontColor {
		border: 1px solid #5c0d12;
		width: 340px;
		height: 270px;
		background-color: #e3e0d1;
		position: absolute;
		color: #5c0d12;
		padding-top: 30px;
		display: none;
	}
	
	#div_ee8413b2 #background_form {
		left: calc(50% - 170px);
		top: 100px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor {
		left: calc(50% - 255px);
		top: 190px;
	}
	
	#div_ee8413b2 #background_form #background_form_top,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_top {
		height: 30px;
		width: 310px;
		position: absolute;
		top: 0;
		cursor: move;
	}
	
	#div_ee8413b2 #background_form #bg_upload_file {
		display: none;
	}
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 1px solid black;
		border-bottom: 1px solid black;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
		color: #5c0d12;
	}
	
	#div_ee8413b2 #background_form .background_form_item,
	#div_ee8413b2 #frontPage_listFontColor .frontPage_listFontColor_item {
		padding: 15px 0 15px 40px;
		min-height: 30px;
	}
	
	#div_ee8413b2 #background_form label,
	#div_ee8413b2 #frontPage_listFontColor label {
		float: left;
		height: 30px;
		line-height: 30px;
		min-width: 90px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		border: 1px solid black;
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		background-color: #3a3939;
		cursor: pointer;
		float: left;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn {
		background-color: darkred;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn:hover {
		background-color: red;
	}
	
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn {
		background-color: darkgreen;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn:hover {
		background-color: green;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		background-color: darkslateblue;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #bgImg_cancel_btn:hover {
		background-color: slateblue;
	}
	
	#div_ee8413b2 #background_form #bgUploadBtn {
		width: 100px;
		margin-left: 5px;
		background-color: #5c0d12;
	}
	
	#div_ee8413b2 #background_form #background_form_close:hover,
	#div_ee8413b2 #background_form #bgUploadBtn:hover,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range,
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		float: left;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range {
		height: 27px;
		margin-right: 10px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		height: 30px;
		width: 80px;
		margin: 0 12px;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val,
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		float: left;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val {
		width: 50px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		width: 80px;
	}
	
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		border: 1px solid #5c0d12;
		margin: 0 auto;
		padding: 10px;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		border: 1px solid #5c0d12;
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 0;
		height: 48px;
		line-height: 42px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
		overflow: hidden;
	}
	
	
	/* 头部按钮 */
	
	#div_ee8413b2 #search_wrapper #search_top {
		width: 100%;
		height: 50px;
	}
	
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d12;
		text-align: center;
		vertical-align: middle;
		float: left;
		cursor: pointer;
		font-size: 18px;
	}
	
	#div_ee8413b2 #search_top #category_favorites_button {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d12;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: pointer;
		font-size: 18px;
		display: none;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button_disabled {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d1245;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: not-allowed;
		font-size: 18px;
		color: #5c0d1245;
	}
	
	#div_ee8413b2 #search_top #category_search_input {
		width: calc(100% - 392px);
		height: 48px;
		border: 1px solid #5c0d12;
		float: left;
		margin: 0 10px 0 40px;
	}
	
	#div_ee8413b2 #category_search_input #input_info {
		width: calc(100% - 104px);
		height: 48px;
		float: left;
		padding: 0 4px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 15px;
		margin-top: 2px;
		background-color: transparent;
		caret-color: black;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input_enter {
		margin-left: -15px;
		cursor: pointer;
		display: inline-block;
		color: #e3e0d1;
	}
	
	.user_input_null_backcolor {
		background-color: #f5cc9c80 !important;
	}
	
	.user_input_value_backColor {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input:focus,
	#div_ee8413b2 #category_search_input #input_info #user_input:hover {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		display: inline-block;
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 4px;
		margin-top: 4px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
		padding: 4px 6px;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item:hover {
		border: 1px solid red;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #category_search_input #input_clear {
		width: 47px;
		height: 48px;
		line-height: 48px;
		float: right;
		cursor: pointer;
		font-size: 18px;
		text-align: center;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button {
		border-left: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_wrapper #display_div {
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_favorites_div,
	#div_ee8413b2 #search_wrapper #category_all_div {
		width: calc(100% - 2px);
		border: 1px solid #5c0d12;
		margin-top: 10px;
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_all_div,
	#div_ee8413b2 #search_wrapper #category_favorites_div {
		display: none;
	}
	
	#div_ee8413b2 #favorites_list .favorite_items_div,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div h4,
	#div_ee8413b2 #favorites_list h4,
	#div_ee8413b2 #favorites_edit_list h4 {
		padding: 0;
		margin: 10px;
		color: #5c0d11;
	}
	
	#div_ee8413b2 #category_all_div .c_item,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item {
		margin: 3px 3px 3px 10px;
		font-size: 15px;
		cursor: pointer;
		display: inline-block;
		color: #5c0d11;
	}
	
	#div_ee8413b2 #category_all_div .c_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover {
		color: #ff4500;
	}
	
	#div_ee8413b2 #category_all_div .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear {
		margin: 3px 0 3px 10px;
		border: 1px solid #5c0d11;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #5c0d11;
	}
	
	.chooseTab {
		background-color: #5c0d12;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_all_div #category_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_favorites_div #favorites_editor {
		width: 100%;
		height: 25px;
	}
	
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		border-bottom: 1px solid #5c0d12;
		border-right: 1px solid #5c0d12;
		width: 49.5px;
		float: left;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover {
		border-bottom: 1px solid #5c0d12;
		border-left: 1px solid #5c0d12;
		width: 49.5px;
		float: right;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorite_upload_files {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend {
		width: calc(100% - 48px);
		margin-left: -1px;
		border: 1px solid #5c0d12;
		border-top: 0;
		background-color: #e3e0d1;
		max-height: 500px;
		overflow-y: auto;
		position: relative;
	}
	
	.t_favorite_ido #category_user_input_recommend {
		border: 1px solid #5c0d12;
		border-top: 0;
		background-color: #e3e0d1;
		max-height: 500px;
		position: relative;
		top: -10px;
		z-index: 100;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		font-weight: bold;
		cursor: pointer;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:not(:first-child),
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:hover,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #c5c3b8;
	}
	
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		display: none;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		min-height: 90px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_list .category_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div #category_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list h4 {
		font-size: 16px;
	}
	
	#div_ee8413b2 #category_all_div #category_list,
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		height: 500px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar,
	.torrents_detail_info #etd p::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-track,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-track,
	.torrents_detail_info #etd p::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-thumb,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-thumb,
	.torrents_detail_info #etd p::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_loading_div,
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button,
	#div_ee8413b2 #category_search_input #input_clear,
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #search_top #category_addFavorites_button,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel,
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover,
	#div_ee8413b2 #category_list .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear,
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #favorites_edit_list .f_edit_item {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper #search_close:hover,
	#div_ee8413b2 #search_top #category_all_button:hover,
	#div_ee8413b2 #search_top #category_favorites_button:hover,
	#div_ee8413b2 #category_search_input #input_clear:hover,
	#div_ee8413b2 #category_search_input #category_enter_button:hover,
	#div_ee8413b2 #search_top #category_addFavorites_button:hover,
	#div_ee8413b2 #category_editor #all_collapse:hover,
	#div_ee8413b2 #category_editor #all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_edit:hover,
	#div_ee8413b2 #favorites_editor #favorites_clear:hover,
	#div_ee8413b2 #favorites_editor #favorites_save:hover,
	#div_ee8413b2 #favorites_editor #favorites_cancel:hover,
	#div_ee8413b2 #favorites_editor #favorites_export:hover,
	#div_ee8413b2 #favorites_editor #favorites_recover:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_list .category_extend:hover,
	#div_ee8413b2 #favorites_list .favorite_extend:hover,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear:hover,
	#div_ee8413b2 #category_list .c_item:hover,
	#div_ee8413b2 #favorites_list .c_item:hover {
		transform: scale(2);
	}
	
	#dms #googleTranslateDiv,
	.t_popular_toppane #googleTranslateDiv,
	.t_toplist_ido #googleTranslateDiv,
	.t_torrentsPage_ido #googleTranslateDiv,
	.t_tosPage_stuffbox #googleTranslateDiv {
		float: left;
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		position: absolute;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
	}
	
	#dms #googleTranslateDiv {
		margin-top: -13px;
	}
	
	.t_favorite_ido #dms #googleTranslateDiv {
		margin-top: -42px;
		right: 16px;
	}
	
	.t_popular_toppane #googleTranslateDiv {
		margin-top: -30px;
	}
	
	.t_toplist_ido #googleTranslateDiv {
		top: 40px;
		right: 10px;
	}
	
	.t_toplist_bookrage #googleTranslateDiv {
		top: 11px;
		left: 5px;
	}
	
	.t_torrentsPage_ido #googleTranslateDiv {
		top: 105px;
	}
	
	.t_tosPage_stuffbox #googleTranslateDiv {
		width: 78px;
		float: right;
		position: relative;
	}
	
	#dms #translateLabel,
	.t_popular_toppane #translateLabel,
	.t_toplist_ido #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel,
	.t_popular_toppane #googleTranslateDiv,
	.t_popular_toppane #translateLabel,
	.t_toplist_ido #googleTranslateDiv,
	.t_toplist_ido #translateLabel,
	.t_torrentsPage_ido #googleTranslateDiv,
	.t_torrentsPage_ido #translateLabel,
	.t_tosPage_stuffbox #googleTranslateDiv,
	.t_tosPage_stuffbox #translateLabel {
		cursor: pointer;
	}
	
	.div_ee8413b2_category_checked {
		background-color: darkred !important;
	}
	
	.div_ee8413b2_category_checked a {
		color: white;
	}
	
	#gd5 #googleTranslateDiv,
	.t_toplist_ido #googleTranslateDiv {
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
		margin-bottom: 15px;
	}
	
	#gd5 #googleTranslateDiv #translateLabel,
	.t_toplist_ido #googleTranslateDiv #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#gd5 #googleTranslateDiv,
	#gd5 #googleTranslateDiv #googleTranslateCheckbox,
	#gd5 #googleTranslateDiv #translateLabel,
	.t_toplist_ido #googleTranslateDiv,
	.t_tosPage_stuffbox #googleTranslateDiv {
		cursor: pointer;
	}
	
	#div_ee8413b2_detail_clearBtn,
	#div_ee8413b2_detail_addFavoriteBtn,
	#div_ee8413b2_detail_searchBtn {
		width: 130px;
		height: 25px;
		line-height: 25px;
		font-weight: bold;
		font-size: 13px;
		border: 1px solid #8d8d8d;
		background-color: #edebdf;
		border-radius: 3px;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		margin: 0 auto;
		margin-bottom: 15px;
		display: none;
	}
	
	#gd5 #googleTranslateDiv:hover,
	#div_ee8413b2_detail_clearBtn:hover,
	#div_ee8413b2_detail_addFavoriteBtn:hover,
	#div_ee8413b2_detail_searchBtn:hover,
	.t_popular_toppane #googleTranslateDiv:hover,
	.t_toplist_ido #googleTranslateDiv:hover,
	.t_torrentsPage_ido #googleTranslateDiv:hover,
	.t_tosPage_stuffbox #googleTranslateDiv:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#nb {
		font-size: 17px;
		padding-top: 8px;
	}
	
	#nb>div {
		background-image: none;
	}
	
	#nb div a:hover {
		color: red;
	}
	
	#dms>div>select {
		left: -87px;
		width: 206px;
	}
	
	table.itg>tbody>tr>th {
		text-align: center;
		font-size: 13px;
	}
	
	table td.tc {
		min-width: 30px;
	}
	
	table.itg tr:not(:first-child):hover {
		background-color: #e0ded3;
	}
	
	table.itg tr:first-child:hover,
	div.itg .gl1t:hover {
		background-color: #e0ded3;
	}
	
	div#gdf a {
		text-decoration: underline;
	}
	
	.glname table td.tc,
	#taglist table td.tc {
		min-width: 50px;
	}
	
	#taglist::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#taglist::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#taglist::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#gmid #gd5 .g3,
	#gmid #gd5 .g2 {
		padding-bottom: 10px;
	}
	
	table .gt,
	table .gtl,
	table .gtw {
		height: 18px;
		line-height: 18px;
	}
	
	.headMenu_check {
		border-top: 2px solid #070101;
		padding-top: 6px !important;
		margin-top: -8px;
	}
	
	.t_toplist_ido h2 {
		padding: 20px 0 10px 0;
		border-bottom: 1px dashed #5c0d12;
		font-size: 1.5em;
	}
	
	.t_favorite_ido .nosel {
		border-radius: 10px;
		margin-top: 20px !important;
		padding-top: 20px;
		padding-left: 30px;
		height: 65px;
		border: 1px solid #C2C1C1;
		background-color: #e3e0d1;
	}
	
	.t_favorite_ido .nosel .fp:last-child {
		background-color: #e3e0d1;
		top: -87px;
	}
	
	.t_favorite_ido .nosel .fp:last-child:hover,
	.t_favorite_ido .nosel .fps {
		background-color: #edebdf !important;
	}
	
	.t_favorite_ido .favorite_null {
		color: #c3bfbf;
	}
	
	.t_favorite_ido .searchDiv {
		width: 855px !important;
		height: 30px;
		margin: 0 auto !important;
		padding: 10px 0 30px 0;
	}
	
	.t_favorite_ido .searchDiv .searchInputDiv {
		float: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv {
		float: right;
		width: 310px !important;
		padding-right: 0 !important;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td {
		width: auto !important;
		height: 30px;
		display: inline-block;
		line-height: 30px;
		text-align: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td label {
		height: 30px;
		line-height: 30px;
	}
	
	.gm #h1Origin_copy {
		font-size: 10pt;
		padding: 0 0 2px;
		margin: 3px 15px;
		color: #b8b8b8;
		border-bottom: 1px solid #000000;
	}
	
	.gm #h1Origin_copy {
		font-size: 10pt;
		padding: 0 0 2px;
		margin: 3px 15px;
		color: #9F8687;
		border-bottom: 1px solid #5C0D12;
	}
	
	.gm #h1Title_copy {
		font-size: 12pt;
		padding: 0 0 2px;
		margin: 3px 15px;
	}
	
	.torrents_detail_info,
	.torrents_detail_index {
		min-height: 535px;
		height: auto !important;
	}
	
	.t_torrentsPage_ido #torrentform {
		width: 660px;
		margin: 20px auto;
		height: 50px;
	}
	
	.t_torrentsPage_ido #focusme {
		float: left;
	}
	
	.t_torrentsPage_ido #torrentform p {
		float: left;
		margin-top: 5px;
	}
	
	.torrents_detail_info table:nth-child(3) {
		margin-left: 15% !important;
	}
	
	.torrents_detail_info a {
		text-decoration: underline !important;
	}
	
	.torrents_detail_info #etd p {
		height: 214px;
		padding: 0 1px;
		overflow-y: auto;
	}
	
	.torrents_detail_info #etd #googleTranslateDiv {
		background-color: #dbd3a8;
		display: inline-block;
		margin-left: -1px;
		padding: 0 10px 3px 10px;
		margin-top: 2px;
		cursor: pointer;
	}
	
	.torrents_detail_index form table tr td:nth-child(4),
	.torrents_detail_index form table tr td:nth-child(5) {
		text-align: center;
	}
	
	.t_newspage_souter #nb {
		min-height: 29px;
		max-height: 29px;
	}
	
	.t_newspage_souter #nb a {
		font-size: 17px;
	}
	
	.t_newspage_souter #imgHiddenBtn {
		width: 100px;
		float: right;
		margin-top: -34px;
		margin-right: -11px;
		margin-bottom: -30px;
		height: 25px;
		line-height: 26px;
		border: 1px solid #5c0d12;
		text-align: center;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	/* 新闻头部图片边框 */
	.t_newspage_souter .hiddenTopImgBorder {
		height: 0;
	}
	
	.t_newspage_souter #googleTranslateDiv {
		width: 120px;
		margin-top: -8px;
		margin-bottom: -30px;
		margin-left: -11px;
		height: 25px;
		line-height: 26px;
		text-align: center;
		cursor: pointer;
		border: 1px solid #5c0d12;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_newspage_souter #googleTranslateDiv #translateLabel {
		cursor: pointer;
	}
	
	.t_newspage_souter #botm {
		overflow: hidden;
	}
	
	.t_newspage_souter .title_extend {
		position: relative;
		top: -3px;
		right: -10px;
		border: 1px solid #5c0d11;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #5c0d11;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_newspage_souter .title_extend:hover {
		transform: scale(1.5);
	}
	
	.t_newspage_souter .nwo h2 {
		margin-top: 7px;
	}
	
	.t_newspage_souter .nwo h2 div {
		margin-bottom: 6px;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_select {
		display: inline-block;
	}
	
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(1),
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(3) {
		width: auto;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_action {
		float: right;
		padding-top: 3px;
	}
	
	.t_uconfigPage_outer .span_pixel {
		position: relative;
		top: 2px;
	}
	
	.t_uconfigPage_outer form h2 {
		font-size: 18px;
		margin-top: 30px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper {
		height: calc(100vh - 168px);
		overflow: auto;
		margin: 5px 0;
		padding: 0 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm {
		margin-top: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm input[type="button"],
	.t_frontpage_ido #searchbox .nopm input[type="submit"] {
		width: 70px;
	}
	
	.t_frontpage_ido #advdiv {
		width: 598px;
		margin: auto;
		margin-top: 11px;
	}
	
	.t_frontpage_ido #advdiv,
	.t_frontpage_ido #fsdiv {
		padding: 10px 0;
		border: 1px ridge #5c0d12;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend {
		border: 1px solid #5c0d12;
		border-top: 0;
		background-color: #e3e0d1;
		max-height: 500px;
		position: relative;
		z-index: 99;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		font-weight: bold;
		cursor: pointer;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #5c0d12;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #c5c3b8;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	.t_detail_comment .comment_span {
		margin-right: 10px;
		float: left;
	}
	
	.t_detail_comment .comment_span,
	.t_detail_comment .comment_span input,
	.t_detail_comment .comment_span label {
		cursor: pointer;
	}
	
	#eventpane #eventpane_close_btn {
		width: 30px;
		height: 30px;
		border: 1px solid #5c0d11;
		line-height: 30px;
		float: right;
		margin-top: -4px;
		margin-right: -4px;
		font-size: 18px;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_tosPage_stuffbox {
		padding: 10px !important;
	}`;
	styleInject(category_style);
}, () => {
	// exhentai 样式 ex.css
	const category_style = `#searchbox #data_update_tip,
	#gd2 #data_update_tip,
	.t_popular_toppane #data_update_tip,
	.t_favorite_ido #data_update_tip {
		position: absolute;
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		background-color: #34353b;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	#searchbox #data_update_tip {
		top: 0;
		left: 0;
	}
	
	#gd2 #data_update_tip,
	.t_favorite_ido #data_update_tip {
		top: 2px;
		right: 15px;
	}
	
	.t_popular_toppane {
		padding: 10px 0;
	}
	
	.t_popular_dms div select {
		margin-top: -6px;
	}
	
	.t_popular_toppane #data_update_tip {
		top: 16px;
		left: 180px;
	}
	
	#searchbox #div_fontColor_btn,
	#searchbox #div_background_btn,
	#searchbox #div_top_visible_btn,
	#searchbox #div_searchMode_btn {
		position: absolute;
		top: 0;
		width: 70px;
		height: 20px;
		line-height: 20px;
		background-color: #34353b;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
	}
	
	#searchbox #div_fontColor_btn {
		right: 210px;
	}
	
	#searchbox #div_background_btn {
		right: 140px;
	}
	
	#searchbox #div_top_visible_btn {
		right: 70px;
	}
	
	#searchbox #div_searchMode_btn {
		right: 0;
	}
	
	#searchbox #div_fontColor_btn:hover,
	#searchbox #div_background_btn:hover,
	#searchbox #div_top_visible_btn:hover,
	#searchbox #div_searchMode_btn:hover {
		background-color: #43464e;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
		background-color: #40454B;
	}
	
	#div_ee8413b2 #category_loading_div {
		height: 527px;
		width: 100%;
		line-height: 527px;
		text-align: center;
		font-size: 20px;
	}
	
	#div_ee8413b2_bg::before {
		background-size: 100%;
		opacity: 0.5;
	}
	
	#div_ee8413b2_bg {
		z-index: -9999;
		overflow: hidden;
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	#div_ee8413b2_bg::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		filter: blur(2px);
	
	}
	
	
	#div_ee8413b2 #background_form,
	#div_ee8413b2 #frontPage_listFontColor {
		border: 1px solid white;
		width: 340px;
		height: 270px;
		background-color: #40454b;
		position: absolute;
		color: white;
		padding-top: 30px;
		display: none;
	}
	
	#div_ee8413b2 #background_form {
		left: calc(50% - 170px);
		top: 100px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor {
		left: calc(50% - 255px);
		top: 190px;
	}
	
	#div_ee8413b2 #background_form #background_form_top,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_top {
		height: 30px;
		width: 310px;
		position: absolute;
		top: 0;
		cursor: move;
	}
	
	#div_ee8413b2 #background_form #bg_upload_file {
		display: none;
	}
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 1px solid white;
		border-bottom: 1px solid white;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
	}
	
	#div_ee8413b2 #background_form .background_form_item,
	#div_ee8413b2 #frontPage_listFontColor .frontPage_listFontColor_item {
		padding: 15px 0 15px 40px;
		min-height: 30px;
	}
	
	#div_ee8413b2 #background_form label,
	#div_ee8413b2 #frontPage_listFontColor label {
		float: left;
		height: 30px;
		line-height: 30px;
		min-width: 90px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		border: 1px solid black;
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		background-color: #3a3939;
		cursor: pointer;
		float: left;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn {
		background-color: darkred;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn:hover {
		background-color: red;
	}
	
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn {
		background-color: darkgreen;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn:hover {
		background-color: green;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		background-color: darkslateblue;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #bgImg_cancel_btn:hover {
		background-color: slateblue;
	}
	
	#div_ee8413b2 #background_form #bgUploadBtn {
		width: 100px;
		margin-left: 5px;
	}
	
	#div_ee8413b2 #background_form #background_form_close:hover,
	#div_ee8413b2 #background_form #bgUploadBtn:hover,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close:hover {
		background-color: #4e4e4e;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range,
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		float: left;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range {
		height: 27px;
		margin-right: 10px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		height: 30px;
		width: 80px;
		margin: 0 12px;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val,
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		float: left;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val {
		width: 50px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		width: 80px;
	}
	
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		border: 1px solid black;
		margin: 0 auto;
		padding: 10px;
		color: #F1F1F1;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		border: 1px solid #f1f1f1;
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 0;
		height: 48px;
		line-height: 42px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
		overflow: hidden;
	}
	
	
	/* 头部按钮 */
	
	#div_ee8413b2 #search_wrapper #search_top {
		width: 100%;
		height: 50px;
	}
	
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #F1F1F1;
		text-align: center;
		vertical-align: middle;
		float: left;
		cursor: pointer;
		font-size: 18px;
	}
	
	#div_ee8413b2 #search_top #category_favorites_button {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #F1F1F1;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: pointer;
		font-size: 18px;
		display: none;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button_disabled {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #f1f1f145;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: not-allowed;
		font-size: 18px;
		color: #f1f1f145;
	}
	
	#div_ee8413b2 #search_top #category_search_input {
		width: calc(100% - 392px);
		height: 48px;
		border: 1px solid #F1F1F1;
		float: left;
		margin: 0 10px 0 40px;
	}
	
	#div_ee8413b2 #category_search_input #input_info {
		width: calc(100% - 104px);
		height: 48px;
		float: left;
		padding: 0 4px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 15px;
		margin-top: 2px;
		background-color: transparent;
		caret-color: black;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input_enter {
		margin-left: -15px;
		cursor: pointer;
		display: inline-block;
		color: #40454b;
	}
	
	.user_input_null_backcolor {
		background-color: #f5cc9c80 !important;
	}
	
	.user_input_value_backColor {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input:focus,
	#div_ee8413b2 #category_search_input #input_info #user_input:hover {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		display: inline-block;
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 4px;
		margin-top: 4px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
		padding: 4px 6px;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item:hover {
		border: 1px solid red;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #category_search_input #input_clear {
		width: 47px;
		height: 48px;
		line-height: 48px;
		float: right;
		cursor: pointer;
		font-size: 18px;
		text-align: center;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button {
		border-left: 1px solid #F1F1F1;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_wrapper #display_div {
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_favorites_div,
	#div_ee8413b2 #search_wrapper #category_all_div {
		width: calc(100% - 2px);
		border: 1px solid #F1F1F1;
		margin-top: 10px;
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_all_div,
	#div_ee8413b2 #search_wrapper #category_favorites_div {
		display: none;
	}
	
	#div_ee8413b2 #favorites_list .favorite_items_div,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div h4,
	#div_ee8413b2 #favorites_list h4,
	#div_ee8413b2 #favorites_edit_list h4 {
		padding: 0;
		margin: 10px;
		color: #fadfc0;
	}
	
	#div_ee8413b2 #category_all_div .c_item,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item {
		margin: 3px 3px 3px 10px;
		font-size: 15px;
		cursor: pointer;
		display: inline-block;
		color: #F5CC9C;
	}
	
	#div_ee8413b2 #category_all_div .c_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover {
		color: gold;
	}
	
	#div_ee8413b2 #category_all_div .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear {
		margin: 3px 0 3px 10px;
		border: 1px solid #fadfc0;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #fadfc0;
	}
	
	.chooseTab {
		background-color: #7b7e85c2;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_all_div #category_list {
		display: none;
	}
	
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_favorites_div #favorites_editor {
		width: 100%;
		height: 25px;
	}
	
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		border-bottom: 1px solid #F1F1F1;
		border-right: 1px solid #F1F1F1;
		width: 49.5px;
		float: left;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover {
		border-bottom: 1px solid #F1F1F1;
		border-left: 1px solid #F1F1F1;
		width: 49.5px;
		float: right;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorite_upload_files {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend {
		width: calc(100% - 48px);
		margin-left: -1px;
		border: 1px solid #F1F1F1;
		border-top: 0;
		background-color: #40454B;
		max-height: 500px;
		overflow-y: auto;
		position: relative;
	}
	
	.t_favorite_ido #category_user_input_recommend {
		border: 1px solid #C2C1C1;
		border-top: 0;
		background-color: #40454B;
		max-height: 500px;
		position: relative;
		top: -10px;
		z-index: 100;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		cursor: pointer;
		color: #ffde74;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #C2C1C1;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #f1f1f1;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:not(:first-child),
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:hover,
	.t_favorite_ido #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #7b7e85c2;
	}
	
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		display: none;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		min-height: 90px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_list .category_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div #category_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list h4 {
		font-size: 16px;
	}
	
	#div_ee8413b2 #category_all_div #category_list,
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		height: 500px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar,
	.torrents_detail_info #etd p::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-track,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-track,
	.torrents_detail_info #etd p::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-thumb,
	.t_favorite_ido #category_user_input_recommend::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-thumb,
	.torrents_detail_info #etd p::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_loading_div,
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button,
	#div_ee8413b2 #category_search_input #input_clear,
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #search_top #category_addFavorites_button,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel,
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover,
	#div_ee8413b2 #category_list .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear,
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #favorites_edit_list .f_edit_item {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper #search_close:hover,
	#div_ee8413b2 #search_top #category_all_button:hover,
	#div_ee8413b2 #search_top #category_favorites_button:hover,
	#div_ee8413b2 #category_search_input #input_clear:hover,
	#div_ee8413b2 #category_search_input #category_enter_button:hover,
	#div_ee8413b2 #search_top #category_addFavorites_button:hover,
	#div_ee8413b2 #category_editor #all_collapse:hover,
	#div_ee8413b2 #category_editor #all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_edit:hover,
	#div_ee8413b2 #favorites_editor #favorites_clear:hover,
	#div_ee8413b2 #favorites_editor #favorites_save:hover,
	#div_ee8413b2 #favorites_editor #favorites_cancel:hover,
	#div_ee8413b2 #favorites_editor #favorites_export:hover,
	#div_ee8413b2 #favorites_editor #favorites_recover:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#div_ee8413b2 #category_list .category_extend:hover,
	#div_ee8413b2 #favorites_list .favorite_extend:hover,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear:hover,
	#div_ee8413b2 #category_list .c_item:hover,
	#div_ee8413b2 #favorites_list .c_item:hover {
		transform: scale(2);
	}
	
	#dms #googleTranslateDiv,
	.t_popular_toppane #googleTranslateDiv,
	.t_torrentsPage_ido #googleTranslateDiv {
		float: left;
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		position: absolute;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
	}
	
	#dms #googleTranslateDiv {
		margin-top: -13px;
	}
	
	.t_favorite_ido #dms #googleTranslateDiv {
		margin-top: -42px;
		right: 16px;
	}
	
	.t_popular_toppane #googleTranslateDiv {
		margin-top: -30px;
	}
	
	.t_torrentsPage_ido #googleTranslateDiv {
		top: 105px;
	}
	
	#dms #translateLabel,
	.t_popular_toppane #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel,
	.t_popular_toppane #googleTranslateDiv,
	.t_popular_toppane #translateLabel,
	.t_torrentsPage_ido #googleTranslateDiv,
	.t_torrentsPage_ido #translateLabel {
		cursor: pointer;
	}
	
	.div_ee8413b2_category_checked {
		background-color: darkred !important;
	}
	
	#gd5 #googleTranslateDiv {
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
		margin-bottom: 15px;
	}
	
	#gd5 #googleTranslateDiv #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#gd5 #googleTranslateDiv,
	#gd5 #googleTranslateDiv #googleTranslateCheckbox,
	#gd5 #googleTranslateDiv #translateLabel {
		cursor: pointer;
	}
	
	#div_ee8413b2_detail_clearBtn,
	#div_ee8413b2_detail_addFavoriteBtn,
	#div_ee8413b2_detail_searchBtn {
		width: 130px;
		height: 25px;
		line-height: 25px;
		font-weight: bold;
		font-size: 13px;
		border: 1px solid #8d8d8d;
		background-color: #34353b;
		border-radius: 3px;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		margin: 0 auto;
		margin-bottom: 15px;
		display: none;
	}
	
	#gd5 #googleTranslateDiv:hover,
	#div_ee8413b2_detail_clearBtn:hover,
	#div_ee8413b2_detail_addFavoriteBtn:hover,
	#div_ee8413b2_detail_searchBtn:hover,
	.t_popular_toppane #googleTranslateDiv:hover,
	.t_torrentsPage_ido #googleTranslateDiv:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#nb {
		font-size: 17px;
		padding-top: 8px;
	}
	
	#nb>div {
		background-image: none;
	}
	
	#nb div a:hover {
		color: gold;
	}
	
	#dms>div>select {
		left: -87px;
		width: 206px;
	}
	
	table.itg>tbody>tr>th {
		text-align: center;
		font-size: 13px;
	}
	
	table td.tc {
		min-width: 30px;
	}
	
	table.itg tr:not(:first-child):hover {
		background-color: #4f535b;
	}
	
	table.itg tr:first-child:hover,
	div.itg .gl1t:hover {
		background-color: #4f535b;
	}
	
	div#gdf a {
		text-decoration: underline;
	}
	
	.glname table td.tc,
	#taglist table td.tc {
		min-width: 50px;
	}
	
	#taglist::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#taglist::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#taglist::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#gmid #gd5 .g2 {
		padding-bottom: 15px;
	}
	
	table .gt,
	table .gtl,
	table .gtw {
		height: 18px;
		line-height: 18px;
	}
	
	.headMenu_check {
		border-top: 2px solid #f1f1f1;
		padding-top: 6px !important;
		margin-top: -8px;
	}
	
	.t_favorite_ido .nosel {
		border-radius: 10px;
		margin-top: 20px !important;
		padding-top: 20px;
		padding-left: 30px;
		height: 65px;
		border: 1px solid #C2C1C1;
		background-color: #34353b;
	}
	
	.t_favorite_ido .nosel .fp:last-child {
		background-color: #34353b;
		top: -87px;
	}
	
	.t_favorite_ido .nosel .fp:last-child:hover,
	.t_favorite_ido .nosel .fps {
		background-color: #43464e !important;
	}
	
	.t_favorite_ido .favorite_null {
		color: #c3bfbf;
	}
	
	.t_favorite_ido .searchDiv {
		width: 855px !important;
		height: 30px;
		margin: 0 auto !important;
		padding: 10px 0 30px 0;
	}
	
	.t_favorite_ido .searchDiv .searchInputDiv {
		float: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv {
		float: right;
		width: 310px !important;
		padding-right: 0 !important;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td {
		width: auto !important;
		height: 30px;
		display: inline-block;
		line-height: 30px;
		text-align: left;
	}
	
	.t_favorite_ido .searchDiv .searchFilterDiv td label {
		height: 30px;
		line-height: 30px;
	}
	
	.gm #h1Origin_copy {
		font-size: 10pt;
		padding: 0 0 2px;
		margin: 3px 15px;
		color: #b8b8b8;
		border-bottom: 1px solid #000000;
	}
	
	.gm #h1Title_copy {
		font-size: 12pt;
		padding: 0 0 2px;
		margin: 3px 15px;
	}
	
	.torrents_detail_info,
	.torrents_detail_index {
		min-height: 535px;
		height: auto !important;
	}
	
	.t_torrentsPage_ido #torrentform {
		width: 660px;
		margin: 20px auto;
		height: 50px;
	}
	
	.t_torrentsPage_ido #focusme {
		float: left;
	}
	
	.t_torrentsPage_ido #torrentform p {
		float: left;
		margin-top: 5px;
	}
	
	.torrents_detail_info table:nth-child(3) {
		margin-left: 15% !important;
	}
	
	.torrents_detail_info a {
		text-decoration: underline !important;
	}
	
	.torrents_detail_info #etd p {
		height: 214px;
		padding: 0 1px;
		overflow-y: auto;
	}
	
	.torrents_detail_info #etd #googleTranslateDiv {
		background-color: #4f535b;
		display: inline-block;
		margin-left: -1px;
		padding: 0 10px 3px 10px;
		margin-top: 2px;
		cursor: pointer;
	}
	
	.torrents_detail_index form table tr td:nth-child(4),
	.torrents_detail_index form table tr td:nth-child(5) {
		text-align: center;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_select {
		display: inline-block;
	}
	
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(1),
	.t_uconfigPage_outer #profile_outer #profile_select>div:nth-child(3) {
		width: auto;
	}
	
	.t_uconfigPage_outer #profile_outer div#profile_action {
		float: right;
		padding-top: 3px;
	}
	
	.t_uconfigPage_outer .span_pixel {
		position: relative;
		top: 2px;
	}
	
	.t_uconfigPage_outer form h2 {
		font-size: 18px;
		margin-top: 30px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper {
		height: calc(100vh - 145px);
		overflow: auto;
		margin: 5px 0;
		padding: 0 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	.t_uconfigPage_outer form #contentForm_wrapper::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm {
		margin-top: 10px;
	}
	
	.t_frontpage_ido #searchbox .nopm input[type="button"],
	.t_frontpage_ido #searchbox .nopm input[type="submit"] {
		width: 70px;
	}
	
	.t_frontpage_ido #advdiv {
		width: 598px;
		margin: auto;
		border: 2px ridge #3c3c3c;
		margin-top: 11px;
	}
	
	.t_frontpage_ido #advdiv,
	.t_frontpage_ido #fsdiv {
		padding: 10px 0;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend {
		border: 1px solid #C2C1C1;
		border-top: 0;
		background-color: #40454B;
		max-height: 500px;
		position: relative;
		z-index: 99;
		display: none;
		width: 100%;
		overflow-y: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 15px;
		padding: 5px;
		cursor: pointer;
		color: #ffde74;
		min-height: 20px;
		line-height: 20px;
		overflow: auto;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #C2C1C1;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #7b7e85c2;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	.t_frontpage_ido .nopm #category_user_input_recommend::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	.t_detail_comment .comment_span {
		margin-right: 10px;
		float: left;
	}
	
	.t_detail_comment .comment_span,
	.t_detail_comment .comment_span input,
	.t_detail_comment .comment_span label {
		cursor: pointer;
	}
	
	#t_mytags_div {
		width: calc(100% - 2px);
		border: 1px solid white;
		margin-bottom: 10px;
	}
	
	#t_mytags_data_update_tip {
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		position: absolute;
		margin-top: 5px;
		display: none;
		background-color: #34353b;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#t_mytags_div #t_mytags_top {
		height: 49px;
		width: 100%;
		border-bottom: 1px solid white;
	}
	
	#t_mytags_div #t_mytags_bottom {
		height: 0;
		overflow-y: hidden;
	}
	
	#t_mytags_div #t_mytags_bottom #t_split_line {
		border-left: 1px solid white;
		height: 100%;
		float: left;
	}
	
	#t_mytags_div #t_mytags_bottom #t_allCategories,
	#t_mytags_div #t_mytags_bottom #t_favoriteCategories {
		width: calc(50% - 0.5px);
		height: 100%;
		float: left;
	}
	
	#t_mytags_top #clear_search_btn,
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn {
		border: 1px solid white;
		height: 35px;
		line-height: 35px;
		margin: 5.5px 10px 0 0;
		cursor: pointer;
		text-align: center;
		color: white;
	}
	
	#t_mytags_top #t_mytags_extend_btn {
		float: left;
		margin-left: 10px;
	}
	
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn {
		width: 130px;
	}
	
	#t_mytags_top #clear_search_btn {
		width: 50px;
		float: left;
		margin-left: -11px;
		text-align: center;
		color: white;
	}
	
	#t_mytags_top #t_mytags_clodToFavorite_btn,
	#t_mytags_top #t_mytags_submitCategories_btn {
		float: right;
	}
	
	#t_mytags_top #t_mytags_search {
		border: 1px solid white;
		height: 31px;
		line-height: 31px;
		margin: 5.5px 10px 0 0;
		background-color: transparent;
		color: white;
		padding-left: 5px;
		float: left;
		margin-left: 26px;
		width: calc(100% - 560px);
		min-width: 100px;
	}
	
	#t_mytags_bottom #t_allCategories #t_allCategories_tool,
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_tool {
		height: 25px;
		background-color: #41454c;
	}
	
	#t_mytags_bottom .mytags_allCheck_div {
		border-right: 1px solid white;
		border-top: 1px solid white;
		height: 24px;
		line-height: 24px;
		width: 80px;
		float: left;
		text-align: center;
		color: white;
	}
	
	#t_mytags_bottom .mytags_allCheck_div,
	#t_mytags_bottom .mytags_allCheck_div input[type="checkbox"],
	#t_mytags_bottom .mytags_allCheck_div label {
		cursor: pointer;
	}
	
	#t_mytags_bottom p {
		height: 24px;
		line-height: 24px;
		margin: 0;
		padding: 0;
		font-weight: bold;
		border-top: 1px solid white;
		text-align: center;
		color: white;
	}
	
	#t_mytags_bottom #allCategories_allCheck:indeterminate::after,
	#t_mytags_bottom #favoriteCategories_allCheck:indeterminate::after {
		display: block;
		content: "";
		width: 7px;
		height: 3px;
		background-color: #0075FF;
		border-radius: 2px;
		margin-left: 3px;
		margin-top: 5px;
	}
	
	#t_mytags_bottom #mytags_left_all_collapse,
	#t_mytags_bottom #mytags_left_all_expand,
	#t_mytags_bottom #mytags_right_all_collapse,
	#t_mytags_bottom #mytags_right_all_expand {
		border-left: 1px solid white;
		border-top: 1px solid white;
		height: 24px;
		line-height: 24px;
		width: 50.5px;
		float: right;
		cursor: pointer;
		text-align: center;
		color: white;
		cursor: pointer;
	}
	
	#t_mytags_bottom #t_allCategories #t_allCategories_window,
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window {
		height: 325px;
		overflow-y: auto;
	}
	
	#t_mytags_bottom #t_allCategories #t_allCategories_window::-webkit-scrollbar,
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#t_mytags_bottom #t_allCategories #t_allCategories_window::-webkit-scrollbar-track,
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#t_mytags_bottom #t_allCategories #t_allCategories_window::-webkit-scrollbar-thumb,
	#t_mytags_bottom #t_favoriteCategories #t_favoriteCategories_window::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#t_mytags_bottom #t_allCategories_window h4,
	#t_mytags_bottom #t_favoriteCategories_window h4 {
		color: #fadfc0;
		font-weight: bold;
		margin: 0;
		margin-top: 10px;
		padding-left: 10px;
	}
	
	#t_mytags_bottom #t_allCategories_window h4 span,
	#t_mytags_bottom #t_favoriteCategories_window h4 span {
		border: 1px solid #fadfc0;
		width: 12px;
		display: inline-block;
		text-align: center;
		height: 12px;
		line-height: 12px;
		font-weight: 500;
		cursor: pointer;
	}
	
	#t_mytags_bottom #t_allCategories_window h4 span:hover,
	#t_mytags_bottom #t_favoriteCategories_window h4 span:hover {
		transform: scale(1.2);
	}
	
	#t_mytags_bottom .mytags_item_wrapper {
		border: 1px solid #fadfc0;
		border-radius: 5px;
		margin: 10px 0 0 10px;
		display: inline-block;
		padding: 2px 5px;
		color: #fadfc0;
	}
	
	#t_mytags_bottom .mytags_item_wrapper,
	#t_mytags_bottom .mytags_item_wrapper input[type="checkbox"],
	#t_mytags_bottom .mytags_item_wrapper label {
		cursor: pointer;
	}
	
	#t_mytags_bottom .mytags_item_wrapper label {
		line-height: 20px;
	}
	
	#t_mytags_bottom #t_mytags_allcategory_loading_div,
	#t_mytags_bottom #t_mytags_favoritecategory_loading_div {
		height: 325px;
		width: 100%;
		line-height: 325px;
		text-align: center;
		font-size: 20px;
	}
	
	
	#t_mytags_top #clear_search_btn,
	#t_mytags_top #t_mytags_extend_btn,
	#t_mytags_top #t_mytags_submitCategories_btn,
	#t_mytags_top #t_mytags_clodToFavorite_btn,
	#t_mytags_bottom #mytags_left_all_collapse,
	#t_mytags_bottom #mytags_left_all_expand,
	#t_mytags_bottom #mytags_right_all_collapse,
	#t_mytags_bottom #mytags_right_all_expand,
	#t_mytags_bottom .mytags_allCheck_div,
	#t_mytags_bottom p,
	#t_mytags_bottom .mytags_item_wrapper,
	#t_mytags_bottom #t_allCategories_window h4 span,
	#t_mytags_bottom #t_favoriteCategories_window h4 span {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#t_mytags_top #clear_search_btn:hover,
	#t_mytags_top #t_mytags_extend_btn:hover,
	#t_mytags_top #t_mytags_submitCategories_btn:hover,
	#t_mytags_top #t_mytags_clodToFavorite_btn:hover,
	#t_mytags_bottom #mytags_left_all_collapse:hover,
	#t_mytags_bottom #mytags_left_all_expand:hover,
	#t_mytags_bottom #mytags_right_all_collapse:hover,
	#t_mytags_bottom #mytags_right_all_expand:hover,
	#t_mytags_bottom .mytags_allCheck_div:hover,
	#t_mytags_bottom .mytags_item_wrapper:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(1) {
		width: 184px;
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(3) {
		width: 86px;
	}
	
	.t_mytagsPage_outer #tagset_outer div:nth-child(6) {
		padding-left: 50px;
	}
	
	.hide {
		display: none !important;
	}
	
	.t_mytagsPage_outer #upload_tag_form {
		border: 2px solid white;
		background-color: #40454b;
		color: white;
		width: 800px;
		height: 400px;
		position: absolute;
		top: calc(50vh - 200px);
		left: calc(50vw - 400px);
		z-index: 99;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_top {
		height: 30px;
		width: 100%;
		position: absolute;
		top: 0;
		cursor: move;
		text-align: center;
		line-height: 30px;
		font-weight: bold;
		font-size: 16px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 2px solid white;
		border-bottom: 2px solid white;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle {
		height: 320px;
		width: 100%;
		margin-top: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_left,
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_right {
		height: 280px;
		padding: 20px 10px 0 20px;
		width: calc(50% - 30.5px);
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle #upload_tag_form_middle_split {
		width: 0;
		margin-top: 20px;
		height: 280px;
		border-left: 1px solid white;
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom {
		height: 30px;
		width: 100%;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item {
		font-size: 10px;
		height: 40px;
		margin-bottom: 40px;
		margin-top: 25px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item:first-child {
		height: 60px;
	}
	
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label {
		height: 30px;
		line-height: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label {
		width: 88px;
		height: 60px;
		line-height: 60px;
		float: left;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.color_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.weight_label {
		width: 88px;
		height: 40px;
		line-height: 40px;
		float: left;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.checkbox_label {
		height: 60px;
		line-height: 60px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.color_label,
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item label.weight_label {
		height: 40px;
		line-height: 40px;
	}
	
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item input[type="color"],
	.t_mytagsPage_outer #upload_tag_form .upload_tag_form_item input[type="range"] {
		float: left;
		width: 100px;
		height: 30px;
		margin-top: 5px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #tag_color_val,
	.t_mytagsPage_outer #upload_tag_form #tag_weight_val {
		float: left;
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 80px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #checkboxDiv {
		width: 170px;
		height: 80px;
		float: left;
	}
	
	.t_mytagsPage_outer #upload_tag_form #checkboxDiv input {
		position: relative;
		top: 2px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn,
	.t_mytagsPage_outer #upload_tag_form #tag_color_reset_btn,
	.t_mytagsPage_outer #upload_tag_form #weight_reset_btn {
		border: 1px solid white;
		padding: 2px 10px;
		width: 50px;
		text-align: center;
		height: 30px;
		line-height: 30px;
		float: right;
		margin-right: 15px;
		cursor: pointer;
	}
	
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn:hover,
	.t_mytagsPage_outer #upload_tag_form #tag_color_reset_btn:hover,
	.t_mytagsPage_outer #upload_tag_form #weight_reset_btn:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	.t_mytagsPage_outer #upload_tag_form #behavior_reset_btn {
		margin-top: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom {
		width: 100%;
		height: 30px;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn,
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn {
		width: 100px;
		border: 1px solid black;
		height: 28px;
		line-height: 28px;
		text-align: center;
		float: left;
		font-size: 10px;
		cursor: pointer;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn {
		margin-left: 275px;
		background-color: darkgreen;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_save_btn:hover {
		background-color: green;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn {
		margin-left: 50px;
		background-color: darkslateblue;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_bottom #upload_cancel_btn:hover {
		background-color: slateblue;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div {
		height: 260px;
		overflow-y: auto;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #uploadForm_tags_div::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 {
		margin: 0;
		margin-top: 10px;
		color: #fadfc0;
		font-weight: bold;
		margin-bottom: 10px;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 span {
		border: 1px solid #fadfc0;
		cursor: pointer;
		width: 12px;
		display: inline-block;
		text-align: center;
		height: 12px;
		line-height: 12px;
		font-weight: 500;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right h4 span:hover {
		transform: scale(1.2);
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right .checkTags_item {
		display: inline-block;
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
		margin: 0 10px 10px 0;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right .checkTags_item:hover {
		border: 1px solid red;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #checkTags_reset_btn {
		color: #fadfc0;
		border: 1px solid #f5cc9c;
		text-align: center;
		height: 50px;
		line-height: 50px;
		width: 150px;
		margin: 105px auto;
		cursor: pointer;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_form #upload_tag_form_middle_right #checkTags_reset_btn:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	.t_mytagsPage_outer #upload_tag_ing {
		border: 2px solid white;
		background-color: #40454b;
		color: white;
		padding: 0 20px;
		width: 300px;
		height: 300px;
		position: absolute;
		top: calc(50vh - 150px);
		left: calc(50vw - 150px);
		z-index: 99;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing:hover {
		border-color: yellow;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_top {
		height: 60px;
		line-height: 60px;
		width: calc(100% - 40px);
		position: absolute;
		top: 0;
		cursor: move;
		text-align: center;
		font-weight: bold;
		font-size: 18px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_1 {
		margin-top: 80px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_1,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_ing_tips_2,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_error {
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_error {
		margin-bottom: -20px;
		display: none;
		color: red;
		font-size: 17px;
		font-weight: bold;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #tip_pause {
		color: yellow;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #tip_continue {
		color: lightgreen;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_remainder,
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_success {
		margin-top: 20px;
		text-align: center;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_success {
		font-size: 20px;
		font-weight: bold;
		color: lightgreen;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_tag_remainder #upload_remainder_count {
		font-size: 30px;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn,
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn {
		border: 1px solid black;
		width: 100px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		cursor: pointer;
		margin: 30px auto;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn {
		background-color: darkred;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_stop_btn:hover {
		background-color: red;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn {
		background-color: darkslateblue;
		display: none;
	}
	
	.t_mytagsPage_outer #upload_tag_ing #upload_ing_window_close_btn:hover {
		background-color: slateblue;
	}`;
	styleInject(category_style);
});

//#endregion