import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';
import colors from './colors.json';
import ColorList from './ColorList';
import Context from './Context';
import Display from './Display';
import { getThemeColor } from './utils';
import { OptionKey, Options, OptionValue } from './Interface';

function App() {
    const [currentColorIndex, setCurrentColorIndex] = useState(() => {
        const hashToken = location.hash.replace('#', '');
        if (!hashToken) return 7;
        const currentColorIndex = colors.findIndex(color => color.pinyin === hashToken);
        return currentColorIndex >= 0 ? currentColorIndex : 7;
    });
    const currentColor = useMemo(() => colors[currentColorIndex], [currentColorIndex]);
    const handleChange = useCallback((e: MouseEvent<HTMLElement>) => {
        const index = e.currentTarget.dataset.index;
        if (index != null) {
            setCurrentColorIndex(+index);
            const color = colors[+index];
            history.replaceState(null, '', `/#${color.pinyin}`);
        }
    }, []);
    const [bg, setBg] = useState('white');
    const [textColor, setTextColor] = useState('white');
    const [options, setOptions] = useState<Options>(() => ({
        colorAsTextColor: false
    }));
    const handleOptionChange = useCallback((optionName: OptionKey, optionValue: OptionValue) => {
        setOptions(options => {
            return {
                ...options,
                [optionName]: optionValue
            };
        });
    }, []);

    useEffect(() => {
        const { backgroundColor, textColor } = getThemeColor(currentColor.hex, options.colorAsTextColor);
        setBg((document.body.style.backgroundColor = backgroundColor));
        setTextColor(textColor);
    }, [currentColor.hex, options.colorAsTextColor]);

    return (
        <Context.Provider value={{ handleChange, options, handleOptionChange }}>
            <div className="main" style={{ backgroundColor: bg, color: textColor }}>
                <ColorList currentColorIndex={currentColorIndex} />
                <Display color={currentColor} />
            </div>
        </Context.Provider>
    );
}

export default App;
