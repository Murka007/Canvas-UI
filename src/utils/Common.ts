import { IMerge } from "../types";

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// export function shade(color: string, amt: number): string {
//     const hash: string = /^#/.test(color) ? "#" : "";
//     const num = parseInt(color.slice(-6), 16);
//     const r = clamp((num >> 16) + amt, 0, 255);
//     const b = clamp(((num >> 8) & 0x00FF) + amt, 0, 255);
//     const g = clamp((num & 0x0000FF) + amt, 0, 255);
//     return hash + (g | (b << 8) | (r << 16)).toString(16);
// }

export function merge(target: IMerge = {}, source: IMerge = {}): IMerge {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object) {
            Object.assign(source[key], merge(target[key], source[key]));
        }
    }
    Object.assign(target, source);
    return target;
}

export function deepCopy(target: IMerge = {}): IMerge {
    try {
        return JSON.parse(JSON.stringify(target));
    } catch(e) {
        return {};
    }
}

function getFontHeight(font: string): number {
    const match: string = font.match(/\d+/g)[0] || "0";
    return parseInt(match) * 0.7 || 0; 
}

export function textMetrics(ctx: CanvasRenderingContext2D, text: string): { width: number, height: number } {
    return {
        width: ctx.measureText(text).width,
        height: getFontHeight(ctx.font)
    }
}