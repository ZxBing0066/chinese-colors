import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import scss from 'highlight.js/lib/languages/scss';
import 'highlight.js/styles/github.css';
import Clipboard from 'clipboard';

import Context from './Context';
import { Options } from './Interface';
import Modal, { ModalProps } from './Modal';
import { getThemeColor } from './utils';
import './export-modal.scss';

hljs.registerLanguage('scss', scss);

const themeToScss = (theme: ReturnType<typeof getThemeColor>, hex: string, options: Options) => {
    return `// Generate by https://chinese-colors.heyfe.org/
// Primary color: ${hex}, colorAsTextColor: ${!!options.colorAsTextColor}
$color-text: ${theme.textColor};
$color-text-active: ${theme.textColorActive};
$color-background: ${theme.backgroundColor};
$color-background-active: ${theme.backgroundColorActive};
$color-border: ${theme.borderColor};
$color-border-active: ${theme.borderColorActive};
`;
};

const ExportModal = ({ color, ...modalProps }: { color: string } & Omit<ModalProps, 'children'>) => {
    const { options } = useContext(Context);
    const theme = useMemo(() => getThemeColor(color), [color]);
    const scss = useMemo(() => themeToScss(theme, color, options), [theme]);
    const [message, setMessage] = useState<boolean | null>(null);
    const scssRef = useRef(scss);

    const codeRef = useRef(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        codeRef.current && hljs.highlightElement(codeRef.current);
        scssRef.current = scss;
    }, [scss]);

    useEffect(() => {
        const clipboard = new Clipboard(copyButtonRef.current!, {
            text: () => scssRef.current
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
            header="导出主题变量"
            footer={
                <div className="footer">
                    {message === null ? null : (
                        <span className="copy-tip">{message ? '复制成功' : '复制失败请手动复制'}</span>
                    )}
                    <button ref={copyButtonRef} className="copy-button">
                        复制
                    </button>
                </div>
            }
        >
            <div className="export-content">
                <pre>
                    <code className="language-scss" ref={codeRef}>
                        {scss}
                    </code>
                </pre>
            </div>
        </Modal>
    );
};

export default ExportModal;
