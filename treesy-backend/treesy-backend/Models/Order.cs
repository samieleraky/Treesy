namespace treesy_backend.Models
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public string? StripePaymentIntentId { get; set; } // For one-time purchases, this will be the PaymentIntent ID. For subscriptions, this can be null.
        public string StripeSessionId { get; set; } = ""; // Store the Stripe Session ID for reference
        public string PlanId { get; set; } = ""; // e.g. "active-planter-monthly"
        public int Trees { get; set; }
        public decimal AmountDkk { get; set; }
        public string Status { get; set; } = ""; // "pending", "completed", "failed", etc.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
