import { createContext, memo, MouseEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Color from 'color';

import './style.scss';
import colors from './colors.json';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Context = createContext<{ handleChange: (e: MouseEvent<HTMLElement>) => void }>({ handleChange: () => {} });

const getFontColor = (hex: string) => {
    const color = Color(hex);

    return color.isDark() ? color.lighten(0.7).hex() : color.darken(0.7).hex();
};

const RGBStrip = memo(({ v, type }: { v: number; type: string }) => {
    return (
        <div className="rgb-strip">
            <div className={'color-bar color-' + type} style={{ width: (v / 255) * 100 + '%' }}></div>
        </div>
    );
});
const RGBStrips = memo(({ RGB }: { RGB: number[] }) => {
    return (
        <div className="rgb-strips">
            {RGB.map((v, i) => (
                <RGBStrip v={v} key={i} type={'rgb'[i]} />
            ))}
        </div>
    );
});

const RgbCard = memo(({ RGB }: { RGB: number[] }) => {
    return (
        <div className="rgb-card">
            {RGB.map((v, i) => (
                <span className={'rgb-block color-' + 'rgb'[i]} key={i}>
                    {v}
                </span>
            ))}
        </div>
    );
});

const ColorCard = memo(({ color, index, active }: { color: typeof colors[number]; index: number; active: boolean }) => {
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
            className="color-card"
            style={{ color: fontColor }}
            data-index={index}
            data-active={active}
            onClick={handleChange}
        >
            <div className="color-bar" style={{ background: bg }} />
            <div className="wrap">
                <div className="name">{name}</div>
                <RGBStrips RGB={RGB} />
                <div className="hex">{hex}</div>
            </div>
        </div>
    );
});

const ColorList = memo(({ currentColorIndex }: { currentColorIndex: number }) => {
    // const [effectColors, setEffectColors] = useState(() => colors.slice(0, 100));
    // useEffect(() => {
    //     setEffectColors(colors);
    // }, []);
    return (
        <div className="list">
            {colors.map((color, i) => (
                <ColorCard color={color} index={i} key={i} active={currentColorIndex === i} />
            ))}
            <div className="placeholder"></div>
            <div className="placeholder"></div>
            <div className="placeholder"></div>
            <div className="placeholder"></div>
            <div className="placeholder"></div>
            <div className="placeholder"></div>
        </div>
    );
});

const Display = memo(({ color }: { color: typeof colors[number] }) => {
    const { name, hex, RGB, pinyin, CMYK } = color;
    const [fontColor, setFontColor] = useState('black');
    const nmRef = useRef<HTMLDivElement>(null);
    const pyRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setFontColor(getFontColor(hex));

        pyRef.current?.classList.remove('animate');
        nmRef.current?.classList.remove('animate');
        const pyT = setTimeout(() => {
            pyRef.current?.classList.add('animate');
        }, 10);
        const nmT = setTimeout(() => {
            nmRef.current?.classList.add('animate');
        }, 10);
        return () => {
            clearTimeout(pyT);
            clearTimeout(nmT);
        };
    }, [color]);

    return (
        <div className="display" style={{ color: fontColor }}>
            <h1>中国色彩</h1>
            <h2>Chinese Colors</h2>
            <div className="wrap">
                <div className="text">
                    <div className="pinyin" ref={pyRef}>
                        {pinyin}
                    </div>
                    <div className="name" ref={nmRef}>
                        {name}
                    </div>
                </div>
                <div className="color">
                    <div className="hex">{hex}</div>
                    <div className="rgb">rgb({RGB.join(',')})</div>
                    <RgbCard RGB={RGB} />
                </div>
            </div>
            <i className="question"></i>
            <i className="info"></i>
            <footer className="footer">
                <p>
                    Copyright © 2021 by{' '}
                    <a href="https://github.com/ZxBing0066/" target="_blank" rel="noopener">
                        ZxBing0066
                    </a>
                </p>
                <p>
                    颜色数据来自{' '}
                    <a href="http://zhongguose.com/" target="_blank" rel="noopener">
                        中国色
                    </a>
                </p>
            </footer>
        </div>
    );
});

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

    useEffect(() => {
        setBg((document.body.style.backgroundColor = currentColor.hex));
    }, [currentColor.hex]);

    return (
        <Context.Provider value={{ handleChange }}>
            <div className="main" style={{ backgroundColor: bg }}>
                <ColorList currentColorIndex={currentColorIndex} />
                <Display color={currentColor} />
            </div>
        </Context.Provider>
    );
}

export default App;
