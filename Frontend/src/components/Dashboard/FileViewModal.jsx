const FileViewModal = ({ file, fileContent, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
                <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Viewing: {file.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-lg"
                    >
                        ×
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-sm text-gray-800 text-justify">
                        <p>{fileContent}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileViewModal;
