export type ScaleParams = {
    viMin: number;
    viMax: number;
    baseMin: number;
    baseMax: number;
    rMin: number;
    rMax: number;
    precision: number;
};

/**
 * Calculates the minimum size for a given step in a scale.
 *
 * @param step - The step in the scale for which to calculate the minimum size.
 * @param p - The scale parameters, including `baseMin` (base minimum size) and `rMin` (minimum ratio).
 * @returns The calculated minimum size for the specified step.
 */
export function sizeMin(step: number, p: ScaleParams) {
    return p.baseMin * Math.pow(p.rMin, step);
}

/**
 * Calculates the maximum size for a given step in a scale using exponential growth.
 *
 * @param step - The current step in the scale.
 * @param p - An object containing scale parameters:
 *   - baseMax: The base maximum value.
 *   - rMax: The ratio used for exponential scaling.
 * @returns The calculated maximum size for the given step.
 */
export function sizeMax(step: number, p: ScaleParams) {
    return p.baseMax * Math.pow(p.rMax, step);
}

/**
 * Calculates linear interpolation parameters for a given step and scale parameters.
 *
 * Computes the minimum and maximum values for the step using `sizeMin` and `sizeMax`,
 * then calculates the slope (`m`) and intercept (`b`) for a linear equation that maps
 * a value in the range `[p.viMin, p.viMax]` to `[min, max]`.
 *
 * @param step - The step index or value for which to calculate the parameters.
 * @param p - The scale parameters containing `viMin` and `viMax` properties.
 * @returns An object containing:
 *   - `min`: The minimum value for the step.
 *   - `max`: The maximum value for the step.
 *   - `m`: The slope of the linear equation.
 *   - `b`: The intercept of the linear equation.
 */
export function line(step: number, p: ScaleParams) {
    const min = sizeMin(step, p);
    const max = sizeMax(step, p);
    const m = (max - min) / (p.viMax - p.viMin);
    const b = min - m * p.viMin;
    return { min, max, m, b };
}

/**
 * Formats a number using fixed-point notation with the specified precision.
 *
 * @param n - The number to format.
 * @param precision - The number of digits to appear after the decimal point.
 * @returns The formatted number as a string.
 */
export function fmt(n: number, precision: number) {
    return n.toFixed(precision);
}

/**
 * Generates a CSS `clamp()` string for fluid sizing based on the provided step and scale parameters.
 *
 * The function calculates the minimum, maximum, slope (`m`), and intercept (`b`) values using the `line` function,
 * then formats them to the specified precision. It returns a string in the format:
 * `clamp(min px, m vi + b px, max px)`.
 *
 * @param step - The step value used to calculate the fluid scale.
 * @param p - The scale parameters, including min, max, precision, and other properties required by the `line` function.
 * @returns A string representing a CSS `clamp()` expression for fluid sizing.
 */
export function clampString(step: number, p: ScaleParams) {
    const { min, max, m, b } = line(step, p);
    const mStr = Number(m.toFixed(Math.max(p.precision, 2)));
    const bStr = Number(b.toFixed(p.precision));
    return `clamp(${fmt(min, p.precision)}px, ${mStr}vi + ${bStr}px, ${fmt(max, p.precision)}px)`;
}
