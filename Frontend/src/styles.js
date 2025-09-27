export const styles = {
    // Button Designs
    buttons: {
        base: "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

        variants: {
            primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
            secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
            success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
            danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
            warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500",
            outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500 bg-white",
            ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
            link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500"
        },

        sizes: {
            xs: "px-2 py-1 text-xs",
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base",
            xl: "px-8 py-4 text-lg"
        },

        loading: "opacity-75 cursor-not-allowed",
        iconOnly: "p-2"
    },

    // Banner/Alert Designs
    banners: {
        base: "border rounded-lg p-4 flex items-center space-x-3",

        variants: {
            success: "bg-green-50 border-green-600 text-green-600",
            error: "bg-red-50 border-red-600 text-red-600",
            warning: "bg-yellow-50 border-yellow-600 text-yellow-600",
            info: "bg-blue-50 border-blue-600 text-blue-600"
        },

        title: "text-sm font-semibold",
        message: "text-sm font-medium",
        closeButton: "ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2",

        // Icon colors for banners
        iconColors: {
            success: "text-green-500",
            error: "text-red-600",
            warning: "text-yellow-500",
            info: "text-blue-500"
        }
    },

    // Input Field Designs
    inputs: {
        wrapper: "space-y-1",
        label: "block text-sm font-medium text-gray-700",

        base: "block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200",

        states: {
            default: "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
            error: "border-red-300 focus:ring-red-500 focus:border-red-500",
            success: "border-green-300 focus:ring-green-500 focus:border-green-500",
            disabled: "bg-gray-50 text-gray-500 cursor-not-allowed"
        },

        sizes: {
            sm: "px-2 py-1 text-sm",
            md: "px-3 py-2 text-sm",
            lg: "px-4 py-3 text-base"
        },

        withIcon: {
            left: "pl-10",
            right: "pr-10"
        },

        iconWrapper: {
            left: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
            right: "absolute inset-y-0 right-0 pr-3 flex items-center"
        },

        errorText: "text-red-600 text-sm mt-1",
        helpText: "text-gray-500 text-sm mt-1"
    },

    // Card Designs
    cards: {
        base: "bg-white rounded-lg border border-gray-200 shadow-sm",
        header: "px-6 py-4 border-b border-gray-200",
        body: "p-6",
        footer: "px-6 py-4 border-t border-gray-200 bg-gray-50",

        title: "text-lg font-medium text-gray-900",
        subtitle: "text-sm text-gray-500 mt-1",

        variants: {
            elevated: "shadow-lg",
            bordered: "border-2",
            flat: "shadow-none border-0 bg-gray-50"
        },

        headerActions: "flex items-center justify-between"
    },

    // Modal Designs
    modals: {
        overlay: "fixed inset-0 z-50 overflow-y-auto",
        backdrop: "fixed inset-0 bg-black bg-opacity-50 transition-opacity",
        container: "flex min-h-screen items-center justify-center p-4",

        base: "relative bg-white rounded-lg shadow-xl w-full",

        sizes: {
            sm: "max-w-md",
            md: "max-w-lg",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            full: "max-w-7xl"
        },

        header: "flex items-center justify-between p-6 border-b border-gray-200",
        body: "p-6",
        footer: "px-6 py-4 border-t border-gray-200 bg-gray-50",

        title: "text-lg font-medium text-gray-900",
        closeButton: "text-gray-400 hover:text-gray-600 transition-colors"
    },

    // Badge Designs
    badges: {
        base: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",

        variants: {
            default: "bg-gray-100 text-gray-800",
            success: "bg-green-100 text-green-800",
            warning: "bg-yellow-100 text-yellow-800",
            danger: "bg-red-100 text-red-800",
            info: "bg-blue-100 text-blue-800",
            purple: "bg-purple-100 text-purple-800"
        },

        sizes: {
            sm: "px-2 py-0.5 text-xs",
            md: "px-2.5 py-0.5 text-xs",
            lg: "px-3 py-1 text-sm"
        },

        dot: "w-2 h-2 rounded-full mr-1.5"
    },

    // Loading States
    loading: {
        spinner: {
            sm: "w-4 h-4 animate-spin",
            md: "w-6 h-6 animate-spin",
            lg: "w-8 h-8 animate-spin"
        },

        skeleton: {
            base: "animate-pulse bg-gray-200 rounded",
            text: "h-4 bg-gray-200 rounded animate-pulse",
            avatar: "w-10 h-10 bg-gray-200 rounded-full animate-pulse",
            button: "h-10 bg-gray-200 rounded animate-pulse"
        },

        overlay: "absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
    },

    // Table Designs  
    tables: {
        wrapper: "overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg",
        base: "min-w-full divide-y divide-gray-300",

        header: "bg-gray-50",
        headerCell: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",

        body: "bg-white divide-y divide-gray-200",
        row: "hover:bg-gray-50 transition-colors duration-150",
        cell: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",

        striped: "odd:bg-white even:bg-gray-50"
    },

    // Form Designs
    forms: {
        group: "space-y-6",
        row: "grid grid-cols-1 gap-6 sm:grid-cols-2",
        actions: "flex justify-end space-x-3 pt-6 border-t border-gray-200",

        fieldset: "space-y-6",
        legend: "text-lg font-medium text-gray-900 mb-4"
    },

    // Navigation Designs
    navigation: {
        // Header Navigation
        header: {
            base: "bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50",
            container: "flex items-center justify-between h-16",
            
            logo: {
                button: "p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200",
                wrapper: "flex items-center space-x-3",
                icon: "w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center",
                iconText: "text-white font-bold text-sm",
                text: "hidden sm:block text-xl font-bold text-gray-900"
            },

            nav: {
                container: "flex items-center space-x-1",
                item: "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
                itemActive: "bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-500",
                itemText: "ml-2 hidden sm:inline",
                
                // Special styling for logout
                logout: "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500"
            }
        },

        // Sidebar Navigation
        sidebar: {
            base: "flex flex-col w-64 bg-white border-r border-gray-200",
            header: "flex items-center h-16 px-6 border-b border-gray-200",
            nav: "flex-1 px-4 py-6 space-y-1",

            item: "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
            itemActive: "bg-blue-50 text-blue-700",
            itemInactive: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",

            icon: "mr-3 w-5 h-5",
            iconActive: "text-blue-500",
            iconInactive: "text-gray-400 group-hover:text-gray-500"
        },

        topbar: {
            base: "bg-white border-b border-gray-200 px-4 py-4",
            container: "flex items-center justify-between",
            left: "flex items-center space-x-4",
            right: "flex items-center space-x-4"
        }
    },

    // Status Indicators
    status: {
        dot: "inline-block w-2 h-2 rounded-full mr-2",

        colors: {
            online: "bg-green-400",
            offline: "bg-gray-400",
            busy: "bg-red-400",
            away: "bg-yellow-400"
        }
    },

    // Typography
    typography: {
        headings: {
            h1: "text-3xl font-bold text-gray-900",
            h2: "text-2xl font-bold text-gray-900",
            h3: "text-xl font-semibold text-gray-900",
            h4: "text-lg font-semibold text-gray-900",
            h5: "text-base font-semibold text-gray-900",
            h6: "text-sm font-semibold text-gray-900"
        },

        body: {
            large: "text-lg text-gray-700",
            base: "text-base text-gray-700",
            small: "text-sm text-gray-600",
            xs: "text-xs text-gray-500"
        },

        emphasis: {
            strong: "font-semibold text-gray-900",
            muted: "text-gray-500",
            error: "text-red-600",
            success: "text-green-600",
            warning: "text-yellow-600"
        }
    },

    // Spacing and Layout
    spacing: {
        section: "space-y-8",
        content: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        tight: "space-y-4",
        loose: "space-y-12"
    },

    // Usage Bar Component
    usageBar: {
        wrapper: "w-full",
        container: "space-y-2",

        // Header with label and values
        header: "flex items-center justify-between text-sm",
        label: "font-medium text-gray-700",
        values: "text-gray-500",

        // Progress bar container
        barContainer: "w-full bg-gray-200 rounded-full h-2 overflow-hidden",

        // Progress bar fill
        barFill: "h-full rounded-full transition-all duration-300 ease-in-out",

        // Color variants based on usage percentage
        barColors: {
            safe: "bg-green-500",      // < 80%
            warning: "bg-yellow-500",  // 80-99%
            danger: "bg-red-500"       // 100%+
        },

        // Different sizes
        sizes: {
            sm: {
                container: "space-y-1",
                header: "text-xs",
                bar: "h-1"
            },
            md: {
                container: "space-y-2",
                header: "text-sm",
                bar: "h-2"
            },
            lg: {
                container: "space-y-3",
                header: "text-base",
                bar: "h-3"
            }
        },

        // Percentage text
        percentage: "font-mono text-xs text-gray-600"
    }
};

// Utility function to combine classes
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};