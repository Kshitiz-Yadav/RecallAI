import { useState, useEffect, useReducer } from 'react';
import { Settings, MessageSquareText } from 'lucide-react';
import ChatWindow from '../components/Chat/ChatWindow';
import CustomizePanel from '../components/Chat/CustomizePanel';
import { styles, cn } from '../styles';
import { chatReducer, initialState, getFilesSummary, askQuestion } from '../controllers/chatController';
import LoadingSpinner from '../components/Global/LoadingSpinner';
import ErrorBanner from '../components/Global/ErrorBanner';
import { Models } from '../enums/models';

const ChatPage = () => {
    const [state, dispatch] = useReducer(chatReducer, initialState);
    const { loading, error, files, isFetchingAnswer, messages } = state;

    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [settings, setSettings] = useState({
        selectedFiles: [],
        topK: 5,
        chatModel: Models.Gpt4oMini,
        maxWords: 500,
    });
    const oldChatLimit = 20;

    useEffect(() => {
        getFilesSummary(dispatch);
    }, []);

    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    }

    const handleSendMessage = async (content) => {
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        dispatch({ type: 'ADD_USER_MESSAGE', data: userMessage });
        await askQuestion(content, settings, dispatch);
    };

    const handleSettingsChange = (newSettings) => {
        setSettings(newSettings);
    };

    return (
        <div className={styles.page.container}>
            <div className={styles.page.content}>
                {/* Header */}
                <div className={styles.page.header.wrapper}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={styles.page.header.title}>
                                <MessageSquareText className="w-8 h-8 text-blue-600" />
                                <h1 className={styles.typography.headings.h1}>Chat</h1>
                            </div>
                            <p className={styles.typography.body.base}>
                                Ask questions about your uploaded documents
                            </p>
                        </div>
                        <button
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                            className={cn(
                                styles.buttons.base,
                                styles.buttons.variants.primary,
                                styles.buttons.sizes.md
                            )}
                        >
                            <Settings className="w-5 h-5 mr-2" />
                            Customize
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                <div className={styles.banners.placement}>
                    <ErrorBanner errorMessage={error} onClose={clearErrors} />
                </div>

                {/* Main Content */}
                <div className="flex h-[calc(100vh-16rem)] space-x-4">
                    <ChatWindow
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isFetchingAnswer={isFetchingAnswer}
                        oldChatLimit={oldChatLimit}
                    />
                    <CustomizePanel
                        isOpen={isPanelOpen}
                        onClose={() => setIsPanelOpen(false)}
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        files={files}
                    />
                </div>

                <LoadingSpinner loading={loading} />
            </div>
        </div>
    );
};

export default ChatPage;