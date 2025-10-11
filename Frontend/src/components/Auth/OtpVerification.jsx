import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { cn, styles } from '../../styles';
import InputField from './InputField'

const OtpVerification = ({ onSubmit, formData, onChange, loading, error, successMessage, onResendOtp }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <div className="text-center mb-8">
            <h2 className={styles.typography.headings.h2}>Enter OTP</h2>
            <p className={cn(styles.typography.body.small, "mt-2")}>
                We've sent a 6-digit code to your email
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
            label="6-Digit OTP"
            name="otp"
            type="text"
            placeholder="000000"
            icon={Lock}
            value={formData.otp}
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
                    Verifying...
                </>
            ) : (
                'Verify OTP'
            )}
        </button>

        <div className="text-center">
            <span className="text-sm text-gray-600">Code expired? </span>
            <button
                type="button"
                onClick={() => onResendOtp()}
                className={cn(styles.buttons.base, styles.buttons.variants.link)}
            >
                Resend OTP
            </button>
        </div>
    </form>
);

export default OtpVerification;