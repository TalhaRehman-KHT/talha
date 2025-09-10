import React from "react";
import { Home, User, Award, FolderKanban, Mail, Code } from "lucide-react";

export default function Navbar() {
    return (
        <>
            {/* Navbar (visible only on lg and above) */}
            <nav className="nav hidden lg:flex">
                {/* Logo */}
                <ul className="ul">
                    <li>
                        <a className="anker" href="/">
                            <Code size={20} /> Logo
                        </a>
                    </li>
                </ul>

                {/* Menu */}
                <ul className="ul">
                    <li>
                        <a className="anker" href="/">
                            <Home size={18} /> Home
                        </a>
                    </li>
                    <li>
                        <a className="anker" href="/about">
                            <User size={18} /> About Me
                        </a>
                    </li>
                    <li>
                        <a className="anker" href="/certificates">
                            <Award size={18} /> Certificates
                        </a>
                    </li>
                    <li>
                        <a className="anker" href="/projects">
                            <FolderKanban size={18} /> Projects
                        </a>
                    </li>
                    <li>
                        <a className="anker" href="/contacts">
                            <Mail size={18} /> Contact
                        </a>
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
