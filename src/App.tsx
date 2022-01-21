import { createContext, memo, MouseEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Color from 'color';

import './style.scss';

import _colors from './colors.json';

const colors = _colors.sort((a, b) => {
    const colorA = Color(a.hex),
        colorB = Color(b.hex);
    return colorB.hue() - colorA.hue() || colorB.saturationv() - colorA.saturationv();
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Context = createContext<{ handleChange: (e: MouseEvent<HTMLElement>) => void }>({ handleChange: () => {} });

const getFontColor = (hex: string) => {
    const color = Color(hex);
    console.log(color, Color, color.isDark());

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
    const [effectColors, setEffectColors] = useState(() => colors.slice(0, 100));
    useEffect(() => {
        setEffectColors(colors);
    }, []);
    return (
        <div className="list">
            {effectColors.map((color, i) => (
                <ColorCard color={color} index={i} key={i} active={currentColorIndex === i} />
            ))}
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
            <footer className="footer">Copyright</footer>
        </div>
    );
});

function App() {
    const [currentColorIndex, setCurrentColorIndex] = useState(7);
    const currentColor = useMemo(() => colors[currentColorIndex], [currentColorIndex]);
    const handleChange = useCallback((e: MouseEvent<HTMLElement>) => {
        const index = e.currentTarget.dataset.index;
        index != null && setCurrentColorIndex(+index);
    }, []);

    useEffect(() => {
        document.body.style.backgroundColor = currentColor.hex;
    }, [currentColor.hex]);

    return (
        <div className="main" style={{ backgroundColor: currentColor.hex }}>
            <Context.Provider value={{ handleChange }}>
                <ColorList currentColorIndex={currentColorIndex} />
            </Context.Provider>
            <Display color={currentColor} />
        </div>
    );
}

export default App;
