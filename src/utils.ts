import Color from 'color';

import { Options } from './Interface';

const mixWhite = Color('#fff'),
    mixBlack = Color('#000');

const exponent = 0.4;
const mixWeight = 0.3;

const contrastValid = (textColor: Color, backgroundColor: Color) => textColor.contrast(backgroundColor) < 5;

const rotate = (hex: string, asTextColor?: boolean) => {
    const color = Color(hex);
    const l = color.lightness();
    const contrastColor = color.rotate(270).lightness(l > 50 ? l - 50 : l + 50);
    return asTextColor ? [color, contrastColor] : [contrastColor, color];
};

const mix = (hex: string, asTextColor?: boolean) => {
    let contrastColor: Color;
    const color = Color(hex);
    const isDark = color.isDark();
    contrastColor = isDark
        ? color.mix(mixWhite, mixWeight).lighten(exponent)
        : color.mix(mixBlack, mixWeight).darken(exponent);
    while (contrastValid(color, contrastColor) && contrastColor.lightness() > 99 && contrastColor.lightness() < 1) {
        const newContrastColor = Color(contrastColor)[isDark ? 'lighten' : 'darken'](0.1);
        if (newContrastColor === contrastColor) {
            break;
        } else {
            contrastColor = newContrastColor;
        }
    }
    return asTextColor ? [color, contrastColor] : [contrastColor, color];
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

    const l = color.lightness();
    const contrastColor = Color.rgb(negateArray).lightness(l > 50 ? l - 50 : l + 50);

    return asTextColor ? [color, contrastColor] : [contrastColor, color];
};

const blackWhite = (hex: string, asTextColor?: boolean) => {
    const color = Color(hex);
    const isDark = color.isDark();
    const contrastColor = Color(isDark ? '#fffef8' : '#202124');

    return asTextColor ? [color, contrastColor] : [contrastColor, color];
};

const lightnessBlackWhite = (hex: string, asTextColor?: boolean) => {
    const color = Color(hex);
    const isDark = color.isDark();
    const { black, white } = getBasicColor(hex);
    const contrastColor = isDark ? white : black;

    return asTextColor ? [color, contrastColor] : [contrastColor, color];
};

const generatorMap = {
    mix,
    negate,
    rotate,
    blackWhite,
    lightness: lightnessBlackWhite
};

export const getThemeColor = (hex: string, options: Options) => {
    const { colorAsTextColor, generateType, simpleDesign } = options;
    const [textColor, backgroundColor] = generatorMap[generateType](hex, colorAsTextColor);

    if (simpleDesign) return getSimpleDesignThemeColor(textColor, backgroundColor);

    const isDark = !textColor.isDark();

    const gray = textColor.gray();
    const lineColor = textColor.gray(isDark ? gray + 20 : gray - 20);

    const hue = textColor.hue(),
        saturation = textColor.saturationl(),
        lightness = textColor.lightness();
    const bgHue = backgroundColor.hue(),
        bgSaturation = backgroundColor.saturationl(),
        bgLightness = backgroundColor.lightness();

    return {
        textColor: textColor.hex(),
        textColorPrimary: textColor
            .saturationl(saturation + 10)
            .lightness(isDark ? lightness + 10 : lightness - 10)
            .hex(),
        textColorSecondary: textColor
            .saturationl(saturation - 5)
            .lightness(isDark ? lightness - 5 : lightness + 5)
            .hex(),
        backgroundColor: backgroundColor.hex(),
        backgroundColorPrimary: backgroundColor
            .saturationl(bgSaturation + 10)
            .lightness(isDark ? bgLightness + 10 : bgLightness - 10)
            .hex(),
        backgroundColorSecondary: backgroundColor
            .saturationl(bgSaturation - 5)
            .lightness(isDark ? bgLightness - 5 : bgLightness + 5)
            .hex(),
        lineColor: lineColor.hex(),
        lineColorPrimary: textColor.hex()
    };
};

export const getSimpleDesignThemeColor = (primaryTextColor: Color, backgroundColor: Color) => {
    const isDark = backgroundColor.isDark();

    const { black, white } = getBasicColor(primaryTextColor.hex());
    const textColor = isDark ? white : black;
    const lightness = textColor.lightness(),
        gray = textColor.gray();

    return {
        textColor: textColor.hex(),
        textColorPrimary: primaryTextColor.hex(),
        textColorSecondary: textColor.lightness(lightness + (isDark ? -20 : 20)).hex(),
        backgroundColor: backgroundColor.hex(),
        backgroundColorPrimary: backgroundColor.saturationl(backgroundColor.saturationl() + 10).hex(),
        backgroundColorSecondary: backgroundColor.saturationl(backgroundColor.saturationl() + 10).hex(),
        lineColor: textColor.lightness(lightness + (isDark ? -25 : 25)).hex(),
        lineColorPrimary: primaryTextColor.hex()
    };
};

export const random = (max: number) => Math.floor(Math.random() * max);

const FAV_LOCAL_KEY = '__FAV__';

export const favStorage = (() => {
    const favs = localStorage.getItem(FAV_LOCAL_KEY)?.split(',') || [];
    const favMap = new Map(favs.map(fav => [fav, true]));
    const updateStorage = () => localStorage.setItem(FAV_LOCAL_KEY, [...favMap.keys()].join(','));
    const add = (name: string) => {
        favMap.set(name, true);
        updateStorage();
    };
    const remove = (name: string) => {
        favMap.delete(name);
        updateStorage();
    };
    const get = (name: string) => {
        return favMap.has(name);
    };
    return {
        add,
        remove,
        get
    };
})();

const getBasicColor = (hex: string) => {
    const color = Color(hex);
    const black = color.mix(Color('#000'), 0.9).lightness(5);
    const white = color.mix(Color('#fff'), 0.9).lightness(95);
    return {
        black,
        white
    };
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Color = Color;
