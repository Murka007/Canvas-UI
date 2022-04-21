import { UI } from "..";
import { IEvent, IStyles, Renderer } from "../../types";
import { deepMerge } from "../utils/Common";

let id = 0;
class Container {
    readonly containers: Container[]
    readonly styles: IStyles

    x1: number
    y1: number
    x2: number
    y2: number
    width: number
    height: number

    readonly hover: IEvent
    readonly mousedown: IEvent
    readonly click: IEvent

    hovering: boolean
    holding: boolean
    clicked: boolean

    parent: Container

    readonly initial: {
        width: number
        height: number
    }

    readonly id: number

    constructor(renderer: Renderer) {
        this.id = id++;
        this.containers = [];
        this.styles = {};

        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.width = 0;
        this.height = 0;

        this.hover = null;
        this.mousedown = null;
        this.click = null;

        this.hovering = false;
        this.holding = false;
        this.clicked = false;

        this.parent = null;

        Object.assign(this, renderer);

        this.initial = {
            width: this.width,
            height: this.height
        };
    }

    /**
     * Returns current position of the container
     */
    get position() {
        return {
            x1: this.x1,
            y1: this.y1,
            x2: this.x1 + this.width,
            y2: this.y1 + this.height
        }
    }

    /**
     * Use it to add a new container
     * @param {Container} container - A parent or children that will be drawn 
     */
    add(container: Container): void {
        container.parent = this;
        
        this.containers.push(container);
        UI.addListeners(container);
        UI.resize();
    }

    /**
     * Fills the container with cirtain color
     * @param {string} color - A color of the fill color 
     */
    private fill(color: string): void {
        UI.ctx.fillStyle = color;
        UI.ctx.fillRect(this.x1, this.y1, this.width, this.height);
    }

    /**
     * Draws the stroke of the container
     * @param {string} color - Color of the stroke 
     * @param strokeWidth - Width of the stroke, default width is 1
     */
    private stroke(color: string, strokeWidth: number = 1): void {
        const x = this.x1 + strokeWidth / 2;
        const y = this.y1 + strokeWidth / 2;
        const w = this.width - strokeWidth;
        const h = this.height - strokeWidth;
        UI.ctx.strokeStyle = color;
        UI.ctx.lineWidth = strokeWidth;
        UI.ctx.strokeRect(x, y, w, h);
    }

    /**
     * Combines all styles together, some styles have priority over others
     */
    private createStyles(): IStyles {
        let styles = Object.assign({}, this.styles);
        if (this.hover && this.hover.styles && this.hovering) styles = deepMerge(styles, this.hover.styles);
        if (this.mousedown && this.mousedown.styles && this.holding) styles = deepMerge(styles, this.mousedown.styles);
        if (this.click && this.click.styles && this.clicked) styles = deepMerge(styles, this.click.styles);
        return styles;
        // let styles: IStyles = { ...this.styles };
        // if (this.hover && this.hover.styles && this.hovering) styles = { ...styles, ...this.hover.styles };
        // if (this.mousedown && this.mousedown.styles && this.holding) styles = { ...styles, ...this.mousedown.styles };
        // if (this.click && this.click.styles && this.clicked) styles = { ...styles, ...this.click.styles };
        // return styles;
    }

    render(): void {

        this.hovering = UI.overlaps(this);
        const styles = this.createStyles();

        UI.ctx.save();
        if (typeof styles.opacity === "number") {
            UI.ctx.globalAlpha = styles.opacity;
        }

        if (styles.fill) this.fill(styles.fill);
        if (styles.stroke) this.stroke(styles.stroke, styles.strokeWidth);

        if (styles.darken) {
            UI.ctx.globalAlpha = styles.darken;
            this.fill("black");
        }
        UI.ctx.restore();

        if (styles.text && styles.text.content) {
            const { x1, y1, x2, y2 } = this.position;
            UI.ctx.font = styles.text.font || "";
            if (styles.text.fill) {
                UI.ctx.fillStyle = styles.text.fill;
                UI.ctx.fillText(styles.text.content, x1, y1);
            }

            if (styles.text.stroke) {
                UI.ctx.strokeStyle = styles.text.stroke;
                UI.ctx.strokeText(styles.text.content, x1, y1);
            }
        }

        if (this.hovering && styles.cursor === "pointer") {
            UI.canvas.style.cursor = "pointer";
        }

        for (const container of this.containers) {
            container.render();
        }
    }
}
export default Container;