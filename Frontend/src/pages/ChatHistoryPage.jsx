import { useState, useEffect, useReducer } from "react";
import { initialState, chatHistoryReducer, getChatHistory } from "../controllers/chatHistoryController";
import { styles, cn } from "../styles";
import HistoryTable from "../components/History/HistoryTable";
import ErrorBanner from "../components/Global/ErrorBanner";
import LoadingSpinner from "../components/Global/LoadingSpinner";
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const ChatHistoryPage = () => {
    const [state, dispatch] = useReducer(chatHistoryReducer, initialState);
    const { loading, chatHistory, error } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

    useEffect(() => {
        getChatHistory(dispatch, currentPage - 1, pageSize);
    }, []);

    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    }

    const handlePageChange = (nextData) => {
        var skip = nextData ? (currentPage) * pageSize : (currentPage - 2) * pageSize;
        getChatHistory(dispatch, skip, pageSize);
        setCurrentPage(nextData ? currentPage + 1 : currentPage - 1);
    }

    return (
        <div className={styles.page.container}>
            <div className={styles.page.content}>
                {/* Header */}
                <div className={styles.page.header.wrapper}>
                    <div className={styles.page.header.title}>
                        <Clock className="w-8 h-8 text-blue-600" />
                        <h1 className={styles.typography.headings.h1}>Chat History</h1>
                    </div>
                    <p className={styles.typography.body.base}>
                        View your previous conversations
                    </p>
                </div>

                <div className={styles.banners.placement}>
                    <ErrorBanner errorMessage={error} onClose={clearErrors} />
                </div>

                {/* History Table */}
                <div className={styles.spacing.section}>
                    <HistoryTable
                        data={chatHistory}
                    />
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center w-full mt-4">
                    <button
                        onClick={() => handlePageChange(false)}
                        disabled={currentPage === 1}
                        className={cn(
                            styles.historyTable.pagination.button.base,
                            currentPage === 1
                                ? styles.historyTable.pagination.button.disabled
                                : styles.historyTable.pagination.button.enabled
                        )}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <button
                        onClick={() => handlePageChange(true)}
                        disabled={chatHistory.length < pageSize}
                        className={cn(
                            styles.historyTable.pagination.button.base,
                            chatHistory.length < pageSize
                                ? styles.historyTable.pagination.button.disabled
                                : styles.historyTable.pagination.button.enabled
                        )}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <LoadingSpinner loading={loading} text="Fetching chat history..." />
        </div>
    );
};

export default ChatHistoryPage;
