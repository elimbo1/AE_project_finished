import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    function onLogoutHandler() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className="navbar">
            <button className="navbar-button" onClick={() => navigate('/')}>Product</button>
            <button className="navbar-button" onClick={() => navigate('/cart')}>Cart</button>
            <button className="navbar-button" onClick={onLogoutHandler}>Logout</button>
        </div>
    );
}

export default Navbar;