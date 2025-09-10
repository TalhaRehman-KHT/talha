import React from "react";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";

export default function Contact() {
    return (
        <section className="contact-section">
            <h2 className="contact-title">Get in Touch</h2>

            {/* Social Links */}
            <div className="contact-icons">
                <a
                    href="mailto:talhakhank51@gmail.com"
                    className="contact-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Mail size={24} /> Email
                </a>

                <a
                    href="https://wa.me/03349805663" // replace with your WhatsApp number
                    className="contact-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Phone size={24} /> WhatsApp
                </a>

                <a
                    href="https://www.facebook.com/profile.php?id=100018723467233&sk=map"
                    className="contact-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Facebook size={24} /> Facebook
                </a>

                <a
                    href="https://www.instagram.com/talha__ray/?hl=en"
                    className="contact-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Instagram size={24} /> Instagram
                </a>
            </div>

            {/* Contact Form */}
            <form
                action="https://formsubmit.co/talhakhank51@gmail.com"
                method="POST"
                className="contact-form"
            >
                {/* FormSubmit hidden fields */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value="https://your-portfolio-site.vercel.app/thankyou" />

                <input
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    className="form-input"
                    required
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Enter Short Description"
                    className="form-input"
                    required
                />

                <textarea
                    name="message"
                    placeholder="Enter Your Message"
                    rows="5"
                    className="form-textarea"
                    required
                ></textarea>

                <button type="submit" className="form-btn">
                    Submit
                </button>
            </form>
        </section>
    );
}
