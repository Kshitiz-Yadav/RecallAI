import { useState, useEffect } from 'react';

const ErrorBanner = ({ errorMessage }) => {
    const [visible, setVisible] = useState(!!errorMessage);

    useEffect(() => {
        setVisible(!!errorMessage);
    }, [errorMessage]);

    if (!visible || !errorMessage) return null;

    return (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded-md px-4 py-3 flex items-center justify-between max-w-md shadow-sm">
            <span className="text-sm">{errorMessage}</span>
            <button
                className="text-xl font-bold text-red-600 hover:text-red-800 ml-4"
                onClick={() => setVisible(false)}
            >
                &times;
            </button>
        </div>
    );
};

export default ErrorBanner;
