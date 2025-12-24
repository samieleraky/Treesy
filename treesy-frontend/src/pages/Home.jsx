import { plans } from "../data/plans.jsx";
import PlanCard from "../components/PlanCard.jsx";

export default function Home() {
    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Hero */}
            <section className="text-center py-16">
                <h1 className="text-4xl font-bold mb-4">
                    Plant træer. Reducér CO₂.
                </h1>
                <p className="text-lg text-gray-600">
                    Et abonnement der gør en reel forskel – hver måned.
                </p>
            </section>

            {/* Plans */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </section>
        </div>
    );
}


