import CLIENT, { getErrorMessage } from '../api/apiService';
import { setCookie } from '../utils/cookieUtils'

export const initialState = {
    error: null,
    loading: false,
    view: 'signin',
    successMessage: null,
    redirect: false
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOADING_START':
            return { ...state, loading: true };
        case 'CLEAR_MESSAGES':
            return { ...state, error: null, successMessage: null };
        case 'SET_VIEW':
            return { ...state, view: action.view };
        case 'REQUEST_FAILURE':
            return { ...state, loading: false, error: action.error, successMessage: null };
        case 'SIGNIN_SUCCESS':
            return { ...state, loading: false, error: null, successMessage: null, redirect: true };
        case 'REQUEST_SUCCESS':
            return { ...state, loading: false, view: action.view, error: null, successMessage: action.message || null };
        case 'RESEND_OTP_SUCCESS':
            return { ...state, loading: false, error: null, successMessage: "OTP resent successfully" };
    }
}

export const signIn = async (dispatch, formdata, setAuthStatus) => {
    dispatch({ type: 'LOADING_START' });
    try {
        localStorage.setItem('recall-username', formdata.username);
        var token = await CLIENT.signInAsync(formdata.username, formdata.password, "");
        setCookie('recall-token', token, 1);
        setAuthStatus(true);
        localStorage.removeItem('recall-username');
        dispatch({ type: 'SIGNIN_SUCCESS' });
    }
    catch (error) {
        if (error?.response?.status == 401) {
            await CLIENT.sendOtpAsync(formdata.username, "", "");
            dispatch({ type: 'REQUEST_SUCCESS', view: 'otp', message: getErrorMessage(error) });
        }
        else {
            dispatch({ type: 'REQUEST_FAILURE', error: getErrorMessage(error) });
        }
    }
}

export const signUp = async (dispatch, formdata) => {
    dispatch({ type: 'LOADING_START' });
    try {
        localStorage.setItem('recall-username', formdata.username);
        await CLIENT.signUpAsync(formdata.username, formdata.password, "");
        dispatch({ type: 'REQUEST_SUCCESS', view: 'otp' });
    }
    catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', error: error.message });
    }
}

export const verifyOtp = async (dispatch, formdata) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const username = localStorage.getItem('recall-username');
        await CLIENT.verifyOtpAsync(username, "", formdata.otp);
        localStorage.removeItem('recall-username');
        dispatch({ type: 'REQUEST_SUCCESS', view: 'signin', message: "Account verified successfully!" });
    }
    catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', error: error.message });
    }
}

export const resetPasswordRequest = async (dispatch, formdata) => {
    dispatch({ type: 'LOADING_START' });
    try {
        localStorage.setItem('recall-username', formdata.username);
        await CLIENT.sendOtpAsync(formdata.username, "", "");
        dispatch({ type: 'REQUEST_SUCCESS', view: 'resetpassword' });
    }
    catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', error: error.message });
    }
}

export const resetPassword = async (dispatch, formdata) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const username = localStorage.getItem('recall-username');
        await CLIENT.resetPasswordAsync(username, formdata.password, formdata.otp);
        localStorage.removeItem('recall-username');
        dispatch({ type: 'REQUEST_SUCCESS', view: 'signin', message: "Password reset successfully!" });
    }
    catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', error: error.message });
    }
}

export const resendOtp = async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const username = localStorage.getItem('recall-username');
        await CLIENT.sendOtpAsync(username, "", "");
        dispatch({ type: 'RESEND_OTP_SUCCESS' });
    }
    catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', error: error.message });
    }
}