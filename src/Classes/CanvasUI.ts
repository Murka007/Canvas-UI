import { IDimensions, IPosition } from "../types"
import Container from "./Container"

class CanvasUI {
    readonly canvas: HTMLCanvasElement
    readonly ctx: CanvasRenderingContext2D

    private readonly containers: Container[]
    dimensions: Readonly<IDimensions>

    private readonly viewbox: {
        readonly width: number
        readonly height: number
    }

    private readonly mouse: {
        x: number
        y: number
    }

    private readonly mousedownContainers: Container[]

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.containers = [];
        this.dimensions = {};

        this.viewbox = {
            width: 1920,
            height: 1080
        };

        this.mouse = {
            x: 0,
            y: 0
        };

        this.mousedownContainers = [];
        this.load();
    }

    private load(): void {
        window.addEventListener("resize", () => this.resize());
        window.addEventListener("orientationchange", () => this.resize());
        this.resize();

        this.canvas.addEventListener("mousemove", (event) => this.movemouse(event));
        this.canvas.addEventListener("mousedown", (event) => this.mousedown(event));
        this.canvas.addEventListener("mouseup", (event) => this.mouseup(event));

        // Mobile support
        this.canvas.addEventListener("touchstart", (event) => this.mousedown(event));
        this.canvas.addEventListener("touchend", (event) => this.mouseup(event));
        this.canvas.addEventListener("touchcancel", (event) => this.mouseup(event));
    }

    /**
     * Use it to create parent containers, that will hold other children
     * @param container - Parent container that holds all chidren
     */
    add(container: Container): void {
        this.containers.push(container);
        this.addListeners(container);
        this.resize();
    }

    /**
     * Remove the unnecessary container
     */
    remove(container: Container): void {
        const lists = [container.parent.containers, this.mousedownContainers];

        for (const list of lists) {
            const index = list.indexOf(container);
            list.splice(index, 1);
        }
        this.resize();
    }

    addListeners(container: Container): void {
        if (container.mousedown) this.mousedownContainers.push(container);
    }

    private canvasDimensions(): IDimensions {

        // Original width and height
        const initialWidth = window.innerWidth;
        const initialHeight = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        const canvasWidth = initialWidth * dpr;
        const canvasHeight = initialHeight * dpr;
        const scale = Math.max(canvasWidth / this.viewbox.width, canvasHeight / this.viewbox.height);

        // Main width and height, used to calculate position of the containers 
        const width = canvasWidth / scale;
        const height = canvasHeight / scale;
        const scaleOffset = dpr / scale;
        this.dimensions = {
            initialWidth: initialWidth,
            initialHeight: initialHeight,
            dpr: dpr,

            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,

            scale: scale,
            width: width,
            height: height,
            scaleOffset: scaleOffset
        };
        return this.dimensions;
    }

    private calculateBox(parent: Container): void {
        const styles = parent.styles;
        const isHor = styles.align !== "vertical" || !styles.align;
        const isVert = styles.align === "vertical";

        for (const current of parent.containers) {
            if (isHor) {
                parent.width += current.width;
            } else if (current.width > parent.width) {
                parent.width = current.width;
            }

            if (isVert) {
                parent.height += current.height;
            } else if (current.height > parent.height) {
                parent.height = current.height;
            }
        }
    }

    private calculatePosition(parent: Container): void {
        const position = parent.styles.position;
        const { width, height } = this.dimensions;

        const horizontal = position.horizontal.align;
        const includeHor = position.horizontal.includeBox;

        switch (horizontal) {
            case "left":
                parent.x1 = 0;
                break;
            case "middle":
                parent.x1 = width / 2 - (includeHor ? parent.width / 2 : 0);
                break;
            case "right":
                parent.x1 = width - (includeHor ? parent.width : 0);
                break;
            default:
                parent.x1 = 0;
        }


        const vertical = position.vertical.align;
        const includeVert = position.vertical.includeBox;

        switch (vertical) {
            case "top":
                parent.y1 = 0;
                break;
            case "middle":
                parent.y1 = height / 2 - (includeVert ? parent.height / 2 : 0);
                break;
            case "bottom":
                parent.y1 = height - (includeVert ? parent.height : 0);
                break;
            default:
                parent.y1 = 0;
        }
    }

    private calculateAlignment(parent: Container): void {
        const styles = parent.styles;
        const isHor = styles.align !== "vertical" || !styles.align;
        const isVert = styles.align === "vertical";

        for (let i=0;i<parent.containers.length;i++) {
            const previous = parent.containers[i - 1];
            const current = parent.containers[i];

            if (i === 0) {
                this.calculatePosition(parent);

                // Position of the first child must match the position of it's parent
                current.x1 = parent.x1;
                current.y1 = parent.y1;
            }

            // Make sure container is right after previous container
            if (previous) {
                current.x1 = previous.x2;
                current.y1 = previous.y2;
            }

            // Horizontal and vertical alignment, horizontal by default
            current.x2 = current.x1 + (isHor ? current.width : 0);
            current.y2 = current.y1 + (isVert ? current.height : 0);
        }
    }

    private updatePosition(containers: Container[]): void {

        for (const parent of containers) {

            // Recursively go through all containers
            if (parent.containers.length) {
                this.updatePosition(parent.containers);
            }

            // Make sure to reset width and height of the container
            parent.width = parent.initial.width;
            parent.height = parent.initial.height;

            this.calculateBox(parent);
            this.calculateAlignment(parent);
        }
    }

    /**
     * Use it to handle canvas resizing, put it in the callback
     * ```
     * window.addEventListener("resize", () => UI.resize());
     * ```
     */
    resize(): void {
        const { canvasWidth, canvasHeight, initialWidth, initialHeight, scale } = this.canvasDimensions();
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.canvas.style.width = initialWidth + "px";
        this.canvas.style.height = initialHeight  + "px";
        this.ctx.scale(scale, scale);

        this.updatePosition(this.containers);
    }

    /**
     * Checks whether the mouse cursor is in the container
     * @param container
     * @param position Current mouse position from fired event
     */
    overlaps(container: Container, position?: IPosition): boolean {

        const { x, y } = (position || this.mouse);
        const { x1, y1, x2, y2 } = container.position;

        if (x < x1 || y < y1 || y > y2 || x > x2) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param event - MouseEvent from callback
     * @returns Current mouse position to match the bounds of canvas
     */
    private mousePosition(event: MouseEvent | Touch): IPosition {
        const bounds = this.canvas.getBoundingClientRect();
        const { dpr, scale, scaleOffset } = this.dimensions;
        const x = event.pageX - bounds.left - window.scrollX;
        const y = event.pageY - bounds.top - window.scrollY;
        return {
            x: Math.floor(x / scale * dpr + scaleOffset),
            y: Math.floor(y / scale * dpr + scaleOffset)
        }
    }

    private getContainer(containers: Container[], position: IPosition): Container {

        // loop from the end, because we want to get the last layer of containers
        for (let i=containers.length;i--;) {
            const container = containers[i];
            if (this.overlaps(container, position)) {
                return container;
            }
        }
        return null;
    }

    /**
     * Use it to handle mouse movements on the canvas, put it in the callback
     * ```
     * window.addEventListener("mousemove", (event) => UI.mousemove(event));
     * ```
     * @param {MouseEvent} event - MouseEvent from callback
     */
    private movemouse(event: MouseEvent): void {
        const { x, y } = this.mousePosition(event);
        this.mouse.x = x;
        this.mouse.y = y;
    }

    private handleMousedown(target: MouseEvent | Touch): void {
        const position = this.mousePosition(target);
        const container = this.getContainer(this.mousedownContainers, position);
        if (!container) return;
        container.holding = true;

        if (target instanceof Touch) {
            container.touchIdentifier = target.identifier;
        }
        if (container.mousedown.remove) this.remove(container);
        const callback = container.mousedown.callback;
        if (typeof callback === "function") callback(container);
    }

    private handleClick(target: MouseEvent | Touch, container: Container): void {
        if (!(container.click && container.holding)) return;

        const position = this.mousePosition(target);
        if (!this.overlaps(container, position)) return;

        container.clicked = !container.clicked;
        if (container.click.remove) this.remove(container);
        const callback = container.click.callback;
        if (typeof callback === "function") callback(container);
    }

    /**
     * Handle mousedown events
     */
    private mousedown(event: MouseEvent | TouchEvent): void {
        if (event instanceof MouseEvent) {
            this.handleMousedown(event);
        } else if (event instanceof TouchEvent) {
            for (const touch of event.changedTouches) {
                this.handleMousedown(touch);
            }
        }
    }

    /**
     * Handle onclick events and remove onmousedown events
     */
    private mouseup(event: MouseEvent | TouchEvent): void {
        for (const container of this.mousedownContainers) {
            if (event instanceof TouchEvent) {
                for (const touch of event.changedTouches) {
                    if (container.touchIdentifier === touch.identifier || typeof touch.identifier !== "number") {
                        this.handleClick(touch, container);
                        container.holding = false;
                    }
                }
            } else {
                this.handleClick(event, container);
                container.holding = false;
            }
        }
    }

    /**
     * The first rendering method, call it in the rendering loop
     */
    render(): void {
        this.canvas.style.cursor = "";
        for (const container of this.containers) {
            container.render();
        }
    }
}
export default CanvasUI;