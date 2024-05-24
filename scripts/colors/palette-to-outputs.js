import Color from "color";

const range = (n) => [...Array(n).keys()];

/*
PALETTE STYLE EXAMPLE:

    --ion-color-primary: #428cff;
    --ion-color-primary-rgb: 66, 140, 255;
    --ion-color-primary-contrast: #ffffff;
    --ion-color-primary-contrast-rgb: 255, 255, 255;
    --ion-color-primary-shade: #3a7be0;
    --ion-color-primary-tint: #5598ff;
*/

/**
 * Function to generate styles given a palette list of Color items.
 * @param {Array<Color>} palette An array of Colors defining a palette.
 * @returns A string of palette styles.
 */
const paletteToStyles = (palette) => range(palette.length).reduce((acc, paletteIdx) => {
    const paletteElement = palette[paletteIdx];
    const hex = paletteElement.hex();
    const rgb = paletteElement.rgb().array().map(Math.round).join(", ");
    const isLight = paletteElement.isLight() ? true : false;
    const contrastHex = isLight ? '#000000' : '#ffffff';
    const contrastRGB = Color(contrastHex).rgb().array().map(Math.round).join(", ");
    const shadeHex = paletteElement.darken(0.1).hex();
    const tintHex = paletteElement.lighten(0.1).hex();
    const obj = {hex, rgb, contrastHex, contrastRGB, shadeHex, tintHex, paletteElement};
    console.log(obj);
    const styleName = `paletteschemecolor${paletteIdx+1}`;
    acc+=`/** ${styleName} **/
--ion-color-${styleName}: ${hex};
--ion-color-${styleName}-rgb: ${rgb};
--ion-color-${styleName}-contrast: ${contrastHex};
--ion-color-${styleName}-contrast-rgb: ${contrastRGB};
--ion-color-${styleName}-shade: ${shadeHex};
--ion-color-${styleName}-tint: ${tintHex};\n\n`;
    return acc;
}, "");

/*
PALETTE CLASS EXAMPLE:

.ion-color-alarm {
    --ion-color-base: var(--ion-color-alarm);
    --ion-color-base-rgb: var(--ion-color-alarm-rgb);
    --ion-color-contrast: var(--ion-color-alarm-contrast);
    --ion-color-contrast-rgb: var(--ion-color-alarm-contrast-rgb);
    --ion-color-shade: var(--ion-color-alarm-shade);
    --ion-color-tint: var(--ion-color-alarm-tint);
}
*/

/**
 * Function to generate style classes given a palette list of Color items.
 * @param {Array<Color>} palette An array of Colors defining a palette.
 * @returns A string of palette style classes.
 */
const paletteToClasses = (palette) => range(palette.length).reduce((acc, paletteIdx) => {
    const name = `paletteschemecolor${paletteIdx+1}`;
    acc += `.ion-color-${name} {
        --ion-color-base: var(--ion-color-${name});
        --ion-color-base-rgb: var(--ion-color-${name}-rgb);
        --ion-color-contrast: var(--ion-color-${name}-contrast);
        --ion-color-contrast-rgb: var(--ion-color-${name}-contrast-rgb);
        --ion-color-shade: var(--ion-color-${name}-shade);
        --ion-color-tint: var(--ion-color-${name}-tint);
    }\n`
    return acc;
}, "");

/**
 * A function to generate a CSS variables file given a palette of Colors.
 * @param {Array<Color>} palette An array of Colors defining a palette.
 * @returns A string representing a CSS variables file defining the color palette styles.
 */
const getPaletteCssVariablesFileStr = (palette) => {
    const stylesStr = paletteToStyles(palette);
    const classesStr = paletteToClasses(palette);
    const lines = stylesStr.split("\n");
    const lines2indent = lines.map(line => "  " + line).join("\n");
    const lines4indent = lines.map(line => "    " + line).join("\n");
    return `:root {\n${lines2indent}\n};

@media (prefers-color-scheme: dark) {
  body {\n${lines4indent}\n  }
}
` + classesStr;
}

