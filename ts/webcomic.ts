namespace webcomic {

    export let onNextPage : () => void;

    interface Animation {class : string, name : string, duration : number, mode: FillMode, easing : string, preparation: (e: HTMLElement) => void};
    const animations : Animation[] = [
        {class: "intro-fade", name: "fadeIn", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) => e.style.opacity = '0'},
        {class: "intro-curtain-horizontal", name: "curtain-horizontal", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) => e.style.transform = "scaleY(0)"},
        {class: "intro-curtain-vertical", name: "curtain-vertical", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) => e.style.transform = "scaleY(0)"},
        {class: "intro-slide-left", name: "slide-left", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(0 0 0 100%)"}},
        {class: "intro-slide-right", name: "slide-right", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(0 100% 0 0)"}},
        {class: "intro-slide-top", name: "slide-top", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(100% 0 0 0)"}},
        {class: "intro-slide-bottom", name: "slide-bottom", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(0 0 100% 0)"}},
        {class: "intro-swipe-left", name: "swipe-left", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(0 100% 0 0)"}},
        {class: "intro-swipe-right", name: "swipe-right", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(0 0 0 100%)"}},
        {class: "intro-swipe-top", name: "swipe-top", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(0 0 100% 0)"}},
        {class: "intro-swipe-bottom", name: "swipe-bottom", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) =>  {e.style.clipPath = "inset(100% 0 0 0)"}},
        {class: "intro-grow", name: "grow", duration: 0.5, mode: "forwards", easing: "ease-in-out", preparation: (e) => e.style.transform = "scale(0)"}
    ];
    interface Sequence extends Array<{target: HTMLElement, animation: Animation}> {};

    class AnimationManager {
        sequence: Sequence[] = new Array();
        index: number = 0;
        lastIndex: number = 0;

        restart () {
            this.index = 0;
            this.lastIndex = this.sequence.length;
            this.sequence.forEach((s, i) => {
                s.forEach(s => {
                    s.animation.preparation(s.target);
                    s.target.style.animation = ""
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
            currenntSequence.forEach( s => {
                if (!s.animation) return;
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

            let i = 0;
            Array.prototype.forEach.call(panels, (element) => {
                animations.forEach((animation) => {
                    if( element.className.includes(animation.class)) {
                        if (animManager.sequence[i]) {
                            animManager.sequence[i].push({target: element, animation: animation})
                        } else {
                            animManager.sequence[i] = [{target: element, animation: animation}];
                        }
                    }
                });
                i++;
            });
            animManager.restart();
            console.log(animManager.sequence);
            document.body.addEventListener("click", () => {
                animManager.nextPanel();
            })
        }))


    }

    function playAnim(target:HTMLElement, animation:Animation) {
        target.style.animation = `${animation.duration}s ${animation.easing} ${animation.mode} ${animation.name}`;
    }

    window.onload = initialize;
}
