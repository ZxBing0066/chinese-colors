import colors from './colors.json';

export type GenerateType = 'mix' | 'negate' | 'blackWhite';

export interface Options {
    colorAsTextColor: boolean;
    generateType: GenerateType;
}

export type OptionKey = keyof Options;
export type OptionValue = Options[OptionKey];

export type TColor = typeof colors[number];
