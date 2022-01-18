import { createContext, MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Color from 'color';

import './style.scss';

import colors from './colors.json';
import Ring from './Ring';

const Context = createContext<{ handleChange: (e: MouseEvent<HTMLElement>) => void }>({ handleChange: () => {} });

const getFontColor = (hex: string) => {
    const color = Color(hex);
    return color.isDark() ? color.lighten(0.5).hex() : color.darken(0.5).hex();
};

const ColorStrip = ({ v, type }: { v: number; type: string }) => {
    return (
        <div className='color-strip'>
            <div className={'color-bar color-' + type} style={{ width: (v / 255) * 100 + '%' }}></div>
        </div>
    );
};

const ColorCard = ({ color, index, active }: { color: typeof colors[number]; index: number; active: boolean }) => {
    const [bg, setBg] = useState('white');
    const [fontColor, setFontColor] = useState('black');
    const { name, hex, RGB, pinyin } = color;
    const { handleChange } = useContext(Context);
    useEffect(() => {
        setBg(hex);
        setFontColor(getFontColor(hex));
    }, [hex]);
    return (
        <div
            className='color-card'
            style={{ color: fontColor }}
            data-index={index}
            data-active={active}
            onClick={handleChange}
        >
            <div className='color-bar' style={{ background: bg }} />
            <div>
                <div className='name'>{name}</div>
                <div>
                    {RGB.map((v, i) => (
                        <ColorStrip v={v} key={i} type={'rgb'[i]} />
                    ))}
                </div>
                <div className='hex'>{hex}</div>
            </div>
        </div>
    );
};

const ColorList = ({ currentColorIndex }: { currentColorIndex: number }) => {
    return (
        <div className='list'>
            {colors.map((color, i) => (
                <ColorCard color={color} index={i} key={i} active={currentColorIndex === i} />
            ))}
        </div>
    );
};

const Display = ({ color }: { color: typeof colors[number] }) => {
    const { name, hex, RGB } = color;
    const [fontColor, setFontColor] = useState('black');
    useEffect(() => {
        setFontColor(getFontColor(hex));
    }, [color]);
    return (
        <div className='display' style={{ color: fontColor }}>
            <div className='name'>{name}</div>
            <div className='hex'>{hex}</div>
            <div className='rgb-ring'>
                {RGB.map((v, i) => (
                    <Ring percent={v / 255} key={i} text={v + ''} />
                ))}
            </div>
        </div>
    );
};

function App() {
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const currentColor = useMemo(() => colors[currentColorIndex], [currentColorIndex]);
    const handleChange = useCallback((e: MouseEvent<HTMLElement>) => {
        const index = e.currentTarget.dataset.index;
        index != null && setCurrentColorIndex(+index);
    }, []);

    return (
        <div className='main' style={{ backgroundColor: currentColor.hex }}>
            <Context.Provider value={{ handleChange }}>
                <ColorList currentColorIndex={currentColorIndex} />
            </Context.Provider>
            <Display color={currentColor} />
        </div>
    );
}

export default App;
