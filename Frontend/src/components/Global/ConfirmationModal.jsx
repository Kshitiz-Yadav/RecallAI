import { Trash2, X, AlertTriangle } from 'lucide-react';
import { styles, cn } from '../../styles';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Delete Item", message = "Are you sure you want to delete this item? This action cannot be undone.", itemName = "", isLoading = false, variant = "danger" }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
    };

    const iconColor = variant === 'danger' ? styles.banners.iconColors.error : styles.banners.iconColors.warning;
    const confirmButtonVariant = variant === 'danger' ? 'danger' : 'primary';

    return (
        <div className={styles.modals.overlay}>
            <div
                className={styles.modals.backdrop}
                onClick={handleBackdropClick}
            ></div>
            <div className={styles.modals.container}>
                <div className={cn(styles.modals.base, styles.modals.sizes.sm)}>
                    {/* Header */}
                    <div className={styles.modals.header}>
                        <div className="flex items-center space-x-3">
                            <div className={cn("p-2 rounded-full", variant === 'danger' ? "bg-red-100" : "bg-yellow-100")}>
                                {variant === 'danger' ? (
                                    <Trash2 className={cn("w-5 h-5", iconColor)} />
                                ) : (
                                    <AlertTriangle className={cn("w-5 h-5", iconColor)} />
                                )}
                            </div>
                            <h3 className={styles.modals.title}>{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className={cn(styles.modals.closeButton, "p-2 rounded-md")}
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className={styles.modals.body}>
                        <p className="text-sm text-gray-600">
                            {message}
                        </p>
                        {itemName && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm font-medium text-gray-900">
                                    Item: <span className="font-normal">{itemName}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.modals.footer}>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className={cn(
                                    styles.buttons.base,
                                    styles.buttons.variants.outline,
                                    styles.buttons.sizes.md
                                )}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className={cn(
                                    styles.buttons.base,
                                    styles.buttons.variants[confirmButtonVariant],
                                    styles.buttons.sizes.md,
                                    isLoading && "opacity-75 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
