// ==UserScript==
// @name          Block Bad Guys on Bangumi.tv (Alpha)
// @description   You can (not) see me (bgm38).
// @copyright     gyakkun
// @license       MIT
// @version       0.1.1
// @include       http://bangumi.tv/*
// @include       http://bgm.tv/*
// @include       https://bgm.tv/*
// @include       http://chii.in/*
// @updateURL     https://openuserjs.org/meta/gyakkun/Block_Bad_Guys_on_Bangumi.tv_(Alpha).meta.js
// @grant none
// ==/UserScript==

(function() {
    //'use strict';

    var url = window.location.pathname;
    var BLOCK_USERNAME_LIST = [];
    var BLOCK_UID_LIST = [];

    try {
        if (!!localStorage["blockUsernameList"]) {
            BLOCK_USERNAME_LIST = JSON.parse(localStorage["blockUsernameList"]);
        } else {
            localStorage["blockUsernameList"] = [];
        }
        if (!!localStorage["blockUidList"]) {
            BLOCK_UID_LIST = JSON.parse(localStorage["blockUidList"]);
        } else {
            localStorage["blockUidList"] = [];
        }
    } catch (err) {
        console.error(err);
    }

    //URLs
    var INDEX_URL = /^\/$/;
    var TIMELINE_URL = /\/timeline/;
    var THREAD_URL = /\/(ep|blog|subject|group)/;
    var CATEGORY_URL = /\/(anime|book|music|real)/;
    var SETTINGS_URL = /^\/settings$/;
    var GROUP_INDEX_URL = /^\/group$/;

    //Selectors
    var INDEX_TIMELINE_AVATAR_SELECTOR = "#timeline > ul > li > span > a > span";
    var INDEX_THREAD_AVATAR_SELECTOR = "div > ul > li > a > img";
    var INDEX_TIMELINE_USERNAME_SELECTOR = "#timeline > ul > li > span > a";
    var THREAD_AVATAR_SELECTOR = "div[id^='post_'] > a.avatar ";
    var SUBJECT_BLOG_USERNAME_SELECTOR = "#entry_list > div > div > div.time > span > a";
    var SUBJECT_THREAD_USERNAME_SELECTOR = "#columnSubjectHomeB > div > table > tbody > tr > td > a";
    var SUBJECT_COLLECT_USERNAME_SELECTOR = "#subjectPanelCollect > ul > li > div > a";
    var SUBJECT_INDEX_USERNAME_SELECTOR = "#subjectPanelIndex > ul > li > a";
    var SUBJECT_INDEX_DETAIL_PAGE_USERNAME_SELECTOR = "#timeline > ul > li > span.info.clearit > span > a";
    var SUBJECT_RATING_USERNAME_SELECTOR = "#memberUserList > li > div > strong > a";
    var SUBJECT_COMMENT_DETAIL_PAGE_USERNAME_SELECTOR = "#comment_box > div > a";
    var CATEGORY_DOING_USERNAME_SELECTOR = "#columnA > div.section > div > ul.coversSmall > li > p > a";
    var CATEGORY_BLOG_USERNAME_SELECTOR = "#news_list > div > div > div.time > small.blue > a";
    var CATEGORY_THREAD_USERNAME_SELECTOR = "#columnA > div > table > tbody > tr > td > a";
    var GROUP_INDEX_USERNAME_SELECTOR = "#columnA > table > tbody > tr > td > small.sub_title > a";

    //Regexes
    var USERNAME_REG = /user\/(.+)/;
    var AVATAR_UID_REG = /pic\/user\/.+\/\d+\/\d+\/\d+\/(\d+)\.jpg/;

    var GetFuntionSelfName = function() {
        return arguments.callee.name;
    };

    var GetFinalCallerName = function(functionSelf) {
        var finalCaller = functionSelf.caller.name;
        while (finalCaller == "" || finalCaller == "each") {
            functionSelf = functionSelf.caller.arguments.callee;
            finalCaller = functionSelf.caller.name;
        }
        return finalCaller;
    };

    var RemoveByUsername = function(obj, selectorToRemove) {
        try {
            var username = obj.attr("href").match(USERNAME_REG)[1];
            if ($.inArray(username, BLOCK_USERNAME_LIST) >= 0) {
                obj.closest(selectorToRemove).hide();
                console.warn(username + " was removed by username, " +
                    "called by function " + RemoveByUsername.caller.name + ".");
                return true;
            }
        } catch (err) {}
        return false;
    };

    var RemoveByUid = function(obj, selectorToRemove, targetAttr) {
        try {
            var userIdNotNumber = obj.attr(targetAttr).match(AVATAR_UID_REG)[1];
            var userId = Number(userIdNotNumber);
            if ($.inArray(userId, BLOCK_UID_LIST) >= 0) {
                obj.closest(selectorToRemove).hide();
                console.warn(userId + " was removed by uid, " +
                    "called by function " + RemoveByUid.caller.name + ".");
                return true;
            }
        } catch (err) {}
        return false;
    };

    var OddEvenClassInnerHandler = function(obj, selector, oddClass, evenClass) {
        console.warn("Odd/even class inner handled from function " + GetFinalCallerName(OddEvenClassInnerHandler) + ".");
        obj.find(selector).each(function() {
            if ($(this).hasClass(oddClass)) {
                $(this).removeClass(oddClass);
                $(this).addClass(evenClass);
            } else {
                $(this).removeClass(evenClass);
                $(this).addClass(oddClass);
            }
        });

    };

    var OddOrEvenClassOuterHandler = function(obj, selector, OddOrEvenClass) {
        //This function only add/remove one class which is odd/even related.
        console.warn("Odd/even class outer handled from function " + GetFinalCallerName(OddOrEvenClassOuterHandler) + ".");
        obj.closest(selector).nextAll().each(function() {
            if ($(this).hasClass(OddOrEvenClass)) {
                $(this).removeClass(OddOrEvenClass);
            } else {
                $(this).addClass(OddOrEvenClass);
            }
        });
    };

    var RemoveUidIndexTimeline = function() {
        var that = $(this);
        RemoveByUid(that, "li.clearit", "style");
    };

    var RemoveUidIndexThread = function() {
        var that = $(this);
        RemoveByUid(that, "li.clearit", "src");
    };

    var RemoveUsernameIndexTimeline = function() {
        var that = $(this);
        RemoveByUsername(that, "li.clearit");
    };

    var RemoveCommentFromThread = function() {
        var that = $(this);
        RemoveByUsername(that, "div[id^='post_']");
    };

    var RemoveBlogFromSubject = function() {
        var that = $(this);
        RemoveByUsername(that, "div.clearit");
    };

    var RemoveThreadFromSubject = function() {
        var that = $(this);
        RemoveByUsername(that, "tr");
    };

    var RemoveDoingFromSubject = function() {
        var that = $(this);
        RemoveByUsername(that, "li.clearit");
    };

    var RemoveIndexFromSubject = function() {
        var that = $(this);
        RemoveByUsername(that, "li.clearit");
    };

    var RemoveIndexFromSubjectIndexDetailPage = function() {
        var that = $(this);
        RemoveByUsername(that, "li.clearit");
    };

    var RemoveBlogFromCategory = function() {
        var that = $(this);
        var isSuccess = RemoveByUsername(that, "div.item");
        if (isSuccess) {
            OddOrEvenClassOuterHandler(that, "div.item", "odd");
        }
    };


    var RemoveRatingFromSubject = function() {
        var that = $(this);
        var isSuccess = RemoveByUsername(that, "li.user");
        if (isSuccess) {
            OddOrEvenClassOuterHandler(that, "li.user", "odd");
        }
    };

    var RemoveCommetFromSubjectCommentDetailPage = function() {
        var that = $(this);
        var isSuccess = RemoveByUsername(that, "div.clearit");
        if (isSuccess) {
            that.closest("div.clearit").nextAll().each(function() {
                OddEvenClassInnerHandler($(this), "> div[class^='text_main']", "text_main_odd", "text_main_even");
                OddEvenClassInnerHandler($(this), "> a > span.avatarNeue", "ll", "rr");
            });
        }
    };

    var RemoveDoingFromCategory = function() {
        var that = $(this);
        RemoveByUsername(that, "li.clearit");
    };

    var RemoveThreadFromCategory = function() {
        var that = $(this);
        var isSuccess = RemoveByUsername(that, "tr");
        if (isSuccess) {
            that.closest("tr").nextAll().each(function() {
                OddEvenClassInnerHandler($(this), ">td", "odd", "even");
            });
        }
    };

    var RemoveThreadFromGroupIndex = function() {
        var that = $(this);
        var isSuccess = RemoveByUsername(that, "tr");
        if (isSuccess) {
            that.closest("tr").nextAll().each(function() {
                OddEvenClassInnerHandler($(this), "> td", "odd", "even");
            });
        }
    };


    if (url.match(TIMELINE_URL) !== null || url.match(INDEX_URL) !== null) {
        $(INDEX_TIMELINE_AVATAR_SELECTOR).each(RemoveUidIndexTimeline);
        $(INDEX_TIMELINE_USERNAME_SELECTOR).each(RemoveUsernameIndexTimeline);
        $(INDEX_THREAD_AVATAR_SELECTOR).each(RemoveUidIndexThread);
    }

    if (url.match(GROUP_INDEX_URL) !== null) {
        $(GROUP_INDEX_USERNAME_SELECTOR).each(RemoveThreadFromGroupIndex);
    }

    if (url.match(THREAD_URL) !== null) {
        $(THREAD_AVATAR_SELECTOR).each(RemoveCommentFromThread);
        $(SUBJECT_BLOG_USERNAME_SELECTOR).each(RemoveBlogFromSubject);
        $(SUBJECT_THREAD_USERNAME_SELECTOR).each(RemoveThreadFromSubject);
        $(SUBJECT_COLLECT_USERNAME_SELECTOR).each(RemoveDoingFromSubject);
        $(SUBJECT_INDEX_USERNAME_SELECTOR).each(RemoveIndexFromSubject);
        $(SUBJECT_INDEX_DETAIL_PAGE_USERNAME_SELECTOR).each(RemoveIndexFromSubjectIndexDetailPage);
        $(SUBJECT_RATING_USERNAME_SELECTOR).each(RemoveRatingFromSubject);
        $(SUBJECT_COMMENT_DETAIL_PAGE_USERNAME_SELECTOR).each(RemoveCommetFromSubjectCommentDetailPage);
    }

    if (url.match(CATEGORY_URL) !== null) {
        $(CATEGORY_DOING_USERNAME_SELECTOR).each(RemoveDoingFromCategory);
        $(CATEGORY_BLOG_USERNAME_SELECTOR).each(RemoveBlogFromCategory);
        $(CATEGORY_THREAD_USERNAME_SELECTOR).each(RemoveThreadFromCategory);

    }

    if (url.match(SETTINGS_URL) !== null) {
        /*jshint multistr: true */
        $("#columnA > form > span > table > tbody > tr:nth-last-child(2)").after('\
            <tr>\
                <td valign="top" width="12%">\
                    <h2 class="subtitle">屏蔽列表</h2>\
                </td>\
            <td valign="top"></td>\
            </tr>\
            <tr style="display: none;">\
                <td valign="top" width="12%">Block UID List</td>\
                <td valign="top">\
                    <input id="buidl" name="Block UID List" class="inputtext" type="text" value="" style="width:380px;">\
                </td>\
            </tr>\
            <tr>\
                <td valign="top" width="12%">Block Username List</td>\
                <td valign="top">\
                    <input id="busrnl" name="Block UID List" class="inputtext" type="text" value="" style="width:380px;">\
                </td>\
            </tr>\
            <tr>\
                <td valign="top" width="12%">注意</td>\
                <td valign="top">请填入需要屏蔽用户的用户名(username), 以英语逗号分隔, 如: laoism, acgism</br></br>\
                    用户名可以根据用户详情页url得到, 如 https://bgm.tv/user/Example</br>\
                    则该用户的的用户名为Example。</br>\
                    用户名也可在用户详情页头像旁的@xxxx处得到, xxxx即为用户名。</br></br>\
                    如需屏蔽首页右侧指定用户小组动态, 请继续填入该用户的UID</br></br>\
                    UID可从用户头像得到, 如 https://lain.bgm.tv/pic/user/l/000/01/43/14382.jpg?r=1497204837</br>\
                    则该用户UID为14382</br></br>\
                    最终填入项可能是数字与username的混合, 如: laoism, acgism, 14382</td>\
            </tr>\
        ');
        $("#buidl").attr("value", BLOCK_UID_LIST);
        $("#busrnl").attr("value", BLOCK_USERNAME_LIST);
        $("input[type='submit']").click(function() {
            BLOCK_USERNAME_LIST = $("#busrnl").attr("value").replace(/\s+/g, "").split(",");
            BLOCK_UID_LIST = [];
            BLOCK_USERNAME_LIST.forEach(function(item, index, input) {
                if (!isNaN(parseInt(item))) {
                    BLOCK_UID_LIST.push(parseInt(item));
                }
            });
            //JS你是个⑨吗!!!
            localStorage["blockUsernameList"] = '["' + BLOCK_USERNAME_LIST.join('","') + '"]';
            localStorage["blockUidList"] = '[' + BLOCK_UID_LIST + ']';
            //console.log(localStorage["blockUsernameList"], localStorage["blockUidList"]);
            console.log("Block UID List Updated: " + localStorage["blockUidList"]);
            console.log("Block Username List Updated: " + localStorage["blockUsernameList"]);
        });
    }

    //TODO: Intercept XHR to timeline page.
})();