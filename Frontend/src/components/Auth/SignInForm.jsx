import { useState } from 'react';
import { Link } from 'react-router-dom';
import STRINGS from '../../constants/strings';
import * as controller from '../../controllers/authController';

const SignInForm = ({ newUser, setError, setAuthStatus }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (newUser) {
            controller.signUp(email, password, setError, setLoading);
            return;
        }

        controller.signIn(email, password, setError, setLoading, setAuthStatus);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {loading && <h1>LOADING...</h1>}
            <h2 className="text-2xl font-bold text-center text-gray-800">{newUser ? STRINGS.signIn.signUp : STRINGS.signIn.signIn}</h2>
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
                        <Link to="/auth?mode=signin" className="text-indigo-600 font-medium hover:underline cursor-pointer">{STRINGS.signIn.signIn}</Link>
                    </>
                ) : (
                    <>
                        {STRINGS.signIn.noAccount}
                        <Link to="/auth?mode=signup" className="text-indigo-600 font-medium hover:underline cursor-pointer">{STRINGS.signIn.signUp}</Link>
                    </>
                )}
            </div>
        </form>
    )
}

export default SignInForm;