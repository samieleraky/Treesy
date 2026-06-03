namespace treesy_backend.Models
{
    public class Subscription
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public string StripeSubscriptionId { get; set; } = "";
        public string PlanId { get; set; } = ""; // e.g. "active-planter-monthly"
        public string Billing { get; set; } = ""; // "monthly" | "yearly"
        public string Status { get; set; } = ""; // "active", "canceled", "past_due", etc.
        public DateTime CurrentPeriodEnd { get; set; }
        public DateTime? CancelledAt { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
