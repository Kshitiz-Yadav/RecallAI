import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SignInForm from '../components/Auth/SignInForm';

const SignInPage = () => {
    const [searchParams] = useSearchParams();
    const newUser = searchParams.get('mode') == 'signup';

    const [error, setError] = useState('');

    const setErrorState = (message) => {
        setError(message);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-cyan-400 to-teal-500">
            <div className="relative w-full max-w-sm mb-18">
                {error && (
                    <div className="bold text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}
                <div className="p-8 bg-gray-50 rounded-xl shadow-xl pt-12 mt-6">
                    <SignInForm newUser={newUser} setError={setErrorState} />
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
