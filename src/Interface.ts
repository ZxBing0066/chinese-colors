import colors from './colors.json';

export interface Options {
    colorAsTextColor: boolean;
}

export type OptionKey = keyof Options;
export type OptionValue = Options[OptionKey];

export type Color = typeof colors[number];
