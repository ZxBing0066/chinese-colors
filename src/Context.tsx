import { createContext, MouseEvent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Context = createContext<{ handleChange: (e: MouseEvent<HTMLElement>) => void }>({ handleChange: () => {} });

export default Context;
