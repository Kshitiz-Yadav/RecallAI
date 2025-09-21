import CLIENT from '../api/apiService';

export const initialState = {
    loading: false,
    usageLimits: null,
    monthlyUsage: null
}

export const resourceUsageReducer = (state, action) => {
    switch (action.type) {
        case 'LOADING_START':
            return { ...state, loading: true, usageLimits: null, monthlyUsage: null, error: null };
        case 'GET_USAGE_SUCCESS':
            return { ...state, loading: false, usageLimits: action.limits, monthlyUsage: action.usage, error: null };
        case 'GET_USAGE_FAILURE':
            return { ...state, loading: false, usageLimits: null, monthlyUsage: null, error: action.error };
        default:
            return state;
    }
}

export const getResourceUsage = async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try{
        const limits = await CLIENT.getUsageLimitsAsync();
        const usage = await CLIENT.getMonthlyUsageAsync();
        dispatch({ type: 'GET_USAGE_SUCCESS', usage: usage, limits: limits });
    }
    catch (error) {
        dispatch({ type: 'GET_USAGE_FAILURE', error: error.message || 'An unknown error occurred while fetching resource usage.' });
    }
}