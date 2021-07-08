namespace webcomic {

    // options
    enum PlayOutroOptions {onNextPanel, onPageEnd}
    interface Options {keyboardEvents?: boolean, cycle?: boolean, playOutro?: PlayOutroOptions, panelWidth?: number | string, panelHeight?: number | string, horizontalGutter?: number | string, vertivalGutter?: number | string, border?: number | string};
    export let options: Options = {
        keyboardEvents: true,
        cycle: true,
        playOutro: PlayOutroOptions.onNextPanel
    };

    // init function
    let panels = new Array<HTMLElement>();
    export function init (options: Options = {}) {

        // get the page layout container
        const page: HTMLElement = document.getElementsByClassName("webcomic")[0] as HTMLElement;

        if(!page) {
            emit(WebcomicEvents.initialized);
            return;
        };
        // override default options
        const dataOptions = page.getAttribute("data-webcomic-options");
        if(dataOptions) {
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

        let children = Array.from(page.children) as Array<HTMLElement>;

        panels = children.filter(child => 
            child.classList.contains("panel"));
        panels.forEach(panel  => 
                initPanel(panel as HTMLElement));

        if (webcomic.options.keyboardEvents) {
            window.addEventListener("keydown", e => {
                if(e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 39) {
                    nextPanel();
                } else if (e.keyCode == 37) {
                    previousPanel();
                }
            })
        }
        window.addEventListener("click" , e => {
            nextPanel();
        })

        // call the onInitialized event
        emit(WebcomicEvents.initialized);
    }

    // events
    export enum WebcomicEvents {
        initialized,
        nextPanel,
        nextPage
    }
    let events: Map<WebcomicEvents, CallableFunction[]> = new Map<WebcomicEvents, CallableFunction[]>([
    ])
    export function on (event: WebcomicEvents | string, callbackFn: CallableFunction) {
        let e: WebcomicEvents;
        if (typeof event == "string") {
            e = WebcomicEvents[event];
        } else {
            e = event;
        }
        if(events.get(e)) {
            events.get(e).push(callbackFn);
        } else {
            events.set(e, [callbackFn])
        }
    }
    export function emit (event: WebcomicEvents, ...args) {
        if (!events.get(event)) return;
        events.get(event).forEach(e => {
                try {
                    e(...args);
                } catch (e) {
                    console.error(e.message);
                }
        })        
    }

    // initialize a panel (prepare animations)
    function initPanel (panel: HTMLElement) {
        const order: number = parseInt(panel.getAttribute("data-order"));
        if(panel.hasAttribute("data-intro")) {
            panel.classList.add(panel.getAttribute("data-intro") + "-before");
            void panel.offsetWidth;
            if( order) {
                intros.splice(order, 0, panel);
            } else {
                intros.push(panel);
            }
        };
        if(panel.hasAttribute("data-outro")) {
            outros.push(panel);
        };
    }

    // transition to the next panel
    let intros = new Array(),
    outros = new Array(),
    cursor = 0;
    function nextPanel () {

        webcomic.emit(WebcomicEvents.nextPanel);

        if ( cursor >= intros.length) {
            if (options.playOutro == PlayOutroOptions.onPageEnd) {
                outros.forEach(o => {
                    animateOut(o);
                })
            }
            if (options.cycle) {
                reset();
            };
            webcomic.emit(WebcomicEvents.nextPage);
            return;
        };

        if(webcomic.options.playOutro == PlayOutroOptions.onNextPanel && cursor > 0) {
            animateOut(outros[cursor - 1]);
        }

        animateIn(intros[cursor]);
        cursor++;
    }

    // transition to the previous panel
    function previousPanel () {
        if (cursor == 0) return;

        animateOut(outros[cursor - 1]);

        if (cursor > 1)
            animateIn(intros[cursor - 2]);

        cursor--;
    }

    // reset all animations
    function reset() {
        intros= new Array();
        outros = new Array();
        cursor = 0;

        panels.forEach(panel  => {
            animTimeHandlers.forEach(h => {
                setTimeout(h, 0);
            })
            initPanel(panel);
            panel.classList.remove(panel.getAttribute("data-intro") + "-after");
            panel.classList.remove(panel.getAttribute("data-outro") + "-after");
        });
    }
    
    let animTimeHandlers = new Array();
    // play the animation on the target element (optional duration in milliseconds)
    function playAnimation (animation: string, target: HTMLElement, duration: number = 500) {

        target.classList.remove(animation + "-before");
        target.classList.add(animation);

        target.style.animationDuration = duration + "ms";

        void target.offsetWidth;

        animTimeHandlers.push(setTimeout(() => {
            target.classList.remove(animation);
            target.classList.add(animation + "-after");
            void target.offsetWidth;
        }, duration))
    }

    // animate in
    function animateIn (target: HTMLElement) {
        const intro: string = target.getAttribute("data-intro"),
        outro: string = target.getAttribute("data-outro");

        if (target.hasAttribute("data-outro"))
            target.classList.remove(target.getAttribute("data-outro") + "-after");
        playAnimation(intro, target);
    }

    // animate out
    function animateOut (target: HTMLElement) {
        const outro: string = target.getAttribute("data-outro");

        if (target.hasAttribute("data-intro"))
            target.classList.remove(target.getAttribute("data-intro") + "-after");
        playAnimation(outro, target);
    }

    // helper function to convert css duration strings to milliseconds
    function cssDurationToMS (val: string): number {
        if (val == "") return 0;
        else if (val.includes("ms")) return parseFloat(val.replace("ms", ""));
        else return parseFloat(val.replace("s", "")) * 1000;
    }

    // run the init funtion when the page loaded
    window.addEventListener("load", e => {
        webcomic.init();
    })
}
