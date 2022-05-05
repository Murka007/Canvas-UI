# Canvas-UI-TS
> Typescript library that allows to build user interfaces on canvas

### Install

You can install [npm](https://www.npmjs.com/package/canvas-ui-ts) package using:

    npm install canvas-ui-ts
    
### Usage
```ts
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const UI = new CanvasUI(canvas);

const parent = new Container({
    offsetY: -15,
    styles: {
        align: "horizontal",
        position: {
            horizontal: {
                align: "middle",
                includeBox: true
            },
            vertical: {
                align: "bottom",
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
            margin: 20,
            fill: "#4fb9ff",
            strokeWidth: 10,
            stroke: "#3c99d6",
        },

        hover: {
            styles: {
                cursor: "pointer",
                fill: "#4daceb",
                stroke: "#3587bd"
            }
        },

        mousedown: {
            styles: {
                cursor: "pointer",
                strokeWidth: 20,
                darken: 0.1
            }
        },

        click: {
            callback(container) {
                console.log("Clicked on", container);
            }
        }
    })
}

// Add parent to the UI first
UI.add(parent);

// Then add children to the parent
parent.add(generateContainer());
parent.add(generateContainer());

function loop(): void {
    window.requestAnimationFrame(loop);

    const { scale } = UI.dimensions;
    UI.ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
    UI.render();
}
window.requestAnimationFrame(loop);
```
