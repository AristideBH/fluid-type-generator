export type ScaleParams = {
    viMin: number;
    viMax: number;
    baseMin: number;
    baseMax: number;
    rMin: number;
    rMax: number;
    precision: number;
};

export function sizeMin(step: number, p: ScaleParams) {
    return p.baseMin * Math.pow(p.rMin, step);
}

export function sizeMax(step: number, p: ScaleParams) {
    return p.baseMax * Math.pow(p.rMax, step);
}

export function line(step: number, p: ScaleParams) {
    const min = sizeMin(step, p);
    const max = sizeMax(step, p);
    const m = (max - min) / (p.viMax - p.viMin);
    const b = min - m * p.viMin;
    return { min, max, m, b };
}

export function fmt(n: number, precision: number) {
    return n.toFixed(precision);
}

export function clampString(step: number, p: ScaleParams) {
    const { min, max, m, b } = line(step, p);
    const mStr = Number(m.toFixed(Math.max(p.precision, 2)));
    const bStr = Number(b.toFixed(p.precision));
    return `clamp(${fmt(min, p.precision)}px, ${mStr}vi + ${bStr}px, ${fmt(max, p.precision)}px)`;
}
