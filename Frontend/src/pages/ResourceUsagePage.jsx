import { useEffect, useReducer } from "react";
import { resourceUsageReducer, initialState, getResourceUsage } from "../controllers/resourceUsageController";
import ErrorBanner from "../components/Global/ErrorBanner";
import LoadingSpinner from "../components/Global/LoadingSpinner";
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { styles, cn } from '../styles';
import UsageBar from "../components/Usage/UsageBar";


const ResourceUsagePage = () => {
    const [state, dispatch] = useReducer(resourceUsageReducer, initialState);
    const { loading, usageLimits, monthlyUsage, error } = state;

    const desiredOrder = [
        "FileStorage",
        "TextEmbedding3Small",
        "Gpt4oMini",
        "Gpt41Mini",
        "Gpt5Mini",
        "Gpt4o",
        "Gpt41",
        "Gpt5"
    ];

    useEffect(() => {
        getResourceUsage(dispatch);
    }, []);

    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    }

    // Helper function to format resource names
    const formatResourceName = (resourceKey) => {
        return resourceKey
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    // Helper function to get usage status
    const getUsageStatus = (used, limit) => {
        const percentage = (used / limit) * 100;
        if (percentage >= 100) return { status: 'danger', icon: AlertTriangle };
        if (percentage >= 80) return { status: 'warning', icon: AlertTriangle };
        return { status: 'success', icon: CheckCircle };
    };

    // Calculate overall stats
    const calculateOverallStats = () => {
        let totalResources = 0;
        let highUsageResources = 0;
        let overLimitResources = 0;

        Object.keys(usageLimits).forEach(resource => {
            const limits = usageLimits[resource];
            const usage = monthlyUsage[resource] || { input: 0, output: 0 };

            // Count input if limit > 0
            if (limits.input > 0) {
                totalResources++;
                const inputPercentage = (usage.input / limits.input) * 100;
                if (inputPercentage >= 100) overLimitResources++;
                else if (inputPercentage >= 80) highUsageResources++;
            }

            // Count output if limit > 0
            if (limits.output > 0) {
                totalResources++;
                const outputPercentage = (usage.output / limits.output) * 100;
                if (outputPercentage >= 100) overLimitResources++;
                else if (outputPercentage >= 80) highUsageResources++;
            }
        });

        return { totalResources, highUsageResources, overLimitResources };
    };

    const stats = calculateOverallStats();

    return (
        <div className={styles.page.container}>
            <div className={styles.page.content}>
                {/* Header */}
                <div className={styles.page.header.wrapper}>
                    <div className={styles.page.header.title}>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        <h1 className={styles.typography.headings.h1}>Resource Usage Dashboard</h1>
                    </div>
                    <p className={styles.typography.body.base}>
                        Monitor your monthly resource consumption and limits
                    </p>
                </div>

                <div className={styles.banners.placement}>
                    <ErrorBanner errorMessage={error} onClose={clearErrors} />
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className={styles.cards.base}>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <BarChart3 className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Resources</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cards.base}>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Normal Usage</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.totalResources - stats.highUsageResources - stats.overLimitResources}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cards.base}>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">High Usage</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.highUsageResources}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cards.base}>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Over Limit</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.overLimitResources}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Usage Details */}
                <div className={styles.spacing.section}>
                    {Object.keys(usageLimits)
                        .sort((a, b) => {
                            const indexA = desiredOrder.indexOf(a);
                            const indexB = desiredOrder.indexOf(b);

                            // Put unknown keys at the end
                            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                            if (indexA === -1) return 1;
                            if (indexB === -1) return -1;

                            return indexA - indexB;
                        })
                        .map((resourceKey) => {
                            const limits = usageLimits[resourceKey];
                            const usage = monthlyUsage[resourceKey] || { input: 0, output: 0 };

                            // Skip if both limits are 0
                            if (limits.input === 0 && limits.output === 0) return null;

                            return (
                                <div key={resourceKey} className={styles.cards.base}>
                                    <div className={styles.cards.header}>
                                        <div className="flex items-center justify-between">
                                            <h3 className={styles.cards.title}>
                                                {formatResourceName(resourceKey)}
                                            </h3>
                                            <div className="flex space-x-2">
                                                {limits.input > 0 && (
                                                    <span className={cn(
                                                        styles.badges.base,
                                                        styles.badges.variants[getUsageStatus(Math.max(0, usage.input), limits.input).status]
                                                    )}>
                                                        Input: {((Math.max(0, usage.input) / limits.input) * 100).toFixed(1)}%
                                                    </span>
                                                )}
                                                {limits.output > 0 && (
                                                    <span className={cn(
                                                        styles.badges.base,
                                                        styles.badges.variants[getUsageStatus(Math.max(0, usage.output), limits.output).status]
                                                    )}>
                                                        Output: {((Math.max(0, usage.output) / limits.output) * 100).toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.cards.body}>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Input Usage Bar */}
                                            {limits.input > 0 && (
                                                <UsageBar
                                                    used={Math.max(0, usage.input)}
                                                    limit={limits.input}
                                                    label="Input"
                                                    formatValue={(value) => resourceKey === 'FileStorage' ? `${parseFloat((value / (1024 * 1024)).toFixed(4))} MB` : `${value} tokens`}
                                                />
                                            )}

                                            {/* Output Usage Bar */}
                                            {limits.output > 0 && (
                                                <UsageBar
                                                    used={Math.max(0, usage.output)}
                                                    limit={limits.output}
                                                    label="Output"
                                                    formatValue={(value) => `${value} tokens`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
            <LoadingSpinner loading={loading} text="Fetching resource usage..." />
        </div>
    );
};

export default ResourceUsagePage;
