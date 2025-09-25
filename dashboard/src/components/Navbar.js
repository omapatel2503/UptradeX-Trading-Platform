import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: "#fff", height: "70px" }}>
            <div className="container p-2">
                <Link className="navbar-brand" to={"/"}>
                    <img src='/logo.svg' alt='Zerodha Logo' style={{ width: "120px", height: "auto" }} />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarScroll"
                    aria-controls="navbarScroll"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ "--bs-scroll-height": "100px" }}>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/signup"}>Signup</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/login"}>Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/dashboard"}>Dashboard</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
