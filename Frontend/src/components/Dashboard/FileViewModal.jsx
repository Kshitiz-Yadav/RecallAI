const FileViewModal = ({ file, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Viewing: {file.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-lg"
                    >
                        ×
                    </button>
                </div>
                <div className="whitespace-pre-wrap text-sm text-gray-800">
                    <p>(File content goes here)</p>
                </div>
            </div>
        </div>
    );
};

export default FileViewModal;