/*
PALETTE SVG SPINNER GENERATOR

so we want n circles of radius s_r around the inner circle of radius c_r
c_r = 10
s_r = 5
viewbox 0->100 0->100
center = (50,50) = (cx,cy)

create n circles in the center
<circle cx="cx" cy="cy" r="s_r" />

translate(<x> [<y>]) the around the clock
we need to know x and y displacements for each n points

[(dx1,dy1),(dx2,dy2),....(dxn,dyn)]
for angles
[0, 360/n, 360*(2/n)]
say n = 7
[0, 51.428571429, 102.857142858, 154.28571426, 205.71428568, 257.1428571, 308.57142852]
[0, 1           , 2            , 3,          , 4           , 5          ,6            ] (i)*(360/n)

so these are the angles but what are the displacements?
we want to move from (cx, cy) to (cx+c_r*cos(angle_s),cy+c_r*sin(angle_s))
c->c_s = c_s-c
so the displacement should be for each
(cx+c_r*cos(angle_s),cy+c_r*sin(angle_s)) - (cx, cy) = (c_r*cos(angle_s),c_r*sin(angle_s))
*/

/**
 * Function to generate a simple SVG spinner given a palette of colors and some parameters defining the size and inner / outer radius.
 * The spinner will rotate and change size from the inner to outer radius in a loop.
 * @param {Array<Color>} palette An array of Colors defining a palette.
 * @param {Array<number>} viewBoxSize An array of size two defining the horizontal and vertical height of the svg spinner.
 * @param {number} miniCircleRadius The minimum size of the spinner.
 * @param {number} innerRadiusSize The maximum size of the spinner.
 * @returns A string representing the SVG spinner.
 */
const getPaletteSpinnerSVG = (palette = [], viewBoxSize = [50, 50], miniCircleRadius = 2.5, innerRadiusSize=13) => {
    const midpoint = [parseInt(viewBoxSize[0]/2),parseInt(viewBoxSize[1]/2)]; // [25,25]
    const angles = range(palette.length).map((n)=>(n)*((2*Math.PI)/palette.length)); // radians
    const displacements_from_midpoint = angles.map((angle_s)=>[innerRadiusSize*Math.cos(angle_s), innerRadiusSize*Math.sin(angle_s)]);

    const circles = range(palette.length).map(idx => {
        const disp = displacements_from_midpoint[idx];
        const colorHex = palette[idx].hex();
        return `        <circle cx="${disp[0]}" cy="${disp[1]}" r="${miniCircleRadius}" fill="${colorHex}"></circle>`
    }).join("\n");

    return `<svg viewBox="-${midpoint[0]} -${midpoint[1]} ${viewBoxSize[0]} ${viewBoxSize[1]}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="200px" height="200px">
    <g>
${circles}
        <animateTransform attributeType="xml" attributeName="transform" type="scale" dur="1.5s" repeatCount="indefinite" values="1;1.2;1" calcMode="paced" />
        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="5.0s" additive="sum" repeatCount="indefinite" />
    </g>
</svg>`
}

/*
PALETTE TEST PAGE GENERATOR
*/

/**
 * Function to create a simple test page in order to view the generate palette color scheme and the SVG spinner based on the palette.
 * @param {Array<Color>} palette 
 * @returns A string representing a html test file.
 */
const getPaletteTestPageStr = (palette = []) => {
    const svg = getPaletteSpinnerSVG(palette);
    const style = '<style>.block{width:100px; height: 100px; display:block;}</style>';
    const blocks = palette.map(colorHex => `<div class="block" style="background-color:${colorHex.hex()}"></div>`);
    return `${style}\n${blocks.join('\n')}\n${svg}`
}

export { getPaletteTestPageStr, getPaletteCssVariablesFileStr, getPaletteSpinnerSVG }