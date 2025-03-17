import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">שיתוף כשרונות</div>
                <nav className="nav-links">
                    <Link to="/">בית</Link>
                    <Link to="/about">אודות</Link>
                    <Link to="/talents">כשרונות</Link>
                    <Link to="/profile">הפרופיל שלי</Link>
                    <Link to="/login">התחברות</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
