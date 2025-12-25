import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Checkout() {
    const { planId } = useParams();

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [billing, setBilling] = useState("monthly"); // monthly | yearly

    useEffect(() => {
        fetch("http://localhost:5106/api/plans")
            .then(res => res.json())
            .then(data => {
                const selectedPlan = data.find(p => p.id === planId);
                setPlan(selectedPlan);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [planId]);

    const handlePayment = () => {
        console.log("Starter betaling:", {
            planId: plan.id,
            billing
        });

        // Stripe kommer i uge 3 🚀
    };

    if (loading) {
        return (
            <p className="text-center py-20">
                Loader abonnement...
            </p>
        );
    }

    if (!plan) {
        return (
            <p className="text-center py-20 text-red-600">
                Abonnement ikke fundet
            </p>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-20 px-4 grid md:grid-cols-2 gap-12">

            {/* LEFT: SUMMARY */}
            <div>
                <h1 className="text-3xl font-bold mb-6">
                    Bekræft dit abonnement
                </h1>

                <div className="border rounded-xl p-6 bg-white shadow-sm">
                    <h2 className="text-xl font-semibold mb-1">
                        {plan.name}
                    </h2>

                    <p className="text-sm text-green-700 font-medium mb-4">
                        Et aktivt valg for klimaet 🌍
                    </p>

                    <p className="text-gray-600 mb-2">
                        🌳 {plan.treesPerYear} træer / år
                    </p>

                    <p className="text-gray-600 mb-4">
                        🌍 {plan.co2OffsetPercent}% CO₂-offset
                    </p>

                    {/* BILLING TOGGLE */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setBilling("monthly")}
                            className={`px-4 py-2 rounded-lg text-sm transition ${billing === "monthly"
                                    ? "bg-green-700 text-white"
                                    : "bg-gray-100"
                                }`}
                        >
                            Månedlig
                        </button>

                        <button
                            onClick={() => setBilling("yearly")}
                            className={`px-4 py-2 rounded-lg text-sm transition ${billing === "yearly"
                                    ? "bg-green-700 text-white"
                                    : "bg-gray-100"
                                }`}
                        >
                            Årlig (spar penge)
                        </button>
                    </div>

                    {/* PRICE */}
                    <p className="text-3xl font-bold">
                        {billing === "monthly"
                            ? `${plan.monthlyPrice} DKK`
                            : `${plan.yearlyPrice} DKK`}
                        <span className="text-base font-normal">
                            {billing === "monthly" ? " / md" : " / år"}
                        </span>
                    </p>

                    <p className="text-sm text-green-700 mt-2">
                        {plan.discountNote}
                    </p>
                </div>
            </div>

            {/* RIGHT: ACTION */}
            <div className="bg-green-50 rounded-xl p-8 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Hvad sker der nu?
                    </h3>

                    <ul className="space-y-3 text-gray-700">
                        <li>✔ Abonnement aktiveres efter betaling</li>
                        <li>✔ Kvittering sendes på mail</li>
                        <li>✔ Dokumentation for CO₂ og træer</li>
                        <li>✔ Opsig når som helst</li>
                    </ul>
                </div>

                <div>
                    <button
                        onClick={handlePayment}
                        className="mt-8 w-full bg-green-700 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-800 transition"
                    >
                        Fortsæt til betaling
                    </button>

                    <p className="text-xs text-gray-600 text-center mt-4">
                        Ingen binding • Betaling via Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}
