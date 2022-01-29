import { ReactNode, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

console.log(ReactDOM);

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

    return (
        <div className="modal" hidden={!visible}>
            <div className="overlay" onClick={handleMaskClick}></div>
            <div className="body">
                <header>{header}</header>
                <div className="content">{children}</div>
                <footer>{footer}</footer>
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
