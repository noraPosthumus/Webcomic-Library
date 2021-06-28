var webcomic;
(function (webcomic) {
    ;
    var animations = [
        { "class": "intro-fade", name: "fadeIn", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { return e.style.opacity = '0'; } },
        { "class": "intro-curtain-horizontal", name: "curtain-horizontal", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { return e.style.transform = "scaleY(0)"; } },
        { "class": "intro-curtain-vertical", name: "curtain-vertical", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { return e.style.transform = "scaleY(0)"; } },
        { "class": "intro-slide-left", name: "slide-left", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(0 0 0 100%)"; } },
        { "class": "intro-slide-right", name: "slide-right", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(0 100% 0 0)"; } },
        { "class": "intro-slide-top", name: "slide-top", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(100% 0 0 0)"; } },
        { "class": "intro-slide-bottom", name: "slide-bottom", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(0 0 100% 0)"; } },
        { "class": "intro-swipe-left", name: "swipe-left", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(0 100% 0 0)"; } },
        { "class": "intro-swipe-right", name: "swipe-right", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(0 0 0 100%)"; } },
        { "class": "intro-swipe-top", name: "swipe-top", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(0 0 100% 0)"; } },
        { "class": "intro-swipe-bottom", name: "swipe-bottom", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { e.style.clipPath = "inset(100% 0 0 0)"; } },
        { "class": "intro-grow", name: "grow", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: function (e) { return e.style.transform = "scale(0)"; } }
    ];
    ;
    var AnimationManager = /** @class */ (function () {
        function AnimationManager() {
            this.sequence = new Array();
            this.index = 0;
            this.lastIndex = 0;
        }
        AnimationManager.prototype.restart = function () {
            this.index = 0;
            this.lastIndex = this.sequence.length;
            this.sequence.forEach(function (s, i) {
                s.forEach(function (s) {
                    s.animation.preparation(s.target);
                    s.target.style.animation = "";
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
                if (!s.animation)
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
            var i = 0;
            Array.prototype.forEach.call(panels, function (element) {
                animations.forEach(function (animation) {
                    if (element.className.includes(animation["class"])) {
                        if (animManager.sequence[i]) {
                            animManager.sequence[i].push({ target: element, animation: animation });
                        }
                        else {
                            animManager.sequence[i] = [{ target: element, animation: animation }];
                        }
                    }
                });
                i++;
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
        target.style.animation = animation.duration + "s " + animation.easing + " " + animation.mode + " " + animation.name;
    }
    window.onload = initialize;
})(webcomic || (webcomic = {}));
