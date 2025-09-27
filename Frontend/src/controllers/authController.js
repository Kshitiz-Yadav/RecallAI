import { signInAsync, signUpAsync } from '../api/apiService';
import { setCookie } from '../utils/cookieUtils'

export async function signIn(email, password, setError, setLoading, setAuthStatus) {
    try {
        setLoading(true);
        var token = await signInAsync(email, password);
        const expiresInDays = 7;
        setCookie('recall-token', token, expiresInDays);
        setAuthStatus(true);
        window.location.href = '/dashboard';
    }
    catch (err) {
        console.error('Sign-in failed:', err);
        setError('Sign-in failed: ' + err.response?.data || err.message || 'Unknown error');
    }
    finally {
        setLoading(false);
    }
}

export async function signUp(email, password, setError, setLoading) {
    try {
        setLoading(true);
        await signUpAsync(email, password);
        window.location.href = '/auth?mode=signin';
    }
    catch (err) {
        console.error('Sign-up failed:', err);
        setError('Sign-up failed: ' + err.response?.data || err.message || 'Unknown error');
    }
    finally {
        setLoading(false);
    }
}