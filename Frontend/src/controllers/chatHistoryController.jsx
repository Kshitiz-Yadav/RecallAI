import CLIENT from '../api/apiService';

export const initialState = {
    loading: false,
    chatHistory: []
}

export const chatHistoryReducer = (state, action) => {
    switch (action.type) {
        case 'LOADING_START':
            return { ...state, loading: true, chatHistory: [], error: null };
        case 'GET_CHAT_HISTORY_SUCCESS':
            return { ...state, loading: false, chatHistory: action.data, error: null };
        case 'GET_CHAT_HISTORY_FAILURE':
            return { ...state, loading: false, chatHistory: [], error: action.error };
        default:
            return state;
    }
}

export const getChatHistory = async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try{
        const chatHistory = await CLIENT.getChatHistoryAsync();
        dispatch({ type: 'GET_CHAT_HISTORY_SUCCESS', data: chatHistory });
    }
    catch (error) {
        dispatch({ type: 'GET_CHAT_HISTORY_FAILURE', error: error.message || 'An unknown error occurred while fetching chat history.' });
    }
}