import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { cn, styles } from '../../styles';
import InputField from './InputField'

const SignIn = ({ onSubmit, formData, onChange, loading, error, successMessage, onNavigate }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <div className="text-center mb-8">
            <h2 className={styles.typography.headings.h2}>Welcome Back</h2>
            <p className={cn(styles.typography.body.small, "mt-2")}>
                Sign in to your account to continue
            </p>
        </div>

        {error && (
            <div className={cn(styles.banners.base, styles.banners.variants.error)}>
                <AlertCircle className="w-5 h-5" />
                <span className={styles.banners.message}>{error}</span>
            </div>
        )}

        {successMessage && (
            <div className={cn(styles.banners.base, styles.banners.variants.success)}>
                <AlertCircle className="w-5 h-5" />
                <span className={styles.banners.message}>{successMessage}</span>
            </div>
        )}

        <InputField
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            icon={User}
            value={formData.username}
            onChange={onChange}
            disabled={loading}
        />

        <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={onChange}
            disabled={loading}
        />

        <button
            type="submit"
            disabled={loading}
            className={cn(
                styles.buttons.base,
                styles.buttons.variants.primary,
                styles.buttons.sizes.lg,
                "w-full"
            )}
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                </>
            ) : (
                'Sign In'
            )}
        </button>

        <div className="text-center">
            <button
                type="button"
                onClick={() => onNavigate('resetpasswordrequest')}
                className={cn(styles.buttons.base, styles.buttons.variants.link)}
            >
                Forgot password?
            </button>
        </div>

        <div className="text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <button
                type="button"
                onClick={() => onNavigate('signup')}
                className={cn(styles.buttons.base, styles.buttons.variants.link)}
            >
                Sign Up
            </button>
        </div>
    </form>
);

export default SignIn;