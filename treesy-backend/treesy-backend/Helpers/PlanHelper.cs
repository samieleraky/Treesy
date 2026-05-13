namespace treesy_backend.Helpers
{
    public static class PlanHelper
    {
        public static string FormatPlanName(string planId) => planId switch
        {
            "active-planter" or "active-planter-seed" => "Active Planter",
            "committed-planter" or "committed-planter-seed" => "Committed Planter",
            "hero-planter" or "hero-planter-seed" => "Hero Planter",
            "legend-planter" or "legend-planter-seed" => "Legend Planter",
            _ => planId
        };

        public static int GetTreesForPlan(string planId) => planId switch
        {
            "active-planter" or "active-planter-seed" => 130,
            "committed-planter" or "committed-planter-seed" => 260,
            "hero-planter" or "hero-planter-seed" => 1300,
            "legend-planter" or "legend-planter-seed" => 13000,
            _ => 0
        };
    }
}
