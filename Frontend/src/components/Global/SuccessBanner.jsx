
import { AlertCircle, X } from 'lucide-react';
import { styles, cn } from '../../styles';

const SuccessBanner = ({ message, onClose }) => {
    if (!message || message.length === 0) {
        return null;
    }

    return (
        <div className={cn(styles.banners.base, styles.banners.variants.success)}>
            <div className="flex items-center">
                <AlertCircle className={cn("w-5 h-5 flex-shrink-0", styles.banners.iconColors.success)} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={styles.banners.message}>
                    {message}
                </div>
            </div>
            {onClose && (
                <div className="flex items-center ml-3">
                    <button
                        onClick={onClose}
                        className={cn(
                            styles.banners.closeButton,
                            "hover:bg-green-100 focus:ring-green-500"
                        )}
                        aria-label="Close success banner"
                    >
                        <X className={cn("w-4 h-4", styles.banners.iconColors.success)} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuccessBanner;
