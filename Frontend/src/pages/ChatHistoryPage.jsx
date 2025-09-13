import { useEffect, useReducer } from "react";
import { initialState, chatHistoryReducer, getChatHistory } from "../controllers/chatHistoryController";
import ErrorBanner from "../components/Global/ErrorBanner";
import LoadingSpinner from "../components/Global/LoadingSpinner";

const ChatHistoryPage = () => {
    const [state, dispatch] = useReducer(chatHistoryReducer, initialState);
    const { loading, chatHistory, error } = state;

    useEffect(() => {
        getChatHistory(dispatch);
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <ErrorBanner errorMessage={error} />
            <LoadingSpinner loading={loading} />
            <h1>Chat History</h1>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Question</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {chatHistory.map((chat, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {chat.timeStamp}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {chat.question}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {chat.answer}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChatHistoryPage;
