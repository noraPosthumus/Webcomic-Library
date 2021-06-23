namespace webcomic {

    export enum Animations {
        FadeIn
    }

    export function initialize() {

        console.log("initialized");

        const webComicContainers : HTMLCollection = document.getElementsByClassName("webcomic");

        Array.prototype.forEach.call(webComicContainers, (webComicContainer  => {
            let panels : HTMLCollection = webComicContainer.children;
            panels = Array.prototype.filter.call(panels, (element) => 
                element.className.includes("panel")
            );

            document.body.addEventListener("click", () => {
                fadeIn(panels[2] as HTMLElement);
            })

            console.log(panels);
        }))


    }

    function fadeIn(e:HTMLElement) {
        e.style.animation="slide-left .5s ease-in-out";
        e.style.opacity="1";

    }

    window.onload = initialize;
}
