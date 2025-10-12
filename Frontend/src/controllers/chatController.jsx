import CLIENT from '../api/apiService';

export const initialState = {
    loading: false,
    isFetchingAnswer: false,
    error: null,
    info: null,
    files: [],
    messages: []
}

export const chatReducer = (state, action) => {
    const chatLimit = 20;
    switch (action.type) {
        case 'LOADING_START':
            return { ...state, loading: true, files: [], error: null };
        case 'GET_ALL_FILES_SUCCESS':
            return { ...state, loading: false, files: action.data, error: null };
        case 'NO_FILES_UPLOADED':
            return { ...state, loading: false, files: [], info: action.info, error: null };
        case 'GET_ALL_FILES_FAILURE':
            return { ...state, loading: false, files: [], error: action.error };
        case 'FETCHING_ANSWER':
            return { ...state, isFetchingAnswer: true };
        case 'FETCHING_ANSWER_SUCCESS':
            return { ...state, isFetchingAnswer: false, messages: [...state.messages.slice(-(chatLimit - 1)), action.data] };
        case 'FETCHING_ANSWER_FAILURE':
            return { ...state, isFetchingAnswer: false, error: action.error };
        case 'ADD_USER_MESSAGE':
            return { ...state, messages: [...state.messages.slice(-(chatLimit - 1)), action.data] };
        case 'CLEAR_ERRORS':
            return { ...state, error: null };
        case 'CLEAR_MESSAGES':
            return { ...state, info: null };
        default:
            return state;
    }
}

export const getFilesSummary = async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const files = await CLIENT.getAllFilesAsync();
        if (!files || files.length === 0) {
            dispatch({ type: 'NO_FILES_UPLOADED', info: 'You haven\'t uploaded files. Upload files to get started.' });
            return;
        }

        dispatch({ type: 'GET_ALL_FILES_SUCCESS', data: files });
    }
    catch (error) {
        dispatch({ type: 'GET_ALL_FILES_FAILURE', error: error.message });
    }
}

export const askQuestion = async (question, settings, dispatch) => {
    dispatch({ type: 'FETCHING_ANSWER' });
    try {
        const requestData = {
            question: question,
            fileGuids: settings.selectedFiles,
            topK: settings.topK,
            maxWords: settings.maxWords,
            chatModel: settings.chatModel
        };

        const response = await CLIENT.askQuestionAsync(requestData);
        const aiMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.response,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        dispatch({ type: 'FETCHING_ANSWER_SUCCESS', data: aiMessage });
    }
    catch (error) {
        dispatch({ type: 'FETCHING_ANSWER_FAILURE', error: error.message });
    }
}