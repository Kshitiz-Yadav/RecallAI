import { removeCookie } from "../../utils/cookieUtils";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, FileText, MessageCircle, Clock, TrendingUp, LogOut } from 'lucide-react';
import { styles, cn } from '../../styles';
import { useState, useEffect } from 'react';
import RecallAiLogo from '../../../public/RecallAI_Logo.svg';

const Header = ({ isLoggedIn, setAuthStatus }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentRoute, setCurrentRoute] = useState(location.pathname);

    useEffect(() => {
        setCurrentRoute(location.pathname);
    }, [location]);

    const handleLogout = () => {
        removeCookie('recall-token');
        setAuthStatus(false);
        navigate('/auth');
    };

    const handleNavigation = (route) => {
        setCurrentRoute(route);
    };

    // Navigation item styles using styles.js
    const navItemClasses = cn(
        styles.buttons.base,
        styles.buttons.variants.ghost,
        styles.buttons.sizes.sm,
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100 no-underline focus:outline-none focus:ring-0"
    );

    // Active navigation item styles
    const activeNavItemClasses = cn(
        styles.buttons.base,
        styles.buttons.sizes.sm,
        "bg-blue-50 text-blue-700 hover:bg-blue-100 no-underline focus:outline-none focus:ring-0"
    );

    // Logout button styles
    const logoutClasses = cn(
        styles.buttons.base,
        styles.buttons.sizes.sm,
        "text-red-600 hover:text-red-700 hover:bg-red-50 no-underline cursor-pointer focus:outline-none focus:ring-0"
    );

    // Logo button styles
    const logoClasses = cn(
        styles.buttons.base,
        styles.buttons.variants.ghost,
        "p-2 hover:bg-gray-50 no-underline focus:outline-none focus:ring-0"
    );

    const isActive = (route) => currentRoute === route;

    const renderNavItems = () => {
        if (!isLoggedIn) {
            return (
                <>
                    <Link
                        to="/"
                        className={isActive('/') ? activeNavItemClasses : navItemClasses}
                        onClick={() => handleNavigation('/')}
                    >
                        <Home size={16} />
                        <span className="ml-2">Home</span>
                    </Link>
                    <Link
                        to="/auth"
                        className={isActive('/auth') ? activeNavItemClasses : navItemClasses}
                        onClick={() => handleNavigation('/auth')}
                    >
                        <User size={16} />
                        <span className="ml-2">Sign In</span>
                    </Link>
                </>
            );
        }

        return (
            <>
                <Link
                    to="/"
                    className={isActive('/') ? activeNavItemClasses : navItemClasses}
                    onClick={() => handleNavigation('/')}
                >
                    <Home size={16} />
                    <span className="ml-2 hidden sm:inline">Home</span>
                </Link>
                <Link
                    to="/chat"
                    className={isActive('/chat') ? activeNavItemClasses : navItemClasses}
                    onClick={() => handleNavigation('/chat')}
                >
                    <MessageCircle size={16} />
                    <span className="ml-2 hidden sm:inline">Chat</span>
                </Link>
                <Link
                    to="/files"
                    className={isActive('/files') ? activeNavItemClasses : navItemClasses}
                    onClick={() => handleNavigation('/files')}
                >
                    <FileText size={16} />
                    <span className="ml-2 hidden sm:inline">Files</span>
                </Link>
                <Link
                    to="/history"
                    className={isActive('/history') ? activeNavItemClasses : navItemClasses}
                    onClick={() => handleNavigation('/history')}
                >
                    <Clock size={16} />
                    <span className="ml-2 hidden sm:inline">History</span>
                </Link>
                <Link
                    to="/usage"
                    className={isActive('/usage') ? activeNavItemClasses : navItemClasses}
                    onClick={() => handleNavigation('/usage')}
                >
                    <TrendingUp size={16} />
                    <span className="ml-2 hidden sm:inline">Usage</span>
                </Link>
                <button
                    className={logoutClasses}
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span className="ml-2 hidden sm:inline">Logout</span>
                </button>
            </>
        );
    };

    return (
        <header className={styles.navigation.header.base}>
            <div className={cn(styles.spacing.content, "py-0")}>
                <div className={styles.navigation.header.container}>
                    {/* Logo */}
                    <Link
                        to="/"
                        className={logoClasses}
                        onClick={() => handleNavigation('/')}
                    >
                        <div className={styles.navigation.header.logo.wrapper}>
                            <div className={styles.navigation.header.logo.icon}>
                                <img src={RecallAiLogo} alt="Logo" />
                            </div>
                            <span className={styles.navigation.header.logo.text}>Recall AI</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className={styles.navigation.header.nav.container}>
                        {renderNavItems()}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;