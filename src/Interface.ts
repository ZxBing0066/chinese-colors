export interface Options {
    colorAsTextColor: boolean;
}

export type OptionKey = keyof Options;
export type OptionValue = Options[OptionKey];
