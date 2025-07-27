import { useReducer, useRef } from 'react';
import { initialState, fileUploadReducer, uploadFile } from '../controllers/fileManagementController';
import ErrorBanner from '../components/Global/ErrorBanner';
import SuccessBanner from '../components/Global/SuccessBanner';
import LoadingSpinner from '../components/Global/LoadingSpinner';

const DashboardPage = () => {
    const [state, dispatch] = useReducer(fileUploadReducer, initialState);
    const { file, loading, error, successMessage } = state;
    
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

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <ErrorBanner errorMessage={error} />
            <SuccessBanner message={successMessage} />
            <LoadingSpinner loading={loading} />
            <p>This is the dashboard page. It will be accessible only after sign-in</p>
            <p>It will contain user-specific information.</p>
            
            <h3 className="text-xl font-semibold mt-8 mb-2">File Upload</h3>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="mb-2"/>
            <button onClick={handleFileUpload} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}

export default DashboardPage;