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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        switch (view) {
            case 'signup':
                await signUp(dispatch, formData);
                break;
            case 'otp':
                verifyOtp(dispatch, formData);
                break;
            case 'resetpasswordrequest':
                resetPasswordRequest(dispatch, formData);
                break;
            case 'resetpassword':
                resetPassword(dispatch, formData);
                break;
            case 'signin':
            default:
                await signIn(dispatch, formData, setAuthStatus);
                break;
        }

        setFormData(prev => ({ username: prev.username, password: '', otp: '' }));
    };

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
                return <SignUp {...commonProps} />;
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
