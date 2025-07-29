import CLIENT from '../api/apiService';

export const initialState = {
    file: null,
    error: null,
    loading: false,
    successMessage: null,
    userFiles: null
};

export const fileUploadReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILE':
            return { ...state, file: action.payload };
        case 'LOADING_START':
            return { ...state, loading: true };
        case 'UPLOAD_SUCCESS':
            return { ...state, loading: false, file: null, successMessage: action.message, error: null, };
        case 'UPLOAD_FAILURE':
            return { ...state, loading: false, file: null, successMessage: null, error: action.error };
        case 'GET_ALL_FILES_SUCCESS':
            return { ...state, loading: false, userFiles: action.data, error: null };
        case 'GET_ALL_FILES_FAILURE':
            return { ...state, loading: false, userFiles: null, successMessage: null, error: action.error };
        case 'DELETE_FILE_SUCCESS':
            return { ...state, loading: false, successMessage: action.message, error: null };
        case 'DELETE_FILE_FAILURE':
            return { ...state, loading: false, successMessage: null, error: action.error };
        case 'GET_FILE_SUCCESS':
            return { ...state, loading: false, error: null };
        case 'GET_FILE_FAILURE':
            return { ...state, loading: false, successMessage: null, error: action.error };
        default:
            return state;
    }
}

export const uploadFile = async (file, dispatch) => {
    dispatch({ type: 'UPLOAD_START' });
    try {
        var formData = new FormData();
        formData.append('File', file);
        await CLIENT.fileUploadAsync(formData);
        dispatch({ type: 'UPLOAD_SUCCESS', message: 'File uploaded successfully!' });

        await getFilesSummary(dispatch);
    } 
    catch (error) {
        dispatch({ type: 'UPLOAD_FAILURE', error: error.message || 'An unknown error occured while uploading the file.' });
    }
}

export const getFilesSummary = async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try{
        const files = await CLIENT.getAllFilesAsync();
        dispatch({ type: 'GET_ALL_FILES_SUCCESS', data: files });
    }
    catch (error) {
        dispatch({ type: 'GET_ALL_FILES_FAILURE', error: error.message || 'An unknown error occurred while fetching files.' });
    }
}

export const deleteFile = async (fileId, dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        await CLIENT.deleteFileAsync(fileId);
        dispatch({ type: 'DELETE_FILE_SUCCESS', message: 'File deleted successfully!' });

        await getFilesSummary(dispatch);
    }
    catch (error) {
        dispatch({ type: 'DELETE_FILE_FAILURE', error: error.message || 'An unknown error occurred while deleting the file.' });
    }
}

export const getFile = async (fileId, dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const file = await CLIENT.getFileAsync(fileId);
        dispatch({ type: 'GET_FILE_SUCCESS' });
        return file;
    }
    catch (error) {
        dispatch({ type: 'GET_FILE_FAILURE', error: error.message || 'An unknown error occurred while deleting the file.' });
    }
}