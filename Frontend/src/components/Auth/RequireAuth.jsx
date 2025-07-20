import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/cookieUtils";

const RequireAuth = () => {
    const token = getCookie('recall-token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default RequireAuth;