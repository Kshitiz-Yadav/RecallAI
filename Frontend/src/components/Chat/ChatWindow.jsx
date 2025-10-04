import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Info } from 'lucide-react';
import { styles, cn } from '../../styles';

const ChatWindow = ({ messages, onSendMessage, oldChatLimit, isFetchingAnswer }) => {
    const [inputValue, setInputValue] = useState('');
    const [showHistoryBanner, setShowHistoryBanner] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isFetchingAnswer]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (container.scrollTop === 0 && messages.length >= oldChatLimit) {
                setShowHistoryBanner(true);
            }
            else {
                setShowHistoryBanner(false);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [messages.length]);

    const handleSend = () => {
        if (inputValue.trim() && !isFetchingAnswer) {
            onSendMessage(inputValue);
            setInputValue('');
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className={cn(
                    "flex-1 p-4",
                    messages.length > 0 || isFetchingAnswer ? "overflow-y-auto space-y-4" : "overflow-hidden"
                )}
            >
                {showHistoryBanner && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-sm text-blue-900">
                            Older messages can be found in the <span className="font-semibold">History</span> section
                        </p>
                    </div>
                )}
                {messages.length === 0 && !isFetchingAnswer ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Ask questions by typing below</h3>
                            <p className="text-gray-500">Older messages can be found in the history section</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex",
                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[70%] rounded-lg px-4 py-3 shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-900"
                                    )}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    <span className={cn(
                                        "text-xs mt-1 block",
                                        msg.role === 'user' ? "text-blue-100" : "text-gray-500"
                                    )}>
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isFetchingAnswer && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg px-4 py-3 shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-end space-x-2">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows="3"
                        className={cn(
                            styles.inputs.base,
                            styles.inputs.states.default,
                            "resize-none"
                        )}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isFetchingAnswer}
                        className={cn(
                            styles.buttons.base,
                            styles.buttons.variants.primary,
                            styles.buttons.sizes.md,
                            "h-[76px]"
                        )}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
