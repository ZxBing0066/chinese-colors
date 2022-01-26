import { memo, useContext, useEffect, useState } from 'react';

import './style.scss';
import colors from './colors.json';
import Context from './Context';

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

const ColorCard = memo(({ color, index, active }: { color: typeof colors[number]; index: number; active: boolean }) => {
    const [bg, setBg] = useState('white');
    const { name, hex, RGB } = color;
    const { handleChange } = useContext(Context);
    useEffect(() => {
        setBg(hex);
    }, [hex]);
    return (
        <div className="color-card" data-index={index} data-active={active} onClick={handleChange}>
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
    return (
        <div className="color-list">
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

export default ColorList;
