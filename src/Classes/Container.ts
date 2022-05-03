import { IEvent, IPosition, IStyles, IText, Renderer } from "../types";
import { deepCopy, isNumber, merge, textMetrics } from "../utils/Common";
import CanvasUI from "./CanvasUI";
import State from "./State";

let id = 0;

/**
 * Used to manipulate with the container, render it and calculate position
 * @class Container
 */
class Container {
    readonly id: number
    readonly containers: Container[]
    readonly styles: IStyles
    mergedStyles: IStyles
    init: CanvasUI

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

    hovering: State
    holding: State
    clicked: State

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
        this.init = null;

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

        this.hovering = new State(false);
        this.holding = new State(false);
        this.clicked = new State(false);

        this.parent = null;

        this.mergedStyles = this.styles;

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
     * Adds a new container to the array
     */
    add(container: Container): void {
        container.parent = this;
        container.init = this.init;
        
        this.containers.push(container);
        this.init.addListeners(container);
        this.init.resize();
    }

    /**
     * Fills the container with certain color
     */
    private fill(color: string): void {
        this.init.ctx.fillStyle = color;
        this.init.ctx.fillRect(this.x1, this.y1, this.width, this.height);
    }

    /**
     * @returns Scaling factor of the image based on given options 
     */
    getImageScale(): IPosition {
        const image = this.mergedStyles.image;
        const img = this.init.image(image);
        const scale: IPosition = {
            x: 1,
            y: 1
        };

        if (image.scale) {
            const { x, y } = image.scale;
            scale.x *= x;
            scale.y *= y;
        }

        if (image.scaleTo) {
            const { width, height } = image.scaleTo;
            scale.x = width / img.width;
            scale.y = height / img.height;
        }

        return scale;
    }
    
    /**
     * Draws a given image in initial position
     */
    private drawImage(img: HTMLImageElement): void {
        const { x, y } = this.getImageScale();
        this.init.ctx.save();
        this.init.ctx.scale(x, y);
        this.init.ctx.drawImage(img, this.x1 / x, this.y1 / y);
        this.init.ctx.restore();
    }

    /**
     * Draws a stroke of the container
     * @param {string} color - Color of the stroke 
     * @param strokeWidth - Width of the stroke, default width is 1
     */
    private stroke(color: string, strokeWidth: number = 1): void {
        const x = this.x1 + strokeWidth / 2;
        const y = this.y1 + strokeWidth / 2;
        const w = this.width - strokeWidth;
        const h = this.height - strokeWidth;
        this.init.ctx.strokeStyle = color;
        this.init.ctx.lineWidth = strokeWidth;
        this.init.ctx.strokeRect(x, y, w, h);
    }

    /**
     * Combines all styles together, some styles have priority over others
     */
    private createStyles(): IStyles {

        // Check if state of one of the events has changed
        if (this.hovering.updated || this.holding.updated || this.clicked.updated) {
            const styles: IStyles = deepCopy(this.styles);

            const hover = this.hover && this.hover.styles;
            const mousedown = this.mousedown && this.mousedown.styles;
            const click = this.click && this.click.styles;

            if (this.hovering.current && hover) merge(styles, deepCopy(hover));
            if (this.holding.current && mousedown) merge(styles, deepCopy(mousedown));
            if (this.clicked.current && click) merge(styles, deepCopy(click));
            this.mergedStyles = styles;

            // Automatically resize when state changes
            this.init.resize();
        }
        return this.mergedStyles;
    }

    textMode(content: string): string {
        if (content === "ID") return this.id.toString();
        return content;
    }

    /**
     * @returns Current text position relative to the container
     */
    private textPosition(text: IText, content: string): IPosition {
        if (!text.position) return { x: this.position.x1, y: this.position.y1 };

        const { x1, y1, x2, y2, width, height } = this.position;
        const metrics = textMetrics(this.init.ctx, content);
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

    /**
     * Used to render current container, all added styles will be applied
     */
    render(): void {
        this.hovering.update(this.hover && this.init.overlaps(this));

        if (this.hovering.current && this.hover.remove) {
            this.init.remove(this);
        }
        const styles = this.createStyles();

        this.init.ctx.save();
        if (isNumber(styles.opacity)) {
            this.init.ctx.globalAlpha = styles.opacity;
        }

        if (styles.fill) this.fill(styles.fill);

        if (styles.image) {
            const img = this.init.image(styles.image);
            this.drawImage(img);
        }

        if (styles.stroke) this.stroke(styles.stroke, styles.strokeWidth);

        if (styles.darken) {
            this.init.ctx.globalAlpha = styles.darken;
            this.fill("black");
        }
        this.init.ctx.restore();

        if (styles.text && styles.text.content) {
            
            const content = this.textMode(styles.text.content);
            const { x, y } = this.textPosition(styles.text, content);
            this.init.ctx.font = styles.text.font || "";
            if (styles.text.fill) {
                this.init.ctx.fillStyle = styles.text.fill;
                this.init.ctx.fillText(content, x, y);
            }

            if (styles.text.stroke) {
                this.init.ctx.lineWidth = styles.text.strokeWidth || 1;
                this.init.ctx.strokeStyle = styles.text.stroke;
                this.init.ctx.strokeText(content, x, y);
            }
        }

        if ((this.hovering.current || this.holding.current) && styles.cursor === "pointer") {
            this.init.canvas.style.cursor = "pointer";
        }

        // Recursively render all containers
        for (const container of this.containers) {
            container.render();
        }
    }
}
export default Container;