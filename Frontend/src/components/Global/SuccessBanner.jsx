import { useState, useEffect } from 'react';

const SuccessBanner = ({ message }) => {
    const [visible, setVisible] = useState(!!message);

    useEffect(() => {
        setVisible(!!message);
    }, [message]);

    if (!visible || !message) return null;

    return (
        <div className="bg-green-100 text-green-800 border border-green-300 rounded-md px-4 py-3 flex items-center justify-between max-w-md shadow-sm">
            <span className="text-sm">{message}</span>
            <button
                className="text-xl font-bold text-green-600 hover:text-green-800 ml-4"
                onClick={() => setVisible(false)}
            >
                &times;
            </button>
        </div>
    );
};

export default SuccessBanner;
