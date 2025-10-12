import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { cn, styles } from '../../styles';
import InputField from './InputField'

const SignUp = ({ onSubmit, formData, onChange, loading, error, onNavigate, passwordFeedback }) => (
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
            label="Email"
            name="username"
            type="text"
            placeholder="Enter your email"
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

        {formData.password && (
            <div className="space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            passwordFeedback?.strength <= 40 ? 'bg-red-500' :
                            passwordFeedback?.strength <= 80 ? 'bg-yellow-500' :
                            'bg-green-500'
                        )}
                        style={{
                            width: passwordFeedback?.strength ? `${passwordFeedback.strength}%` : '0%'
                        }}
                    />
                </div>
                <p className={cn(
                    styles.typography.body.small,
                    passwordFeedback.isStrong ? 'text-green-600' : 'text-gray-600'
                )}>
                    {passwordFeedback.message}
                </p>
            </div>
        )}

        <button
            type="submit"
            disabled={loading || !passwordFeedback.isStrong}
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