import { lazy, memo, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import logo from './assets/logo.png';
import { getThemeColor } from './utils';
import Context from './Context';
import { TColor } from './Interface';
import Design from './icons/Design';

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

const Editor = memo(({ color, open }: { color: TColor; open: boolean }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { name, hex, RGB, pinyin } = color;
    const { options, handleOptionChange } = useContext(Context);
    const { colorAsTextColor, generateType, simpleDesign } = options;
    const themeColor = useMemo(() => getThemeColor(hex, options), [hex, options]);

    const {
        textColor,
        textColorActive,
        textColorSecondary,
        textColorPrimary,
        backgroundColor,
        backgroundColorActive,
        lineColor,
        lineColorActive,
        shadowColor
    } = themeColor;

    const handleColorAsTextColor = useCallback(() => {
        handleOptionChange('colorAsTextColor', !colorAsTextColor);
    }, [colorAsTextColor]);

    const handleSimpleDesign = useCallback(() => {
        handleOptionChange('simpleDesign', !simpleDesign);
    }, [simpleDesign]);

    const handleGenerateType = useCallback(e => {
        handleOptionChange('generateType', e.target.value);
    }, []);

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
                borderColor: lineColor,
                backgroundColor: backgroundColor
            }}
        >
            <div className="preview">
                <h1>配色生成</h1>
                <h2>这是一段网站配色事例</h2>
                <p className="remark">这是一段备注</p>
                <p>
                    将以选择的颜色为基础生成一套网站主题配色。包括<b>字色、高亮字色、背景色、边框色等</b>。
                </p>
                <p>这里将使用生成的颜色来进行展示，可通过点击标题将选择的颜色切换为字色/背景色。</p>
                <p>
                    这是一段内联代码展示 <code>Hello world</code> 这是一段内联代码展示。
                </p>
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
                <blockquote>这是一段引用文字。</blockquote>
                <div>
                    <button className="button background">这是一个背景按钮</button>
                </div>
                <div>
                    <button className="button border">这是一个边框阴影按钮</button>
                </div>
                <div>
                    <a href="/#random" target="_blank" rel="noopener" className="link">
                        这是一个链接
                    </a>
                </div>
                <style>
                    {`
.preview h1 {
    color: ${textColorPrimary};
}
.preview .remark {
    color: ${textColorSecondary};
}
.preview .line {
    background-color: ${lineColor};
}
.preview .block {
    border-color: ${lineColor};
}
.preview .button.background {
    border-color: ${textColor};
    color: ${backgroundColor};
    background-color: ${textColor};
}
.preview .button.background:hover {
    border-color: ${textColorActive};
    color: ${backgroundColorActive};
    background-color: ${textColorActive};
}
.preview .button.border {
    background: transparent;
    color: ${textColor};
    border-color: ${lineColor};
}
.preview .button.border:hover {
    color: ${textColorActive};
    border-color: ${lineColorActive};
    box-shadow: 0 0 3px 2px ${shadowColor};
}
.preview .link {
    color: ${textColor};
    text-decoration: none;
}
.preview .link:hover {
    color: ${textColorActive};
    text-decoration: underline;
}
.preview blockquote {
    background-color: ${backgroundColorActive};
    border-color: ${lineColor};
    border-left: 3px solid;
    margin: 0 0 1rem 0;
    padding: 0.75rem 1.5rem;
}
.preview code {
    color: ${textColorPrimary};
    background: ${backgroundColorActive};
    padding: .2em .5em;
    border-radius: .3em;
    border: 1px solid ${lineColorActive};
}
`}
                </style>
            </div>
            <div className="controls">
                <select className="control" value={generateType} onChange={handleGenerateType}>
                    <option value="mix">混色</option>
                    <option value="blackWhite">黑白</option>
                    <option value="negate">反转</option>
                </select>
                {/* <div className={'control checkbox' + (simpleDesign ? ' checked' : '')} onClick={handleSimpleDesign}>
                    <strong className="icon" />
                    素朴配色
                </div> */}
                <div
                    className={'control checkbox' + (colorAsTextColor ? ' checked' : '')}
                    onClick={handleColorAsTextColor}
                >
                    <strong className="icon" />
                    选中色作为文本色
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

const Common = memo(({ color }: { color: TColor }) => {
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

    const { options } = useContext(Context);

    const themeColor = useMemo(() => getThemeColor(hex, options), [hex, options]);

    return (
        <div className="common">
            <div className="content">
                <h1 className="title">
                    中国色彩 <img src={logo} className="logo" width={20} height={20} alt="logo" />
                </h1>
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
            </div>
            <footer className="footer">
                <div className="copyright">
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
                                    图标源自{' '}
                                    <a target="_blank" href="https://igoutu.cn" rel="noopener">
                                        Icons8
                                    </a>
                                </p>
                                <i className="triangle"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="question">
                    <i className="icon"></i>
                    <div className="card">
                        <div className="content">
                            <h2>站点说明</h2>
                            <p>
                                本站用作网站设计相关的主题变量生成，可按照选择的颜色生成网页中的字色、边框色、背景色。
                            </p>
                            <p>
                                使用网站右侧的 <Design style={{ height: '.8em', fill: 'currentColor' }} />{' '}
                                可打开设计预览面板，下方可切换选项和进行颜色导出。
                            </p>
                            <p>
                                使用 <kbd style={{ borderColor: themeColor.lineColor }}>space</kbd> 可随机选择颜色。
                            </p>
                            <i className="triangle"></i>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
});

const Display = memo(({ color }: { color: TColor }) => {
    const [open, setOpen] = useState(false);
    const { options } = useContext(Context);
    const { hex } = color;
    const themeColor = useMemo(() => getThemeColor(hex, options), [hex, options]);
    const toggle = useCallback(() => {
        setOpen(open => !open);
    }, []);
    return (
        <div className="display">
            <Common color={color}></Common>
            <Editor color={color} open={open}></Editor>
            <div
                className={'toggler' + (open ? ' open' : '')}
                style={{ borderColor: themeColor.lineColor }}
                onClick={toggle}
            >
                <Design className="icon" fill={themeColor.textColor} />
            </div>
        </div>
    );
});

export default Display;
