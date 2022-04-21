type BoxInclude = true | false

export interface IStyles {

    /**
     * The color that will be used to fill the container
     */
    fill?: string

    /**
     * The mode in which children inside parent element will be aligned
     */
    align?: "horizontal" | "vertical"

    /**
     * The color that will be used to draw a stroke of the container
     */
    stroke?: string
    strokeWidth?: number
    opacity?: number

    /**
     * Density of the black shape that will be drawn on top of container
     * 
     * Min value - 0
     * 
     * Max value - 1
     */
    darken?: number
    cursor?: "pointer"

    text?: {
        content: string
        font?: string
        fill?: string
        stroke?: string
    }

    /**
     * Configure in which position of the canvas containers will be displayed
     */
    position?: {

        /**
         * Horizontal alignment of the container
         */
        horizontal?: {
            align: "left" | "middle" | "right"

            /**
             * Position will start from the center of the container
             */
            includeBox: BoxInclude
        }

        /**
         * Vertical alignment of the container
         */
        vertical?: {
            align: "top" | "middle" | "bottom"

            /**
             * Position will start from the center of the container
             */
            includeBox: BoxInclude
        }
    }
}

export interface IEvent {
    /**
     * Styles that will be used on event
     */
    styles?: IStyles
    remove?: boolean
}

export interface Renderer {

    /**
     * The initial x position of the container, will be ignored if styles.position.horizontal property is added
     */
    x1?: number

    /**
     * The initial y position of the container, will be ignored if styles.position.vertical property is added
     */
    y1?: number

    /**
     * width of the container, ignored if container is parent
     */
    width?: number

    /**
     * height of the container, ignored if container is parent
     */
    height?: number

    /**
     * Default styles of the container
     */
    styles?: IStyles

    /**
     * Used to handle onhover event, you can add certain actions that will be applied when event is fired
     */
    hover?: IEvent

    /**
     * Used to handle onmousedown event, you can add certain actions that will be applied when event is fired
     */

    mousedown?: IEvent
    /**
     * Used to handle onclick event, you can add certain actions that will be applied when event is fired
     */
    click?: IEvent

    linkedWith?: () => object[]
}

export interface IDimensions {
    initialWidth?: number,
    initialHeight?: number,
    dpr?: number

    canvasWidth?: number
    canvasHeight?: number
    
    scale?: number
    width?: number
    height?: number

    /**
     * Used to fix inaccuracies at the high page zoom
     */
    scaleOffset?: number
}

export type IPosition = { x: number, y: number }