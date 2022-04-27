import CanvasUI from "./Classes/CanvasUI";
import Container from "./Classes/Container";
import "./styles/styles.css";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
export const UI = new CanvasUI(canvas);

const parent1 = new Container({
    styles: {
        align: "horizontal",
        strokeWidth: 5,
        stroke: "orange",
        position: {
            horizontal: {
                align: "middle",
                includeBox: true
            },
            vertical: {
                align: "middle",
                includeBox: true
            }
        }
    }
})

function generateContainer() {
    return new Container({
        width: 200,
        height: 200,
        styles: {
            fill: "#ff4086",
            stroke: "#000",
            marginRight: 50,
            marginBottom: 50,
            opacity: 0.1,

            text: {
                content: "ID",
                font: "bold 40px Arial",
                fill: "white",
                strokeWidth: 2,
                stroke: "#000",
        
                position: {
                    horizontal: "middle",
                    vertical: "middle"
                }
            }
        },
        hover: {
            styles: {
                cursor: "pointer"
            }
        },
        mousedown: {
            styles: {
                darken: 0.1,
                text: {
                    content: "ID",
                    fill: "red"
                }
            }
        },
        click: {
            remove: true,
            callback(container) {
                console.log(container);
            }
        }
    })
}

parent1.add(generateContainer());
parent1.add(generateContainer());
parent1.add(generateContainer());

document.oncontextmenu = function(e) {
    e.preventDefault();
}

window.addEventListener("mouseup", function(e) {
    if (e.button === 2) parent1.add(generateContainer());
})

// window.addEventListener("touchstart", function(e) {
//     parent1.add(generateContainer());
// })

UI.add(parent1);
console.log(UI);

function loop(): void {
    window.requestAnimationFrame(loop);

    const { scale } = UI.dimensions;
    UI.ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
    UI.render();
}
window.requestAnimationFrame(loop);