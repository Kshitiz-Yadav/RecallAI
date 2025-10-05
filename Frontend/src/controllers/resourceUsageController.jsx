import CLIENT from '../api/apiService';

export const initialState = {
    loading: false,
    usageLimits: {},
    monthlyUsage: {}
}

export const resourceUsageReducer = (state, action) => {
    switch (action.type) {
        case 'LOADING_START':
            return { ...state, loading: true, usageLimits: {}, monthlyUsage: {}, error: null };
        case 'GET_USAGE_SUCCESS':
            return { ...state, loading: false, usageLimits: action.limits, monthlyUsage: action.usage, error: null };
        case 'GET_USAGE_FAILURE':
            return { ...state, loading: false, usageLimits: {}, monthlyUsage: {}, error: action.error };
        case 'CLEAR_ERRORS':
            return { ...state, error: null };
        default:
            return state;
    }
}

export const getResourceUsage = async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const limits = await CLIENT.getUsageLimitsAsync();
        const usage = await CLIENT.getMonthlyUsageAsync();
        dispatch({ type: 'GET_USAGE_SUCCESS', usage: usage, limits: limits });
    }
    catch (error) {
        dispatch({ type: 'GET_USAGE_FAILURE', error: error.message });
    }
}