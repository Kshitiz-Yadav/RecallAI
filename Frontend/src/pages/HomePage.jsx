import { Brain, Zap, Shield, Clock, BookOpen, TrendingUp, Play, ChevronRight, Sparkles } from 'lucide-react';
import homePageImage from '../../public/homePageImage.png';
import VideoSection from '../components/Home/VideoSection';
import FeatureCard from '../components/Home/FeatureCard';
import { styles } from '../styles';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const features = [
        {
            icon: Brain,
            title: "Advanced AI Chat Models",
            description: "Choose from GPT-4, GPT-5, and other powerful OpenAI models to get the most accurate answers from your documents.",
            gradient: "from-blue-500 to-blue-600",
        },
        {
            icon: Zap,
            title: "Semantic Search",
            description: "Powered by text embeddings and vector search, find exactly what you need across all your documents instantly.",
            gradient: "from-yellow-500 to-orange-500",
        },
        {
            icon: BookOpen,
            title: "Smart Document Processing",
            description: "Upload your documents and let our AI automatically chunk, embed, and index them for intelligent retrieval.",
            gradient: "from-green-500 to-emerald-600",
        },
        {
            icon: Shield,
            title: "User Authentication",
            description: "Secure access with multi-factor authentication ensures your documents remain private and safe.",
            gradient: "from-purple-500 to-purple-600",
        },
        {
            icon: TrendingUp,
            title: "Resource Management",
            description: "Monitor your storage, embedding tokens, and model usage with detailed analytics and usage limits.",
            gradient: "from-pink-500 to-rose-600",
        },
        {
            icon: Clock,
            title: "Chat History",
            description: "Keep track of all your AI conversations and document interactions with a comprehensive chat history system.",
            gradient: "from-indigo-500 to-blue-600",
        },
    ];


    return (
        <div className={styles.page.container}>
            {/* Hero Section */}
            <section className={styles.hero.section}>
                <div className={styles.hero.container}>
                    <div className={styles.hero.grid}>
                        <div className={styles.hero.content}>
                            <h1 className={styles.hero.heading}>
                                Welcome to{" "}
                                <span className={styles.typography.colorHighlight}>Recall AI</span>!
                            </h1>
                            <div className={styles.hero.badge}>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Your knowledge, amplified!
                            </div>
                            <p className={styles.hero.description}>
                                Never forget anything important again! Recall AI uses advanced artificial intelligence to help you store, organize, and retrieve your thoughts, notes, and information exactly when you need them.
                                <br />Your personal memory assistant that's always there for you!
                            </p>
                            <div className={styles.hero.actions}>
                                <Link to='/chat' className={`${styles.buttons.base} ${styles.buttons.variants.primary} ${styles.buttons.sizes.xl}`}>
                                    Get Started for Free
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Link>
                            </div>
                        </div>

                        <div className={styles.hero.imageWrapper}>
                            <div className="relative">
                                <div className="bg-white rounded-xl p-0 shadow-lg">
                                    <img src={homePageImage} alt='Recall AI Illustration' className="w-full h-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features.section}>
                <div className={styles.features.container}>
                    <div className={styles.features.header}>
                        <h2 className={styles.features.title}>
                            Powerful Features to {" "}
                            <span className={styles.typography.colorHighlight}>Amplify Your Knowledge</span>!
                        </h2>
                        <p className={styles.features.subtitle}>
                            Everything you need to recall information effortlessly
                        </p>
                    </div>
                    <div className={styles.features.grid}>
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Demo Section */}
            {/* <VideoSection /> */}

            {/* CTA Section */}
            <section className={styles.cta.section}>
                <div className={styles.cta.container}>
                    <h2 className={styles.cta.title}>Ready to Never Forget Again?</h2>
                    <p className={styles.cta.description}>
                        Get your own RAG-based assistant
                    </p>
                    <Link to="/chat" className={styles.cta.button}>
                        Start for Free
                        <ChevronRight className="w-6 h-6 ml-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;