import { useState, useEffect, useReducer, useRef } from 'react';
import { initialState, fileUploadReducer, uploadFile, getFilesSummary } from '../controllers/fileManagementController';
import ErrorBanner from '../components/Global/ErrorBanner';
import SuccessBanner from '../components/Global/SuccessBanner';
import LoadingSpinner from '../components/Global/LoadingSpinner';
import FilesTable from '../components/Files/FilesTable';
import { styles, cn } from '../styles';
import { File, RefreshCw, Upload, X } from 'lucide-react';

const FilesPage = () => {
    const [state, dispatch] = useReducer(fileUploadReducer, initialState);
    const { loading, error, successMessage, userFiles } = state;

    useEffect(() => {
        getFilesSummary(dispatch);
    }, []);

    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 1) {
            dispatch({ type: 'UPLOAD_FAILURE', error: "Only a single file upload can be uploaded at once." });
            return;
        }
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        uploadFile(file, dispatch);
    };

    const handleRefresh = () => {
        getFilesSummary(dispatch);
    };

    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    }

    const clearSuccessMessages = () => {
        dispatch({ type: 'CLEAR_SUCCESS_MESSAGES' });
    }

    return (
        <div className={styles.page.container}>
            <div className={styles.page.content}>
                {/* Header */}
                <div className={styles.page.header.wrapper}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={styles.page.header.title}>
                                <File className="w-8 h-8 text-blue-600" />
                                <h1 className={styles.typography.headings.h1}>Files</h1>
                            </div>
                            <p className={styles.typography.body.base}>
                                Manage and upload your files
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className={cn(
                                styles.buttons.base,
                                styles.buttons.variants.success,
                                styles.buttons.sizes.md
                            )}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>


                <div className={styles.banners.placement}>
                    <ErrorBanner errorMessage={error} onClose={clearErrors} />
                </div>

                <div className={styles.banners.placement}>
                    <SuccessBanner message={successMessage} onClose={clearSuccessMessages} />
                </div>

                {/* Upload Area */}
                <div className={cn(styles.cards.base, "mb-8")}>
                    <div className={styles.cards.body}>
                        <div
                            className={cn(
                                "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200",
                                dragActive
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Drop files here to upload
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Or click to select files from your computer
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    styles.buttons.base,
                                    styles.buttons.variants.primary,
                                    styles.buttons.sizes.md
                                )}
                                disabled={loading}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Select Files
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                {/* Files Table */}
                <FilesTable files={userFiles} dispatch={dispatch} />

                <LoadingSpinner loading={loading} />
            </div>
        </div>
    );
};

export default FilesPage;