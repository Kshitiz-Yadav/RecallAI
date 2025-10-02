import { useState } from 'react';
import { Settings, MessageSquareText } from 'lucide-react';
import ChatWindow from '../components/Chat/ChatWindow';
import CustomizePanel from '../components/Chat/CustomizePanel';
import { styles, cn } from '../styles';

const ChatPage = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        selectedFiles: [],
        topK: 5,
        chatModel: 'gpt-4',
        maxWords: 500,
    });
    const oldChatLimit = 20; 

    const handleSendMessage = async (content) => {
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev.slice(-(oldChatLimit - 1)), userMessage]);
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: `This is a simulated response to: "${content}". In a real application, this would query your RAG system using the selected files (${settings.selectedFiles.length} files), top K of ${settings.topK}, using ${settings.chatModel} model with max ${settings.maxWords} words.`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev.slice(-(oldChatLimit - 1)), aiMessage]);
            setIsLoading(false);
        }, 150);
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
                            Settings
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex h-[calc(100vh-16rem)] space-x-4">
                    <ChatWindow
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        oldChatLimit={oldChatLimit}
                    />
                    <CustomizePanel
                        isOpen={isPanelOpen}
                        onClose={() => setIsPanelOpen(false)}
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;