import { useState, useEffect } from 'react';
import { X, Trash2, Info } from 'lucide-react';
import { styles, cn } from '../../styles';
import Tooltip from '../Global/Tooltip';
import { Models, ModelLabels } from '../../enums/models';
import FilesDropdown from './FilesDropdown';

const CustomizePanel = ({ isOpen, onClose, settings, onSettingsChange, files }) => {
    const [selectedFiles, setSelectedFiles] = useState(settings.selectedFiles?.map(file =>
        typeof file === 'object' ? file : { guid: file, name: files.find(f => f.guid === file)?.name || file }
    ) || []);
    const [topK, setTopK] = useState(settings.topK || 5);
    const [chatModel, setChatModel] = useState(settings.chatModel || Models.Gpt4oMini);
    const [maxWords, setMaxWords] = useState(settings.maxWords || 500);

    useEffect(() => {
        onSettingsChange({
            selectedFiles: selectedFiles.map(file => file.guid),
            topK,
            chatModel,
            maxWords,
        });
    }, [selectedFiles, topK, chatModel, maxWords]);

    const handleFileSelect = (guid) => {
        if (!selectedFiles.some(file => file.guid === guid)) {
            const selectedFile = files.find(file => file.guid === guid);
            setSelectedFiles([...selectedFiles, { guid: selectedFile.guid, name: selectedFile.name }]);
        }
    };

    const handleFileRemove = (guid) => {
        setSelectedFiles(selectedFiles.filter(file => file.guid !== guid));
    };

    if (!isOpen) return null;

    return (
        <div className="w-80 bg-white border border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Customize</h2>
                <button
                    onClick={onClose}
                    className={cn(
                        styles.buttons.base,
                        styles.buttons.variants.ghost,
                        "p-2"
                    )}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* File Selection */}
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label className={styles.inputs.label}>Select Files</label>
                        <Tooltip text="Choose the documents to include in the chat context for better precision. Not selecting any files leads to usage of all available documents.">
                            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                        </Tooltip>
                    </div>
                    <FilesDropdown
                        files={files}
                        selectedFiles={selectedFiles}
                        onSelect={handleFileSelect} />

                    {/* Selected Files */}
                    <div className="mt-3 space-y-2">
                        {selectedFiles.map(file => (
                            <div
                                key={file.guid}
                                className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200"
                            >
                                <span className="text-sm text-gray-900 truncate">{file.name}</span>
                                <button
                                    onClick={() => handleFileRemove(file.guid)}
                                    className="ml-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top K Slider */}
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label className={styles.inputs.label}>Top K</label>
                        <Tooltip text="Set the number of most relevant document chunks to retrieve. Higher values provide more context, but may include less relevant info.">
                            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                        </Tooltip>
                        <span className="ml-auto text-sm font-medium text-blue-600">{topK}</span>
                    </div>
                    <input
                        type="range"
                        min="3"
                        max="11"
                        value={topK}
                        onChange={(e) => setTopK(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>3</span>
                        <span>11</span>
                    </div>
                </div>

                {/* Chat Model Selection */}
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label className={styles.inputs.label}>Chat Model</label>
                        <Tooltip text="Select the LLM model to use for generating responses. Different models have varying response styles and usage limits.">
                            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                        </Tooltip>
                    </div>
                    <select
                        value={chatModel}
                        onChange={(e) => setChatModel(e.target.value)}
                        className={cn(styles.inputs.base, styles.inputs.states.default, "mt-1")}
                    >
                        {Object.keys(ModelLabels).map(modelValue => (
                            <option key={modelValue} value={modelValue}>{ModelLabels[modelValue]}</option>
                        ))}
                    </select>
                </div>

                {/* Max Words Input */}
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label className={styles.inputs.label}>Max Words</label>
                        <Tooltip text="Set the maximum number of words in the LLM's response. Lower values provides concise answers and higher values provide detailed explanations.">
                            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                        </Tooltip>
                    </div>
                    <input
                        type="number"
                        min="10"
                        max="1000"
                        value={maxWords}
                        onChange={(e) => setMaxWords(parseInt(e.target.value))}
                        className={cn(styles.inputs.base, styles.inputs.states.default, "mt-1")}
                        placeholder="Enter max words"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomizePanel;