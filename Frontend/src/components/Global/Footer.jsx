import { useState } from 'react';
import { Github, Linkedin, Mail, Bot, Brain, Instagram } from 'lucide-react';
import { styles, cn } from '../../styles';
import Modal from './Modal';

// Legal Content Components
const PrivacyPolicyContent = () => (
    <div className="prose max-w-none">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Information We Collect</h4>
        <p className="text-gray-700 mb-4">
            We collect information you provide directly to us, such as when you create an account,
            use our services, or contact us for support. This may include your name, email address,
            and any other information you choose to provide.
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">How We Use Your Information</h4>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>To provide and maintain our services</li>
            <li>To improve and personalize your experience</li>
            <li>To communicate with you about our services</li>
            <li>To detect and prevent fraud and abuse</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Security</h4>
        <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. However, no method of
            transmission over the Internet is 100% secure.
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h4>
        <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at recallai@gmail.com
        </p>
    </div>
);

const TermsOfServiceContent = () => (
    <div className="prose max-w-none">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Acceptance of Terms</h4>
        <p className="text-gray-700 mb-4">
            By accessing and using Recall AI, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to these terms, you may not use
            or access this service.
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Use License</h4>
        <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use Recall AI for personal, non-commercial
            transitory viewing only. This is the grant of a license, not a transfer of title,
            and under this license you may not:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Disclaimer</h4>
        <p className="text-gray-700 mb-4">
            The materials on Recall AI are provided on an 'as is' basis. Recall AI makes no warranties,
            expressed or implied, and hereby disclaims and negates all other warranties including
            without limitation, implied warranties or conditions of merchantability.
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
        <p className="text-gray-700">
            For questions about these Terms of Service, contact us at recallai@gmail.com
        </p>
    </div>
);

const CookiePolicyContent = () => (
    <div className="prose max-w-none">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">What Are Cookies</h4>
        <p className="text-gray-700 mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website.
            They allow us to recognize you and remember your preferences.
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Cookies We Use</h4>
        <p className="text-gray-700 mb-4">
            We use a grand total of one cookie! This cookie is required for authentication purposes and does not store any personal information.
        </p>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h4>
        <p className="text-gray-700">
            If you have questions about our use of cookies, please contact us at recallai@gmail.com
        </p>
    </div>
);

// Main Footer Component
const Footer = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalType) => setActiveModal(modalType);
    const closeModal = () => setActiveModal(null);

    return (
        <>
            <footer className={styles.footer.base}>
                {/* Main Footer Content */}
                <div className={styles.footer.main.container}>
                    <div className={styles.footer.main.grid}>
                        {/* Company Section */}
                        <div className={styles.footer.company.wrapper}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className={styles.footer.company.logo.text}>Recall AI</span>
                                    <p className="text-sm font-semibold text-blue-600 mt-1">Your knowledge, amplified!</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.footer.company.social.wrapper}>
                            <a href="https://github.com/Kshitiz-Yadav/RecallAI" target="_blank" className={styles.footer.company.social.link}>
                                <Github className={styles.footer.company.social.icon} />
                            </a>
                            <a href="https://www.instagram.com/_kshitiz.yadav_?igsh=MWV1MHY5aDJvcjlrdA==" target="_blank" className={styles.footer.company.social.link}>
                                <Instagram className={styles.footer.company.social.icon} />
                            </a>
                            <a href="https://www.linkedin.com/in/kshitiz-yadav-35582a21b/" target="_blank" className={styles.footer.company.social.link}>
                                <Linkedin className={styles.footer.company.social.icon} />
                            </a>
                        </div>

                        <div className={styles.footer.section.wrapper}>
                            <h3 className={styles.footer.section.title}>Support</h3>
                            <ul className={styles.footer.section.list}>
                                <li>
                                    <a href="mailto:recallai@gmail.com?subject=Support%20Request&body=Hi%20Recall%20AI%20Team," className={cn(styles.footer.link.base, styles.footer.link.inline)}>
                                        <Mail className="w-4 h-4" />
                                        <span>recallai@gmail.com</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.footer.bottom.wrapper}>
                    <div className={styles.footer.bottom.container}>
                        <div className="flex flex-col items-center space-y-4">
                            <div className={styles.footer.bottom.legal.wrapper}>
                                <button
                                    onClick={() => openModal('privacy')}
                                    className={styles.footer.bottom.legal.link}
                                >
                                    Privacy Policy
                                </button>
                                <button
                                    onClick={() => openModal('terms')}
                                    className={styles.footer.bottom.legal.link}
                                >
                                    Terms of Service
                                </button>
                                <button
                                    onClick={() => openModal('cookies')}
                                    className={styles.footer.bottom.legal.link}
                                >
                                    Cookie Policy
                                </button>
                            </div>

                            <p className={styles.footer.bottom.copyright}>
                                © 2025 Recall AI. Made with <Brain className="inline w-4 h-4 text-blue-600" /> and <Bot className="inline w-4 h-4 text-blue-600" />.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <Modal
                isOpen={activeModal === 'privacy'}
                onClose={closeModal}
                title="Privacy Policy"
            >
                <PrivacyPolicyContent />
            </Modal>

            <Modal
                isOpen={activeModal === 'terms'}
                onClose={closeModal}
                title="Terms of Service"
            >
                <TermsOfServiceContent />
            </Modal>

            <Modal
                isOpen={activeModal === 'cookies'}
                onClose={closeModal}
                title="Cookie Policy"
            >
                <CookiePolicyContent />
            </Modal>
        </>
    );
};

export default Footer;