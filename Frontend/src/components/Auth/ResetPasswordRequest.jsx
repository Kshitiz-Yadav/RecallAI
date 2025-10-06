import { User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { cn, styles } from '../../styles';
import InputField from './InputField'

const ResetPasswordRequest = ({ onSubmit, formData, onChange, loading, error, onNavigate }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <button
            type="button"
            onClick={() => onNavigate('signin')}
            className={cn(styles.buttons.base, styles.buttons.variants.ghost, styles.buttons.sizes.md)}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
        </button>

        <div className="text-center mb-8">
            <h2 className={styles.typography.headings.h2}>Forgot Password?</h2>
            <p className={cn(styles.typography.body.small, "mt-2")}>
                Enter your username to request password reset
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
            placeholder="Enter your username"
            icon={User}
            value={formData.username}
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
                    Sending reset request...
                </>
            ) : (
                'Request Reset'
            )}
        </button>
    </form>
);

export default ResetPasswordRequest;