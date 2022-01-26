import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';
import colors from './colors.json';
import ColorList from './ColorList';
import Context from './Context';
import Display from './Display';
import { getFontColor } from './utils';

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
    const [fontColor, setFontColor] = useState('white');

    useEffect(() => {
        setBg((document.body.style.backgroundColor = currentColor.hex));
        setFontColor(getFontColor(currentColor.hex));
    }, [currentColor.hex]);

    return (
        <Context.Provider value={{ handleChange }}>
            <div className="main" style={{ backgroundColor: bg, color: fontColor }}>
                <ColorList currentColorIndex={currentColorIndex} />
                <Display color={currentColor} />
            </div>
        </Context.Provider>
    );
}

export default App;
