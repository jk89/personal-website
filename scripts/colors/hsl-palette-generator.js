import Color from "color";

const range = (n) => [...Array(n).keys()];

/**
  say want to get from 10 -> 240 hue in 10 steps

    (240 - 10)/10 = 230/10 = 23
    0, 23, 46, 69, 92, 115, 138, 161, 184, 207, 230
    so for each (i*23 + 10) (i*((end-start)/steps) + start)

  say want to get from 240 -> 10 hue in 10 steps

    (10-240)/10 = -230/10 = -23
    240, 217, 194, 171, 148, 125, 102, 79, 56, 33, 10
    so for each ((i*-23)+ 240) (i*(end-start/steps) + start)
    
*/

/**
 * Function to get a linear color gradient from a start to an end hue in a certain number of steps.
 * @param {number} startHue The beginning hue of the palette.
 * @param {number} endHue The end hue of the palette.
 * @param {number} saturationl The saturation of the palette colors.
 * @param {number} lightness The lightness of the palette colors.
 * @param {number} steps The number of steps from the startHue to the endHue, giving a palette of <steps> color elements.
 * @returns A list of Color objects of length steps.
 */
const getLinearGradientHueColorPalette = (startHue, endHue, saturationl, lightness, steps) => range(steps)
    .map((idx) => Color.hsl(((idx * (endHue - startHue) / (steps - 1)) + startHue), saturationl, lightness));

/**
 * 
 * @param {number} startHue The beginning hue of the palette.
 * @param {number} middleHue The middle hue.
 * @param {number} endHue The end hue of the palette.
 * @param {number} saturationl The saturation of the palette colors.
 * @param {number} lightness The lightness of the palette colors.
 * @param {number} steps The number of steps from the startHue to the endHue, giving a palette of <steps> color elements.
 * @returns A list of Color objects of length steps.
 */
const get3HueGradientColorPallette = (startHue, middleHue, endHue, saturationl, lightness, steps) => {
    const start = range(parseInt(steps / 2)).map((idx) => Color.hsl(((idx * (middleHue - startHue) / (steps - 1)) + startHue), saturationl, lightness));
    const end = range(parseInt((steps + 1) / 2)).map((idx) => Color.hsl((((idx) * (endHue - middleHue) / (steps)) + middleHue), saturationl, lightness));
    return start.concat(end);
}

export { getLinearGradientHueColorPalette,  get3HueGradientColorPallette }