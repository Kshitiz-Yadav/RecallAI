import { useEffect, useReducer } from "react";
import { resourceUsageReducer, initialState, getResourceUsage } from "../controllers/resourceUsageController";
import ErrorBanner from "../components/Global/ErrorBanner";
import LoadingSpinner from "../components/Global/LoadingSpinner";

const ResourceUsagePage = () => {
    const [state, dispatch] = useReducer(resourceUsageReducer, initialState);
    const { loading, usageLimits, monthlyUsage, error } = state;

    useEffect(() => {
        getResourceUsage(dispatch);
    }, []);

    const allKeys = Array.from(
        new Set([
            ...Object.keys(usageLimits || {}),
            ...Object.keys(monthlyUsage || {}),
        ])
    );

    return (
        <div className="p-4">
            <ErrorBanner errorMessage={error} />
            <LoadingSpinner loading={loading} />
            <h2 className="text-lg font-semibold mb-2">Resource Usage</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1 text-left">Resource</th>
                        <th className="border border-gray-300 px-2 py-1">Monthly Input</th>
                        <th className="border border-gray-300 px-2 py-1">Monthly Output</th>
                        <th className="border border-gray-300 px-2 py-1">Limit Input</th>
                        <th className="border border-gray-300 px-2 py-1">Limit Output</th>
                    </tr>
                </thead>
                <tbody>
                    {allKeys.map((key) => {
                        const monthly = monthlyUsage?.[key] || { input: "-", output: "-" };
                        const limit = usageLimits?.[key] || { input: "-", output: "-" };

                        return (
                            <tr key={key} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-2 py-1">{key}</td>
                                <td className="border border-gray-300 px-2 py-1">{monthly.input}</td>
                                <td className="border border-gray-300 px-2 py-1">{monthly.output}</td>
                                <td className="border border-gray-300 px-2 py-1">{limit.input}</td>
                                <td className="border border-gray-300 px-2 py-1">{limit.output}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ResourceUsagePage;