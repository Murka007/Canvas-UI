import { UI } from "..";
import { IEvent, IPosition, IStyles, IText, Renderer } from "../types";
import { deepCopy, merge, textMetrics } from "../utils/Common";

let id = 0;
class Container {
    readonly id: number
    readonly containers: Container[]
    readonly styles: IStyles
    oldStyles: IStyles

    offsetX: number
    offsetY: number
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

    hovering1: boolean
    holding1: boolean
    clicked1: boolean

    parent: Container

    readonly initial: {
        width: number
        height: number
    }

    touchIdentifier: number

    constructor(renderer: Renderer) {
        this.id = id++;
        this.containers = [];
        this.styles = {};

        this.offsetX = 0;
        this.offsetY = 0;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.width = 0;
        this.height = 0;

        this.hover = null;
        this.mousedown = null;
        this.click = null;

        Object.assign(this, renderer);

        this.hovering = false;
        this.holding = false;
        this.clicked = false;
        
        this.hovering1 = false;
        this.holding1 = false;
        this.clicked1 = false;

        this.parent = null;

        this.oldStyles = this.styles;

        this.initial = {
            width: this.width,
            height: this.height
        };

        this.touchIdentifier = null;
    }

    /**
     * Returns current position of the container
     */
    get position() {
        return {
            x1: this.x1,
            y1: this.y1,
            x2: this.x1 + this.width,
            y2: this.y1 + this.height,
            width: this.width,
            height: this.height
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

        // Check if state of one of the events has changed
        if (this.hovering1 !== this.hovering || this.holding1 !== this.holding || this.clicked1 !== this.clicked) {
            this.hovering1 = this.hovering;
            this.holding1 = this.holding;
            this.clicked1 = this.clicked;

            const styles: IStyles = deepCopy(this.styles);
            if (this.hover && this.hover.styles && this.hovering) merge(styles, deepCopy(this.hover.styles));
            if (this.mousedown && this.mousedown.styles && this.holding) merge(styles, deepCopy(this.mousedown.styles));
            if (this.click && this.click.styles && this.clicked) merge(styles, deepCopy(this.click.styles));
            this.oldStyles = styles;
        }
        return this.oldStyles;
    }

    textMode(content: string): string {
        if (content === "ID") return this.id.toString();
        return content;
    }

    /**
     * Returns current text position relative to the container
     */
    private textPosition(text: IText, content: string): IPosition {
        if (!text.position) return { x: this.position.x1, y: this.position.y1 };

        const { x1, y1, x2, y2, width, height } = this.position;
        const metrics = textMetrics(UI.ctx, content);
        const { horizontal, vertical } = text.position;
        const textPos: IPosition = {
            x: 0,
            y: 0
        };
        
        // Horizontal text alignment
        switch (horizontal) {
            case "left":
                textPos.x = x1
                break;
            case "middle":
                textPos.x = x1 + width / 2 - metrics.width / 2
                break;
            case "right":
                textPos.x = x2 - metrics.width
                break;
            default:
                textPos.x = x1;
        }

        // Vertical text alignment
        switch (vertical) {
            case "top":
                textPos.y = y1 + metrics.height
                break;
            case "middle":
                textPos.y = y1 + height / 2 + metrics.height / 2
                break;
            case "bottom":
                textPos.y = y2
                break;
            default:
                textPos.y = y1 + metrics.height
        }
        return textPos;
    }

    render(): void {

        this.hovering = UI.overlaps(this);

        if (this.hovering && this.hover && this.hover.remove) {
            UI.remove(this);
        }
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
            
            const content = this.textMode(styles.text.content);
            const { x, y } = this.textPosition(styles.text, content);
            UI.ctx.font = styles.text.font || "";
            if (styles.text.fill) {
                UI.ctx.fillStyle = styles.text.fill;
                UI.ctx.fillText(content, x, y);
            }

            if (styles.text.stroke) {
                UI.ctx.lineWidth = styles.text.strokeWidth || 1;
                UI.ctx.strokeStyle = styles.text.stroke;
                UI.ctx.strokeText(content, x, y);
            }
        }

        if ((this.hovering || this.holding) && styles.cursor === "pointer") {
            UI.canvas.style.cursor = "pointer";
        }

        for (const container of this.containers) {
            container.render();
        }
    }
}
export default Container;