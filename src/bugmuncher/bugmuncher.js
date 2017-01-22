"use strict";

window.bugmuncher = new function() {
    function e() {
        if (g = document.getElementsByTagName("body")[0]) {
            var t = document.createElement("link"),
                n = new Date;
            //t.setAttribute("href", f.cdn_domain + "/button.css?" + n.getFullYear() + (n.getMonth() + 1) + n.getDate() + n.getHours()), t.setAttribute("rel", "stylesheet");
            t.setAttribute("href", "/bugmuncher/bugmuncher_style.css"), t.setAttribute("rel", "stylesheet");
            var o = document.getElementsByTagName("head")[0];
            o.appendChild(t), w.receive("ready", i), w.receive("complete", a), w.receive("canceled", l), w.receive("close", c), h.set_options(window.bugmuncher_options)
        } else setTimeout(e, 1e3)
    }

    function t() {
        d && b.remove_elements(d), d = document.createElement("a"), d.setAttribute("id", "bugmuncher_button"), d.href = "#", d.className = "bm_" + x.style, d.className += " bm_" + x.position, d.className += " bm_" + x.theme, g.appendChild(d), 8 == k && "modern" == x.theme && "label" == x.style && "right" == x.position && setTimeout(function() {
            var e = d.offsetWidth,
                t = d.offsetHeight;
            d.style.width = t, d.style.height = e
        }, 500), k && (d.className += " bm_ie_" + k);
        var e = A[x.language] || A.en;
        if ("modern" == x.theme) {
            var t = document.createElement("span");
            t.innerHTML = x.label_text || e.label_text, d.appendChild(t), m = t, d.style.background = x.background_color, m.style.color = x.text_color, t.borderColor = x.text_color
        } else d.innerHTML = x.label_text || A[x.language].label_text, m = d;
        d.onclick = r
    }

    function n() {
        h.debug && console && console.log && console.log(arguments)
    }

    function o() {
        for (var e = document.getElementsByTagName("*"), t = 0, n = e.length; t < n; t++) {
            var o = e[t];
            "body" != o.tagName.toLowerCase() && (b.save_field_value(o), b.save_scroll_position(o))
        }
        for (var r = document.getElementsByTagName("canvas"), t = 0, n = r.length; t < n; t++) b.canvas_to_png(r[t]);
        T = b.pause_css_animations();
        var i = document.documentElement.cloneNode(!0);
        b.remove_elements(i.getElementsByTagName("script"));
        var a = b.get_element_by_id_in(i, "bugmuncher_button", "a");
        b.remove_elements(a), a = null;
        var l = b.get_element_by_id_in(i, "bugmuncher_widget_iframe", "iframe");
        b.remove_elements(l), l = null;
        for (var c = b.get_elements_by_tag_names(["input", "textarea", "button"], i), u = 0, n = c.length; u < n; u++) c[u].removeAttribute("autofocus");
        c = b.get_elements_by_tag_names(["link"], i);
        for (var u = 0, n = c.length; u < n; u++) c[u].removeAttribute("integrity"), c[u].removeAttribute("crossorigin");
        c = null, e = i.getElementsByTagName("*");
        for (var t = 0, n = e.length; t < n; t++) {
            var o = e[t];
            b.make_urls_absolute(o, x.http_auth)
        }
        e = null;
        for (var t = 0, n = r.length; t < n; t++) r[t].removeAttribute("data-bugmuncher-canvas-png");
        return r = null, p.document_html(i)
    }

    function r(e) {
        if (e && e.preventDefault(), E) return !1;
        E = !0;
        var t = A[x.language] || A.en;
        return m.innerHTML = t.loading, x.on_open && x.on_open(), b.disable_scroll(), v.log_bugmuncher("Feedback Button Clicked"), _ = document.createElement("iframe"), _.setAttribute("id", "bugmuncher_widget_iframe"), _.setAttribute("src", f.widget_domain), _.setAttribute("scrolling", "no"), _.setAttribute("frameborder", 0), _.setAttribute("allowTransparency", !0), _.style.zIndex = 2147483647, g.appendChild(_), b.fit_element_to_viewport(_), b.on_window_resize(function() {
            b.fit_element_to_viewport(_)
        }), !1
    }
x
    window.open_bugmuncher = function() {
      window.bugmuncher_options = {
        //api_key: "b746ad902aa9cf4d33f5"
        api_key: 'b53059b110c08683bf98',
        default_include_screenshot: true,
        skip_to: 'general',
        on_close: function() {
            SystemJS.import('libs_frontend/common_libs').then(function(common_libs) {
                common_libs.once_true(function() {
                    return document.querySelector('#bugmuncher_button').style.display != 'none';
                }, function() {
                    var bugmuncher_button = document.querySelector('#bugmuncher_button');
                    bugmuncher_button.style.display = 'none'
                    bugmuncher_button.style.opacity = 0
                    bugmuncher_button.style.pointerEvents = 'none'
                })
            })
            SystemJS.import('libs_common/screenshot_overlay_utils').then(function(screenshot_overlay_utils) {
                screenshot_overlay_utils.remove_screenshot_overlay()
            })
        }
      };
      SystemJS.import('libs_common/screenshot_overlay_utils').then(function(screenshot_overlay_utils) {
        screenshot_overlay_utils.add_screenshot_overlay().then(function() {
            e();
            //t();
            document.querySelector('#bugmuncher_button').style.display = 'none';
            document.querySelector('#bugmuncher_button').style.opacity = 0;
            document.querySelector('#bugmuncher_button').style.pointerEvents = 'none';
            r();
        })
      })
    }

    function i() {
        var e = b.viewport_size(),
            t = b.page_size(),
            n = b.window_scroll_position(),
            r = {
                api_key: x.api_key,
                html: o(),
                location: location.href,
                language: x.language,
                viewport_height: e.height,
                viewport_width: e.width,
                page_height: t.height,
                page_width: t.width,
                scroll_top: n.top,
                scroll_left: n.left,
                custom_data: x.custom_data,
                require_email: x.require_email,
                prefill_email: x.prefill_email,
                skip_to: x.skip_to,
                toolbox_position: x.position,
                default_include_screenshot: x.default_include_screenshot,
                always_include_screenshot: x.always_include_screenshot,
                events: v.events()
            };
        console.log(r)
        w.send(_.contentWindow, "set_options", r), d.style.display = "none"
    }

    function a(e) {
        v.clear_event_log(), x.on_complete && x.on_complete({
            feedback_report: e,
            report: e
        })
    }

    function l() {
        x.on_cancel && x.on_cancel()
    }

    function c() {
        E = !1, x.on_close && x.on_close(), b.remove_elements(_), b.resume_css_animations(T), T = [], b.on_window_resize(null), b.enable_scroll(), t()
    }
    if (!window.JSON) return !1;
    if ("Microsoft Internet Explorer" == navigator.appName) {
        var u = navigator.userAgent,
            s = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (null != s.exec(u) && (k = parseFloat(RegExp.$1), k && k < 7)) return !1
    }
    var d, m, g, _, h = this,
        f = function() {
            var e = {
                i18n: {
                    en: {
                        label_text: "Feedback",
                        loading: "Loading..."
                    },
                    es: {
                        label_text: "Observación",
                        loading: "Cargando..."
                    },
                    fr: {
                        label_text: "Remarque",
                        loading: "Chargement ..."
                    },
                    de: {
                        label_text: "Rückmeldung",
                        loading: "Lädt..."
                    },
                    nl: {
                        label_text: "Feedback",
                        loading: "Aan het laden..."
                    },
                    pt: {
                        label_text: "Comentário",
                        loading: "A carregar..."
                    },
                    se: {
                        label_text: "Feedback",
                        loading: "Laddar..."
                    },
                    tr: {
                        label_text: "Geribildirim",
                        loading: "Yükleniyor..."
                    }
                },
                widget_domain: "https://widget.bugmuncher.com",
                cdn_domain: "//cdn.bugmuncher.com"
            };
            return e
        }(),
        p = function() {
            return {
                doctype: function e() {
                    var e = "";
                    return document.doctype && (e = "<!DOCTYPE ", e += document.doctype.name, e += document.doctype.publicId ? ' PUBLIC "' + document.doctype.publicId + '"' : "", e += !document.doctype.publicId && document.doctype.systemId ? " SYSTEM" : "", e += document.doctype.systemId ? ' "' + document.doctype.systemId + '"' : "", e += ">"), e
                },
                element_html: function(e) {
                    try {
                        return e.outerHTML || function() {
                            var t = document.createElement("div");
                            return t.appendChild(e.cloneNode(!0)), t.innerHTML
                        }()
                    } catch (t) {
                        return ""
                    }
                },
                document_html: function(e) {
                    var e = e || document.documentElement;
                    return this.doctype() + this.element_html(e)
                }
            }
        }(),
        b = function() {
            return {
                default_value: function(e, t) {
                    return "undefined" == typeof e ? t : e
                },
                save_field_value: function(e) {
                    var t = String(e.tagName).toLowerCase();
                    if ("input" == t) {
                        var n = String(e.getAttribute("type")).toLowerCase();
                        if ("checkbox" == n || "radio" == n) e.checked ? e.setAttribute("checked", "checked") : e.removeAttribute("checked");
                        else if ("password" != n) {
                            var o = String(e.getAttribute("name")).toLowerCase(),
                                r = /(card|cc|acct).?(number|#|no|num)|nummer|credito|numero|número|numéro|カード番号|Номер.*карты|信用卡号|信用卡号码|信用卡卡號|카드/g,
                                i = /verification|card identification|security code|card code|cvn|cvv|cvc|csc|cvd|cid|ccv/g;
                            r.test(o) || i.test(o) || e.setAttribute("value", e.value)
                        }
                    } else if ("textarea" == t) {
                        var a = document.createTextNode(e.value);
                        e.innerHTML = "", e.appendChild(a), a = null
                    } else "option" == t && (e.selected ? e.setAttribute("selected", "selected") : e.removeAttribute("selected"))
                },
                viewport_size: function() {
                    return {
                        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                    }
                },
                page_size: function() {
                    var e = {
                        width: 0,
                        height: 0
                    };
                    document.documentElement && (e.width = Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth), e.height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight));
                    var t = {
                        width: 0,
                        height: 0
                    };
                    return document.body && (t.width = Math.max(document.body.scrollWidth, document.body.offsetWidth), t.height = Math.max(document.body.scrollHeight, document.body.offsetHeight)), {
                        width: Math.max(e.width, t.width),
                        height: Math.max(e.height, t.height)
                    }
                },
                fit_element_to_viewport: function(e) {
                    if (e) {
                        var t = this.viewport_size(),
                            n = this.window_scroll_position();
                        e.style.position = "absolute", e.style.width = t.width + "px", e.style.height = t.height + "px", e.style.top = n.top + "px", e.style.left = n.left + "px", e.style.right = null, e.style.bottom = null
                    }
                },
                on_window_resize: function(e) {
                    if (e) {
                        var t;
                        window.onresize = function(n) {
                            clearTimeout(t), t = setTimeout(function() {
                                e(n)
                            }, 100)
                        }
                    } else window.onresize = null
                },
                preventDefault: function(e) {
                    e = e || window.event, e.preventDefault && e.preventDefault(), e.returnValue = !1
                },
                disable_scroll: function() {
                    var e = this.window_scroll_position();
                    window.onscroll = function() {
                        window.scrollTo(e.left, e.top)
                    }
                },
                enable_scroll: function() {
                    window.onscroll = null
                },
                save_scroll_position: function(e) {
                    var t = {
                            top: 0,
                            left: 0
                        },
                        n = String(e.tagName).toLowerCase();
                    "body" == n ? t = this.window_scroll_position() : (t.top = e.scrollTop, t.left = e.scrollLeft), t.top || t.left ? e.setAttribute("data-bugmuncher-scroll", t.left + "x" + t.top) : e.removeAttribute("data-bugmuncher-scroll")
                },
                window_scroll_position: function() {
                    function e(e) {
                        for (var t = 0, n = 0; n < e.length; n++) "undefined" != typeof e[n] && (e[n] && e[n] < t || 0 == t) && (t = e[n]);
                        return t
                    }
                    return {
                        top: e([window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop]),
                        left: e([window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft])
                    }
                },
                make_urls_absolute: function(e, t) {
                    function n(e) {
                        return t ? e.replace(/(https?:\/\/)/i, function(e, n) {
                            return n + t + "@"
                        }) : e
                    }

                    function o(e) {
                        return e.replace(/url\('?"?(.+?)'?"?\)/gi, function(e, t) {
                            var o = document.createElement("a");
                            o.setAttribute("href", t);
                            var r = n(o.href);
                            return e.replace(t, r)
                        })
                    }
                    for (var r = ["href", "src", "background"], i = 0; i < r.length; i++) {
                        var a = r[i];
                        if (e.getAttribute(a)) {
                            var l = document.createElement("a");
                            l.setAttribute("href", e.getAttribute(a));
                            try {
                                e.setAttribute(a, n(l.href))
                            } catch (c) {}
                        }
                    }
                    e.style && e.style.cssText && (e.style.cssText = o(e.style.cssText));
                    var u = String(e.tagName).toLowerCase();
                    "style" == u && (e.textContent ? e.textContent = o(e.textContent) : e.innerText && (e.innerText = o(e.innerText)))
                },
                swap_elements: function(e, t) {
                    e.parentNode.replaceChild(t, e)
                },
                remove_elements: function(e) {
                    if (e) {
                        e = this.force_array(e);
                        for (var t = 0, n = e.length; t < n; t++) e[0].parentNode.removeChild(e[0])
                    }
                },
                get_element_by_id_in: function(e, t, n) {
                    for (var n = n || "*", o = e.getElementsByTagName(n), r = 0, i = o.length; r < i; r++)
                        if (o[r].getAttribute("id") == t) return o[r];
                    return null
                },
                get_elements_by_tag_names: function(e) {
                    for (var t = arguments.length <= 1 || void 0 === arguments[1] ? document : arguments[1], n = [], o = 0; o < e.length; o++)
                        for (var r = t.getElementsByTagName(e[o]), i = 0; i < r.length; i++) n.push(r[i]);
                    return n
                },
                force_array: function(e) {
                    return e[0] ? e : [e]
                },
                canvas_to_png: function(e) {
                    if (e.toDataURL) try {
                        e.setAttribute("data-bugmuncher-canvas-png", e.toDataURL())
                    } catch (t) {}
                },
                is_property_animatable: function(e) {
                    for (var t = ["background", "background-color", "background-position", "background-size", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-width", "border-color", "border-left", "border-left-color", "border-left-width", "border-right", "border-right-color", "border-right-width", "border-spacing", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-width", "bottom", "box-shadow", "clip", "color", "column-count", "column-gap", "column-rule", "column-rule-color", "column-rule-width", "column-width", "columns", "filter", "flex", "flex-basis", "flex-grow", "flex-shrink", "font", "font-size", "font-size-adjust", "font-stretch", "font-weight", "height", "left", "letter-spacing", "line-height", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "max-height", "max-width", "min-height", "min-width", "opacity", "order", "outline", "outline-color", "outline-offset", "outline-width", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "perspective", "perspective-origin", "right", "text-decoration-color", "text-indent", "text-shadow", "top", "transform", "transform-origin", "vertical-align", "visibility", "width", "word-spacing", "z-index"], n = 0, o = t.length; n < o; n++)
                        if (e === t[n]) return !0;
                    return !1
                },
                pause_css_animations: function() {
                    if (!("getComputedStyle" in window)) return !1;
                    for (var e = ["", "-webkit-", "-moz-", "-o-"], t = e.length, n = !1, o = document.createElement("a").style, r = 0; r < t; r++) {
                        o.setProperty(e[r] + "animation-duration", "42s");
                        var i = o.getPropertyValue(e[r] + "animation-duration");
                        i && "42s" == i && (n = e[r], r = t)
                    }
                    if (n === !1) return !1;
                    for (var a = document.getElementsByTagName("*"), l = a.length, c = [], u = 0; u < l; u++) {
                        var s = a[u],
                            d = getComputedStyle(s);
                        if (parseFloat(d.getPropertyValue(n + "animation-duration")) > 0) {
                            s.setAttribute("data-bugmuncher-original-style", s.style.cssText);
                            for (var m = 0, g = d.length; m < g; m++) {
                                var _ = d.item(m);
                                if (this.is_property_animatable(_)) {
                                    var h = d.getPropertyValue(_);
                                    s.style.setProperty(_, h, "important")
                                }
                            }
                            s.style.setProperty(n + "animation-play-state", "paused", "important"), c.push(s)
                        }
                    }
                    return c
                },
                resume_css_animations: function(e) {
                    for (var t = 0, n = e.length; t < n; t++) {
                        var o = e[t];
                        o.setAttribute("style", o.getAttribute("data-bugmuncher-original-style")), o.removeAttribute("data-bugmuncher-original-style")
                    }
                }
            }
        }(),
        v = function() {
            var e = new function() {
                var e = this,
                    t = function(t, r) {
                        r.timestamp = (new Date).toString(), r.type = t, o.push(r);
                        try {
                            n()
                        } catch (i) {
                            e.clear_event_log()
                        }
                    };
                this.log_page_load = function(e, n) {
                    t("page_load", {
                        method: e,
                        url: n
                    })
                }, this.log_ajax = function(e, n) {
                    t("ajax", {
                        method: e,
                        url: n
                    })
                }, this.log_error = function(e) {
                    t("error", e)
                }, this.log_bugmuncher = function(e) {
                    t("bugmuncher", {
                        content: e
                    })
                }, this.events = function() {
                    return o
                }, this.clear_event_log = function() {
                    o = [], n()
                };
                var n = function() {
                    window.sessionStorage.bugmuncher_event_log = JSON.stringify(o)
                };
                void 0 != window.sessionStorage.bugmuncher_event_log && "" != window.sessionStorage.bugmuncher_event_log || (window.sessionStorage.bugmuncher_event_log = "[]");
                var o = JSON.parse(window.sessionStorage.bugmuncher_event_log);
                this.log_page_load("GET", location.href)
            };
            XMLHttpRequest && XMLHttpRequest.prototype && XMLHttpRequest.prototype.open && ! function() {
                var t = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function() {
                    e.log_ajax(arguments[0], arguments[1]), t.apply(this, arguments)
                }
            }();
            var t = window.onerror;
            return window.onerror = function(n, o, r, i, a) {
                var l = void 0;
                n = b.default_value(n, ""), o = b.default_value(o, "(anonymous function)"), r = b.default_value(r, !1), i = b.default_value(i, !1), a = b.default_value(a, !1), a && (l = a.stack), e.log_error({
                    message: n,
                    url: o,
                    line: r,
                    column: i,
                    stack_trace: l
                }), t && t(n, o, r, i, a)
            }, e
        }(),
        w = function() {
            return {
                add_event_listener: window.addEventListener ? window.addEventListener : window.attachEvent,
                message_event: window.addEventListener ? "message" : "onmessage",
                send: function(e, t, n) {
                    var o = {
                        bugmuncher: {
                            event: t
                        }
                    };
                    return n && (o.bugmuncher.params = n), e.postMessage(JSON.stringify(o), "*")
                },
                receive: function(e, t) {
                    var n = window.addEventListener ? "addEventListener" : "attachEvent",
                        o = window[n],
                        r = "attachEvent" == n ? "onmessage" : "message";
                    o(r, function(n) {
                        var o = n.message ? "message" : "data";
                        try {
                            var r = JSON.parse(n[o])
                        } catch (i) {}
                        r && r.bugmuncher && r.bugmuncher.event === e && t(r.bugmuncher.params)
                    }, !1)
                }
            }
        }(),
        y = {
            api_key: !1,
            language: "en",
            position: "right",
            style: "label",
            theme: "modern",
            background_color: "#222",
            text_color: "#fff",
            label_text: !1,
            custom_data: !1,
            require_email: !1,
            prefill_email: "",
            skip_to: !1,
            default_include_screenshot: !1,
            always_include_screenshot: !1,
            http_auth: !1,
            on_ready: !1,
            on_open: !1,
            on_complete: !1,
            on_cancel: !1,
            on_close: !1
        },
        x = {},
        E = !1,
        k = !1,
        A = f.i18n,
        T = [];
    window.bugmuncher_widget_domain && (f.widget_domain = window.bugmuncher_widget_domain), window.bugmuncher_cdn_domain && (f.cdn_domain = window.bugmuncher_cdn_domain), h.debug = !1, h.open = function() {
        r()
    }, h.close = function() {
        c()
    }, h.set_options = function(e) {
        var n;
        for (n in y) e[n] ? x[n] = e[n] : x[n] = y[n];
        t()
    }, h.set_option = function(e, n) {
        x[e] = n, t()
    }, h.debug_mode = function() {
        h.debug ? (n("Leaving debug mode"), h.debug = !1) : (h.debug = {
            hot_sauce: p,
            secret_sauce: b,
            event_log: v,
            config: f,
            iframe_message: w,
            configure: t,
            get_host_html: o
        }, n("Entering debug mode"))
    }, window.bugmuncher_options && (e(), x.on_ready && x.on_ready())
};