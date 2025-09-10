import profileImg from "../../assets/profile.jpg";
import cert1 from "../../assets/certificate.jpeg";
import cert2 from "../../assets/certificate2.jpeg";

export default function Certificate() {
    const certificates = [cert1, cert2];

    return (
        <>
            <section className="certificate-section">
                <h2 className="certificate-title">My Certificates</h2>

                <div className="certificate-grid">
                    <div className="p-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            {certificates.map((cert, i) => (
                                <img key={i} src={cert} alt={`Certificate ${i + 1}`} className="w-full h-auto rounded-xl shadow-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>




        </>
    );
}
