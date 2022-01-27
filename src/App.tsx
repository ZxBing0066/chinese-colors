import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';
import colors from './colors.json';
import ColorList from './ColorList';
import Context from './Context';
import Display from './Display';
import { getThemeColor, random } from './utils';
import { OptionKey, Options, OptionValue } from './Interface';

const defaultColorIndex = 7;

const scrollToColor = (colorIndex: number) => {
    const targetDOM = document.querySelector(`.color-card[data-index="${colorIndex}"]`) as HTMLDivElement;
    if (targetDOM) {
        if (targetDOM.scrollIntoView) {
            targetDOM?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            document.querySelector('.main')?.scrollTo(0, targetDOM.offsetTop - window.innerHeight / 2);
        }
    }
};

function App() {
    const [currentColorIndex, setCurrentColorIndex] = useState(() => {
        const hashToken = location.hash.replace('#', '');
        if (!hashToken) return defaultColorIndex;
        let currentColorIndex;
        if (hashToken === 'random') {
            currentColorIndex = random(colors.length);
        } else {
            currentColorIndex = colors.findIndex(color => color.pinyin === hashToken);
        }
        return currentColorIndex >= 0 ? currentColorIndex : defaultColorIndex;
    });
    const currentColor = useMemo(() => colors[currentColorIndex] || colors[defaultColorIndex], [currentColorIndex]);
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
        scrollToColor(currentColorIndex);
    }, []);

    useEffect(() => {
        const { backgroundColor, textColor } = getThemeColor(currentColor.hex, options.colorAsTextColor);
        setBg((document.body.style.backgroundColor = backgroundColor));
        setTextColor(textColor);
    }, [currentColor.hex, options.colorAsTextColor]);

    const randomColor = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Spacebar' || e.key === ' ' || e.keyCode === 32) {
            e.preventDefault();
            setCurrentColorIndex(currentColorIndex => {
                let randomIndex = random(colors.length - 1);
                if (randomIndex >= currentColorIndex) randomIndex++;
                scrollToColor(randomIndex);
                return randomIndex;
            });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keypress', randomColor);
        return () => {
            window.removeEventListener('keypress', randomColor);
        };
    }, [randomColor]);

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
