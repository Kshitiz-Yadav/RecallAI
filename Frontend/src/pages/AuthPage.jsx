import { useState, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, styles } from '../styles';
import { authReducer, initialState, signUp, signIn, verifyOtp, resendOtp, resetPassword, resetPasswordRequest } from '../controllers/authController';
import SignIn from '../components/Auth/SignIn';
import SignUp from '../components/Auth/SignUp';
import OtpVerification from '../components/Auth/OtpVerification';
import ResetPasswordRequest from '../components/Auth/ResetPasswordRequest';
import ResetPassword from '../components/Auth/ResetPassword';

const AuthPage = ({ setAuthStatus }) => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { loading, error, view, successMessage, redirect } = state;
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        otp: '',
    });
    const [passwordFeedback, setPasswordFeedback] = useState({
        strength: 0,
        message: '',
        isStrong: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Update password strength feedback in real-time
        if (name === 'password') {
            const feedback = checkPasswordStrength(value);
            console.log('Password feedback:', feedback); // Add logging to debug
            setPasswordFeedback(feedback);
        }
    };

    const handleNavigate = (newView) => {
        dispatch({ type: 'SET_VIEW', view: newView });
        dispatch({ type: 'CLEAR_MESSAGES' });
        setFormData(prev => ({ username: prev.username, password: '', otp: '' }));
    };

    const handleResendOtp = async () => {
        resendOtp(dispatch, formData);
    };

    useEffect(() => {
        if (redirect == true) {
            navigate('/chat');
        }
    }, [redirect, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = cleanFormData();
        if (!validateFormData(cleanedData)) {
            return;
        }

        switch (view) {
            case 'signup':
                await signUp(dispatch, cleanedData);
                break;
            case 'otp':
                verifyOtp(dispatch, cleanedData);
                break;
            case 'resetpasswordrequest':
                resetPasswordRequest(dispatch, cleanedData);
                break;
            case 'resetpassword':
                resetPassword(dispatch, cleanedData);
                break;
            case 'signin':
            default:
                await signIn(dispatch, cleanedData, setAuthStatus);
                break;
        }

        setFormData(prev => ({ username: prev.username, password: '', otp: '' }));
    };

    const cleanFormData = () => {
        return {
            username: formData.username.trim(),
            password: formData.password.trim(),
            otp: formData.otp.trim()
        };
    };

    const validateFormData = (data) => {
        switch (view) {
            case 'signup':
                if (!data.username) {
                    dispatch({ type: 'SET_ERROR', error: 'Email is required' });
                    return false;
                }
                if (!data.password) {
                    dispatch({ type: 'SET_ERROR', error: 'Password is required' });
                    return false;
                }
                break;
            case 'otp':
                if (!data.otp) {
                    dispatch({ type: 'SET_ERROR', error: 'OTP is required' });
                    return false;
                }
                break;
            case 'resetpasswordrequest':
                if (!data.username) {
                    dispatch({ type: 'SET_ERROR', error: 'Email is required' });
                    return false;
                }
                break;
            case 'resetpassword':
                if (!data.password) {
                    dispatch({ type: 'SET_ERROR', error: 'Password is required' });
                    return false;
                }
                if (!data.otp) {
                    dispatch({ type: 'SET_ERROR', error: 'OTP is required' });
                    return false;
                }
                break;
            case 'signin':
            default:
                if (!data.username) {
                    dispatch({ type: 'SET_ERROR', error: 'Email is required' });
                    return false;
                }
                if (!data.password) {
                    dispatch({ type: 'SET_ERROR', error: 'Password is required' });
                    return false;
                }
                break;
        }

        return true;
    };

    const checkPasswordStrength = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        let strength = 0;
        let message = [];

        // Check length
        if (password.length >= minLength) {
            strength += 20;
        } else {
            message.push(`Password must be at least ${minLength} characters long`);
        }

        // Check for lower case letters
        if (hasLowerCase) {
            strength += 20;
        } else {
            message.push('Password must contain at least one lowercase letter');
        }

        // Check for upper case letters
        if (hasUpperCase) {
            strength += 20;
        } else {
            message.push('Password must contain at least one uppercase letter');
        }

        // Check for lower case letters
        if (hasNumbers) {
            strength += 20;
        } else {
            message.push('Password must contain at least one number');
        }

        // Check for numbers and special characters
        if (hasSpecialChars) {
            strength += 20;
        } else {
            message.push('Password must contain at least one special character');
        }

        // Return result object
        return {
            strength, // 0 to 100
            isStrong: strength === 100,
            message: message.length > 0 ? message.join('. ') : 'Password is strong'
        };
    }

    const renderView = () => {
        const commonProps = {
            onSubmit: handleSubmit,
            formData,
            onChange: handleInputChange,
            loading,
            error,
            successMessage,
            onNavigate: handleNavigate,
            onResendOtp: handleResendOtp
        };

        switch (view) {
            case 'signup':
                return <SignUp {...commonProps} passwordFeedback={passwordFeedback} />;
            case 'otp':
                return <OtpVerification {...commonProps} />;
            case 'resetpasswordrequest':
                return <ResetPasswordRequest {...commonProps} />;
            case 'resetpassword':
                return <ResetPassword {...commonProps} />;
            case 'signin':
            default:
                return <SignIn {...commonProps} />;
        }
    };

    return (
        <div className={styles.page.container}>
            <div className="flex items-center justify-center min-h-screen py-4">
                <div className="w-full max-w-sm">
                    <div className={cn(styles.cards.base, styles.cards.body, "my-0")}>
                        {renderView()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
