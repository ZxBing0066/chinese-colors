import { ReactNode, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './modal.scss';

export interface ModalProps {
    children: ReactNode;
    visible?: boolean;
    onClose?: () => void;
    header?: ReactNode;
    footer?: ReactNode;
}

const ModalContainer = ({ children, visible, onClose, header, footer }: ModalProps) => {
    const handleMaskClick = useCallback(() => {
        onClose?.();
    }, []);

    const handleGlobalKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
            onClose?.();
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleGlobalKeyPress);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyPress);
        };
    }, []);

    return (
        <div className="modal" hidden={!visible}>
            <div className="overlay" onClick={handleMaskClick}></div>
            <div className="wrap">
                <div className="body">
                    <header>{header}</header>
                    <div className="content">{children}</div>
                    <footer>{footer}</footer>
                </div>
            </div>
        </div>
    );
};

const modalContainer = document.createElement('div');

const Modal = (props: ModalProps) => {
    useEffect(() => {
        document.body.appendChild(modalContainer);
        return () => {
            document.body.removeChild(modalContainer);
        };
    }, []);

    return ReactDOM.createPortal(<ModalContainer {...props} />, modalContainer);
};

export default Modal;
