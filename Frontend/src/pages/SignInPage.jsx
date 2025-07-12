import { useState } from 'react';
import STRINGS from '../constants/strings';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [newUser, setNewUser] = useState(false);


    const handleSignIn = (credentials) => {
        console.log('Sign in attempted with:', credentials);
        window.location.href = '/home';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        handleSignIn({ email, password });
    };

    const handleNewUser = (isNewUser) => {
        setNewUser(isNewUser);
        setEmail('');
        setPassword('');
        setError('');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-cyan-400 to-teal-500">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-10 mb-18">
                <div className="flex items-center">
                    <img src="/RecallAI_Logo.jpg" alt="Recall AI Logo" className="h-16 w-auto object-contain rounded-full" />
                    <img src="/RecallAI_Title.jpg" alt="Recall AI Title" className="h-16 w-auto object-contain rounded-full" />
                </div>
            </div>
            <div className="relative w-full max-w-sm mt-18">
                <div className="p-8 bg-gray-50 rounded-xl shadow-xl pt-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800">{newUser ? STRINGS.signIn.signUp : STRINGS.signIn.signIn}</h2>
                        {error && (
                            <div className="text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700 tracking-wide uppercase">
                                {STRINGS.signIn.emailLabel}
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700 tracking-wide uppercase">
                                {STRINGS.signIn.passwordLabel}
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                        >
                            {newUser ? STRINGS.signIn.signUp : STRINGS.signIn.signIn}
                        </button>
                        <div className="text-sm text-center text-gray-600">
                            {newUser ? (
                                <>
                                    {STRINGS.signIn.existingUser}
                                    <a className="text-indigo-600 font-medium hover:underline cursor-pointer"
                                        onClick={() => handleNewUser(false)}
                                    >
                                        {STRINGS.signIn.signIn}
                                    </a>
                                </>
                            ) : (
                                <>
                                    {STRINGS.signIn.noAccount}
                                    <a className="text-indigo-600 font-medium hover:underline cursor-pointer"
                                        onClick={() => handleNewUser(true)}
                                    >
                                        {STRINGS.signIn.signUp}
                                    </a>
                                </>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>


    );
};

export default SignInForm;
