(function($) {
    $.fn.webview = function(params) {
        var request = require('request');
        var openfpt_api_key = "01b4a2586f2f4ea0a73a6c650f8bd49f"

        var settings = $.extend({
                url: "",
                tab: null
            }, params),
            t = this,
            lastUrl = ''
        pref = ''
        var settingmng = require('electron-settings')

        if(!settingmng.get("settings.allowScript")) {
            pref = 'javascript=0'
        }
        if(!settingmng.get("settings.allowImage")) {
            pref = 'images=0'
        }
        if(!settingmng.get("settings.allowScript") && !settingmng.get("settings.allowImage")) {
            pref = 'javascript=0, images=0'
        }
        t.isPrivacy = false
        t.webview = $('<webview class="webview" preload="js/extensions/preload.js" webpreferences="' + pref + '" useragent="Mozilla/5.0 (Windows NT) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 KT-Browser/7.0.1" autosize="on" src="about:blank" plugins>').appendTo($(this))[0]
        t.storage = new Storage()
        t.string = "Siema"
        t.contextMenu = new ContextMenu(t.webview)
        t.fitToParent = function() {
            $(t.webview).css({
                width: window.innerWidth,
                height: window.innerHeight - 79
            })
            t.webview.executeJavaScript('isfullscreen()', true, function(result) {
                if(result == true) {
                    $(t.webview).css({
                        width: window.innerWidth,
                        height: window.innerHeight,
                        marginTop: '-48px'
                    })
                    settings.tab.instance.bar.css('display', 'none')
                } else {
                    $(t.webview).css({
                        width: window.innerWidth,
                        height: window.innerHeight - 79,
                        marginTop: '48px'
                    })
                    settings.tab.instance.bar.css('display', 'block')
                }
            })
        }

        t.fitToParent()

        var cssNightMode = [
            "@charset \"utf-8\";",
			"/* ",
			"Name: White-Black mode (Corak fix) (2015.06.07)",
			"Author: Corak the Avatar",
			"Description: http://vk.com/corakdoom",
			"*/",
			"",
			"/* @Black&White Mode */",
			"*",
			"	{color:#CCC!important;",
			"	background-color:#000!important}",
			"html",
			"	{color:#FFF!important}",
			"input,textarea,select",
			"	{color:#CCC!important;",
			"	background-color:#333!important}",
			"button,",
			"input[type=\"file\"],",
			"input[type=\"submit\"],",
			"input[type=\"button\"],",
			"input[type=\"reset\"]",
			"	{color:#000!important;",
			"	background-color:silver!important}",
			"a[href]",
			"	{text-decoration:underline!important;",
			"	background-color:transparent!important}",
			"a[href]:hover,",
			"a[href]:hover *",
			"	{color:#000!important;",
			"	background-color:#FFF!important;",
			"	opacity:0.93!important}",
			"a[href] img",
			"	{border:thin white!important}",
			"",
			"/* vk.com fixes */",
			"div.feedback_photo_icon,",
			"div.page_post_video_play_inline",
			"	{opacity:0.95!important}",
			".page_wm,",
			".video_row:hover .video_row_controls,",
			".video_row:hover .video_album_controls,",
			".video_row:hover .video_row_add,",
			"div#pv_fullscreen div.pv_fs_controls,",
			"a.fans_fanph,",
			"a.friends_bigph,",
			"div.wall_album_caption,",
			"a.wk_likes_likerph,",
			".page_album_title_wrap,",
			"#vk_wrap div.album_name,",
			"#vk_wrap span.pv_icon,",
			"#vk_wrap i.i_icon,",
			"#vk_wrap i.i_like,",
			"#vk_wrap i.i_replies,",
			"#vk_wrap i.i_tags,",
			".zpv_photo_desc a,",
			"div#vk_wrap .ni_close,",
			"#page_wrap div#side_bar ul[id*=\'vkm_\'],",
			".add_media_rows,",
			"#photos_albums .photo_album_info,",
			"#photos_albums .photo_album_info_cont,",
			"#photos_albums .photo_album_info_back,",
			"#photos_albums .photo_album_title,",
			"#photos_albums .photo_album_title div.clear_fix,",
			"#photos_albums .description,",
			".ac_load_line,",
			".audio_back_line,",
			".ac_back_line,",
			"#ac_pr_slider,",
			"#ac_pr_line,",
			"#ac_back_line,",
			"#ac_load_line,",
			"div#ac_vol,",
			"#audio .title_wrap,",
			"#ac_controls .next_prev,",
			".vk_ph_info .info_wrap",
			"	{opacity:0.7!important}",
			"#pv_fs .pvs_fs_fg",
			"	{opacity:0.3!important}",
			".nim-dialog .nim-dialog--name,",
			".im-mess-stack .im-mess-stack--content .im-mess-stack--pname,",
			".im-mess-stack--pname,",
			".audio_inline_player .slider,",
			".audio_inline_player .audio_inline_player_left,",
			".audio_row_current .audio_inline_player,",
			".pv_fs_wrap,",
			".pv_hh_like_wrap,",
			"#page_wrap #page_header .content,",
			".video_row_count_panel,",
			"#pv_fullscreen,",
			".pvs_actions,",
			".pvs_actions_wrap,",
			"div#chat_onl_wrap,",
			"a.chat_tab_wrap,",
			"a.chat_tab_wrap div.chat_onl_cont,",
			"#pv_photo_wrap div.pvs_fs,",
			"div#pd_white_line,",
			"div#pd_vol_white_line,",
			"#apps_wrap div.app_cat_image_cont,",
			"#apps_wrap div.app_cat_image,",
			"#apps_wrap div.app_cat_image > a,",
			"#photos_upload_area_wrap,",
			"#lite_photo_uploader,",
			"#lite_upload3,",
			"embed#uploader_lite3,",
			".add_media_menu,",
			"#pv_box #pv_comments_data,",
			"#pv_box div.pv_data,",
			"#pv_box #pv_summary,",
			"div#layer div.pv_cont table,",
			"div#layer div.pv_cont tbody,",
			"div#layer div.pv_cont tr,",
			"div#layer div.pv_cont td,",
			"#lite_photo_uploader,",
			"#owner_photo_bubble_wrap,",
			"#owner_photo_bubble,",
			"#owner_photo_bubble_wrap div,",
			"span.item_replies,",
			"a.item_like._i,",
			".vk_ph_info,",
			".post_upload_wrap,",
			"#ac,",
			".ac_wrap,",
			"#ac_controls,",
			".ac_wrap .info,",
			".ac_wrap .info .player_wrap,",
			".player_wrap #ac_player #ac_pr,",
			".player_wrap #ac_player,",
			".player_wrap #ac_player table,",
			".player_wrap #ac_player table tr,",
			".player_wrap #ac_player table td,",
			".player_wrap #ac_player table tbody,",
			"#ac_pr,",
			"#ac_pr #ac_white_line,",
			"#ac_pr .ac_white_line,",
			".ac_wrap .info .title_wrap,",
			".place_map_cont,",
			"#place_map_cont,",
			"#place_map_cont div,",
			".mv_cont,",
			"#profile_place_add,",
			"a.feed_article_thumb,",
			"#box_layer_bg,",
			"#box_layer_wrap,",
			"#box_layer,",
			"#mv_layer_wrap,",
			"#mv_layer,",
			"a.page_media_link_thumb,",
			"#audio.new .actions,",
			".audio_vol_white_line,",
			".audio_white_line,",
			".audio .info .actions .audio_add_warp,",
			".audio .info .actions,",
			".pva_repeat_blob,",
			".pva_repeat_cont,",
			".pva_title,",
			".pva_title div.clear_fix,",
			".pva_repeat,",
			".video_tag_label,",
			".video_module .video div,",
			"#stl_side.fixed.stl_active,",
			"#stl_side.fixed.stl_active #fmenu,",
			"#profile_map_cont,",
			"#profile_map_cont div,",
			".wk_cont,",
			"#wk_layer_wrap,",
			"#wk_layer,",
			".scroll_fix_wrap,",
			"#uploader_lite0,",
			".vk_usermenu_btn,",
			".video_album_info,",
			".video_album_text,",
			".video_row_info_line,",
			".video_album_count,",
			".video_row_duration,",
			".video_raw_info_name,",
			".im_log_body,",
			"div.player,",
			"div.player table,",
			"div.player table tbody,",
			"div.player table tbody tr,",
			"div.player table tbody tr td,",
			"div.player table tbody tr td .audio_pr,",
			"#ts_friends_online,",
			".input_back_wrap,",
			".input_back_wrap .input_back,",
			".input_back .input_back_content,",
			".vk_vid_acts_panel,",
			".vk_vid_acts_panel a,",
			".download_cont span a,",
			".download_cont span,",
			".download_cont,",
			".page_post_video_duration,",
			".photos_choose_album_title,",
			".photos_choose_album_title .clear_fix,",
			".photos_choose_row_add,",
			".photos_choose_row_add .bg,",
			".im_doc_photo_hint,",
			".im_doc_photo_hint span,",
			".mt_label,",
			".zpv_tags,",
			".zpv_tag,",
			".zpv_tl,",
			".zpv_tag .fill,",
			".zpv_photo_desc,",
			".zpv_bottom,",
			".zpv_bottom_body,",
			".mhead.zpv_header,",
			".zpv_close_wrap,",
			".zpv_header .hb_wrap,",
			"#zpv_summary,",
			".zpv_controls,",
			"div#gp_wrap,",
			".gp_vka_ctrls,",
			"div#gp,",
			"div#gp .wrap,",
			"#gp_back,",
			"#notifiers_wrap,",
			"#gp_play_btn,",
			"#notifiers_wrap div,",
			"#notifiers_wrap table,",
			".notifier_image_wrap,",
			".notifier_baloon_msg,",
			"#box_layer_bg,",
			".notifier_author_quote,",
			"#layer_bg,",
			"#layer_wrap #layer,",
			"#layer_wrap #layer .pv_cont,",
			"#layer_wrap,",
			"#graffiti_aligner canvas#graffiti_overlay,",
			"#graffiti_aligner canvas#graffiti_helper,",
			".pv_cont,",
			"#pv_photo,",
			"#pv_photo_wrap,",
			"#pv_box,",
			"#pv_left_nav,",
			"#pv_right_nav",
			"	{background-color:transparent!important}",
			"",
			".slider .slider_slide",
			"	{background-color:#d2d9e1!important}",
			".audio_inline_player .slider .slider_slide,",
			".audio_page_player .slider .slider_slide",
			"	{background-color:#e1e8ee!important}",
			".slider .slider_amount,",
			".slider .slider_back",
			"	{background-color:#5f81a8!important}",
			".audio_inline_player .slider .slider_amount,",
			".audio_page_player .slider .slider_amount",
			"	{background-color:#577ca1!important}",
			"",
			".audio_row:not(.audio_row_current):hover,",
			".im-mess_unread,",
			"#fc_clist,",
			"#rb_box_fc_clist,",
			".fc_clist_inner,",
			".rb_box_wrap fixed rb_active,",
			".dialogs_new_msg,",
			".dialogs_new_msg .dialogs_photo,",
			".dialogs_new_msg .dialogs_info,",
			".dialogs_new_msg .dialogs_msg_contents,",
			"li.active_link,",
			"li.active_link a,",
			".audio.over,",
			".audio.over table,",
			".audio.over .title_wrap,",
			".audio.over .area,",
			"#audio.new .audio.over .area,",
			"#audio.new .audio.tt_shown .area,",
			".audio.over .area .info,",
			"#audio.new .audio.over .area .info,",
			"#audio.new .audio.tt_shown .area .info,",
			".fc_msgs_unread,",
			".fc_msg_unread,",
			".im_new_msg .im_log_author,",
			".im_new_msg .im_log_body,",
			".im_new_msg .im_log_date,",
			".im_new_msg,",
			".im_sel_row .im_log_author,",
			".im_sel_row .im_log_body,",
			".im_sel_row .im_log_date,",
			".im_sel_row .im_log_act,",
			".im_sel_row .im_log_rspacer,",
			".im_sel_row,",
			".im_tab_over .im_tab1,",
			".im_tab_over .im_tab2,",
			".im_tab_over .im_tab3,",
			".add_media_menu .rows a:hover ",
			"	{background-color:#333!important}",
			".audio_back_line,",
			".ac_back_line",
			"	{background-color:#D8DEE4!important}",
			"div.audio_slider",
			"	{background-color:#E1E7ED!important}",
			"#gp #audio_vol_back_global,",
			".audio_volume_line,",
			".audio_load_line,",
			".ac_load_line",
			"	{background-color:#BAC7D4!important}",
			".audio_pr_slider,",
			".audio_vol .audio_progress_line,",
			".audio_vol_slider,",
			".audio_progress_line,",
			".ac_progress_line",
			"	{background-color:#5C7A99!important}",
			".ac_slider",
			"	{background-color:#5F7E9E!important}",
			"#feed_rate_slider",
			"	{background-color:#5F7D9D!important}",
			"#pv_actions a:hover",
			"	{background-color:#E1E7ED!important;",
			"	color:#000!important}",
			".replies_side_over",
			"	{background-color:#E9EDF1!important}",
			".fc_tab,",
			".dialogs_row_over,",
			"tr.new_msg td.mail_check,",
			"tr.new_msg td.mail_photo,",
			"tr.new_msg td.mail_from,",
			"tr.new_msg td.mail_contents,",
			"tr.new_msg td.mail_actions",
			"	{background-color:#444!important}",
			".fc_scrollbar_hovered",
			"	{background-color:#999!important}",
			".fc_tab_wrap,",
			".fc_scrollbar_inner",
			"	{background-color:#888!important}",
			".rb_resize",
			"	{background-color:#AAA!important}",
			".ts_settings",
			"	{color:#2B587A!important}",
			"#gp_pr_slider",
			"	{background-color:#407D9D!important}",
			"#graffiti_aligner canvas#graffiti_common,",
			"#gp .audio_load_line,",
			"#gp .audio_progress_line,",
			"#gp .audio_pr_slider,",
			"#gp .audio_volume_line,",
			"#gp .audio_vol_slider",
			"	{background-color:#FFF!important}",
			".gp_tip_text",
			"	{background-color:#000!important}",
			".mhead.zpv_header",
			"	{border:none!important}",
			".im_tab_selected",
			"	{background-color:#444!important;}",
			"#lite_upload0",
			"	{color:#FFF!important}",
			".bv_row_wrap .bv_row .bv_percent",
			"	{background-color:#DAE1E8!important}",
			".bv_row_wrap .bv_row ",
			"	{background-color:#111!important}",
			".page_poll_percent",
			"	{height:11px!important;",
			"	background-color:#DAE1E8!important}",
			".page_media_poll .page_poll_row_count",
			"	{line-height:100%!important;",
			"	margin:0!important}",
			"",
			"/* m.vk.com */",
			"/* m.vk.com 640x480 black-white fix */",
			"#vk_wrap i.zpv_close_icon,",
			"#vk_wrap b.v_like",
			"	{opacity:0.7!important}",
			".aic_ln.aic_progress_line",
			"	{background-color:#5C7A99!important}",
			".aic_slider",
			"	{background-color:#5F7E9E!important}",
			".aic_ln.aic_pl_wrap",
			"	{background-color:rgb(216,222,228)!important}",
			"#vk_wrap .answers_item .pointer,",
			"#vk_wrap span.item_repost,",
			".aic_line,",
			"div.pv_body,",
			"div.pv_body div,",
			"div.pv_body a,",
			"div.pv_body td,",
			"div.pv_body tr,",
			"div.pv_body table,",
			"div.pv_body .poll_option_line_val,",
			"div.pv_body tbody",
			"	{background-color:transparent!important}",
			".sp_pptw,",
			"div.pv_body .poll_option_line_pro,",
			".mi_unread div,",
			".mi_unread,",
			".di_unread_inbox div,",
			".di_unread_inbox",
			"	{background-color:#444!important}",
			".di_unread_outbox .di_body",
			"	{background-color:#333!important}",
			".sp_ppt_sel .sp_pptw",
			"	{background-color:#FFF!important}",
			"	",
			"/* ag.ru */",
			"table.bb.imgloadbig tbody img,",
			".screen_cont a,",
			".screen_cont a img",
			"	{background-color:transparent!important}",
			"",
			"/* app.asana.com */",
			"div.scroll-body,",
			"div.greyable-area-contents,",
			"div.greyable-area-container",
			"	{background-color:transparent!important}",
			"",
			"/* flickr.com */",
			".photo-well-scrappy-view .height-controller.enable-zoom .photo-well-media-scrappy-view,",
			"div.photo-display-item div.play,",
			"div#photo-container #photo-drag-proxy",
			"	{background-color:transparent!important}",
			"#content img.main-photo{z-index:100!important}",
			".photo-list-photo-view .interaction-view:hover,",
			".photo-list-photo-view .interaction-view.manual-hover",
			"	{opacity:0.5!important}",
			"",
			"/* Old-games.ru */",
			"body.fancybox-lock,",
			".fancybox-wrap,",
			".fancybox-desktop,",
			".fancybox-opened,",
			".fancybox-opened .fancybox-skin,",
			".fancybox-outer a.fancybox-prev,",
			".fancybox-outer a.fancybox-next,",
			".fancybox-overlay,",
			".fancybox-nav,",
			".fancybox-next,",
			".fancybox-outer",
			"	{background-color:transparent!important}",
			"",
			".fancybox-inner",
			"	{overflow:hidden!important}",
			"",
			"/* small-games.info */",
			"#fancybox-left,",
			"#fancybox-right",
			"	{background-color:transparent!important}",
			"",
			"/* Lurkmore */",
			".pp_pic_holder,",
			".pp_pic_holder .pp_top,",
			".pp_pic_holder .pp_content_container,",
			".pp_pic_holder .pp_content_container .pp_left,",
			".pp_pic_holder .pp_content_container .pp_left .pp_right,",
			".pp_pic_holder .pp_content_container .pp_left .pp_right .pp_content,",
			".pp_pic_holder .pp_content_container .pp_left .pp_right .pp_content .pp_fade,",
			".pp_hoverContainer,",
			".pp_hoverContainer a.pp_next,	",
			".pp_hoverContainer a.pp_previous,",
			".embed-placeholder-playbutton,",
			".embed-placeholder-btn",
			"	{background-color:transparent!important}",
			"",
			"/* Google Maps */ ",
			"div#inner div#page div#main_map,",
			"div#panel-width,",
			"div#spsizer.cs,",
			"div#gbq1.gbt,",
			"div#gbq1.gbt a.gbqla,",
			"div#gbq1.gbt a.gbqla div.gbqlca,",
			"div#copyright.mapfooter,",
			"div#copyright.mapfooter div,",
			"div#copyright.mapfooter div span,",
			"div#lmc3d.gmnoprint div div img,",
			"#lmcslider,",
			"#lmcslider div,",
			"#lmcslider div img,",
			"div#lmczo,",
			"div#lmczo div,",
			"div#lmczo div img,",
			".css-3d-layer,",
			"#dragContainer,",
			"#tileContainer,",
			".gmnoprint,",
			".gmnoprint div,",
			"#views-hover,",
			"#mv-primary-container,",
			".mv-primary,",
			".gmnoprint #compass,",
			".gmnoprint div,",
			"#lmcslider,",
			"#lmczo,",
			".noearth,",
			".mv-primary-preview-frame,",
			".mv-primary-preview-lens,",
			".subpanel,",
			".header-buttons.kd-buttonbar.kd-buttonbar-right",
			"	{background-color:transparent!important}",
			"",
			"/* last.fm */",
			"div.scrobblesource,",
			".pictureFrame .overlay",
			"	{background-color:transparent!important}",
			"",
			"/* google.docs */",
			".jfk-palette-colorswatch,",
			".goog-toolbar-button, .goog-toolbar-menu-button",
			"	{background-color:transparent!important;",
			"	background-color:#555!important}",
			"",
			"#foregroundColorButton,",
			".goog-toolbar-menu-button-outer-box,",
			".goog-toolbar-menu-button-inner-box,",
			".goog-toolbar-menu-button-caption,",
			".goog-color-menu-button-indicator,",
			".docs-icon,",
			".docs-icon-img-container,",
			".jfk-palette-cell",
			"	{background-color:transparent!important}",
			"",
			".kix-selection-overlay,",
			".kix-selection-overlay div",
			"	{background-color:#555!important;",
			"	opacity:1!important}",
			"	",
			".kix-spelling-error.kix-htmloverlay.docs-ui-unprintable",
			"	{display:none!important}",
			".kix-cursor-caret",
			"	{border-color:#FFF!important;",
			"	color:#FFF!important}",
			"",
			"[id*=\'SWFUpload_\']",
			" 	{background-color:transparent!important}",
			"",
			"/* mail.ru */",
			"a.b-datalist__item__link,",
			"div.l-catalog_content a,",
			"div.l-catalog_content div",
			"	{background-color:transparent!important}",
			"",
			"/* m.mail.ru */",
			"#m_msglistcontainer td.messageline__box,",
			"#m_msglistcontainer a.messageline__link,",
			"#m_msglistcontainer label.messageline__label",
			"	{padding:0px!important;",
			"	margin:0px!important}	",
			"",
			"/* sinoptik.ua */",
			"#blockDays .main,",
			".weatherIco img",
			"	{background-color:transparent!important}",
			"",
			"/* support.xmplay.com */",
			".thumboverlay",
			"	{display:none!important}",
			"",
			"/* soundcloud.com */",
			".l-container.l-fullwidth,",
			".sc-border-box div.header__right.right,",
			"canvas.g-box-full.sceneLayer,",
			".waveform__playHint,",
			".waveform__layer div,",
			".waveform__layer,",
			".waveformCommentsCanvas",
			"	{background-color:transparent!important}",
			"",
			"/* colorzilla.com */",
			"#cp1_ColorBar img,",
			"#cp1_ColorMap img",
			"	{background-color:transparent!important}",
			"",
			"/* check-you.com */",
			"#lightbox-nav,",
			"#lightbox-nav-btnPrev,",
			"#lightbox-nav-btnNext",
			"	{background-color:transparent!important}",
			"",
			"/* odnoklassniki.ru */",
			"div.sm-item-label,",
			"div.mainContent_w div.lcTc_avatar_ovr,",
			".sm-friend #sm-s-header #sm-badges,",
			"",
			"/* .cc.blk a, */",
			"a.clnk,",
			".plpp_pin_w,",
			".rev_cnt_a,",
			".photoMarkSmall,",
			".plp_slide_outer,",
			".plp_slide_l_outer,",
			"#plp_slide_r_outer,",
			"i.zoom",
			"	{background-color:transparent!important}",
			"",
			".cover_t_c,",
			".cover_t,",
			".cover_ov_t,",
			".cover_ov_b",
			"	{display:none!important}",
			"",
			"/* tumblr.com */",
			"div.post_content div.post_controls,",
			"a.click_glass,",
			"div.post_glass.post_micro_glass,",
			"div.post_glass.post_micro_glass a,",
			"a.tumblelog_compact_avatar_anchor,",
			".tumblelog_mask,",
			".ht_post div.stage a.go",
			"	{background-color:transparent!important}",
			"",
			"/* nudevista.com */",
			".results td img",
			"	{max-width:100%!important;",
			"	max-height:100%!important}",
			"",
			"/* mail.google.com - gmail.com */",
			"	tr.zA.yO.x7",
			"	{background:#555!important}",
			".aSH div.aZs,",
			"div.aSI,",
			"div.RNr9Je,",
			"td.oZ-x3,",
			".T-Jo-Jp,",
			".T-Jo-auh",
			"	{background-color:transparent!important}",
			"",
			"/* wolframalpha.com */",
			"#results #answers div.output.pnt,",
			"#results #answers div.output.pnt canvas",
			"	{background-color:transparent!important}",
			"",
			"/* dobrochan.com */",
			".featuredimgtop,",
			".featuredimgbottom",
			"	{background-color:transparent!important}",
			"",
			"/* maps.yandex.ru */",
			"ymaps.ymaps-ground-pane canvas,",
			"ymaps.ymaps-events-pane,",
			"ymaps.ymaps-controls-lefttop > ymaps,",
			"ymaps.ymaps-b-zoom,",
			"ymaps.ymaps-b-zoom_hints-pos_right,",
			"ymaps.ymaps-b-form-button,",
			"ymaps.ymaps-b-form-button__text,",
			"ymaps.ymaps-image-with-content-content,",
			"ymaps.ymaps-glass-pane,",
			"ymaps.ymaps-layers-pane canvas,",
			"ymaps.graphics-canvas canvas,",
			"ymaps.ymaps-mini-map-frame,",
			"i.b-form-button__click",
			"	{background-color:transparent!important}",
			"b.b-user,",
			".b-head-logo__img,",
			".b-head-logo",
			"	{background-color:#ffffff!important}",
			"ymaps.ymaps-image-with-content",
			"	{opacity:0.6!important}",
			"",
			"/* yandex.ru */",
			"div.b-line.b-line_head,",
			"div.b-line.b-line_search,",
			"div.b-page-layout,",
			"div.b-line.b-line_last,",
			"div.doom-weaponwrap,",
			"div.b-line.b-line_promo",
			"	{background-color:transparent!important}",
			"div.b-line.b-line_adv",
			"	{display:none!important}",
			"",
			"/* images.yandex.ru */",
			"i.b-slideshow-control__icon",
			"	{opacity:0.5!important}",
			"div.b-slideshow-control__button",
			"	{background-color:transparent!important}",
			"",
			"/* lightbox */",
			"div.boxplus-background,",
			"div.boxplus-thumbs,",
			"div.boxplus-next,",
			"div.boxplus-prev",
			"	{background-color:transparent!important}",
			"div.boxplus-rewind,",
			"div.boxplus-forward",
			"	{opacity:0.5!important}",
			"",
			"/* vimeo.com */",
			"",
			"#video section.play-button-cell,",
			"#video button.play,",
			"#video div.volume,",
			"#video div.volume-container,",
			"#video div.button-wrapper,",
			"#video div.progress-container,",
			"#video div.sidedock,",
			"#player button.play",
			"	{opacity:0.5!important}",
			"#video div.video canvas.snapshot,",
			"#player .sidedock,",
			"#player .title,",
			"#player .title > header,",
			"#player .title > header > div,",
			"#player div.target,",
			"#player .controls,",
			"#player .play-button-cell,",
			"#player .play-bar-cell,",
			"#player .play-bar,",
			"#player .play-wrapper,",
			"#player .tiny-bars,",
			"#player .pause-icon,",
			"#player .pause-icon svg,",
			"#main .player .player-alert,",
			"#main .player .target,",
			"#main .player .controls,",
			"#main .player .box,",
			"#main .player .play-bar,",
			"#main .player .play-button-cell,",
			"#main .player .play-bar-cell,",
			"#main .player .sidedock,",
			"#main .player .sidedock .sidedock-inner,",
			"#main #video .box,",
			"#main #video .play-bar,",
			"#main #video .play-button-cell,",
			"#main #video .play-bar-cell,",
			"#main #video .controls,",
			"#main #video div.target",
			"	{background-color:transparent!important}",
			"/* oldgames.sk */",
			"div#lightbox div#lightboxNavLeft,",
			"div#lightbox div#lightboxNavRight",
			"	{background-color:transparent!important}",
			"body > div#overlay",
			"	{display:none!important}",
			"",
			"/* instagram.com */",
			"._80v0r,",
			".-cx-PRIVATE-Video__coverLayer,",
			".-cx-PRIVATE-Video__states,",
			"div.photo-wrapper div.photoShadow,",
			"div.LikeableFrame.iMedia div.vStates,",
			"div.LikeableFrame.iMedia a.vStateSound,",
			"div.LikeableFrame.iMedia a.vStatePlay,",
			"div.LikeableFrame.iMedia a.vCoverLayer,",
			"div.LikeableFrame.iMedia,",
			"div.LikeableFrame.iMedia span.lbAnimation,",
			"div.Video.vStatesHide.Frame,",
			".profile-user .profile-options,",
			"div.profile-user h1,",
			"span.img-inset b,",
			"b.compPhotoShadow,",
			".noScroll .photo-feed .photo:hover .photoShadow",
			"	{background-color:transparent!important}",
			"",
			"/* store.steampowered.com */",
			"#main_content div.cluster_control_left,",
			"#main_content div.cluster_control_right",
			"	{opacity:0.5!important}",
			"",
			".view_inventory_page a.inventory_item_link,",
			"#main div#main_content,",
			"#main div#main_content div.apphub_HomeHeaderContent,",
			"#main div#main_content div.breadcrumbs,",
			"#main_content #highlight_strip_scroll div.highlight_selector,",
			"#main_content a.tab_overlay",
			"	{background-color:transparent!important}	",
			"",
			"/* pinterest.com */",
			"#domainContainer span.hoverMask,",
			"div.pinWrapper div.pinHolder div.hoverMask",
			"	{background-color:transparent!important}	",
			"",
			"/* fastpic.ru fix */",
			"div#left.rounded-corners.dCenter",
			"	{visibility:collapse!important}",
			"",
			"/* fb Facebook */",
			"#facebook ._4-oi,",
			".groupJumpLayout .groupsJumpCoverBorder,",
			".fbPhotosPhotoTagboxes,",
			"#fbPhotoPageTagBoxes",
			"	{display:none!important}",
			"#facebook ._4lqu,",
			"#facebook ._5744,",
			"#facebook ._4lqt,",
			"#facebook ._4ubd,",
			"#facebook ._i5q ._5rbl,",
			"#facebook ._i5q ._4lqt,",
			"#facebook #mainContainer ._5eg8,",
			"#facebook #mainContainer ._3uzl._47hr,",
			"#fbProfileCover ._1krc,",
			"#facebook #mainContainer ._jfi,",
			"#facebook div._3jk,",
			"#contentArea div.friendName,",
			"#contentArea div.friendName div.mas.name,",
			"#contentArea a._32jw,",
			"#m_newsfeed_stream a._5msj,",
			"#mJewelNav,",
			"#mJewelNav #requests_jewel,",
			"#mFinchContainer div._5j40 a._5j41,",
			"#m_group_stories_container a.touchable,",
			"#m_story_permalink_view a.touchable,",
			"#m_newsfeed_stream a.touchable,",
			"i.img.outline,",
			"div#viewport .jewelSet,",
			"div#viewport .jewel,",
			"div#viewport .mjewelNav,",
			"div#viewport ._5s61,",
			"div#viewport ._5msj,",
			"#mFinchContainer div,",
			"#u_jsonp_2_s div,",
			"#timeline-medley .bg_stat_elem,",
			"#timeline-medley .bg_stat_elem #u_g_b,",
			".fbTimelineProfilePicSelector,",
			".fbTimelineProfilePicSelector .uiToggle,",
			".fbPhotoTagger .typeaheadWrapper,",
			"#fbTimelineHeadline .actions,",
			"#fbTimelineHeadline .actions .actionsDropdown,",
			"#fbCoverImageContainer .coverBorder,",
			".touchoverflow,",
			".fbPhotoTagger .faceBoxHidden,",
			".fbPhotoTagger,",
			".touch .mSearchOverlay .mSearchTypeahead .jx-result .primary span.subtext,",
			".touch .mSearchOverlay .mSearchTypeahead .jx-result .primary span.name",
			"	{background-color:transparent!important}",
			".fb-like.fb_iframe_widget iframe",
			"	{max-height:20px!important}",
			"#facebook ._5e69,",
			"#viewport ._stb._stb",
			"	{position:relative!important}",
			".unclickable .unclickableMask",
			"	{opacity:0!important}",
			"#facebook ._5rbl,",
			"._4d3w.pagingActivated .snowliftPager.hilightPager",
			"	{opacity:0.3!important}",
			"",
			"",
			"/* XenForo */	",
			".discussionListItem .stats,",
			".discussionListItem .posterAvatar,",
			"#content .pageContent",
			"	{background-color:#000!important}",
			"",
			"/* Instagram */	",
			"._ovg3g,._njmhc,._c2kdw,._9qr5e,._5vmxb,._cxj4a,._j5wem,._1lp5e",
			"	{background-color:transparent!important}",
			"",
			"/* Youtube */	",
			".yt-high-contrast-mode-black .like-button-renderer-dislike-button:before,",
			".yt-high-contrast-mode-black .yt-uix-button-subscribed-branded:before{content:none!important}",
			"",
			".ytp-chrome-top, ",
			".ytp-title-text,",
			".ytp-chrome-top-buttons,",
			".ytp-big-mode .ytp-watch-later-button-visible.ytp-share-button-visible .ytp-title,",
			".ytp-big-mode .ytp-chrome-top.ytp-cards-available,",
			".ytp-gradient-top,",
			"#movie_player span,",
			".ytp-chrome-bottom,",
			".ytp-volume-panel,",
			".ytp-volume-slider,",
			".ytp-progress-bar-container,",
			".ytp-time-display,",
			".annotation.annotation-type-text .inner-text,",
			".html5-video-player svg,",
			".video-legacy-annotations .annotation,",
			".annotation-shape,",
			".ytp-button,",
			".ytp-left-controls,",
			".ytp-right-controls,",
			".ytp-chrome-controls,",
			".ytp-gradient-bottom,",
			"#video_yt_mousetrap",
			"	{background-color:transparent!important}",
			".annotation.annotation-type-text .inner-text",
			"	{color:#000!important}",
			"	",
			".ytp-progress-bar-padding,",
			".ytp-progress-bar,",
			"#video_yt_controls,",
			"#video_yt_popup",
			"	{opacity:0.5!important}"
        ].join("\n");

        t.applyNightMode = function() {
            t.webview.getWebContents().insertCSS(cssNightMode)
        }
        
        var cssScrollBar = [
		"::-webkit-scrollbar{",
		"    width:9px;",
		"    background-color:#f1f1f1;",
		"",
		"}",
		"",
		"body::-webkit-scrollbar{",
		"    width:10px!important;",
		"    background-color:#EEEEEE;",
		"}",
		"",
		"::-webkit-scrollbar-track{",
		"    border: 9px;",
		"}",
		"",
		"body::-webkit-scrollbar-track{",
		"    ",
		"    border: none;",
		"}",
		"",
		"::-webkit-scrollbar-thumb{",
		"    background-color:#424242!important;",
		"    border-radius:0px!important;",
		"    border: none;",
		"}",
		"::-webkit-scrollbar-thumb:hover{",
		"    background-color:#333!important;",
		"    ",
		"}",
		"::-webkit-scrollbar-thumb:active{",
		"    background-color:#616161!important;",
		"    ",
		"}"
        ].join("\n");
        
        t.applyScrollBar = function() {
            t.webview.getWebContents().insertCSS(cssScrollBar)
        }

        var cssMacRender = [
		"@namespace url(http://www.w3.org/1999/xhtml);",
		"body, input, .navigator-toolbox, .toolbarbutton-text, .sidebar-title{",
		"text-shadow: 0px 0px 1px #ACACAC;",
		"}"
	    ].join("\n");

        t.applyMacRender = function() {
            t.webview.getWebContents().insertCSS(cssMacRender)
        }

        globalShortcut.register('F12', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.inspectElement(0, 0)
        });
        globalShortcut.register('CmdOrCtrl+Shift+I', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.inspectElement(0, 0)
        });
        globalShortcut.register('F5', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.reload()
        });
        globalShortcut.register('CmdOrCtrl+R', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.reload()
        });
        globalShortcut.register('CmdOrCtrl+Shift+R', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.reloadIgnoringCache()
        });
        globalShortcut.register('Shift+F5', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.reloadIgnoringCache()
        });
        globalShortcut.register('Alt+Home', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.loadURL(settingmng.get("settings.homePage", "kt-browser://newtab"))
        });

        globalShortcut.register('CmdOrCtrl+P', () => {
            if(remote.getCurrentWindow().isFocused())
                t.webview.print({
                    silent: false,
                    printBackground: false
                })
        });
        $(window).resize(function() {
            t.fitToParent()
        })

        t.updateURLBarIcon = function() {
            settings.tab.instance.bar.rdBtn.show()
            settings.tab.instance.bar.searchInput.css("width", "calc(100% - 120px)")
            if(t.webview.getURL().startsWith("http://")) {
                settings.tab.instance.bar.searchIcon.html('http')
            }
            if(t.webview.getURL().startsWith("https://")) {
                settings.tab.instance.bar.searchIcon.html('https')
            }
            if(t.webview.getURL().startsWith("kt-browser://")) {
                settings.tab.instance.bar.searchIcon.html('public')
                settings.tab.instance.bar.rdBtn.hide()
                settings.tab.instance.bar.searchInput.css("width", "calc(100% - 88px)")
            }
            if(t.webview.getURL().startsWith("kt-browser://newtab")) {
                settings.tab.instance.bar.searchIcon.html('search')
            }
            if(t.webview.getURL().startsWith("file://")) {
                settings.tab.instance.bar.searchIcon.html('storage')
                settings.tab.instance.bar.rdBtn.hide()
                settings.tab.instance.bar.searchInput.css("width", "calc(100% - 88px)")
            }
            if(t.webview.getURL().includes(`reader/index.html?url=`)) {
                settings.tab.instance.bar.searchIcon.html('remove_red_eye')
                settings.tab.instance.bar.rdBtn.hide()
                settings.tab.instance.bar.searchInput.css("width", "calc(100% - 88px)")
            }
            if(t.webview.getURL().startsWith("data:text")) {
                settings.tab.instance.bar.searchIcon.html('description')
                settings.tab.instance.bar.rdBtn.hide()
                settings.tab.instance.bar.searchInput.css("width", "calc(100% - 88px)")
            }
            if(t.webview.getURL().startsWith("data:image")) {
                settings.tab.instance.bar.searchIcon.html('image')
                settings.tab.instance.bar.rdBtn.hide()
                settings.tab.instance.bar.searchInput.css("width", "calc(100% - 88px)")
            }
            if(t.isPrivacy) {
                settings.tab.instance.bar.searchIcon.html('vpn_lock')
            }
        }

        this.webview.addEventListener('ipc-message', function(e) {
            if(e.channel == 'clicked') {
                settings.tab.instance.bar.suggestions.css('display', 'none')
                settings.tab.instance.menu.hide()
            }
            if(e.channel == 'status') {
                if(typeof e.args[0] == 'undefined' || !e.args[0] || e.args[0].length === 0 || e.args[0] === "" || !/[^\s]/.test(e.args[0]) || /^\s*$/.test(e.args[0]) || e.args[0].replace(/\s/g, "") === "") {
                    settings.tab.instance.status.css("display", "none")
                } else {
                    if(e.args[0].length > 71) {
                        settings.tab.instance.status.html(e.args[0].substring(0, 70) + "...")
                    } else {
                        settings.tab.instance.status.html(e.args[0]);
                    }
                    settings.tab.instance.status.css("display", "inline")
                }
            }
        })

        //webview ready event
        $(t.webview).ready(function() {
            var ses = t.webview.getWebContents().session

            settings.tab.instance.bar.searchInput.focus()
            settings.tab.Favicon.css('opacity', "0")
            settings.tab.Preloader.css('opacity', "0")

            ses.allowNTLMCredentialsForDomains('*')

            if(fileToStart != null) {
                url = fileToStart;
                fileToStart = null;
            }

            if(settings.url != null || settings.url != "")
                t.webview.loadURL(settings.url)
        });
        //webview newwindow event
        t.webview.addEventListener('new-window', (e) => {
            const protocol = require('url').parse(e.url).protocol
            if(protocol === 'http:' || protocol === 'https:') {
                var tab = new Tab(),
                    instance = $('#instances').browser({
                        tab: tab,
                        url: e.url
                    })
                addTab(instance, tab);
            }
        });

        t.webview.addEventListener('did-frame-finish-load', function(isMainFrame) {
            settings.tab.Favicon.css('opacity', "1");
            settings.tab.Preloader.css('opacity', "0");

            if(lastUrl != t.webview.getURL()) {
                if(!t.isPrivacy) {
                    t.storage.saveHistory(t.webview.getTitle(), t.webview.getURL())
                }
                lastUrl = t.webview.getURL()
            }
            if(!t.webview.getURL().startsWith("kt-browser://newtab") && t.webview.getURL() != "about:blank" && !t.webview.getURL().includes(`reader/index.html?url=`)) {
                settings.tab.instance.bar.searchInput.val(t.webview.getURL());
            }

            if(t.webview.canGoBack()) {
                settings.tab.instance.bar.backBtn.enabled = true
            } else {
                settings.tab.instance.bar.backBtn.enabled = false
            }
            if(t.webview.canGoForward()) {
                settings.tab.instance.bar.forwardBtn.enabled = true
            } else {
                settings.tab.instance.bar.forwardBtn.enabled = false
            }

            t.updateURLBarIcon()

            if(isMainFrame) {
                t.applyScrollBar()
                if(settingmng.get("static.NightMode") && (t.webview.getURL().startsWith("http://") || t.webview.getURL().startsWith("https://") || t.webview.getURL().startsWith("ftp://")) ) {
                    t.applyNightMode()
                }
                    if(settingmng.get("settings.labanDic")) {
                        t.webview.executeJavaScript('var lbplugin_event_opt={"extension_enable":true,"dict_type":1,"dbclk_event":{"trigger":"none","enable":true,"display":1},"select_event":{"trigger":"ctrl","enable":true,"display":1}};function loadScript(t,e){var n=document.createElement("script");n.type="text/javascript",n.readyState?n.onreadystatechange=function(){("loaded"===n.readyState||"complete"===n.readyState)&&(n.onreadystatechange=null,e())}:n.onload=function(){e()},n.src=t,document.getElementsByTagName("head")[0].appendChild(n)}setTimeout(function(){null==document.getElementById("lbdictex_find_popup")&&loadScript("http://stc.laban.vn/dictionary/js/plugin/lbdictplugin.min.js?"+Date.now()%1e4,function(){lbDictPlugin.init(lbplugin_event_opt)})},1e3);', true)
                    }
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("banner300250-L"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("div-banner300250"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("banner-LR"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("aCenter padB2 banner-position"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
                t.webview.executeJavaScript('for(var list=document.getElementsByClassName("ad-div mastad"),i=list.length-1;i>=0;i--)list[i]&&list[i].parentElement&&list[i].parentElement.removeChild(list[i]);', true)
            }
            t.webview.executeJavaScript('try { function a() {return $(document.body).css("background-color")} a() } catch(err) {}', true, function(result) {
                if(result !== null) {
                    if((result.replace(/^.*,(.+)\)/, '$1') == 0)) {
                        t.webview.executeJavaScript('try {$(document.body).css("background-color", "#fff")} catch(err) {}', true)
                    }
                }
            })
            if(settingmng.get("settings.macRender")) {
                t.applyMacRender()
            }
        });
        t.webview.addEventListener('did-fail-load', function(e) {
            let errorCode = e.errorCode
            let errorDescription = e.errorDescription

            let dir = __dirname
            if(!errorCode == 0)
                settings.tab.instance.status.html(errorDescription + ": " + errorCode);
            settings.tab.instance.status.css("display", "inline")
        })

        t.webview.addEventListener('leave-html-full-screen', function() {
            t.fitToParent()
        });
        t.webview.addEventListener('enter-html-full-screen', function() {
            t.fitToParent()
        });

        t.webview.addEventListener('plugin-crashed', function(e) {
            remote.getCurrentWindow().webContents.executeJavaScript("$('.maindiv').msgBox({title:'" + "Plugin Error" + "',message:'" + "Plugin " + e.name + " is not responding." + "',buttons:[{text:'OK',callback:function(){$('p').fadeIn()}}],blend:!0});")
        });
        t.webview.addEventListener('did-start-loading', function() {
            settings.tab.instance.bar.suggestions.css('display', 'none');
            settings.tab.Favicon.css('opacity', "0");
            settings.tab.Preloader.css('opacity', "1");
            t.applyScrollBar()
        });
        t.webview.addEventListener('page-title-updated', function(title) {
            t.applyScrollBar()
            settings.tab.Title.html("<p style='display: inline; width:50%;'>" + "&nbsp;&nbsp;" + t.webview.getTitle() + "</p>");
            if(lastUrl != t.webview.getURL()) {
                t.storage.saveHistory(t.webview.getTitle(), t.webview.getURL())
                lastUrl = t.webview.getURL()
            }
            if(!t.webview.getURL().startsWith("kt-browser://newtab") && t.webview.getURL() != "about:blank" && !t.webview.getURL().includes(`reader/index.html?url=`)) {
                settings.tab.instance.bar.searchInput.val(t.webview.getURL());
            }
            else if (t.webview.getURL().startsWith("kt-browser://newtab"))
            {
                settings.tab.instance.bar.searchInput.val('');
            }
        });
        t.webview.addEventListener('load-commit', function(e) {
            t.applyScrollBar()
            if(e.url.length > 65 && !e.url.startsWith("about:")) {
                settings.tab.instance.status.html("Loading: " + e.url.substring(0, 64) + "...")
            } else {
                settings.tab.instance.status.html("Loading: " + e.url + "...")
            }
            settings.tab.instance.status.css("display", "inline")
            settings.tab.instance.bar.suggestions.css('display', 'none');
            if(settingmng.get("settings.blockUnsafeWeb")) {
                if(!e.url.startsWith("kt-browser://") && !e.url.startsWith("about:") && !e.url.startsWith("chrome://") && !e.url.startsWith("file://") && e.isMainFrame) {
                    request('http://api.openfpt.vn/cyradar?api_key=' + openfpt_api_key + '&url=' + e.url, function(error, response, body) {
                        if(JSON.parse(body).conclusion != "safe") {
                            t.webview.loadURL("")
                            //TODO: warning page
                        }
                    });
                }
            }
        });

        t.webview.addEventListener('page-favicon-updated', function(favicon) {
            settings.tab.Favicon.html("<div class='favicon' style='background-image: url(\"" + favicon.favicons[0] + "\");'></div>");
            settings.tab.Favicon.css('opacity', "1");
            settings.tab.Preloader.css('opacity', "0");
        });

        return this
    }
}(jQuery))