import { useState, useMemo } from 'react';
import { styles, cn } from '../../styles';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { ModelLabels } from '../../enums/models';
import ReactMarkdown from 'react-markdown';

const HistoryTable = ({ data = [], className = "" }) => {
    const [expandedItems, setExpandedItems] = useState(new Set());

    // Toggle item expansion
    const toggleExpansion = (index) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedItems(newExpanded);
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (error) {
            return timestamp;
        }
    };

    // Group data by date
    const groupedData = useMemo(() => {
        const groups = {};
        data.forEach((item, index) => {
            const date = new Date(item.timeStamp).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push({ ...item, originalIndex: index });
        });

        const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
        return sortedDates.map(date => ({
            date,
            items: groups[date]
        }));
    }, [data]);

    // Flatten grouped data for pagination
    const flattenedData = useMemo(() => {
        const flattened = [];
        groupedData.forEach(group => {
            flattened.push({ type: 'header', date: group.date });
            group.items.forEach(item => {
                flattened.push({ type: 'item', ...item });
            });
        });
        return flattened;
    }, [groupedData]);

    // Format date for group headers
    const formatDateHeader = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className={cn(styles.historyTable.wrapper, className)}>
                <div className={styles.historyTable.empty.wrapper}>
                    <MessageSquare className={styles.historyTable.empty.icon} />
                    <h3 className={styles.historyTable.empty.title}>No chat history</h3>
                    <p className={styles.historyTable.empty.description}>
                        Your conversation history will appear here once you start chatting.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(styles.historyTable.wrapper, className)}>
            <div>
                {flattenedData.map((item, _) => {
                    if (item.type === 'header') {
                        return (
                            <div key={`header-${item.date}`} className="px-6 py-4 bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                    {formatDateHeader(item.date)}
                                </h3>
                            </div>
                        );
                    }

                    const globalIndex = item.originalIndex;
                    const isExpanded = expandedItems.has(globalIndex);

                    return (
                        <div key={globalIndex} className={styles.historyTable.item.container}>
                            <div
                                className={styles.historyTable.item.summary.wrapper}
                                onClick={() => toggleExpansion(globalIndex)}
                            >
                                <div className={styles.historyTable.item.summary.content}>
                                    <div className={styles.historyTable.item.summary.left}>
                                        <div className={styles.historyTable.item.question}>
                                            {item.question}
                                        </div>
                                        <div className={styles.historyTable.item.timestamp}>
                                            {formatTimestamp(item.timeStamp)}
                                        </div>
                                        <div className={styles.historyTable.item.model}>
                                            {ModelLabels[item.chatModel]}
                                        </div>
                                    </div>
                                    <div className={styles.historyTable.item.summary.right}>
                                        <button
                                            className={styles.historyTable.item.expandButton.base}
                                            aria-label={isExpanded ? "Collapse response" : "Expand response"}
                                        >
                                            <ChevronDown
                                                className={cn(
                                                    styles.historyTable.item.expandButton.icon,
                                                    isExpanded && styles.historyTable.item.expandButton.iconExpanded
                                                )}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className={styles.historyTable.item.details.wrapper}>
                                    <div className={styles.historyTable.item.details.content}>
                                        <ReactMarkdown>{item.answer}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HistoryTable;