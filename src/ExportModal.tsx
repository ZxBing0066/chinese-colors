import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import scss from 'highlight.js/lib/languages/scss';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/github.css';
import Clipboard from 'clipboard';

import Context from './Context';
import { Options } from './Interface';
import Modal, { ModalProps } from './Modal';
import { getThemeColor } from './utils';
import './export-modal.scss';

hljs.registerLanguage('scss', scss);
hljs.registerLanguage('css', css);

const scssComment = (hex: string, options: Options) => `// Generate by https://chinese-colors.heyfe.org/
// Brand color: ${hex}, colorAsTextColor: ${!!options.colorAsTextColor}, type: ${options.generateType}, simple: ${
    options.simpleDesign
}`;

const cssSnippet = `a {
    color: var(--color-text);
    text-decoration: underline;
}
a:hover {
    color: var(--color-text-primary);
}
button {
    color: var(--color-text);
    border-color: var(--color-line);
}
button:hover {
    color: var(--color-text-primary);
    border-color: var(--color-line-primary);
}
hr {
    border-color: var(--color-line);
}
code {
    color: var(--color-text-primary);
    background: var(--color-background-secondary);
    border: 1px solid var(--line-color-primary);
}
blockquote {
    background-color: var(--color-background-primary);
    border-left: 3px solid var(--color-line-primary);
    color: var(--color-text-secondary);
}

select,
input,
textarea {
    border-color: var(--color-line);
}
select:focus,
input:focus,
textarea:focus {
    border-color: var(--color-line-primary);
    outline: none;
}`;

const themeToScssVariable = (theme: ReturnType<typeof getThemeColor>) => {
    return `$color-text: ${theme.textColor};
$color-text-primary: ${theme.textColorPrimary};
$color-text-secondary: ${theme.textColorSecondary};
$color-background: ${theme.backgroundColor};
$color-background-primary: ${theme.backgroundColorPrimary};
$color-background-secondary: ${theme.backgroundColorSecondary};
$color-border: ${theme.lineColor};
$color-border-primary: ${theme.lineColorPrimary};`;
};

const themeToScss = (theme: ReturnType<typeof getThemeColor>, hex: string, options: Options) => {
    return `${scssComment(hex, options)}
${themeToScssVariable(theme)}
`;
};

const cssComment = (hex: string, options: Options) => `/* Generate by https://chinese-colors.heyfe.org/ */
/* Brand color: ${hex}, colorAsTextColor: ${!!options.colorAsTextColor}, type: ${options.generateType}, simple: ${
    options.simpleDesign
} */`;

const themeToCssVariable = (theme: ReturnType<typeof getThemeColor>) => {
    return `--color-text: ${theme.textColor};
--color-text-primary: ${theme.textColorPrimary};    
--color-text-secondary: ${theme.textColorSecondary};
--color-background: ${theme.backgroundColor};
--color-background-primary: ${theme.backgroundColorPrimary};
--color-background-secondary: ${theme.backgroundColorSecondary};
--color-line: ${theme.lineColor};
--color-line-primary: ${theme.lineColorPrimary};`;
};

const themeToCss = (theme: ReturnType<typeof getThemeColor>, hex: string, options: Options) => {
    return `${cssComment(hex, options)}
${themeToCssVariable(theme)}
`;
};

const styleToScss = (theme: ReturnType<typeof getThemeColor>, hex: string, options: Options) => {
    return `${scssComment(hex, options)}
${themeToScssVariable(theme)}

:root {
    color: $color-text;
    background-color: $color-background;
}
${cssSnippet.replaceAll('var(--', '$').replaceAll(')', '')}
`;
};

const styleToCss = (theme: ReturnType<typeof getThemeColor>, hex: string, options: Options) => {
    const wrapSelector = ':root';
    const css = `${cssComment(hex, options)}
${wrapSelector} {
${themeToCssVariable(theme)
    .split('\n')
    .map(line => `    ${line}`)
    .join('\n')}
    color: var(--color-text);
    background-color: var(--color-background);
}
${cssSnippet}
`;
    return css;
};

const ExportModal = memo(({ color, ...modalProps }: { color: string } & Omit<ModalProps, 'children'>) => {
    const { options } = useContext(Context);
    const theme = useMemo(() => getThemeColor(color, options), [color]);
    const [type, setType] = useState('scss');
    const [exportType, setExportType] = useState('variable');
    const [message, setMessage] = useState<boolean | null>(null);
    const exportContent = useMemo(
        () =>
            (exportType === 'variable'
                ? type === 'css'
                    ? themeToCss
                    : themeToScss
                : type === 'css'
                ? styleToCss
                : styleToScss)(theme, color, options),
        [type, exportType, theme]
    );
    const exportContentRef = useRef(exportContent);

    const codeRef = useRef(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        codeRef.current && hljs.highlightElement(codeRef.current);
        exportContentRef.current = exportContent;
    }, [exportContent]);

    useEffect(() => {
        const clipboard = new Clipboard(copyButtonRef.current!, {
            text: () => exportContentRef.current
        });

        clipboard.on('success', function () {
            setMessage(true);
        });

        clipboard.on('error', function () {
            setMessage(false);
        });
        return () => {
            clipboard?.destroy();
        };
    }, []);

    useEffect(() => {
        let t: ReturnType<typeof setTimeout>;
        if (message !== null) {
            t = setTimeout(() => {
                setMessage(null);
            }, 2000);
        }
        return () => {
            t && clearTimeout(t);
        };
    }, [message]);

    return (
        <Modal
            {...modalProps}
            header={
                <div>
                    导出{' '}
                    <select value={exportType} onChange={e => setExportType(e.target.value)} className="export-type">
                        <option value="variable">主题变量</option>
                        <option value="style">懒人样式</option>
                    </select>
                </div>
            }
            footer={
                <div className="footer">
                    <div>
                        <select value={type} onChange={e => setType(e.target.value)} className="export-type">
                            <option value="scss">SCSS</option>
                            <option value="css">CSS</option>
                        </select>
                    </div>
                    <div>
                        {message === null ? null : (
                            <span className="copy-tip">{message ? '复制成功' : '复制失败请手动复制'}</span>
                        )}
                        <button ref={copyButtonRef} className="copy-button">
                            复制
                        </button>
                    </div>
                </div>
            }
        >
            <div className="export-content">
                <pre>
                    <code className={'language-' + type} ref={codeRef}>
                        {exportContent}
                    </code>
                </pre>
            </div>
        </Modal>
    );
});

export default ExportModal;
