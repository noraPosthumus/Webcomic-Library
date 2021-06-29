namespace webcomic {

    export let onNextPage : () => void;

    interface Animation {name : string, animClass : string, preparation: (e: HTMLElement) => void};
    const intros: Animation[] = [
        {name: "intro-fade", animClass: "playFadeIn", preparation: (e) => e.style.opacity = '0'},
        {name: "intro-curtain-horizontal", animClass: "playCurtainInY", preparation: (e) => e.style.transform = "scaleY(0)"},
        {name: "intro-curtain-vertical", animClass: "playCurtainInX", preparation: (e) => e.style.transform = "scaleX(0)"},
        {name: "intro-swipe-left", animClass: "playSwipeInLeft", preparation: (e) => e.style.clipPath = "inset(0 100% 0 0)"},
        {name: "intro-swipe-right", animClass: "playSwipeInRight", preparation: (e) => e.style.clipPath = "inset(0 0 0 100%)"},
        {name: "intro-swipe-top", animClass: "playSwipeInTop", preparation: (e) => e.style.clipPath = "inset(0 0 100% 0)"},
        {name: "intro-swipe-bottom", animClass: "playSwipeInBottom", preparation: (e) => e.style.clipPath = "inset(100% 0 0 0)"},
        {name: "intro-slide-left", animClass: "playSlideInLeft", preparation: (e) => {e.style.clipPath = "inset(0 100% 0 0)"}},
        {name: "intro-slide-right", animClass: "playSlideInRight", preparation: (e) => {e.style.clipPath = "inset(0 0 0 100%)"}},
        {name: "intro-slide-top", animClass: "playSlideInTop", preparation: (e) => {e.style.clipPath = "inset(100% 0 0 0)"}},
        {name: "intro-slide-bottom", animClass: "playSlideInBottom", preparation: (e) => {e.style.clipPath = "inset(0 0 100% 0)"}},
        {name: "intro-grow", animClass: "playGrow", preparation: (e) => {e.style.transform = "scale(0)"}}

    ]
    const outros: Animation[] = [
        {name: "outro-fade", animClass: "playFadeOut", preparation: () => {}},
        {name: "outro-curtain-horizontal", animClass: "playCurtainOutY", preparation: () => {}},
        {name: "outro-curtain-vertical", animClass: "playCurtainOutX", preparation: () => {}},
        {name: "outro-swipe-left", animClass: "playSwipeOutLeft", preparation: () => {}},
        {name: "outro-swipe-right", animClass: "playSwipeOutRight", preparation: () => {}},
        {name: "outro-swipe-top", animClass: "playSwipeOutTop", preparation: () => {}},
        {name: "outro-swipe-bottom", animClass: "playSwipeOutBottom", preparation: () => {}},
        {name: "outro-slide-left", animClass: "playSlideOutLeft", preparation: () => {}},
        {name: "outro-slide-right", animClass: "playSlideOutRight", preparation: () => {}},
        {name: "outro-slide-top", animClass: "playSlideOutTop", preparation: () => {}},
        {name: "outro-slide-bottom", animClass: "playSlideOutBottom", preparation: () => {}},
        {name: "outro-shrink", animClass: "playShrink", preparation: () => {}}
    ]

    interface Sequence extends Array<{target: HTMLElement, animation: Animation}> {};

    class AnimationManager {
        sequence: Sequence[] = new Array(); 
        index: number = 0;
        lastIndex: number = 0;

        restart () {
            console.log("tets")
            this.index = 0;
            this.lastIndex = this.sequence.length;
            this.sequence.forEach((s, i) => {
                s.forEach(cs => {
                    cs.animation.preparation(cs.target);
                    cs.target.className = cs.target.className.replace(/(play.*?)( |$)/gi, "");
                })
            });
        }

        nextPanel () {
            if (this.index == this.lastIndex) {
                if (onNextPage) {
                    onNextPage();
                }
                else {
                    this.restart();
                }
                return;
            }
            let currenntSequence: Sequence = this.sequence[this.index]
            currenntSequence.forEach( (s) => {
                if (!s) return;
                playAnim(s.target, s.animation);
            });
            this.index++;
        }
    }

    export function initialize() {

        console.log("initialized");

        const webComicContainers : HTMLCollection = document.getElementsByClassName("webcomic");

        Array.prototype.forEach.call(webComicContainers, (webComicContainer  => {

            const animManager = new AnimationManager();

            let panels : HTMLCollection = webComicContainer.children;
            panels = Array.prototype.filter.call(panels, (element) => {
                    return element.className.includes("panel");
            });

            let isNew = true;
            Array.prototype.forEach.call(panels, (element) => {
                let i = 0;
                intros.forEach((animation) => {
                    if( element.className.includes(animation.name)) {
                        if (i == 0 && isNew)
                            animManager.sequence.push([{target: element, animation: animation}])
                        else                        
                            animManager.sequence[animManager.sequence.length - 1].push({target: element, animation: animation});
                    i++;
                    }
                });
                i = 0;
                isNew = true;
                outros.forEach((animation) => {
                    if( element.className.includes(animation.name)) {
                        if (i == 0) {
                            animManager.sequence.push([{target: element, animation: animation}]);
                            isNew = false;
                        }
                        else                        
                            animManager.sequence[animManager.sequence.length - 1].push({target: element, animation: animation});
                    i++
                   }
                });
            });
            animManager.restart();
            console.log(animManager.sequence);
            document.body.addEventListener("click", () => {
                animManager.nextPanel();
            })
        }))
    }

    function playAnim(target:HTMLElement, animation) {
        target.className = target.className.replace(/(play.*?)( |$)/gi, "");
        void target.offsetWidth;
        target.classList.add(`${animation.animClass}`);
        void target.offsetWidth;
    }

    window.onload = initialize;
}
