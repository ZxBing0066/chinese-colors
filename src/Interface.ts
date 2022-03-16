import colors from './colors.json';

export type GenerateType = 'mix' | 'lightness' | 'blackWhite' | 'negate' | 'rotate';

export interface Options {
    colorAsTextColor: boolean;
    generateType: GenerateType;
    simpleDesign: boolean;
}

export type OptionKey = keyof Options;
export type OptionValue = Options[OptionKey];

export type TColor = typeof colors[number];
