import Color from 'color';
import { Options } from './Interface';

const mixWhite = Color('#fff'),
    mixBlack = Color('#000');

const exponent = 0.4;
const mixWeight = 0.3;

const contrastValid = (textColor: string, backgroundColor: string) =>
    Color(textColor).contrast(Color(backgroundColor)) < 4.6;

const mix = (hex: string, asTextColor?: boolean) => {
    let contrastColor;
    const color = Color(hex);
    const isDark = color.isDark();
    contrastColor = isDark
        ? color.mix(mixWhite, mixWeight).lighten(exponent).hex()
        : color.mix(mixBlack, mixWeight).darken(exponent).hex();
    while (
        contrastValid(hex, contrastColor) &&
        contrastColor.toUpperCase() !== '#FFFFFF' &&
        contrastColor !== '#000000'
    ) {
        contrastColor = Color(contrastColor)[isDark ? 'lighten' : 'darken'](0.1).hex();
        console.log(contrastColor);
    }
    return asTextColor ? [hex, contrastColor] : [contrastColor, hex];
};

const negateColor = (c: number) => {
    return c > 127 ? c - 100 : c + 100;
};

const negate = (hex: string, asTextColor?: boolean) => {
    const color = Color(hex);

    const red = color.red(),
        green = color.green(),
        blue = color.blue();

    let type = 'blue';
    if (red >= green && red >= blue) {
        type = 'red';
    } else if (green >= red && green >= blue) {
        type = 'green';
    }
    // const negateArray = [255 - red, 255 - green, 255 - blue];
    // negateArray.forEach((c, i) => {
    //     if (c > 101 && c < 129) {
    //         negateArray[i] = c - 50;
    //     } else if (c > 128 && c < 156) {
    //         negateArray[i] = c + 50;
    //     }
    // });
    const negateArray = [negateColor(red), negateColor(green), negateColor(blue)];

    switch (type) {
        case 'red':
            negateArray[0] = red;
            break;
        case 'green':
            negateArray[1] = green;
            break;
        case 'blue':
        default:
            negateArray[2] = blue;
            break;
    }

    const contrastColor = Color.rgb(negateArray).hex();

    return asTextColor ? [hex, contrastColor] : [contrastColor, hex];
};

const blackWhite = (hex: string, asTextColor?: boolean) => {
    const color = Color(hex);
    const isDark = color.isDark();
    const contrastColor = isDark ? '#fffef8' : '#202124';

    return asTextColor ? [hex, contrastColor] : [contrastColor, hex];
};

const generatorMap = {
    mix,
    negate,
    blackWhite
};

export const getThemeColor = (hex: string, options: Options) => {
    const { colorAsTextColor, generateType } = options;
    const [textColor, backgroundColor] = generatorMap[generateType](hex, colorAsTextColor);
    const isDark = !Color(textColor).isDark();
    const lineColor = isDark
        ? Color(textColor).blacken(0.1).rgb().string()
        : Color(textColor).whiten(0.1).rgb().string();
    return {
        textColor: Color(textColor).fade(0.15).rgb().string(),
        textColorActive: textColor,
        textColorPrimary: textColor,
        textColorSecondary: Color(textColor).fade(0.3).rgb().string(),
        backgroundColor: (isDark ? Color(backgroundColor).blacken(0.1) : Color(backgroundColor).whiten(0.1))
            .rgb()
            .string(),
        backgroundColorActive: backgroundColor,
        lineColor: Color(lineColor).fade(0.15).rgb().string(),
        lineColorActive: lineColor,
        shadowColor: Color(lineColor).fade(0.25).rgb().string()
    };
};

export const random = (max: number) => Math.floor(Math.random() * max);
