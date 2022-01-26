import Color from 'color';

const white = Color('white'),
    black = Color('black');

export const getFontColor = (hex: string) => {
    const color = Color(hex);
    return color.isDark() ? color.mix(white).lighten(0.2).hex() : color.mix(black).darken(0.2).hex();
    // return color.isDark() ? color.lighten(1.1).hex() : color.darken(1.1).hex();
};
