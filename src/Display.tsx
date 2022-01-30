import { lazy, memo, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import colors from './colors.json';
import designIcon from './assets/design.png';
import { getThemeColor } from './utils';
import Context from './Context';

const ExportModal = lazy(() => import('./ExportModal'));

// prefetch ExportModal
import('./ExportModal');

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
    const [modalVisible, setModalVisible] = useState(false);
    const { name, hex, RGB, pinyin } = color;
    const {
        options: { colorAsTextColor },
        handleOptionChange
    } = useContext(Context);

    const themeColor = useMemo(() => getThemeColor(hex, colorAsTextColor), [hex, colorAsTextColor]);

    const { textColor, textColorActive, backgroundColor, backgroundColorActive, lineColor, lineColorActive } =
        themeColor;

    const handleColorAsTextColor = useCallback(() => {
        handleOptionChange('colorAsTextColor', !colorAsTextColor);
    }, [colorAsTextColor]);

    const handleModalClose = useCallback(() => {
        setModalVisible(false);
    }, []);

    const handleExport = useCallback(() => {
        setModalVisible(true);
    }, []);

    return (
        <div
            className={'editor' + (open ? ' open' : '')}
            style={{
                color: textColor,
                borderColor: lineColor
            }}
        >
            <div className="preview">
                <h1>配色生成</h1>
                <h2>这是一段网站配色事例</h2>
                <p>
                    将以选择的颜色为基础生成一套网站主题配色。主要包括
                    <b>字色、高亮紫色、背景色、块背景色、高亮背景色、边框色、高亮边框色</b>。
                </p>
                <p>这里将使用生成的颜色来进行展示，可通过点击标题将选择的颜色切换为字色/背景色。</p>
                <div className="block">
                    <header>这是一个块</header>
                    <div className="line"></div>
                    <ul>
                        <li>
                            <span className="name">颜色名称：</span>
                            <span>{name}</span>
                        </li>
                        <li>
                            <span className="name">颜色拼音：</span>
                            <span>{pinyin}</span>
                        </li>
                        <li>
                            <span className="name">hex 色值：</span>
                            <span>{hex}</span>
                        </li>
                        <li>
                            <span className="name">rgb 色值：</span>
                            <span>rgb({RGB.join(',')})</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <button className="button background">这是一个背景按钮</button>
                    <button className="button border">这是一个边框按钮</button>
                </div>
                <div>
                    <a href="/#random" target="_blank" rel="noopener" className="link">
                        这是一个链接
                    </a>
                </div>
                <style>
                    {`
.editor .line {
    background-color: ${lineColor};
}
.editor .block {
    border-color: ${lineColor};
}
.editor .button.background {
    border-color: ${textColor};
    color: ${backgroundColor};
    background-color: ${textColor};
}
.editor .button.background:hover {
    border-color: ${textColorActive};
    color: ${backgroundColorActive};
    background-color: ${textColorActive};
}
.editor .button.border {
    background: transparent;
    color: ${textColor};
    border-color: ${lineColor};
}
.editor .button.border:hover {
    color: ${textColorActive};
    border-color: ${lineColorActive};
    outline: 1px solid ${textColor};
}
.editor .link:hover {
    color: ${textColorActive};
    border-color: ${lineColorActive};
}
.editor .link {
    color: ${textColor};
}
`}
                </style>
            </div>
            <div className="controls">
                <div
                    className={'control checkbox' + (colorAsTextColor ? ' checked' : '')}
                    onClick={handleColorAsTextColor}
                >
                    <strong className="icon"></strong>选中色作为文本色
                </div>
                <div className="exporter" onClick={handleExport}>
                    导出
                </div>
                {modalVisible && (
                    <Suspense fallback={null}>
                        <ExportModal visible={true} onClose={handleModalClose} color={hex} />
                    </Suspense>
                )}
            </div>
        </div>
    );
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

    const {
        options: { colorAsTextColor }
    } = useContext(Context);

    const themeColor = useMemo(() => getThemeColor(hex, colorAsTextColor), [hex, colorAsTextColor]);

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
            <footer>
                <p>
                    Copyright © 2021 by{' '}
                    <a href="https://github.com/ZxBing0066/" target="_blank" rel="noopener">
                        ZxBing0066
                    </a>
                </p>

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
                                <a
                                    target="_blank"
                                    href="https://igoutu.cn/icon/36895/%E8%8E%B2%E8%8A%B1"
                                    rel="noopener"
                                >
                                    莲花
                                </a>{' '}
                                <a
                                    target="_blank"
                                    href="https://igoutu.cn/icon/60657/%E8%AE%BE%E8%AE%A1"
                                    rel="noopener"
                                >
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
            </footer>
            <div className="question">
                <i className="icon"></i>
                <div className="card">
                    <div className="content">
                        <h2>站点说明</h2>
                        <p>本站用作网站设计相关的主题变量生成，可按照选择的颜色生成网页中的字色、边框色、背景色。</p>
                        <p>
                            使用网站右侧的 <img src={designIcon} alt="design" width="10" height="10" />{' '}
                            可打开设计预览面板，下方可切换选项和进行颜色导出。
                        </p>
                        <p>
                            使用 <kbd style={{ borderColor: themeColor.lineColor }}>space</kbd> 可随机选择颜色。
                        </p>
                        <i className="triangle"></i>
                    </div>
                </div>
            </div>
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
            <div className={'toggler' + (open ? ' open' : '')} onClick={toggle}>
                <img src={designIcon} alt="design" width="20" height="20" />
            </div>
        </div>
    );
};

export default Display;
