import Color from 'color';

const white = Color('rgba(255,255,255,.8)'),
    black = Color('rgba(0,0,0,.8)');

const exponent = 0.4;

export const getThemeColor = (hex: string, asTextColor?: boolean) => {
    let textColor, backgroundColor;
    const color = Color(hex);
    if (!asTextColor) {
        textColor = color.isDark() ? color.mix(white).lighten(0.3).hex() : color.mix(black).darken(0.3).hex();
        backgroundColor = hex;
    } else {
        textColor = hex;
        backgroundColor = color.isDark()
            ? color.mix(white).lighten(exponent).hex()
            : color.mix(black).darken(exponent).hex();
    }
    const isDark = !Color(textColor).isDark();
    return {
        textColor,
        textColorActive: isDark ? Color(textColor).lighten(exponent).hex() : Color(textColor).darken(exponent).hex(),
        backgroundColor,
        backgroundColorActive: !isDark
            ? Color(backgroundColor).lighten(exponent).hex()
            : Color(backgroundColor).darken(exponent).hex(),
        borderColor: Color(textColor).lighten(exponent).hex(),
        borderColorActive: Color(textColor).lighten(exponent).hex()
    };
};

export const random = (max: number) => {
    return Math.floor(Math.random() * max);
};
