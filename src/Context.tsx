import { createContext, MouseEvent } from 'react';

import { OptionKey, Options, OptionValue } from './Interface';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const Context = createContext<{
    handleChange: (e: MouseEvent<HTMLElement>) => void;
    options: Options;
    handleOptionChange: (optionName: OptionKey, optionValue: OptionValue) => void;
}>({
    handleChange: noop,
    options: { colorAsTextColor: false, generateType: 'mix' },
    handleOptionChange: noop
});

export default Context;
