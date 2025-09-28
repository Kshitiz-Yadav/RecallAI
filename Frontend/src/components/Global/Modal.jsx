import { styles, cn } from "../../styles";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modals.overlay}>
            <div className={styles.modals.backdrop} onClick={onClose} />
            <div className={styles.modals.container}>
                <div className={cn(styles.modals.base, styles.modals.sizes.lg)}>
                    {/* Modal Header */}
                    <div className={styles.modals.header}>
                        <h3 className={styles.modals.title}>{title}</h3>
                        <button
                            onClick={onClose}
                            className={styles.modals.closeButton}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className={styles.modals.body}>
                        {children}
                    </div>

                    {/* Modal Footer */}
                    <div className={styles.modals.footer}>
                        <button
                            onClick={onClose}
                            className={cn(
                                styles.buttons.base,
                                styles.buttons.variants.primary,
                                styles.buttons.sizes.md
                            )}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;