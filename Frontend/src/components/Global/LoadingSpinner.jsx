const LoadingSpinner = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white" />
        </div>
    );
};

export default LoadingSpinner;
