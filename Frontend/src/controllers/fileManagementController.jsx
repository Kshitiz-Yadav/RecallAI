import CLIENT from '../api/apiService';

export const initialState = {
    file: null,
    error: null,
    loading: false,
    successMessage: null
};

export const fileUploadReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILE':
            return { ...state, file: action.payload, successMessage: null, error: null };
        case 'UPLOAD_START':
            return { ...state, loading: true, successMessage: null, error: null };
        case 'UPLOAD_SUCCESS':
            return { ...state, loading: false, file: null, successMessage: action.message, error: null, };
        case 'UPLOAD_FAILURE':
            return { ...state, loading: false, file: null, successMessage: null, error: action.error };
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
    } 
    catch (error) {
        dispatch({ type: 'UPLOAD_FAILURE', error: error.message || 'An unknown error occured while uploading the file.' });
    }
}