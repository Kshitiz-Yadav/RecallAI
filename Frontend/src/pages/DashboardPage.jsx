import { useEffect, useReducer, useRef } from 'react';
import { initialState, fileUploadReducer, uploadFile, getFilesSummary } from '../controllers/fileManagementController';
import ErrorBanner from '../components/Global/ErrorBanner';
import SuccessBanner from '../components/Global/SuccessBanner';
import LoadingSpinner from '../components/Global/LoadingSpinner';
import FilesTable from '../components/Dashboard/FilesTable';

const DashboardPage = () => {
    const [state, dispatch] = useReducer(fileUploadReducer, initialState);
    const { file, loading, error, successMessage, userFiles } = state;

    useEffect(() => {
        getFilesSummary(dispatch);
    }, []);
    
    const fileInputRef = useRef();

    const handleFileChange = (event) => {
        dispatch({ type: 'SET_FILE', payload: event.target.files[0] });
    }

    const handleFileUpload = () => {
        if(!file) {
            dispatch({ type: 'UPLOAD_FAILURE', error: 'Please select a file to upload.' });
            return;
        }

        uploadFile(file, dispatch);

        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleRefresh = () => {
        getFilesSummary(dispatch);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <ErrorBanner errorMessage={error} />
            <SuccessBanner message={successMessage} />
            <LoadingSpinner loading={loading} />

            <h3 className="text-xl font-semibold mt-8 mb-2">Uploaded Files</h3>
            <button onClick={handleRefresh} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
                Refresh
            </button>
            <FilesTable userFiles={userFiles} dispatch={dispatch} />
            
            {/* Could be put into a separate file upload component */}
            <h3 className="text-xl font-semibold mt-8 mb-2">Upload a new file</h3>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="mb-2"/>
            <button onClick={handleFileUpload} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                Upload
            </button>
        </div>
    );
}

export default DashboardPage;