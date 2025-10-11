import { cn, styles } from '../../styles';

const InputField = ({ label, name, type, placeholder, icon: Icon, value, onChange, error, disabled }) => (
    <div className={styles.inputs.wrapper}>
        <label className={styles.inputs.label}>{label}</label>
        <div className="relative">
            {Icon && (
                <div className={styles.inputs.iconWrapper.left}>
                    <Icon className="w-5 h-5 text-gray-400" />
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    styles.inputs.base,
                    Icon ? styles.inputs.withIcon.left : '',
                    error ? styles.inputs.states.error : styles.inputs.states.default
                )}
                disabled={disabled}
            />
        </div>
        {error && <p className={styles.inputs.errorText}>{error}</p>}
    </div>
);

export default InputField;