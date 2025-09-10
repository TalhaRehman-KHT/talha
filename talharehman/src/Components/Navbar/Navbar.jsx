import React from "react";
import { Link } from "react-router-dom";
import { Home, User, Award, FolderKanban, Mail, Code } from "lucide-react";

export default function Navbar() {
    return (
        <>
            {/* Navbar (visible only on lg and above) */}
            <nav className="nav hidden lg:flex">
                {/* Logo */}
                <ul className="ul">
                    <li>
                        <Link className="anker" to="/about">
                            <User size={20} /> About Me
                        </Link>
                    </li>
                </ul>

                {/* Menu */}
                <ul className="ul">
                    <li>
                        <Link className="anker" to="/">
                            <Home size={18} /> Home
                        </Link>
                    </li>
                    <li>
                        <Link className="anker" to="/about">
                            <User size={18} /> About Me
                        </Link>
                    </li>
                    <li>
                        <Link className="anker" to="/certificates">
                            <Award size={18} /> Certificates
                        </Link>
                    </li>
                    <li>
                        <Link className="anker" to="/projects">
                            <FolderKanban size={18} /> Projects
                        </Link>
                    </li>
                    <li>
                        <Link className="anker" to="/contacts">
                            <Mail size={18} /> Contact
                        </Link>
                    </li>
                </ul>
                <ul className="ul">
                    <li></li>
                </ul>
            </nav>

            {/* Footer (visible only on small screens) */}
            <footer className="footer">
                <a className="anker" href="/">
                    <Home size={22} />
                </a>
                <a className="anker" href="/about">
                    <User size={22} />
                </a>
                <a className="anker" href="/certificates">
                    <Award size={22} />
                </a>
                <a className="anker" href="/projects">
                    <FolderKanban size={22} />
                </a>
                <a className="anker" href="/contacts">
                    <Mail size={22} />
                </a>
            </footer>
        </>
    );
}
