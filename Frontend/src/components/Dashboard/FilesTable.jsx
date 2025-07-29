import { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FileViewModal from './FileViewModal';
import { deleteFile, getFile } from '../../controllers/fileManagementController';

const FilesTable = ({ userFiles, dispatch }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFileViewModal, setShowFileViewModal] = useState(false);
    const [fileContent, setFileContent] = useState(null);

    const handleDeleteClick = (file) => {
        setSelectedFile(file);
        setShowDeleteModal(true);
    };

    const handleFileClick = async (file) => {
        const fetchedFile = await getFile(file.guid, dispatch);
        setSelectedFile(file);
        setFileContent(fetchedFile.rawContent);
        setShowFileViewModal(true);
    };

    const handleDeleteConfirmation = () => {
        deleteFile(selectedFile.guid, dispatch);
        setShowDeleteModal(false);
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const kb = 1024;
        const mb = kb * 1024;

        if (bytes < mb) {
            return `${(bytes / kb).toFixed(2)} KB`;
        } else {
            return `${(bytes / mb).toFixed(2)} MB`;
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }

    return (
        <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-700 uppercase">
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Filename</th>
                        <th className="px-4 py-2">Upload Date</th>
                        <th className="px-4 py-2">Size</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userFiles && userFiles.length > 0 ? (
                        userFiles.map((file, index) => (
                            <tr key={index} className="border-t text-sm">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td
                                    className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                                    onClick={() => handleFileClick(file)}
                                >
                                    {file.name}
                                </td>
                                <td className="px-4 py-2">{formatDate(file.uploadDate)}</td>
                                <td className="px-4 py-2">{formatFileSize(file.size)}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteClick(file)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4 text-gray-500">
                                No files found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    file={selectedFile}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => handleDeleteConfirmation()}
                />
            )}

            {showFileViewModal && (
                <FileViewModal
                    file={selectedFile}
                    fileContent={fileContent}
                    onClose={() => setShowFileViewModal(false)}
                />
            )}
        </div>
    );
};

export default FilesTable;
