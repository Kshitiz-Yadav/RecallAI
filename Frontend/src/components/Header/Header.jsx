import { removeCookie } from "../../utils/cookieUtils";
import { Link } from 'react-router-dom';

const Header = () => {
    const handleLogout = () => {
        removeCookie('recall-token');
    };
    
    // Update to show signin and logout conditionally
    return (
        <header className="bg-gray-800 text-white p-4">
            <h1 className="text-2xl">RecallAI</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/auth">Sign In</Link></li>
                    <li><Link to="/home" onClick={handleLogout}>Logout</Link></li>
                    <li><Link to="/chathistory">Chat History</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;