import CanvasUI from "./Classes/CanvasUI";
import Container from "./Classes/Container";
import "./styles/styles.css";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
export const UI = new CanvasUI(canvas);
const upgradeList: object[] = [];

const parent1 = new Container({
    linkedWith: () => upgradeList,
    styles: {
        align: "horizontal",
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

// const container1 = new Container({
//     width: 200,
//     height: 200,
//     styles: {
//         fill: "#ff7640",
//     },
//     hover: {
//         styles: {
//             cursor: "pointer"
//         }
//     },
//     mousedown: {
//         styles: {
//             darken: 0.1
//         }
//     }
// })

// const container2 = new Container({
//     width: 200,
//     height: 200,
//     styles: {
//         fill: "#40b6ff",
//     },
//     hover: {
//         styles: {
//             cursor: "pointer"
//         }
//     },
//     mousedown: {
//         styles: {
//             darken: 0.1
//         }
//     }
// })

// const container3 = new Container({
//     width: 200,
//     height: 200,
//     styles: {
//         fill: "#ff4086",
//     },
//     hover: {
//         // styles: {
//         //     cursor: "pointer"
//         // }
//     },
//     mousedown: {
//         // styles: {
//         //     darken: 0.1
//         // }
//     }
// })

// parent1.add(container1);
// parent1.add(container2);
// parent1.add(container3);

function generateContainer() {
    return new Container({
        width: 200,
        height: 200,
        styles: {
            fill: "#ff4086",
            stroke: "#000",

            text: {
                content: "1",
                font: "bold 40px Arial",
                fill: "white",
                stroke: "#000"
            }
        },
        hover: {
            styles: {
                cursor: "pointer",

                text: {
                    content: "HOVERING"
                }
            }
        },
        click: {
            remove: true
        }
    })
}

parent1.add(generateContainer());

document.oncontextmenu = function(e) {
    e.preventDefault();
}
window.addEventListener("mouseup", function(e) {
    if (e.button === 2) parent1.add(generateContainer());
})

UI.add(parent1);
console.log(UI);

function loop(): void {
    window.requestAnimationFrame(loop);

    const { scale } = UI.dimensions;
    UI.ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
    UI.render();
}
window.requestAnimationFrame(loop);