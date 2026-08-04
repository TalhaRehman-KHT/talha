import React from "react";
import data from "../../assets/assets.json";
import pic from "../../assets/profile.jpg";

export default function About() {
    return (
        <section className="home-section">
            {/* Profile Image */}
            <div className="profile-pic">
                <img
                    src={pic}
                    alt={data.profile.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Text Content */}
            <div className="home-text">
                <h3 className="home-title">{data.profile.name}</h3>

                <span className="home-subtitle">{data.profile.para}</span>

                <p className="home-para">{data.profile.p}</p>

                {/* Skills Section */}
                <div className="p-4">
                    <h2 className="text-3xl">Skills</h2>
                </div>
                <div className="skills-container">

                    {data.skills.map((skill, index) => (
                        <span key={index} className="skill-badge">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
