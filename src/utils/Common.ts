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

function isObject(item: object): boolean {
    return item && typeof item === "object" && !Array.isArray(item);
}

interface IObj {
    [key: string]: any
}
export function deepMerge(target: IObj, source: IObj): IObj {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, {
                        [key]: source[key]
                    });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, {
                    [key]: source[key]
                });
            }
        });
    }
    return output;
}

// const obj1 = {
//     width: 200,
//     height: 200,
//     styles: {
//         fill: "#fff",
//         stroke: "#000",
//         text: {
//             content: "1",
//             font: "bold 30px Arial",
//             fill: "red"
//         }
//     }
// };

// const obj2 = {
//     width: 400,
//     height: 400,
//     styles: {
//         fill: "blue",
//         stroke: "green",
//         text: {
//             content: "HOVERING",
//             font: "bold 50px Arial",
//             fill: "red"
//         }
//     }
// };

// function isObject(value) {
//     return value && typeof value === "object") && !Array.isArray(value);
// }

// function deepMerge(target, ...sources) {
//     const value = Object.assign({}, target);
//     for (const val of sources) {
//         if (isObject(val)) {
            
//         }
//     }
// }