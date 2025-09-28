import { styles, cn } from '../styles';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className={styles.notFound.container}>
                {/* Large 404 Display */}
                <div className={styles.notFound.errorCode}>
                    404
                </div>

                {/* Title and Description */}
                <h1 className={styles.notFound.title}>
                    Page Not Found
                </h1>
                <h2 className={styles.notFound.subtitle}>
                    Oops! The page you're looking for doesn't exist.
                </h2>
                <p className={styles.notFound.description}>
                    The page you are trying to access may have been moved, deleted, or you might have entered an incorrect URL.
                </p>

                {/* Action Buttons */}
                <div className={styles.notFound.actions}>
                    <button
                        onClick={handleGoHome}
                        className={cn(
                            styles.buttons.base,
                            styles.buttons.variants.primary,
                            styles.buttons.sizes.lg,
                            "w-full sm:w-auto"
                        )}
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go Home
                    </button>

                    <button
                        onClick={handleGoBack}
                        className={cn(
                            styles.buttons.base,
                            styles.buttons.variants.outline,
                            styles.buttons.sizes.lg,
                            "w-full sm:w-auto"
                        )}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>


            </div>
        </div>
    );
};

export default NotFoundPage;