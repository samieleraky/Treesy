namespace treesy_backend.Helpers
{
    public static class PlanHelper //Helper klasse som indeholder metoder til at formatere plan-navne og hente antal træer for en given plan. Dette gør det nemmere at håndtere forskellige plan-id'er og deres tilhørende data på en centraliseret måde.
    {
        public static string FormatPlanName(string planId) => planId switch //switch bruges til at matche planId mod forskellige cases og returnere en formateret plan-navn baseret på det. Det gør det nemt at håndtere både "active-planter" og "active-planter-seed" som "Active Planter", og så videre for de andre planer. Hvis planId ikke matcher nogen af de specificerede cases, returneres planId som det er.
        {
            "active-planter" or "active-planter-seed" => "Active Planter", // Active planter og active planter seed begge formateres til "Active Planter"
            "committed-planter" or "committed-planter-seed" => "Committed Planter",
            "hero-planter" or "hero-planter-seed" => "Hero Planter",
            "legend-planter" or "legend-planter-seed" => "Legend Planter",
            _ => planId
        };

        public static int GetTreesForPlan(string planId) => planId switch
        {
            "active-planter" or "active-planter-seed" => 130, //active -planter og active-planter-seed begge har 130 træer, committed-planter og committed-planter-seed begge har 260 træer osv. Dette gør det nemt at hente det korrekte antal træer for en given planId, uanset om det er en seed-version eller ej.
            "committed-planter" or "committed-planter-seed" => 260,
            "hero-planter" or "hero-planter-seed" => 1300,
            "legend-planter" or "legend-planter-seed" => 13000,
            _ => 0
        };
    }
}
