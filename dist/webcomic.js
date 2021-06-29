var webcomic;
(function (webcomic) {
    ;
    var intros = [
        { name: "intro-fade", animClass: "playFadeIn", preparation: function (e) { return e.style.opacity = '0'; } },
        { name: "intro-curtain-horizontal", animClass: "playCurtainInY", preparation: function (e) { return e.style.transform = "scaleY(0)"; } },
        { name: "intro-curtain-vertical", animClass: "playCurtainInX", preparation: function (e) { return e.style.transform = "scaleX(0)"; } },
        { name: "intro-swipe-left", animClass: "playSwipeInLeft", preparation: function (e) { return e.style.clipPath = "inset(0 100% 0 0)"; } },
        { name: "intro-swipe-right", animClass: "playSwipeInRight", preparation: function (e) { return e.style.clipPath = "inset(0 0 0 100%)"; } },
        { name: "intro-swipe-top", animClass: "playSwipeInTop", preparation: function (e) { return e.style.clipPath = "inset(0 0 100% 0)"; } },
        { name: "intro-swipe-bottom", animClass: "playSwipeInBottom", preparation: function (e) { return e.style.clipPath = "inset(100% 0 0 0)"; } },
        { name: "intro-slide-left", animClass: "playSlideInLeft", preparation: function (e) { e.style.clipPath = "inset(0 100% 0 0)"; } },
        { name: "intro-slide-right", animClass: "playSlideInRight", preparation: function (e) { e.style.clipPath = "inset(0 0 0 100%)"; } },
        { name: "intro-slide-top", animClass: "playSlideInTop", preparation: function (e) { e.style.clipPath = "inset(100% 0 0 0)"; } },
        { name: "intro-slide-bottom", animClass: "playSlideInBottom", preparation: function (e) { e.style.clipPath = "inset(0 0 100% 0)"; } },
        { name: "intro-grow", animClass: "playGrow", preparation: function (e) { e.style.transform = "scale(0)"; } }
    ];
    var outros = [
        { name: "outro-fade", animClass: "playFadeOut", preparation: function () { } },
        { name: "outro-curtain-horizontal", animClass: "playCurtainOutY", preparation: function () { } },
        { name: "outro-curtain-vertical", animClass: "playCurtainOutX", preparation: function () { } },
        { name: "outro-swipe-left", animClass: "playSwipeOutLeft", preparation: function () { } },
        { name: "outro-swipe-right", animClass: "playSwipeOutRight", preparation: function () { } },
        { name: "outro-swipe-top", animClass: "playSwipeOutTop", preparation: function () { } },
        { name: "outro-swipe-bottom", animClass: "playSwipeOutBottom", preparation: function () { } },
        { name: "outro-slide-left", animClass: "playSlideOutLeft", preparation: function () { } },
        { name: "outro-slide-right", animClass: "playSlideOutRight", preparation: function () { } },
        { name: "outro-slide-top", animClass: "playSlideOutTop", preparation: function () { } },
        { name: "outro-slide-bottom", animClass: "playSlideOutBottom", preparation: function () { } },
        { name: "outro-shrink", animClass: "playShrink", preparation: function () { } }
    ];
    ;
    var AnimationManager = /** @class */ (function () {
        function AnimationManager() {
            this.sequence = new Array();
            this.index = 0;
            this.lastIndex = 0;
        }
        AnimationManager.prototype.restart = function () {
            console.log("tets");
            this.index = 0;
            this.lastIndex = this.sequence.length;
            this.sequence.forEach(function (s, i) {
                s.forEach(function (cs) {
                    cs.animation.preparation(cs.target);
                    cs.target.className = cs.target.className.replace(/(play.*?)( |$)/gi, "");
                });
            });
        };
        AnimationManager.prototype.nextPanel = function () {
            if (this.index == this.lastIndex) {
                if (webcomic.onNextPage) {
                    webcomic.onNextPage();
                }
                else {
                    this.restart();
                }
                return;
            }
            var currenntSequence = this.sequence[this.index];
            currenntSequence.forEach(function (s) {
                if (!s)
                    return;
                playAnim(s.target, s.animation);
            });
            this.index++;
        };
        return AnimationManager;
    }());
    function initialize() {
        console.log("initialized");
        var webComicContainers = document.getElementsByClassName("webcomic");
        Array.prototype.forEach.call(webComicContainers, (function (webComicContainer) {
            var animManager = new AnimationManager();
            var panels = webComicContainer.children;
            panels = Array.prototype.filter.call(panels, function (element) {
                return element.className.includes("panel");
            });
            var isNew = true;
            Array.prototype.forEach.call(panels, function (element) {
                var i = 0;
                intros.forEach(function (animation) {
                    if (element.className.includes(animation.name)) {
                        if (i == 0 && isNew)
                            animManager.sequence.push([{ target: element, animation: animation }]);
                        else
                            animManager.sequence[animManager.sequence.length - 1].push({ target: element, animation: animation });
                        i++;
                    }
                });
                i = 0;
                isNew = true;
                outros.forEach(function (animation) {
                    if (element.className.includes(animation.name)) {
                        if (i == 0) {
                            animManager.sequence.push([{ target: element, animation: animation }]);
                            isNew = false;
                        }
                        else
                            animManager.sequence[animManager.sequence.length - 1].push({ target: element, animation: animation });
                        i++;
                    }
                });
            });
            animManager.restart();
            console.log(animManager.sequence);
            document.body.addEventListener("click", function () {
                animManager.nextPanel();
            });
        }));
    }
    webcomic.initialize = initialize;
    function playAnim(target, animation) {
        target.className = target.className.replace(/(play.*?)( |$)/gi, "");
        void target.offsetWidth;
        target.classList.add("" + animation.animClass);
        void target.offsetWidth;
    }
    window.onload = initialize;
})(webcomic || (webcomic = {}));
