import { createContext, MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Color from 'color';

import './style.scss';

import colors from './colors.json';

const Context = createContext<{ handleChange: (e: MouseEvent<HTMLElement>) => void }>({ handleChange: () => {} });

const getFontColor = (hex: string) => {
    const color = Color(hex);
    return color.isDark() ? color.lighten(0.5).hex() : color.darken(0.5).hex();
};

const ColorCard = ({ color, index, active }: { color: typeof colors[number]; index: number; active: boolean }) => {
    const [bg, setBg] = useState('white');
    const [fontColor, setFontColor] = useState('black');
    const { name, hex } = color;
    const { handleChange } = useContext(Context);
    useEffect(() => {
        setBg(hex);
        setFontColor(getFontColor(hex));
    }, []);
    return (
        <div
            className='color-card'
            style={{ background: bg, color: fontColor }}
            data-index={index}
            data-active={active}
            onClick={handleChange}
        >
            <h2>{name}</h2>
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
    const { name, hex } = color;
    const perimeter = 2 * 47 * Math.PI;
    const strokeDasharray = [1 * perimeter, perimeter].map(v => v + 'px').join(',');
    return (
        <div className='display' style={{ background: hex }}>
            <div className='name'>{name}</div>
            <div className='hex'>{hex}</div>
            <div>
                <svg viewBox='0 0 100 100'>
                    <path
                        d='M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94'
                        stroke='gray'
                        stroke-linecap='round'
                        stroke-width='6'
                        opacity='1'
                        fill-opacity='0'
                        style={{
                            strokeDasharray
                        }}
                        // style='stroke-dasharray: 221.482px, 295.31px;/* stroke-dashoffset: 0px; *//* transition: stroke-dashoffset 0s ease 0s, stroke-dasharray 0s ease 0s, stroke ease 0s, stroke-width ease 0.3s, opacity ease 0s; */'
                    ></path>
                </svg>
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
        <div className='main'>
            <Context.Provider value={{ handleChange }}>
                <ColorList currentColorIndex={currentColorIndex} />
            </Context.Provider>
            <Display color={currentColor} />
        </div>
    );
}

export default App;
