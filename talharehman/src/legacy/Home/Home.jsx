import React from "react";
import data from "../../assets/assets.json";
import pic from "../../assets/profile.jpg";

export default function Home() {
    return (
        <>
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

                    {/* Hire Me Button */}
                    <a
                        href="mailto:talhakhank51@gmail.com"
                        className="btn-hire"
                    >
                        Hire Me
                    </a>
                </div>
            </section>
        </>
    );
}
