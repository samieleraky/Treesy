import { useEffect, useState } from "react";
import PlanCard from "../components/PlanCard";

export default function Home() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5106/api/plans")
            .then(res => {
                if (!res.ok) {
                    throw new Error("Kunne ikke hente abonnementer");
                }
                return res.json();
            })
            .then(data => {
                setPlans(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loader abonnementer...</p>;
    }

    if (error) {
        return (
            <p className="text-center mt-10 text-red-600">
                {error}
            </p>
        );
    }

    return (
        <div>
            {/* Hero */}
            <section className="py-24 bg-green-50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10 px-4">
                    {/* Tekst */}
                    <div className="text-center md:text-left md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6 text-green-800">
                            Plant dig på den rigtige side af historien 🌍
                        </h2>
                        <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
                            Med Treesy gør vi det billigt, nemt og gennemskueligt at blive klimapositiv
                        </p>
                    </div>

                    {/* Billede */}
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="https://usercontent.one/wp/www.nornguest.com/wp-content/uploads/2025/08/IMG_0063-768x1365.jpg?media=1701198767"
                            alt="Treesy inspiration"
                            className="max-h-[500px] w-auto rounded-lg shadow-lg object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Impact */}
            <section id="impact" className="bg-white py-20">
                <div className="max-w-4xl mx-auto text-center grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
                    <div>
                        <h2 className="text-5xl font-bold text-green-700">12.000+</h2>
                        <p className="text-gray-700 mt-2">Træer plantet</p>
                    </div>
                    <div>
                        <h2 className="text-5xl font-bold text-green-700">1.800+</h2>
                        <p className="text-gray-700 mt-2">tons CO₂ reduceret</p>
                    </div>
                    <div>
                        <h2 className="text-5xl font-bold text-green-700">500+</h2>
                        <p className="text-gray-700 mt-2">Engagerede abonnenter</p>
                    </div>
                </div>
            </section>

            {/* Hvordan virker det - detaljer */}
            <section id="how-details" className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-4">

                    <h2 className="text-3xl font-bold text-center mb-14 text-green-800">
                        Hvorfor vælge Treesy?
                    </h2>

                    {/* Top: tekst + billede */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        {/* Tekst */}
                        <div className="space-y-6 text-gray-700 text-lg">
                            <p>
                                Vi planter <strong>manuelt verificerede træer</strong> for dig i Tanzania.
                                Træerne plantes af lønnede lokalsamfund i et dedikeret skovområde.
                            </p>

                            <p>
                                Du modtager løbende opdateringer og billeder fra træplantningen,
                                så du kan følge din impact.
                            </p>

                            <p>
                                For at sikre at træerne overlever, betaler vi en
                                <strong> overlevelsesbonus</strong> til de lokale – først når
                                træerne får lov at vokse.
                            </p>

                            <p>
                                Vi bruger ikke dyre certificeringsbureauer – så du får
                                <strong> maksimal impact for pengene</strong>.
                            </p>
                        </div>

                        {/* Billede */}
                        <div className="flex justify-center md:justify-end">
                            <img
                                src="https://usercontent.one/wp/www.nornguest.com/wp-content/uploads/2025/06/468723202_10161037559831542_6834398910979295964_n-1024x768.jpeg?media=1701198767"
                                alt="Treesy inspiration"
                                className="max-h-[420px] w-full md:w-auto rounded-xl shadow-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-16 border-t"></div>

                    {/* 130 træer */}
                    <div className="bg-white-50 rounded-2xl p-10 max-w-4xl mx-auto text-center shadow-sm">
                        <h3 className="text-2xl font-bold mb-4 text-green-800">
                            Hvorfor netop 130 træer om året?
                        </h3>

                        <p className="mb-8 text-gray-700">
                            Ultra simpel og gennemsigtig model:
                        </p>

                        <div className="space-y-4 text-lg text-gray-700">
                            <p>🌍 13 tons CO₂ pr. dansker</p>
                            <p>🌱 100 kg CO₂ pr. træ</p>
                            <p className="font-semibold text-green-700">
                                ✅ 130 træer = carbon neutral
                            </p>
                        </div>
                    </div>

                </div>
                    </section>
                   



            {/* Hvordan virker det */}
            <section id="how" className="bg-green-50 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-10 text-green-800">
                        Sådan virker Treesy
                    </h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">1️⃣ Vælg abonnement</h3>
                            <p className="text-gray-700">Du vælger det niveau, der passer til dig.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">2️⃣ Vi planter træerne</h3>
                            <p className="text-gray-700">Hver måned sender vi træer ud i verden.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">3️⃣ Du skaber impact</h3>
                            <p className="text-gray-700">Din CO₂-neutralitet bliver konkret.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans */}
            <section className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}



