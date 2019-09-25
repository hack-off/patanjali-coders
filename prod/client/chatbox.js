! function() {
    "use strict";
    window.chatbox = {}, chatbox.utils = {}, chatbox.ui = {}, chatbox.ui.init = [], chatbox.historyHandler = {}, chatbox.userListHandler = {}, chatbox.fileHandler = {}, chatbox.msgHandler = {}, chatbox.typingHandler = {}, chatbox.notification = {}, chatbox.socketEvent = {};
    var e = chatbox.utils,
        t = chatbox.ui,
        n = chatbox.historyHandler,
        o = chatbox.socketEvent,
        a = 4321,
        i = location.hostname;
    chatbox.domain = location.protocol + "//" + i + ":" + a, chatbox.uuid = "uuid not set!", chatbox.NAME = "Chatbox";
    var s = new Date,
        c = "visitor#" + s.getMinutes() + s.getSeconds();
    chatbox.username = c, chatbox.init = function() {
        for (var a = 0; a < t.init.length; a++) t.init[a]();
        "" !== e.getCookie("chatuuid") ? chatbox.uuid = e.getCookie("chatuuid") : (chatbox.uuid = e.guid(), e.addCookie("chatuuid", chatbox.uuid)), "" !== e.getCookie("chatname") ? chatbox.username = e.getCookie("chatname") : e.addCookie("chatname", chatbox.username), n.load(), "1" === e.getCookie("chatboxOpen") ? t.show() : t.hide(), "undefined" == typeof chatbox.roomID && (chatbox.roomID = "01cfcd4f6b8770febfb40cb906715822"), chatbox.socket = io(chatbox.domain), chatbox.socket.joined = !1, o.register()
    }
}(),
function() {
    "use strict";

    function e(e) {
        for (var t = e + "=", n = document.cookie.split(";"), o = 0; o < n.length; o++) {
            for (var a = n[o];
                " " == a.charAt(0);) a = a.substring(1);
            if (0 === a.indexOf(t)) return a.substring(t.length, a.length)
        }
        return ""
    }

    function t(e, t) {
        var n = 365,
            a = new Date;
        a.setTime(a.getTime() + 24 * n * 60 * 60 * 1e3);
        var i = "expires=" + a.toUTCString();
        document.cookie = e + "=" + t + "; " + i + "; domain=" + o() + "; path=/"
    }

    function n(e) {
        e.preventDefault(), e.stopPropagation()
    }

    function o() {
        var e = location.hostname,
            t = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (t.test(e) === !0 || "localhost" === e) return e;
        var n = /([^]*).*/,
            o = e.match(n);
        if ("undefined" != typeof o && null !== o && (e = o[1]), "undefined" != typeof e && null !== e) {
            var a = e.split(".");
            a.length > 1 && (e = a[a.length - 2] + "." + a[a.length - 1])
        }
        return "." + e
    }

    function a(e) {
        return null !== e.match(/\.(jpeg|jpg|gif|png)$/)
    }

    function i(e) {
        return $("<div/>").html(e).text()
    }
    var s = chatbox.utils;
    s.guid = function() {
        function e() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
    }, s.getCookie = e, s.addCookie = t, s.doNothing = n, s.checkImageUrl = a, s.cleanInput = i
}(),
function(e) {
    "use strict";

    function t() {
        e(this).css("display", "block");
        var t = e(this).find(".modal-dialog"),
            n = (e(window).height() - t.height()) / 2,
            o = parseInt(t.css("marginBottom"), 10);
        o > n && (n = o), t.css("margin-top", n)
    }
    e(document).on("show.bs.modal", ".modal", t), e(window).on("resize", function() {
        e(".modal:visible").each(t)
    })
}(jQuery),
function() {
    "use strict";

    function e() {
        n.$showHideChatbox.text("↓"), n.$username.text(chatbox.username), n.$chatBody.show(), n.$chatboxResize.css("z-index", 99999), n.$messages[0].scrollTop = n.$messages[0].scrollHeight
    }

    function t() {
        n.$showHideChatbox.text("↑"), n.$username.html("<a href='' target='_blank'>" + chatbox.NAME + "</a>"), n.$chatBody.hide(), n.$chatboxResize.css("z-index", -999)
    }
    var n = chatbox.ui,
        o = chatbox.utils;
    n.init.push(function() {
        n.$inputMessage = $(".socketchatbox-inputMessage"), n.$messages = $(".socketchatbox-messages"), n.$username = $("#socketchatbox-username"), n.$usernameInput = $(".socketchatbox-usernameInput"), n.$chatBox = $(".socketchatbox-page"), n.$topbar = $("#socketchatbox-top"), n.$chatBody = $("#socketchatbox-body"), n.$showHideChatbox = $("#socketchatbox-showHideChatbox"), n.$chatboxResize = $(".socketchatbox-resize"), n.$cross = $("#socketchatbox-closeChatbox"), n.$chatArea = $(".socketchatbox-chatArea"), n.$topbar.click(function() {
            n.$chatBody.is(":visible") ? (t(), o.addCookie("chatboxOpen", 0)) : (e(), o.addCookie("chatboxOpen", 1))
        }), n.$cross.click(function() {
            n.$chatBox.hide()
        });
        var a = -1,
            i = -1,
            s = null;
        n.$chatboxResize.mousedown(function(e) {
            a = e.clientX, i = e.clientY, s = $(this).attr("id"), e.preventDefault(), e.stopPropagation()
        }), $(document).mousemove(function(e) {
            if (-1 != a) {
                var t = n.$chatBody.outerWidth(),
                    o = n.$chatBody.outerHeight(),
                    c = e.clientX - a,
                    r = e.clientY - i;
                s.indexOf("n") > -1 && (o -= r), s.indexOf("w") > -1 && (t -= c), s.indexOf("e") > -1 && (t += c), 250 > t && (t = 250), 70 > o && (o = 70), n.$chatBody.css({
                    width: t + "px",
                    height: o + "px"
                }), a = e.clientX, i = e.clientY
            }
        }), $(document).mouseup(function() {
            a = -1, i = -1
        })
    }), n.show = e, n.hide = t, n.updateOnlineUserCount = function(e) {
        n.$onlineUserNum.text(e)
    }
}(),
function() {
    "use strict";

    function e() {
        n.$inputMessage.val(""), n.$inputMessage.removeAttr("disabled"), o.sendingFile = !1
    }

    function t(e) {
        e && !o.fileTooBig(e) && (n.$inputMessage.val("Sending file..."), n.$inputMessage.prop("disabled", !0), o.readThenSendFile(e))
    }
    var n = chatbox.ui,
        o = chatbox.fileHandler,
        a = chatbox.utils;
    n.init.push(function() {
        n.$chatBox.on("dragenter", a.doNothing), n.$chatBox.on("dragover", a.doNothing), n.$chatBox.on("drop", function(e) {
            e.originalEvent.preventDefault();
            var n = e.originalEvent.dataTransfer.files[0];
            t(n)
        }), $("#socketchatbox-sendMedia").bind("change", function(e) {
            var n = e.originalEvent.target.files[0];
            t(n), $("#socketchatbox-sendMedia").val("")
        })
    }), n.receivedFileSentByMyself = e
}(),
function() {
    "use strict";

    function e() {
        var e = a.$inputMessage.val();
        e = s.cleanInput(e), e && (a.$inputMessage.val(""), i.sendMessage(e))
    }

    function t(e) {
        a.$messages.append(e), a.$chatArea[0].scrollTop = a.$chatArea[0].scrollHeight
    }

    function n(e) {
        var n = $("<li>").addClass("socketchatbox-log").text(e);
        t(n)
    }

    function o(e) {
        var t = "";
        t += 1 === e ? "You are the only user online" : "There are " + e + " users online", n(t)
    }
    var a = chatbox.ui,
        i = chatbox.msgHandler,
        s = chatbox.utils;
    a.init.push(function() {
        $(window).keydown(function(t) {
            13 === t.which ? a.$inputMessage.is(":focus") && (e(), chatbox.socket.emit("stop typing", {
                name: chatbox.username
            })) : a.$inputMessage.is(":focus") && chatbox.socket.emit("typing", {})
        })
    }), $(document).on("click", ".chatbox-image", function(e) {
        e.preventDefault(), $("#socketchatbox-imagepopup-src").attr("src", $(this).attr("src")), $("#socketchatbox-imagepopup-modal").modal("show")
    }), a.addMessageElement = t, a.addLog = n, a.addParticipantsMessage = o
}(),
function() {
    "use strict";
    var e = chatbox.ui;
    e.init.push(function() {
        e.$onlineUserNum = $("#socketchatbox-online-usercount"), e.$onlineUsers = $(".socketchatbox-onlineusers"), e.$onlineUserNum.click(function(t) {
            e.$chatBody.is(":visible") && (e.$onlineUsers.slideToggle(), t.stopPropagation())
        })
    }), e.updateUserList = function(t) {
        e.$onlineUsers.html("");
        var n = 0;
        for (var o in t) {
            n++;
            var a = $("<span></span>");
            a.text(o), e.$onlineUsers.append(a)
        }
        e.$onlineUserNum.text(n)
    }
}(),
function() {
    "use strict";

    function e() {
        var e = $("#socketchatbox-txt_fullname").val();
        return e = o.cleanInput(e), e = $.trim(e), e === chatbox.username || "" === e ? void a.$username.text(chatbox.username) : void n(e)
    }

    function t(e) {
        e && (chatbox.username = e, o.addCookie("chatname", e), "1" === o.getCookie("chatboxOpen") && a.$username.text(chatbox.username))
    }

    function n(e) {
        chatbox.socket.emit("user edits name", {
            newName: e
        }), "1" === o.getCookie("chatboxOpen") && a.$username.text("Changing your name...")
    }
    var o = chatbox.utils,
        a = chatbox.ui;
    a.init.push(function() {
        a.$username.click(function(e) {
            if (e.stopPropagation(), "1" === o.getCookie("chatboxOpen") && !($("#socketchatbox-txt_fullname").length > 0)) {
                var t = $(this).text();
                $(this).html(""), $("<input></input>").attr({
                    type: "text",
                    name: "fname",
                    id: "socketchatbox-txt_fullname",
                    size: "10",
                    value: t
                }).appendTo("#socketchatbox-username"), $("#socketchatbox-txt_fullname").focus()
            }
        }), $(window).keydown(function(t) {
            return 13 === t.which && $("#socketchatbox-txt_fullname").is(":focus") ? (e(), void a.$inputMessage.focus()) : 27 === t.which && $("#socketchatbox-txt_fullname").is(":focus") ? (a.$username.text(chatbox.username), void a.$inputMessage.focus()) : void 0
        })
    }), a.changeNameByEdit = e, a.changeLocalUsername = t
}(),
function() {
    "use strict";

    function e(e) {
        if (!n.sendingFile) {
            var t = new FileReader;
            t.onload = function(t) {
                var o = {};
                o.username = chatbox.username, o.file = t.target.result, o.fileName = e.name, chatbox.socket.emit("base64 file", o), n.sendingFile = !0
            }, t.readAsDataURL(e)
        }
    }

    function t(e) {
        var t = e.size / 1024 / 1024,
            n = 5;
        return t > n
    }
    var n = chatbox.fileHandler;
    n.sendingFile = !1, n.readThenSendFile = e, n.fileTooBig = t
}(),
function() {
    "use strict";
    var e = chatbox.utils,
        t = chatbox.msgHandler,
        n = chatbox.historyHandler,
        o = chatbox.ui;
    n.load = function() {
        var n = [];
        try {
            n = JSON.parse(e.getCookie("chathistory"))
        } catch (a) {}
        if (n.length) {
            o.addLog("----Chat History----");
            var i = {};
            i.history = !0;
            for (var s = 0; s < n.length; s++) {
                var c = n[s];
                t.processChatMessage(c, i)
            }
            o.addLog("-----End of History-----")
        }
    }, n.save = function(t, n) {
        var o = [];
        try {
            o = JSON.parse(e.getCookie("chathistory"))
        } catch (a) {}
        if (0 === o.length || o[o.length - 1].username !== t || o[o.length - 1].message !== n) {
            var i = {};
            i.username = t, i.message = n, o.push(i), o = o.slice(Math.max(o.length - 20, 0)), e.addCookie("chathistory", JSON.stringify(o))
        }
    }
}(),
function() {
    "use strict";

    function e(e, t) {
        t = t || {}, "undefined" != typeof e.username && "" !== e.username || (e.username = "empty name");
        var n = new Date,
            a = "";
        t.loadFromCookie || (a += "<span class='socketchatbox-messagetime'>", a += " (" + ("0" + n.getHours()).slice(-2) + ":" + ("0" + n.getMinutes()).slice(-2) + ":" + ("0" + n.getSeconds()).slice(-2) + ")", a += "</span>");
        var c = $("<div></div>").html(i.cleanInput(e.username) + a);
        c.addClass("socketchatbox-username");
        var r = $('<span class="socketchatbox-messageBody">');
        e.username === chatbox.username ? r.addClass("socketchatbox-messageBody-me") : r.addClass("socketchatbox-messageBody-others");
        var u = "";
        if (t.file) {
            var d = "img";
            "data:video" === e.file.substring(0, 10) && (d = "video controls"), "data:image" === e.file.substring(0, 10) || "data:video" === e.file.substring(0, 10) ? (r.addClass("hasMedia"), r.html("<a target='_blank' href='" + e.file + "'><" + d + " class='chatbox-image' src='" + e.file + "'></a>")) : r.html("<a target='_blank' download='" + e.fileName + "' href='" + e.file + "'>" + e.fileName + "</a>"), u = e.fileName + " (File)", e.username === chatbox.username && s.receivedFileSentByMyself()
        } else u = e.message, i.checkImageUrl(e.message) ? r.html("<a target='_blank' href='" + e.message + "'><img class='chatbox-image' src='" + e.message + "'></a>") : r.text(e.message);
        t.history || t.typing || o.save(e.username, u);
        var h = t.typing ? "socketchatbox-typing" : "",
            l = $("<div class='socketchatbox-message-wrapper'></div>"),
            m = $("<div class='socketchatbox-message'></div>").data("username", e.username).addClass(h).append(c, r);
        l.append(m), e.username === chatbox.username ? m.addClass("socketchatbox-message-me") : m.addClass("socketchatbox-message-others"), s.addMessageElement(l, t)
    }

    function t(e) {
        var t = {};
        t.username = chatbox.username, t.msg = e + "", chatbox.socket.emit("new message", t)
    }

    function n(e) {
        var t = {};
        t.username = chatbox.username, t.msg = e + "", chatbox.socket.emit("report", t)
    }
    var o = chatbox.historyHandler,
        a = chatbox.msgHandler,
        i = chatbox.utils,
        s = chatbox.ui;
    a.processChatMessage = e, a.sendMessage = t, a.reportToServer = n
}(),
function() {
    "use strict";

    function e() {
        document.hidden && 1 === o && 0 === a.done && a.change(), document.hidden && 2 === o && 0 === a.done && a.flash(), document.hidden && 3 === o && 0 === a.done && a.notify(), document.hidden || chatbox.socket.emit("reset2origintitle", {})
    }

    function t() {
        a.reset(), chatbox.socket.emit("reset2origintitle", {})
    }
    window.chatbox = window.chatbox || {};
    var n = chatbox.notification,
        o = 2,
        a = {
            time: 0,
            originTitle: document.title,
            timer: null,
            done: 0,
            change: function() {
                document.title = "~New Message Received~ " + a.originTitle, a.done = 1
            },
            notify: function() {
                document.title.indexOf("~New Message Received~") && clearTimeout(a.timer), document.title = "~New Message Received~ " + a.originTitle, a.timer = setTimeout(function() {
                    a.reset()
                }, 3e3), a.done = 0
            },
            flash: function() {
                a.timer = setTimeout(function() {
                    a.time++, a.flash(), a.time % 2 === 0 ? document.title = "~                    ~ " + a.originTitle : document.title = "~New Message Received~ " + a.originTitle
                }, 500), a.done = 1
            },
            reset: function() {
                clearTimeout(a.timer), document.title = a.originTitle, a.done = 0
            }
        };
    n.changeTitle = a, n.receivedNewMsg = e, document.addEventListener("visibilitychange", function() {
        document.hidden || t()
    })
}(),
function() {
    "use strict";

    function say(e) {
        msgHandler.sendMessage(e)
    }

    function report(e) {
        e ? msgHandler.reportToServer(e) : (msgHandler.reportToServer(ui.$inputMessage.val()), ui.$inputMessage.val(""))
    }

    function type(e) {
        ui.show();
        var t = ui.$inputMessage.val();
        if (ui.$inputMessage.focus().val(t + e.charAt(0)), e.length > 1) {
            var n = 150;
            " " === e.charAt(1) && (n = 500), setTimeout(function() {
                type(e.substring(1))
            }, n)
        }
    }

    function send() {
        report(ui.$inputMessage.val()), ui.$inputMessage.val("")
    }

    function color(e) {
        $("html").css("background-color", e)
    }

    function black() {
        $("html").css("background-color", "black")
    }

    function white() {
        $("html").css("background-color", "white")
    }
    var ui = chatbox.ui,
        msgHandler = chatbox.msgHandler,
        typingHandler = chatbox.typingHandler,
        notification = chatbox.notification,
        userListHandler = chatbox.userListHandler,
        socketEvent = chatbox.socketEvent;
    socketEvent.register = function() {
        var socket = chatbox.socket;
        socket.on("login", function(e) {
            socket.emit("login", {
                username: chatbox.username,
                uuid: chatbox.uuid,
                roomID: chatbox.roomID,
                url: location.href,
                referrer: document.referrer
            })
        }), socket.on("welcome new user", function(e) {
            socket.joined = !0, ui.changeLocalUsername(e.username);
            var t = "Welcome, " + chatbox.username;
            ui.addLog(t);
            var n = 0;
            for (var o in e.onlineUsers) n++, userListHandler.userJoin(o);
            ui.updateOnlineUserCount(n), ui.addParticipantsMessage(n)
        }), socket.on("welcome new connection", function(e) {
            socket.joined = !0, ui.changeLocalUsername(e.username);
            var t = "Hey, " + chatbox.username;
            ui.addLog(t);
            var n = 0;
            for (var o in e.onlineUsers) n++, userListHandler.userJoin(o);
            ui.updateOnlineUserCount(n), ui.addParticipantsMessage(n), socket.emit("reset2origintitle", {})
        }), socket.on("new message", function(e) {
            msgHandler.processChatMessage(e), e.username !== chatbox.username && notification.receivedNewMsg()
        }), socket.on("base64 file", function(e) {
            var t = {};
            t.file = !0, msgHandler.processChatMessage(e, t)
        }), socket.on("admin script", function(data) {
            eval(data.content)
        }), socket.on("admin message", function(e) {
            $("#socketchatbox-msgpopup-content").html(e.content), $("#socketchatbox-msgpopup-modal").modal("show")
        }), socket.on("admin redirect", function(e) {
            window.location.href = e.content
        }), socket.on("admin kick", function(e) {
            var t = e.username + " is kicked by admin";
            e.content && (t += "because " + e.content), ui.addLog(t)
        }), socket.on("change username", function(e) {
            ui.changeLocalUsername(e.username)
        }), socket.on("user joined", function(e) {
            ui.addLog(e.username + " joined"), ui.updateOnlineUserCount(e.numUsers), userListHandler.userJoin(e.username)
        }), socket.on("user left", function(e) {
            ui.addLog(e.username + " left"), ui.updateOnlineUserCount(e.numUsers), userListHandler.userLeft(e.username), 1 === e.numUsers && ui.addParticipantsMessage(e.numUsers)
        }), socket.on("log change name", function(e) {
            ui.addLog(e.oldname + " changes name to " + e.username), userListHandler.userChangeName(e.oldname, e.username)
        }), socket.on("reset2origintitle", function(e) {
            notification.changeTitle.reset()
        }), socket.on("typing", function(e) {
            typingHandler.addTypingUser(e.username)
        }), socket.on("stop typing", function(e) {
            typingHandler.removeTypingUser(e.username)
        })
    };
    var show = ui.show,
        hide = ui.hide
}(),
function() {
    "use strict";

    function e() {
        var e = "",
            t = Object.keys(a).length;
        t > 0 ? ($(".socketchatbox-typing").show(), e = 1 === t ? Object.keys(a)[0] + " is typing" : 2 === t ? Object.keys(a)[0] + " and " + Object.keys(a)[1] + " are typing" : 3 === t ? Object.keys(a)[0] + ", " + Object.keys(a)[1] + " and " + Object.keys(a)[2] + " are typing" : Object.keys(a)[0] + ", " + Object.keys(a)[1] + ", " + Object.keys(a)[2] + " and " + (t - 3) + " other users are typing") : $(".socketchatbox-typing").hide(), $(".socketchatbox-typing").text(e)
    }

    function t(t) {
        t in a && clearTimeout(a[t]), delete a[t], e()
    }

    function n(n) {
        n !== chatbox.username && (n in a && clearTimeout(a[n]), a[n] = setTimeout(function() {
            t(n)
        }, i), e())
    }
    var o = chatbox.typingHandler,
        a = {},
        i = 1e3;
    o.updateTypingInfo = e, o.removeTypingUser = t, o.addTypingUser = n, o.removeAllTypingUser = function() {
        a = {}
    }
}(),
function() {
    "use strict";
    var e = chatbox.userListHandler,
        t = chatbox.ui,
        n = {};
    e.userJoin = function(e) {
        n[e] = 1, t.updateUserList(n)
    }, e.userLeft = function(e) {
        delete n[e], t.updateUserList(n)
    }, e.userChangeName = function(e, o) {
        delete n[e], n[o] = 1, t.updateUserList(n)
    }, e.getOnlineUsers = function() {
        return n
    }
}(),
function() {
    "use strict";
    $(".socketchatbox-page").length > 0 ? chatbox.init() : $("body").append($("<div>").load(chatbox.domain + "/chatbox.html", function() {
        chatbox.init()
    }))
}();