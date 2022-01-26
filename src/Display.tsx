import { memo, useCallback, useEffect, useRef, useState } from 'react';

import colors from './colors.json';
import designIcon from './assets/design.png';

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

const Editor = memo(({ color, open }: { color: typeof colors[number]; open: boolean }) => {
    const { name, hex, RGB, pinyin } = color;

    return <div className={'editor' + (open ? ' open' : '')}></div>;
});

const Common = memo(({ color }: { color: typeof colors[number] }) => {
    const { name, hex, RGB, pinyin } = color;
    const nmRef = useRef<HTMLDivElement>(null);
    const pyRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
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
        <div className="common">
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
            <div className="info">
                <i className="icon"></i>
                <div className="card">
                    <div className="content">
                        <p>
                            颜色数据来自{' '}
                            <a href="http://zhongguose.com/" target="_blank" rel="noopener">
                                中国色
                            </a>
                        </p>
                        <p>
                            <a target="_blank" href="https://igoutu.cn/icon/36895/%E8%8E%B2%E8%8A%B1" rel="noopener">
                                莲花
                            </a>{' '}
                            <a target="_blank" href="https://igoutu.cn/icon/60657/%E8%AE%BE%E8%AE%A1" rel="noopener">
                                设计
                            </a>{' '}
                            图标源自{' '}
                            <a target="_blank" href="https://igoutu.cn" rel="noopener">
                                Icons8
                            </a>
                        </p>
                        <i className="triangle"></i>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>
                    Copyright © 2021 by{' '}
                    <a href="https://github.com/ZxBing0066/" target="_blank" rel="noopener">
                        ZxBing0066
                    </a>
                </p>
            </footer>
        </div>
    );
});

const Display = ({ color }: { color: typeof colors[number] }) => {
    const [open, setOpen] = useState(false);

    const toggle = useCallback(() => {
        setOpen(open => !open);
    }, []);
    return (
        <div className="display">
            <Common color={color}></Common>
            <Editor color={color} open={open}></Editor>
            <div className="toggler" onClick={toggle}>
                <img src={designIcon} alt="design" />
            </div>
        </div>
    );
};

export default Display;
