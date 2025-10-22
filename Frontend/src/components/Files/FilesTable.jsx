import ConfirmationModal from '../Global/ConfirmationModal';
import { deleteFile, getFile } from '../../controllers/fileManagementController';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye, Trash2, File, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { styles, cn } from '../../styles';
import Modal from '../Global/Modal';

const FilesTable = ({ files = [], dispatch }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('uploadDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileContent, setFileContent] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Status mapping
    const statusMap = {
        0: { label: 'Pending', variant: 'warning' },
        1: { label: 'Processing', variant: 'info' },
        2: { label: 'Ready', variant: 'success' }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection(field === 'uploadDate' ? 'desc' : 'asc');
        }
        setCurrentPage(1);
    };

    // Sort and paginate data
    const sortedFiles = useMemo(() => {
        return [...files].sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'uploadDate') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (sortField === 'size') {
                aVal = Number(aVal);
                bVal = Number(bVal);
            } else if (sortField === 'name') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }, [files, sortField, sortDirection]);

    const totalPages = Math.ceil(sortedFiles.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedFiles = sortedFiles.slice(startIndex, startIndex + pageSize);

    // Handle view file
    const handleViewFile = async (file) => {
        const fetchedFile = await getFile(file.guid, dispatch);
        setSelectedFile(file);
        setFileContent(fetchedFile.rawContent);
        setShowModal(true);
    };

    // Handle delete file
    const handleDeleteFile = (file) => {
        setSelectedFile(file);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmation = () => {
        deleteFile(selectedFile.guid, dispatch);
        setShowDeleteModal(false);
    }

    // Render sort icon
    const renderSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4 ml-1" /> :
            <ChevronDown className="w-4 h-4 ml-1" />;
    };

    if (!files || files.length === 0) {
        return (
            <div className={cn(styles.historyTable.wrapper)}>
                <div className={styles.historyTable.empty.wrapper}>
                    <MessageSquare className={styles.historyTable.empty.icon} />
                    <h3 className={styles.historyTable.empty.title}>No uploaded files</h3>
                    <p className={styles.historyTable.empty.description}>
                        Your files will appear here once you upload some.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cards.base}>
            <div className={styles.tables.wrapper}>
                <div className="overflow-x-auto">
                    <table className={cn(styles.tables.base, "min-w-full")}>
                        <thead className={styles.tables.header}>
                            <tr>
                                <th className={cn(styles.tables.headerCell, "w-16")}>
                                    #
                                </th>
                                <th
                                    className={cn(styles.tables.headerCell, "cursor-pointer hover:bg-gray-100 w-80")}
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Filename</span>
                                        <span className="flex-shrink-0 ml-2">
                                            {renderSortIcon('name')}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    className={cn(styles.tables.headerCell, "cursor-pointer hover:bg-gray-100 w-40")}
                                    onClick={() => handleSort('uploadDate')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Upload Date</span>
                                        <span className="flex-shrink-0 ml-2">
                                            {renderSortIcon('uploadDate')}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    className={cn(styles.tables.headerCell, "cursor-pointer hover:bg-gray-100 w-24")}
                                    onClick={() => handleSort('size')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Size</span>
                                        <span className="flex-shrink-0 ml-2">
                                            {renderSortIcon('size')}
                                        </span>
                                    </div>
                                </th>
                                <th className={cn(styles.tables.headerCell, "w-28")}>
                                    Status
                                </th>
                                <th className={cn(styles.tables.headerCell, "w-24")}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={styles.tables.body}>
                            {paginatedFiles.map((file, index) => (
                                <tr key={file.guid} className={styles.tables.row}>
                                    <td className={cn(styles.tables.cell, "w-16")}>
                                        {startIndex + index + 1}
                                    </td>
                                    <td className={cn(styles.tables.cell, "w-80")}>
                                        <div className="flex items-center">
                                            <File className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                            <span className="font-medium truncate" title={file.name}>
                                                {file.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={cn(styles.tables.cell, "w-40")}>
                                        {formatDate(file.uploadDate)}
                                    </td>
                                    <td className={cn(styles.tables.cell, "w-24")}>
                                        {formatFileSize(file.size)}
                                    </td>
                                    <td className={cn(styles.tables.cell, "w-28")}>
                                        <span className={cn(
                                            styles.badges.base,
                                            styles.badges.variants[statusMap[file.status].variant]
                                        )}>
                                            {statusMap[file.status].label}
                                        </span>
                                    </td>
                                    <td className={cn(styles.tables.cell, "w-24")}>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleViewFile(file)}
                                                className={cn(
                                                    styles.buttons.base,
                                                    styles.buttons.variants.ghost,
                                                    styles.buttons.sizes.sm,
                                                    styles.buttons.iconOnly
                                                )}
                                                title="View file"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(file)}
                                                className={cn(
                                                    styles.buttons.base,
                                                    styles.buttons.variants.ghost,
                                                    styles.buttons.sizes.sm,
                                                    styles.buttons.iconOnly,
                                                    "text-red-600 hover:text-red-700 hover:bg-red-50"
                                                )}
                                                title="Delete file"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={styles.historyTable.pagination.wrapper}>
                    <div className="flex flex-col md:flex-row items-center md:justify-between w-full space-y-4 md:space-y-0">
                        {/* Page info */}
                        <div className={cn(styles.historyTable.pagination.info, "text-center md:text-left")}>
                            Showing <span className={styles.historyTable.pagination.infoHighlight}>
                                {startIndex + 1}
                            </span> to <span className={styles.historyTable.pagination.infoHighlight}>
                                {Math.min(startIndex + pageSize, sortedFiles.length)}
                            </span> of <span className={styles.historyTable.pagination.infoHighlight}>
                                {sortedFiles.length}
                            </span> files
                        </div>

                        {/* Page size selector */}
                        <div className={cn(styles.historyTable.pagination.pageSize.wrapper, "text-center")}>
                            <span className={styles.historyTable.pagination.pageSize.label}>
                                Show:
                            </span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className={cn(
                                    styles.historyTable.pagination.pageSize.select,
                                    "ml-2"
                                )}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        {/* Pagination controls */}
                        <div className={cn(styles.historyTable.pagination.controls, "flex justify-center w-full md:w-auto")}>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={cn(
                                    styles.historyTable.pagination.button.base,
                                    currentPage === 1
                                        ? styles.historyTable.pagination.button.disabled
                                        : styles.historyTable.pagination.button.enabled
                                )}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={cn(
                                            styles.historyTable.pagination.button.base,
                                            currentPage === pageNum
                                                ? styles.historyTable.pagination.button.current
                                                : styles.historyTable.pagination.button.enabled
                                        )}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={cn(
                                    styles.historyTable.pagination.button.base,
                                    currentPage === totalPages || totalPages === 0
                                        ? styles.historyTable.pagination.button.disabled
                                        : styles.historyTable.pagination.button.enabled
                                )}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {showDeleteModal && (
                    <ConfirmationModal
                        itemName={selectedFile ? selectedFile.name : ''}
                        title='Delete File?'
                        message='Are you sure you want to delete this file? This action cannot be undone.'
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => handleDeleteConfirmation()}
                    />
                )}

                {/* View File Modal */}
                {showModal && selectedFile && (
                    <Modal title={`File Content - ${selectedFile.name}`} isOpen={showModal} onClose={() => setShowModal(false)}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-900 mt-1 text-justify">{fileContent}</p>
                            </div>
                        </div>
                    </Modal>

                )}
            </div>
        </div>
    );
};

export default FilesTable;