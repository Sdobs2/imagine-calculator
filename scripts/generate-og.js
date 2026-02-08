/**
 * Generates a PNG Open Graph image from public/og.svg.
 * Run before web export so the image ships with the build.
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const SVG_PATH = path.join(__dirname, '..', 'public', 'og.svg');
const PNG_PATH = path.join(__dirname, '..', 'public', 'og.png');

if (!fs.existsSync(SVG_PATH)) {
  throw new Error('Missing public/og.svg. Unable to generate og.png.');
}

const svg = fs.readFileSync(SVG_PATH, 'utf8');
const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 1200,
  },
});

const pngData = resvg.render();
fs.writeFileSync(PNG_PATH, pngData.asPng());

console.log('Generated public/og.png');
