var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var webcomic;
(function (webcomic) {
    // options
    var PlayOutroOptions;
    (function (PlayOutroOptions) {
        PlayOutroOptions[PlayOutroOptions["onNextPanel"] = 0] = "onNextPanel";
        PlayOutroOptions[PlayOutroOptions["onPageEnd"] = 1] = "onPageEnd";
    })(PlayOutroOptions || (PlayOutroOptions = {}));
    ;
    webcomic.options = {
        keyboardEvents: true,
        cycle: true,
        playOutro: PlayOutroOptions.onNextPanel
    };
    // init function
    var panels = new Array();
    function init(options) {
        if (options === void 0) { options = {}; }
        // get the page layout container
        var page = document.getElementsByClassName("webcomic")[0];
        if (!page) {
            emit(WebcomicEvents.initialized);
            return;
        }
        ;
        // override default options
        var dataOptions = page.getAttribute("data-webcomic-options");
        if (dataOptions) {
            Object.assign(webcomic.options, options, JSON.parse(dataOptions));
        }
        if (webcomic.options.border)
            page.style.setProperty("--border", typeof webcomic.options.border == "number" ? webcomic.options.border + "px" : webcomic.options.border);
        if (webcomic.options.panelWidth)
            page.style.setProperty("--panel-width", typeof webcomic.options.panelWidth == "number" ? webcomic.options.panelWidth + "px" : webcomic.options.panelWidth);
        if (webcomic.options.panelHeight)
            page.style.setProperty("--panel-height", typeof webcomic.options.panelHeight == "number" ? webcomic.options.panelHeight + "px" : webcomic.options.panelHeight);
        if (webcomic.options.horizontalGutter)
            page.style.setProperty("--horizontal-gutter", typeof webcomic.options.horizontalGutter == "number" ? webcomic.options.horizontalGutter + "px" : webcomic.options.horizontalGutter);
        if (webcomic.options.vertivalGutter)
            page.style.setProperty("--vertical-gutter", typeof webcomic.options.vertivalGutter == "number" ? webcomic.options.vertivalGutter + "px" : webcomic.options.vertivalGutter);
        var children = Array.from(page.children);
        panels = children.filter(function (child) {
            return child.classList.contains("panel");
        });
        panels.forEach(function (panel) {
            return initPanel(panel);
        });
        if (webcomic.options.keyboardEvents) {
            window.addEventListener("keydown", function (e) {
                if (e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 39) {
                    nextPanel();
                }
                else if (e.keyCode == 37) {
                    previousPanel();
                }
            });
        }
        window.addEventListener("click", function (e) {
            nextPanel();
        });
        // call the onInitialized event
        emit(WebcomicEvents.initialized);
    }
    webcomic.init = init;
    // events
    var WebcomicEvents;
    (function (WebcomicEvents) {
        WebcomicEvents[WebcomicEvents["initialized"] = 0] = "initialized";
        WebcomicEvents[WebcomicEvents["nextPanel"] = 1] = "nextPanel";
        WebcomicEvents[WebcomicEvents["nextPage"] = 2] = "nextPage";
    })(WebcomicEvents = webcomic.WebcomicEvents || (webcomic.WebcomicEvents = {}));
    var events = new Map([]);
    function on(event, callbackFn) {
        var e;
        if (typeof event == "string") {
            e = WebcomicEvents[event];
        }
        else {
            e = event;
        }
        if (events.get(e)) {
            events.get(e).push(callbackFn);
        }
        else {
            events.set(e, [callbackFn]);
        }
    }
    webcomic.on = on;
    function emit(event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!events.get(event))
            return;
        events.get(event).forEach(function (e) {
            try {
                e.apply(void 0, __spreadArray([], __read(args)));
            }
            catch (e) {
                console.error(e.message);
            }
        });
    }
    webcomic.emit = emit;
    // initialize a panel (prepare animations)
    function initPanel(panel) {
        var order = parseInt(panel.getAttribute("data-order"));
        if (panel.hasAttribute("data-intro")) {
            panel.classList.add(panel.getAttribute("data-intro") + "-before");
            void panel.offsetWidth;
            if (order) {
                intros.splice(order, 0, panel);
            }
            else {
                intros.push(panel);
            }
        }
        ;
        if (panel.hasAttribute("data-outro")) {
            outros.push(panel);
        }
        ;
    }
    // transition to the next panel
    var intros = new Array(), outros = new Array(), cursor = 0;
    function nextPanel() {
        webcomic.emit(WebcomicEvents.nextPanel);
        if (cursor >= intros.length) {
            if (webcomic.options.playOutro == PlayOutroOptions.onPageEnd) {
                outros.forEach(function (o) {
                    animateOut(o);
                });
            }
            if (webcomic.options.cycle) {
                reset();
            }
            ;
            webcomic.emit(WebcomicEvents.nextPage);
            return;
        }
        ;
        if (webcomic.options.playOutro == PlayOutroOptions.onNextPanel && cursor > 0) {
            animateOut(outros[cursor - 1]);
        }
        animateIn(intros[cursor]);
        cursor++;
    }
    // transition to the previous panel
    function previousPanel() {
        if (cursor == 0)
            return;
        animateOut(outros[cursor - 1]);
        if (cursor > 1)
            animateIn(intros[cursor - 2]);
        cursor--;
    }
    // reset all animations
    function reset() {
        intros = new Array();
        outros = new Array();
        cursor = 0;
        panels.forEach(function (panel) {
            animTimeHandlers.forEach(function (h) {
                setTimeout(h, 0);
            });
            initPanel(panel);
            panel.classList.remove(panel.getAttribute("data-intro") + "-after");
            panel.classList.remove(panel.getAttribute("data-outro") + "-after");
        });
    }
    var animTimeHandlers = new Array();
    // play the animation on the target element (optional duration in milliseconds)
    function playAnimation(animation, target, duration) {
        if (duration === void 0) { duration = 500; }
        target.classList.remove(animation + "-before");
        target.classList.add(animation);
        target.style.animationDuration = duration + "ms";
        void target.offsetWidth;
        animTimeHandlers.push(setTimeout(function () {
            target.classList.remove(animation);
            target.classList.add(animation + "-after");
            void target.offsetWidth;
        }, duration));
    }
    // animate in
    function animateIn(target) {
        var intro = target.getAttribute("data-intro"), outro = target.getAttribute("data-outro");
        if (target.hasAttribute("data-outro"))
            target.classList.remove(target.getAttribute("data-outro") + "-after");
        playAnimation(intro, target);
    }
    // animate out
    function animateOut(target) {
        var outro = target.getAttribute("data-outro");
        if (target.hasAttribute("data-intro"))
            target.classList.remove(target.getAttribute("data-intro") + "-after");
        playAnimation(outro, target);
    }
    // helper function to convert css duration strings to milliseconds
    function cssDurationToMS(val) {
        if (val == "")
            return 0;
        else if (val.includes("ms"))
            return parseFloat(val.replace("ms", ""));
        else
            return parseFloat(val.replace("s", "")) * 1000;
    }
    // run the init funtion when the page loaded
    window.addEventListener("load", function (e) {
        webcomic.init();
    });
})(webcomic || (webcomic = {}));
