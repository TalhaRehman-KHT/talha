import React from "react";
import data from "../../assets/assets.json";

import { Globe, Github } from "lucide-react";

export default function Projects() {
    return (
        <section className="project-section">
            <h2 className="project-title">My Projects</h2>

            <div className="project-grid">
                {data.projects.map((project, index) => (
                    <div key={index} className="project-card">
                        {/* Project Image */}
                        <img
                            src={project.image}
                            alt={project.title}
                            className="project-img"
                        />

                        {/* Content */}
                        <div className="project-content">
                            <h3 className="project-heading">{project.title}</h3>
                            <p className="project-para">{project.description}</p>

                            {/* Links */}
                            <div className="project-links">
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-btn flex items-center gap-2"
                                >
                                    <Globe size={18} /> Visit Site
                                </a>
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-btn flex items-center gap-2"
                                >
                                    <Github size={18} /> GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
