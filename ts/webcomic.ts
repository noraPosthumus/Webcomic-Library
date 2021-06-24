namespace webcomic {

    export let onNextPage : () => void;
    export let onNextPanel : (previousPanel: HTMLElement, nextPanel: HTMLElement) => void;

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

    class AnimationManager {
        panels: HTMLElement[] = new Array();
        anims: Animation[] = new Array();
        index: number = 0;
        lastIndex: number = 0;

        restart () {
            this.index = 0;
            this.lastIndex = this.panels.length;
            this.panels.forEach((panel, i) => {this.anims[i].preparation(panel); panel.style.animation = ""});
        }

        nextPanel () {
            if (this.index == this.lastIndex) {
                if (onNextPage)
                    onNextPage();
                else
                    this.restart();
                return;
            }
            if (!this.panels[this.index] && !this.anims[this.index]) return;
            if (onNextPanel)
                this.index > 0 ? onNextPanel(this.panels[this.index - 1], this.panels[this.index]) : onNextPanel(this.panels[this.index], this.panels[this.index]);
            playAnim(this.panels[this.index], this.anims[this.index])
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

            Array.prototype.forEach.call(panels, (element) => {
                animations.forEach((animation) => {
                    if( element.className.includes(animation.class)) {
                        animManager.panels.push(element);
                        animManager.anims.push(animation);
                    };
                } )
            });
            animManager.restart();

            document.body.addEventListener("click", () => {
                animManager.nextPanel();
            })

            console.log(panels);
        }))


    }

    function playAnim(target:HTMLElement, animation:Animation) {
        target.style.animation = `${animation.duration}s ${animation.easing} ${animation.mode} ${animation.name}`;
    }

    window.onload = initialize;
}
