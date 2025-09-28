const DeleteConfirmationModal = ({ file, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-4">
                    Are you sure you want to delete <span className="font-medium">{file.name}</span>?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
