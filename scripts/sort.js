const path = require('path');
const Color = require('color');
const fs = require('fs');

const _colors = require('./colors.json');

const outputPath = path.resolve(__dirname, '../src/colors.json');

const colors = _colors.sort((a, b) => {
    const colorA = Color(a.hex),
        colorB = Color(b.hex);
    return colorB.hue() - colorA.hue() || colorB.saturationv() - colorA.saturationv();
});

fs.writeFileSync(outputPath, JSON.stringify(colors, null, 4));
