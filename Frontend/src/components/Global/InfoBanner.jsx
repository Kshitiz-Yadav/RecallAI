
import { AlertCircle, X } from 'lucide-react';
import { styles, cn } from '../../styles';

const InfoBanner = ({ message, onClose }) => {
    if (!message || message.length === 0) {
        return null;
    }

    return (
        <div className={cn(styles.banners.base, styles.banners.variants.info)}>
            <div className="flex items-center">
                <AlertCircle className={cn("w-5 h-5 flex-shrink-0", styles.banners.iconColors.info)} />
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
                            "hover:bg-blue-100 focus:ring-blue-500"
                        )}
                        aria-label="Close info banner"
                    >
                        <X className={cn("w-4 h-4", styles.banners.iconColors.info)} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default InfoBanner;
