var webcomic;
(function (webcomic) {
    ;
    var intros = [
        { name: "intro-fade", animClass: "playFadeIn", preparation: function (e) { return e.style.opacity = '0'; } }
    ];
    var outros = [
        { name: "outro-fade", animClass: "playFadeOut", preparation: function () { } }
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
                intros.forEach(function (animation, i) {
                    if (element.className.includes(animation.name)) {
                        if (i == 0 && isNew)
                            animManager.sequence.push([{ target: element, animation: animation }]);
                        else
                            animManager.sequence[animManager.sequence.length - 1].push({ target: element, animation: animation });
                    }
                });
                isNew = true;
                outros.forEach(function (animation, i) {
                    if (element.className.includes(animation.name)) {
                        if (i == 0) {
                            animManager.sequence.push([{ target: element, animation: animation }]);
                            isNew = false;
                        }
                        else
                            animManager.sequence[animManager.sequence.length - 1].push({ target: element, animation: animation });
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
        target.classList.add("" + animation.animClass);
        void target.offsetWidth;
    }
    window.onload = initialize;
})(webcomic || (webcomic = {}));
