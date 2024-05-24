import { saveFileStr } from "./fs.js";
import { get3HueGradientColorPallette } from "./hsl-palette-generator.js";
import { getPaletteTestPageStr, getPaletteCssVariablesFileStr, getPaletteSpinnerSVG } from "./palette-to-outputs.js";

/**
 * Function to generate a color palette for the website given 3 different hues a (start, middle and end hues), the saturation and a number of steps. Can be used to create a rainbow palette.
 * The function saves the generated palette styles to the /project-root/src/theme/colors.scss file and creates a svg spinner based on the palette and test file to view the outcome located in /project-root/src/theme/colors-test.html
 * @param {number} startHue The first color hue
 * @param {number} middleHue The middle color hue
 * @param {number} endHue The final color hue
 * @param {number} saturationl 
 * @param {number} lightness
 * @param {number} steps The number of steps from the start hue to the end hue for which to generate a color scheme.
 */
const generate3PointPalette = (startHue, middleHue, endHue, saturationl, lightness, steps) => {
    const palette = get3HueGradientColorPallette(startHue, middleHue, endHue, saturationl, lightness, steps).reverse();
    saveFileStr("src/theme/colors.scss", getPaletteCssVariablesFileStr(palette));
    saveFileStr("src/theme/colors-test.html", getPaletteTestPageStr(palette));
    saveFileStr("src/assets/animations/spinner-palette.svg", getPaletteSpinnerSVG(palette));
}

export { generate3PointPalette }