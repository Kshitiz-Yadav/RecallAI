import { styles, cn } from "../../styles";

const UsageBar = ({
    used,
    limit,
    label = "Usage",
    size = "md",
    showPercentage = false,
    showValues = true,
    className = "",
    formatValue = (value) => value.toLocaleString()
}) => {
    // Calculate percentage
    const percentage = Math.min((used / limit) * 100, 100);

    // Determine color based on usage percentage
    const getBarColor = () => {
        if (percentage >= 100) {
            return styles.usageBar.barColors.danger;
        }
        if (percentage >= 80) {
            return styles.usageBar.barColors.warning;
        }
        return styles.usageBar.barColors.safe;
    };

    // Get size-specific classes
    const sizeStyles = styles.usageBar.sizes[size];

    return (
        <div className={cn(styles.usageBar.wrapper, className)}>
            <div className={cn(styles.usageBar.container, sizeStyles.container)}>

                {/* Header with label and values */}
                {(label || showValues || showPercentage) && (
                    <div className={cn(styles.usageBar.header, sizeStyles.header)}>
                        <div className="flex items-center">
                            <span className={styles.usageBar.label}>{label}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            {showValues && (
                                <span className={styles.usageBar.values}>
                                    {formatValue(used)} / {formatValue(limit)}
                                </span>
                            )}
                            {showPercentage && (
                                <span className={styles.usageBar.percentage}>
                                    {percentage.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                <div className={cn(styles.usageBar.barContainer, sizeStyles.bar)}>
                    <div
                        className={cn(styles.usageBar.barFill, getBarColor())}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UsageBar;