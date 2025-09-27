
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { styles, cn } from '../../styles';

const ErrorBanner = ({ errorMessage, onClose }) => {
    if (!errorMessage) {
        return null;
    }

    return (
        <div className={cn(styles.banners.base, styles.banners.variants.error)}>
            <div className="flex items-center">
                <AlertCircle className={cn("w-5 h-5 flex-shrink-0", styles.banners.iconColors.error)} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={styles.banners.message}>
                    {errorMessage}
                </div>
            </div>
            {onClose && (
                <div className="flex items-center ml-3">
                    <button
                        onClick={onClose}
                        className={cn(
                            styles.banners.closeButton,
                            "hover:bg-red-100 focus:ring-red-500"
                        )}
                        aria-label="Close error banner"
                    >
                        <X className={cn("w-4 h-4", styles.banners.iconColors.error)} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ErrorBanner;
