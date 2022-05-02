import { IMerge } from "../types";

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

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

export function isNumber(value: any): boolean {
    return typeof value === "number";
}

export function isFunction(value: any): boolean {
    return typeof value === "function";
}