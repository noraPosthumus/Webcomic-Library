var webcomic;
(function (webcomic) {
    var Animations;
    (function (Animations) {
        Animations[Animations["FadeIn"] = 0] = "FadeIn";
    })(Animations = webcomic.Animations || (webcomic.Animations = {}));
    function initialize() {
        console.log("initialized");
        var webComicContainers = document.getElementsByClassName("webcomic");
        Array.prototype.forEach.call(webComicContainers, (function (webComicContainer) {
            var panels = webComicContainer.children;
            panels = Array.prototype.filter.call(panels, function (element) {
                return element.className.includes("panel");
            });
            document.body.addEventListener("click", function () {
                fadeIn(panels[2]);
            });
            console.log(panels);
        }));
    }
    webcomic.initialize = initialize;
    function fadeIn(e) {
        e.style.animation = "slide-left .5s ease-in-out";
        e.style.opacity = "1";
    }
    window.onload = initialize;
})(webcomic || (webcomic = {}));
