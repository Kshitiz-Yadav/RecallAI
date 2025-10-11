import { useState } from 'react';
import { styles } from '../../styles';
import { Play } from 'lucide-react';

const VideoSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className={styles.video.section}>
            <div className={styles.video.container}>
                <div className={styles.video.header}>
                    <h2 className={styles.video.title}>
                        See {" "}
                        <span className={styles.typography.colorHighlight}>Recall AI</span>
                        {" "} in Action!
                    </h2>
                    <p className={styles.video.subtitle}>
                        Watch how easy it is to store and retrieve your important information
                    </p>
                </div>
                <div className={styles.video.videoWrapper}>
                    <div className={styles.video.videoContainer}>
                        {!isPlaying ? (
                            <div
                                className={styles.video.playButton}
                                onClick={() => setIsPlaying(true)}
                            >
                                <Play className={styles.video.playIcon} fill="currentColor" />
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <Play className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                                    <p className="text-lg">Demo video would play here</p>
                                    <button
                                        onClick={() => setIsPlaying(false)}
                                        className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;