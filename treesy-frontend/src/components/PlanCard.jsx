export default function PlanCard({ plan }) {
    return (
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-sm text-gray-600">
                🌳 {plan.treesPerYear} træer / år
            </p>
            <p className="text-sm text-gray-600">
                🌍 {plan.co2OffsetPercent}% CO₂-offset
            </p>
            <div className="mt-4">
                <p className="text-2xl font-bold">
                    {plan.monthlyPrice} DKK<span className="text-sm font-normal"> / md</span>
                </p>
                <p className="text-sm text-green-700">
                    {plan.yearlyPrice} DKK / år – {plan.discountNote}
                </p>
            </div>
            <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Vælg abonnement
            </button>
        </div>
    );
}
