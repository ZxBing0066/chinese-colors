import { memo, useCallback, useContext, useEffect, useState, MouseEvent } from 'react';

import './style.scss';
import colors from './colors.json';
import Context from './Context';
import { TColor } from './Interface';
import Heart from './icons/Heart';
import { favStorage } from './utils';

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

const ColorCard = memo(({ color, index, active }: { color: TColor; index: number; active: boolean }) => {
    const [bg, setBg] = useState('white');
    const { name, hex, RGB } = color;
    const { handleChange } = useContext(Context);
    useEffect(() => {
        setBg(hex);
    }, [hex]);
    const [fav, setFav] = useState(() => favStorage.get(hex));
    const handleHeart = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            setFav(fav => {
                if (fav) {
                    favStorage.remove(hex);
                } else {
                    favStorage.add(hex);
                }
                return favStorage.get(hex);
            });
        },
        [hex]
    );

    return (
        <div
            className={'color-card' + (fav ? ' fav' : '')}
            data-index={index}
            data-active={active}
            onClick={handleChange}
        >
            <Heart className="heart" onClick={handleHeart} _fill={fav} />
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
            {new Array(10).fill(null).map((v, i) => (
                <div className="placeholder" key={i}></div>
            ))}
        </div>
    );
});

export default ColorList;
