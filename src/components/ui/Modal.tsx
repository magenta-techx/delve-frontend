import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    overlayClassName?: string;
    contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    overlayClassName = "flex items-center justify-center ",
    contentClassName = "",
}) => {
    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 backdrop-blur-sm bg-[#FFFFFF14] rounded-3xl ${overlayClassName}`}
            onClick={onClose} // close on overlay click
        >
            <div
                className={`absolute ${contentClassName}`}
                onClick={(e) => e.stopPropagation()} // prevent close on content click
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
