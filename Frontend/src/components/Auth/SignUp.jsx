import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { cn, styles } from '../../styles';
import InputField from './InputField'

const SignUp = ({ onSubmit, formData, onChange, loading, error, onNavigate }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <div className="text-center mb-8">
            <h2 className={styles.typography.headings.h2}>Create Account</h2>
            <p className={cn(styles.typography.body.small, "mt-2")}>
                Sign up to get started
            </p>
        </div>

        {error && (
            <div className={cn(styles.banners.base, styles.banners.variants.error)}>
                <AlertCircle className="w-5 h-5" />
                <span className={styles.banners.message}>{error}</span>
            </div>
        )}

        <InputField
            label="Username"
            name="username"
            type="text"
            placeholder="Choose a username"
            icon={User}
            value={formData.username}
            onChange={onChange}
            disabled={loading}
        />

        <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
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
                    Creating account...
                </>
            ) : (
                'Sign Up'
            )}
        </button>

        <div className="text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <button
                type="button"
                onClick={() => onNavigate('signin')}
                className={cn(styles.buttons.base, styles.buttons.variants.link)}
            >
                Sign In
            </button>
        </div>
    </form>
);

export default SignUp;